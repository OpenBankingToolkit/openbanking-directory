import { environment as defaultEnv } from './environment.default';

export const environment = {
  ...defaultEnv,
  cookieDomain: '.ob.forgerock.financial',
  directoryBackend: 'https://service.directory.ob.forgerock.financial',
  authEndpoint: 'https://am.ob.forgerock.financial',
  accountRequestsEndpoint: 'https://rs.aspsp.ob.forgerock.financial/api/account-requests',
  production: true
};
