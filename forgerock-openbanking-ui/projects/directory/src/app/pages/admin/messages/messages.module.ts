import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { AdminMessagesComponent } from './messages.component';
import { AdminMessagesEditComponent } from './edit/edit.component';
import { AdminMessagesIndexComponent } from './index/index.component';
import { ForgerockSharedModule } from '@forgerock/openbanking-ngx-common/shared';
import { MatSharedModule } from 'directory/src/app/mat-shared.module';
import { ForgerockMessagesTableModule } from 'directory/src/app/components/messages-table/messages-table.module';

const routes: Routes = [
  {
    path: '',
    component: AdminMessagesComponent,
    children: [
      {
        path: 'edit-message/:messageId',
        component: AdminMessagesEditComponent
      },
      {
        path: 'new-message',
        component: AdminMessagesEditComponent
      },
      {
        path: '',
        component: AdminMessagesIndexComponent
      }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ForgerockSharedModule,
    MatSharedModule,
    ForgerockMessagesTableModule
  ],
  declarations: [AdminMessagesComponent, AdminMessagesEditComponent, AdminMessagesIndexComponent]
})
export class AdminMessagesModule {}
