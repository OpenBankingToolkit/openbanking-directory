import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of, pipe } from 'rxjs';
import { catchError, map, mergeMap, retry } from 'rxjs/operators';
import _get from 'lodash-es/get';

import { ForgerockMessagesService } from '@forgerock/openbanking-ngx-common/services/forgerock-messages';
import { IOrganisation } from 'directory/src/models';
import { OrganisationService } from 'directory/src/app/services/organisation.service';
import { HttpErrorResponse } from '@angular/common/http';

import {
  ActionsUnion,
  OrganisationRequestAction,
  OrganisationSuccessAction,
  OrganisationsErrorAction,
  OrganisationUpdateRequestAction
} from '../reducers/organisations';

@Injectable()
export class OrganisationsEffects {
  constructor(
    private readonly actions$: Actions<ActionsUnion>,
    private messages: ForgerockMessagesService,
    private organisationService: OrganisationService
  ) {}

  @Effect()
  requestOne$: Observable<any> = this.actions$.pipe(
    ofType(OrganisationRequestAction),
    mergeMap((action: { organisationId: string }) => {
      return this.organisationService.getOrganisation(action.organisationId).pipe(
        retry(3),
        map((organisation: IOrganisation) => OrganisationSuccessAction({ organisation })),
        this.errorPipe()
      );
    })
  );

  @Effect()
  updateOne$: Observable<any> = this.actions$.pipe(
    ofType(OrganisationUpdateRequestAction),
    mergeMap((action: { organisation: IOrganisation }) => {
      return this.organisationService.updateOrganisation(action.organisation).pipe(
        retry(3),
        map((organisation: IOrganisation) => OrganisationSuccessAction({ organisation })),
        this.errorPipe()
      );
    })
  );

  errorPipe = () =>
    pipe(
      catchError((er: HttpErrorResponse) => {
        const error = _get(er, 'error.Message') || _get(er, 'error.message') || _get(er, 'message') || er;
        this.messages.error(error);
        return of(OrganisationsErrorAction({ error }));
      })
    );
}
