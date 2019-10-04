/**
 * Copyright 2019 ForgeRock AS. All Rights Reserved
 *
 * Use of this code requires a commercial software license with ForgeRock AS.
 * or with one of its affiliates. All use shall be exclusively subject
 * to such license between the licensee and ForgeRock AS.
 */
package com.forgerock.openbanking.directory.api.forgerockapplications;

import com.forgerock.openbanking.core.model.ForgeRockApplication;
import com.forgerock.openbanking.directory.repository.ForgeRockApplicationsRepository;
import com.forgerock.openbanking.directory.repository.SoftwareStatementRepository;
import com.forgerock.openbanking.model.SoftwareStatement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;
import java.util.Optional;

@RestController
public class ForgeRockApplicationsApiController implements ForgeRockApplicationsApi {
    @Autowired
    private ForgeRockApplicationsRepository forgeRockApplicationsRepository;
    @Autowired
    private SoftwareStatementRepository softwareStatementRepository;

    @Override
    @RequestMapping(value = "/", method = RequestMethod.GET)
    public ResponseEntity<List<ForgeRockApplication>> getForgeRockApplications(
            Principal principal
    ) {
        return ResponseEntity.ok(forgeRockApplicationsRepository.findAll());
    }

    @Override
    @RequestMapping(value = "/{applicationId}/connect-software-statement/{softwareStatementId}", method = RequestMethod.POST)
    public ResponseEntity connect(
            @PathVariable("applicationId") String applicationId,
            @PathVariable("softwareStatementId") String softwareStatementId,
            Principal principal
    ) {
        Optional<ForgeRockApplication> isForgeRockApp = forgeRockApplicationsRepository.findById(applicationId);
        if (!isForgeRockApp.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("ForgeRock app not found");
        }
        ForgeRockApplication forgeRockApplication = isForgeRockApp.get();
        Optional<SoftwareStatement> isSoftwareStatement = softwareStatementRepository.findById(softwareStatementId);
        if (!isSoftwareStatement.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Software statement not found");
        }
        SoftwareStatement softwareStatement = isSoftwareStatement.get();
        forgeRockApplication.setSoftwareStatementId(softwareStatementId);
        softwareStatement.setApplicationId(forgeRockApplication.getApplicationId());
        softwareStatementRepository.save(softwareStatement);
        forgeRockApplicationsRepository.save(forgeRockApplication);
        return ResponseEntity.ok("");
    }
}
