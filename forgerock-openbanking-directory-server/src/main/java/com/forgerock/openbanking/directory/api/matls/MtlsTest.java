/**
 * Copyright 2019 ForgeRock AS. All Rights Reserved
 *
 * Use of this code requires a commercial software license with ForgeRock AS.
 * or with one of its affiliates. All use shall be exclusively subject
 * to such license between the licensee and ForgeRock AS.
 */
package com.forgerock.openbanking.directory.api.matls;

import com.forgerock.openbanking.authentication.model.authentication.PasswordLessUserNameAuthentication;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import java.security.Principal;
import java.util.Collection;

@Api(
        tags = "MATLS",
        description = "Testing your MATLS setup"
)
@Controller
@RequestMapping("/api/matls")
public class MtlsTest {

    public static class MtlsTestResponse {
        public String issuerId;
        public Collection<? extends GrantedAuthority> authorities;
    }

    @ApiOperation(value = "Test your MATLS setup")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Your identity", response = MtlsTestResponse.class),

    })
    @RequestMapping(value = "/test", method = RequestMethod.GET)
    public ResponseEntity<MtlsTestResponse> mtlsTest(Authentication authentication) {

        MtlsTestResponse response = new MtlsTestResponse();
        if (authentication == null) {
            return ResponseEntity.ok(response);
        }
        User currentUser = (User) authentication.getPrincipal();
        response.issuerId = currentUser.getUsername();
        response.authorities = currentUser.getAuthorities();
        return ResponseEntity.ok(response);
    }
}
