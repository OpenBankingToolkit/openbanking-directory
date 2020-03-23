import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { getHTTPOptions } from './utils';
import { ForgerockConfigService } from '@forgerock/openbanking-ngx-common/services/forgerock-config';
import { IOrganisation } from 'directory/src/models';

@Injectable({
  providedIn: 'root'
})
export class OrganisationService {
  constructor(private http: HttpClient, private conf: ForgerockConfigService) {}

  public getOrganisations() {
    return this.http.get<IOrganisation[]>(`${this.conf.get('directoryBackend')}/api/organisation/`, getHTTPOptions());
  }

  public getOrganisation(organisationId: string) {
    return this.http.get<IOrganisation>(
      `${this.conf.get('directoryBackend')}/api/organisation/${organisationId}`,
      getHTTPOptions()
    );
  }

  public updateOrganisation(organisation) {
    return this.http.put<IOrganisation>(
      `${this.conf.get('directoryBackend')}/api/organisation/${organisation.id}`,
      organisation,
      getHTTPOptions()
    );
  }

  public getOrganisationSoftwareStatements(organisationId: string) {
    return this.http.get(
      `${this.conf.get('directoryBackend')}/api/organisation/${organisationId}/software-statements`,
      getHTTPOptions()
    );
  }
}
