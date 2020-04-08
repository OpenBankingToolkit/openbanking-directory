import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { getHTTPOptions } from './utils';
import { ForgerockConfigService } from '@forgerock/openbanking-ngx-common/services/forgerock-config';
import { ISoftwareStatement } from 'directory/src/models';

@Injectable({
  providedIn: 'root'
})
export class SoftwareStatementService {
  constructor(private http: HttpClient, private conf: ForgerockConfigService) {}
  public getSoftwareStatement(softwareStatementId: string) {
    return this.http.get<ISoftwareStatement>(
      `${this.conf.get('directoryBackend')}/api/software-statement/${softwareStatementId}`,
      getHTTPOptions()
    );
  }

  public putSoftwareStatement(softwareStatement) {
    return this.http.put(
      `${this.conf.get('directoryBackend')}/api/software-statement/${softwareStatement.id}`,
      softwareStatement,
      getHTTPOptions()
    );
  }

  public createSoftwareStatement() {
    return this.http.post(`${this.conf.get('directoryBackend')}/api/software-statement/`, {}, getHTTPOptions());
  }

  public deleteSoftwareStatement(softwareStatementId: string) {
    return this.http.delete(
      `${this.conf.get('directoryBackend')}/api/software-statement/${softwareStatementId}`,
      getHTTPOptions()
    );
  }

  public getApplication(softwareStatementId: string) {
    return this.http.get(
      `${this.conf.get('directoryBackend')}/api/software-statement/${softwareStatementId}/application`,
      getHTTPOptions()
    );
  }

  public transportKeysJwkUri(softwareStatementId: string) {
    return this.http.get(
      `${this.conf.get(
        'directoryBackend'
      )}/api/software-statement/${softwareStatementId}/application/transport/jwk_uri`,
      getHTTPOptions()
    );
  }

  public rotateTransportKeys(softwareStatementId: string) {
    return this.http.put(
      `${this.conf.get('directoryBackend')}/api/software-statement/${softwareStatementId}/application/transport/rotate`,
      {},
      getHTTPOptions()
    );
  }

  public resetTransportKeys(softwareStatementId: string) {
    return this.http.put(
      `${this.conf.get('directoryBackend')}/api/software-statement/${softwareStatementId}/application/transport/reset`,
      {},
      getHTTPOptions()
    );
  }

  public signingEncryptionKeysJwkUri(softwareStatementId: string) {
    return this.http.get(
      `${this.conf.get('directoryBackend')}/api/software-statement/${softwareStatementId}/application/jwk_uri`,
      getHTTPOptions()
    );
  }

  public rotateSigningEncryptionKeys(softwareStatementId: string) {
    return this.http.put(
      `${this.conf.get('directoryBackend')}/api/software-statement/${softwareStatementId}/application/rotate`,
      {},
      getHTTPOptions()
    );
  }

  public resetSigningEncryptionKeys(softwareStatementId: string) {
    return this.http.put(
      `${this.conf.get('directoryBackend')}/api/software-statement/${softwareStatementId}/application/reset`,
      {},
      getHTTPOptions()
    );
  }

  public getPublicJwk(softwareStatementId: string, kid: string) {
    return this.http.get(
      `${this.conf.get(
        'directoryBackend'
      )}/api/software-statement/${softwareStatementId}/application/${kid}/download/publicJwk`,
      getHTTPOptions({ responseType: 'text' })
    );
  }

  public getPrivateJwk(softwareStatementId: string, kid: string) {
    return this.http.get(
      `${this.conf.get(
        'directoryBackend'
      )}/api/software-statement/${softwareStatementId}/application/${kid}/download/privateJwk`,
      getHTTPOptions({ responseType: 'text' })
    );
  }

  public getPublicCert(softwareStatementId: string, kid: string) {
    return this.http.get(
      `${this.conf.get(
        'directoryBackend'
      )}/api/software-statement/${softwareStatementId}/application/${kid}/download/publicCert`,
      getHTTPOptions({ responseType: 'text' })
    );
  }

  public getPrivateCert(softwareStatementId: string, kid: string) {
    return this.http.get(
      `${this.conf.get(
        'directoryBackend'
      )}/api/software-statement/${softwareStatementId}/application/${kid}/download/privateCert`,
      getHTTPOptions({ responseType: 'text' })
    );
  }

  public generateSSA(softwareStatementId: string) {
    return this.http.post(
      `${this.conf.get('directoryBackend')}/api/software-statement/${softwareStatementId}/ssa`,
      {},
      getHTTPOptions({ responseType: 'text' })
    );
  }

  public testMatls(softwareStatementId: string, aspspId: string) {
    return this.http.get(
      `${this.conf.get(
        'directoryBackend'
      )}/api/software-statement/${softwareStatementId}/onboarding/${aspspId}/testMtls/`,
      getHTTPOptions()
    );
  }

  public onboard(softwareStatementId: string, aspspId: string) {
    return this.http.post(
      `${this.conf.get('directoryBackend')}/api/software-statement/${softwareStatementId}/onboarding/${aspspId}`,
      {},
      getHTTPOptions()
    );
  }

  public readBoarding(softwareStatementId: string, aspspId: string) {
    return this.http.get(
      `${this.conf.get('directoryBackend')}/api/software-statement/${softwareStatementId}/onboarding/${aspspId}`,
      getHTTPOptions()
    );
  }

  public updateboard(softwareStatementId: string, aspspId: string) {
    return this.http.put(
      `${this.conf.get('directoryBackend')}/api/software-statement/${softwareStatementId}/onboarding/${aspspId}`,
      {},
      getHTTPOptions()
    );
  }

  public offboard(softwareStatementId: string, aspspId: string) {
    return this.http.delete(
      `${this.conf.get('directoryBackend')}/api/software-statement/${softwareStatementId}/onboarding/${aspspId}`,
      getHTTPOptions()
    );
  }
}
