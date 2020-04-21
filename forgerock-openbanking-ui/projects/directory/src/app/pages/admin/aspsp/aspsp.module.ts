import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { AdminAspspComponent } from './aspsp.component';
import { DirectoryASPSPCardModule } from 'directory/src/app/components/aspsp-card/aspsp-card.module';

const routes: Routes = [
  {
    path: '**',
    component: AdminAspspComponent
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), DirectoryASPSPCardModule],
  declarations: [AdminAspspComponent]
})
export class AdminAspspModule {}
