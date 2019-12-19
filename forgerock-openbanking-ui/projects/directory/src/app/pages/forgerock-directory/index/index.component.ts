/* tslint:disable */
import { Component, OnInit, Renderer2, ChangeDetectorRef } from '@angular/core';

import { DirectoryService } from 'directory/src/app/services/directory.service';
import { ForgerockConfigService } from '@forgerock/openbanking-ngx-common/services/forgerock-config';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class ForgerockDirectoryIndexComponent implements OnInit {
  jwkUri;
  constructor(
    private renderer: Renderer2,
    private _directoryService: DirectoryService,
    private conf: ForgerockConfigService
  ) {}

  ngOnInit() {
    this.jwkUri = `${this.conf.get('directoryBackend')}/api/directory/keys/jwk_uri`;
  }

  downloadPublicIssuerCert() {
    this._directoryService
      .getPublicIssuerCert()
      .subscribe(data => this.downloadFile(data, 'text/pem', 'ForgeRock-directory-issuer.pem')),
      error => console.log('Error downloading the file.'),
      () => console.info('OK');
  }

  downloadPublicCACert() {
    this._directoryService
      .getPublicCACert()
      .subscribe(data => this.downloadFile(data, 'text/pem', 'ForgeRock-directory-ca.pem')),
      error => console.log('Error downloading the file.'),
      () => console.info('OK');
  }

  downloadFile(data, type, fileName) {
    const anchor = this.renderer.createElement('a');
    this.renderer.setStyle(anchor, 'visibility', 'hidden');
    this.renderer.setAttribute(anchor, 'href', 'data:' + type + ';charset=utf-8,' + encodeURIComponent(data));
    this.renderer.setAttribute(anchor, 'target', '_blank');
    this.renderer.setAttribute(anchor, 'download', fileName);

    anchor.click();
    anchor.remove();
  }

  onNavigateToJwtUri() {
    window.open(this.jwkUri, '_blank');
  }
}
