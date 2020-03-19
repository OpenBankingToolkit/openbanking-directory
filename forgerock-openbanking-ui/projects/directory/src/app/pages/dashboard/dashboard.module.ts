import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardIndexComponent } from './index/index.component';
import { SoftwareStatementsListModule } from '../software-statements/index/index.module';
import { ForgerockSharedModule } from '@forgerock/openbanking-ngx-common/shared';
import { DirectoryOrganisationCardModule } from '../../components/organisation-card/organisation-card.module';
import { DirectorySoftwareStatementListModule } from '../../components/software-statement-list/software-statement-list.module';
@NgModule({
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SoftwareStatementsListModule,
    MatCardModule,
    MatButtonModule,
    MatListModule,
    MatIconModule,
    ForgerockSharedModule,
    DirectoryOrganisationCardModule,
    DirectorySoftwareStatementListModule
  ],
  declarations: [DashboardIndexComponent]
})
export class DashboardModule {}
