import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { take, switchMap, catchError, finalize, takeUntil, retry } from 'rxjs/operators';
import { of, Subject } from 'rxjs';
import _get from 'lodash-es/get';

import debug from 'debug';

import { OrganisationService } from 'directory/src/app/services/organisation.service';
import { IState, IOrganisation } from 'directory/src/models';
import { ForgerockMessagesService } from '@forgerock/openbanking-ngx-common/services/forgerock-messages';
import { selectOIDCUserOrganisationId } from '@forgerock/openbanking-ngx-common/oidc';
import { HttpErrorResponse } from '@angular/common/http';

const log = debug('Organisation:OrganisationIndexComponent');

@Component({
  selector: 'app-organisation-card',
  template: `
    <mat-card>
      <mat-card-title
        >Your organisation
        <span fxFlex></span>
        <button
          mat-icon-button
          routerLink="/organisation"
          aria-label="Edit organisation"
        >
          <mat-icon>edit</mat-icon>
        </button></mat-card-title
      >
      <mat-card-content
        ><mat-progress-bar
          [style.visibility]="isLoading ? 'visible' : 'hidden'"
          mode="indeterminate"
        ></mat-progress-bar>
        <div *ngIf="organisation">
          <mat-list>
            <mat-list-item>
              <div mat-line>ID</div>
              <p mat-line>{{ organisation?.id }}</p>
            </mat-list-item>
            <mat-list-item>
              <div mat-line>Name</div>
              <p mat-line>{{ organisation?.name }}</p>
            </mat-list-item>
            <mat-list-item>
              <div mat-line>Status</div>
              <p mat-line>{{ organisation?.status }}</p>
            </mat-list-item>
            <mat-list-item class="wrap">
              <div mat-line>Description</div>
              <p mat-line>{{ organisation?.description }}</p>
            </mat-list-item>
          </mat-list>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [
    `
      mat-card-title {
        align-items: center;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DirectoryOrganisationCardComponent implements OnInit, OnDestroy {
  organisation: IOrganisation;
  isLoading = false;
  private _unsubscribeAll: Subject<any> = new Subject();

  constructor(
    private _organisationService: OrganisationService,
    private messages: ForgerockMessagesService,
    private store: Store<IState>,
    private cdr: ChangeDetectorRef
  ) {}
  ngOnInit() {
    let organisationId;
    this.store.pipe(select(selectOIDCUserOrganisationId), take(1)).subscribe(value => (organisationId = value));

    this.isLoading = true;
    this._organisationService
      .getOrganisation(organisationId)
      .pipe(
        takeUntil(this._unsubscribeAll),
        retry(3),
        switchMap((response: IOrganisation) => {
          this.organisation = response;
          return of(response);
        }),
        catchError((er: HttpErrorResponse | Error) => {
          const error = _get(er, 'error.Message') || _get(er, 'error.message') || _get(er, 'message') || er;
          this.messages.error(error);
          return of(er);
        }),
        finalize(() => {
          this.isLoading = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
