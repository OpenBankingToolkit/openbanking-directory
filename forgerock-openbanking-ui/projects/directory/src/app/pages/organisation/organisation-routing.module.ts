import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrganisationIndexComponent } from './index/index.component';

const routes: Routes = [
  {
    path: '**',
    component: OrganisationIndexComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrganisationRoutingModule {}
