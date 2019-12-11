/* tslint:disable */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { IState } from 'directory/src/models';
import { FuseConfigService } from '@fuse/services/config.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';

import { navigation } from 'directory/src/app/navigation/navigation';
import { selectOIDCConnected, selectOIDCUserId, ForgerockOIDCLogoutRequestAction } from 'ob-ui-libs/oidc';

@Component({
  selector: 'toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit, OnDestroy {
  horizontalNavbar: boolean;
  rightNavbar: boolean;
  hiddenNavbar: boolean;
  navigation: any;
  connected$: Observable<boolean>;
  username$: Observable<string>;

  private _unsubscribeAll: Subject<any>;

  constructor(
    private _fuseConfigService: FuseConfigService,
    private _fuseSidebarService: FuseSidebarService,
    private store: Store<IState>
  ) {
    this.navigation = navigation;

    // Set the private defaults
    this._unsubscribeAll = new Subject();

    this.connected$ = store.pipe(select(selectOIDCConnected));
    this.username$ = store.pipe(select(selectOIDCUserId));
  }

  logout() {
    this.store.dispatch(new ForgerockOIDCLogoutRequestAction());
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Subscribe to the config changes
    this._fuseConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe(settings => {
      this.horizontalNavbar = settings.layout.navbar.position === 'top';
      this.rightNavbar = settings.layout.navbar.position === 'right';
      this.hiddenNavbar = settings.layout.navbar.hidden === true;
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
