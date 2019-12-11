import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ForgerockDirectoryRoutingModule } from './forgerock-directory-routing.module';
import { ForgerockDirectoryIndexComponent } from './index/index.component';
import { MatSharedModule } from '../../mat-shared.module';
import { ForgerockSharedModule } from 'ob-ui-libs/shared';

@NgModule({
  imports: [CommonModule, ForgerockDirectoryRoutingModule, MatSharedModule, ForgerockSharedModule],
  declarations: [ForgerockDirectoryIndexComponent]
})
export class ForgerockDirectoryModule {}
