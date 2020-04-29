import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  SimpleChanges,
  OnChanges,
  EventEmitter,
  Output
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import _get from 'lodash-es/get';
import { validateMultipleUrls, validateUrl } from '@forgerock/openbanking-ngx-common/utils';
import { ISoftwareStatement } from 'directory/src/models';

@Component({
  selector: 'app-software-statement-form',
  templateUrl: './software-statement-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DirectorySoftwareStatementFormComponent implements OnInit, OnChanges {
  formGroup: FormGroup;
  @Input() softwareStatement: ISoftwareStatement;
  @Input() isLoading = false;
  @Output() update = new EventEmitter<ISoftwareStatement>();

  constructor() {
    this.formGroup = new FormGroup({
      id: new FormControl({ value: '', disabled: true }, Validators.required),
      status: new FormControl({ value: '', disabled: true }, Validators.required),
      roles: new FormControl({ value: '', disabled: true }, Validators.required),
      name: new FormControl(''),
      description: new FormControl(''),
      redirectUris: new FormControl('', [validateMultipleUrls]),
      logoUri: new FormControl('', [validateUrl]),
      policyUri: new FormControl('', [validateUrl]),
      termsOfService: new FormControl('', [validateUrl])
    });
  }
  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.softwareStatement && changes.softwareStatement.currentValue) {
      this.updateFormValues(changes.softwareStatement.currentValue);
    }
    if (changes.isLoading !== undefined) {
      changes.isLoading.currentValue ? this.formGroup.disable() : this.formGroup.enable();
    }
  }

  updateFormValues(data: ISoftwareStatement) {
    const { id, status, roles, name, description, redirectUris, logoUri, policyUri, termsOfService } = data;
    this.formGroup.patchValue({
      id,
      status,
      roles,
      name,
      description,
      logoUri,
      policyUri,
      termsOfService,
      redirectUris: redirectUris.join(',')
    });
  }

  onSubmit() {
    this.update.emit({
      ...this.softwareStatement,
      ...this.formGroup.value,
      redirectUris: this.formGroup.value.redirectUris.split(',')
    });
  }
}
