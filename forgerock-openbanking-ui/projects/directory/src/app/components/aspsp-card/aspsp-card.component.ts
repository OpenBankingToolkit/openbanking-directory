import { Component, OnInit, ChangeDetectionStrategy, Input, EventEmitter, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { IAspsp } from 'directory/src/models';
import { DirectoryASPSPFormDialogComponent } from '../aspsp-form/aspsp-form-dialog.component';

@Component({
  selector: 'app-aspsp-card',
  templateUrl: './aspsp-card.component.html',
  styleUrls: ['./aspsp-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DirectoryASPSPCardComponent implements OnInit {
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

  constructor(public dialog: MatDialog) {}

  ngOnInit() {}

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
