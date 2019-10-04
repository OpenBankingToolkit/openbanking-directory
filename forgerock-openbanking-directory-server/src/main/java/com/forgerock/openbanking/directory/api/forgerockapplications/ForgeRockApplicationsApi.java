/**
 * Copyright 2019 ForgeRock AS. All Rights Reserved
 *
 * Use of this code requires a commercial software license with ForgeRock AS.
 * or with one of its affiliates. All use shall be exclusively subject
 * to such license between the licensee and ForgeRock AS.
 */
package com.forgerock.openbanking.directory.api.forgerockapplications;

import com.forgerock.openbanking.core.model.ForgeRockApplication;
import io.swagger.annotations.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import java.security.Principal;
import java.util.List;


@Api(
        tags = "ForgeRockApplication",
        description = "Managing the ForgeRock application"
)
@RequestMapping("/api/forgerock-applications")
public interface ForgeRockApplicationsApi {

    @ApiOperation(value = "Get the ForgeRock Applications",
            authorizations = {
            @Authorization(value = "Bearer token", scopes = {
                    @AuthorizationScope(scope = "role", description = "Needs to be a ForgeRock user")
            })
    })
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "The ForgeRock application", response = ForgeRockApplication.class, responseContainer = "list"),

    })
    @PreAuthorize("hasAnyAuthority('GROUP_FORGEROCK')")
    @RequestMapping(value = "/", method = RequestMethod.GET)
    ResponseEntity<List<ForgeRockApplication>> getForgeRockApplications(
            Principal principal
    );

    @ApiOperation(value = "Connect a ForgeRock app to an existing software statement",
            authorizations = {
            @Authorization(value = "Bearer token", scopes = {
                    @AuthorizationScope(scope = "role", description = "Needs to be a ForgeRock user")
            })
    })
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "The ForgeRock application is now connected to the software statement"),

    })
    @PreAuthorize("hasAnyAuthority('GROUP_FORGEROCK')")
    @RequestMapping(value = "/{applicationId}/connect-software-statement/{softwareStatementId}", method = RequestMethod.POST)
    ResponseEntity<Void> connect(
            @ApiParam(value = "The ForgeRock application ID.", required = true)
            @PathVariable("applicationId") String applicationId,

            @ApiParam(value = "The software statement ID.", required = true)
            @PathVariable("softwareStatementId") String softwareStatementId,
            Principal principal
    );

}
