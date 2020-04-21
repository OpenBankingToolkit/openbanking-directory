import { Component, OnInit, Input, ChangeDetectionStrategy, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { IOrganisation } from 'directory/src/models';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-organisations-table',
  styleUrls: ['organisations-table.component.scss'],
  template: `
    <mat-card>
      <mat-card-title
        >Organisations <small>({{ organisations.length }})</small></mat-card-title
      >
      <mat-card-content>
        <table mat-table [dataSource]="dataSource">
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

        <mat-progress-bar [style.visibility]="isLoading ? 'visible' : 'hidden'" mode="indeterminate"></mat-progress-bar>
      </mat-card-content>

      <ng-container *ngIf="!dataSource.data.length && !isLoading">
        <forgerock-alert>{{ 'EMPTY' | translate }}</forgerock-alert>
      </ng-container>

      <mat-card-actions>
        <mat-paginator
          [pageSizeOptions]="pageSizeOptions"
          [pageSize]="selectedPageSize"
          showFirstLastButtons
        ></mat-paginator>
      </mat-card-actions>
    </mat-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DirectoryOrganisationsTableComponent implements OnInit, OnChanges {
  @Input() organisations: IOrganisation[];
  @Input() isLoading = false;
  @Input() displayedColumns: string[] = ['id', 'name', 'status', 'description', 'softwareStatementIds'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  dataSource: MatTableDataSource<IOrganisation>;
  pageSizeOptions = [5, 10, 20];
  selectedPageSize = this.pageSizeOptions[1];

  constructor() {}

  ngOnInit() {
    this.dataSource = new MatTableDataSource(this.organisations);
    this.dataSource.paginator = this.paginator;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.organisations && !changes.organisations.firstChange && changes.organisations.currentValue) {
      this.dataSource.data = changes.organisations.currentValue;
    }
  }
}
