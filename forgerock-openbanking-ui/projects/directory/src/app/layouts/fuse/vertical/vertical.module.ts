import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FuseSharedModule } from 'directory/src/app/theme-shared.module';
import { ContentModule } from 'directory/src/app/layouts/fuse/components/content/content.module';
import { FooterModule } from 'directory/src/app/layouts/fuse/components/footer/footer.module';
import { NavbarModule } from 'directory/src/app/layouts/fuse/components/navbar/navbar.module';
import { ToolbarModule } from 'directory/src/app/layouts/fuse/components/toolbar/toolbar.module';

import { FuseVerticalLayoutComponent } from './vertical.component';

@NgModule({
  declarations: [FuseVerticalLayoutComponent],
  imports: [RouterModule, FuseSharedModule, ContentModule, FooterModule, NavbarModule, ToolbarModule],
  exports: [FuseVerticalLayoutComponent]
})
export class FuseVerticalLayoutModule {}
