import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TranslateModule } from '@ngx-translate/core';

import { DirectoryASPSPFormComponent } from './aspsp-form.component';
import { DirectoryASPSPFormDialogComponent } from './aspsp-form-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatProgressBarModule,
    FlexLayoutModule,
    TranslateModule
  ],
  declarations: [DirectoryASPSPFormComponent, DirectoryASPSPFormDialogComponent],
  exports: [DirectoryASPSPFormComponent, DirectoryASPSPFormDialogComponent]
})
export class DirectoryASPSPFormModule {}
