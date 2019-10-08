/**
 * Copyright 2019 ForgeRock AS. All Rights Reserved
 *
 * Use of this code requires a commercial software license with ForgeRock AS.
 * or with one of its affiliates. All use shall be exclusively subject
 * to such license between the licensee and ForgeRock AS.
 */
package com.forgerock.openbanking.directory.api.user;

import com.forgerock.openbanking.directory.model.Organisation;
import com.forgerock.openbanking.directory.model.DirectoryUser;
import com.forgerock.openbanking.directory.repository.OrganisationRepository;
import com.forgerock.openbanking.directory.repository.DirectoryUserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletResponse;
import java.security.Principal;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/api/user/monitoring")
public class DirectoryUserApiController {

    @Autowired
    private OrganisationRepository organisationRepository;
    @Autowired
    private DirectoryUserRepository directoryUserRepository;


    @PreAuthorize("hasAnyAuthority('ROLE_FORGEROCK_INTERNAL_APP')")
    @RequestMapping(value = "/", method = RequestMethod.GET)
    public ResponseEntity getUser(
            HttpServletResponse response,
            Principal principal
    ) {
        log.debug("Attempt to get user: {}", principal);
        User userDetails = (User) ((Authentication) principal).getPrincipal();
        Optional<DirectoryUser> isUser = directoryUserRepository.findById(userDetails.getUsername());
        DirectoryUser directoryUser;
        if (isUser.isEmpty()) {
            directoryUser = new DirectoryUser();
            directoryUser.setId(userDetails.getUsername());
            directoryUser.setAuthorities(userDetails.getAuthorities().stream().map(GrantedAuthority::getAuthority).collect(Collectors.toList()));
            Organisation organisation = new Organisation();
            organisation.setName(userDetails.getUsername());
            organisation = organisationRepository.save(organisation);
            directoryUser.setOrganisationId(organisation.getId());
            directoryUser = directoryUserRepository.save(directoryUser);
        } else {
            directoryUser = isUser.get();
        }
        return ResponseEntity.ok(directoryUser);
    }
}
