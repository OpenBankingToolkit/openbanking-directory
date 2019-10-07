/**
 * Copyright 2019 ForgeRock AS. All Rights Reserved
 *
 * Use of this code requires a commercial software license with ForgeRock AS.
 * or with one of its affiliates. All use shall be exclusively subject
 * to such license between the licensee and ForgeRock AS.
 */
package com.forgerock.openbanking.directory.config;

import lombok.Data;

@Data
public class Aspsp {
    private String id;
    private String name;
    private String logoUri;
    private String financialId;
    private String asDiscoveryEndpoint;
    private String rsDiscoveryEndpoint;
    private String testMtlsEndpoint;
    private String transportKeys;
}
