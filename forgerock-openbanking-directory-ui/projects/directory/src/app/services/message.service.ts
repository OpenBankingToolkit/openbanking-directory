import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { getHTTPOptions } from './utils';
import { ForgerockConfigService } from 'ob-ui-libs/services/forgerock-config';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  constructor(private http: HttpClient, private conf: ForgerockConfigService) {}

  public getUnreadMessages() {
    return this.http.get(`${this.conf.get('directoryBackend')}/api/messages/unread/`, getHTTPOptions());
  }

  public getMessages() {
    return this.http.get(`${this.conf.get('directoryBackend')}/api/messages/`, getHTTPOptions());
  }

  public getAllMessages() {
    return this.http.get(`${this.conf.get('directoryBackend')}/api/messages/all/`, getHTTPOptions());
  }

  public getMessage(messageId) {
    return this.http.get(`${this.conf.get('directoryBackend')}/api/messages/` + messageId, getHTTPOptions());
  }

  public deleteMessage(messageId) {
    return this.http.delete(
      `${this.conf.get('directoryBackend')}/api/messages/` + messageId,
      getHTTPOptions({ responseType: 'text' })
    );
  }

  public postMessage(message) {
    return this.http.post(`${this.conf.get('directoryBackend')}/api/messages/`, message, getHTTPOptions());
  }

  public putMessage(message) {
    return this.http.put(`${this.conf.get('directoryBackend')}/api/messages/`, message, getHTTPOptions());
  }
}
