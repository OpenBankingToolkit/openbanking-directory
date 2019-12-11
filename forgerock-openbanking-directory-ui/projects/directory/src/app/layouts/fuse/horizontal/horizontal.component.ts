/* tslint:disable */
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FuseConfigService } from '@fuse/services/config.service';
import { navigation } from 'directory/src/app/navigation/navigation';

@Component({
  selector: 'horizontal-layout-1',
  templateUrl: './horizontal.component.html',
  styleUrls: ['./horizontal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FuseHorizontalLayoutComponent implements OnInit, OnDestroy {
  fuseConfig: any;
  navigation: any;

  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {FuseConfigService} _fuseConfigService
   */
  constructor(private _fuseConfigService: FuseConfigService) {
    // Set the defaults
    this.navigation = navigation;

    // Set the private defaults
    this._unsubscribeAll = new Subject();
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
}
