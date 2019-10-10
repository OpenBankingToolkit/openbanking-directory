/**
 * Copyright 2019 ForgeRock AS. All Rights Reserved
 *
 * Use of this code requires a commercial software license with ForgeRock AS.
 * or with one of its affiliates. All use shall be exclusively subject
 * to such license between the licensee and ForgeRock AS.
 */
package com.forgerock.openbanking.directory.api.directory;

import com.forgerock.openbanking.core.services.ApplicationApiClient;
import com.forgerock.openbanking.directory.service.DirectoryUtilsService;
import com.forgerock.openbanking.jwt.services.CryptoApiClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.security.Principal;
import java.security.cert.CertificateException;
import java.text.ParseException;

@RestController
public class DirectoryApiController implements DirectoryApi {
    private static final Logger LOGGER = LoggerFactory.getLogger(DirectoryApiController.class);

    @Autowired
    private ApplicationApiClient applicationApiClient;
    @Autowired
    private CryptoApiClient cryptoApiClient;

    @Value("${directory.ca.pem}")
    public Resource obMitIssuingCertificatePem;

    @Autowired
    private DirectoryUtilsService directoryUtilsService;


    @Override
    @RequestMapping(value = "/keys/jwk_uri", method = RequestMethod.GET)
    public ResponseEntity<String> getJwkUri(Principal principal) {
        return ResponseEntity.ok(applicationApiClient.signingEncryptionKeysJwkUri("CURRENT"));
    }

    @Override
    @RequestMapping(value = "/keys/{keyId}/publicCert", method = RequestMethod.GET)
    public ResponseEntity<String> getPublicCert(@PathVariable String keyId, Principal principal) {
        return ResponseEntity.ok(cryptoApiClient.getPublicCert("CURRENT", keyId));
    }

    @Override
    @RequestMapping(value = "/keys/current/publicCert", method = RequestMethod.GET)
    public ResponseEntity<String> getCurrentSigningPublicCert(Principal principal) {
        return ResponseEntity.ok(cryptoApiClient.getPublicCert("CURRENT", "CURRENT_SIGNING"));
    }

    @Override
    @RequestMapping(value = "/keys/ca/publicCert", method = RequestMethod.GET,  produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    public FileSystemResource getCAPem() throws IOException {
        return new FileSystemResource(obMitIssuingCertificatePem.getFile());
    }
}
