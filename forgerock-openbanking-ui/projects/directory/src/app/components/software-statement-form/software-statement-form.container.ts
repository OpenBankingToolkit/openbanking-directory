import { Component, OnInit, Input } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';

import { IState, ISoftwareStatement } from 'directory/src/models';
import {
  SoftwareStatementUpdateRequestAction,
  SoftwareStatementRequestAction,
  selectSoftwareStatement,
  selectIsLoading
} from 'directory/src/store/reducers/software-statements';

const selector = 'app-software-statement-form-container';

@Component({
  selector,
  template: `
    <app-software-statement-form [softwareStatement]="softwareStatement$ | async" [isLoading]="isLoading$ | async" (update)="update($event)">
    </app-software-statement-form>
  `
})
export class DirectorySoftwareStatementFormContainer implements OnInit {
  @Input() softwareStatementId: string;
  public isLoading$: Observable<boolean> = this.store.pipe(select(selectIsLoading));
  public softwareStatement$: Observable<ISoftwareStatement> = this.store.pipe(
    select((state: IState) => selectSoftwareStatement(state, this.softwareStatementId))
  );

  constructor(protected store: Store<IState>) {}

  ngOnInit() {
    this.softwareStatement$.pipe(first()).subscribe(softwareStatement => {
      console.log('ngOnInit', { softwareStatement });
      return (
        !softwareStatement &&
        this.store.dispatch(
          SoftwareStatementRequestAction({
            softwareStatementId: this.softwareStatementId
          })
        )
      );
    });
  }

  update(softwareStatement: ISoftwareStatement) {
    this.store.dispatch(
      SoftwareStatementUpdateRequestAction({
        softwareStatement
      })
    );
  }
}
