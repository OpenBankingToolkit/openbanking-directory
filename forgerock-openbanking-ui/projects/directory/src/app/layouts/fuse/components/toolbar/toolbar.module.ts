import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';

import { FuseSharedModule } from 'directory/src/app/theme-shared.module';
import { TranslateSharedModule } from 'directory/src/app/translate-shared.module';

import { ToolbarComponent } from 'directory/src/app/layouts/fuse/components/toolbar/toolbar.component';

@NgModule({
  declarations: [ToolbarComponent],
  imports: [
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatToolbarModule,
    TranslateSharedModule,
    FuseSharedModule
  ],
  exports: [ToolbarComponent]
})
export class ToolbarModule {}
