import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';

import { DirectoryOrganisationCardComponent } from './organisation-card.component';

@NgModule({
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatListModule,
    MatIconModule,
    RouterModule,
    MatProgressBarModule,
    FlexLayoutModule
  ],
  declarations: [DirectoryOrganisationCardComponent],
  exports: [DirectoryOrganisationCardComponent]
})
export class DirectoryOrganisationCardModule {}
