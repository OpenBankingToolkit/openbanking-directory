/* tslint:disable */
import { Component } from '@angular/core';

import { environment } from 'directory/src/environments/environment';

@Component({
  selector: 'footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  aboutLink: any = environment.aboutLink;
  policyLink: any = environment.policyLink;
  termsOfServiceLink: any = environment.termsOfServiceLink;
  version: any = environment.version;

  constructor() {
    this.aboutLink = environment.aboutLink;
    this.policyLink = environment.policyLink;
    this.termsOfServiceLink = environment.termsOfServiceLink;
    this.version = environment.version;
  }
}
