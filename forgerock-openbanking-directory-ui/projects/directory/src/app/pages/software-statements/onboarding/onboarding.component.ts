import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import debug from 'debug';

import { SoftwareStatementService } from 'directory/src/app/services/software-statement.service';
import { ForgerockMessagesService } from 'ob-ui-libs/services/forgerock-messages';
import { AspspService } from 'directory/src/app/services/aspsp.service';

const log = debug('SoftwareStatements:SoftwareStatementsOnboardingComponent');

@Component({
  // tslint:disable-next-line
  selector: 'software-statements-onboarding-dialog',
  template: `
    <h1 mat-dialog-title>MATLS test</h1>
    <div mat-dialog-content>
      <pre>{{ data | json }}</pre>
    </div>
    <mat-dialog-actions style="justify-content: flex-end;">
      <button mat-button (click)="close()">Close</button>
    </mat-dialog-actions>
  `
})
export class SoftwareStatementsOnboardingDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<SoftwareStatementsOnboardingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  close(): void {
    this.dialogRef.close();
  }
}

@Component({
  // tslint:disable-next-line
  selector: 'software-statements-onboarding',
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SoftwareStatementsOnboardingComponent implements OnInit {
  aspsps;
  displayedColumns: string[] = [
    'logo_uri',
    'name',
    'financial_id',
    'as_discovery_endpoint',
    'rs_discovery_endpoint',
    'test_mtls_endpoint',
    'onboard'
  ];

  constructor(
    private _aspspService: AspspService,
    private _softwareStatementService: SoftwareStatementService,
    private activatedRoute: ActivatedRoute,
    private messages: ForgerockMessagesService,
    private cdr: ChangeDetectorRef,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this._aspspService.getAspsps().subscribe(data => {
      log('ASPSPs: ', data);
      this.aspsps = data;
      this.cdr.detectChanges();
    });
  }

  testMtls(aspsp) {
    const { softwareStatementId } = this.activatedRoute.snapshot.parent.params;
    this._softwareStatementService.testMatls(softwareStatementId, aspsp.id).subscribe(
      data => {
        this.dialog.open(SoftwareStatementsOnboardingDialogComponent, {
          data
        });
      },
      () => this.messages.error()
    );
  }

  isAlreadyOnboard(aspsp) {
    log('isAlreadyOnboard');
    const { softwareStatementId } = this.activatedRoute.snapshot.parent.params;

    this._softwareStatementService.testMatls(softwareStatementId, aspsp.id).subscribe(
      data => {
        aspsp.isAlreadyOnboard = JSON.parse(JSON.stringify(data)).authorities[0].authority !== 'UNREGISTERED_TPP';
        this.cdr.detectChanges();
      },
      () => this.messages.error()
    );
  }

  onboard(aspsp) {
    const { softwareStatementId } = this.activatedRoute.snapshot.parent.params;
    this._softwareStatementService.onboard(softwareStatementId, aspsp.id).subscribe(
      data => {
        this.dialog.open(SoftwareStatementsOnboardingDialogComponent, {
          data
        });
        aspsp.isAlreadyOnboard = true;
        this.cdr.detectChanges();
      },
      () => this.messages.error()
    );
  }
  readOnboarding(aspsp) {
    const { softwareStatementId } = this.activatedRoute.snapshot.parent.params;
    this._softwareStatementService.readBoarding(softwareStatementId, aspsp.id).subscribe(
      data => {
        this.dialog.open(SoftwareStatementsOnboardingDialogComponent, {
          data
        });
      },
      () => this.messages.error()
    );
  }
  updateOnboarding(aspsp) {
    const { softwareStatementId } = this.activatedRoute.snapshot.parent.params;
    this._softwareStatementService.updateboard(softwareStatementId, aspsp.id).subscribe(
      data => {
        this.dialog.open(SoftwareStatementsOnboardingDialogComponent, {
          data
        });
      },
      () => this.messages.error()
    );
  }
  offboarding(aspsp) {
    const { softwareStatementId } = this.activatedRoute.snapshot.parent.params;
    this._softwareStatementService.offboard(softwareStatementId, aspsp.id).subscribe(
      data => {
        aspsp.isAlreadyOnboard = false;
        this.cdr.detectChanges();
      },
      () => this.messages.error()
    );
  }
}
