/**
 * Copyright 2019 ForgeRock AS. All Rights Reserved
 *
 * Use of this code requires a commercial software license with ForgeRock AS.
 * or with one of its affiliates. All use shall be exclusively subject
 * to such license between the licensee and ForgeRock AS.
 */
package com.forgerock.openbanking.directory.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.forgerock.openbanking.model.SoftwareStatement;
import com.forgerock.openbanking.model.SoftwareStatementRole;
import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.Set;

@Data
@Builder
public class SSA {

    @JsonProperty("ob_registry_tos")
    private String obRegisteryTos;

    @JsonProperty("org_status")
    private String organisationStatus;
    @JsonProperty("org_id")
    private String organisationId;
    @JsonProperty("org_name")
    private String organisationName;
    @JsonProperty("org_contacts")
    private List<Contact> organisationContacts;
    @JsonProperty("org_jwks_endpoint")
    private String organisationJwksEndpoint;
    @JsonProperty("org_jwks_revoked_endpoint")
    private String organisationJwksRevokedEndpoint;

    @JsonProperty("software_id")
    private String softwareId;
    @JsonProperty("software_client_id")
    private String softwareClientId;
    @JsonProperty("software_client_description")
    private String softwareClientDescription;
    @JsonProperty("software_client_name")
    private String softwareClientName;
    @JsonProperty("software_client_uri")
    private String softwareClientUri;
    @JsonProperty("software_version")
    private String softwareVersion;
    @JsonProperty("software_environment")
    private String softwareEnvironment;
    @JsonProperty("software_jwks_endpoint")
    private String softwareJwkEndpoint;
    @JsonProperty("software_jwks_revoked_endpoint")
    private String softwareJwksRevokedEndpoint;
    @JsonProperty("software_logo_uri")
    private String softwareLogoUri;
    @JsonProperty("software_mode")
    private SoftwareStatement.Mode softwareMode;
    @JsonProperty("software_on_behalf_of_org")
    private String softwareOnBehalfOfOrg;
    @JsonProperty("software_on_behalf_of_org_type")
    private String softwareOnBehalfOfOrgType;
    @JsonProperty("software_policy_uri")
    private String softwarePolicyUri;
    @JsonProperty("software_redirect_uris")
    private List<String> softwareRedirectUris;
    @JsonProperty("software_roles")
    private Set<SoftwareStatementRole> softwareRoles;
    @JsonProperty("software_tos_uri")
    private String softwareTosUri;


    public String getObRegisteryTos() {
        return obRegisteryTos;
    }

    public void setObRegisteryTos(String obRegisteryTos) {
        this.obRegisteryTos = obRegisteryTos;
    }

    public String getOrganisationStatus() {
        return organisationStatus;
    }

    public void setOrganisationStatus(String organisationStatus) {
        this.organisationStatus = organisationStatus;
    }

    public String getOrganisationId() {
        return organisationId;
    }

    public void setOrganisationId(String organisationId) {
        this.organisationId = organisationId;
    }

    public String getOrganisationName() {
        return organisationName;
    }

    public void setOrganisationName(String organisationName) {
        this.organisationName = organisationName;
    }

    public List<Contact> getOrganisationContacts() {
        return organisationContacts;
    }

    public void setOrganisationContacts(List<Contact> organisationContacts) {
        this.organisationContacts = organisationContacts;
    }

    public String getOrganisationJwksEndpoint() {
        return organisationJwksEndpoint;
    }

    public void setOrganisationJwksEndpoint(String organisationJwksEndpoint) {
        this.organisationJwksEndpoint = organisationJwksEndpoint;
    }

    public String getOrganisationJwksRevokedEndpoint() {
        return organisationJwksRevokedEndpoint;
    }

    public void setOrganisationJwksRevokedEndpoint(String organisationJwksRevokedEndpoint) {
        this.organisationJwksRevokedEndpoint = organisationJwksRevokedEndpoint;
    }

    public String getSoftwareId() {
        return softwareId;
    }

    public void setSoftwareId(String softwareId) {
        this.softwareId = softwareId;
    }

    public String getSoftwareClientId() {
        return softwareClientId;
    }

    public void setSoftwareClientId(String softwareClientId) {
        this.softwareClientId = softwareClientId;
    }

    public String getSoftwareClientDescription() {
        return softwareClientDescription;
    }

    public void setSoftwareClientDescription(String softwareClientDescription) {
        this.softwareClientDescription = softwareClientDescription;
    }

    public String getSoftwareClientName() {
        return softwareClientName;
    }

    public void setSoftwareClientName(String softwareClientName) {
        this.softwareClientName = softwareClientName;
    }

    public String getSoftwareClientUri() {
        return softwareClientUri;
    }

    public void setSoftwareClientUri(String softwareClientUri) {
        this.softwareClientUri = softwareClientUri;
    }

    public String getSoftwareVersion() {
        return softwareVersion;
    }

    public void setSoftwareVersion(String softwareVersion) {
        this.softwareVersion = softwareVersion;
    }

    public String getSoftwareEnvironment() {
        return softwareEnvironment;
    }

    public void setSoftwareEnvironment(String softwareEnvironment) {
        this.softwareEnvironment = softwareEnvironment;
    }

    public String getSoftwareJwkEndpoint() {
        return softwareJwkEndpoint;
    }

    public void setSoftwareJwkEndpoint(String softwareJwkEndpoint) {
        this.softwareJwkEndpoint = softwareJwkEndpoint;
    }

    public String getSoftwareJwksRevokedEndpoint() {
        return softwareJwksRevokedEndpoint;
    }

    public void setSoftwareJwksRevokedEndpoint(String softwareJwksRevokedEndpoint) {
        this.softwareJwksRevokedEndpoint = softwareJwksRevokedEndpoint;
    }

    public String getSoftwareLogoUri() {
        return softwareLogoUri;
    }

    public void setSoftwareLogoUri(String softwareLogoUri) {
        this.softwareLogoUri = softwareLogoUri;
    }

    public SoftwareStatement.Mode getSoftwareMode() {
        return softwareMode;
    }

    public void setSoftwareMode(SoftwareStatement.Mode softwareMode) {
        this.softwareMode = softwareMode;
    }

    public String getSoftwareOnBehalfOfOrg() {
        return softwareOnBehalfOfOrg;
    }

    public void setSoftwareOnBehalfOfOrg(String softwareOnBehalfOfOrg) {
        this.softwareOnBehalfOfOrg = softwareOnBehalfOfOrg;
    }

    public String getSoftwareOnBehalfOfOrgType() {
        return softwareOnBehalfOfOrgType;
    }

    public void setSoftwareOnBehalfOfOrgType(String softwareOnBehalfOfOrgType) {
        this.softwareOnBehalfOfOrgType = softwareOnBehalfOfOrgType;
    }

    public String getSoftwarePolicyUri() {
        return softwarePolicyUri;
    }

    public void setSoftwarePolicyUri(String softwarePolicyUri) {
        this.softwarePolicyUri = softwarePolicyUri;
    }

    public List<String> getSoftwareRedirectUris() {
        return softwareRedirectUris;
    }

    public void setSoftwareRedirectUris(List<String> softwareRedirectUris) {
        this.softwareRedirectUris = softwareRedirectUris;
    }

    public Set<SoftwareStatementRole> getSoftwareRoles() {
        return softwareRoles;
    }

    public void setSoftwareRoles(Set<SoftwareStatementRole> softwareRoles) {
        this.softwareRoles = softwareRoles;
    }

    public String getSoftwareTosUri() {
        return softwareTosUri;
    }

    public void setSoftwareTosUri(String softwareTosUri) {
        this.softwareTosUri = softwareTosUri;
    }
}
/*
{
    "iss": "OpenBanking Ltd",
    "iat": 1492756331,
    "jti": "id12345685439487678",
    "software_environment": "production",
    "software_mode": "live",
    "software_id": "65d1f27c-4aea-4549-9c21-60e495a7a86f",
    "software_client_id": "OpenBanking TPP Client Unique ID",
    "software_client_name": "Amazon Prime Movies",
    "software_client_description": "Amazon Prime Movies is a moving streaming service",
    "software_version": "2.2",
    "software_client_uri": "https://prime.amazon.com",
    "software_redirect_uris":
    [
        "https://prime.amazon.com/cb",
        "https://prime.amazon.co.uk/cb"
    ],
    "software_roles": [
        "PISP",
        "AISP"
    ],
    "organisation_competent_authority_claims": [
      {
        "authority_id": "FMA", // Austrian Financial Market Authority
        "registration_id": "111111",
        "status": "Active",
        "authorisations":  [
                {
                    "member_state": "GBR",
                        "roles": [
                            "PISP",
                            "AISP"
                    ]
                },
                {
                    "member_state": "ROI",
                        "roles": [
                            "PISP"
                    ]
                }
            ]
      }
    ],

    "software_logo_uri": "https://prime.amazon.com/logo.png",
    "org_status": "Active",
    "org_id": "Amazon TPPID",
    "org_name": "OpenBanking TPP Registered Name",
    "org_contacts": [
      {
        "name": "contact name",
        "email": "contact@contact.com",
        "phone": "+447890130558"
        "type": "business"
      },
      {
        "name": "contact name",
        "email": "contact@contact.com",
        "phone": "+447890130558",
        "type": "technical"
      }
    ],
    "org_jwks_endpoint": "https://jwks.openbanking.org.uk/org_id/org_id.jkws",
    "org_jwks_revoked_endpoint": "https://jwks.openbanking.org.uk/org_id/revoked/org_id.jkws",
    "software_jwks_endpoint": "https://jwks.openbanking.org.uk/org_id/software_id.jkws",
    "software_jwks_revoked_endpoint": "https://jwks.openbanking.org.uk/org_id/revoked/software_id.jkws",
    "software_policy_uri": "https://tpp.com/policy.html",
    "software_tos_uri": "https://tpp.com/tos.html",
    "software_on_behalf_of_org": "https://api.openbanking.org.uk/scim2/OBTrustedPaymentParty/1234567789",
    "ob_registry_tos": "https://registry.openbanking.org.uk/tos.html"

}        */