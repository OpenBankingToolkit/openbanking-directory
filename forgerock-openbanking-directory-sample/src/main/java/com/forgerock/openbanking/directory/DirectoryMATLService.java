/**
 * Copyright 2019 ForgeRock AS. All Rights Reserved
 *
 * Use of this code requires a commercial software license with ForgeRock AS.
 * or with one of its affiliates. All use shall be exclusively subject
 * to such license between the licensee and ForgeRock AS.
 */
///**
// * Copyright 2019 ForgeRock AS. All Rights Reserved
// *
// * Use of this code requires a commercial software license with ForgeRock AS.
// * or with one of its affiliates. All use shall be exclusively subject
// * to such license between the licensee and ForgeRock AS.
// */
//package com.forgerock.openbanking.directory;
//
//import com.forgerock.openbanking.commons.auth.x509.ForgeRockAppMATLService;
//import com.forgerock.openbanking.commons.configuration.auth.MATLSConfigurationProperties;
//import com.forgerock.openbanking.commons.services.directory.DirectoryService;
//import com.forgerock.openbanking.directory.service.DirectoryUtilsService;
//import com.forgerock.openbanking.model.ApplicationIdentity;
//import com.forgerock.openbanking.model.OBRIRole;
//import com.forgerock.openbanking.model.UserContext;
//import com.forgerock.openbanking.ssl.services.keystore.KeyStoreService;
//import com.nimbusds.jose.jwk.JWK;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.core.io.Resource;
//import org.springframework.security.core.GrantedAuthority;
//import org.springframework.security.core.authority.AuthorityUtils;
//import org.springframework.stereotype.Service;
//
//import java.security.cert.CertificateException;
//import java.security.cert.X509Certificate;
//import java.util.ArrayList;
//import java.util.List;
//
//@Service
//public class DirectoryMATLService extends ForgeRockAppMATLService {
//    private static final Logger LOGGER = LoggerFactory.getLogger(DirectoryMATLService.class);
//
//    @Autowired
//    public DirectoryMATLService(@Value("${certificates.selfsigned.forgerock.root}") Resource forgerockSelfSignedRootCertificatePem,
//                                @Value("${gateway.client-jwk-header}") String clientJwkHeader,
//                                DirectoryService commonsDirectoryService,
//                                KeyStoreService keyStoreService,
//                                MATLSConfigurationProperties matlsConfigurationProperties,
//                                DirectoryUtilsService directoryUtilsService
//    ){
//        super(forgerockSelfSignedRootCertificatePem,
//                clientJwkHeader,
//                commonsDirectoryService,
//                keyStoreService,
//                matlsConfigurationProperties);
//
//        this.directoryUtilsService = directoryUtilsService;
//    }
//
//    private DirectoryUtilsService directoryUtilsService;
//
//    @Override
//    protected UserContext getUserDetails(JWK jwk, X509Certificate[] certificatesChain) {
//        List<GrantedAuthority> authorities = new ArrayList<>();
//        try {
//            ApplicationIdentity authenticate = directoryUtilsService.authenticate(jwk);
//            authorities.addAll(authenticate.getRoles());
//            return UserContext.create(authenticate.getId(),  authorities, UserContext.UserType.SOFTWARE_STATEMENT);
//
//        } catch (CertificateException e) {
//            LOGGER.error("Couldn't read the certificate", e);
//            return UserContext.create("Anonymous",
//                    AuthorityUtils.createAuthorityList(OBRIRole.ROLE_ANONYMOUS.name()), UserContext.UserType.ANONYMOUS);
//        }
//    }
//}
