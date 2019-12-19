import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SoftwareStatementsRoutingModule } from './software-statements-routing.module';
// import { SoftwareStatementsListComponent } from './index/index.component';
import { SoftwareStatementsGeneralComponent } from './general/general.component';
import { SoftwareStatementsKeysComponent } from './keys/keys.component';
import {
  SoftwareStatementsOnboardingComponent,
  SoftwareStatementsOnboardingDialogComponent
} from './onboarding/onboarding.component';
import { SoftwareStatementsAssertionComponent } from './assertion/assertion.component';
import { SoftwareStatementsTabsComponent } from './tabs/tabs.component';
import { MatSharedModule } from '../../mat-shared.module';
import { ForgerockSharedModule } from '@forgerock/openbanking-ngx-common/shared';
import { SoftwareStatementsListModule } from './index/index.module';

@NgModule({
  imports: [
    CommonModule,
    SoftwareStatementsRoutingModule,
    MatSharedModule,
    ForgerockSharedModule,
    SoftwareStatementsListModule
  ],
  declarations: [
    SoftwareStatementsGeneralComponent,
    SoftwareStatementsKeysComponent,
    SoftwareStatementsOnboardingComponent,
    SoftwareStatementsAssertionComponent,
    SoftwareStatementsTabsComponent,
    SoftwareStatementsOnboardingDialogComponent
  ],
  entryComponents: [SoftwareStatementsOnboardingDialogComponent]
})
export class SoftwareStatementsModule {}
