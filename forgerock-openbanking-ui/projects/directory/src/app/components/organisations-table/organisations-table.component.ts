import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { IOrganisation } from 'directory/src/models';

@Component({
  selector: 'app-organisations-table',
  styleUrls: ['organisations-table.component.scss'],
  template: `
    <mat-card>
      <mat-card-title
        >Organisations <small>({{ organisations.length }})</small></mat-card-title
      >
      <mat-card-content>
        <mat-progress-bar [style.visibility]="isLoading ? 'visible' : 'hidden'" mode="indeterminate"></mat-progress-bar>
        <table mat-table [dataSource]="organisations">
          <ng-container matColumnDef="id">
            <th mat-header-cell *matHeaderCellDef>ID</th>
            <td mat-cell *matCellDef="let element" [title]="element.id">
              <span>{{ element.id }}</span>
            </td>
          </ng-container>
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Name</th>
            <td mat-cell *matCellDef="let element" [title]="element.name">
              <span>{{ element.name }}</span>
            </td>
          </ng-container>
          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Status</th>
            <td mat-cell *matCellDef="let element" [title]="element.status">
              <span>{{ element.status }}</span>
            </td>
          </ng-container>
          <ng-container matColumnDef="description">
            <th mat-header-cell *matHeaderCellDef>Description</th>
            <td mat-cell *matCellDef="let element" [title]="element.description">
              <span>{{ element.description }}</span>
            </td>
          </ng-container>
          <ng-container matColumnDef="softwareStatementIds">
            <th mat-header-cell *matHeaderCellDef>Software Statements</th>
            <td mat-cell *matCellDef="let element">
              <mat-chip-list aria-label="Fish selection">
                <mat-chip [color]="element.softwareStatementIds.length == 0 ? 'warn' : 'accent'" selected>{{
                  element.softwareStatementIds.length
                }}</mat-chip>
              </mat-chip-list>
            </td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
        </table>
      </mat-card-content>
    </mat-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DirectoryOrganisationsTableComponent implements OnInit {
  @Input() organisations: IOrganisation[];
  @Input() isLoading = false;
  @Input() displayedColumns: string[] = ['id', 'name', 'status', 'description', 'softwareStatementIds'];

  constructor() {}

  ngOnInit() {}
}
