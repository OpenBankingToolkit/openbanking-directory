import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';

import { ForgerockMessagesTableComponent } from './messages-table.component';
import { ForgerockMessagesTableContainer } from './messages-table.container';
import { ForgerockPipesModule } from '@forgerock/openbanking-ngx-common/pipes';

@NgModule({
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    MatProgressBarModule,
    FlexLayoutModule,
    ForgerockPipesModule
  ],
  declarations: [ForgerockMessagesTableComponent, ForgerockMessagesTableContainer],
  exports: [ForgerockMessagesTableComponent, ForgerockMessagesTableContainer]
})
export class ForgerockMessagesTableModule {}
