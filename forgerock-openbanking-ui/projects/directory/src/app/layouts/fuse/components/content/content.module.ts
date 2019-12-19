import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FuseSharedModule } from 'directory/src/app/theme-shared.module';

import { ContentComponent } from './content.component';

@NgModule({
  declarations: [ContentComponent],
  imports: [RouterModule, FuseSharedModule],
  exports: [ContentComponent]
})
export class ContentModule {}
