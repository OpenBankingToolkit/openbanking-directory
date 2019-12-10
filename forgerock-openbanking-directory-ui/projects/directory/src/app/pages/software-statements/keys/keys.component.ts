/* tslint:disable */
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Renderer2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import debug from 'debug';

import { SoftwareStatementService } from 'directory/src/app/services/software-statement.service';
import { IState } from 'directory/src/models';
import { ForgerockMessagesService } from 'ob-ui-libs/services/forgerock-messages';
import { ForgerockConfigService } from 'ob-ui-libs/services/forgerock-config';

const log = debug('SoftwareStatements:SoftwareStatementsKeysComponent');

@Component({
  selector: 'software-statements-keys',
  templateUrl: './keys.component.html',
  styleUrls: ['./keys.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SoftwareStatementsKeysComponent implements OnInit {
  keyUri: string;
  softwareStatementId: string = this.activatedRoute.snapshot.parent.params.softwareStatementId;
  softwareStatement;
  application;
  transportKeys;
  keys;
  transportJwkUri;
  keysJwkUri;
  keyManagementDoc;
  OBRIDoc;
  displayedColumns: string[] = [
    'kid',
    'keyUse',
    'status',
    'algo',
    'validity-start',
    'validity-end',
    /* 'description', */ 'actions'
  ];

  constructor(
    private _softwareStatementService: SoftwareStatementService,
    private activatedRoute: ActivatedRoute,
    private store: Store<IState>,
    private messages: ForgerockMessagesService,
    private cdr: ChangeDetectorRef,
    private conf: ForgerockConfigService,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: any
  ) {}

  ngOnInit() {
    this.keyUri = `${this.conf.get('directoryBackend')}/api/software-statement/${this.softwareStatementId}/application`;
    this.transportJwkUri = `${this.conf.get('directoryBackend')}/api/software-statement/${
      this.softwareStatementId
    }/application/transport/jwk_uri`;
    this.keysJwkUri = `${this.conf.get('directoryBackend')}/api/software-statement/${
      this.softwareStatementId
    }/application/jwk_uri`;

    log('this.softwareStatementId: ', this.softwareStatementId);
    this._softwareStatementService.getSoftwareStatement(this.softwareStatementId).subscribe((data: any) => {
      log('softwareStatement: ', data);
      this.softwareStatement = data;
      this.cdr.detectChanges();
    });

    this.refreshApplication();
  }

  onNavigateToTransportJwtUri() {
    window.open(this.transportJwkUri, '_blank');
  }

  onNavigateToSigningAndEncryptionJwtUri() {
    window.open(this.keysJwkUri, '_blank');
  }

  onNavigateToOBRIDoc() {
    window.open(this.OBRIDoc, '_blank');
  }

  onNavigateToKeyManagementDoc() {
    window.open(this.keyManagementDoc, '_blank');
  }

  getStatus(key) {
    if (key.validityWindowStop == null) {
      return 'ACTIVE';
    } else {
      return 'REVOKED';
    }
  }

  getPublicJwk(kid: string) {
    this._softwareStatementService
      .getPublicJwk(this.softwareStatementId, kid)
      .subscribe(data => this.downloadFile(data, 'text/json', kid + '.public.jwk')),
      error => log('Error downloading the file.', error),
      () => log('OK');
  }

  getPrivateJwk(kid: string) {
    this._softwareStatementService
      .getPrivateJwk(this.softwareStatementId, kid)
      .subscribe(data => this.downloadFile(data, 'text/json', kid + '.private.jwk')),
      error => log('Error downloading the file.', error),
      () => log('OK');
  }

  getPublicCert(kid: string) {
    this._softwareStatementService
      .getPublicCert(this.softwareStatementId, kid)
      .subscribe(data => this.downloadFile(data, 'text/pem', kid + '.pem')),
      error => log('Error downloading the file.', error),
      () => log('OK');
  }

  getPrivateCert(kid: string) {
    this._softwareStatementService
      .getPrivateCert(this.softwareStatementId, kid)
      .subscribe(data => this.downloadFile(data, 'text/key', kid + '.key')),
      error => log('Error downloading the file.', error),
      () => log('OK');
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
    this._softwareStatementService.rotateTransportKeys(this.softwareStatementId).subscribe(data => {
      this.updateApp(data);
    });
  }

  resetTransportKeys() {
    log('resetTransportKeys: ');
    this._softwareStatementService.resetTransportKeys(this.softwareStatementId).subscribe(data => {
      this.updateApp(data);
    });
  }

  rotateSigningEncryptionKeys() {
    log('rotateSigningEncryptionKeys: ');
    this._softwareStatementService.rotateSigningEncryptionKeys(this.softwareStatementId).subscribe(data => {
      this.updateApp(data);
    });
  }

  resetSigningEncryptionKeys() {
    log('resetSigningEncryptionKeys: ');
    this._softwareStatementService.resetSigningEncryptionKeys(this.softwareStatementId).subscribe(data => {
      this.updateApp(data);
    });
  }

  refreshApplication() {
    this._softwareStatementService.getApplication(this.softwareStatementId).subscribe(data => {
      this.updateApp(data);
    });
  }

  updateApp(data) {
    log('application: ', data);
    this.application = data;
    this.transportKeys = Object.values(this.application.transportKeys);
    for (const transport of this.transportKeys) {
      transport.keyUse = 'TRANSPORT';
    }
    this.keys = Object.values(this.application.keys).concat(this.transportKeys);
    // Do something with 'event'
    this.cdr.detectChanges();
  }
}
