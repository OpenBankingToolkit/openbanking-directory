import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Renderer2, OnDestroy } from '@angular/core';
import debug from 'debug';
import { take, switchMap, catchError, finalize, takeUntil, retry } from 'rxjs/operators';
import { of, Subject, pipe } from 'rxjs';
import _get from 'lodash-es/get';
import { MatDialog } from '@angular/material/dialog';

import { ForgerockMessagesService } from '@forgerock/openbanking-ngx-common/services/forgerock-messages';
import { ForgerockConfigService } from '@forgerock/openbanking-ngx-common/services/forgerock-config';
import { DirectoryService } from 'directory/src/app/services/directory.service';
import { HttpErrorResponse } from '@angular/common/http';
import { DirectorySupportDialogComponent } from './support-dialog.component';

const log = debug('Dashboard:DashboardIndexComponent');

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardIndexComponent implements OnInit, OnDestroy {
  public jwkUri = `${this.conf.get('directoryBackend')}/api/directory/keys/jwk_uri`;
  public termsOfServiceLink = this.conf.get(
    'termsOfServiceLink',
    'https://backstage.forgerock.com/knowledge/openbanking/article/a45894685'
  );
  public policyLink = this.conf.get(
    'policyLink',
    'https://backstage.forgerock.com/knowledge/openbanking/article/a11457341'
  );
  public aboutLink = this.conf.get('aboutLink', 'https://backstage.forgerock.com/knowledge/openbanking/');

  isLoading = false;
  private _unsubscribeAll: Subject<any> = new Subject();

  constructor(
    private conf: ForgerockConfigService,
    private renderer: Renderer2,
    private directoryService: DirectoryService,
    private messages: ForgerockMessagesService,
    private cdr: ChangeDetectorRef,
    public dialog: MatDialog
  ) {}

  ngOnInit() {}

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  startLoading() {
    this.isLoading = true;
    this.cdr.markForCheck();
  }

  downloadPublicIssuerCert() {
    this.startLoading();
    this.directoryService
      .getPublicIssuerCert()
      .pipe(this.downloadPipe('ForgeRock-directory-issuer.pem'))
      .subscribe();
  }

  downloadPublicCACert() {
    this.startLoading();
    this.directoryService
      .getPublicCACert()
      .pipe(this.downloadPipe('ForgeRock-directory-ca.pem'))
      .subscribe();
  }

  downloadPipe = (filename: string) =>
    pipe(
      takeUntil(this._unsubscribeAll),
      retry(3),
      switchMap((response: string) => {
        this.downloadFile(response, 'text/pem', filename);
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

  downloadFile(data, type, fileName) {
    const anchor = this.renderer.createElement('a');
    this.renderer.setStyle(anchor, 'visibility', 'hidden');
    this.renderer.setAttribute(anchor, 'href', 'data:' + type + ';charset=utf-8,' + encodeURIComponent(data));
    this.renderer.setAttribute(anchor, 'target', '_blank');
    this.renderer.setAttribute(anchor, 'download', fileName);

    anchor.click();
    anchor.remove();
  }

  openSupportDialog(): void {
    this.dialog.open(DirectorySupportDialogComponent, {
      width: '400px'
    });
  }
}
