import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import _get from 'lodash-es/get';

import { IAspsp } from 'directory/src/models';

@Component({
  selector: 'app-aspsp-card',
  templateUrl: './aspsp-card.component.html',
  styleUrls: ['./aspsp-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DirectoryASPSPCardComponent implements OnInit {
  @Input() aspsps: IAspsp[];
  @Input() isLoading = false;
  @Input() displayedColumns: string[] = [
    'logoUri',
    'name',
    'financialId',
    'asDiscoveryEndpoint',
    'rsDiscoveryEndpoint',
    'transportKeys'
  ];

  constructor() {}

  ngOnInit() {}

  // createNewASPSP() {
  //   // @todo handle admin rights here
  //   this._aspspService.createAspsp().subscribe((data: IAspsp) => {
  //     log('ASPSPs: ', data);
  //     this._router.navigate(['/aspsps/' + data.id]);
  //   });
  // }
}
