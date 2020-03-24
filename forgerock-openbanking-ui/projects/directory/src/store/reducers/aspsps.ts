import { props, on, createSelector, createReducer, createAction, createFeatureSelector } from '@ngrx/store';
import _get from 'lodash-es/get';

import { IAspspsState, IState, IAspsp } from '../../models';
import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { logoutAction } from './oidc';

export const AspspsRequestAction = createAction('ASPSPS_REQUEST');

export const AspspsSuccessAction = createAction('ASPSPS_SUCCESS', props<{ aspsps: IAspsp[] }>());
export const AspspsErrorAction = createAction('ASPSPS_ERROR', props<{ error: string }>());

export type ActionsUnion = typeof AspspsRequestAction | typeof AspspsSuccessAction | typeof AspspsErrorAction;

export const adapter: EntityAdapter<IAspsp> = createEntityAdapter<IAspsp>();

export const initialState: IAspspsState = adapter.getInitialState({
  isLoading: true,
  error: ''
});

export const AspspsReducer = createReducer(
  initialState,
  on(AspspsRequestAction, state => ({
    ...state,
    isLoading: true,
    error: ''
  })),
  on(AspspsSuccessAction, (state, { aspsps }) => ({
    ...state,
    ...adapter.addAll(aspsps, state),
    isLoading: false,
    error: ''
  })),
  on(AspspsErrorAction, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),
  on(logoutAction, () => initialState)
);

const { selectAll } = adapter.getSelectors((state: IState) => state.aspsps);

export const selectIsLoading = (state: IState) => state.organisations.isLoading;
export const selectAspsps = selectAll;

export default AspspsReducer;
