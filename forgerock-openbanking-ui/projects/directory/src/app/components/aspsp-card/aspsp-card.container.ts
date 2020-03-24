import { Component, OnInit, Input } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { IState, IAspsp } from 'directory/src/models';
import { first } from 'rxjs/operators';
import { selectAspsps, selectIsLoading, AspspsRequestAction } from 'directory/src/store/reducers/aspsps';

@Component({
  selector: 'app-aspsp-card-container',
  template: `
    <app-aspsp-card [displayedColumns]="displayedColumns" [aspsps]="aspsps$ | async" [isLoading]="isLoading$ | async">
    </app-aspsp-card>
  `
})
export class DirectoryASPSPCardContainer implements OnInit {
  @Input() displayedColumns: string[] = [
    'logoUri',
    'name',
    'financialId',
    'asDiscoveryEndpoint',
    'rsDiscoveryEndpoint',
    'transportKeys'
  ];

  public aspsps$: Observable<IAspsp[]> = this.store.pipe(select(selectAspsps));
  public isLoading$: Observable<boolean> = this.store.pipe(select(selectIsLoading));

  constructor(protected store: Store<IState>) {}

  ngOnInit() {
    this.aspsps$
      .pipe(first())
      .subscribe((aspsps: IAspsp[]) => !aspsps.length && this.store.dispatch(AspspsRequestAction()));
  }
}
