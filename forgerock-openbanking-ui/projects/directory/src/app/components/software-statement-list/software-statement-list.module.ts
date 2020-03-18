import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { ForgerockSharedModule } from '@forgerock/openbanking-ngx-common/shared';
import { ForgerockConfirmDialogModule } from '@forgerock/openbanking-ngx-common/components/forgerock-confirm-dialog';
import { DirectorySoftwareStatementListComponent } from './software-statement-list.component';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatTableModule,
    MatProgressBarModule,
    ForgerockSharedModule,
    ForgerockConfirmDialogModule
  ],
  declarations: [DirectorySoftwareStatementListComponent],
  exports: [DirectorySoftwareStatementListComponent]
})
export class DirectorySoftwareStatementListModule {}
