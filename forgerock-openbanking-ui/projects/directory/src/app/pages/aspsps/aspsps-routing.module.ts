import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AspspsIndexComponent } from './index/index.component';

const routes: Routes = [
  {
    path: '**',
    component: AspspsIndexComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AspspsRoutingModule {}
