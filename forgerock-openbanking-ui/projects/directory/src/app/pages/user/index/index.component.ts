import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { IState } from 'directory/src/models';
import { selectOIDCUserId } from '@forgerock/openbanking-ngx-common/oidc';

@Component({
  // tslint:disable-next-line
  selector: 'user-app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class UserIndexComponent implements OnInit {
  username$: Observable<string>;

  constructor(private store: Store<IState>) {}

  ngOnInit() {
    this.username$ = this.store.pipe(select(selectOIDCUserId));
  }
}
