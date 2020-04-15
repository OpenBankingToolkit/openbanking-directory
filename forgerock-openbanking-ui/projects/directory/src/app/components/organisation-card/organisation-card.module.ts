import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';

import { DirectoryOrganisationCardComponent } from './organisation-card.component';
import { DirectoryOrganisationCardContainer } from './organisation-card.container';
import { DirectoryOrganisationFormModule } from '../organisation-form/organisation-form.module';

@NgModule({
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatListModule,
    MatIconModule,
    RouterModule,
    MatDialogModule,
    MatProgressBarModule,
    FlexLayoutModule,
    DirectoryOrganisationFormModule
  ],
  declarations: [DirectoryOrganisationCardComponent, DirectoryOrganisationCardContainer],
  exports: [DirectoryOrganisationCardContainer]
})
export class DirectoryOrganisationCardModule {}
