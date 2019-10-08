/**
 * Copyright 2019 ForgeRock AS. All Rights Reserved
 *
 * Use of this code requires a commercial software license with ForgeRock AS.
 * or with one of its affiliates. All use shall be exclusively subject
 * to such license between the licensee and ForgeRock AS.
 */
package com.forgerock.openbanking.directory.api.softwarestatement;

import com.forgerock.openbanking.core.model.Application;
import com.forgerock.openbanking.model.SoftwareStatement;
import com.forgerock.openbanking.model.oidc.OIDCRegistrationResponse;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import io.swagger.annotations.Authorization;
import io.swagger.annotations.AuthorizationScope;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.security.Principal;
import java.util.List;

@Api(
        tags = "Software staments",
        description = "manage softwate statements"
)
@RequestMapping("/api/software-statement")
public interface SoftwareStatementApi {
    @ApiOperation(value = "Get all the software statements",
            authorizations = {
            @Authorization(value = "Bearer token", scopes = {
                    @AuthorizationScope(scope = "role", description = "Needs to be a TPP")
            })
    })
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "All the software statements", response = SoftwareStatement.class, responseContainer = "list"),
    })
    @PreAuthorize("hasAnyAuthority('ROLE_USER', 'ROLE_SOFTWARE_STATEMENT', 'ROLE_FORGEROCK_INTERNAL_APP')")
    @RequestMapping(value = "/", method = RequestMethod.GET)
    ResponseEntity<List<SoftwareStatement>> getAllSoftwareStatement(
    );



    @ApiOperation(value = "Create a new software statement",
            authorizations = {
            @Authorization(value = "Bearer token", scopes = {
                    @AuthorizationScope(scope = "role", description = "Needs to be a TPP")
            })
    })
    @ApiResponses(value = {
            @ApiResponse(code = 201, message = "The software statement", response = SoftwareStatement.class),
    })
    @PreAuthorize("hasAnyAuthority('ROLE_USER', 'ROLE_SOFTWARE_STATEMENT', 'ROLE_FORGEROCK_INTERNAL_APP')")
    @RequestMapping(value = "/", method = RequestMethod.POST)
    ResponseEntity<SoftwareStatement> create(
            @ApiParam(value = "The software statement.", required = true)
            @RequestBody SoftwareStatement softwareStatement,
            Authentication authentication);



    @ApiOperation(value = "Read software statement",
            authorizations = {
            @Authorization(value = "Bearer token", scopes = {
                    @AuthorizationScope(scope = "role", description = "Needs to be a TPP")
            })
    })
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "The software statement", response = SoftwareStatement.class),
            @ApiResponse(code = 401, message = "Not authorise to access this software statement"),
            @ApiResponse(code = 404, message = "Software statement not found"),
    })
    @PreAuthorize("hasAnyAuthority('ROLE_USER', 'ROLE_SOFTWARE_STATEMENT', 'ROLE_FORGEROCK_INTERNAL_APP')")
    @RequestMapping(value = "/{softwareStatementId}", method = RequestMethod.GET)
    ResponseEntity<SoftwareStatement> read(
            @ApiParam(value = "The software statement ID", required = true)
            @PathVariable String softwareStatementId,
            Authentication authentication);



    @ApiOperation(value = "Update a software statement",
            authorizations = {
            @Authorization(value = "Bearer token", scopes = {
                    @AuthorizationScope(scope = "role", description = "Needs to be a TPP")
            })
    })
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "The software statement", response = SoftwareStatement.class),
            @ApiResponse(code = 401, message = "Not authorise to access this software statement"),
            @ApiResponse(code = 404, message = "Software statement not found"),
    })
    @PreAuthorize("hasAnyAuthority('ROLE_USER', 'ROLE_SOFTWARE_STATEMENT', 'ROLE_FORGEROCK_INTERNAL_APP')")
    @RequestMapping(value = "/{softwareStatementId}", method = RequestMethod.PUT)
    ResponseEntity<SoftwareStatement> update(
            @ApiParam(value = "The software statement ID", required = true)
            @PathVariable String softwareStatementId,

            @ApiParam(value = "The software statement", required = true)
            @RequestBody SoftwareStatement softwareStatement,
            Authentication authentication);



    @ApiOperation(value = "Delete a software statement",
            authorizations = {
            @Authorization(value = "Bearer token", scopes = {
                    @AuthorizationScope(scope = "role", description = "Needs to be a TPP")
            })
    })
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "The software statement", response = SoftwareStatement.class),
            @ApiResponse(code = 401, message = "Not authorise to access this software statement"),
            @ApiResponse(code = 404, message = "Software statement not found"),
    })
    @PreAuthorize("hasAnyAuthority('ROLE_USER', 'ROLE_SOFTWARE_STATEMENT', 'ROLE_FORGEROCK_INTERNAL_APP')")
    @RequestMapping(value = "/{softwareStatementId}", method = RequestMethod.DELETE)
    ResponseEntity<SoftwareStatement> delete(
            @ApiParam(value = "The software statement ID", required = true)
            @PathVariable String softwareStatementId,
            Authentication authentication);



    @ApiOperation(value = "Get application behind this software statement",
            authorizations = {
            @Authorization(value = "Bearer token", scopes = {
                    @AuthorizationScope(scope = "role", description = "Needs to be a TPP")
            })
    })
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "The software statement", response = Application.class),
            @ApiResponse(code = 401, message = "Not authorise to access this software statement"),
            @ApiResponse(code = 404, message = "Software statement not found"),
    })
    @PreAuthorize("hasAnyAuthority('ROLE_USER', 'ROLE_SOFTWARE_STATEMENT', 'ROLE_FORGEROCK_INTERNAL_APP')")
    @RequestMapping(value = "/{softwareStatementId}/application", method = RequestMethod.GET)
    ResponseEntity<Application> getApplication(
            @ApiParam(value = "The software statement ID", required = true)
            @PathVariable String softwareStatementId,
            Authentication authentication);



    @ApiOperation(value = "Get JWK_URI containing all the transport keys only",
            authorizations = {
            @Authorization(value = "Bearer token", scopes = {
                    @AuthorizationScope(scope = "role", description = "Needs to be a TPP")
            })
    })
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "The transport keys JWKs", response = String.class),
            @ApiResponse(code = 401, message = "Not authorise to access this software statement"),
            @ApiResponse(code = 404, message = "Software statement not found"),
    })
    @RequestMapping(value = "/{softwareStatementId}/application/transport/jwk_uri", method = RequestMethod.GET)
    ResponseEntity<String> transportKeysJwkUri(
            @ApiParam(value = "The software statement ID", required = true)
            @PathVariable String softwareStatementId,
            Authentication authentication);


    @ApiOperation(value = "Rotate the transport keys",
            authorizations = {
            @Authorization(value = "Bearer token", scopes = {
                    @AuthorizationScope(scope = "role", description = "Needs to be a TPP")
            })
    })
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "The application after rotation", response = Application.class),
            @ApiResponse(code = 401, message = "Not authorise to access this software statement"),
            @ApiResponse(code = 404, message = "Software statement not found"),
    })
    @PreAuthorize("hasAnyAuthority('ROLE_USER', 'ROLE_SOFTWARE_STATEMENT', 'ROLE_FORGEROCK_INTERNAL_APP')")
    @RequestMapping(value = "/{softwareStatementId}/application/transport/rotate", method = RequestMethod.PUT)
    ResponseEntity<Application> rotateTransportKeys(
            @ApiParam(value = "The software statement ID", required = true)
            @PathVariable String softwareStatementId,
            Authentication authentication);


    @ApiOperation(value = "Reset the transport keys",
            authorizations = {
            @Authorization(value = "Bearer token", scopes = {
                    @AuthorizationScope(scope = "role", description = "Needs to be a TPP")
            })
    })
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "The application after reset", response = Application.class),
            @ApiResponse(code = 401, message = "Not authorise to access this software statement"),
            @ApiResponse(code = 404, message = "Software statement not found"),
    })
    @PreAuthorize("hasAnyAuthority('ROLE_USER', 'ROLE_SOFTWARE_STATEMENT', 'ROLE_FORGEROCK_INTERNAL_APP')")
    @RequestMapping(value = "/{softwareStatementId}/application/transport/reset", method = RequestMethod.PUT)
    ResponseEntity<Application> resetTransportKeys(
            @ApiParam(value = "The software statement ID", required = true)
            @PathVariable String softwareStatementId,
            Authentication authentication);


    @ApiOperation(value = "Get the signing and encryption JWKs",
            authorizations = {
            @Authorization(value = "Bearer token", scopes = {
                    @AuthorizationScope(scope = "role", description = "Needs to be a TPP")
            })
    })
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "The signing and encryption jwks", response = String.class),
            @ApiResponse(code = 401, message = "Not authorise to access this software statement"),
            @ApiResponse(code = 404, message = "Software statement not found"),
    })
    @RequestMapping(value = "/{softwareStatementId}/application/jwk_uri", method = RequestMethod.GET)
    ResponseEntity<String> signingEncryptionKeysJwkUri(
            @ApiParam(value = "The software statement ID", required = true)
            @PathVariable String softwareStatementId,
            Authentication authentication);


    @ApiOperation(value = "Rotate the signing and encryption keys",
            authorizations = {
            @Authorization(value = "Bearer token", scopes = {
                    @AuthorizationScope(scope = "role", description = "Needs to be a TPP")
            })
    })
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "The application after rotation", response = Application.class),
            @ApiResponse(code = 401, message = "Not authorise to access this software statement"),
            @ApiResponse(code = 404, message = "Software statement not found"),
    })
    @PreAuthorize("hasAnyAuthority('ROLE_USER', 'ROLE_SOFTWARE_STATEMENT', 'ROLE_FORGEROCK_INTERNAL_APP')")
    @RequestMapping(value = "/{softwareStatementId}/application/rotate", method = RequestMethod.PUT)
    ResponseEntity<Application> rotateSigningEncryptionKeys(
            @ApiParam(value = "The software statement ID", required = true)
            @PathVariable String softwareStatementId,
            Authentication authentication);


    @ApiOperation(value = "Reset the signing and encryption keys",
            authorizations = {
            @Authorization(value = "Bearer token", scopes = {
                    @AuthorizationScope(scope = "role", description = "Needs to be a TPP")
            })
    })
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "The application after reset", response = Application.class),
            @ApiResponse(code = 401, message = "Not authorise to access this software statement"),
            @ApiResponse(code = 404, message = "Software statement not found"),
    })
    @PreAuthorize("hasAnyAuthority('ROLE_USER', 'ROLE_SOFTWARE_STATEMENT', 'ROLE_FORGEROCK_INTERNAL_APP')")
    @RequestMapping(value = "/{softwareStatementId}/application/reset", method = RequestMethod.PUT)
    ResponseEntity<Application> resetSigningEncryptionKeys(
            @ApiParam(value = "The software statement ID", required = true)
            @PathVariable String softwareStatementId,
            Authentication authentication);


    @ApiOperation(value = "Download a key as a public JWK",
            authorizations = {
            @Authorization(value = "Bearer token", scopes = {
                    @AuthorizationScope(scope = "role", description = "Needs to be a TPP")
            })
    })
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "The public JWK", response = String.class),
            @ApiResponse(code = 401, message = "Not authorise to access this software statement"),
            @ApiResponse(code = 404, message = "Software statement or key not found"),
    })
    @RequestMapping(value = "/{softwareStatementId}/application/{kid}/download/publicJwk", method = RequestMethod.GET)
    ResponseEntity<String> downloadPublicJWK(
            @ApiParam(value = "The software statement ID", required = true)
            @PathVariable String softwareStatementId,

            @ApiParam(value = "The key ID", required = true)
            @PathVariable String kid,
            Authentication authentication);


    @ApiOperation(value = "Download a key as a private JWK",
            authorizations = {
            @Authorization(value = "Bearer token", scopes = {
                    @AuthorizationScope(scope = "role", description = "Needs to be a TPP")
            })
    })
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "The private JWK", response = String.class),
            @ApiResponse(code = 401, message = "Not authorise to access this software statement"),
            @ApiResponse(code = 404, message = "Software statement or key not found"),
    })
    @PreAuthorize("hasAnyAuthority('ROLE_USER', 'ROLE_SOFTWARE_STATEMENT', 'ROLE_FORGEROCK_INTERNAL_APP')")
    @RequestMapping(value = "/{softwareStatementId}/application/{kid}/download/privateJwk", method = RequestMethod.GET)
    ResponseEntity<String> downloadPrivateJWK(
            @ApiParam(value = "The software statement ID", required = true)
            @PathVariable String softwareStatementId,

            @ApiParam(value = "The key ID", required = true)
            @PathVariable String kid,
            Authentication authentication);

    @ApiOperation(value = "Download a key as pem",
            authorizations = {
            @Authorization(value = "Bearer token", scopes = {
                    @AuthorizationScope(scope = "role", description = "Needs to be a TPP")
            })
    })
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "The pem", response = String.class),
            @ApiResponse(code = 401, message = "Not authorise to access this software statement"),
            @ApiResponse(code = 404, message = "Software statement or key not found"),
    })
    @RequestMapping(value = "/{softwareStatementId}/application/{kid}/download/publicCert", method = RequestMethod.GET)
    @ResponseBody String downloadPublicCert(
            @ApiParam(value = "The software statement ID", required = true)
            @PathVariable String softwareStatementId,

            @ApiParam(value = "The key ID", required = true)
            @PathVariable String kid,
            Authentication authentication);


    @ApiOperation(value = "Download a key as private cert",
            authorizations = {
            @Authorization(value = "Bearer token", scopes = {
                    @AuthorizationScope(scope = "role", description = "Needs to be a TPP or Software Statement")
            })
    })
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "The private cert", response = String.class),
            @ApiResponse(code = 401, message = "Not authorise to access this software statement"),
            @ApiResponse(code = 404, message = "Software statement or key not found"),
    })
    @PreAuthorize("hasAnyAuthority('ROLE_USER', 'ROLE_SOFTWARE_STATEMENT', 'ROLE_FORGEROCK_INTERNAL_APP')")
    @RequestMapping(value = "/{softwareStatementId}/application/{kid}/download/privateCert", method = RequestMethod.GET)
    @ResponseBody String downloadPrivateCert(
            @ApiParam(value = "The software statement ID", required = true)
            @PathVariable String softwareStatementId,

            @ApiParam(value = "The key ID", required = true)
            @PathVariable String kid,
            Authentication authentication);


    @ApiOperation(value = "Generate a SSA for this software statement",
            authorizations = {
            @Authorization(value = "Bearer token", scopes = {
                    @AuthorizationScope(scope = "role", description = "Needs to be a TPP or Software Statement")
            })
    })
    @ApiResponses(value = {
            @ApiResponse(code = 201, message = "The private cert", response = String.class),
            @ApiResponse(code = 401, message = "Not authorise to access this software statement"),
            @ApiResponse(code = 404, message = "Software statement not found"),
    })
    @PreAuthorize("hasAnyAuthority('ROLE_USER', 'ROLE_SOFTWARE_STATEMENT', 'ROLE_FORGEROCK_INTERNAL_APP')")
    @RequestMapping(value = "/{softwareStatementId}/ssa", method = RequestMethod.POST)
    ResponseEntity<String> generateSSA(
            @ApiParam(value = "The software statement ID", required = true)
            @PathVariable String softwareStatementId,
            Authentication authentication);


    @ApiOperation(value = "Test MATLS between a software statement and an ASPSP",
            authorizations = {
            @Authorization(value = "Bearer token", scopes = {
                    @AuthorizationScope(scope = "role", description = "Needs to be a TPP")
            })
    })
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "The ASPSP matls test response", response = String.class),
            @ApiResponse(code = 401, message = "Not authorise to access this software statement"),
            @ApiResponse(code = 404, message = "Software statement or ASPSP not found"),
    })
    @PreAuthorize("hasAnyAuthority('ROLE_USER', 'ROLE_SOFTWARE_STATEMENT', 'ROLE_FORGEROCK_INTERNAL_APP')")
    @RequestMapping(value = "/{softwareStatementId}/onboarding/{aspspId}/testMtls", method = RequestMethod.POST)
    ResponseEntity<String> testMtls(
            @ApiParam(value = "The software statement ID", required = true)
            @PathVariable("softwareStatementId") String softwareStatementId,

            @ApiParam(value = "The ASPSP ID", required = true)
            @PathVariable("aspspId") String aspspId,
            Authentication authentication);


    @ApiOperation(value = "Get on-boarding result",
            authorizations = {
            @Authorization(value = "Bearer token", scopes = {
                    @AuthorizationScope(scope = "role", description = "Needs to be a TPP")
            })
    })
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "The on-boarding result", response = OIDCRegistrationResponse.class),
            @ApiResponse(code = 401, message = "Not onboard"),
    })
    @PreAuthorize("hasAnyAuthority('ROLE_USER', 'ROLE_SOFTWARE_STATEMENT', 'ROLE_FORGEROCK_INTERNAL_APP')")
    @RequestMapping(value = "/{softwareStatementId}/onboarding/{aspspId}", method = RequestMethod.GET)
    ResponseEntity<OIDCRegistrationResponse> getOnboardingResult(
            @ApiParam(value = "The software statement ID", required = true)
            @PathVariable("softwareStatementId") String softwareStatementId,

            @ApiParam(value = "The ASPSP ID", required = true)
            @PathVariable("aspspId") String aspspId,
            Authentication authentication);

    @ApiOperation(value = "On-boarding",
            authorizations = {
            @Authorization(value = "Bearer token", scopes = {
                    @AuthorizationScope(scope = "role", description = "Needs to be a TPP")
            })
    })
    @ApiResponses(value = {
            @ApiResponse(code = 201, message = "The on-boarding result", response = OIDCRegistrationResponse.class),
            @ApiResponse(code = 401, message = "Not onboard"),
    })
    @PreAuthorize("hasAnyAuthority('ROLE_USER', 'ROLE_SOFTWARE_STATEMENT', 'ROLE_FORGEROCK_INTERNAL_APP')")
    @RequestMapping(value = "/{softwareStatementId}/onboarding/{aspspId}", method = RequestMethod.POST)
    ResponseEntity<OIDCRegistrationResponse> onboard(
            @ApiParam(value = "The software statement ID", required = true)
            @PathVariable("softwareStatementId") String softwareStatementId,

            @ApiParam(value = "The ASPSP ID", required = true)
            @PathVariable("aspspId") String aspspId,
            Authentication authentication);

    @ApiOperation(value = "Off-boarding",
            authorizations = {
            @Authorization(value = "Bearer token", scopes = {
                    @AuthorizationScope(scope = "role", description = "Needs to be a TPP")
            })
    })
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Successfully off board", response = String.class),
    })
    @PreAuthorize("hasAnyAuthority('ROLE_USER', 'ROLE_SOFTWARE_STATEMENT', 'ROLE_FORGEROCK_INTERNAL_APP')")
    @RequestMapping(value = "/{softwareStatementId}/onboarding/{aspspId}", method = RequestMethod.DELETE)
    ResponseEntity<String> offboard(
            @ApiParam(value = "The software statement ID", required = true)
            @PathVariable("softwareStatementId") String softwareStatementId,

            @ApiParam(value = "The ASPSP ID", required = true)
            @PathVariable("aspspId") String aspspId,
            Authentication authentication);
}
