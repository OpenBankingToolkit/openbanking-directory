export enum IOrganisationStatus {
  ACTIVE = 'ACTIVE',
  REVOKED = 'REVOKED',
  WITHDRAWN = 'WITHDRAWN'
}

export interface IOrganisation {
  id: string;
  name: string;
  contacts: any[];
  status: IOrganisationStatus;
  description?: string;
  softwareStatementIds: string[];
}
