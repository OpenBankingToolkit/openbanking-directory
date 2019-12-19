import { NgModule } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';

import { FuseSharedModule } from 'directory/src/app/theme-shared.module';

import { ContentModule } from 'directory/src/app/layouts/fuse/components/content/content.module';
import { FooterModule } from 'directory/src/app/layouts/fuse/components/footer/footer.module';
import { NavbarModule } from 'directory/src/app/layouts/fuse/components/navbar/navbar.module';
import { ToolbarModule } from 'directory/src/app/layouts/fuse/components/toolbar/toolbar.module';

import { FuseHorizontalLayoutComponent } from 'directory/src/app/layouts/fuse/horizontal/horizontal.component';

@NgModule({
  declarations: [FuseHorizontalLayoutComponent],
  imports: [MatSidenavModule, FuseSharedModule, ContentModule, FooterModule, NavbarModule, ToolbarModule],
  exports: [FuseHorizontalLayoutComponent]
})
export class FuseHorizontalLayoutModule {}
