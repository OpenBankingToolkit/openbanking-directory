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
