import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Platform } from '@angular/cdk/platform';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';

import { FuseConfigService } from '@fuse/services/config.service';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';

import { navigation, admin } from './navigation/navigation';
import { Router, NavigationEnd } from '@angular/router';
import { ForgerockConfigService } from 'ob-ui-libs/services/forgerock-config';
import { ForgerockSplashscreenService } from 'ob-ui-libs/services/forgerock-splashscreen';
import { ForgerockGDPRService } from 'ob-ui-libs/gdpr';

@Component({
  selector: 'app-root',
  template: `
    <router-outlet></router-outlet>
  `,
  styles: [
    `
      :host {
        flex: 1 0 auto;
        width: 100%;
        min-width: 100%;
      }
    `
  ]
})
export class AppComponent implements OnInit, OnDestroy {
  fuseConfig: any;
  navigation: any;
  enableCustomization: string = this.configService.get('enableCustomization');

  // Private
  private _unsubscribeAll: Subject<any>;

  constructor(
    @Inject(DOCUMENT) private document: any,
    private _fuseConfigService: FuseConfigService,
    private _fuseNavigationService: FuseNavigationService,
    private _fuseSidebarService: FuseSidebarService,
    private splashscreenService: ForgerockSplashscreenService,
    private translateService: TranslateService,
    private platform: Platform,
    private router: Router,
    private configService: ForgerockConfigService,
    private gdprService: ForgerockGDPRService
  ) {
    this.splashscreenService.init();
    this.gdprService.init();
    // Get default navigation
    // this.navigation = navigation;

    // Register the navigation to the service
    this._fuseNavigationService.register('main', navigation);
    this._fuseNavigationService.register('admin', admin);

    // Set the main navigation as our current navigation
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
      if (event.url.startsWith('/admin')) {
        this._fuseNavigationService.setCurrentNavigation('admin');
      } else {
        this._fuseNavigationService.setCurrentNavigation('main');
      }
    });

    // Add languages
    this.translateService.addLangs(['en', 'fr']);
    // this.translateService.setTranslation('en', engTranslation);
    this.translateService.setDefaultLang('en');

    // Set the navigation translations
    // this._fuseTranslationLoaderService.loadTranslations(navigationEnglish);

    // Use a language
    this.translateService.use(this.translateService.getBrowserLang() || 'en');

    // Add is-mobile class to the body if the platform is mobile
    if (this.platform.ANDROID || this.platform.IOS) {
      this.document.body.classList.add('is-mobile');
    }

    // Set the private defaults
    this._unsubscribeAll = new Subject();

    // interval(1000 * 5)
    //   .pipe(takeUntil(this._unsubscribeAll))
    //   .subscribe(x => {
    //     this.store.dispatch(new UnreadMessagesRequestAction());
    //   });
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Subscribe to config changes
    this._fuseConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe(config => {
      this.fuseConfig = config;

      if (this.fuseConfig.layout.width === 'boxed') {
        this.document.body.classList.add('boxed');
      } else {
        this.document.body.classList.remove('boxed');
      }
    });
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Toggle sidebar open
   *
   * @param key
   */
  toggleSidebarOpen(key): void {
    this._fuseSidebarService.getSidebar(key).toggleOpen();
  }
}
