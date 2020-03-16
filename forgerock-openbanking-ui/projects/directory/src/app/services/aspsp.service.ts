import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { getHTTPOptions } from './utils';
import { ForgerockConfigService } from '@forgerock/openbanking-ngx-common/services/forgerock-config';
import { IAspsp } from 'directory/src/models';

@Injectable({
  providedIn: 'root'
})
export class AspspService {
  constructor(private http: HttpClient, private conf: ForgerockConfigService) {}

  getAspsps() {
    return this.http.get<IAspsp[]>(`${this.conf.get('directoryBackend')}/api/aspsp/`, getHTTPOptions());
  }

  getAspsp(aspspId) {
    return this.http.get<IAspsp>(`${this.conf.get('directoryBackend')}/api/aspsp/${aspspId}`, getHTTPOptions());
  }

  createAspsp() {
    return this.http.post<IAspsp>(`${this.conf.get('directoryBackend')}/api/aspsp/`, {}, getHTTPOptions());
  }

  updateAspsp(aspsp) {
    return this.http.put<IAspsp>(`${this.conf.get('directoryBackend')}/api/aspsp/${aspsp.id}`, aspsp, getHTTPOptions());
  }
}
