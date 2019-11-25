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

import com.forgerock.openbanking.auth.services.UserProvider;
import com.forgerock.openbanking.directory.model.DirectoryUser;
import com.forgerock.openbanking.directory.model.Organisation;
import com.forgerock.openbanking.directory.repository.DirectoryUserRepository;
import com.forgerock.openbanking.directory.repository.OrganisationRepository;
import org.springframework.context.annotation.Primary;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.stream.Collectors;

@Primary
@Service
public class DirectoryUserProvider implements UserProvider {

    private OrganisationRepository organisationRepository;
    private DirectoryUserRepository directoryUserRepository;

    public DirectoryUserProvider(OrganisationRepository organisationRepository, DirectoryUserRepository directoryUserRepository) {
        this.organisationRepository = organisationRepository;
        this.directoryUserRepository = directoryUserRepository;
    }

    @Override
    public Object getUser(Authentication authentication) {
        User userDetails = (User) authentication.getPrincipal();
        Optional<DirectoryUser> isUser = directoryUserRepository.findById(((User) authentication.getPrincipal()).getUsername());
        DirectoryUser user = isUser.orElseGet(() -> {
            DirectoryUser directoryUser = new DirectoryUser();
            directoryUser.setId(userDetails.getUsername());
            directoryUser.setAuthorities(userDetails.getAuthorities().stream().map(GrantedAuthority::getAuthority).collect(Collectors.toList()));
            Organisation organisation = new Organisation();
            organisation.setName(userDetails.getUsername());
            organisation = organisationRepository.save(organisation);
            directoryUser.setOrganisationId(organisation.getId());
            return directoryUserRepository.save(directoryUser);
        });
        Optional<Organisation> organisation = organisationRepository.findById(user.getOrganisationId());
        if (organisation.isEmpty()) {
            return authentication.getDetails();
        }
        return new DirectoryUser(authentication.getName(), organisation.get().getId(),  authentication.getAuthorities().stream().map(GrantedAuthority::toString).collect(Collectors.toList()));
    }

}
