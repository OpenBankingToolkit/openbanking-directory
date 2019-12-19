import { Component, OnInit } from '@angular/core';
import { OrganisationService } from 'directory/src/app/services/organisation.service';
import debug from 'debug';

const log = debug('admin:AdminOrganisationsComponent');

@Component({
  selector: 'app-organisations',
  templateUrl: './organisations.component.html',
  styleUrls: ['./organisations.component.scss']
})
export class AdminOrganisationsComponent implements OnInit {
  organisations;
  displayedColumns: string[] = ['id', 'name', 'description'];

  constructor(private _organisationService: OrganisationService) {}

  ngOnInit() {
    this._organisationService.getOrganisations().subscribe(data => {
      log('Organisations: ', data);
      this.organisations = data;
    });
  }
}
