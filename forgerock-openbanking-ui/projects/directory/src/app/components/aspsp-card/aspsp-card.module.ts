import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { ForgerockSharedModule } from '@forgerock/openbanking-ngx-common/shared';
import { DirectoryASPSPCardComponent } from './aspsp-card.component';
import { DirectoryASPSPCardContainer } from './aspsp-card.container';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatTableModule,
    MatProgressBarModule,
    ForgerockSharedModule
  ],
  declarations: [DirectoryASPSPCardComponent, DirectoryASPSPCardContainer],
  exports: [DirectoryASPSPCardContainer]
})
export class DirectoryASPSPCardModule {}
