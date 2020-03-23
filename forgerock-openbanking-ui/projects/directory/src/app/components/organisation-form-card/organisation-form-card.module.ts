import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { DirectoryOrganisationFormCardComponent } from './organisation-form-card.component';
import { DirectoryOrganisationFormCardContainer } from './organisation-form-card.container';

@NgModule({
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatProgressBarModule,
    FlexLayoutModule
  ],
  declarations: [DirectoryOrganisationFormCardComponent, DirectoryOrganisationFormCardContainer],
  exports: [DirectoryOrganisationFormCardContainer]
})
export class DirectoryOrganisationFormCardModule {}
