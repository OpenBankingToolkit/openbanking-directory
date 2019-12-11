import { createSelector, Action } from '@ngrx/store';
import { EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { IState, IMessage, IMessagesState, IMessagesResponse } from 'directory/src/models';
import _get from 'lodash-es/get';

import { OIDCLogoutTypes } from 'ob-ui-libs/oidc';

export const types = {
  UNREAD_MESSAGES_REQUEST: 'UNREAD_MESSAGES_REQUEST',
  MESSAGES_REQUEST: 'MESSAGES_REQUEST',
  MESSAGES_SUCCESS: 'MESSAGES_SUCCESS',
  MESSAGES_ERROR: 'MESSAGES_ERROR'
};

export class UnreadMessagesRequestAction implements Action {
  readonly type = types.UNREAD_MESSAGES_REQUEST;
}

export class MessagesRequestAction implements Action {
  readonly type = types.MESSAGES_REQUEST;
}

export class MessagesSuccessAction implements Action {
  readonly type = types.MESSAGES_SUCCESS;
  constructor(public payload: IMessagesResponse) {}
}

export class MessagesErrorAction implements Action {
  readonly type = types.MESSAGES_ERROR;
}

export type ActionsUnion = MessagesRequestAction | MessagesSuccessAction | MessagesErrorAction;

export const adapter: EntityAdapter<IMessage> = createEntityAdapter<IMessage>();

export const initialState: IMessagesState = adapter.getInitialState({
  isFetching: false
});

export default function userReducer(state: IMessagesState = initialState, action: any): IMessagesState {
  switch (action.type) {
    case types.MESSAGES_REQUEST: {
      return { ...state, isFetching: true };
    }
    case types.MESSAGES_SUCCESS: {
      const payload: IMessagesResponse = action.payload;
      return { ...adapter.addAll(payload.content, state), isFetching: false };
    }
    case types.MESSAGES_ERROR: {
      return { ...state, isFetching: false };
    }
    case OIDCLogoutTypes.LOGOUT_SUCCESS: {
      return { ...adapter.removeAll(state), isFetching: false };
    }
    default:
      return state;
  }
}

const { selectAll: selectMessages, selectEntities, selectIds, selectTotal } = adapter.getSelectors(
  (state: IState) => state.messages
);

const selectIsFetching = (state: IState) => state.messages.isFetching;

const selectMessage = createSelector(
  selectEntities,
  (state, messageId) => messageId,
  (entities: { [id: string]: IMessage }, messageId: string) => {
    return entities[messageId];
  }
);

export const selectors = {
  selectEntities,
  selectIds,
  selectTotal,
  selectIsFetching,
  selectMessage,
  selectMessages
};
