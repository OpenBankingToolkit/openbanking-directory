import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy, Input } from '@angular/core';
import { Router } from '@angular/router';
import { switchMap, catchError, finalize, takeUntil, retry } from 'rxjs/operators';
import { of, Subject } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import _get from 'lodash-es/get';
import debug from 'debug';

import { ForgerockMessagesService } from '@forgerock/openbanking-ngx-common/services/forgerock-messages';
import { AspspService } from 'directory/src/app/services/aspsp.service';
import { IAspsp } from 'directory/src/models';

const log = debug('Aspsps:AspspsIndexComponent');

@Component({
  selector: 'app-aspsp-card',
  templateUrl: './aspsp-card.component.html',
  styleUrls: ['./aspsp-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DirectoryASPSPCardComponent implements OnInit, OnDestroy {
  aspsps: IAspsp[];
  isLoading = false;
  private _unsubscribeAll: Subject<any> = new Subject();
  @Input() displayedColumns: string[] = [
    'logoUri',
    'name',
    'financialId',
    'asDiscoveryEndpoint',
    'rsDiscoveryEndpoint',
    'transportKeys'
  ];

  constructor(
    private _aspspService: AspspService,
    private _router: Router,
    private cdr: ChangeDetectorRef,
    private messages: ForgerockMessagesService
  ) {}

  ngOnInit() {
    this.startLoading();
    this._aspspService
      .getAspsps()
      .pipe(
        takeUntil(this._unsubscribeAll),
        retry(3),
        switchMap((response: IAspsp[]) => {
          this.aspsps = response;
          return of(response);
        }),
        catchError((er: HttpErrorResponse | Error) => {
          const error = _get(er, 'error.Message') || _get(er, 'error.message') || _get(er, 'message') || er;
          this.messages.error(error);
          return of(er);
        }),
        finalize(() => {
          this.isLoading = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe((data: IAspsp[]) => {
        log('ASPSPs: ', data);
        this.aspsps = data;
        this.cdr.detectChanges();
      });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  startLoading() {
    this.isLoading = true;
    this.cdr.markForCheck();
  }

  createNewASPSP() {
    // @todo handle admin rights here
    this._aspspService.createAspsp().subscribe((data: IAspsp) => {
      log('ASPSPs: ', data);
      this._router.navigate(['/aspsps/' + data.id]);
    });
  }
}
