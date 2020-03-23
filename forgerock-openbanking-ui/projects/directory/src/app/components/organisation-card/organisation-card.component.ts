import { Component, OnInit, ChangeDetectionStrategy, Input, EventEmitter, Output } from '@angular/core';
import _get from 'lodash-es/get';

import debug from 'debug';

import { IOrganisation } from 'directory/src/models';

const log = debug('Organisation:OrganisationIndexComponent');

@Component({
  selector: 'app-organisation-card',
  template: `
    <mat-card>
      <mat-card-title
        >Your organisation
        <span fxFlex></span>
        <button mat-icon-button routerLink="/organisation" aria-label="Edit organisation">
          <mat-icon>edit</mat-icon>
        </button></mat-card-title
      >
      <mat-card-content
        ><mat-progress-bar
          [style.visibility]="isLoading ? 'visible' : 'hidden'"
          mode="indeterminate"
        ></mat-progress-bar>
        <div *ngIf="organisation">
          <mat-list>
            <mat-list-item>
              <div mat-line>ID</div>
              <p mat-line>{{ organisation?.id }}</p>
            </mat-list-item>
            <mat-list-item>
              <div mat-line>Name</div>
              <p mat-line>{{ organisation?.name }}</p>
            </mat-list-item>
            <mat-list-item>
              <div mat-line>Status</div>
              <p mat-line>{{ organisation?.status }}</p>
            </mat-list-item>
            <mat-list-item class="wrap">
              <div mat-line>Description</div>
              <p mat-line>{{ organisation?.description }}</p>
            </mat-list-item>
          </mat-list>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [
    `
      mat-card-title {
        align-items: center;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DirectoryOrganisationCardComponent implements OnInit {
  @Input() organisation: IOrganisation;
  @Input() isLoading = false;

  constructor() {}
  ngOnInit() {}
}
