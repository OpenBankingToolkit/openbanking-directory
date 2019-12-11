import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { FuseNavigationModule } from '@fuse/components/navigation/navigation.module';
import { FuseSharedModule } from 'directory/src/app/theme-shared.module';

import { NavbarHorizontalStyle1Component } from './style-1.component';

@NgModule({
  declarations: [NavbarHorizontalStyle1Component],
  imports: [MatButtonModule, MatIconModule, FuseSharedModule, FuseNavigationModule],
  exports: [NavbarHorizontalStyle1Component]
})
export class NavbarHorizontalStyle1Module {}
