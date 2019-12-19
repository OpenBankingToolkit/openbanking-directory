import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Renderer2 } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import debug from 'debug';

import { SoftwareStatementService } from 'directory/src/app/services/software-statement.service';
import { ForgerockMessagesService } from '@forgerock/openbanking-ngx-common/services/forgerock-messages';

const log = debug('SoftwareStatements:SoftwareStatementsAssertionComponent');

@Component({
  // tslint:disable-next-line
  selector: 'software-statements-assertion',
  templateUrl: './assertion.component.html',
  styleUrls: ['./assertion.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SoftwareStatementsAssertionComponent implements OnInit {
  softwareStatementId: string;
  ssa;
  ssaHeader;
  ssaClaims;
  ssaSignature;
  ssaHeaderDecodedJson;
  ssaClaimsDecodedJson;

  constructor(
    private _softwareStatementService: SoftwareStatementService,
    private activatedRoute: ActivatedRoute,
    private messages: ForgerockMessagesService,
    private cdr: ChangeDetectorRef,
    private renderer: Renderer2
  ) {}

  ngOnInit() {}

  generateSSA() {
    const { softwareStatementId } = this.activatedRoute.snapshot.parent.params;
    this._softwareStatementService.generateSSA(softwareStatementId).subscribe(
      data => {
        log('ssa: ', data);
        this.ssa = data;
        const [ssaHeader, ssaClaims, ssaSignature] = this.ssa.split('.');
        this.ssaHeader = ssaHeader;
        this.ssaClaims = ssaClaims;
        this.ssaSignature = ssaSignature;
        try {
          this.ssaHeaderDecodedJson = JSON.parse(atob(ssaHeader));
        } catch (error) {
          this.ssaHeaderDecodedJson = error.stack;
        }
        try {
          this.ssaClaimsDecodedJson = JSON.parse(atob(ssaClaims));
        } catch (error) {
          this.ssaClaimsDecodedJson = error.stack;
        }
        this.cdr.detectChanges();
      },
      () => this.messages.error()
    );
  }

  downloadSSA() {
    const anchor = this.renderer.createElement('a');
    this.renderer.setStyle(anchor, 'visibility', 'hidden');
    this.renderer.setAttribute(anchor, 'href', 'data:text/jwt;charset=utf-8,' + encodeURIComponent(this.ssa));
    this.renderer.setAttribute(anchor, 'target', '_blank');
    this.renderer.setAttribute(anchor, 'download', 'ssa.jwt');

    anchor.click();
    anchor.remove();
  }
}
