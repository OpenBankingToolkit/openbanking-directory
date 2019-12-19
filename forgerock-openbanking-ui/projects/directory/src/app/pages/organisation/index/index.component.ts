import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { take } from 'rxjs/operators';
import debug from 'debug';

import { OrganisationService } from 'directory/src/app/services/organisation.service';
import { IState } from 'directory/src/models';
import { ForgerockMessagesService } from '@forgerock/openbanking-ngx-common/services/forgerock-messages';
import { selectOIDCUserOrganisationId } from '@forgerock/openbanking-ngx-common/oidc';

const log = debug('Organisation:OrganisationIndexComponent');

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrganisationIndexComponent implements OnInit {
  organisation;

  constructor(
    private _organisationService: OrganisationService,
    private messages: ForgerockMessagesService,
    private store: Store<IState>,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    log('user: ');
    let organisationId;
    this.store
      .pipe(select(selectOIDCUserOrganisationId))
      .pipe(take(1))
      .subscribe(value => (organisationId = value));
    this._organisationService.getOrgansation(organisationId).subscribe(data => {
      log('organisation: ', data);
      this.organisation = data;
      this.cdr.detectChanges();
    });
  }

  onSubmit() {
    log('submit!', this.organisation);
    this._organisationService.putOrgansation(this.organisation).subscribe(data => {
      this.messages.success('Saved!');
      log('organisation: ', data);
      this.organisation = data;
      this.cdr.detectChanges();
    });
  }
}
