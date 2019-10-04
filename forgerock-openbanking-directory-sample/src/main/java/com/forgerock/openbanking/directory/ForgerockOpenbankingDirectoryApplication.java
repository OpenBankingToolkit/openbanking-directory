/**
 * Copyright 2019 ForgeRock AS. All Rights Reserved
 *
 * Use of this code requires a commercial software license with ForgeRock AS.
 * or with one of its affiliates. All use shall be exclusively subject
 * to such license between the licensee and ForgeRock AS.
 */
package com.forgerock.openbanking.directory;

import brave.Tracer;
import com.forgerock.openbanking.authentication.configurers.MultiAuthenticationCollectorConfigurer;
import com.forgerock.openbanking.authentication.configurers.collectors.StaticUserCollector;
import com.forgerock.openbanking.directory.error.ErrorHandler;
import com.forgerock.openbanking.directory.repository.ForgeRockApplicationsRepository;
import com.forgerock.openbanking.directory.security.FormValueSanitisationFilter;
import com.forgerock.openbanking.directory.security.JsonRequestSanitisiationFilter;
import com.forgerock.openbanking.model.OBRIRole;
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
									.usernameCollector( () -> "anonymous")
									.grantedAuthorities(Stream.of(
											OBRIRole.ROLE_FORGEROCK_EXTERNAL_APP,
											OBRIRole.UNREGISTERED_TPP
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
