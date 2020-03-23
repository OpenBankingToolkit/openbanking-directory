import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import _get from 'lodash-es/get';

@Component({
  selector: 'app-index',
  template: `
    <app-organisation-form-card-container></app-organisation-form-card-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrganisationIndexComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
