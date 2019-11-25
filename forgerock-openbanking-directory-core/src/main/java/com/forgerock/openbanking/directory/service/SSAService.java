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
package com.forgerock.openbanking.directory.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.forgerock.openbanking.directory.config.DirectoryConfiguration;
import com.forgerock.openbanking.directory.config.DirectoryUIConfiguration;
import com.forgerock.openbanking.directory.config.ForgeRockDirectoryConfiguration;
import com.forgerock.openbanking.directory.model.Organisation;
import com.forgerock.openbanking.directory.model.SSA;
import com.forgerock.openbanking.jwt.services.CryptoApiClient;
import com.forgerock.openbanking.model.SoftwareStatement;
import com.nimbusds.jwt.JWTClaimsSet;
import org.joda.time.Duration;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Map;

@Service
public class SSAService {
    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private CryptoApiClient cryptoApiClient;

    @Autowired
    private DirectoryConfiguration directoryConfiguration;
    @Autowired
    private DirectoryUIConfiguration directoryUIConfiguration;
    @Autowired
    private ForgeRockDirectoryConfiguration forgeRockDirectoryConfiguration;

    public SSA generateSSA(SoftwareStatement softwareStatement, Organisation organisation) {
        return SSA.builder()
                .obRegisteryTos(directoryUIConfiguration.tos)
                .organisationStatus("Active")
                .organisationId(organisation.getId())
                .organisationName(organisation.getName())
                .organisationContacts(organisation.getContacts())
                .organisationJwksEndpoint("TODO")
                .organisationJwksRevokedEndpoint("TODO")
                .softwareId(softwareStatement.getId())
                .softwareClientId(softwareStatement.getId())
                .softwareClientName(softwareStatement.getName())
                .softwareClientDescription(softwareStatement.getDescription())
                .softwareClientUri(softwareStatement.getUri())
                .softwareVersion(softwareStatement.getVersion())
                .softwareEnvironment(softwareStatement.getEnvironment())
                .softwareJwkEndpoint(directoryConfiguration.externalRootEndpoint + "api/software-statement/" + softwareStatement.getId() + "/application/jwk_uri")
                .softwareJwksRevokedEndpoint("TODO")
                .softwareLogoUri(softwareStatement.getLogoUri())
                .softwareMode(softwareStatement.getMode())
                .softwarePolicyUri(softwareStatement.getPolicyUri())
                .softwareRedirectUris(softwareStatement.getRedirectUris())
                .softwareRoles(softwareStatement.getRoles())
                .softwareTosUri(softwareStatement.getTermsOfService())
                .build();
    }

    public String signSSA(SSA ssa) {
        return generate(ssa);
    }

    /**
     * Generate registration request
     *
     * @return a JWT that can be used to register the TPP
     */
    private String generate(SSA ssa) {

        JWTClaimsSet.Builder requestParameterClaims;
        requestParameterClaims = new JWTClaimsSet.Builder();
        requestParameterClaims.expirationTime(new Date(new Date().getTime() + Duration.standardDays(7).getMillis()));
        Map<String, Object> requestAsClaims = objectMapper.convertValue(ssa, Map.class);
        for(Map.Entry<String, Object> entry : requestAsClaims.entrySet()) {
            requestParameterClaims.claim(entry.getKey(), entry.getValue());
        }
        return cryptoApiClient.signClaims(forgeRockDirectoryConfiguration.getId(), requestParameterClaims.build(), false);
    }

}
