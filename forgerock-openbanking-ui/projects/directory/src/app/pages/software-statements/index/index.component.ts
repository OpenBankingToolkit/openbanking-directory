import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { take } from 'rxjs/operators';
import debug from 'debug';

import { IState, ISoftwareStatement } from 'directory/src/models';
import { SoftwareStatementService } from 'directory/src/app/services/software-statement.service';
import { OrganisationService } from 'directory/src/app/services/organisation.service';
import { ForgerockConfirmDialogComponent } from '@forgerock/openbanking-ngx-common/components/forgerock-confirm-dialog';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { selectOIDCUserOrganisationId } from '@forgerock/openbanking-ngx-common/oidc';

const log = debug('SoftwareStatements:SoftwareStatementsListComponent');

@Component({
  // tslint:disable-next-line
  selector: 'software-statements-list',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SoftwareStatementsListComponent implements OnInit {
  softwareStatements: ISoftwareStatement[];
  displayedColumns: string[] = ['id', 'applicationId', 'name', 'description', 'seeMore', 'delete'];

  constructor(
    private _organisationService: OrganisationService,
    private _softwareStatementService: SoftwareStatementService,
    private _router: Router,
    private store: Store<IState>,
    private cdr: ChangeDetectorRef,
    public dialog: MatDialog,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.initSoftwareStatement();
  }

  initSoftwareStatement() {
    let organisationId;
    this.store
      .pipe(select(selectOIDCUserOrganisationId))
      .pipe(take(1))
      .subscribe(value => (organisationId = value));
    this._organisationService.getOrganisationSoftwareStatements(organisationId).subscribe((data: any) => {
      log('softwareStatements: ', data);
      this.softwareStatements = data;
      this.cdr.detectChanges();
    });
  }

  createSoftwareStatement() {
    log('New software statement!');
    // Helpers.setLoading(true);

    this._softwareStatementService.createSoftwareStatement().subscribe((data: any) => {
      log('softwareStatements: ', data);
      // Helpers.setLoading(false);
      this._router.navigate(['/software-statements/' + data.id + '/general']);
    });
  }

  deleteSoftwareStatement(softwareStatementId: string) {
    const dialogRef = this.dialog.open(ForgerockConfirmDialogComponent, {
      data: {
        text: this.translate.instant('SOFTWARE_STATEMENTS.REMOVE_CONFIRM', {
          id: softwareStatementId
        })
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._softwareStatementService
          .deleteSoftwareStatement(softwareStatementId)
          .subscribe(() => this.initSoftwareStatement());
      }
    });
  }
}
