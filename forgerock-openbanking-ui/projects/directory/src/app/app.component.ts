import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Platform } from '@angular/cdk/platform';
import { TranslateService } from '@ngx-translate/core';
import { Store, select } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { ForgerockSplashscreenService } from '@forgerock/openbanking-ngx-common/services/forgerock-splashscreen';
import { ForgerockGDPRService } from '@forgerock/openbanking-ngx-common/gdpr';
import { ForgerockMainLayoutNavigationService } from '@forgerock/openbanking-ngx-common/layouts/main-layout';
import { selectOIDCUserAuthorities } from '@forgerock/openbanking-ngx-common/oidc';

import { mainNav, mainNavKey } from './app-routing.module';
import { IState, IAuhtorities } from '../models';

@Component({
  selector: 'app-root',
  template: `
    <router-outlet></router-outlet>
  `
})
export class AppComponent implements OnInit, OnDestroy {
  private authoritiesSubscription: Subscription;
  private authorities$: Observable<string[]> = this.store.pipe(select(selectOIDCUserAuthorities));

  constructor(
    @Inject(DOCUMENT) private document: any,
    private splashscreenService: ForgerockSplashscreenService,
    private translateService: TranslateService,
    private platform: Platform,
    private mainLayoutNavigationService: ForgerockMainLayoutNavigationService,
    private gdprService: ForgerockGDPRService,
    protected store: Store<IState>
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
  }

  ngOnInit() {
    this.authoritiesSubscription = this.authorities$.subscribe((authorities: string[]) => {
      const adminFR = authorities.includes(IAuhtorities.GROUP_FORGEROCK);
      const adminOB = authorities.includes(IAuhtorities.GROUP_OB);
      const hadAdminAccess = adminFR || adminOB;

      if (!hadAdminAccess) return;

      this.mainLayoutNavigationService.unregister(mainNavKey);
      this.mainLayoutNavigationService.register(
        mainNavKey,
        (() => {
          return [
            ...mainNav,
            {
              id: 'admin',
              translate: 'NAV.ADMIN',
              type: 'group',
              children: [
                {
                  id: 'organisation',
                  translate: 'NAV.ORGANISATIONS',
                  type: 'item',
                  icon: 'assignment_ind',
                  url: '/admin/organisations'
                },
                {
                  id: 'aspsps',
                  translate: 'NAV.ASPSPS',
                  type: 'item',
                  icon: 'card_travel',
                  url: '/admin/aspsps'
                },
                {
                  id: 'messages',
                  translate: 'NAV.MESSAGES',
                  type: 'item',
                  icon: 'message',
                  url: '/admin/messages'
                }
              ]
            }
          ];
        })()
      );
    });
  }

  ngOnDestroy() {
    this.authoritiesSubscription.unsubscribe();
  }
}
