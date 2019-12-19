import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ForgerockConfigService } from '@forgerock/openbanking-ngx-common/services/forgerock-config';

@Injectable({
  providedIn: 'root'
})
export class AccountRequestsService {
  constructor(private http: HttpClient, private conf: ForgerockConfigService) {}

  getAccountRequests() {
    return this.http.get(`${this.conf.get('accountRequestsEndpoint')}`);
  }

  getAccountRequest(id) {
    return this.http.get(`${this.conf.get('accountRequestsEndpoint')}/${id}`);
  }
}
