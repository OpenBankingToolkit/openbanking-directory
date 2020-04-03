import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {
  ForgerockMainLayoutComponent,
  ForgerockMainLayoutModule,
  IForgerockMainLayoutConfig,
  IForgerockMainLayoutNavigations,
  IForgerockMainLayoutNavigation
} from '@forgerock/openbanking-ngx-common/layouts/main-layout';
import { SimpleLayoutComponent } from '@forgerock/openbanking-ngx-common/layouts/simple';
import { ForgerockSimpleLayoutModule } from '@forgerock/openbanking-ngx-common/layouts/simple';
import { ForgerockGDPRService } from '@forgerock/openbanking-ngx-common/gdpr';
import { ForegerockGDPRConsentGuard } from '@forgerock/openbanking-ngx-common/gdpr';
import { ForgerockCustomerCanAccessGuard } from '@forgerock/openbanking-ngx-common/guards';
import { ForgerockAuthRedirectOIDCComponent, IsOIDCConnectedGuard } from '@forgerock/openbanking-ngx-common/oidc';
import { DirectoryToolbarMenuComponentModule } from './components/toolbar-menu/toolbar-menu.module';
import { DirectoryToolbarMenuContainer } from './components/toolbar-menu/toolbar-menu.container';

export const mainNavKey = 'main';
const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard'
  },
  {
    path: '',
    component: SimpleLayoutComponent,
    children: [
      {
        path: ForgerockGDPRService.gdprDeniedPage,
        loadChildren: () => import('forgerock/src/ob-ui-libs-lazy/gdpr.module').then(m => m.OBUILibsLazyGDPRPage)
      },
      {
        path: '404',
        pathMatch: 'full',
        loadChildren: () =>
          import('forgerock/src/ob-ui-libs-lazy/not-found.module').then(m => m.OBUILibsLazyNotFoundPage)
      },
      {
        path: 'dev/info',
        pathMatch: 'full',
        loadChildren: () => import('forgerock/src/ob-ui-libs-lazy/dev-info.module').then(m => m.OBUILibsLazyDevInfoPage)
      }
    ]
  },
  {
    path: '',
    component: ForgerockMainLayoutComponent,
    canActivate: [ForegerockGDPRConsentGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: 'directory/src/app/pages/dashboard/dashboard.module#DashboardModule',
        canLoad: [ForgerockCustomerCanAccessGuard],
        canActivate: [IsOIDCConnectedGuard]
      },
      {
        path: 'organisation',
        loadChildren: 'directory/src/app/pages/organisation/organisation.module#OrganisationModule',
        canLoad: [ForgerockCustomerCanAccessGuard],
        canActivate: [IsOIDCConnectedGuard]
      },
      {
        path: 'software-statements',
        loadChildren: 'directory/src/app/pages/software-statements/software-statements.module#SoftwareStatementsModule',
        canLoad: [ForgerockCustomerCanAccessGuard],
        canActivate: [IsOIDCConnectedGuard]
      },
      {
        path: 'admin',
        loadChildren: 'directory/src/app/pages/admin/admin.module#AdminModule',
        canLoad: [ForgerockCustomerCanAccessGuard],
        canActivate: [IsOIDCConnectedGuard]
      },
      {
        path: 'session-lost',
        loadChildren: 'directory/src/app/pages/session-lost/session-lost.module#SessionLostModule'
      }
    ]
  },
  {
    path: 'redirectOpenId',
    component: ForgerockAuthRedirectOIDCComponent
  },
  { path: '**', redirectTo: 'dashboard', pathMatch: 'full' }
];

const mainLayoutConfig: IForgerockMainLayoutConfig = {
  style: 'vertical-layout-1',
  navbar: {
    folded: false,
    hidden: false,
    position: 'left'
  },
  toolbar: {
    hidden: false
  },
  footer: {
    hidden: true,
    position: 'below-static'
  }
};

export const mainNav: IForgerockMainLayoutNavigation[] = [
  {
    id: 'dashboard',
    translate: 'NAV.DASHBOARD',
    type: 'item',
    icon: 'dashboard',
    url: '/dashboard'
  }
  // {
  //   id: 'software-statements',
  //   translate: 'NAV.SOFTWARE_STATEMENTS',
  //   type: 'item',
  //   icon: 'gavel',
  //   url: '/software-statements'
  // }
];

export const navigations: IForgerockMainLayoutNavigations = {
  [mainNavKey]: mainNav
};

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    DirectoryToolbarMenuComponentModule,
    ForgerockMainLayoutModule.forRoot({
      layout: mainLayoutConfig,
      navigations,
      components: {
        toolbar: DirectoryToolbarMenuContainer
      }
    }),
    ForgerockSimpleLayoutModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
