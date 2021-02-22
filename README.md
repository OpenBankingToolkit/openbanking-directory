[<img src="https://raw.githubusercontent.com/ForgeRock/forgerock-logo-dev/master/Logo-fr-dev.png" align="right" width="220px"/>](https://developer.forgerock.com/)

| |Current Status|
|---|---|
|Build|[![Build Status](https://img.shields.io/endpoint.svg?url=https%3A%2F%2Factions-badge.atrox.dev%2FOpenBankingToolkit%2Fopenbanking-directory%2Fbadge%3Fref%3Dmaster&style=flat)](https://actions-badge.atrox.dev/OpenBankingToolkit/openbanking-directory/goto?ref=master)|
|Code coverage|[![codecov](https://codecov.io/gh/OpenBankingToolkit/openbanking-directory/branch/master/graph/badge.svg)](https://codecov.io/gh/OpenBankingToolkit/openbanking-directory)
|Release|[![GitHub release (latest by date)](https://img.shields.io/github/v/release/OpenBankingToolkit/openbanking-directory.svg)](https://img.shields.io/github/v/release/OpenBankingToolkit/openbanking-directory)
|License|![license](https://img.shields.io/github/license/ACRA/acra.svg)|

ForgeRock OpenBanking directory
========================

The [Open Banking Implementation Entity (OBIE)](<https://www.openbanking.org.uk/about-us/>) ensure trust in the UK Open Banking ecosystem by providing a vetted enrolment process to banks, building societies and third party providers wishing to operate within the UK Open Banking ecosystem.

Once a financial entity has enrolled with the OBIE it will appear in the [OBIE directory](<https://www.openbanking.org.uk/providers/directory/>) which acts as a 'Trust Hub' for the ecosystem. The directory enables an organisation to download Open Banking signed transport and signing certificates that may be used to either provide or consume Open Banking APIs. 

Using these signed certificates allows account providers such as banks, building societies to;

- Protect APIs with the OBIE signed certificates so that TPPs may know the bank's identity and that the bank is enrolled with the OBIE. 
- Determine the identity of a TPP attempting to use their APIs and be sure that TPP has enrolled with the OBIE.

The ForgeRock Open Banking Directory allows TPPs to register an Organisation, create a Software Statement and download signed transport and signing certificates without the need to go through the manual enrolment process with the OBIE. This allows already trusted developers, integrators and automated tests suites to quickly and conveniently obtain trusted transport and signing certificates required to make calls to the protected Open APIs. 

This can be extremely convenient for internal deployments such as development/sandbox deployments where the APIs are not connected to real data. In these cases it is not necessary for the system to have the trust guarantees provided by a vetted enrolment process such as the one provided by the OBIE.

## Demo

The directory is available here: 

https://directory.ob.forgerock.financial/

You can create a new account using the create account link at the bottom of the Sign in dialog, then login using that account. 



### Include the dependencies

For Apache Maven:

```
<dependency>
    <groupId>com.forgerock.openbanking.directory</groupId>
    <artifactId>forgerock-openbanking-directory-server</artifactId>
</dependency>
```

For Gradle:

```
compile 'com.forgerock.openbanking.directory:forgerock-openbanking-directory-server'
```
