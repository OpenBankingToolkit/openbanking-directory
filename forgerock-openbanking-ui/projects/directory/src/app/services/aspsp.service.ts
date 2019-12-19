import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { getHTTPOptions } from './utils';
import { ForgerockConfigService } from '@forgerock/openbanking-ngx-common/services/forgerock-config';

@Injectable({
  providedIn: 'root'
})
export class AspspService {
  constructor(private http: HttpClient, private conf: ForgerockConfigService) {}

  getAspsps() {
    return this.http.get(`${this.conf.get('directoryBackend')}/api/aspsp/`, getHTTPOptions());
  }

  getAspsp(aspspId) {
    return this.http.get(`${this.conf.get('directoryBackend')}/api/aspsp/${aspspId}`, getHTTPOptions());
  }

  createAspsp() {
    return this.http.post(`${this.conf.get('directoryBackend')}/api/aspsp/`, {}, getHTTPOptions());
  }

  updateAspsp(aspsp) {
    return this.http.put(`${this.conf.get('directoryBackend')}/api/aspsp/${aspsp.id}`, aspsp, getHTTPOptions());
  }
}
