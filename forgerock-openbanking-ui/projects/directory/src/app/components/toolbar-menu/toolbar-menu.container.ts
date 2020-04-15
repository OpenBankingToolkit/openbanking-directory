import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';

import { IState } from 'directory/src/models';
import {
  ForgerockOIDCLogoutRequestAction,
  selectOIDCConnected,
  selectOIDCUserId
} from '@forgerock/openbanking-ngx-common/oidc';

@Component({
  // tslint:disable-next-line
  selector: 'analytics-toolbar-menu-container',
  template: `
    <analytics-toolbar-menu
      [username]="username$ | async"
      [connected]="connected$ | async"
      (logout)="logout($event)"
    ></analytics-toolbar-menu>
  `,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: row;
        align-items: center;
      }
    `
  ]
})
export class DirectoryToolbarMenuContainer implements OnInit {
  connected$: Observable<boolean> = this.store.pipe(select(selectOIDCConnected));
  username$: Observable<string> = this.store.pipe(select(selectOIDCUserId));
  constructor(private store: Store<IState>) {}

  ngOnInit(): void {}

  logout(e: Event) {
    this.store.dispatch(new ForgerockOIDCLogoutRequestAction());
  }
}
