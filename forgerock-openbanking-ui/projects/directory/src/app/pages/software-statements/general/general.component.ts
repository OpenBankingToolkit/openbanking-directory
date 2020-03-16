import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import _get from 'lodash-es/get';

import { SoftwareStatementService } from 'directory/src/app/services/software-statement.service';
import { ISoftwareStatement } from 'directory/src/models';
import { ForgerockMessagesService } from '@forgerock/openbanking-ngx-common/services/forgerock-messages';
import { validateMultipleUrls, validateUrl } from '@utils/forms';
import { switchMap, catchError, finalize, takeUntil, retry } from 'rxjs/operators';
import { of, Subject, pipe } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  // tslint:disable-next-line
  selector: 'software-statements-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SoftwareStatementsGeneralComponent implements OnInit, OnDestroy {
  formGroup: FormGroup;
  isLoading = false;
  softwareStatement: ISoftwareStatement;
  private _unsubscribeAll: Subject<any> = new Subject();

  constructor(
    private _softwareStatementService: SoftwareStatementService,
    private activatedRoute: ActivatedRoute,
    private messages: ForgerockMessagesService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.formGroup = new FormGroup({
      id: new FormControl({ value: '', disabled: true }, Validators.required),
      status: new FormControl({ value: '', disabled: true }, Validators.required),
      roles: new FormControl({ value: '', disabled: true }, Validators.required),
      name: new FormControl(''),
      description: new FormControl(''),
      redirectUris: new FormControl('', [validateMultipleUrls]),
      logoUri: new FormControl('', [validateUrl]),
      policyUri: new FormControl('', [validateUrl]),
      termsOfService: new FormControl('', [validateUrl])
    });
    const { softwareStatementId } = this.activatedRoute.snapshot.parent.params;
    this.isLoading = true;
    this._softwareStatementService
      .getSoftwareStatement(softwareStatementId)
      .pipe(this.updatePipe())
      .subscribe();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  updateFormValues(data: ISoftwareStatement) {
    const { id, status, roles, name, description, redirectUris, logoUri, policyUri, termsOfService } = data;
    this.formGroup.patchValue({
      id,
      status,
      roles,
      name,
      description,
      logoUri,
      policyUri,
      termsOfService,
      redirectUris: redirectUris.join(',')
    });
  }

  onSubmit() {
    this.isLoading = true;
    this._softwareStatementService
      .putSoftwareStatement({
        ...this.softwareStatement,
        ...this.formGroup.value,
        redirectUris: this.formGroup.value.redirectUris.split(',')
      })
      .pipe(this.updatePipe())
      .subscribe();
  }

  updatePipe = () =>
    pipe(
      takeUntil(this._unsubscribeAll),
      retry(3),
      switchMap((response: ISoftwareStatement) => {
        this.softwareStatement = response;
        this.updateFormValues(response);
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
