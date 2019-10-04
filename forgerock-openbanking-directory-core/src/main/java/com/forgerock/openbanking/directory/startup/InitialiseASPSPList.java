/**
 * Copyright 2019 ForgeRock AS. All Rights Reserved
 *
 * Use of this code requires a commercial software license with ForgeRock AS.
 * or with one of its affiliates. All use shall be exclusively subject
 * to such license between the licensee and ForgeRock AS.
 */
package com.forgerock.openbanking.directory.startup;

import com.forgerock.openbanking.directory.config.DirectoryDataConfig;
import com.forgerock.openbanking.directory.repository.AspspRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
public class InitialiseASPSPList {

    @Autowired
    private AspspRepository aspspRepository;
    @Autowired
    private DirectoryDataConfig directoryDataConfig;

    @EventListener(ContextRefreshedEvent.class)
    public void contextRefreshedEvent() {
        aspspRepository.deleteAll();
        aspspRepository.saveAll(directoryDataConfig.getAspsps());
    }
}
