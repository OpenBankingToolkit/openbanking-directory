import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserIndexComponent } from './index/index.component';
import { UserMessagesComponent } from './messages/messages.component';
import { UserSupportComponent } from './support/support.component';
import { ForgerockSharedModule } from 'ob-ui-libs/shared';
import { MatSharedModule } from '../../mat-shared.module';
import { ForgerockMessagesTableModule } from '../../components/messages-table/messages-table.module';

@NgModule({
  imports: [CommonModule, MatSharedModule, ForgerockSharedModule, UserRoutingModule, ForgerockMessagesTableModule],
  declarations: [UserIndexComponent, UserMessagesComponent, UserSupportComponent]
})
export class UserModule {}
