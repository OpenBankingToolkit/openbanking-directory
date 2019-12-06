/**
 * Copyright 2019 ForgeRock AS. All Rights Reserved
 *
 * Use of this code requires a commercial software license with ForgeRock AS.
 * or with one of its affiliates. All use shall be exclusively subject
 * to such license between the licensee and ForgeRock AS.
 */
package com.forgerock.openbanking.directory.api.user;

import com.forgerock.openbanking.am.gateway.AMAuthGateway;
import com.forgerock.openbanking.analytics.model.entries.SessionCounterType;
import com.forgerock.openbanking.auth.services.SessionService;
import com.forgerock.openbanking.authentication.model.authentication.PasswordLessUserNameAuthentication;
import com.forgerock.openbanking.directory.model.Organisation;
import com.forgerock.openbanking.directory.model.DirectoryUser;
import com.forgerock.openbanking.directory.repository.OrganisationRepository;
import com.forgerock.openbanking.directory.repository.DirectoryUserRepository;
import com.forgerock.openbanking.exceptions.OBErrorException;
import com.forgerock.openbanking.exceptions.OIDCException;
import com.forgerock.openbanking.model.JwtAuthenticationToken;
import com.forgerock.openbanking.model.UserContext;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.web.authentication.preauth.PreAuthenticatedAuthenticationToken;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletResponse;
import java.security.Principal;
import java.security.cert.X509Certificate;
import java.util.Collections;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/api/user")
public class DirectoryUserApiController {

    @Autowired
    private OrganisationRepository organisationRepository;
    @Autowired
    private DirectoryUserRepository directoryUserRepository;
    @Autowired
    private SessionService sessionService;
    @Value("${am.internal.oidc.endpoint.accesstoken}")
    public String amAccessTokenEndpoint;
    @Autowired
    private AMAuthGateway amGateway;


    @PreAuthorize("hasAnyAuthority('ROLE_FORGEROCK_INTERNAL_APP')")
    @RequestMapping(value = "/monitoring", method = RequestMethod.GET)
    public ResponseEntity getUser(
            HttpServletResponse response,
            Authentication authentication
    ) {
        log.debug("Attempt to get user: {}", authentication);
        User userDetails = (User) authentication.getPrincipal();
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

    @ApiOperation(value = "Authenticate user",
            authorizations = {})
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "The user ID token"),
    })
    @RequestMapping(value = "/authenticate", method = RequestMethod.POST)
    public ResponseEntity authenticate(
            @RequestParam(value = "username") String username,
            @RequestParam(value = "password") String password,
            Authentication authentication
    ) throws OBErrorException {
        try {
            return ResponseEntity.ok(sessionService.authenticate(username, password, authentication, SessionCounterType.DIRECTORY, amGateway, amAccessTokenEndpoint, new X509Certificate[0], (User) authentication.getPrincipal()));
        } catch (OIDCException e) {
            log.error("OIDC exception", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}
