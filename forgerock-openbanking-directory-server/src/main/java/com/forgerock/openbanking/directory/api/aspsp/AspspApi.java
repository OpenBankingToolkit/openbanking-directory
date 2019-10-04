/**
 * Copyright 2019 ForgeRock AS. All Rights Reserved
 *
 * Use of this code requires a commercial software license with ForgeRock AS.
 * or with one of its affiliates. All use shall be exclusively subject
 * to such license between the licensee and ForgeRock AS.
 */
package com.forgerock.openbanking.directory.api.aspsp;

import com.forgerock.openbanking.directory.config.Aspsp;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import io.swagger.annotations.Authorization;
import io.swagger.annotations.AuthorizationScope;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import java.security.Principal;
import java.util.List;

@Api(
        tags = "ASPSP",
        description = "Manage all the ASPSPs registered in the directory"
)
@RequestMapping("/api/aspsp")
public interface AspspApi {

    @ApiOperation(value = "Get the list of ASPSPs",
            authorizations = {
                @Authorization(value = "Bearer token", scopes = {
                        @AuthorizationScope(scope = "role", description = "Needs to be a registered user")
                 })
            })
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "The list of ASPSPs", response = Aspsp.class, responseContainer = "List")
    })

    @PreAuthorize("hasAnyAuthority('ROLE_USER', 'ROLE_SOFTWARE_STATEMENT')")
    @RequestMapping(
            value = "/",
            method = RequestMethod.GET,
            produces = { "application/json; charset=utf-8" })
    ResponseEntity<List<Aspsp>> getAllAspsp(
            Principal principal
    );

    @ApiOperation(value = "Get the aspsp details",
            authorizations = {
                @Authorization(value = "Bearer token", scopes = {
                        @AuthorizationScope(scope = "role", description = "Needs to be a registered user")
                })
            })
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "The aspsp details", response = Aspsp.class),
            @ApiResponse(code = 404, message = "Not Found"),
    })

    @PreAuthorize("hasAnyAuthority('ROLE_USER', 'ROLE_SOFTWARE_STATEMENT')")
    @RequestMapping(value = "/{aspspId}", method = RequestMethod.GET)
    ResponseEntity<Aspsp> getAspsp(
            @ApiParam(value = "The ASPSP ID.", required = true)
            @PathVariable String aspspId,
            Principal principal
    );

    @ApiOperation(value = "Create a new ASPSP",
            authorizations = {
                @Authorization(value = "Bearer token", scopes = {
                        @AuthorizationScope(scope = "role", description = "Needs to be a ForgeRock user")
                })
            })
    @ApiResponses(value = {
            @ApiResponse(code = 201, message = "The aspsp created", response = Aspsp.class)
    })
    @PreAuthorize("hasAnyAuthority('GROUP_FORGEROCK')")
    @RequestMapping(value = "/", method = RequestMethod.POST)
    ResponseEntity<Aspsp> createAspsp(
            @ApiParam(value = "The ASPSP.", required = true)
            @RequestBody Aspsp aspsp,
            Principal principal
    );

    @ApiOperation(value = "update an ASPSP",
            authorizations = {
            @Authorization(value = "Bearer token", scopes = {
                    @AuthorizationScope(scope = "role", description = "Needs to be a ForgeRock user")
            })
    })
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "The aspsp created", response = Aspsp.class),
            @ApiResponse(code = 404, message = "Not Found"),

    })
    @PreAuthorize("hasAnyAuthority('GROUP_FORGEROCK')")
    @RequestMapping(value = "/{aspspId}", method = RequestMethod.PUT)
    ResponseEntity<Aspsp> updateAspsp(
            @ApiParam(value = "The ASPSP id.", required = true)
            @PathVariable String aspspId,

            @ApiParam(value = "The ASPSP.", required = true)
            @RequestBody Aspsp aspsp,
            Principal principal
    );
}
