import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ForgerockSharedModule } from 'ob-ui-libs/shared';
import { SoftwareStatementsListComponent } from './index.component';
import { MatSharedModule } from 'directory/src/app/mat-shared.module';
import { ForgerockConfirmDialogModule } from 'ob-ui-libs/components/forgerock-confirm-dialog';

@NgModule({
  imports: [CommonModule, MatSharedModule, ForgerockSharedModule, ForgerockConfirmDialogModule],
  declarations: [SoftwareStatementsListComponent],
  exports: [SoftwareStatementsListComponent]
})
export class SoftwareStatementsListModule {}
