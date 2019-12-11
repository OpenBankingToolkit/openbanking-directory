import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardIndexComponent } from './index/index.component';
import { MatSharedModule } from '../../mat-shared.module';
import { SoftwareStatementsListModule } from '../software-statements/index/index.module';
import { ForgerockSharedModule } from 'ob-ui-libs/shared';

@NgModule({
  imports: [CommonModule, DashboardRoutingModule, MatSharedModule, SoftwareStatementsListModule, ForgerockSharedModule],
  declarations: [DashboardIndexComponent]
})
export class DashboardModule {}
