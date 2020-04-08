import { props, on, createReducer, createAction, createSelector } from '@ngrx/store';
import _get from 'lodash-es/get';

import { ISoftwareStatementsState, IState, ISoftwareStatement } from '../../models';
import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { logoutAction } from './oidc';

export const SoftwareStatementsRequestAction = createAction(
  'SOFTWARE_STATEMENTS_REQUEST',
  props<{ organisationId: string }>()
);

export const SoftwareStatementRequestAction = createAction(
  'SOFTWARE_STATEMENT_REQUEST',
  props<{ softwareStatementId: string }>()
);

export const SoftwareStatementsSuccessAction = createAction(
  'SOFTWARE_STATEMENTS_SUCCESS',
  props<{ softwareStatements: ISoftwareStatement[] }>()
);

export const SoftwareStatementsErrorAction = createAction('SOFTWARE_STATEMENTS_ERROR', props<{ error: string }>());

export const SoftwareStatementUpdateRequestAction = createAction(
  'SOFTWARE_STATEMENT_UPDATE_REQUEST',
  props<{ softwareStatement: ISoftwareStatement }>()
);

export const SoftwareStatementSuccessAction = createAction(
  'SOFTWARE_STATEMENT_SUCCESS',
  props<{ softwareStatement: ISoftwareStatement }>()
);

export const SoftwareStatementDeletionRequestAction = createAction(
  'SOFTWARE_STATEMENT_DELETION_REQUEST',
  props<{ softwareStatementId: string }>()
);

export const SoftwareStatementCreationRequestAction = createAction(
  'SOFTWARE_STATEMENT_CREATE_REQUEST',
  props<{ organisationId: string }>()
);

export type ActionsUnion =
  | typeof SoftwareStatementsRequestAction
  | typeof SoftwareStatementRequestAction
  | typeof SoftwareStatementsSuccessAction
  | typeof SoftwareStatementsErrorAction
  | typeof SoftwareStatementSuccessAction
  | typeof SoftwareStatementUpdateRequestAction
  | typeof SoftwareStatementDeletionRequestAction
  | typeof SoftwareStatementCreationRequestAction;

export const adapter: EntityAdapter<ISoftwareStatement> = createEntityAdapter<ISoftwareStatement>();

export const initialState: ISoftwareStatementsState = adapter.getInitialState({
  isLoading: true,
  error: '',
  currentUserSoftwareStatementIds: undefined
});

const loadingState = state => ({
  ...state,
  isLoading: true,
  error: ''
});

export const softwareStatementsReducer = createReducer(
  initialState,
  on(SoftwareStatementsRequestAction, loadingState),
  on(SoftwareStatementUpdateRequestAction, loadingState),
  on(SoftwareStatementDeletionRequestAction, loadingState),
  on(SoftwareStatementCreationRequestAction, loadingState),
  on(SoftwareStatementsSuccessAction, (state, { softwareStatements }) => ({
    ...state,
    ...adapter.addAll(softwareStatements, state),
    currentUserSoftwareStatementIds: softwareStatements.map(value => value.id),
    isLoading: false,
    error: ''
  })),
  on(SoftwareStatementSuccessAction, (state, { softwareStatement }) => ({
    ...state,
    ...adapter.upsertOne(softwareStatement, state),
    isLoading: false,
    error: ''
  })),
  on(SoftwareStatementsErrorAction, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),
  on(logoutAction, () => initialState)
);

const { selectEntities, selectAll } = adapter.getSelectors((state: IState) => state.softwareStatements);

export const selectSoftwareStatements = selectAll;
export const selectIsLoading = (state: IState) => state.softwareStatements.isLoading;
export const selectCurrentUserSoftwareStatementIds = (state: IState) =>
  state.softwareStatements.currentUserSoftwareStatementIds;
export const selectError = (state: IState) => state.softwareStatements.error;

export const selectSoftwareStatement = createSelector(
  (state: IState, softwareStatementId: string) => softwareStatementId,
  selectEntities,
  (softwareStatementId: string | undefined, entities) => entities[softwareStatementId]
);

export const selectCurrentUserSoftwareStatements = createSelector(
  selectCurrentUserSoftwareStatementIds,
  selectEntities,
  (softwareStatementsIds: string[] | undefined, entities) =>
    softwareStatementsIds && softwareStatementsIds.map(id => entities[id])
);

export default softwareStatementsReducer;
