/**
 * Copyright 2019 ForgeRock AS. All Rights Reserved
 *
 * Use of this code requires a commercial software license with ForgeRock AS.
 * or with one of its affiliates. All use shall be exclusively subject
 * to such license between the licensee and ForgeRock AS.
 */
package com.forgerock.openbanking.directory.api.user;

import com.forgerock.openbanking.authentication.model.authentication.PasswordLessUserNameAuthentication;
import com.forgerock.openbanking.directory.model.Organisation;
import com.forgerock.openbanking.directory.model.User;
import com.forgerock.openbanking.directory.repository.OrganisationRepository;
import com.forgerock.openbanking.directory.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.GrantedAuthority;
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
    private UserRepository userRepository;


    @PreAuthorize("hasAnyAuthority('ROLE_FORGEROCK_INTERNAL_APP')")
    @RequestMapping(value = "/", method = RequestMethod.GET)
    public ResponseEntity getUser(
            HttpServletResponse response,
            Principal principal
    ) {
        log.debug("Attempt to get user: {}", principal);
        PasswordLessUserNameAuthentication userDetails = (PasswordLessUserNameAuthentication) principal;
        Optional<User> isUser = userRepository.findById(userDetails.getPrincipal().toString());
        User user;
        if (isUser.isEmpty()) {
            user = new User();
            user.setId(userDetails.getPrincipal().toString());
            user.setAuthorities(userDetails.getAuthorities().stream().map(GrantedAuthority::getAuthority).collect(Collectors.toList()));
            user.setId(userDetails.getPrincipal().toString());
            Organisation organisation = new Organisation();
            organisation.setName(userDetails.getPrincipal().toString());
            organisation = organisationRepository.save(organisation);
            user.setOrganisationId(organisation.getId());
            user = userRepository.save(user);
        } else {
            user = isUser.get();
        }
        return ResponseEntity.ok(user);
    }
}
