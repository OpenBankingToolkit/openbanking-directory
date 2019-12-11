import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { AdminOrganisationsComponent } from './organisations.component';
import { ForgerockSharedModule } from 'ob-ui-libs/shared';
import { MatSharedModule } from 'directory/src/app/mat-shared.module';

const routes: Routes = [
  {
    path: '',
    component: AdminOrganisationsComponent
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), ForgerockSharedModule, MatSharedModule],
  declarations: [AdminOrganisationsComponent]
})
export class AdminOrganisationsModule {}
