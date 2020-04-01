import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';

import { DirectoryOrganisationsTableComponent } from './organisations-table.component';
import { DirectoryOrganisationsTableContainer } from './organisations-table.container';
import { DirectoryOrganisationFormModule } from '../organisation-form/organisation-form.module';

@NgModule({
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatListModule,
    MatIconModule,
    MatTableModule,
    MatChipsModule,
    RouterModule,
    MatProgressBarModule,
    FlexLayoutModule,
    DirectoryOrganisationFormModule
  ],
  declarations: [DirectoryOrganisationsTableComponent, DirectoryOrganisationsTableContainer],
  exports: [DirectoryOrganisationsTableContainer]
})
export class DirectoryOrganisationsTableModule {}
