/**
 * Copyright 2019 ForgeRock AS. All Rights Reserved
 *
 * Use of this code requires a commercial software license with ForgeRock AS.
 * or with one of its affiliates. All use shall be exclusively subject
 * to such license between the licensee and ForgeRock AS.
 */
package com.forgerock.openbanking.directory.api.softwarestatement;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.forgerock.openbanking.core.model.Application;
import com.forgerock.openbanking.core.services.ApplicationApiClient;
import com.forgerock.openbanking.directory.model.Organisation;
import com.forgerock.openbanking.directory.repository.OrganisationRepository;
import com.forgerock.openbanking.directory.repository.SoftwareStatementRepository;
import com.forgerock.openbanking.model.SoftwareStatement;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.Collections;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@SpringBootTest
@AutoConfigureMockMvc
public class SoftwareStatementApiControllerIT {

    @MockBean
    private ApplicationApiClient applicationApiClient;
    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ObjectMapper mapper;
    @Autowired
    private SoftwareStatementRepository softwareStatementRepository;
    @Autowired
    private OrganisationRepository organisationRepository;
    @Autowired
    private String organisationId;
    @Autowired
    private String userId;

    @Test
    public void shouldCreateSoftwareStatement() throws Exception {
        // Given
        organisationRepository.save(Organisation.builder().id(organisationId).build());
        given(applicationApiClient.createApplication(any())).willReturn(new Application());
        SoftwareStatement softwareStatement = new SoftwareStatement();

        // When
        mockMvc.perform(post("/api/software-statement/")
                .content(mapper.writeValueAsString(softwareStatement))
                .contentType(MediaType.APPLICATION_JSON))

                // Then
                .andExpect(status().isCreated());
    }

    @Test
    public void shouldGetSoftwareStatement() throws Exception {
        // Given
        SoftwareStatement softwareStatement = new SoftwareStatement();
        softwareStatement.setId(UUID.randomUUID().toString());
        softwareStatementRepository.save(softwareStatement);
        organisationRepository.save(Organisation.builder().id(organisationId).softwareStatementIds(Collections.singletonList(softwareStatement.getId())).build());

        // When
        mockMvc.perform(get("/api/software-statement/" + softwareStatement.getId())
                .content(mapper.writeValueAsString(softwareStatement))
                .contentType(MediaType.APPLICATION_JSON))

                // Then
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(softwareStatement.getId()));
    }

    @Test
    public void shouldGetPublicJwk() throws Exception {
        // Given
        SoftwareStatement softwareStatement = new SoftwareStatement();
        softwareStatement.setId(UUID.randomUUID().toString());
        softwareStatementRepository.save(softwareStatement);
        organisationRepository.save(Organisation.builder().id(organisationId).softwareStatementIds(Collections.singletonList(softwareStatement.getId())).build());

        // When
        mockMvc.perform(get("/api/software-statement/{softwareStatementId}/application/{kid}/download/publicJwk", softwareStatement.getId(), "someKidId"))

                // Then
                .andExpect(status().isOk());
    }

    @Test
    public void shouldNotGetPublicJwkOfOtherOrganisation() throws Exception {
        // Given
        SoftwareStatement oneStatement = new SoftwareStatement();
        oneStatement.setId(UUID.randomUUID().toString());
        SoftwareStatement anotherStatement = new SoftwareStatement();
        anotherStatement.setId(UUID.randomUUID().toString());
        softwareStatementRepository.saveAll(Arrays.asList(oneStatement, anotherStatement));
        organisationRepository.save(Organisation.builder().id(organisationId).softwareStatementIds(Collections.singletonList(oneStatement.getId())).build());
        organisationRepository.save(Organisation.builder().id("anotherOrg").softwareStatementIds(Collections.singletonList(anotherStatement.getId())).build());

        // When
        mockMvc.perform(get("/api/software-statement/{softwareStatementId}/application/{kid}/download/publicJwk", anotherStatement.getId(), "someKidId"))

                // Then
                .andExpect(status().isUnauthorized());
    }

    @Test
    public void shouldGetPrivateJwk() throws Exception {
        // Given
        SoftwareStatement softwareStatement = new SoftwareStatement();
        softwareStatement.setId(UUID.randomUUID().toString());
        softwareStatementRepository.save(softwareStatement);
        organisationRepository.save(Organisation.builder().id(organisationId).softwareStatementIds(Collections.singletonList(softwareStatement.getId())).build());

        // When
        mockMvc.perform(get("/api/software-statement/{softwareStatementId}/application/{kid}/download/privateJwk", softwareStatement.getId(), "someKidId"))

                // Then
                .andExpect(status().isOk());
    }

    @Test
    public void shouldNotGetPrivateJwkOfOtherOrganisation() throws Exception {
        // Given
        SoftwareStatement oneStatement = new SoftwareStatement();
        oneStatement.setId(UUID.randomUUID().toString());
        SoftwareStatement anotherStatement = new SoftwareStatement();
        anotherStatement.setId(UUID.randomUUID().toString());
        softwareStatementRepository.saveAll(Arrays.asList(oneStatement, anotherStatement));
        organisationRepository.save(Organisation.builder().id(organisationId).softwareStatementIds(Collections.singletonList(oneStatement.getId())).build());
        organisationRepository.save(Organisation.builder().id("anotherOrg").softwareStatementIds(Collections.singletonList(anotherStatement.getId())).build());

        // When
        mockMvc.perform(get("/api/software-statement/{softwareStatementId}/application/{kid}/download/privateJwk", anotherStatement.getId(), "someKidId"))

                // Then
                .andExpect(status().isUnauthorized());
    }

    @Test
    public void shouldGetPublicCert() throws Exception {
        // Given
        SoftwareStatement softwareStatement = new SoftwareStatement();
        softwareStatement.setId(UUID.randomUUID().toString());
        softwareStatementRepository.save(softwareStatement);
        organisationRepository.save(Organisation.builder().id(organisationId).softwareStatementIds(Collections.singletonList(softwareStatement.getId())).build());

        // When
        mockMvc.perform(get("/api/software-statement/{softwareStatementId}/application/{kid}/download/publicCert", softwareStatement.getId(), "someKidId"))

                // Then
                .andExpect(status().isOk());
    }

    @Test
    public void shouldNotGetPublicCertOfOtherOrganisation() throws Exception {
        // Given
        SoftwareStatement oneStatement = new SoftwareStatement();
        oneStatement.setId(UUID.randomUUID().toString());
        SoftwareStatement anotherStatement = new SoftwareStatement();
        anotherStatement.setId(UUID.randomUUID().toString());
        softwareStatementRepository.saveAll(Arrays.asList(oneStatement, anotherStatement));
        organisationRepository.save(Organisation.builder().id(organisationId).softwareStatementIds(Collections.singletonList(oneStatement.getId())).build());
        organisationRepository.save(Organisation.builder().id("anotherOrg").softwareStatementIds(Collections.singletonList(anotherStatement.getId())).build());

        // When
        mockMvc.perform(get("/api/software-statement/{softwareStatementId}/application/{kid}/download/publicCert", anotherStatement.getId(), "someKidId"))

                // Then
                .andExpect(status().isUnauthorized());
    }

    @Test
    public void shouldGetPrivateCert() throws Exception {
        // Given
        SoftwareStatement softwareStatement = new SoftwareStatement();
        softwareStatement.setId(UUID.randomUUID().toString());
        softwareStatementRepository.save(softwareStatement);
        organisationRepository.save(Organisation.builder().id(organisationId).softwareStatementIds(Collections.singletonList(softwareStatement.getId())).build());

        // When
        mockMvc.perform(get("/api/software-statement/{softwareStatementId}/application/{kid}/download/privateCert", softwareStatement.getId(), "someKidId"))

                // Then
                .andExpect(status().isOk());
    }

    @Test
    public void shouldNotGetPrivateCertOfOtherOrganisation() throws Exception {
        // Given
        SoftwareStatement oneStatement = new SoftwareStatement();
        oneStatement.setId(UUID.randomUUID().toString());
        SoftwareStatement anotherStatement = new SoftwareStatement();
        anotherStatement.setId(UUID.randomUUID().toString());
        softwareStatementRepository.saveAll(Arrays.asList(oneStatement, anotherStatement));
        organisationRepository.save(Organisation.builder().id(organisationId).softwareStatementIds(Collections.singletonList(oneStatement.getId())).build());
        organisationRepository.save(Organisation.builder().id("anotherOrg").softwareStatementIds(Collections.singletonList(anotherStatement.getId())).build());

        // When
        mockMvc.perform(get("/api/software-statement/{softwareStatementId}/application/{kid}/download/privateCert", anotherStatement.getId(), "someKidId"))

                // Then
                .andExpect(status().isUnauthorized());
    }
}
