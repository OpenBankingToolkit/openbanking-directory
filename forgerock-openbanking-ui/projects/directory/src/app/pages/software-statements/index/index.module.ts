import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SoftwareStatementsListComponent } from './index.component';
import { DirectorySoftwareStatementListModule } from 'directory/src/app/components/software-statement-list/software-statement-list.module';

@NgModule({
  imports: [
    CommonModule,
    DirectorySoftwareStatementListModule
  ],
  declarations: [SoftwareStatementsListComponent],
  exports: [SoftwareStatementsListComponent]
})
export class SoftwareStatementsListModule {}
