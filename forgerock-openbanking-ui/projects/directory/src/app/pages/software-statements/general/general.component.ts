import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  // tslint:disable-next-line
  selector: 'software-statements-general',
  templateUrl: './general.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SoftwareStatementsGeneralComponent implements OnInit {
  public softwareStatementId = this.activatedRoute.snapshot.parent.params.softwareStatementId;

  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit() {}
}
