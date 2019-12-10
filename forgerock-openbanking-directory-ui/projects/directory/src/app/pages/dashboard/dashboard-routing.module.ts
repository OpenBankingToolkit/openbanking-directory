import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardIndexComponent } from './index/index.component';

const routes: Routes = [
  {
    path: '**',
    component: DashboardIndexComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {}
