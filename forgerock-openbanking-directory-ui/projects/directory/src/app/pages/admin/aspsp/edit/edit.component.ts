import { Component, OnInit } from '@angular/core';
import { ForgerockMessagesService } from 'ob-ui-libs/services/forgerock-messages';
import { ActivatedRoute, Params } from '@angular/router';
import { AspspService } from 'directory/src/app/services/aspsp.service';
import debug from 'debug';

const log = debug('admin:AdminAspspEditComponent');

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class AdminAspspEditComponent implements OnInit {
  aspspId;
  aspsp;

  // @ViewChild('alertSignin', { read: ViewContainerRef })
  // alertSignin: ViewContainerRef;

  constructor(
    private _aspspService: AspspService,
    private route: ActivatedRoute,
    private messages: ForgerockMessagesService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.aspspId = params['aspspId'];
      this._aspspService.getAspsp(this.aspspId).subscribe(data => {
        log('ASPSP: ', data);
        this.aspsp = data;
      });
    });
  }

  onSubmit() {
    log('submit!', this.aspsp);
    this._aspspService.updateAspsp(this.aspsp).subscribe(data => {
      this.successAlert('Saved!');
      log('aspsp: ', data);
      this.aspsp = data;
    });
  }

  successAlert(message) {
    // this.showAlert('alertSignin');
    this.messages.success(message);
  }

  failureAlert(message) {
    // this.showAlert('alertSignin');
    this.messages.error(message);
  }

  // showAlert(target) {
  //   this[target].clear();
  //   let factory = this.cfr.resolveComponentFactory(AlertComponent);
  //   let ref = this[target].createComponent(factory);
  //   ref.changeDetectorRef.detectChanges();
  //   setTimeout(() => {
  //     this[target].clear();
  //   }, 2000);
  // }
}
