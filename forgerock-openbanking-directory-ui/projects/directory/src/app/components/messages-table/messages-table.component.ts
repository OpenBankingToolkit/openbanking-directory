import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';

import { IMessage } from 'directory/src/models';

@Component({
  selector: 'forgerock-messages-table',
  templateUrl: './messages-table.component.html',
  styleUrls: ['./messages-table.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ])
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ForgerockMessagesTableComponent implements OnInit {
  @Input() messages: IMessage[];
  @Input() isLoading: boolean;
  @Input() displayedColumns: string[];
  expandedElement: IMessage | null;

  constructor() {}

  ngOnInit() {}
}
