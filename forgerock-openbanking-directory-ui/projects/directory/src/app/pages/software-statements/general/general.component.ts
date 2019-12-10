import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { SoftwareStatementService } from 'directory/src/app/services/software-statement.service';
import { ISoftwareStatement } from 'directory/src/models';
import { ForgerockMessagesService } from 'ob-ui-libs/services/forgerock-messages';
import { validateMultipleUrls, validateUrl } from '@utils/forms';

@Component({
  // tslint:disable-next-line
  selector: 'software-statements-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SoftwareStatementsGeneralComponent implements OnInit {
  formGroup: FormGroup;
  isLoading = false;
  softwareStatement: ISoftwareStatement;

  constructor(
    private _softwareStatementService: SoftwareStatementService,
    private activatedRoute: ActivatedRoute,
    private messages: ForgerockMessagesService
  ) {}

  ngOnInit() {
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
    const { softwareStatementId } = this.activatedRoute.snapshot.parent.params;
    this.isLoading = true;
    this._softwareStatementService.getSoftwareStatement(softwareStatementId).subscribe(
      (data: any) => {
        this.softwareStatement = data;
        this.updateFormValues(data);
      },
      () => this.messages.error(),
      () => (this.isLoading = false)
    );
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
    this.isLoading = true;
    this._softwareStatementService
      .putSoftwareStatement({
        ...this.softwareStatement,
        ...this.formGroup.value,
        redirectUris: this.formGroup.value.redirectUris.split(',')
      })
      .subscribe(
        (data: any) => {
          this.messages.success('Saved!');
          this.softwareStatement = data;
          this.updateFormValues(data);
        },
        () => this.messages.error(),
        () => (this.isLoading = false)
      );
  }
}
