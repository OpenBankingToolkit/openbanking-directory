import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-index',
  template: `
    <app-aspsp-card-container></app-aspsp-card-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AspspsIndexComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
