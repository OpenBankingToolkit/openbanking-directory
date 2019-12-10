import { EntityState } from '@ngrx/entity';

import { IMessage } from './messages';
import { IOIDCState } from 'ob-ui-libs/oidc';

export interface IMessagesState extends EntityState<IMessage> {
  isFetching: boolean;
  //   read: string[];
  //   unread: string[];
  //   entities: { [key: string]: IMessage };
}

export interface IState {
  oidc: IOIDCState;
  messages: IMessagesState;
}
