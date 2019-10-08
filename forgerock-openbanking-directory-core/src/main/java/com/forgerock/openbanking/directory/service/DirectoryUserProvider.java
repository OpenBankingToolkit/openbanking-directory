/**
 * Copyright 2019 ForgeRock AS. All Rights Reserved
 *
 * Use of this code requires a commercial software license with ForgeRock AS.
 * or with one of its affiliates. All use shall be exclusively subject
 * to such license between the licensee and ForgeRock AS.
 */
package com.forgerock.openbanking.directory.service;

import com.forgerock.openbanking.auth.services.UserProvider;
import com.forgerock.openbanking.directory.model.Organisation;
import com.forgerock.openbanking.directory.repository.OrganisationRepository;
import com.forgerock.openbanking.directory.repository.DirectoryUserRepository;
import lombok.Getter;
import org.springframework.context.annotation.Primary;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;

import java.util.Collection;
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
        Optional<com.forgerock.openbanking.directory.model.DirectoryUser> user = directoryUserRepository.findById(authentication.getName());
        if (user.isEmpty()) {
            return authentication.getDetails();
        }
        Optional<Organisation> organisation = organisationRepository.findById(user.get().getOrganisationId());
        if (organisation.isEmpty()) {
            return authentication.getDetails();
        }
        return new DirectoryUser(authentication.getName(), authentication.getAuthorities().stream().map(GrantedAuthority::toString).collect(Collectors.toList()), organisation.get().getId());
    }

    @Getter
    static class DirectoryUser extends com.forgerock.openbanking.auth.model.User {

        private String organisationId;

        DirectoryUser(String id, Collection<String> authorities, String organisationId) {
            super(id, authorities);
            this.organisationId = organisationId;
        }

    }

}
