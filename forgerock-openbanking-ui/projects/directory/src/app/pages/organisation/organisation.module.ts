import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrganisationRoutingModule } from './organisation-routing.module';
import { OrganisationIndexComponent } from './index/index.component';
import { MatSharedModule } from '../../mat-shared.module';
import { ForgerockSharedModule } from '@forgerock/openbanking-ngx-common/shared';
import { DirectoryOrganisationFormCardModule } from '../../components/organisation-form-card/organisation-form-card.module';

@NgModule({
  imports: [CommonModule, OrganisationRoutingModule, MatSharedModule, ForgerockSharedModule, DirectoryOrganisationFormCardModule],
  declarations: [OrganisationIndexComponent]
})
export class OrganisationModule {}
