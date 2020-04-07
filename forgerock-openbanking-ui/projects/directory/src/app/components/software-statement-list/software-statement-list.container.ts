import { Component, OnInit, Input } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, combineLatest } from 'rxjs';

import { IState, ISoftwareStatement } from 'directory/src/models';
import { selectOIDCUserOrganisationId } from '@forgerock/openbanking-ngx-common/oidc';
import {
  getSelectors,
  SoftwareStatementsRequestAction,
  SoftwareStatementDeletionRequestAction,
  SoftwareStatementCreateRequestAction
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

  public isLoading$: Observable<boolean> = this.store.pipe(
    withLatestFrom(this.organisationId$),
    select(([state, organisationId]: [IState, string]) => getSelectors(state, organisationId).isLoading)
  );
  public softwareStatements$: Observable<ISoftwareStatement[]> = this.store.pipe(
    withLatestFrom(this.organisationId$),
    select(([state, organisationId]: [IState, string]) => getSelectors(state, organisationId).selectAll),
    map(rows => rows.reverse())
  );

  private shouldLoad$: Observable<any> = combineLatest(
    this.softwareStatements$,
    this.organisationId$,
    (softwareStatements: ISoftwareStatement[], organisationId: string) => ({
      shouldLoad: !softwareStatements.length,
      organisationId
    })
  );

  constructor(protected store: Store<IState>) {}

  ngOnInit() {
    this.shouldLoad$.pipe(first()).subscribe(
      ({ shouldLoad, organisationId }) =>
        shouldLoad &&
        this.store.dispatch(
          SoftwareStatementsRequestAction({
            organisationId: organisationId
          })
        )
    );
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
