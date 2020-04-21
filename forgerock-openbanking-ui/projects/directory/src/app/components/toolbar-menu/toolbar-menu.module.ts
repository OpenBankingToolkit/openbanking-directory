import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { DirectoryToolbarMenuComponent } from './toolbar-menu.component';
import { DirectoryToolbarMenuContainer } from './toolbar-menu.container';

const declarations = [DirectoryToolbarMenuComponent, DirectoryToolbarMenuContainer];

@NgModule({
  declarations,
  entryComponents: declarations,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    TranslateModule,
    FlexLayoutModule
  ],
  exports: declarations
})
export class DirectoryToolbarMenuComponentModule {}
