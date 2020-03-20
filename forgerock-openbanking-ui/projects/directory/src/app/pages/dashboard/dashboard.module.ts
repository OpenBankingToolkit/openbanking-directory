import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { FlexLayoutModule } from '@angular/flex-layout';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardIndexComponent } from './index/index.component';
import { SoftwareStatementsListModule } from '../software-statements/index/index.module';
import { DirectoryOrganisationCardModule } from '../../components/organisation-card/organisation-card.module';
import { DirectorySoftwareStatementListModule } from '../../components/software-statement-list/software-statement-list.module';
import { DirectoryASPSPCardModule } from '../../components/aspsp-card/aspsp-card.module';
import { DirectorySupportDialogComponent } from './index/support-dialog.component';
@NgModule({
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SoftwareStatementsListModule,
    MatCardModule,
    MatButtonModule,
    MatListModule,
    MatIconModule,
    MatDialogModule,
    FlexLayoutModule,
    DirectoryOrganisationCardModule,
    DirectorySoftwareStatementListModule,
    DirectoryASPSPCardModule
  ],
  declarations: [DashboardIndexComponent, DirectorySupportDialogComponent]
})
export class DashboardModule {}
