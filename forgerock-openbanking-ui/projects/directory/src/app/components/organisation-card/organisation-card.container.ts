import { Component, OnInit, Input } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, combineLatest } from 'rxjs';

import { IState, IOrganisation } from 'directory/src/models';
import {
  selectCurrrentUserOrganisation,
  selectIsLoading,
  OrganisationRequestAction
} from 'directory/src/store/reducers/organisations';
import { first, withLatestFrom } from 'rxjs/operators';
import { selectOIDCUserOrganisationId } from '@forgerock/openbanking-ngx-common/oidc';

const selector = 'app-organisation-card-container';

@Component({
  selector,
  template: `
    <app-organisation-card [organisation]="organisation$ | async" [isLoading]="isLoading$ | async">
    </app-organisation-card>
  `
})
export class DirectoryOrganisationCardContainer implements OnInit {
  @Input() displayedColumns: string[];

  public organisation$: Observable<IOrganisation> = this.store.pipe(select(selectCurrrentUserOrganisation));
  public isLoading$: Observable<boolean> = this.store.pipe(select(selectIsLoading));

  private shouldLoad$: Observable<any> = combineLatest(
    this.organisation$,
    this.store.pipe(select(selectOIDCUserOrganisationId)),
    (organisation: IOrganisation, organisationId: string) => ({
      shouldLoad: organisation === undefined,
      organisationId
    })
  );

  constructor(protected store: Store<IState>) {}

  ngOnInit() {
    this.shouldLoad$.pipe(first()).subscribe(
      ({ shouldLoad, organisationId }) =>
        shouldLoad &&
        this.store.dispatch(
          OrganisationRequestAction({
            organisationId: organisationId
          })
        )
    );
  }
}
