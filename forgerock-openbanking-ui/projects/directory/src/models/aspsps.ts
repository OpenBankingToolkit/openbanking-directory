export interface IAspsp {
  id: string;
  name: string;
  logoUri: string;
  financialId: string;
  asDiscoveryEndpoint: string;
  rsDiscoveryEndpoint: string;
  testMtlsEndpoint: string;
  transportKeys: string;
}