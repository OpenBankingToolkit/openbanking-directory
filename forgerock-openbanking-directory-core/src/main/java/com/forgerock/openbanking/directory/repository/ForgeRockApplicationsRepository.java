/**
 * Copyright 2019 ForgeRock AS. All Rights Reserved
 *
 * Use of this code requires a commercial software license with ForgeRock AS.
 * or with one of its affiliates. All use shall be exclusively subject
 * to such license between the licensee and ForgeRock AS.
 */
package com.forgerock.openbanking.directory.repository;


import com.forgerock.openbanking.core.model.ForgeRockApplication;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ForgeRockApplicationsRepository extends MongoRepository<ForgeRockApplication, String> {
}
