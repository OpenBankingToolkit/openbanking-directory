import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { ForgerockSharedModule } from '@forgerock/openbanking-ngx-common/shared';
import { ForgerockAlertModule } from '@forgerock/openbanking-ngx-common/components/forgerock-alert';
import { DirectoryASPSPCardComponent } from './aspsp-card.component';
import { DirectoryASPSPCardContainer } from './aspsp-card.container';
import { DirectoryASPSPFormModule } from '../aspsp-form/aspsp-form.module';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressBarModule,
    ForgerockSharedModule,
    ForgerockAlertModule,
    DirectoryASPSPFormModule
  ],
  declarations: [DirectoryASPSPCardComponent, DirectoryASPSPCardContainer],
  exports: [DirectoryASPSPCardContainer]
})
export class DirectoryASPSPCardModule {}
