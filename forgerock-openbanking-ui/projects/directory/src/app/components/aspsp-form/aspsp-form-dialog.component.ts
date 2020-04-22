import { Component, OnInit, Inject } from '@angular/core';
import { Store } from '@ngrx/store';

import { IState, IAspsp } from 'directory/src/models';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface DialogData {
  aspsp: IAspsp;
}

@Component({
  selector: 'app-aspsp-form-dialog',
  template: `
    <div mat-dialog-content>
      <app-aspsp-form [aspsp]="data.aspsp" (update)="update($event)" (cancel)="cancel()"> </app-aspsp-form>
    </div>
  `
})
export class DirectoryASPSPFormDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<DirectoryASPSPFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    protected store: Store<IState>
  ) {}

  ngOnInit() {}

  cancel() {
    this.dialogRef.close();
  }

  update(aspsp: IAspsp) {
    this.dialogRef.close(aspsp);
  }
}
