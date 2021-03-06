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

    @Override
    @RequestMapping(value = "/authenticate", method = RequestMethod.POST)
    public ResponseEntity authenticate(@RequestBody String jwk) {
        try {
            return ResponseEntity.ok(directoryUtilsService.authenticate(jwk));
        } catch (ParseException e) {
            LOGGER.warn("Can't parse JWK", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Can't parse JWK");
        } catch (CertificateException e) {
            LOGGER.warn("Can't parse JWK certificates chain", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Can't parse JWK X509 certificates chain");
        }
    }
}
