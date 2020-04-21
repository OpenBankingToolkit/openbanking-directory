import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-admin-aspsp',
  template: `
    <app-aspsp-card-container
      [displayedColumns]="[
        'logoUri',
        'name',
        'financialId',
        'asDiscoveryEndpoint',
        'rsDiscoveryEndpoint',
        'transportKeys',
        'admin'
      ]"
    ></app-aspsp-card-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminAspspComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
