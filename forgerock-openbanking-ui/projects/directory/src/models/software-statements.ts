export interface ISoftwareStatement {
  id: string;
  name?: string;
  applicationId: string;
  description?: string;
  logoUri?: string;
  policyUri?: string;
  termsOfService?: string;
  mode: string;
  status: string;
  redirectUris: string[];
  roles: string[];
}

export interface ISoftwareStatementApplication {
  issuerId: string;
  defaultSigningAlgorithm: string;
  defaultEncryptionAlgorithm: string;
  defaultEncryptionMethod: string;
  expirationWindow: number;
  certificateConfiguration: CertificateConfiguration;
  currentSignKid: string;
  currentEncKid: string;
  keys: {
    [key: string]: Key;
  };
  defaultTransportSigningAlgorithm: string;
  currentTransportKid: string;
  currentTransportKeyHash: string;
  transportKeys: {
    [key: string]: Key;
  };
  transportKeysNextRotation: string;
  signingAndEncryptionKeysNextRotation: string;
}

interface Key {
  kid: string;
  keystoreAlias: string;
  keyUse: string;
  validityWindowStart: string;
  created: string;
  jwk: Jwk;
}

interface Jwk {
  d: string;
  e: string;
  use: string;
  kid: string;
  x5c: string[];
  dp: string;
  dq: string;
  n: string;
  p: string;
  kty: string;
  'x5t#S256': string;
  q: string;
  qi: string;
  alg: string;
}

interface CertificateConfiguration {
  cn: string;
  ou: string;
  o: string;
  l: string;
  st: string;
  c: string;
  oi: string;
  eidasInfo: EidasInfo;
}

interface EidasInfo {
  caIssuerCertURL: string;
  ocspUri: string;
  organisationId: string;
  ncaName: string;
  ncaId: string;
  psd2Roles: string[];
}
