/**
 * Copyright 2019 ForgeRock AS. All Rights Reserved
 *
 * Use of this code requires a commercial software license with ForgeRock AS.
 * or with one of its affiliates. All use shall be exclusively subject
 * to such license between the licensee and ForgeRock AS.
 */
package com.forgerock.openbanking.directory.repository;

import com.forgerock.openbanking.model.SoftwareStatement;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SoftwareStatementRepository extends MongoRepository<SoftwareStatement, String> {

    List<SoftwareStatement> findByApplicationId(@Param("applicationId") String applicationId);

}
