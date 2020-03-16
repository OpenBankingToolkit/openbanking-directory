import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import debug from 'debug';

import { AspspService } from 'directory/src/app/services/aspsp.service';
import { IAspsp } from 'directory/src/models';

const log = debug('admin:AdminAspspIndexComponent');

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class AdminAspspIndexComponent implements OnInit {
  aspsps: IAspsp[];
  displayedColumns: string[] = [
    'logoUri',
    'name',
    'financialId',
    'asDiscoveryEndpoint',
    'rsDiscoveryEndpoint',
    'seeMore'
  ];

  constructor(private _aspspService: AspspService, private _router: Router) {}

  ngOnInit() {
    this.refreshApplication();
  }

  refreshApplication() {
    this._aspspService.getAspsps().subscribe(data => {
      log('ASPSPs: ', data);
      this.aspsps = data;
    });
  }

  createNewASPSP() {
    this._aspspService.createAspsp().subscribe((data: any) => {
      log('aspsp: ', data);
      this._router.navigate(['admin/aspsps/' + data.id]);
    });
  }
}
