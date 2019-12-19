import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IsOIDCConnectedGuard } from '@forgerock/openbanking-ngx-common/oidc';

const routes: Routes = [
  {
    path: '',
    canActivate: [IsOIDCConnectedGuard],
    children: [
      {
        path: 'messages',
        loadChildren: 'directory/src/app/pages/admin/messages/messages.module#AdminMessagesModule'
      },
      {
        path: 'organisations',
        loadChildren: 'directory/src/app/pages/admin/organisations/organisations.module#AdminOrganisationsModule'
      },
      {
        path: 'aspsps',
        loadChildren: 'directory/src/app/pages/admin/aspsp/aspsp.module#AdminAspspModule'
      },
      { path: '**', redirectTo: 'organisations', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
