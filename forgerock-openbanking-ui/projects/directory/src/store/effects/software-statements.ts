import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of, pipe } from 'rxjs';
import { catchError, map, mergeMap, withLatestFrom, retry } from 'rxjs/operators';
import _get from 'lodash-es/get';

import {
  SoftwareStatementsRequestAction,
  SoftwareStatementsSuccessAction,
  SoftwareStatementsErrorAction,
  ActionsUnion,
  SoftwareStatementDeletionRequestAction,
  SoftwareStatementCreateRequestAction
} from 'directory/src/store/reducers/software-statements';
import { ForgerockMessagesService } from '@forgerock/openbanking-ngx-common/services/forgerock-messages';
import { IState, ISoftwareStatement } from 'directory/src/models';
import { OrganisationService } from 'directory/src/app/services/organisation.service';
import { HttpErrorResponse } from '@angular/common/http';
import { SoftwareStatementService } from 'directory/src/app/services/software-statement.service';
import { Router } from '@angular/router';

@Injectable()
export class SoftwareStatementsEffects {
  constructor(
    private readonly actions$: Actions<ActionsUnion>,
    private router: Router,
    private messages: ForgerockMessagesService,
    private organisationService: OrganisationService,
    private softwareStatementService: SoftwareStatementService
  ) {}

  @Effect()
  request$: Observable<any> = this.actions$.pipe(
    ofType(SoftwareStatementsRequestAction),
    mergeMap((action: { organisationId: string }) => {
      return this.organisationService.getOrganisationSoftwareStatements(action.organisationId).pipe(
        retry(3),
        map((softwareStatements: ISoftwareStatement[]) =>
          SoftwareStatementsSuccessAction({ organisationId: action.organisationId, softwareStatements })
        ),
        this.errorPipe(action)
      );
    })
  );

  @Effect()
  create$: Observable<any> = this.actions$.pipe(
    ofType(SoftwareStatementCreateRequestAction),
    mergeMap((action: { organisationId: string }) =>
      this.softwareStatementService.createSoftwareStatement().pipe(
        retry(3),
        map((softwareStatement: ISoftwareStatement) => {
          this.messages
            .success('Software Statement created', 'See')
            .onAction()
            .subscribe(() => this.router.navigate(['/software-statements/' + softwareStatement.id + '/general']));
          return SoftwareStatementsRequestAction({ organisationId: action.organisationId });
        }),
        this.errorPipe(action)
      )
    )
  );

  @Effect()
  delete$: Observable<any> = this.actions$.pipe(
    ofType(SoftwareStatementDeletionRequestAction),
    mergeMap((action: { organisationId: string; softwareStatementId: string }) =>
      this.softwareStatementService.deleteSoftwareStatement(action.softwareStatementId).pipe(
        retry(3),
        map(() => {
          return SoftwareStatementsRequestAction({ organisationId: action.organisationId });
        }),
        this.errorPipe(action)
      )
    )
  );

  errorPipe = action =>
    pipe(
      catchError((er: HttpErrorResponse) => {
        const error = _get(er, 'error.Message') || _get(er, 'error.message') || _get(er, 'message') || er;
        this.messages.error(error);
        return of(SoftwareStatementsErrorAction({ organisationId: action.organisationId, error }));
      })
    );
}
