import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserSupportComponent } from './support/support.component';
import { UserMessagesComponent } from './messages/messages.component';
import { UserIndexComponent } from './index/index.component';

const routes: Routes = [
  {
    path: '',
    component: UserIndexComponent,
    children: [
      {
        path: 'messages',
        component: UserMessagesComponent
      },
      {
        path: 'support',
        component: UserSupportComponent
      },
      { path: '**', redirectTo: '/user/messages', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: '/user/messages', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule {}
