import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
// import { AdminMessagesComponent } from './messages/messages.component';
// import { AdminMessagesIndexComponent } from './messages/index/index.component';
// import { AdminMessagesEditComponent } from './messages/edit/edit.component';
// import { AdminForgerockApplicationsComponent } from './forgerock-applications/forgerock-applications.component';
// import { AdminOrganisationsComponent } from './organisations/organisations.component';
// import { AdminAspspComponent } from './aspsp/aspsp.component';

@NgModule({
  imports: [CommonModule, AdminRoutingModule],
  declarations: [
    // AdminMessagesComponent,
    // AdminMessagesIndexComponent,
    // AdminMessagesEditComponent,
    // AdminForgerockApplicationsComponent,
    // AdminOrganisationsComponent,
    // AdminAspspComponent
  ]
})
export class AdminModule {}
