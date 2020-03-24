import { Component, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Platform } from '@angular/cdk/platform';
import { TranslateService } from '@ngx-translate/core';
import { Router, NavigationEnd } from '@angular/router';
import { ForgerockSplashscreenService } from '@forgerock/openbanking-ngx-common/services/forgerock-splashscreen';
import { ForgerockGDPRService } from '@forgerock/openbanking-ngx-common/gdpr';
import { ForgerockMainLayoutNavigationService } from '@forgerock/openbanking-ngx-common/layouts/main-layout';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  template: `
    <router-outlet></router-outlet>
  `
})
export class AppComponent {
  constructor(
    @Inject(DOCUMENT) private document: any,
    private splashscreenService: ForgerockSplashscreenService,
    private translateService: TranslateService,
    private platform: Platform,
    private mainLayoutNavigationService: ForgerockMainLayoutNavigationService,
    private router: Router,
    private gdprService: ForgerockGDPRService
  ) {
    this.splashscreenService.init();
    this.gdprService.init();

    this.translateService.addLangs(['en', 'fr']);
    this.translateService.setDefaultLang('en');
    this.translateService.use(this.translateService.getBrowserLang() || 'en');

    // Add is-mobile class to the body if the platform is mobile
    if (this.platform.ANDROID || this.platform.IOS) {
      this.document.body.classList.add('is-mobile');
    }

    // Get default navigation
    // Set the main navigation as our current navigation
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
      if (event.url.startsWith('/admin')) {
        this.mainLayoutNavigationService.setCurrentNavigation('admin');
      } else {
        this.mainLayoutNavigationService.setCurrentNavigation('main');
      }
    });
  }
}
