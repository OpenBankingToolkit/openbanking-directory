import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { take, switchMap, catchError, finalize, takeUntil, retry } from 'rxjs/operators';
import { of, Subject } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import _get from 'lodash-es/get';
import debug from 'debug';

import { IState, ISoftwareStatement } from 'directory/src/models';
import { SoftwareStatementService } from 'directory/src/app/services/software-statement.service';
import { OrganisationService } from 'directory/src/app/services/organisation.service';
import { ForgerockConfirmDialogComponent } from '@forgerock/openbanking-ngx-common/components/forgerock-confirm-dialog';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { selectOIDCUserOrganisationId } from '@forgerock/openbanking-ngx-common/oidc';
import { ForgerockMessagesService } from '@forgerock/openbanking-ngx-common/services/forgerock-messages';

const log = debug('SoftwareStatements:SoftwareStatementsListComponent');

@Component({
  // tslint:disable-next-line
  selector: 'app-software-statement-list',
  templateUrl: './software-statement-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DirectorySoftwareStatementListComponent implements OnInit, OnDestroy {
  softwareStatements: ISoftwareStatement[];
  isLoading = false;
  private _unsubscribeAll: Subject<any> = new Subject();
  @Input() displayedColumns: string[] = ['id', 'applicationId', 'name', 'delete'];

  constructor(
    private _organisationService: OrganisationService,
    private _softwareStatementService: SoftwareStatementService,
    private _router: Router,
    private store: Store<IState>,
    private cdr: ChangeDetectorRef,
    public dialog: MatDialog,
    private translate: TranslateService,
    private messages: ForgerockMessagesService
  ) {}

  ngOnInit() {
    this.initSoftwareStatement();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  startLoading() {
    this.isLoading = true;
    this.cdr.markForCheck();
  }

  initSoftwareStatement() {
    let organisationId;
    this.store.pipe(select(selectOIDCUserOrganisationId), take(1)).subscribe(value => (organisationId = value));

    this.startLoading();
    this._organisationService
      .getOrganisationSoftwareStatements(organisationId)
      .pipe(
        takeUntil(this._unsubscribeAll),
        retry(3),
        switchMap((response: ISoftwareStatement[]) => {
          this.softwareStatements = response;
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

  createSoftwareStatement() {
    log('New software statement!');
    this.startLoading();
    this._softwareStatementService
      .createSoftwareStatement()
      .pipe(
        takeUntil(this._unsubscribeAll),
        retry(3),
        switchMap((response: ISoftwareStatement) => {
          log('softwareStatements: ', response);
          this._router.navigate(['/software-statements/' + response.id + '/general']);
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

  deleteSoftwareStatement(e: Event, softwareStatementId: string) {
    e.stopPropagation();
    const dialogRef = this.dialog.open(ForgerockConfirmDialogComponent, {
      data: {
        text: this.translate.instant('SOFTWARE_STATEMENTS.REMOVE_CONFIRM', {
          id: softwareStatementId
        })
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.startLoading();
        this._softwareStatementService
          .deleteSoftwareStatement(softwareStatementId)
          .pipe(
            takeUntil(this._unsubscribeAll),
            retry(3),
            switchMap(() => {
              this.initSoftwareStatement();
              return of(true);
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
    });
  }

  goToSoftwareStatement(id: string) {
    this._router.navigate([`/software-statements/${id}/general`]);
  }
}
