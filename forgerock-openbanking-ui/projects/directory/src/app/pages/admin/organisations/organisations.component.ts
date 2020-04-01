import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-organisations-page',
  template: `
    <app-organisations-table-container></app-organisations-table-container>
  `
})
export class AdminOrganisationsPageComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
