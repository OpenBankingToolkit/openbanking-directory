import { props, on, createReducer, createAction } from '@ngrx/store';
import _get from 'lodash-es/get';

import { ISoftwareStatementsState, IState, ISoftwareStatement, ISoftwareStatementsEntityState } from '../../models';
import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { logoutAction } from './oidc';

export const SoftwareStatementsRequestAction = createAction(
  'SOFTWARE_STATEMENTS_REQUEST',
  props<{ organisationId: string }>()
);

export const SoftwareStatementsSuccessAction = createAction(
  'SOFTWARE_STATEMENTS_SUCCESS',
  props<{ organisationId: string; softwareStatements: ISoftwareStatement[] }>()
);

export const SoftwareStatementsErrorAction = createAction(
  'SOFTWARE_STATEMENTS_ERROR',
  props<{ organisationId: string; error: string }>()
);

export const SoftwareStatementDeletionRequestAction = createAction(
  'SOFTWARE_STATEMENT_DELETION_REQUEST',
  props<{ organisationId: string; softwareStatementId: string }>()
);

export const SoftwareStatementCreateRequestAction = createAction(
  'SOFTWARE_STATEMENT_CREATE_REQUEST',
  props<{ organisationId: string }>()
);

export type ActionsUnion =
  | typeof SoftwareStatementsRequestAction
  | typeof SoftwareStatementsSuccessAction
  | typeof SoftwareStatementsErrorAction
  | typeof SoftwareStatementDeletionRequestAction
  | typeof SoftwareStatementCreateRequestAction;

export const adapter: EntityAdapter<ISoftwareStatement> = createEntityAdapter<ISoftwareStatement>();

export const initialState: ISoftwareStatementsState = {};

const defaultSoftwareStatementsEntityState = adapter.getInitialState({
  isLoading: true,
  error: ''
});

export const softwareStatementsReducer = createReducer(
  initialState,
  on(SoftwareStatementsRequestAction, (state, { organisationId }) => ({
    ...state,
    [organisationId]: state[organisationId] || defaultSoftwareStatementsEntityState
  })),
  on(SoftwareStatementsSuccessAction, (state, { organisationId, softwareStatements }) => ({
    ...state,
    [organisationId]: {
      ...adapter.addAll(softwareStatements, state[organisationId]),
      isLoading: false,
      error: ''
    }
  })),
  on(SoftwareStatementsErrorAction, (state, { organisationId, error }) => ({
    ...state,
    [organisationId]: { ...state[organisationId], isLoading: false, error }
  })),
  on(SoftwareStatementDeletionRequestAction, (state, { organisationId }) => ({
    ...state,
    [organisationId]: { ...state[organisationId], isLoading: true, error: '' }
  })),
  on(SoftwareStatementCreateRequestAction, (state, { organisationId }) => ({
    ...state,
    [organisationId]: { ...state[organisationId], isLoading: true, error: '' }
  })),
  on(logoutAction, () => initialState)
);

export const getSelectors = (state: IState, organisationId: string) => {
  const { selectAll } = adapter.getSelectors<ISoftwareStatementsEntityState>(
    () => state.softwareStatements[organisationId] || defaultSoftwareStatementsEntityState
  );

  return {
    selectAll: selectAll(state.softwareStatements[organisationId] || defaultSoftwareStatementsEntityState),
    isLoading: _get(state.softwareStatements, `[${organisationId}].isLoading`, false),
    error: _get(state.softwareStatements, `[${organisationId}].error`, '')
  };
};

export default softwareStatementsReducer;
