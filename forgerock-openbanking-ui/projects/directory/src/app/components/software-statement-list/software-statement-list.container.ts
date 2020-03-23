import { Component, OnInit, Input } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { IState, ISoftwareStatement } from 'directory/src/models';
import { selectOIDCUserOrganisationId } from '@forgerock/openbanking-ngx-common/oidc';
import {
  getSelectors,
  SoftwareStatementsRequestAction,
  SoftwareStatementDeletionRequestAction,
  SoftwareStatementCreateRequestAction
} from 'directory/src/store/reducers/software-statements';
import { first, withLatestFrom, mergeMap } from 'rxjs/operators';

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

  public isLoading$: Observable<ISoftwareStatement[]> = this.store.pipe(
    withLatestFrom(this.organisationId$),
    select(([state, organisationId]: [IState, string]) => getSelectors(state, organisationId).isLoading)
  );
  public softwareStatements$: Observable<ISoftwareStatement[]> = this.store.pipe(
    withLatestFrom(this.organisationId$),
    select(([state, organisationId]: [IState, string]) => getSelectors(state, organisationId).selectAll)
  );

  constructor(protected store: Store<IState>) {}

  ngOnInit() {
    this.softwareStatements$.pipe(first()).subscribe(data => {
      console.log('data', data);
      return (
        !data.length &&
        this.store.dispatch(
          SoftwareStatementsRequestAction({
            organisationId: '5e45732cb4c37200146018f9'
          })
        )
      );
    });
  }

  delete(softwareStatementId: string) {
    this.organisationId$.pipe(first()).subscribe((organisationId: string) => {
      this.store.dispatch(
        SoftwareStatementDeletionRequestAction({
          organisationId: organisationId,
          softwareStatementId
        })
      );
    });
  }

  create() {
    this.organisationId$.pipe(first()).subscribe((organisationId: string) => {
      this.store.dispatch(
        SoftwareStatementCreateRequestAction({
          organisationId: organisationId
        })
      );
    });
  }
}
