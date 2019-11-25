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
package com.forgerock.openbanking.directory.api.forgerockapplications;

import com.forgerock.openbanking.core.model.ForgeRockApplication;
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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

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
    ResponseEntity<List<ForgeRockApplication>> getForgeRockApplications();

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
            @PathVariable("softwareStatementId") String softwareStatementId
    );

}
