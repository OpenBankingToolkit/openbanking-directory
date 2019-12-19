import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ForgerockSharedModule } from '@forgerock/openbanking-ngx-common/shared';
import { SoftwareStatementsListComponent } from './index.component';
import { MatSharedModule } from 'directory/src/app/mat-shared.module';
import { ForgerockConfirmDialogModule } from '@forgerock/openbanking-ngx-common/components/forgerock-confirm-dialog';

@NgModule({
  imports: [CommonModule, MatSharedModule, ForgerockSharedModule, ForgerockConfirmDialogModule],
  declarations: [SoftwareStatementsListComponent],
  exports: [SoftwareStatementsListComponent]
})
export class SoftwareStatementsListModule {}
