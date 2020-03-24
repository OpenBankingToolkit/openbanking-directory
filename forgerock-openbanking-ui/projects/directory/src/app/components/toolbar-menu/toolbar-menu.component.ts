import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  // tslint:disable-next-line
  selector: 'analytics-toolbar-menu',
  template: `
    <div *ngIf="connected" class="" fxFlex="0 1 auto" fxLayout="row" fxLayoutAlign="start center">
      <button mat-icon-button [matMenuTriggerFor]="userMenu" class="user-button">
        <mat-icon class="s-16">more_vert</mat-icon>
      </button>

      <mat-menu #userMenu="matMenu" [overlapTrigger]="false">
        <button mat-menu-item disabled>
          <span class="username mr-12">{{ username }}</span>
        </button>
        <button mat-menu-item (click)="onLogout($event)">
          <mat-icon>exit_to_app</mat-icon>
          <span>{{ 'SIGNOUT' | translate }}</span>
        </button>
      </mat-menu>
    </div>
  `
})
export class DirectoryToolbarMenuComponent implements OnInit {
  @Input() connected: boolean;
  @Input() username: string;
  @Output() logout = new EventEmitter<Event>();

  constructor() {}

  ngOnInit(): void {}

  onLogout(e: Event) {
    this.logout.emit(e);
  }
}
