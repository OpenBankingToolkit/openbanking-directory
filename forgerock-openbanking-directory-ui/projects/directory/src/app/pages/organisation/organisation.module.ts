import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrganisationRoutingModule } from './organisation-routing.module';
import { OrganisationIndexComponent } from './index/index.component';
import { MatSharedModule } from '../../mat-shared.module';
import { ForgerockSharedModule } from 'ob-ui-libs/shared';

@NgModule({
  imports: [CommonModule, OrganisationRoutingModule, MatSharedModule, ForgerockSharedModule],
  declarations: [OrganisationIndexComponent]
})
export class OrganisationModule {}
