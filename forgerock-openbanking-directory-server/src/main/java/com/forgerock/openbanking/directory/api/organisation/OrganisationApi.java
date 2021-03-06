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
package com.forgerock.openbanking.directory.api.organisation;

import com.forgerock.openbanking.directory.model.Organisation;
import com.forgerock.openbanking.model.SoftwareStatement;
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

import java.security.Principal;
import java.util.List;

@Api(
        tags = "Organisation",
        description = "manage organisations"
)
@RequestMapping("/api/organisation")
public interface OrganisationApi {
    @ApiOperation(value = "Get all the organisation",
            authorizations = {
            @Authorization(value = "Bearer token", scopes = {
                    @AuthorizationScope(scope = "role", description = "Needs to be a ForgeRock user")
            })
    })
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "All the organisation", response = Organisation.class, responseContainer = "list"),
    })
    @PreAuthorize("hasAnyAuthority('GROUP_FORGEROCK', 'GROUP_OB')")
    @RequestMapping(value = "/", method = RequestMethod.GET)
    ResponseEntity<List<Organisation>> getAllOrganisation(
            Authentication authentication
    );

    @ApiOperation(value = "Read an organisation",
            authorizations = {
            @Authorization(value = "Bearer token", scopes = {
                    @AuthorizationScope(scope = "role", description = "Needs to be a TPP")
            })
    })
    @ApiResponses(value = {
            @ApiResponse(code = 201, message = "the organisation", response = Organisation.class),
    })
    @PreAuthorize("hasAnyAuthority('ROLE_USER', 'ROLE_SOFTWARE_STATEMENT', 'ROLE_FORGEROCK_INTERNAL_APP')")
    @RequestMapping(value = "/", method = RequestMethod.POST)
    ResponseEntity<Organisation> create(
            @ApiParam(value = "The organisation.", required = true)
            @RequestBody Organisation organisation,
            Authentication authentication
    );

    @ApiOperation(value = "Read an organisation",
            authorizations = {
            @Authorization(value = "Bearer token", scopes = {
                    @AuthorizationScope(scope = "role", description = "Needs to be a TPP")
            })
    })
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "the organisation", response = Organisation.class),
            @ApiResponse(code = 401, message = "The TPP is not authorise to access this organisation"),
            @ApiResponse(code = 404, message = "the organisation ID doesn't exist"),
    })
    @PreAuthorize("hasAnyAuthority('ROLE_USER', 'ROLE_SOFTWARE_STATEMENT', 'ROLE_FORGEROCK_INTERNAL_APP')")
    @RequestMapping(value = "/{organisationId}", method = RequestMethod.GET)
    ResponseEntity<Organisation> read(
            @ApiParam(value = "The organisation ID", required = true)
            @PathVariable String organisationId,
            Authentication authentication
    );

    @ApiOperation(value = "Update the organisation",
            authorizations = {
            @Authorization(value = "Bearer token", scopes = {
                    @AuthorizationScope(scope = "role", description = "Needs to be a TPP")
            })
    })
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "the organisation", response = Organisation.class),
            @ApiResponse(code = 401, message = "The TPP is not authorise to access this organisation"),
            @ApiResponse(code = 404, message = "the organisation ID doesn't exist"),
    })
    @PreAuthorize("hasAnyAuthority('ROLE_USER', 'ROLE_SOFTWARE_STATEMENT', 'ROLE_FORGEROCK_INTERNAL_APP')")
    @RequestMapping(value = "/{organisationId}", method = RequestMethod.PUT)
    ResponseEntity<Organisation> update(
            @ApiParam(value = "The organisation ID", required = true)
            @PathVariable String organisationId,

            @ApiParam(value = "The organisation", required = true)
            @RequestBody Organisation organisation,
            Authentication authentication);

    @ApiOperation(value = "Read software statements linked to the organisation",
            authorizations = {
            @Authorization(value = "Bearer token", scopes = {
                    @AuthorizationScope(scope = "role", description = "Needs to be a TPP")
            })
    })
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "the software statements", response = SoftwareStatement.class, responseContainer = "list"),
            @ApiResponse(code = 401, message = "The TPP is not authorise to access this organisation"),
            @ApiResponse(code = 404, message = "the organisation ID doesn't exist"),
    })
    @PreAuthorize("hasAnyAuthority('ROLE_USER', 'ROLE_SOFTWARE_STATEMENT', 'ROLE_FORGEROCK_INTERNAL_APP')")
    @RequestMapping(value = "/{organisationId}/software-statements", method = RequestMethod.GET)
    ResponseEntity<List<SoftwareStatement>> readSoftwareStatements(
            @ApiParam(value = "The organisation ID", required = true)
            @PathVariable String organisationId,
            Authentication authentication
    );

    @ApiOperation(value = "Delete software statements linked to the organisation",
            authorizations = {
                    @Authorization(value = "Bearer token", scopes = {
                            @AuthorizationScope(scope = "role", description = "Needs to be a TPP")
                    })
            })
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "the software statements", response = SoftwareStatement.class, responseContainer = "list"),
            @ApiResponse(code = 401, message = "The TPP is not authorise to access this organisation"),
            @ApiResponse(code = 404, message = "the organisation ID doesn't exist"),
    })
    @PreAuthorize("hasAnyAuthority('ROLE_USER', 'ROLE_SOFTWARE_STATEMENT', 'ROLE_FORGEROCK_INTERNAL_APP')")
    @RequestMapping(value = "/{organisationId}/software-statements", method = RequestMethod.DELETE)
    ResponseEntity<List<SoftwareStatement>> deleteSoftwareStatements(
            @ApiParam(value = "The organisation ID", required = true)
            @PathVariable String organisationId,
            Authentication authentication
    );
}
