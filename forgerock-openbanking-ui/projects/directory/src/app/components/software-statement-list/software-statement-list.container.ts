import { Component, OnInit, Input } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { IState, ISoftwareStatement } from 'directory/src/models';
import { selectOIDCUserOrganisationId } from '@forgerock/openbanking-ngx-common/oidc';
import {
  SoftwareStatementsRequestAction,
  SoftwareStatementDeletionRequestAction,
  SoftwareStatementCreationRequestAction,
  selectIsLoading,
  selectCurrentUserSoftwareStatements
} from 'directory/src/store/reducers/software-statements';
import { first, withLatestFrom, map } from 'rxjs/operators';

const selector = 'app-software-statement-list-container';

@Component({
  selector,
  template: `
    <app-software-statement-list
      [displayedColumns]="displayedColumns"
      [softwareStatements]="softwareStatements$ | async"
      [isLoading]="isLoading$ | async"
      (delete)="delete($event)"
      (create)="create()"
    >
    </app-software-statement-list>
  `
})
export class DirectorySoftwareStatementListContainer implements OnInit {
  @Input() displayedColumns: string[];

  public organisationId$: Observable<string> = this.store.pipe(select(selectOIDCUserOrganisationId));
  public isLoading$: Observable<boolean> = this.store.pipe(select(selectIsLoading));

  public softwareStatements$: Observable<ISoftwareStatement[]> = this.store.pipe(
    select(selectCurrentUserSoftwareStatements),
    map(rows => rows && [...rows].reverse())
  );

  constructor(protected store: Store<IState>) {}

  ngOnInit() {
    this.softwareStatements$.pipe(first(), withLatestFrom(this.organisationId$)).subscribe(
      ([softwareStatements, organisationId]) =>
        !softwareStatements &&
        this.store.dispatch(
          SoftwareStatementsRequestAction({
            organisationId
          })
        )
    );
  }

  delete(softwareStatementId: string) {
    this.store.dispatch(
      SoftwareStatementDeletionRequestAction({
        softwareStatementId
      })
    );
  }

  create() {
    this.organisationId$.pipe(first()).subscribe((organisationId: string) => {
      this.store.dispatch(
        SoftwareStatementCreationRequestAction({
          organisationId: organisationId
        })
      );
    });
  }
}
