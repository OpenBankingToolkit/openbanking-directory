import { props, on, createReducer, createAction } from '@ngrx/store';
import _get from 'lodash-es/get';

import { IAspspsState, IState, IAspsp } from '../../models';
import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { logoutAction } from './oidc';

export const AspspsRequestAction = createAction('ASPSPS_REQUEST');
export const AspspCreateRequestAction = createAction('ASPSP_CREATE_REQUEST', props<{ aspsp: IAspsp }>());
export const AspspUpdateRequestAction = createAction('ASPSP_UPDATE_REQUEST', props<{ aspsp: IAspsp }>());

export const AspspSuccessAction = createAction('ASPSP_SUCCESS', props<{ aspsp: IAspsp }>());
export const AspspsSuccessAction = createAction('ASPSPS_SUCCESS', props<{ aspsps: IAspsp[] }>());
export const AspspsErrorAction = createAction('ASPSPS_ERROR', props<{ error: string }>());

export type ActionsUnion = typeof AspspsRequestAction | typeof AspspsSuccessAction | typeof AspspsErrorAction;

export const adapter: EntityAdapter<IAspsp> = createEntityAdapter<IAspsp>();

export const initialState: IAspspsState = adapter.getInitialState({
  isLoading: true,
  error: ''
});

const requestCallback = state => ({
  ...state,
  isLoading: true,
  error: ''
});

export const AspspsReducer = createReducer(
  initialState,
  on(AspspsRequestAction, requestCallback),
  on(AspspCreateRequestAction, requestCallback),
  on(AspspUpdateRequestAction, requestCallback),
  on(AspspsSuccessAction, (state, { aspsps }) => ({
    ...state,
    ...adapter.addAll(aspsps, state),
    isLoading: false,
    error: ''
  })),
  on(AspspSuccessAction, (state, { aspsp }) => ({
    ...state,
    ...adapter.upsertOne(aspsp, state),
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

export const selectIsLoading = (state: IState) => state.aspsps.isLoading;
export const selectAspsps = selectAll;

export default AspspsReducer;
