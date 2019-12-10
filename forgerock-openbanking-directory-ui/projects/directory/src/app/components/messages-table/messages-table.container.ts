import { Component, Input } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { IMessage, IState } from 'directory/src/models';
import { selectors, MessagesRequestAction } from 'directory/src/store/reducers/messages';

@Component({
  selector: 'forgerock-messages-table-container',
  template: `
    <forgerock-messages-table
      [isLoading]="isLoading$ | async"
      [messages]="messages$ | async"
      [displayedColumns]="displayedColumns"
    ></forgerock-messages-table>
  `
})
export class ForgerockMessagesTableContainer {
  isLoading$: Observable<boolean> = this.store.pipe(select(selectors.selectIsFetching));
  messages$: Observable<IMessage[]> = this.store.pipe(select(selectors.selectMessages));
  @Input() displayedColumns: string[] = ['created', 'title', 'action-read'];

  constructor(private store: Store<IState>) {
    store.dispatch(new MessagesRequestAction());
  }
}
