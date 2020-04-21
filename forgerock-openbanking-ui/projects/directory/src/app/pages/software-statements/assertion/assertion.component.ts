import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Renderer2, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import debug from 'debug';
import _get from 'lodash-es/get';

import { SoftwareStatementService } from 'directory/src/app/services/software-statement.service';
import { ForgerockMessagesService } from '@forgerock/openbanking-ngx-common/services/forgerock-messages';
import { takeUntil, retry, switchMap, catchError, finalize } from 'rxjs/operators';
import { Subject, of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

const log = debug('SoftwareStatements:SoftwareStatementsAssertionComponent');

@Component({
  // tslint:disable-next-line
  selector: 'software-statements-assertion',
  templateUrl: './assertion.component.html',
  styleUrls: ['./assertion.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SoftwareStatementsAssertionComponent implements OnInit, OnDestroy {
  ssa;
  ssaHeader;
  ssaClaims;
  ssaSignature;
  ssaHeaderDecodedJson;
  ssaClaimsDecodedJson;
  isLoading = false;
  softwareStatementId: string = this.activatedRoute.snapshot.parent.params.softwareStatementId;
  private _unsubscribeAll: Subject<any> = new Subject();

  constructor(
    private _softwareStatementService: SoftwareStatementService,
    private activatedRoute: ActivatedRoute,
    private messages: ForgerockMessagesService,
    private cdr: ChangeDetectorRef,
    private renderer: Renderer2
  ) {}

  ngOnInit() {}

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  generateSSA() {
    this.isLoading = true;
    this.cdr.markForCheck();
    this._softwareStatementService
      .generateSSA(this.softwareStatementId)
      .pipe(
        takeUntil(this._unsubscribeAll),
        retry(3),
        switchMap((response: string) => {
          log('ssa: ', response);
          this.ssa = response;
          const [ssaHeader, ssaClaims, ssaSignature] = this.ssa.split('.');
          this.ssaHeader = ssaHeader;
          this.ssaClaims = ssaClaims;
          this.ssaSignature = ssaSignature;
          try {
            this.ssaHeaderDecodedJson = JSON.parse(atob(ssaHeader));
          } catch (error) {
            this.ssaHeaderDecodedJson = error.stack;
          }
          try {
            this.ssaClaimsDecodedJson = JSON.parse(atob(ssaClaims));
          } catch (error) {
            this.ssaClaimsDecodedJson = error.stack;
          }
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

  downloadSSA() {
    const anchor = this.renderer.createElement('a');
    this.renderer.setStyle(anchor, 'visibility', 'hidden');
    this.renderer.setAttribute(anchor, 'href', 'data:text/jwt;charset=utf-8,' + encodeURIComponent(this.ssa));
    this.renderer.setAttribute(anchor, 'target', '_blank');
    this.renderer.setAttribute(anchor, 'download', 'ssa.jwt');

    anchor.click();
    anchor.remove();
  }
}
