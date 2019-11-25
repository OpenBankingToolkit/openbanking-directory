/**
 * Copyright 2019 ForgeRock AS.
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
package com.forgerock.openbanking.directory.api.softwarestatement;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.forgerock.cert.eidas.EidasInformation;
import com.forgerock.cert.psd2.Psd2Role;
import com.forgerock.cert.utils.CertificateConfiguration;
import com.forgerock.cert.utils.CertificateUtils;
import com.forgerock.openbanking.analytics.model.entries.DirectoryCounterType;
import com.forgerock.openbanking.analytics.services.DirectoryCountersKPIService;
import com.forgerock.openbanking.constants.OIDCConstants;
import com.forgerock.openbanking.constants.OpenBankingConstants;
import com.forgerock.openbanking.core.model.Application;
import com.forgerock.openbanking.core.services.ApplicationApiClient;
import com.forgerock.openbanking.directory.config.Aspsp;
import com.forgerock.openbanking.directory.model.Organisation;
import com.forgerock.openbanking.directory.model.SSA;
import com.forgerock.openbanking.directory.model.DirectoryUser;
import com.forgerock.openbanking.directory.repository.AspspRepository;
import com.forgerock.openbanking.directory.repository.OrganisationRepository;
import com.forgerock.openbanking.directory.repository.SoftwareStatementRepository;
import com.forgerock.openbanking.directory.repository.DirectoryUserRepository;
import com.forgerock.openbanking.directory.service.ASDiscoveryService;
import com.forgerock.openbanking.directory.service.OIDCDiscoveryResponse;
import com.forgerock.openbanking.directory.service.SSAService;
import com.forgerock.openbanking.jwt.services.CryptoApiClient;
import com.forgerock.openbanking.model.OBRIRole;
import com.forgerock.openbanking.model.SoftwareStatement;
import com.forgerock.openbanking.model.SoftwareStatementRole;
import com.forgerock.openbanking.model.oidc.OIDCRegistrationRequest;
import com.forgerock.openbanking.ssl.config.SslConfiguration;
import com.forgerock.openbanking.ssl.exceptions.SslConfigurationFailure;
import com.forgerock.openbanking.ssl.services.keystore.KeyStoreService;
import com.nimbusds.jose.EncryptionMethod;
import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.JWEAlgorithm;
import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.jwk.AsymmetricJWK;
import com.nimbusds.jose.jwk.JWK;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import io.swagger.annotations.ApiParam;
import org.joda.time.Duration;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;

import java.security.KeyStoreException;
import java.security.cert.Certificate;
import java.security.cert.CertificateException;
import java.text.ParseException;
import java.util.Arrays;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

import static com.forgerock.openbanking.constants.OpenBankingConstants.SSAClaims.SOFTWARE_ID;


@RestController
public class SoftwareStatementApiController implements SoftwareStatementApi {
    private static final Logger LOGGER = LoggerFactory.getLogger(SoftwareStatementApiController.class);

    private static final String CURRENT_SOFTWARE_STATEMENT_ID = "current";
    // eIDAS certs are expected to have an subject Organization Identifier with Legal Person Semantics as defined in
    // https://www.etsi.org/deliver/etsi_ts/119400_119499/11941201/01.02.01_60/ts_11941201v010201p.pdf

    // TODO - get this from config
    private static String LEGAL_PERSON_SEMANTICS_TYPE_COUNTRY_PREPEND = "PSDGB-";
    private static final String NATIONAL_COMPETENT_AUTHORITY_NAME = "ForgeRock Financial Authority";
    private static final String NATIONAL_COMPETENT_AUTHORITY_ACRONYM = "FFA";
    private static final String NATIONAL_COMPETENT_AUTHORITY_ID =
            LEGAL_PERSON_SEMANTICS_TYPE_COUNTRY_PREPEND.substring(3) + NATIONAL_COMPETENT_AUTHORITY_ACRONYM;

    @Autowired
    private SoftwareStatementRepository softwareStatementRepository;
    @Autowired
    private DirectoryUserRepository directoryUserRepository;
    @Autowired
    private OrganisationRepository organisationRepository;
    @Autowired
    private AspspRepository aspspRepository;
    @Autowired
    private ApplicationApiClient applicationApiClient;
    @Autowired
    private CryptoApiClient cryptoApiClient;
    @Autowired
    private SSAService ssaService;
    @Autowired
    private AspspApiClient aspspApiClient;
    @Autowired
    private KeyStoreService keyStoreService;
    @Autowired
    private SslConfiguration sslConfiguration;
    @Autowired
    private ASDiscoveryService asDiscoveryService;
    @Autowired
    private ObjectMapper objectMapper;
    @Value("${forgerockdirectory.jwks_uri}")
    public String jwksUri;
    @Autowired
    private DirectoryCountersKPIService directoryCountersKPIService;
    private OnBehalfApplicationRestTemplate restTemplate;

    @Override
    @RequestMapping(value = "/", method = RequestMethod.GET)
    public ResponseEntity<List<SoftwareStatement>> getAllSoftwareStatement(
    ) {
        return ResponseEntity.ok(softwareStatementRepository.findAll());
    }

    @Override
    @RequestMapping(value = "/", method = RequestMethod.POST)
    public ResponseEntity create(
            @RequestBody SoftwareStatement softwareStatement,
            Authentication authentication) {

        // Check user exists
        Optional<DirectoryUser> isUser = directoryUserRepository.findById(authentication.getName());
        if (isUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authorised");
        }
        //Create software statement
        softwareStatement = softwareStatementRepository.save(softwareStatement);

        //Add it to the organisation
        DirectoryUser directoryUser = isUser.get();
        Optional<Organisation> isOrganisation = organisationRepository.findById(directoryUser.getOrganisationId());
        if (isOrganisation.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Organisation not found");
        }
        Organisation organisation = isOrganisation.get();
        organisation.getSoftwareStatementIds().add(softwareStatement.getId());
        organisationRepository.save(organisation);

        //Create the JWK MS application
        CertificateConfiguration certificateConfiguration = new CertificateConfiguration();
        certificateConfiguration.setCn(softwareStatement.getId());
        certificateConfiguration.setOu(organisation.getId());
        certificateConfiguration.setOi(LEGAL_PERSON_SEMANTICS_TYPE_COUNTRY_PREPEND
                + NATIONAL_COMPETENT_AUTHORITY_ACRONYM + '-' + organisation.getId());

        EidasInformation eidasInfo = new EidasInformation();
        Set<SoftwareStatementRole> tppRoles = softwareStatement.getRoles();
        for(SoftwareStatementRole role : tppRoles){
            try{
                Optional<Psd2Role> psd2Role = role.getPsd2Role();
                psd2Role.ifPresent(eidasInfo::addRole);
            } catch (IllegalArgumentException e ){
                LOGGER.error("Failed to get Psd2Role.", e);
            }
        }
        eidasInfo.setOrganisationId(organisation.getId());
        eidasInfo.setCaIssuerCertURL(this.jwksUri);
        eidasInfo.setOcspUri(this.jwksUri);

        // Set the information about the Competent Authority under which the PSP is registered. For example it may be
        // that a German Bank has a QCSeal issued by PrimeSign GmbH. Here we're just going to say the ForgeRock Fake
        // Banks have signed it.
        eidasInfo.setNcaName(NATIONAL_COMPETENT_AUTHORITY_NAME);
        eidasInfo.setNcaId(NATIONAL_COMPETENT_AUTHORITY_ID);
        certificateConfiguration.setEidasInfo(eidasInfo);

        Application applicationRequest = new Application();

        applicationRequest.setDefaultSigningAlgorithm(JWSAlgorithm.PS256);
        applicationRequest.setDefaultEncryptionAlgorithm(JWEAlgorithm.RSA_OAEP_256);
        applicationRequest.setDefaultEncryptionMethod(EncryptionMethod.A128CBC_HS256);
        applicationRequest.setDefaultTransportSigningAlgorithm(JWSAlgorithm.PS256);
        applicationRequest.setExpirationWindow(Duration.standardHours(2));
        applicationRequest.setCertificateConfiguration(certificateConfiguration);
        Application application = applicationApiClient.createApplication(applicationRequest);

        softwareStatement.setApplicationId(application.getIssuerId());

        directoryCountersKPIService.incrementTokenUsage(DirectoryCounterType.SOFTWARE_STATEMENT_REGISTERED);
        return ResponseEntity.status(HttpStatus.CREATED).body(softwareStatementRepository.save(softwareStatement));
    }

    @Override
    @RequestMapping(value = "/{softwareStatementId}", method = RequestMethod.GET)
    public ResponseEntity read(
            @PathVariable String softwareStatementId,
            Authentication authentication) {
        User userDetails = (User) authentication.getPrincipal();

        LOGGER.debug("Read Software statement '{}'", softwareStatementId);
        if (CURRENT_SOFTWARE_STATEMENT_ID.equals(softwareStatementId)
                && userDetails.getAuthorities().contains(OBRIRole.ROLE_SOFTWARE_STATEMENT)) {
            softwareStatementId = authentication.getName();
        }
        Optional<SoftwareStatement> isSoftwareStatement = softwareStatementRepository.findById(softwareStatementId);
        if (isSoftwareStatement.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Software statement not found");
        }
        isAllowed(authentication, softwareStatementId);

        SoftwareStatement softwareStatement = isSoftwareStatement.get();
        return ResponseEntity.ok(softwareStatement);
    }

    @Override
    @RequestMapping(value = "/{softwareStatementId}", method = RequestMethod.PUT)
    public ResponseEntity<SoftwareStatement> update(
            @PathVariable String softwareStatementId,
            @RequestBody SoftwareStatement softwareStatement,
            Authentication authentication) {
        LOGGER.debug("Update Software statement '{}'", softwareStatementId);

        isAllowed(authentication, softwareStatementId);

        return ResponseEntity.ok(softwareStatementRepository.save(softwareStatement));
    }

    @Override
    @RequestMapping(value = "/{softwareStatementId}", method = RequestMethod.DELETE)
    public ResponseEntity delete(
            @PathVariable String softwareStatementId,
            Authentication authentication) {
        LOGGER.debug("Delete Software statement '{}'", softwareStatementId);

        isAllowed(authentication, softwareStatementId);
        Optional<SoftwareStatement> byId = softwareStatementRepository.findById(softwareStatementId);
        if (byId.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Software statement '" + softwareStatementId + "' not found");
        }

        String applicationId = byId.get().getApplicationId();
        applicationApiClient.deleteApplication(applicationId);
        softwareStatementRepository.deleteById(softwareStatementId);
        return ResponseEntity.ok("");
    }

    @Override
    @RequestMapping(value = "/{softwareStatementId}/application", method = RequestMethod.GET)
    public ResponseEntity getApplication(
            @PathVariable String softwareStatementId,
            Authentication authentication) {
        LOGGER.debug("Read Software statement application '{}'", softwareStatementId);

        isAllowed(authentication, softwareStatementId);

        Optional<SoftwareStatement> isSoftwareStatement = softwareStatementRepository.findById(softwareStatementId);
        if (isSoftwareStatement.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Software statement not found");
        }
        SoftwareStatement softwareStatement = isSoftwareStatement.get();

        return ResponseEntity.ok(applicationApiClient.getApplication(softwareStatement.getApplicationId()));
    }

    @RequestMapping(value = "/{softwareStatementId}/application/transport/jwk_uri", method = RequestMethod.GET)
    public ResponseEntity transportKeysJwkUri(
            @PathVariable String softwareStatementId,
            Authentication authentication) {
        LOGGER.debug("Read Software statement jwkuri '{}'", softwareStatementId);

        Optional<SoftwareStatement> isSoftwareStatement = softwareStatementRepository.findById(softwareStatementId);
        if (isSoftwareStatement.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Software statement not found");
        }
        SoftwareStatement softwareStatement = isSoftwareStatement.get();
        return ResponseEntity.ok(applicationApiClient.transportKeysJwkUri(softwareStatement.getApplicationId()));
    }


    @RequestMapping(value = "/{softwareStatementId}/application/transport/rotate", method = RequestMethod.PUT)
    public ResponseEntity rotateTransportKeys(
            @PathVariable String softwareStatementId,
            Authentication authentication) {
        LOGGER.debug("Rotate transport keys for Software statement '{}'", softwareStatementId);

        isAllowed(authentication, softwareStatementId);
        Optional<SoftwareStatement> isSoftwareStatement = softwareStatementRepository.findById(softwareStatementId);
        if (isSoftwareStatement.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Software statement not found");
        }
        SoftwareStatement softwareStatement = isSoftwareStatement.get();
        return ResponseEntity.ok(applicationApiClient.transportKeysRotate(softwareStatement.getApplicationId()));
    }

    @RequestMapping(value = "/{softwareStatementId}/application/transport/reset", method = RequestMethod.PUT)
    public ResponseEntity resetTransportKeys(
            @PathVariable String softwareStatementId,
            Authentication authentication) {
        LOGGER.debug("Software statement '{}' is resetting its key", softwareStatementId);
        isAllowed(authentication, softwareStatementId);
        Optional<SoftwareStatement> isSoftwareStatement = softwareStatementRepository.findById(softwareStatementId);
        if (isSoftwareStatement.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Software statement not found");
        }
        SoftwareStatement softwareStatement = isSoftwareStatement.get();
        return ResponseEntity.ok(applicationApiClient.transportKeysReset(softwareStatement.getApplicationId()));
    }


    @RequestMapping(value = "/{softwareStatementId}/application/jwk_uri", method = RequestMethod.GET)
    public ResponseEntity signingEncryptionKeysJwkUri(
            @PathVariable String softwareStatementId,
            Authentication authentication) {
        LOGGER.debug("Get Software statement jwkuri for sig/enc keys '{}'", softwareStatementId);

        Optional<SoftwareStatement> isSoftwareStatement = softwareStatementRepository.findById(softwareStatementId);
        if (isSoftwareStatement.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Software statement not found");
        }
        SoftwareStatement softwareStatement = isSoftwareStatement.get();
        return ResponseEntity.ok(applicationApiClient.signingEncryptionKeysJwkUri(softwareStatement.getApplicationId()));
    }


    @RequestMapping(value = "/{softwareStatementId}/application/rotate", method = RequestMethod.PUT)
    public ResponseEntity rotateSigningEncryptionKeys(
            @PathVariable String softwareStatementId,
            Authentication authentication) {
        isAllowed(authentication, softwareStatementId);
        LOGGER.debug("Rotate Software statement sign/enc keys '{}'", softwareStatementId);

        Optional<SoftwareStatement> isSoftwareStatement = softwareStatementRepository.findById(softwareStatementId);
        if (isSoftwareStatement.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Software statement not found");
        }
        SoftwareStatement softwareStatement = isSoftwareStatement.get();
        return ResponseEntity.ok(applicationApiClient.signingEncryptionKeysRotate(softwareStatement.getApplicationId()));
    }

    @RequestMapping(value = "/{softwareStatementId}/application/reset", method = RequestMethod.PUT)
    public ResponseEntity resetSigningEncryptionKeys(
            @PathVariable String softwareStatementId,
            Authentication authentication) {
        isAllowed(authentication, softwareStatementId);
        LOGGER.debug("Reset Software statement sign/enc keys '{}'", softwareStatementId);

        Optional<SoftwareStatement> isSoftwareStatement = softwareStatementRepository.findById(softwareStatementId);
        if (isSoftwareStatement.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Software statement not found");
        }
        SoftwareStatement softwareStatement = isSoftwareStatement.get();
        return ResponseEntity.ok(applicationApiClient.signingEncryptionKeysReset(softwareStatement.getApplicationId()));
    }


    @RequestMapping(value = "/{softwareStatementId}/application/{kid}/download/publicJwk", method = RequestMethod.GET)
    public ResponseEntity downloadPublicJWK(
            @PathVariable String softwareStatementId,
            @PathVariable String kid,
            Authentication authentication) {
        isAllowed(authentication, softwareStatementId);
        Optional<SoftwareStatement> isSoftwareStatement = softwareStatementRepository.findById(softwareStatementId);
        if (isSoftwareStatement.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Software statement not found");
        }
        SoftwareStatement softwareStatement = isSoftwareStatement.get();
        try {
            LOGGER.debug("Download public JWK '{}' of Software statement '{}'", kid, softwareStatementId);
            directoryCountersKPIService.incrementTokenUsage(DirectoryCounterType.DOWNLOADING_KEYS);
            return ResponseEntity.ok(cryptoApiClient.getKey(softwareStatement.getApplicationId(), kid).toPublicJWK().toJSONString());
        } catch (ParseException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Couldn't load key");
        }
    }

    @RequestMapping(value = "/{softwareStatementId}/application/{kid}/download/privateJwk", method = RequestMethod.GET)
    public ResponseEntity downloadPrivateJWK(
            @PathVariable String softwareStatementId,
            @PathVariable String kid,
            Authentication authentication) {
        isAllowed(authentication, softwareStatementId);
        Optional<SoftwareStatement> isSoftwareStatement = softwareStatementRepository.findById(softwareStatementId);
        if (isSoftwareStatement.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Software statement not found");
        }
        SoftwareStatement softwareStatement = isSoftwareStatement.get();
        try {
            LOGGER.debug("Download private JWK '{}' of Software statement '{}'", kid, softwareStatementId);
            directoryCountersKPIService.incrementTokenUsage(DirectoryCounterType.DOWNLOADING_KEYS);
            return ResponseEntity.ok(cryptoApiClient.getKey(softwareStatement.getApplicationId(), kid).toJSONString());
        } catch (ParseException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Couldn't load key");
        }
    }

    @RequestMapping(value = "/{softwareStatementId}/application/{kid}/download/publicCert", method = RequestMethod.GET)
    public String downloadPublicCert(
            @PathVariable String softwareStatementId,
            @PathVariable String kid,
            Authentication authentication) {
        isAllowed(authentication, softwareStatementId);
        Optional<SoftwareStatement> isSoftwareStatement = softwareStatementRepository.findById(softwareStatementId);
        if (isSoftwareStatement.isEmpty()) {
            return "Software statement not found";
        }
        LOGGER.debug("Download public cert '{}' of Software statement '{}'", kid, softwareStatementId);

        SoftwareStatement softwareStatement = isSoftwareStatement.get();
        directoryCountersKPIService.incrementTokenUsage(DirectoryCounterType.DOWNLOADING_KEYS);
        return cryptoApiClient.getPublicCert(softwareStatement.getApplicationId(), kid);
    }

    @RequestMapping(value = "/{softwareStatementId}/application/{kid}/download/privateCert", method = RequestMethod.GET)
    public String downloadPrivateCert(
            @PathVariable String softwareStatementId,
            @PathVariable String kid,
            Authentication authentication) {
        isAllowed(authentication, softwareStatementId);
        Optional<SoftwareStatement> isSoftwareStatement = softwareStatementRepository.findById(softwareStatementId);
        if (isSoftwareStatement.isEmpty()) {
            return "Software statement not found";
        }
        LOGGER.debug("Download private cert '{}' of Software statement '{}'", kid, softwareStatementId);
        SoftwareStatement softwareStatement = isSoftwareStatement.get();
        directoryCountersKPIService.incrementTokenUsage(DirectoryCounterType.DOWNLOADING_KEYS);
        return cryptoApiClient.getPrivateCert(softwareStatement.getApplicationId(), kid);
    }

    @RequestMapping(value = "/{softwareStatementId}/ssa", method = RequestMethod.POST)
    public ResponseEntity<String> generateSSA(
            @PathVariable String softwareStatementId,
            Authentication authentication) {
        User userDetails = (User) authentication.getPrincipal();
        if (CURRENT_SOFTWARE_STATEMENT_ID.equals(softwareStatementId)
                && userDetails.getAuthorities().contains(OBRIRole.ROLE_SOFTWARE_STATEMENT)) {
            softwareStatementId = authentication.getName();
        } else isAllowed(authentication, softwareStatementId);
        LOGGER.debug("Generate SSA for Software statement '{}'", softwareStatementId);

        Optional<SoftwareStatement> isSoftwareStatement = softwareStatementRepository.findById(softwareStatementId);
        if (isSoftwareStatement.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Software statement not found");
        }
        SoftwareStatement softwareStatement = isSoftwareStatement.get();

        Organisation organisation;
        List<Organisation> organisations = organisationRepository.findBySoftwareStatementIds(softwareStatementId);
        if (organisations.size() == 0) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Can't find the organisation for this software statement");
        } else if (organisations.size() > 1) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Software statement links to more than one organisation");
        }
        organisation = organisations.get(0);

        SSA ssa = ssaService.generateSSA(softwareStatement, organisation);
        String signSSA = ssaService.signSSA(ssa);
        directoryCountersKPIService.incrementTokenUsage(DirectoryCounterType.SSA_GENERATED);
        return ResponseEntity.status(HttpStatus.CREATED).body(signSSA);
    }

    @Override
    @RequestMapping(value = "/{softwareStatementId}/onboarding/{aspspId}/testMtls", method = RequestMethod.GET)
    public ResponseEntity<String> testMtls(
            @PathVariable("softwareStatementId") String softwareStatementId,
            @PathVariable("aspspId") String aspspId,
            Authentication authentication) {
        Optional<SoftwareStatement> isSoftwareStatement = softwareStatementRepository.findById(softwareStatementId);
        if (isSoftwareStatement.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Software statement not found");
        }
        SoftwareStatement softwareStatement = isSoftwareStatement.get();
        LOGGER.debug("Test MATLS for Software statement '{}'", softwareStatementId);

        Optional<Aspsp> isAspsp = aspspRepository.findById(aspspId);
        if (isAspsp.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("ASPSP not found");
        }
        Aspsp aspsp = isAspsp.get();
        Application application = applicationApiClient.getApplication(softwareStatement.getApplicationId());

        //Import transport key into keystore
        try {
            JWK jwk = cryptoApiClient.getKey(application.getIssuerId(), application.getCurrentTransportKid());
            LOGGER.debug("jwk :" + jwk);
            Certificate[] certChain = new Certificate[jwk.getX509CertChain().size()];
            for (int i = 0; i < jwk.getX509CertChain().size(); i++) {
                certChain[i] = CertificateUtils.decodeCertificate(jwk.getX509CertChain().get(i).decode());
            }
            AsymmetricJWK assymetricJWK = (AsymmetricJWK) jwk;
            LOGGER.debug("Add JWK into keystore under the alias {}", jwk.getKeyID());
            keyStoreService.getKeyStore().setKeyEntry(jwk.getKeyID(), assymetricJWK.toPrivateKey(),
                    keyStoreService.getKeyStorePassword().toCharArray(), certChain);
            keyStoreService.store();
            RestTemplate restTemplate = new RestTemplate(sslConfiguration.factory(jwk.getKeyID(), true));
            try {
                return ResponseEntity.ok(aspspApiClient.testMatls(restTemplate, aspsp.getTestMtlsEndpoint()));
            } finally {
                keyStoreService.getKeyStore().deleteEntry(jwk.getKeyID());
            }
        } catch (ParseException | SslConfigurationFailure | CertificateException | KeyStoreException | JOSEException e) {
            LOGGER.error("Couldn't load transport certificate and use it as transport key on behalf of the TPP", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("");
        }
    }

    @Override
    public ResponseEntity getOnboardingResult(
            @ApiParam(value = "The software statement ID", required = true)
            @PathVariable("softwareStatementId") String softwareStatementId,

            @ApiParam(value = "The ASPSP ID", required = true)
            @PathVariable("aspspId") String aspspId,
            Authentication authentication) {

        User userDetails = (User) authentication.getPrincipal();
        if (CURRENT_SOFTWARE_STATEMENT_ID.equals(softwareStatementId)
                && userDetails.getAuthorities().contains(OBRIRole.ROLE_SOFTWARE_STATEMENT)) {
            softwareStatementId = authentication.getName();
        }

        Optional<SoftwareStatement> isSoftwareStatement = softwareStatementRepository.findById(softwareStatementId);
        if (isSoftwareStatement.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Software statement not found");
        }
        SoftwareStatement softwareStatement = isSoftwareStatement.get();

        Optional<Aspsp> isAspsp = aspspRepository.findById(aspspId);
        if (isAspsp.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("ASPSP not found");
        }
        Aspsp aspsp = isAspsp.get();
        Application application = applicationApiClient.getApplication(softwareStatement.getApplicationId());
        OIDCDiscoveryResponse oidcDiscoveryResponse = asDiscoveryService.discovery(aspsp.getAsDiscoveryEndpoint());

        //Import transport key into keystore
        try {
            JWK jwk = cryptoApiClient.getKey(application.getIssuerId(), application.getCurrentTransportKid());
            LOGGER.debug("jwk :" + jwk);
            Certificate[] certChain = new Certificate[jwk.getX509CertChain().size()];
            for (int i = 0; i < jwk.getX509CertChain().size(); i++) {
                certChain[i] = CertificateUtils.decodeCertificate(jwk.getX509CertChain().get(i).decode());
            }
            AsymmetricJWK assymetricJWK = (AsymmetricJWK) jwk;
            LOGGER.debug("Add JWK into keystore under the alias {}", jwk.getKeyID());
            keyStoreService.getKeyStore().setKeyEntry(jwk.getKeyID(), assymetricJWK.toPrivateKey(),
                    keyStoreService.getKeyStorePassword().toCharArray(), certChain);
            keyStoreService.store();
            RestTemplate restTemplate = new RestTemplate(sslConfiguration.factory(jwk.getKeyID(), true));
            try {
                return ResponseEntity.ok(aspspApiClient.getOnboardingResult(restTemplate, oidcDiscoveryResponse.getRegistrationEndpoint()));
            } catch (HttpClientErrorException e) {
                if (e.getStatusCode() == HttpStatus.FORBIDDEN) {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Software statement '" + softwareStatementId
                            + "' is not on-board with ASPSP '" + aspspId + "'");
                }
                LOGGER.error("Couldn't get on-boarding result", e);
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("");
            } finally {
                keyStoreService.getKeyStore().deleteEntry(jwk.getKeyID());
            }
        } catch (ParseException | SslConfigurationFailure | CertificateException | KeyStoreException | JOSEException e) {
            LOGGER.error("Couldn't load transport certificate and use it as transport key on behalf of the TPP", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("");
        }
    }

    @Override
    public ResponseEntity onboard(
            @ApiParam(value = "The software statement ID", required = true)
            @PathVariable("softwareStatementId") String softwareStatementId,

            @ApiParam(value = "The ASPSP ID", required = true)
            @PathVariable("aspspId") String aspspId,
            Authentication authentication) {
        User userDetails = (User) authentication.getPrincipal();
        if (CURRENT_SOFTWARE_STATEMENT_ID.equals(softwareStatementId)
                && userDetails.getAuthorities().contains(OBRIRole.ROLE_SOFTWARE_STATEMENT)) {
            softwareStatementId = authentication.getName();
        }

        Optional<SoftwareStatement> isSoftwareStatement = softwareStatementRepository.findById(softwareStatementId);
        if (isSoftwareStatement.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Software statement not found");
        }
        SoftwareStatement softwareStatement = isSoftwareStatement.get();

        Optional<Aspsp> isAspsp = aspspRepository.findById(aspspId);
        if (isAspsp.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("ASPSP not found");
        }
        Aspsp aspsp = isAspsp.get();
        Application application = applicationApiClient.getApplication(softwareStatement.getApplicationId());

        Organisation organisation;
        List<Organisation> organisations = organisationRepository.findBySoftwareStatementIds(softwareStatementId);
        if (organisations.size() == 0) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Can't find the organisation for this software statement");
        } else if (organisations.size() > 1) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Software statement links to more than one organisation");
        }
        organisation = organisations.get(0);

        //Import transport key into keystore
        try {
            JWK jwk = cryptoApiClient.getKey(application.getIssuerId(), application.getCurrentTransportKid());
            LOGGER.debug("jwk :" + jwk);
            Certificate[] certChain = new Certificate[jwk.getX509CertChain().size()];
            for (int i = 0; i < jwk.getX509CertChain().size(); i++) {
                certChain[i] = CertificateUtils.decodeCertificate(jwk.getX509CertChain().get(i).decode());
            }
            AsymmetricJWK assymetricJWK = (AsymmetricJWK) jwk;
            LOGGER.debug("Add JWK into keystore under the alias {}", jwk.getKeyID());
            keyStoreService.getKeyStore().setKeyEntry(jwk.getKeyID(), assymetricJWK.toPrivateKey(),
                    keyStoreService.getKeyStorePassword().toCharArray(), certChain);
            keyStoreService.store();
            RestTemplate restTemplate = new RestTemplate(sslConfiguration.factory(jwk.getKeyID(), true));
            try {
                LOGGER.debug("Call the OIDC discovery endpoint {}", aspsp.getAsDiscoveryEndpoint());
                OIDCDiscoveryResponse oidcDiscoveryResponse = asDiscoveryService.discovery(aspsp.getAsDiscoveryEndpoint());

                SSA ssa = ssaService.generateSSA(softwareStatement, organisation);

                //generate SSA
                LOGGER.debug("The SSA we are going to use: {}", ssa);
                String registrationRequest;
                try {
                    this.restTemplate.setApplication(jwk.getKeyID());
                    registrationRequest = generateRegistrationRequest(
                            this.restTemplate,
                            oidcDiscoveryResponse,
                            generateOIDCRegistrationRequest(softwareStatement, oidcDiscoveryResponse),
                            ssaService.signSSA(ssa));
                } catch (ParseException e) {
                    LOGGER.error("Can't parse SSA {}", ssa);
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid SSA format");
                }

                return ResponseEntity.status(HttpStatus.CREATED).body(aspspApiClient.onboard(restTemplate, oidcDiscoveryResponse.getRegistrationEndpoint(),registrationRequest));
            } finally {
                keyStoreService.getKeyStore().deleteEntry(jwk.getKeyID());
            }
        } catch (ParseException | SslConfigurationFailure | CertificateException | KeyStoreException | JOSEException e) {
            LOGGER.error("Couldn't load transport certificate and use it as transport key on behalf of the TPP", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("");
        }
    }


    @Override
    public ResponseEntity offboard(
            @ApiParam(value = "The software statement ID", required = true)
            @PathVariable("softwareStatementId") String softwareStatementId,

            @ApiParam(value = "The ASPSP ID", required = true)
            @PathVariable("aspspId") String aspspId,
            Authentication authentication) {
        User userDetails = (User) authentication.getPrincipal();
        if (CURRENT_SOFTWARE_STATEMENT_ID.equals(softwareStatementId)
                && userDetails.getAuthorities().contains(OBRIRole.ROLE_SOFTWARE_STATEMENT)) {
            softwareStatementId = userDetails.getUsername();
        }

        Optional<SoftwareStatement> isSoftwareStatement = softwareStatementRepository.findById(softwareStatementId);
        if (isSoftwareStatement.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Software statement not found");
        }
        SoftwareStatement softwareStatement = isSoftwareStatement.get();

        Optional<Aspsp> isAspsp = aspspRepository.findById(aspspId);
        if (isAspsp.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("ASPSP not found");
        }
        Aspsp aspsp = isAspsp.get();
        Application application = applicationApiClient.getApplication(softwareStatement.getApplicationId());
        OIDCDiscoveryResponse oidcDiscoveryResponse = asDiscoveryService.discovery(aspsp.getAsDiscoveryEndpoint());

        //Import transport key into keystore
        try {
            JWK jwk = cryptoApiClient.getKey(application.getIssuerId(), application.getCurrentTransportKid());
            LOGGER.debug("jwk :" + jwk);
            Certificate[] certChain = new Certificate[jwk.getX509CertChain().size()];
            for (int i = 0; i < jwk.getX509CertChain().size(); i++) {
                certChain[i] = CertificateUtils.decodeCertificate(jwk.getX509CertChain().get(i).decode());
            }
            AsymmetricJWK assymetricJWK = (AsymmetricJWK) jwk;
            LOGGER.debug("Add JWK into keystore under the alias {}", jwk.getKeyID());
            keyStoreService.getKeyStore().setKeyEntry(jwk.getKeyID(), assymetricJWK.toPrivateKey(),
                    keyStoreService.getKeyStorePassword().toCharArray(), certChain);
            keyStoreService.store();
            RestTemplate restTemplate = new RestTemplate(sslConfiguration.factory(jwk.getKeyID(), true));
            try {
                aspspApiClient.offBoard(restTemplate, oidcDiscoveryResponse.getRegistrationEndpoint());
                return ResponseEntity.ok().body("Software statement '" + softwareStatementId
                        + "' successfully off-board from ASPSP '" + aspspId + "'");
            } catch (HttpClientErrorException e) {
                if (e.getStatusCode() == HttpStatus.FORBIDDEN) {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Software statement '" + softwareStatementId
                            + "' is not on-board with ASPSP '" + aspspId + "'");
                }
                LOGGER.error("Couldn't get on-boarding result", e);
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("");
            } finally {
                keyStoreService.getKeyStore().deleteEntry(jwk.getKeyID());
            }
        } catch (ParseException | SslConfigurationFailure | CertificateException | KeyStoreException | JOSEException e) {
            LOGGER.error("Couldn't load transport certificate and use it as transport key on behalf of the TPP", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("");
        }
    }

    /**
     * Verify if the current user is allowed to modify the current resource
     */
    private void isAllowed(Authentication authentication, String softwareStatementId) {
        if (authentication.getPrincipal() == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
        }
        if (softwareStatementId.equals(authentication.getName())) {
            LOGGER.trace("Username must be from transport certificate and matches software statement");
            return;
        }
        Optional<DirectoryUser> isUser = directoryUserRepository.findById(authentication.getName());
        DirectoryUser user = isUser.orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not authorised"));

        Optional<Organisation> isOrganisation = organisationRepository.findById(user.getOrganisationId());
        Organisation organisation = isOrganisation.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Organisation not found"));

        if (!organisation.getSoftwareStatementIds().contains(softwareStatementId)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not authorised to access this software statement");
        }
    }


    private OIDCRegistrationRequest generateOIDCRegistrationRequest(SoftwareStatement softwareStatement, OIDCDiscoveryResponse oidcDiscoveryResponse) {

        //TODO verify that the OIDC provider supports the features we are asking for
        OIDCRegistrationRequest oidcRegistrationRequest = new OIDCRegistrationRequest();

        oidcRegistrationRequest.setScopes(
                Arrays.asList(OpenBankingConstants.Scope.OPENID,
                        OpenBankingConstants.Scope.ACCOUNTS,
                        OpenBankingConstants.Scope.PAYMENTS,
                        OpenBankingConstants.Scope.FUNDS_CONFIRMATIONS));
        oidcRegistrationRequest.setRedirectUris(softwareStatement.getRedirectUris());

        oidcRegistrationRequest.setGrantTypes(Arrays.asList(OIDCConstants.GrantType.AUTHORIZATION_CODE.type,
                OIDCConstants.GrantType.REFRESH_TOKEN.type,
                OIDCConstants.GrantType.CLIENT_CREDENTIAL.type));

        oidcRegistrationRequest.setResponseTypes(Collections.singletonList(
                OIDCConstants.ResponseType.CODE + " " + OIDCConstants.ResponseType.ID_TOKEN));
        oidcRegistrationRequest.setApplicationType(OpenBankingConstants.RegistrationTppRequestClaims.APPLICATION_TYPE_WEB);

        oidcRegistrationRequest.setRedirectUris(softwareStatement.getRedirectUris());

        oidcRegistrationRequest.setClientName(softwareStatement.getName());
        oidcRegistrationRequest.setTokenEndpointAuthMethod(OIDCConstants.TokenEndpointAuthMethods.PRIVATE_KEY_JWT.type);
        oidcRegistrationRequest.setTokenEndpointAuthSigningAlg(JWSAlgorithm.PS256.getName());
        oidcRegistrationRequest.setIdTokenSignedResponseAlg(JWSAlgorithm.PS256.getName());
        //TODO until MIT has not fixed the encryption issue, we can't use encryption in OB
        //oidcRegistrationRequest.setIdTokenEncryptedResponseAlg(JWEAlgorithm.RSA_OAEP_256.getName());
        oidcRegistrationRequest.setSubjectType(OIDCConstants.SubjectType.PUBLIC);
        oidcRegistrationRequest.setRequestObjectSigningAlg(JWSAlgorithm.PS256.getName());
        oidcRegistrationRequest.setRequestObjectEncryptionAlg(JWEAlgorithm.RSA_OAEP_256.getName());
        oidcRegistrationRequest.setRequestObjectEncryptionEnc(EncryptionMethod.A128CBC_HS256.getName());
        return oidcRegistrationRequest;
    }

    /**
     * Generate registration request
     *
     * @return a JWT that can be used to register the TPP
     */
    private String generateRegistrationRequest(RestTemplate restTemplate, OIDCDiscoveryResponse oidcDiscoveryResponse,
                                               OIDCRegistrationRequest oidcRegistrationRequest, String ssa) throws ParseException {
        SignedJWT ssaJws = SignedJWT.parse(ssa);

        //Convert in json for convenience
        JWTClaimsSet ssaClaims = ssaJws.getJWTClaimsSet();
        String asIssuerId = oidcDiscoveryResponse.getIssuer();
        JWTClaimsSet.Builder requestParameterClaims;
        requestParameterClaims = new JWTClaimsSet.Builder();
        requestParameterClaims.audience(asIssuerId);
        requestParameterClaims.expirationTime(new Date(new Date().getTime() + java.time.Duration.ofDays(7).toMillis()));
        Map<String, Object> requestAsClaims = objectMapper.convertValue(oidcRegistrationRequest, Map.class);
        for(Map.Entry<String, Object> entry : requestAsClaims.entrySet()) {
            requestParameterClaims.claim(entry.getKey(), entry.getValue());
        }
        requestParameterClaims.claim(OpenBankingConstants.RegistrationTppRequestClaims.SOFTWARE_STATEMENT, ssa);
        return cryptoApiClient.signClaims(restTemplate, null, ssaClaims.getStringClaim(SOFTWARE_ID), requestParameterClaims.build());
    }
}
