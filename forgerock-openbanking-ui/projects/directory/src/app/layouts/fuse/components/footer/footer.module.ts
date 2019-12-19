import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

import { FuseSharedModule } from 'directory/src/app/theme-shared.module';
import { TranslateSharedModule } from 'directory/src/app/translate-shared.module';

import { FooterComponent } from './footer.component';

@NgModule({
  declarations: [FooterComponent],
  imports: [RouterModule, MatButtonModule, MatIconModule, MatToolbarModule, FuseSharedModule, TranslateSharedModule],
  exports: [FooterComponent]
})
export class FooterModule {}
