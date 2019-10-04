/**
 * Copyright 2019 ForgeRock AS. All Rights Reserved
 *
 * Use of this code requires a commercial software license with ForgeRock AS.
 * or with one of its affiliates. All use shall be exclusively subject
 * to such license between the licensee and ForgeRock AS.
 */
package com.forgerock.openbanking.directory.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@ConfigurationProperties(prefix = "directory-data")
public class DirectoryDataConfig {

    private List<Aspsp> aspsps;

    public DirectoryDataConfig(List<Aspsp> aspsps) {
        this.aspsps = aspsps;
    }

    public List<Aspsp> getAspsps() {
        return aspsps;
    }

}
