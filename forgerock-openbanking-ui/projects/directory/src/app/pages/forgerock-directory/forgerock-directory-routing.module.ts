import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ForgerockDirectoryIndexComponent } from './index/index.component';

const routes: Routes = [
  {
    path: '**',
    component: ForgerockDirectoryIndexComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ForgerockDirectoryRoutingModule {}
