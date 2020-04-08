import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

import { ForgerockSharedModule } from '@forgerock/openbanking-ngx-common/shared';
import { ForgerockConfirmDialogModule } from '@forgerock/openbanking-ngx-common/components/forgerock-confirm-dialog';
import { ForgerockAlertModule } from '@forgerock/openbanking-ngx-common/components/forgerock-alert';
import { DirectorySoftwareStatementFormComponent } from './software-statement-form.component';
import { DirectorySoftwareStatementFormContainer } from './software-statement-form.container';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatChipsModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    ForgerockSharedModule,
    ForgerockConfirmDialogModule,
    ForgerockAlertModule
  ],
  declarations: [DirectorySoftwareStatementFormComponent, DirectorySoftwareStatementFormContainer],
  exports: [DirectorySoftwareStatementFormContainer]
})
export class DirectorySoftwareStatementFormModule {}
