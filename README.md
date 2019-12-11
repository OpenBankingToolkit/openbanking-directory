[<img src="https://raw.githubusercontent.com/ForgeRock/forgerock-logo-dev/master/Logo-fr-dev.png" align="right" width="220px"/>](https://developer.forgerock.com/)

| |Current Status|
|---|---|
|Build|[![Build Status](https://img.shields.io/endpoint.svg?url=https%3A%2F%2Factions-badge.atrox.dev%2FOpenBankingToolkit%2Fopenbanking-directory%2Fbadge%3Fref%3Dmaster&style=flat)](https://actions-badge.atrox.dev/OpenBankingToolkit/openbanking-directory/goto?ref=master)|
|Code coverage|[![codecov](https://codecov.io/gh/OpenBankingToolkit/openbanking-directory/branch/master/graph/badge.svg)](https://codecov.io/gh/OpenBankingToolkit/openbanking-directory)
|Bintray|[![Bintray](https://img.shields.io/bintray/v/openbanking-toolkit/OpenBankingToolKit/openbanking-directory.svg?maxAge=2592000)](https://bintray.com/openbanking-toolkit/OpenBankingToolKit/openbanking-directory)|
|License|![license](https://img.shields.io/github/license/ACRA/acra.svg)|

ForgeRock OpenBanking directory
========================

The directory application offers similar features than the OBIE directory.

The Open Banking Directory is a list of regulated third party providers (AISPs and PISPs) and account providers (ASPSPs)
 that operate in the Open Banking ecosystem.
 It enables account providers, such as banks, building societies and payment companies, to verify the identity of regulated third party providers.
 
This directory applications allows your organisation to host their own directory. It is very handy for development environments,
as your developer would be able to act as TPP (getting keys, SSA, etc) directly, without any onboarding process etc.
In a production context, you can also use this directory to add another source of trust. This is helpful for banks wishes to
offer access to partner Fintechs, TPP or not, to dedicated APIs.
As you host your own directory, you can add more TPP roles. Super handy if you have private APIs and you want to give this role
to a subset of TPPs.

## Demo

The directory is available here: 

https://directory.demo.forgerock.financial/

You can use:
* login: `demo`
* password: `changeit`



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
