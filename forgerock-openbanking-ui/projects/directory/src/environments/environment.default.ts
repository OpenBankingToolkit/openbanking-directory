// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
export const environment = {
  production: false,
  sessionCookieName: 'obri-session',
  cookieDomain: '.dev-ob.forgerock.financial',
  directoryBackend: 'https://service.directory.dev-ob.forgerock.financial:8074',
  authEndpoint: 'https://am.dev-ob.forgerock.financial:8074',
  accountRequestsEndpoint: 'https://rs.aspsp.dev-ob.forgerock.financial:8074/api/account-requests',

  termsOfServiceLink: 'https://backstage.forgerock.com/knowledge/openbanking/article/a45894685',
  policyLink: 'https://backstage.forgerock.com/knowledge/openbanking/article/a11457341',
  aboutLink: 'https://backstage.forgerock.com/knowledge/openbanking/',
  version: 'v0',
  client: {
    name: 'Forgerock',
    adminContact: 'openbanking-support@forgerock.com',
    iconWidth: 70,
    iconHeight: 70,
    logoWidth: 230,
    logoHeight: '100%'
  },
  devModules: []
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
