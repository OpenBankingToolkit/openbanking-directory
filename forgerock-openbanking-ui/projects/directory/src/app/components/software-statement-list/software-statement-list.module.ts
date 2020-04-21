import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';

import { ForgerockSharedModule } from '@forgerock/openbanking-ngx-common/shared';
import { ForgerockConfirmDialogModule } from '@forgerock/openbanking-ngx-common/components/forgerock-confirm-dialog';
import { ForgerockAlertModule } from '@forgerock/openbanking-ngx-common/components/forgerock-alert';
import { DirectorySoftwareStatementListComponent } from './software-statement-list.component';
import { DirectorySoftwareStatementListContainer } from './software-statement-list.container';
@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatChipsModule,
    ForgerockSharedModule,
    ForgerockConfirmDialogModule,
    ForgerockAlertModule
  ],
  declarations: [DirectorySoftwareStatementListComponent, DirectorySoftwareStatementListContainer],
  exports: [DirectorySoftwareStatementListContainer]
})
export class DirectorySoftwareStatementListModule {}
