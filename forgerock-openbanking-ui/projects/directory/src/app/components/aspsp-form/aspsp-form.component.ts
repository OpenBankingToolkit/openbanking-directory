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
import { validateUrl } from '@utils/forms';
import _get from 'lodash-es/get';

import { IAspsp } from 'directory/src/models';

@Component({
  selector: 'app-aspsp-form',
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()">
      <mat-form-field>
        <input matInput placeholder="Id" formControlName="id" type="text" />
      </mat-form-field>
      <mat-form-field>
        <input matInput placeholder="Logo URL" formControlName="logoUri" type="text" />
      </mat-form-field>
      <mat-form-field>
        <input matInput placeholder="Name *" formControlName="name" type="text" />
        <mat-error *ngIf="form.controls.name.hasError('required') && form.controls.name.touched">
          <strong>{{ 'REQUIRED' | translate }}</strong>
        </mat-error>
      </mat-form-field>
      <mat-form-field>
        <input matInput placeholder="Financial ID *" formControlName="financialId" type="text" />
        <mat-error *ngIf="form.controls.financialId.hasError('required') && form.controls.financialId.touched">
          <strong>{{ 'REQUIRED' | translate }}</strong>
        </mat-error>
      </mat-form-field>
      <mat-form-field>
        <input matInput placeholder="ASPSP-AS discovery endpoint *" formControlName="asDiscoveryEndpoint" type="text" />
        <mat-error
          *ngIf="form.controls.asDiscoveryEndpoint.hasError('required') && form.controls.asDiscoveryEndpoint.touched"
        >
          <strong>{{ 'REQUIRED' | translate }}</strong> </mat-error
        ><mat-error
          *ngIf="form.controls.asDiscoveryEndpoint.hasError('validateUrl') && form.controls.asDiscoveryEndpoint.touched"
        >
          Malformed <strong>URL</strong>
        </mat-error>
      </mat-form-field>
      <mat-form-field>
        <input matInput placeholder="ASPSP-RS discovery endpoint *" formControlName="rsDiscoveryEndpoint" type="text" />
        <mat-error
          *ngIf="form.controls.rsDiscoveryEndpoint.hasError('required') && form.controls.rsDiscoveryEndpoint.touched"
        >
          <strong>{{ 'REQUIRED' | translate }}</strong> </mat-error
        ><mat-error
          *ngIf="form.controls.rsDiscoveryEndpoint.hasError('validateUrl') && form.controls.rsDiscoveryEndpoint.touched"
        >
          Malformed <strong>URL</strong>
        </mat-error>
      </mat-form-field>
      <mat-form-field>
        <input matInput placeholder="Test MTLS endpoint *" formControlName="testMtlsEndpoint" type="text" />
        <mat-error
          *ngIf="form.controls.testMtlsEndpoint.hasError('required') && form.controls.testMtlsEndpoint.touched"
        >
          <strong>{{ 'REQUIRED' | translate }}</strong> </mat-error
        ><mat-error
          *ngIf="form.controls.testMtlsEndpoint.hasError('validateUrl') && form.controls.testMtlsEndpoint.touched"
        >
          Malformed <strong>URL</strong>
        </mat-error>
      </mat-form-field>
      <mat-form-field>
        <input matInput placeholder="Transport keys *" formControlName="transportKeys" type="text" />
        <mat-error *ngIf="form.controls.transportKeys.hasError('required') && form.controls.transportKeys.touched">
          <strong>{{ 'REQUIRED' | translate }}</strong>
        </mat-error>
      </mat-form-field>
      <div fxLayout="row">
        <div fxFlex></div>
        <button mat-button type="button" (click)="cancel.emit()">
          {{ 'CANCEL' | translate }}
        </button>
        <button mat-raised-button color="accent" type="submit" [disabled]="!form.valid">
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
export class DirectoryASPSPFormComponent implements OnInit, OnChanges {
  @Input() aspsp: IAspsp;
  @Output() update = new EventEmitter<IAspsp>();
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
      logoUri: new FormControl('', [Validators.required, validateUrl]),
      name: new FormControl('', Validators.required),
      financialId: new FormControl('', Validators.required),
      asDiscoveryEndpoint: new FormControl('', [Validators.required, validateUrl]),
      rsDiscoveryEndpoint: new FormControl('', [Validators.required, validateUrl]),
      testMtlsEndpoint: new FormControl('', [Validators.required, validateUrl]),
      transportKeys: new FormControl('', Validators.required)
    });
  }

  ngOnInit() {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.aspsp && changes.aspsp.currentValue) {
      const {
        id,
        logoUri,
        name,
        financialId,
        asDiscoveryEndpoint,
        rsDiscoveryEndpoint,
        testMtlsEndpoint,
        transportKeys
      } = changes.aspsp.currentValue;
      this.form.setValue({
        id,
        logoUri,
        name,
        financialId,
        asDiscoveryEndpoint,
        rsDiscoveryEndpoint,
        testMtlsEndpoint,
        transportKeys
      });
    }
  }

  submit() {
    console.log({ hehe: this.form.getRawValue() });
    this.update.emit(this.form.getRawValue());
  }
}
