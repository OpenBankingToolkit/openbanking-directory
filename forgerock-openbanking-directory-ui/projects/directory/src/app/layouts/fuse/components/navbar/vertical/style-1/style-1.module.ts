import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { FuseNavigationModule } from '@fuse/components/navigation/navigation.module';
import { FuseSharedModule } from 'directory/src/app/theme-shared.module';

import { NavbarVerticalStyle1Component } from './style-1.component';
import { ForgerockCustomerIconModule } from 'ob-ui-libs/components/forgerock-customer-icon';

@NgModule({
  declarations: [NavbarVerticalStyle1Component],
  imports: [MatButtonModule, MatIconModule, ForgerockCustomerIconModule, FuseSharedModule, FuseNavigationModule],
  exports: [NavbarVerticalStyle1Component]
})
export class NavbarVerticalStyle1Module {}
