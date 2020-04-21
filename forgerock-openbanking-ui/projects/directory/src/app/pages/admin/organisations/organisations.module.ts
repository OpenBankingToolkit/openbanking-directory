import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { AdminOrganisationsPageComponent } from './organisations.component';
import { DirectoryOrganisationsTableModule } from 'directory/src/app/components/organisations-table/organisations-table.module';

const routes: Routes = [
  {
    path: '',
    component: AdminOrganisationsPageComponent
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), DirectoryOrganisationsTableModule],
  declarations: [AdminOrganisationsPageComponent]
})
export class AdminOrganisationsModule {}
