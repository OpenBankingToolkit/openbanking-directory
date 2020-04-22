import { Component, OnInit, Input } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { IState, IOrganisation } from 'directory/src/models';
import {
  selectOrganisations,
  selectIsLoading,
  OrganisationsRequestAction
} from 'directory/src/store/reducers/organisations';
import { first } from 'rxjs/operators';
import { selectOIDCUserOrganisationId } from '@forgerock/openbanking-ngx-common/oidc';

@Component({
  selector: 'app-organisations-table-container',
  template: `
    <app-organisations-table [organisations]="organisations$ | async" [isLoading]="isLoading$ | async">
    </app-organisations-table>
  `
})
export class DirectoryOrganisationsTableContainer implements OnInit {
  @Input() displayedColumns: string[];

  public organisations$: Observable<IOrganisation[]> = this.store.pipe(select(selectOrganisations));
  public isLoading$: Observable<boolean> = this.store.pipe(select(selectIsLoading));
  public currentOrganisationId$: Observable<string> = this.store.pipe(select(selectOIDCUserOrganisationId));

  constructor(protected store: Store<IState>) {}

  ngOnInit() {
    this.organisations$
      .pipe(first())
      .subscribe(organisations => organisations.length <= 1 && this.store.dispatch(OrganisationsRequestAction()));
  }
}
