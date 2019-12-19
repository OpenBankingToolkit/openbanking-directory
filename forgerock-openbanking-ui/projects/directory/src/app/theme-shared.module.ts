import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { FlexLayoutModule } from '@angular/flex-layout';

import { FuseConfig } from '@fuse/types';
import { FuseModule } from '@fuse/fuse.module';

// directives
// import { FuseIfOnDomDirective } from '@fuse/directives/fuse-if-on-dom/fuse-if-on-dom.directive';
import { FusePerfectScrollbarDirective } from '@fuse/directives/fuse-perfect-scrollbar/fuse-perfect-scrollbar.directive';

// components
import { FuseSidebarModule } from '@fuse/components/sidebar/sidebar.module';

import { FusePipesModule } from '@fuse/pipes/pipes.module';

export const fuseConfig: FuseConfig = {
  layout: {
    style: 'vertical-layout-1',
    width: 'fullwidth',
    navbar: {
      background: 'mat-fuse-dark-700-bg',
      folded: false,
      hidden: false,
      position: 'left',
      variant: 'vertical-style-1'
    },
    toolbar: {
      background: 'mat-white-500-bg',
      hidden: false,
      position: 'below-static'
    },
    footer: {
      background: 'mat-fuse-dark-900-bg',
      hidden: false,
      position: 'below-fixed'
    },
    sidepanel: {
      hidden: false,
      position: 'right'
    }
  },
  customScrollbars: true
};

@NgModule({
  declarations: [FusePerfectScrollbarDirective],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    FuseModule.forRoot(fuseConfig),
    FusePipesModule,
    // components
    FuseSidebarModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    FusePipesModule,
    // directives
    FusePerfectScrollbarDirective,
    // components
    FuseSidebarModule
  ]
})
export class FuseSharedModule {}
