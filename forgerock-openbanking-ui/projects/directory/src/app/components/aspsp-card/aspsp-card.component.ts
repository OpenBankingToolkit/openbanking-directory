import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  EventEmitter,
  Output,
  ViewChild,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';

import { IAspsp } from 'directory/src/models';
import { DirectoryASPSPFormDialogComponent } from '../aspsp-form/aspsp-form-dialog.component';
@Component({
  selector: 'app-aspsp-card',
  templateUrl: './aspsp-card.component.html',
  styleUrls: ['./aspsp-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DirectoryASPSPCardComponent implements OnInit, OnChanges {
  @Input() aspsps: IAspsp[];
  @Input() isLoading = false;
  @Input() isAdmin = false;
  @Input() displayedColumns: string[] = [
    'logoUri',
    'name',
    'financialId',
    'asDiscoveryEndpoint',
    'rsDiscoveryEndpoint',
    'transportKeys',
    'admin'
  ];
  @Output() create = new EventEmitter<IAspsp>();
  @Output() update = new EventEmitter<IAspsp>();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  dataSource: MatTableDataSource<IAspsp>;
  pageSizeOptions = [5, 10, 20];
  selectedPageSize = this.pageSizeOptions[1];

  constructor(public dialog: MatDialog) {}

  ngOnInit() {
    this.dataSource = new MatTableDataSource(this.aspsps);
    this.dataSource.paginator = this.paginator;
    console.log('333', this.dataSource.paginator, this.paginator)
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes.aspsps.firstChange && changes.aspsps.currentValue) {
      this.dataSource.data = changes.aspsps.currentValue;
      this.dataSource.paginator.firstPage();
    }
  }

  createASPSP = () => this.updateASPSP();

  updateASPSP(aspsp?: IAspsp) {
    const dialogRef = this.dialog.open(DirectoryASPSPFormDialogComponent, {
      width: '400px',
      disableClose: true,
      data: { aspsp }
    });
    dialogRef
      .afterClosed()
      .subscribe(
        (updatedAspsp: IAspsp) =>
          updatedAspsp && (aspsp ? this.update.emit(updatedAspsp) : this.create.emit(updatedAspsp))
      );
  }
}
