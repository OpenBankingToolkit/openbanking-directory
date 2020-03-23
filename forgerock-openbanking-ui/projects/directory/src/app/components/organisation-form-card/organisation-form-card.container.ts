import { Component, OnInit, Input } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, combineLatest } from 'rxjs';

import { IState, IOrganisation } from 'directory/src/models';
import {
  selectCurrrentUserOrganisation,
  selectIsLoading,
  OrganisationRequestAction,
  OrganisationUpdateRequestAction
} from 'directory/src/store/reducers/organisations';
import { first, withLatestFrom } from 'rxjs/operators';
import { selectOIDCUserOrganisationId } from '@forgerock/openbanking-ngx-common/oidc';

const selector = 'app-organisation-form-card-container';

@Component({
  selector,
  template: `
    <app-organisation-form-card
      [organisation]="organisation$ | async"
      [isLoading]="isLoading$ | async"
      (update)="update($event)"
    >
    </app-organisation-form-card>
  `
})
export class DirectoryOrganisationFormCardContainer implements OnInit {
  @Input() displayedColumns: string[];

  public organisationId$: Observable<string> = this.store.pipe(select(selectOIDCUserOrganisationId));
  public organisation$: Observable<IOrganisation> = this.store.pipe(select(selectCurrrentUserOrganisation));
  public isLoading$: Observable<boolean> = this.store.pipe(select(selectIsLoading));

  private shouldLoad$: Observable<any> = combineLatest(
    this.organisation$,
    this.organisationId$,
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

  update(organisation: IOrganisation) {
    this.store.dispatch(
      OrganisationUpdateRequestAction({
        organisation
      })
    );
  }
}
