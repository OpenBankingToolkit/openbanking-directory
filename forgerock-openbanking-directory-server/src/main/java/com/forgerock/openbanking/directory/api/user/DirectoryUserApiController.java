/**
 * Copyright 2019 ForgeRock AS. All Rights Reserved
 *
 * Use of this code requires a commercial software license with ForgeRock AS.
 * or with one of its affiliates. All use shall be exclusively subject
 * to such license between the licensee and ForgeRock AS.
 */
package com.forgerock.openbanking.directory.api.user;

import com.forgerock.openbanking.directory.model.Organisation;
import com.forgerock.openbanking.directory.model.User;
import com.forgerock.openbanking.directory.repository.OrganisationRepository;
import com.forgerock.openbanking.directory.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletResponse;
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
            Authentication authentication
    ) {
        log.debug("Attempt to get user: {}", authentication);
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        Optional<User> isUser = userRepository.findById(userDetails.getUsername());
        User user;
        if (!isUser.isPresent()) {
            user = new User();
            user.setId(userDetails.getUsername());
            user.setAuthorities(authentication.getAuthorities().stream().map(a -> ((GrantedAuthority) a).getAuthority()).collect(Collectors.toList()));
            user.setId(userDetails.getUsername());
            Organisation organisation = new Organisation();
            organisation.setName(userDetails.getUsername());
            organisation = organisationRepository.save(organisation);
            user.setOrganisationId(organisation.getId());
            user = userRepository.save(user);
        } else {
            user = isUser.get();
        }
        return ResponseEntity.ok(user);
    }
}
