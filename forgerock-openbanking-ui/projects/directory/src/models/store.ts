import { EntityState } from '@ngrx/entity';

import { IMessage } from './messages';
import { ISoftwareStatement } from './software-statements';
import { IOIDCState } from '@forgerock/openbanking-ngx-common/oidc';
import { IOrganisation } from './organisations';
import { IAspsp } from './aspsps';

export interface IMessagesState extends EntityState<IMessage> {
  isFetching: boolean;
  //   read: string[];
  //   unread: string[];
  //   entities: { [key: string]: IMessage };
}

export interface IAspspsState extends EntityState<IAspsp> {
  isLoading: boolean;
  error: string;
}

export interface IOrganisationsState extends EntityState<IOrganisation> {
  isLoading: boolean;
  error: string;
}

export interface ISoftwareStatementsEntityState extends EntityState<ISoftwareStatement> {
  isLoading: boolean;
  error: string;
}

export interface ISoftwareStatementsState {
  [organisationId: string]: ISoftwareStatementsEntityState;
}

export interface IState {
  oidc: IOIDCState;
  messages: IMessagesState;
  softwareStatements: ISoftwareStatementsState;
  organisations: IOrganisationsState;
  aspsps: IAspspsState;
}
