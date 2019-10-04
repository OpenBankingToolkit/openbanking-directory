/**
 * Copyright 2019 ForgeRock AS. All Rights Reserved
 *
 * Use of this code requires a commercial software license with ForgeRock AS.
 * or with one of its affiliates. All use shall be exclusively subject
 * to such license between the licensee and ForgeRock AS.
 */
package com.forgerock.openbanking.directory.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DirectoryConfig {

    @Value("${am.cookie.name}")
    private String amCookieName;

    public String getAmCookieName() {
        return amCookieName;
    }

    public void setAmCookieName(String amCookieName) {
        this.amCookieName = amCookieName;
    }
}
