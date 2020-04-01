import { props, on, createSelector, createReducer, createAction } from '@ngrx/store';
import _get from 'lodash-es/get';

import { IOrganisationsState, IState, IOrganisation } from '../../models';
import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { logoutAction } from './oidc';
import { selectOIDCUserOrganisationId } from '@forgerock/openbanking-ngx-common/oidc';

export const OrganisationsRequestAction = createAction('ORGANISATIONS_REQUEST');

export const OrganisationsSuccessAction = createAction(
  'ORGANISATIONS_SUCCESS',
  props<{ organisations: IOrganisation[] }>()
);

export const OrganisationsErrorAction = createAction('ORGANISATIONS_ERROR', props<{ error: string }>());
export const OrganisationRequestAction = createAction('ORGANISATION_REQUEST', props<{ organisationId: string }>());
export const OrganisationSuccessAction = createAction('ORGANISATION_SUCCESS', props<{ organisation: IOrganisation }>());
export const OrganisationUpdateRequestAction = createAction(
  'ORGANISATION_UPDATE_REQUEST',
  props<{ organisation: IOrganisation }>()
);

export type ActionsUnion =
  | typeof OrganisationsRequestAction
  | typeof OrganisationsSuccessAction
  | typeof OrganisationsErrorAction
  | typeof OrganisationRequestAction
  | typeof OrganisationSuccessAction
  | typeof OrganisationUpdateRequestAction;

export const adapter: EntityAdapter<IOrganisation> = createEntityAdapter<IOrganisation>();

export const initialState: IOrganisationsState = adapter.getInitialState({
  isLoading: true,
  error: ''
});

export const OrganisationsReducer = createReducer(
  initialState,
  on(OrganisationsRequestAction, state => ({
    ...state,
    isLoading: true,
    error: ''
  })),
  on(OrganisationsSuccessAction, (state, { organisations }) => ({
    ...state,
    ...adapter.setAll(organisations, state),
    isLoading: false,
    error: ''
  })),
  on(OrganisationsErrorAction, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),
  on(OrganisationRequestAction, state => ({
    ...state,
    isLoading: true,
    error: ''
  })),
  on(OrganisationUpdateRequestAction, state => ({
    ...state,
    isLoading: true,
    error: ''
  })),
  on(OrganisationSuccessAction, (state, { organisation }) => ({
    ...state,
    ...adapter.upsertOne(organisation, state),
    isLoading: false,
    error: ''
  })),
  on(logoutAction, () => initialState)
);

const { selectEntities, selectAll } = adapter.getSelectors((state: IState) => state.organisations);

export const selectOrganisations = selectAll;
export const selectIsLoading = (state: IState) => state.organisations.isLoading;
export const selectCurrrentUserOrganisation = createSelector(
  selectEntities,
  selectOIDCUserOrganisationId,
  (entities: { [id: string]: IOrganisation }, organisationId: string) => {
    return entities[organisationId];
  }
);

export default OrganisationsReducer;
