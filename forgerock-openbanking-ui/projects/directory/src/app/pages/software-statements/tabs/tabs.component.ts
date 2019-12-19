import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import debug from 'debug';

const log = debug('SoftwareStatements:SoftwareStatementsTabsComponent');

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class SoftwareStatementsTabsComponent implements OnInit {
  softwareStatementId: string = this.activatedRoute.snapshot.params.softwareStatementId;

  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    log('this.activatedRoute.snapshot 1', this.activatedRoute.snapshot);
  }
}
