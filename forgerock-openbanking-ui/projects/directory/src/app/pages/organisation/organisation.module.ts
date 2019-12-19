import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrganisationRoutingModule } from './organisation-routing.module';
import { OrganisationIndexComponent } from './index/index.component';
import { MatSharedModule } from '../../mat-shared.module';
import { ForgerockSharedModule } from '@forgerock/openbanking-ngx-common/shared';

@NgModule({
  imports: [CommonModule, OrganisationRoutingModule, MatSharedModule, ForgerockSharedModule],
  declarations: [OrganisationIndexComponent]
})
export class OrganisationModule {}
