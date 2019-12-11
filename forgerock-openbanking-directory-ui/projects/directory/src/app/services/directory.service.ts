import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { getHTTPOptions } from './utils';
import { ForgerockConfigService } from 'ob-ui-libs/services/forgerock-config';

@Injectable({
  providedIn: 'root'
})
export class DirectoryService {
  constructor(private http: HttpClient, private conf: ForgerockConfigService) {}

  getPublicCACert() {
    return this.http.get(
      `${this.conf.get('directoryBackend')}/api/directory/keys/ca/publicCert`,
      getHTTPOptions({ responseType: 'text' })
    );
  }

  getPublicIssuerCert() {
    return this.http.get(
      `${this.conf.get('directoryBackend')}/api/directory/keys/current/publicCert`,
      getHTTPOptions({ responseType: 'text' })
    );
  }
}
