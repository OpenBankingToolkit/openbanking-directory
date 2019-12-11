import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FuseVerticalLayoutComponent } from 'directory/src/app/layouts/fuse/vertical/vertical.component';
import { SimpleLayoutComponent } from 'ob-ui-libs/layouts/simple';
import { ForgerockSimpleLayoutModule } from 'ob-ui-libs/layouts/simple';
import { ForgerockGDPRService } from 'ob-ui-libs/gdpr';
import { ForegerockGDPRConsentGuard } from 'ob-ui-libs/gdpr';
import { ForgerockCustomerCanAccessGuard } from 'ob-ui-libs/guards';
import { ForgerockAuthRedirectOIDCComponent, IsOIDCConnectedGuard } from 'ob-ui-libs/oidc';

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
    component: FuseVerticalLayoutComponent,
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
        path: 'aspsps',
        loadChildren: 'directory/src/app/pages/aspsps/aspsps.module#AspspsModule',
        canLoad: [ForgerockCustomerCanAccessGuard],
        canActivate: [IsOIDCConnectedGuard]
      },
      {
        path: 'forgerock-directory',
        loadChildren: 'directory/src/app/pages/forgerock-directory/forgerock-directory.module#ForgerockDirectoryModule',
        canLoad: [ForgerockCustomerCanAccessGuard],
        canActivate: [IsOIDCConnectedGuard]
      },
      {
        path: 'user',
        loadChildren: 'directory/src/app/pages/user/user.module#UserModule',
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

@NgModule({
  imports: [RouterModule.forRoot(routes), ForgerockSimpleLayoutModule],
  exports: [RouterModule]
})
export class AppRoutingModule {}
