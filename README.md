[<img src="https://raw.githubusercontent.com/ForgeRock/forgerock-logo-dev/master/forgerock-logo-dev.png" align="right" width="220px"/>](https://developer.forgerock.com/)

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