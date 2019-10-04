/**
 * Copyright 2019 ForgeRock AS. All Rights Reserved
 *
 * Use of this code requires a commercial software license with ForgeRock AS.
 * or with one of its affiliates. All use shall be exclusively subject
 * to such license between the licensee and ForgeRock AS.
 */
package com.forgerock.openbanking.directory.service;

import com.forgerock.cert.Psd2CertInfo;
import com.forgerock.cert.exception.InvalidPsd2EidasCertificate;
import com.forgerock.cert.exception.NoSuchRDNInField;
import com.forgerock.cert.psd2.Psd2QcStatement;
import com.forgerock.cert.psd2.Psd2Role;
import com.forgerock.cert.psd2.RoleOfPsp;
import com.forgerock.cert.psd2.RolesOfPsp;
import com.forgerock.cert.utils.CertificateUtils;
import com.forgerock.openbanking.core.services.ApplicationApiClient;
import com.forgerock.openbanking.directory.config.OpenBankingDirectoryConfiguration;
import com.forgerock.openbanking.directory.ocsp.OCSPValidationException;
import com.forgerock.openbanking.directory.ocsp.OCSPValidator;
import com.forgerock.openbanking.directory.repository.SoftwareStatementRepository;
import com.forgerock.openbanking.model.ApplicationIdentity;
import com.forgerock.openbanking.model.OBRIRole;
import com.forgerock.openbanking.model.SoftwareStatement;
import com.forgerock.openbanking.model.SoftwareStatementRole;
import com.nimbusds.jose.jwk.JWK;
import lombok.extern.slf4j.Slf4j;
import org.bouncycastle.asn1.x500.RDN;
import org.bouncycastle.asn1.x500.X500Name;
import org.bouncycastle.asn1.x500.style.BCStyle;
import org.bouncycastle.asn1.x500.style.IETFUtils;
import org.bouncycastle.cert.jcajce.JcaX509CertificateHolder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.security.cert.CertificateEncodingException;
import java.security.cert.CertificateException;
import java.security.cert.CertificateFactory;
import java.security.cert.X509Certificate;
import java.text.ParseException;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Slf4j
@Service
public class DirectoryUtilsService {

    //private static final Logger LOGGER = LoggerFactory.getLogger(DirectoryService.class);

    public Resource obRootCertificatePem;
    public Resource obIssuingCertificatePem;
    public Resource obMitRootCertificatePem;
    public Resource obMitIssuingCertificatePem;

    private ApplicationApiClient applicationApiClient;
    private SoftwareStatementRepository softwareStatementRepository;
    private OpenBankingDirectoryConfiguration openBankingDirectoryConfiguration;
    private OCSPValidator ocspValidator;

    /**
     * Constructor
     * @param applicationApiClient
     * @param softwareStatementRepository
     * @param openBankingDirectoryConfiguration
     * @param ocspValidator
     * @param obRootCertificatePem
     * @param obIssuingCertificatePem
     * @param obMitRootCertificatePem
     * @param obMitIssuingCertificatePem
     */
    @Autowired
    public DirectoryUtilsService(ApplicationApiClient applicationApiClient,
                                 SoftwareStatementRepository softwareStatementRepository,
                                 OpenBankingDirectoryConfiguration openBankingDirectoryConfiguration,
                                 OCSPValidator ocspValidator,
                                 @Value("${openbankingdirectory.certificates.ob.root}") Resource obRootCertificatePem,
                                 @Value("${openbankingdirectory.certificates.ob.issuing}") Resource obIssuingCertificatePem,
                                 @Value("${openbankingdirectory.mit.certificates.ob.root}") Resource obMitRootCertificatePem,
                                 @Value("${openbankingdirectory.mit.certificates.ob.issuing}") Resource obMitIssuingCertificatePem){
        this.applicationApiClient = applicationApiClient;
        this.softwareStatementRepository = softwareStatementRepository;
        this.openBankingDirectoryConfiguration = openBankingDirectoryConfiguration;
        this.ocspValidator = ocspValidator;
        this.obRootCertificatePem = obRootCertificatePem;
        this.obIssuingCertificatePem = obIssuingCertificatePem;
        this.obMitRootCertificatePem = obMitRootCertificatePem;
        this.obMitIssuingCertificatePem = obMitIssuingCertificatePem;
    }

    private X509Certificate obRootCert;
    private X509Certificate obIssuingCert;
    private X509Certificate obMitRootCert;
    private X509Certificate obMitIssuingCert;


    public ApplicationIdentity authenticate(String jwkSerialized) throws ParseException, CertificateException {
        return authenticate(JWK.parse(jwkSerialized));
    }


    public ApplicationIdentity authenticate(JWK jwk) throws CertificateException {

        if (obRootCert == null || obIssuingCert == null) {
            try {
                loadOBCertificates();
            } catch (CertificateException | IOException e) {
                log.error("Can't load OB certificates", e);
                throw new RuntimeException(e);
            }
        }

        X509Certificate[] certs = new X509Certificate[jwk.getX509CertChain().size()];
        for (int i = 0; i < jwk.getX509CertChain().size(); i++) {
            certs[i] = CertificateUtils.decodeCertificate(jwk.getX509CertChain().get(i).decode());
        }
        Optional<ApplicationIdentity> obApplicationIdentity = verifyWithOBDirectory(certs, obIssuingCert, obRootCert);
        if (obApplicationIdentity.isPresent()) {
            return obApplicationIdentity.get();
        }

        if (openBankingDirectoryConfiguration.mitEnabled) {
            obApplicationIdentity = verifyWithOBDirectory(certs, obMitIssuingCert, obMitRootCert);
            if (obApplicationIdentity.isPresent()) {
                return obApplicationIdentity.get();
            }
        }

        ApplicationIdentity identityFromJwkms = applicationApiClient.authenticate(jwk);

        try {
            X509Certificate cert = certs[0];
            Psd2CertInfo psd2Info = new Psd2CertInfo(certs);
            if (psd2Info.isPsd2Cert()) {
                log.debug("Certificate {} is a Psd2 eIDAS certificate", cert.getSubjectDN().getName());
                String orgId = CertificateUtils.getOrganisationIdentifier(cert);
                String applicationId = psd2Info.getApplicationId();
                String softwareId = orgId + "-" + applicationId;

                // Get the roles from the PSD2 QcStatement
                Optional<Psd2QcStatement> psd2QcStatementOpt = psd2Info.getPsd2QCStatement();
                if(psd2QcStatementOpt.isPresent()){
                    Psd2QcStatement psd2QcStatement = psd2QcStatementOpt.get();
                    RolesOfPsp roles = psd2QcStatement.getRoles();
                    Set<RoleOfPsp> roleSet = roles.getRolesOfPsp();
                    for(RoleOfPsp role : roleSet){
                        Psd2Role psd2Role = role.getRole();
                        Optional<SoftwareStatementRole> ssRoleObj = SoftwareStatementRole.getSSRole(psd2Role);
                        if(ssRoleObj.isPresent()){
                            OBRIRole obriRole = OBRIRole.fromSoftwareStatementType(ssRoleObj.get());
                            identityFromJwkms.getRoles().add(obriRole);
                        }
                    }
                    identityFromJwkms.getRoles().add(OBRIRole.ROLE_EIDAS);
                    if(OBRIRole.isTpp(identityFromJwkms.getRoles())) {
                        identityFromJwkms.getRoles().add(OBRIRole.ROLE_SOFTWARE_STATEMENT);
                    }

                    if (identityFromJwkms.getRoles().contains(OBRIRole.ROLE_ANONYMOUS)) {
                        //its an eIDAS issued from another CA than us
                        identityFromJwkms.getRoles().remove(OBRIRole.ROLE_ANONYMOUS);
                        return new ApplicationIdentity(softwareId,
                                identityFromJwkms.getRoles(),
                                ApplicationIdentity.DirectorySrc.EXTERNAL_EIDAS);
                    }

                    log.debug("Returning Application Identity with softwareId and roles obtained from the PSD2 eIdas " +
                            "certificate. {}", cert.getSubjectDN().getName());
                } else {
                    log.error("Certificate says it is PSD2 cert, but has no psd2QCStatement! {}", cert.getSubjectDN().getName());
                }
            }
        } catch ( InvalidPsd2EidasCertificate | NoSuchRDNInField e) {
            log.error("Failed to understand eidas certificate.", e);
            e.printStackTrace();
        }


        if (identityFromJwkms.getRoles().contains(OBRIRole.ROLE_ANONYMOUS)) {
            return identityFromJwkms;
        }
        List<SoftwareStatement> byApplicationId = softwareStatementRepository.findByApplicationId(identityFromJwkms.getId());
        if (byApplicationId.isEmpty() || byApplicationId.size() > 1) {
            return identityFromJwkms;
        } else {
            SoftwareStatement softwareStatement = byApplicationId.get(0);
            identityFromJwkms.getRoles().add(OBRIRole.ROLE_SOFTWARE_STATEMENT);
            identityFromJwkms.getRoles().add(OBRIRole.ROLE_FORGEROCK_EXTERNAL_APP);
            for (SoftwareStatementRole role : softwareStatement.getRoles()) {
                identityFromJwkms.getRoles().add(OBRIRole.fromSoftwareStatementType(role));
            }
            return new ApplicationIdentity(softwareStatement.getId(),
                    identityFromJwkms.getRoles(),
                    ApplicationIdentity.DirectorySrc.FORGEROCK);
        }

    }

    private Optional<ApplicationIdentity> verifyWithOBDirectory(X509Certificate[] certs, X509Certificate obIssuingCert, X509Certificate obRootCert) throws CertificateEncodingException {
        if ( (certs.length > 2 && obIssuingCert.equals(certs[1]) && obRootCert.equals(certs[2]))
                || (certs.length < 2 &&
                certs[0].getIssuerX500Principal().equals(obIssuingCert.getSubjectX500Principal()))
                ) {

            try {
                ocspValidator.validate(certs[0], obIssuingCert, openBankingDirectoryConfiguration.ocsp);
            } catch (OCSPValidationException e) {
                log.error("Certificate has been revoked.", e);
            }
            X500Name x500name =  new JcaX509CertificateHolder(certs[0]).getSubject();
            RDN cn = x500name.getRDNs(BCStyle.CN)[0];

            String softwareId =  IETFUtils.valueToString(cn.getFirst().getValue());
            return Optional.of(new ApplicationIdentity(softwareId, OBRIRole.ROLE_SOFTWARE_STATEMENT, ApplicationIdentity.DirectorySrc.OPEN_BANKING));
        }
        return Optional.empty();
    }

    private void loadOBCertificates() throws CertificateException, IOException {
        CertificateFactory fact = CertificateFactory.getInstance("X.509");
        InputStream rootCertStream = null;
        InputStream issuingCertStream = null;
        InputStream mitRootCertStream = null;
        InputStream mitIssuingCertStream = null;
        try {
            rootCertStream = obRootCertificatePem.getURL().openStream();
            obRootCert = (X509Certificate) fact.generateCertificate(rootCertStream);

            issuingCertStream = obIssuingCertificatePem.getURL().openStream();
            obIssuingCert = (X509Certificate) fact.generateCertificate(issuingCertStream);

            mitRootCertStream = obMitRootCertificatePem.getURL().openStream();
            obMitRootCert = (X509Certificate) fact.generateCertificate(mitRootCertStream);

            mitIssuingCertStream = obMitIssuingCertificatePem.getURL().openStream();
            obMitIssuingCert = (X509Certificate) fact.generateCertificate(mitIssuingCertStream);
        } finally {
            if (rootCertStream != null) {
                rootCertStream.close();
            }
            if (issuingCertStream != null) {
                issuingCertStream.close();
            }
            if (mitRootCertStream != null) {
                mitRootCertStream.close();
            }
            if (mitIssuingCertStream != null) {
                mitIssuingCertStream.close();
            }
        }
    }
}
