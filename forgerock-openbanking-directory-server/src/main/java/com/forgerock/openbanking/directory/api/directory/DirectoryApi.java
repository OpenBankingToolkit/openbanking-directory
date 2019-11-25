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

import com.forgerock.openbanking.model.ApplicationIdentity;
import com.nimbusds.jose.jwk.JWKSet;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import java.io.IOException;
import java.security.Principal;

@Api(
        tags = "Directory",
        description = "Get the info from the directory"
)
@RequestMapping("/api/directory")
public interface DirectoryApi {

    @ApiOperation(value = "Get the public keys of the directory, in a JWK format")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "The directory jwks", response = JWKSet.class),

    })
    @RequestMapping(value = "/keys/jwk_uri", method = RequestMethod.GET)
    ResponseEntity<String> getJwkUri(
            Principal principal
    );


    @ApiOperation(value = "Get a specific key in a X509 format")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "The X509 certificate in pem format", response = String.class),
            @ApiResponse(code = 404, message = "The key was not found"),

    })
    @RequestMapping(value = "/keys/{keyId}/publicCert", method = RequestMethod.GET)
    ResponseEntity<String> getPublicCert(
            @ApiParam(value = "The key id.", required = true)
            @PathVariable String keyId,

            Principal principal
    );

    @ApiOperation(value = "Get the current signing key of the directory in a x509 format")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "The X509 certificate in pem format", response = String.class),

    })
    @RequestMapping(value = "/keys/current/publicCert", method = RequestMethod.GET)
    ResponseEntity<String> getCurrentSigningPublicCert(
            Principal principal
    );

    @ApiOperation(value = "Get the CA public certs, used for signing all the software statement keys")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "The X509 certificate in pem format", response = String.class),

    })

    @RequestMapping(value = "/keys/ca/publicCert", method = RequestMethod.GET,  produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    FileSystemResource getCAPem() throws IOException;


    @ApiOperation(value = "Identify an application based on the JWK")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "The identity behind the JWK", response = ApplicationIdentity.class),
            @ApiResponse(code = 400, message = "JWK couldn't be parsed"),

    })
    @RequestMapping(value = "/authenticate", method = RequestMethod.POST)
    ResponseEntity<ApplicationIdentity> authenticate(
            @ApiParam(value = "The JWK serialised as a string.", required = true)
            @RequestBody String jwk
    );
}
