import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  EventEmitter,
  Output
} from '@angular/core';
import { Router } from '@angular/router';
import _get from 'lodash-es/get';
import debug from 'debug';

import { ISoftwareStatement } from 'directory/src/models';
import { ForgerockConfirmDialogComponent } from '@forgerock/openbanking-ngx-common/components/forgerock-confirm-dialog';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

const log = debug('SoftwareStatements:SoftwareStatementsListComponent');

@Component({
  // tslint:disable-next-line
  selector: 'app-software-statement-list',
  templateUrl: './software-statement-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DirectorySoftwareStatementListComponent implements OnInit {
  @Input() displayedColumns: string[] = ['id', 'applicationId', 'name', 'delete'];
  @Input() isLoading = false;
  @Input() softwareStatements: ISoftwareStatement[];
  @Output() delete = new EventEmitter<string>();
  @Output() create = new EventEmitter<void>();

  constructor(
    private _router: Router,
    public dialog: MatDialog,
    private translate: TranslateService,
  ) {}

  ngOnInit() {}

  createSoftwareStatement() {
    log('New software statement!');
    this.create.emit();
  }

  deleteSoftwareStatement(e: Event, softwareStatementId: string) {
    e.stopPropagation();
    const dialogRef = this.dialog.open(ForgerockConfirmDialogComponent, {
      data: {
        text: this.translate.instant('SOFTWARE_STATEMENTS.REMOVE_CONFIRM', {
          id: softwareStatementId
        })
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.delete.emit(softwareStatementId);
      }
    });
  }

  goToSoftwareStatement(id: string) {
    this._router.navigate([`/software-statements/${id}/general`]);
  }
}
