import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  EventEmitter,
  Output,
  ViewChild,
  SimpleChanges,
  OnChanges
} from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import _get from 'lodash-es/get';

import { ISoftwareStatement } from 'directory/src/models';
import { ForgerockConfirmDialogComponent } from '@forgerock/openbanking-ngx-common/components/forgerock-confirm-dialog';

@Component({
  // tslint:disable-next-line
  selector: 'app-software-statement-list',
  templateUrl: './software-statement-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DirectorySoftwareStatementListComponent implements OnInit, OnChanges {
  @Input() displayedColumns: string[] = ['id', 'applicationId', 'name', 'delete'];
  @Input() isLoading = false;
  @Input() softwareStatements: ISoftwareStatement[];
  @Output() delete = new EventEmitter<string>();
  @Output() create = new EventEmitter<void>();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  dataSource: MatTableDataSource<ISoftwareStatement>;
  pageSizeOptions = [5, 10, 20];
  selectedPageSize = this.pageSizeOptions[1];

  constructor(private _router: Router, public dialog: MatDialog, private translate: TranslateService) {}

  ngOnInit() {
    this.dataSource = new MatTableDataSource(this.softwareStatements);
    this.dataSource.paginator = this.paginator;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes.softwareStatements.firstChange && changes.softwareStatements.currentValue) {
      this.dataSource.data = changes.softwareStatements.currentValue;
      this.dataSource.paginator.firstPage();
    }
  }

  createSoftwareStatement() {
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

  trackById = (index: number, item: ISoftwareStatement) => item.id;
}
