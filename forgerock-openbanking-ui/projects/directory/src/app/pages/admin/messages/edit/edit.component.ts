import { Component, OnInit } from '@angular/core';
import { ForgerockMessagesService } from '@forgerock/openbanking-ngx-common/services/forgerock-messages';
import { MessageService } from 'directory/src/app/services/message.service';
import { ActivatedRoute, Params } from '@angular/router';
import debug from 'debug';

const log = debug('admin:AdminMessagesEditComponent');

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class AdminMessagesEditComponent implements OnInit {
  messageId;
  message;

  constructor(
    private route: ActivatedRoute,
    private _messageService: MessageService,
    private messages: ForgerockMessagesService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.messageId = params['messageId'];
      if (this.messageId) {
        this._messageService.getMessage(this.messageId).subscribe(data => {
          log('message: ', data);
          this.message = data;
        });
      } else {
        this.message = {
          title: '',
          content: ''
        };
      }
    });
  }

  onSubmit() {
    log('submit!', this.message);
    if (!this.messageId) {
      this._messageService.postMessage(this.message).subscribe(data => {
        this.successAlert('Saved!');
        log('message: ', data);
        this.message = data;
        this.messageId = this.message.id;
      });
    } else {
      this._messageService.putMessage(this.message).subscribe(data => {
        this.successAlert('Saved!');
        log('message: ', data);
        this.message = data;
      });
    }
  }

  successAlert(message) {
    this.messages.success(message);
  }

  failureAlert(message) {
    this.messages.error(message);
  }
}
