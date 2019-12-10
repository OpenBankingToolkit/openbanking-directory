import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';

import { types, MessagesErrorAction, MessagesSuccessAction } from 'directory/src/store/reducers/messages';
import { MessageService } from 'directory/src/app/services/message.service';

@Injectable()
export class MessagesEffects {
  constructor(private actions$: Actions, private messageService: MessageService) {}

  @Effect()
  requestMessages$: Observable<Action> = this.actions$.pipe(
    ofType(types.MESSAGES_REQUEST),
    mergeMap(action =>
      this.messageService.getMessages().pipe(
        map((response: any) => {
          return new MessagesSuccessAction(response);
        }),
        catchError(() => {
          return of(new MessagesErrorAction());
        })
      )
    )
  );

  @Effect()
  requestUnreadMessages$: Observable<Action> = this.actions$.pipe(
    ofType(types.UNREAD_MESSAGES_REQUEST),
    mergeMap(action =>
      this.messageService.getUnreadMessages().pipe(
        map((response: any) => {
          return new MessagesSuccessAction(response);
        }),
        catchError(() => {
          return of(new MessagesErrorAction());
        })
      )
    )
  );
}
