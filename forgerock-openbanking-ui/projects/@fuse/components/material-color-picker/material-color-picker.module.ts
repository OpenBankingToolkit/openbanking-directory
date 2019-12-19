import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

import { FusePipesModule } from '@fuse/pipes/pipes.module';

import { FuseMaterialColorPickerComponent } from '@fuse/components/material-color-picker/material-color-picker.component';

@NgModule({
  declarations: [FuseMaterialColorPickerComponent],
  imports: [
    CommonModule,

    FlexLayoutModule,

    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatRippleModule,

    FusePipesModule
  ],
  exports: [FuseMaterialColorPickerComponent]
})
export class FuseMaterialColorPickerModule {}
