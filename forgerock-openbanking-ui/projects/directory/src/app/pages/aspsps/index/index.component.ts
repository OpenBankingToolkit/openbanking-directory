import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import debug from 'debug';

import { AspspService } from 'directory/src/app/services/aspsp.service';
import { IAspsp } from 'directory/src/models';

const log = debug('Aspsps:AspspsIndexComponent');

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class AspspsIndexComponent implements OnInit {
  aspsps: IAspsp[];
  displayedColumns: string[] = [
    'logoUri',
    'name',
    'financialId',
    'asDiscoveryEndpoint',
    'rsDiscoveryEndpoint',
    'transportKeys'
  ];

  constructor(private _aspspService: AspspService, private _router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this._aspspService.getAspsps().subscribe((data: any) => {
      log('ASPSPs: ', data);
      this.aspsps = data;
      this.cdr.detectChanges();
    });
  }

  createNewASPSP() {
    this._aspspService.createAspsp().subscribe((data: any) => {
      log('ASPSPs: ', data);
      this._router.navigate(['/aspsps/' + data.id]);
    });
  }
}
