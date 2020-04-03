import { Component, OnInit, Input } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { IState, IAspsp, IAuhtorities } from 'directory/src/models';
import { first, map } from 'rxjs/operators';
import {
  selectAspsps,
  selectIsLoading,
  AspspsRequestAction,
  AspspUpdateRequestAction,
  AspspCreateRequestAction
} from 'directory/src/store/reducers/aspsps';
import { selectOIDCUserAuthorities } from '@forgerock/openbanking-ngx-common/oidc';

@Component({
  selector: 'app-aspsp-card-container',
  template: `
    <app-aspsp-card
      [displayedColumns]="displayedColumns"
      [isAdmin]="isAdmin$ | async"
      [aspsps]="aspsps$ | async"
      [isLoading]="isLoading$ | async"
      (create)="create($event)"
      (update)="update($event)"
    >
    </app-aspsp-card>
  `
})
export class DirectoryASPSPCardContainer implements OnInit {
  @Input() displayedColumns: string[];

  public aspsps$: Observable<IAspsp[]> = this.store.pipe(select(selectAspsps));
  public isAdmin$: Observable<string[]> = this.store.pipe(
    select(selectOIDCUserAuthorities),
    map(authorities => authorities.includes(IAuhtorities.GROUP_FORGEROCK))
  );
  public isLoading$: Observable<boolean> = this.store.pipe(select(selectIsLoading));

  constructor(protected store: Store<IState>) {}

  ngOnInit() {
    this.aspsps$
      .pipe(first())
      .subscribe((aspsps: IAspsp[]) => !aspsps.length && this.store.dispatch(AspspsRequestAction()));
  }

  create(aspsp: IAspsp) {
    this.store.dispatch(AspspCreateRequestAction({ aspsp }));
  }

  update(aspsp: IAspsp) {
    this.store.dispatch(AspspUpdateRequestAction({ aspsp }));
  }
}
