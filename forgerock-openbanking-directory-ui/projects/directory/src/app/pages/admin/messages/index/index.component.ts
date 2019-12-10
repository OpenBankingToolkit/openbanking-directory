import { Component, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';

import { MessageService } from 'directory/src/app/services/message.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ])
  ]
})
export class AdminMessagesIndexComponent implements OnInit {
  messages;
  displayedColumns: string[] = [
    'created',
    'author',
    'expiredDate',
    'audiences',
    'title',
    'action-read',
    'action-edit',
    'action-delete'
  ];

  constructor(private _messageService: MessageService) {}

  ngOnInit() {
    this.refreshMessages();
  }

  deleteMessage(e: Event, messageId) {
    e.stopPropagation();
    this._messageService.deleteMessage(messageId).subscribe(data => {
      this.refreshMessages();
    });
  }

  refreshMessages() {
    this._messageService.getAllMessages().subscribe(data => {
      this.messages = data;
    });
  }
}
