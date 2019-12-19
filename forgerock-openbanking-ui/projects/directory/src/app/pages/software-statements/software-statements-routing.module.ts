import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SoftwareStatementsListComponent } from './index/index.component';
import { SoftwareStatementsGeneralComponent } from './general/general.component';
import { SoftwareStatementsAssertionComponent } from './assertion/assertion.component';
import { SoftwareStatementsOnboardingComponent } from './onboarding/onboarding.component';
import { SoftwareStatementsKeysComponent } from './keys/keys.component';
import { SoftwareStatementsTabsComponent } from './tabs/tabs.component';

const routes: Routes = [
  {
    path: ':softwareStatementId',
    component: SoftwareStatementsTabsComponent,
    children: [
      {
        path: 'general',
        component: SoftwareStatementsGeneralComponent
      },
      {
        path: 'keys',
        component: SoftwareStatementsKeysComponent
      },
      {
        path: 'assertion',
        component: SoftwareStatementsAssertionComponent
      },
      {
        path: 'onboarding',
        component: SoftwareStatementsOnboardingComponent
      },
      { path: '**', redirectTo: '/software-statements', pathMatch: 'full' }
    ]
  },
  {
    path: '**',
    component: SoftwareStatementsListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SoftwareStatementsRoutingModule {}
