import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of, pipe } from 'rxjs';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, map, mergeMap, retry, withLatestFrom } from 'rxjs/operators';
import _get from 'lodash-es/get';

import {
  SoftwareStatementsRequestAction,
  SoftwareStatementsSuccessAction,
  SoftwareStatementsErrorAction,
  ActionsUnion,
  SoftwareStatementDeletionRequestAction,
  SoftwareStatementCreationRequestAction,
  SoftwareStatementUpdateRequestAction,
  SoftwareStatementSuccessAction,
  SoftwareStatementRequestAction
} from 'directory/src/store/reducers/software-statements';
import { ForgerockMessagesService } from '@forgerock/openbanking-ngx-common/services/forgerock-messages';
import { ISoftwareStatement, IState } from 'directory/src/models';
import { OrganisationService } from 'directory/src/app/services/organisation.service';
import { SoftwareStatementService } from 'directory/src/app/services/software-statement.service';
import { selectOIDCUserOrganisationId } from '@forgerock/openbanking-ngx-common/oidc';

@Injectable()
export class SoftwareStatementsEffects {
  constructor(
    private readonly actions$: Actions<ActionsUnion>,
    private router: Router,
    private messages: ForgerockMessagesService,
    private organisationService: OrganisationService,
    private softwareStatementService: SoftwareStatementService,
    private store: Store<IState>
  ) {}

  @Effect()
  requestAll$: Observable<any> = this.actions$.pipe(
    ofType(SoftwareStatementsRequestAction),
    mergeMap((action: { organisationId: string }) => {
      return this.organisationService.getOrganisationSoftwareStatements(action.organisationId).pipe(
        retry(3),
        map((softwareStatements: ISoftwareStatement[]) => SoftwareStatementsSuccessAction({ softwareStatements })),
        this.errorPipe(action)
      );
    })
  );

  @Effect()
  requestOne$: Observable<any> = this.actions$.pipe(
    ofType(SoftwareStatementRequestAction),
    mergeMap((action: { softwareStatementId: string }) => {
      return this.softwareStatementService.getSoftwareStatement(action.softwareStatementId).pipe(
        retry(3),
        map((softwareStatement: ISoftwareStatement) => {
          return SoftwareStatementSuccessAction({ softwareStatement });
        }),
        this.errorPipe(action)
      );
    })
  );

  @Effect()
  create$: Observable<any> = this.actions$.pipe(
    ofType(SoftwareStatementCreationRequestAction),
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
  update$: Observable<any> = this.actions$.pipe(
    ofType(SoftwareStatementUpdateRequestAction),
    mergeMap((action: { softwareStatement: ISoftwareStatement }) =>
      this.softwareStatementService.putSoftwareStatement(action.softwareStatement).pipe(
        retry(3),
        map((softwareStatement: ISoftwareStatement) => {
          return SoftwareStatementSuccessAction({ softwareStatement });
        }),
        this.errorPipe(action)
      )
    )
  );

  @Effect()
  delete$: Observable<any> = this.actions$.pipe(
    ofType(SoftwareStatementDeletionRequestAction),
    withLatestFrom(this.store.select(selectOIDCUserOrganisationId)),
    mergeMap(([action, organisationId]: [{ softwareStatementId: string }, string]) =>
      this.softwareStatementService.deleteSoftwareStatement(action.softwareStatementId).pipe(
        retry(3),
        map(() => {
          return SoftwareStatementsRequestAction({ organisationId });
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
        return of(SoftwareStatementsErrorAction({ error }));
      })
    );
}
