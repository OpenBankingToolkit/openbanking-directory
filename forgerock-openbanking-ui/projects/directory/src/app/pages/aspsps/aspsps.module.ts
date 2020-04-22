import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AspspsRoutingModule } from './aspsps-routing.module';
import { AspspsIndexComponent } from './index/index.component';
import { DirectoryASPSPCardModule } from '../../components/aspsp-card/aspsp-card.module';

@NgModule({
  imports: [CommonModule, AspspsRoutingModule, DirectoryASPSPCardModule],
  declarations: [AspspsIndexComponent]
})
export class AspspsModule {}
