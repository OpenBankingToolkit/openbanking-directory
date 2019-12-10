import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { AdminAspspComponent } from './aspsp.component';
import { AdminAspspEditComponent } from './edit/edit.component';
import { AdminAspspIndexComponent } from './index/index.component';
import { ForgerockSharedModule } from 'ob-ui-libs/shared';
import { MatSharedModule } from 'directory/src/app/mat-shared.module';

const routes: Routes = [
  {
    path: '',
    component: AdminAspspComponent,
    children: [
      {
        path: '',
        component: AdminAspspIndexComponent
      },
      {
        path: ':aspspId',
        component: AdminAspspEditComponent
      }
    ]
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), ForgerockSharedModule, MatSharedModule],
  declarations: [AdminAspspComponent, AdminAspspEditComponent, AdminAspspIndexComponent]
})
export class AdminAspspModule {}
