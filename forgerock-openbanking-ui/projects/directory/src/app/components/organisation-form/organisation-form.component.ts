import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  EventEmitter,
  Output,
  SimpleChanges,
  OnChanges
} from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import _get from 'lodash-es/get';

import { IOrganisation } from 'directory/src/models';

@Component({
  selector: 'app-organisation-form',
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()">
      <mat-form-field>
        <input matInput placeholder="Id" formControlName="id" type="text" />
      </mat-form-field>
      <mat-form-field>
        <input matInput placeholder="Name" formControlName="name" type="text" />
      </mat-form-field>
      <mat-form-field>
        <textarea matInput placeholder="Description" formControlName="description" rows="5"></textarea>
      </mat-form-field>
      <div fxLayout="row">
        <div fxFlex></div>
        <button mat-button (click)="cancel.emit()">
          {{ 'CANCEL' | translate }}
        </button>
        <button mat-raised-button color="accent" type="submit" [disabled]="!form.valid || isLoading">
          {{ 'SAVE' | translate }}
        </button>
      </div>
    </form>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      mat-form-field {
        width: 100%;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DirectoryOrganisationFormComponent implements OnInit, OnChanges {
  @Input() organisation: IOrganisation;
  @Input() isLoading = false;
  @Output() update = new EventEmitter<IOrganisation>();
  @Output() cancel = new EventEmitter<void>();
  public form: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      id: new FormControl(
        {
          disabled: true,
          value: ''
        },
        Validators.required
      ),
      name: new FormControl(''),
      description: new FormControl('')
    });
  }

  ngOnInit() {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.organisation && changes.organisation.currentValue) {
      const { id, name, description } = changes.organisation.currentValue;
      this.form.setValue({ id, name, description });
    }
  }

  submit() {
    this.update.emit({
      ...this.organisation,
      ...this.form.value
    });
  }
}
