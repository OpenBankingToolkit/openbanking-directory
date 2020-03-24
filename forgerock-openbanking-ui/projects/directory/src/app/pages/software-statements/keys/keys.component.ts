import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Renderer2,
  Inject,
  OnDestroy
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { switchMap, catchError, finalize, retry, takeUntil } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import debug from 'debug';
import _get from 'lodash-es/get';

import { SoftwareStatementService } from 'directory/src/app/services/software-statement.service';
import { ISoftwareStatementApplication } from 'directory/src/models';
import { ForgerockMessagesService } from '@forgerock/openbanking-ngx-common/services/forgerock-messages';
import { ForgerockConfigService } from '@forgerock/openbanking-ngx-common/services/forgerock-config';
import { of, pipe, Subject } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

const log = debug('SoftwareStatements:SoftwareStatementsKeysComponent');

@Component({
  selector: 'software-statements-keys',
  templateUrl: './keys.component.html',
  styleUrls: ['./keys.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SoftwareStatementsKeysComponent implements OnInit, OnDestroy {
  keyUri: string;
  softwareStatementId: string = this.activatedRoute.snapshot.parent.params.softwareStatementId;
  softwareStatement;
  application: ISoftwareStatementApplication;
  transportKeys;
  keys;
  displayedColumns: string[] = [
    'kid',
    'keyUse',
    'status',
    'algo',
    'validity-start',
    'validity-end',
    /* 'description', */ 'actions'
  ];
  isLoading = false;
  private _unsubscribeAll: Subject<any> = new Subject();
  public transportJwkUri = `${this.conf.get('directoryBackend')}/api/software-statement/${
    this.softwareStatementId
  }/application/jwk_uri`;
  public SigningAndEncryptionJwtUri = `${this.conf.get('directoryBackend')}/api/software-statement/${
    this.softwareStatementId
  }/application/jwk_uri`;

  constructor(
    private _softwareStatementService: SoftwareStatementService,
    private activatedRoute: ActivatedRoute,
    private messages: ForgerockMessagesService,
    private cdr: ChangeDetectorRef,
    private conf: ForgerockConfigService,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: any
  ) {}

  ngOnInit() {
    log('this.softwareStatementId: ', this.softwareStatementId);
    this.isLoading = true;
    this.cdr.markForCheck();
    this._softwareStatementService
      .getApplication(this.softwareStatementId)
      .pipe(this.updateAppPipe())
      .subscribe();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  getStatus(key) {
    if (key.validityWindowStop == null) {
      return 'ACTIVE';
    } else {
      return 'REVOKED';
    }
  }

  downloadPipe = (filePath: string) =>
    pipe(
      takeUntil(this._unsubscribeAll),
      retry(3),
      switchMap((response: string) => {
        this.downloadFile(response, 'text/json', filePath);
        return of(response);
      }),
      catchError((er: HttpErrorResponse | Error) => {
        const error = _get(er, 'error.Message') || _get(er, 'error.message') || _get(er, 'message') || er;
        this.messages.error(error);
        return of(er);
      })
    );

  getPublicJwk(kid: string) {
    this._softwareStatementService
      .getPublicJwk(this.softwareStatementId, kid)
      .pipe(this.downloadPipe(kid + '.public.jwk'))
      .subscribe();
  }

  getPrivateJwk(kid: string) {
    this._softwareStatementService
      .getPrivateJwk(this.softwareStatementId, kid)
      .pipe(this.downloadPipe(kid + '.private.jwk'))
      .subscribe();
  }

  getPublicCert(kid: string) {
    this._softwareStatementService
      .getPublicCert(this.softwareStatementId, kid)
      .pipe(this.downloadPipe(kid + '.pem'))
      .subscribe();
  }

  getPrivateCert(kid: string) {
    this._softwareStatementService
      .getPrivateCert(this.softwareStatementId, kid)
      .pipe(this.downloadPipe(kid + '.key'))
      .subscribe();
  }

  downloadFile(data, type, fileName) {
    const anchor = this.renderer.createElement('a');
    this.renderer.setStyle(anchor, 'visibility', 'hidden');
    this.renderer.setAttribute(anchor, 'href', 'data:' + type + ';charset=utf-8,' + encodeURIComponent(data));
    this.renderer.setAttribute(anchor, 'target', '_blank');
    this.renderer.setAttribute(anchor, 'download', fileName);
    this.document.body.appendChild(anchor); // Required for Firefox
    log(fileName);
    anchor.click();
    anchor.remove();
  }

  rotateTransportKeys() {
    log('rotateTransportKeys: ');
    this.isLoading = true;
    this.cdr.markForCheck();
    this._softwareStatementService
      .rotateTransportKeys(this.softwareStatementId)
      .pipe(this.updateAppPipe())
      .subscribe();
  }

  resetTransportKeys() {
    log('resetTransportKeys: ');
    this.isLoading = true;
    this.cdr.markForCheck();
    this._softwareStatementService
      .resetTransportKeys(this.softwareStatementId)
      .pipe(this.updateAppPipe())
      .subscribe();
  }

  rotateSigningEncryptionKeys() {
    log('rotateSigningEncryptionKeys: ');
    this.isLoading = true;
    this.cdr.markForCheck();
    this._softwareStatementService
      .rotateSigningEncryptionKeys(this.softwareStatementId)
      .pipe(this.updateAppPipe())
      .subscribe();
  }

  resetSigningEncryptionKeys() {
    log('resetSigningEncryptionKeys: ');
    this.isLoading = true;
    this.cdr.markForCheck();
    this._softwareStatementService
      .resetSigningEncryptionKeys(this.softwareStatementId)
      .pipe(this.updateAppPipe())
      .subscribe();
  }

  updateAppPipe = () =>
    pipe(
      takeUntil(this._unsubscribeAll),
      retry(3),
      switchMap((response: ISoftwareStatementApplication) => {
        log('application: ', response);
        this.application = response;
        this.transportKeys = Object.values(this.application.transportKeys);
        for (const transport of this.transportKeys) {
          transport.keyUse = 'TRANSPORT';
        }
        this.keys = Object.values(this.application.keys).concat(this.transportKeys);
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
