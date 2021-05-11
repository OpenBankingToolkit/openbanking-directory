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
package com.forgerock.openbanking.directory;

import brave.Tracer;
import com.forgerock.openbanking.directory.error.ErrorHandler;
import com.forgerock.openbanking.directory.model.User;
import com.forgerock.openbanking.directory.model.Organisation;
import com.forgerock.openbanking.directory.repository.DirectoryUserRepository;
import com.forgerock.openbanking.directory.repository.ForgeRockApplicationsRepository;
import com.forgerock.openbanking.directory.repository.OrganisationRepository;
import com.forgerock.openbanking.directory.security.FormValueSanitisationFilter;
import com.forgerock.openbanking.directory.security.JsonRequestSanitisiationFilter;
import com.forgerock.openbanking.model.OBRIRole;
import com.google.common.collect.Sets;
import com.forgerock.spring.security.multiauth.configurers.MultiAuthenticationCollectorConfigurer;
import com.forgerock.spring.security.multiauth.configurers.collectors.CustomJwtCookieCollector;
import com.forgerock.spring.security.multiauth.configurers.collectors.StaticUserCollector;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.client.RestTemplate;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

import javax.servlet.Filter;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@SpringBootApplication
@EnableSwagger2
@EnableDiscoveryClient
@EnableScheduling
@EnableWebSecurity
@ComponentScan(basePackages = {"com.forgerock"})
@EnableMongoRepositories(basePackages = "com.forgerock")
public class ForgerockOpenbankingDirectoryApplication {
    public static void main(String[] args) {
        SpringApplication.run(ForgerockOpenbankingDirectoryApplication.class, args);
    }

    @Configuration
    static class CookieWebSecurityConfigurerAdapter extends WebSecurityConfigurerAdapter {

        @Autowired
        private DirectoryUserRepository directoryUserRepository;
        @Autowired
        private OrganisationRepository organisationRepository;

        @Override
        public void init(WebSecurity web) throws Exception {
            super.init(web);
            User demoDirectoryUser = User.builder()
                    .id("demo")
                    .authorities(Sets.newHashSet(
                            OBRIRole.ROLE_SOFTWARE_STATEMENT.toString(),
                            OBRIRole.ROLE_USER.toString()))
                    .organisationId("forgerock")
                    .build();
            directoryUserRepository.save(demoDirectoryUser);
            organisationRepository.save(Organisation.builder().id("forgerock").name("demo").build());
        }

        @Override
        protected void configure(HttpSecurity http) throws Exception {
            http

                    .csrf().disable() // We don't need CSRF for JWT based authentication
                    .authorizeRequests()
                    .anyRequest()
                    .permitAll()//.authenticated()
                    .and()
                    .authenticationProvider(new CustomAuthProvider())
                    .apply(new MultiAuthenticationCollectorConfigurer<HttpSecurity>()
                            .collector(StaticUserCollector.builder()
                                    .usernameCollector(() -> "demo")
                                    .grantedAuthorities(Sets.newHashSet(
                                            OBRIRole.ROLE_SOFTWARE_STATEMENT,
                                            OBRIRole.ROLE_USER
                                    ))
                                    .build())
                            .collector(CustomJwtCookieCollector.builder()
                                    .cookieName("obri-session")
                                    .authoritiesCollector(t -> Stream.of(
                                            OBRIRole.ROLE_SOFTWARE_STATEMENT,
                                            OBRIRole.ROLE_USER
                                    ).collect(Collectors.toSet()))
                                    .build())
                    )
            ;
        }
    }

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

    public static class CustomAuthProvider implements AuthenticationProvider {

        @Autowired
        private ForgeRockApplicationsRepository forgeRockApplicationsRepository;

        @Override
        public Authentication authenticate(Authentication authentication) throws AuthenticationException {
            //You can load more GrantedAuthority based on the user subject, like loading the TPP details from the software ID
            return authentication;
        }

        @Override
        public boolean supports(Class<?> aClass) {
            return true;
        }
    }

    @Bean
    public Filter jsonSanitisationFilter(ErrorHandler errorHandler, Tracer tracer) {
        return new JsonRequestSanitisiationFilter(errorHandler, tracer);
    }

    @Bean
    public Filter formSanitisationFilter(ErrorHandler errorHandler, Tracer tracer) {
        return new FormValueSanitisationFilter(errorHandler, tracer);
    }

}
