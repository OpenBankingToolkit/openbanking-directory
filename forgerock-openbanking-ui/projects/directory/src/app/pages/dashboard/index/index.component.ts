import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import debug from 'debug';

const log = debug('Dashboard:DashboardIndexComponent');

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardIndexComponent implements OnInit {
  organisation;

  constructor() {}

  ngOnInit() {}
}
