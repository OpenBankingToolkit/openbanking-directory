/**
 * Copyright 2019 ForgeRock AS. All Rights Reserved
 *
 * Use of this code requires a commercial software license with ForgeRock AS.
 * or with one of its affiliates. All use shall be exclusively subject
 * to such license between the licensee and ForgeRock AS.
 */
package com.forgerock.openbanking.directory.api.softwarestatement;

import com.forgerock.openbanking.model.oidc.OIDCRegistrationResponse;
import org.springframework.web.client.RestTemplate;

// TODO replace with aspsp client library
public interface AspspApiClient {

    String testMatls(RestTemplate restTemplate, String testMatlsEndpoint);

    OIDCRegistrationResponse getOnboardingResult(RestTemplate restTemplate, String onboardingEndpoint);

    OIDCRegistrationResponse onboard(RestTemplate restTemplate, String onboardingEndpoint, String registrationRequestJwtSerialised);

    void offBoard(RestTemplate restTemplate, String onboardingEndpoint);

}
