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

import com.forgerock.openbanking.analytics.model.entries.DirectoryCounterType;
import com.forgerock.openbanking.analytics.services.DirectoryCountersKPIService;
import com.forgerock.openbanking.directory.model.Organisation;
import com.forgerock.openbanking.directory.model.DirectoryUser;
import com.forgerock.openbanking.directory.repository.OrganisationRepository;
import com.forgerock.openbanking.directory.repository.SoftwareStatementRepository;
import com.forgerock.openbanking.directory.repository.DirectoryUserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@RestController
public class OrganisationApiController implements OrganisationApi {
    private static final Logger LOGGER = LoggerFactory.getLogger(OrganisationApiController.class);

    @Autowired
    private DirectoryUserRepository directoryUserRepository;
    @Autowired
    private OrganisationRepository organisationRepository;
    @Autowired
    private SoftwareStatementRepository softwareStatementRepository;
    @Autowired
    private DirectoryCountersKPIService directoryCountersKPIService;

    @Override
    @RequestMapping(value = "/", method = RequestMethod.GET)
    public ResponseEntity<List<Organisation>> getAllOrganisation(
            Authentication authentication
    ) {
        return ResponseEntity.ok(organisationRepository.findAll());
    }

    @Override
    @RequestMapping(value = "/", method = RequestMethod.POST)
    public ResponseEntity<Organisation> create(
            @RequestBody Organisation organisation,
            Authentication authentication) {
        LOGGER.debug("authentication :" + authentication);
        directoryCountersKPIService.incrementTokenUsage(DirectoryCounterType.ORGANISATION_REGISTERED);
        return ResponseEntity.status(HttpStatus.CREATED).body(organisationRepository.save(organisation));
    }

    @Override
    @RequestMapping(value = "/{organisationId}", method = RequestMethod.GET)
    public ResponseEntity read(
            @PathVariable String organisationId,
            Authentication authentication) {
        LOGGER.debug("authentication :" + authentication);
        User userDetails = (User) authentication.getPrincipal();
        Optional<DirectoryUser> isUser = directoryUserRepository.findById(userDetails.getUsername());
        if (isUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authorised");
        }
        DirectoryUser directoryUser = isUser.get();
        if (!directoryUser.getOrganisationId().equals(organisationId)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authorised");
        }

        Optional<Organisation> isOrganisation = organisationRepository.findById(organisationId);
        if (isOrganisation.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Organisation not found");
        }
        Organisation organisation = isOrganisation.get();
        return ResponseEntity.ok(organisation);
    }

    @Override
    @RequestMapping(value = "/{organisationId}", method = RequestMethod.PUT)
    public ResponseEntity<Organisation> update(
            @PathVariable String organisationId,
            @RequestBody Organisation organisation,
            Authentication authentication) {
        LOGGER.debug("authentication :" + authentication);
        return ResponseEntity.ok(organisationRepository.save(organisation));
    }


    @Override
    @RequestMapping(value = "/{organisationId}/software-statements", method = RequestMethod.GET)
    public ResponseEntity readSoftwareStatements(
            @PathVariable String organisationId,
            Authentication authentication
    ) {
        User userDetails = (User) authentication.getPrincipal();

        Optional<DirectoryUser> isUser = directoryUserRepository.findById(userDetails.getUsername());
        if (isUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authorised");
        }
        DirectoryUser directoryUser = isUser.get();
        if (directoryUser.getId().equals(organisationId)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authorised");
        }

        Optional<Organisation> isOrganisation = organisationRepository.findById(organisationId);
        if (isOrganisation.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Organisation not found");
        }
        Organisation organisation = isOrganisation.get();
        return ResponseEntity.ok(softwareStatementRepository.findAllById(organisation.getSoftwareStatementIds()));
    }

    @Override
    @RequestMapping(value = "/{organisationId}/software-statements", method = RequestMethod.DELETE)
    public ResponseEntity deleteSoftwareStatements(
            @PathVariable String organisationId,
            Authentication authentication
    ) {
        User userDetails = (User) authentication.getPrincipal();
        Optional<DirectoryUser> isUser = directoryUserRepository.findById(userDetails.getUsername());
        if (isUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authorised");
        }
        DirectoryUser directoryUser = isUser.get();
        if (directoryUser.getId().equals(organisationId)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authorised");
        }

        Optional<Organisation> isOrganisation = organisationRepository.findById(organisationId);
        if (isOrganisation.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Organisation not found");
        }
        Organisation organisation = isOrganisation.get();
        organisation.getSoftwareStatementIds().forEach(s -> softwareStatementRepository.deleteById(s));
        organisation.setSoftwareStatementIds(Collections.emptyList());
        return ResponseEntity.ok("All software statements deleted");
    }
}
