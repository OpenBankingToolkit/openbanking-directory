import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { take, switchMap, catchError, finalize, takeUntil, retry } from 'rxjs/operators';
import { of, Subject, pipe, combineLatest } from 'rxjs';
import _get from 'lodash-es/get';

import debug from 'debug';

import { OrganisationService } from 'directory/src/app/services/organisation.service';
import { IState, IOrganisation } from 'directory/src/models';
import { ForgerockMessagesService } from '@forgerock/openbanking-ngx-common/services/forgerock-messages';
import { selectOIDCUserOrganisationId } from '@forgerock/openbanking-ngx-common/oidc';
import { HttpErrorResponse } from '@angular/common/http';

const log = debug('Organisation:OrganisationIndexComponent');

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrganisationIndexComponent implements OnInit {
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

    this.startLoading();
    this._organisationService
      .getOrganisation(organisationId)
      .pipe(this.updatePipe())
      .subscribe();
  }

  startLoading() {
    this.isLoading = true;
    this.cdr.markForCheck();
  }

  onSubmit() {
    log('submit!', this.organisation);
    this.startLoading();
    this._organisationService
      .putOrganisation(this.organisation)
      .pipe(this.updatePipe(() => this.messages.success('Saved!')))
      .subscribe();
  }

  updatePipe = (onSuccess = () => {}) =>
    pipe(
      takeUntil(this._unsubscribeAll),
      retry(3),
      switchMap((response: IOrganisation) => {
        this.organisation = response;
        onSuccess();
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
    );
}
