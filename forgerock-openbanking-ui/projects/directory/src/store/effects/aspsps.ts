import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of, pipe } from 'rxjs';
import { catchError, map, mergeMap, retry } from 'rxjs/operators';
import _get from 'lodash-es/get';

import { ForgerockMessagesService } from '@forgerock/openbanking-ngx-common/services/forgerock-messages';
import { HttpErrorResponse } from '@angular/common/http';
import {
  ActionsUnion,
  AspspsRequestAction,
  AspspsSuccessAction,
  AspspsErrorAction,
  AspspSuccessAction,
  AspspUpdateRequestAction,
  AspspCreateRequestAction
} from '../reducers/aspsps';
import { AspspService } from 'directory/src/app/services/aspsp.service';
import { IAspsp } from 'directory/src/models';

@Injectable()
export class AspspsEffects {
  constructor(
    private readonly actions$: Actions<ActionsUnion>,
    private messages: ForgerockMessagesService,
    private aspspsService: AspspService
  ) {}

  @Effect()
  requestAll$: Observable<any> = this.actions$.pipe(
    ofType(AspspsRequestAction),
    mergeMap(() =>
      this.aspspsService.getAspsps().pipe(
        retry(3),
        map((response: IAspsp[]) => AspspsSuccessAction({ aspsps: response })),
        this.errorPipe()
      )
    )
  );

  @Effect()
  create$: Observable<any> = this.actions$.pipe(
    ofType(AspspCreateRequestAction),
    mergeMap((action: { aspsp: IAspsp }) =>
      this.aspspsService.createAspsp(action.aspsp).pipe(
        retry(3),
        map((response: IAspsp) => AspspSuccessAction({ aspsp: response })),
        this.errorPipe()
      )
    )
  );

  @Effect()
  update$: Observable<any> = this.actions$.pipe(
    ofType(AspspUpdateRequestAction),
    mergeMap((action: { aspsp: IAspsp }) =>
      this.aspspsService.updateAspsp(action.aspsp).pipe(
        retry(3),
        map((response: IAspsp) => AspspSuccessAction({ aspsp: response })),
        this.errorPipe()
      )
    )
  );

  errorPipe = () =>
    pipe(
      catchError((er: HttpErrorResponse) => {
        const error = _get(er, 'error.Message') || _get(er, 'error.message') || _get(er, 'message') || er;
        this.messages.error(error);
        return of(AspspsErrorAction({ error }));
      })
    );
}
