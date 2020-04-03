import { Component, OnInit, Inject } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, combineLatest } from 'rxjs';

import { IState, IOrganisation } from 'directory/src/models';
import {
  selectCurrrentUserOrganisation,
  selectIsLoading,
  OrganisationRequestAction,
  OrganisationUpdateRequestAction
} from 'directory/src/store/reducers/organisations';
import { first } from 'rxjs/operators';
import { selectOIDCUserOrganisationId } from '@forgerock/openbanking-ngx-common/oidc';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-organisation-form-dialog-container',
  template: `
    <div mat-dialog-content>
      <app-organisation-form
        [organisation]="organisation$ | async"
        [isLoading]="isLoading$ | async"
        (update)="update($event)"
        (cancel)="cancel()"
      >
      </app-organisation-form>
    </div>
  `
})
export class DirectoryOrganisationFormDialogContainer implements OnInit {
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

  constructor(
    public dialogRef: MatDialogRef<DirectoryOrganisationFormDialogContainer>,
    @Inject(MAT_DIALOG_DATA) public data: void,
    protected store: Store<IState>
  ) {}

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

  cancel() {
    this.dialogRef.close();
  }

  update(organisation: IOrganisation) {
    this.store.dispatch(
      OrganisationUpdateRequestAction({
        organisation
      })
    );
    this.dialogRef.close();
  }
}
