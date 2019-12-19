import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AspspsRoutingModule } from './aspsps-routing.module';
import { AspspsIndexComponent } from './index/index.component';
import { MatSharedModule } from '../../mat-shared.module';

@NgModule({
  imports: [CommonModule, AspspsRoutingModule, MatSharedModule],
  declarations: [AspspsIndexComponent]
})
export class AspspsModule {}
