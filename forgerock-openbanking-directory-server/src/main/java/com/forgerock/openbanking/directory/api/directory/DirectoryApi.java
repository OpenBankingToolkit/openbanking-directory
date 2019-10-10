/**
 * Copyright 2019 ForgeRock AS. All Rights Reserved
 *
 * Use of this code requires a commercial software license with ForgeRock AS.
 * or with one of its affiliates. All use shall be exclusively subject
 * to such license between the licensee and ForgeRock AS.
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
    
}
