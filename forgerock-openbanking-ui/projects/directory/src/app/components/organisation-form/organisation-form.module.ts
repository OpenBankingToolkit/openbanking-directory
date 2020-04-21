import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TranslateModule } from '@ngx-translate/core';

import { DirectoryOrganisationFormComponent } from './organisation-form.component';
import { DirectoryOrganisationFormDialogContainer } from './organisation-form-dialog.container';

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
  declarations: [DirectoryOrganisationFormComponent, DirectoryOrganisationFormDialogContainer],
  exports: [DirectoryOrganisationFormComponent, DirectoryOrganisationFormDialogContainer]
})
export class DirectoryOrganisationFormModule {}
