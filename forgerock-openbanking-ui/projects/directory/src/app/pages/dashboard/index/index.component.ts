import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { take } from 'rxjs/operators';
import debug from 'debug';

import { OrganisationService } from 'directory/src/app/services/organisation.service';
import { IState } from 'directory/src/models';
import { selectOIDCUserOrganisationId } from '@forgerock/openbanking-ngx-common/oidc';

const log = debug('Dashboard:DashboardIndexComponent');

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardIndexComponent implements OnInit {
  organisation;
  softwareStatements;

  constructor(
    private _organisationService: OrganisationService,
    private _router: Router,
    private store: Store<IState>,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    let organisationId;
    this.store
      .pipe(select(selectOIDCUserOrganisationId))
      .pipe(take(1))
      .subscribe(value => (organisationId = value));
    log('user: ', organisationId);
    this._organisationService.getOrgansation(organisationId).subscribe(data => {
      log('organisation: ', data);
      this.organisation = data;
      this.cdr.detectChanges();
    });
  }
}
