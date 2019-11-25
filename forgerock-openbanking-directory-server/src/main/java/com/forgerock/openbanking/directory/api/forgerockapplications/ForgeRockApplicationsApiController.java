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
import com.forgerock.openbanking.directory.repository.ForgeRockApplicationsRepository;
import com.forgerock.openbanking.directory.repository.SoftwareStatementRepository;
import com.forgerock.openbanking.model.SoftwareStatement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@RestController
public class ForgeRockApplicationsApiController implements ForgeRockApplicationsApi {
    @Autowired
    private ForgeRockApplicationsRepository forgeRockApplicationsRepository;
    @Autowired
    private SoftwareStatementRepository softwareStatementRepository;

    @Override
    @RequestMapping(value = "/", method = RequestMethod.GET)
    public ResponseEntity<List<ForgeRockApplication>> getForgeRockApplications() {
        return ResponseEntity.ok(forgeRockApplicationsRepository.findAll());
    }

    @Override
    @RequestMapping(value = "/{applicationId}/connect-software-statement/{softwareStatementId}", method = RequestMethod.POST)
    public ResponseEntity connect(
            @PathVariable("applicationId") String applicationId,
            @PathVariable("softwareStatementId") String softwareStatementId
    ) {
        Optional<ForgeRockApplication> isForgeRockApp = forgeRockApplicationsRepository.findById(applicationId);
        if (isForgeRockApp.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("ForgeRock app not found");
        }
        ForgeRockApplication forgeRockApplication = isForgeRockApp.get();
        Optional<SoftwareStatement> isSoftwareStatement = softwareStatementRepository.findById(softwareStatementId);
        if (isSoftwareStatement.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Software statement not found");
        }
        SoftwareStatement softwareStatement = isSoftwareStatement.get();
        forgeRockApplication.setSoftwareStatementId(softwareStatementId);
        softwareStatement.setApplicationId(forgeRockApplication.getApplicationId());
        softwareStatementRepository.save(softwareStatement);
        forgeRockApplicationsRepository.save(forgeRockApplication);
        return ResponseEntity.ok("");
    }
}
