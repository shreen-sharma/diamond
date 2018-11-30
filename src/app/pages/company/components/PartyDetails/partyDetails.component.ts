import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';

import { AuthenticationService } from '../../../../core/authentication/authentication.service';
import { Logger } from '../../../../core/logger.service';
import { PartyDetailsService } from './partyDetails.service';

const log = new Logger('PartyDetails');

@Component({
  selector: 'partyDetails',
  templateUrl: './partyDetails.html',
  styleUrls: ['./partyDetails.scss']
})
export class PartyDetails {

  query = '';
  partyTypeList: any[] = [];
  settings: any;
  accessList: any[] = [];
  public isEdit: boolean;
  source: LocalDataSource = new LocalDataSource();

  prepareSetting() {
    return {
      actions: {
        position: 'right',
        add: this.accessList.includes("ADD"),
        edit: this.isEdit,
        delete: this.accessList.includes("DELETE"),
      },
      mode: 'external',
      add: {
        addButtonContent: '<i class="ion-ios-plus-outline"></i>',
        createButtonContent: '<i class="ion-checkmark"></i>',
        cancelButtonContent: '<i class="ion-close"></i>',
        confirmCreate: true,
      },
      edit: {
        editButtonContent: '<i class="ion-edit"></i>',
        saveButtonContent: '<i class="ion-checkmark"></i>',
        cancelButtonContent: '<i class="ion-close"></i>',
        confirmSave: true,
      },
      delete: {
        deleteButtonContent: '<i class="ion-trash-a"></i>',
        confirmDelete: true
      },
      columns: {
        /* id: {
          title: 'ID',
          type: 'number'
        }, */
        partyTypePartyCode: {
          title: 'Party Type',
          filter: {
            type: 'list',
            config: {
              selectText: 'All',
              list: this.partyTypeList,
            },
          },
          valuePrepareFunction: value => this.getpartyType(value),
        },
        partyCode: {
          title: 'Party Code',
          type: 'string'
        },
        partyName: {
          title: 'Party Name',
          type: 'string'
        },
        partyStatus: {
          title: 'Party Status',
          filter: {
            type: 'list',
            config: {
              selectText: 'All',
              list: [{ value: 'L', title: 'Local' }, { value: 'F', title: 'Foreign' }],
            },
          },
          valuePrepareFunction: value => this.getpartyStatusById(value)
        },
        fidNo: {
          title: 'QBC No.',
          type: 'string'
        },
      }
    }
  };

  constructor(private router: Router,
    private service: PartyDetailsService,
    private route: ActivatedRoute,
    private authService: AuthenticationService) {

    this.accessList = this.authService.getUserAccessOfMenu('partyDetails');
    const edit = this.accessList.includes("UPDATE");
    const view = this.accessList.includes("GET");
    if (edit == true) {
      this.isEdit = true;
    } else if (view == true) {
      this.isEdit = true;
    } else {
      this.isEdit = false;
    }


    this.service.getAllPartyTypes().subscribe((partyData) => {
      partyData.forEach(party => {
        this.partyTypeList.push({ value: party.code, title: party.name });
      });
    });
    this.service.getData().subscribe((data) => {
      this.settings = this.prepareSetting();
      this.source.load(data);
    });
  }

  getpartyTypeById(code: any) {
    const len: number = this.partyTypeList.length;
    for (let i = 0; i < len; i++) {
      if (this.partyTypeList[i].value === code) {
        return this.partyTypeList[i].title;
      }
    }
    return code;
  }

  getpartyStatusById(value: any) {
    let title = '';
    if (value === 'L') {
      title = 'Local'
    } else if (value === 'F') {
      title = 'Foreign';
    }
    return title;
  }
  getpartyType(value: any) {
    let title = '';
    if (value === 'SU') {
      title = 'Supplier'
    } else if (value === 'CU') {
      title = 'Customer';
    } else if (value === 'BR') {
      title = 'Broker';
    }
    return title;
  }

  handleCreate() {
    this.router.navigate(['../createPartyDetails'], { relativeTo: this.route });
  }

  handleEdit(row: any) {
    let view = this.accessList.includes("GET");
    let edit = this.accessList.includes("UPDATE");
    if (view == true && edit == true) {
      view = false;
    } else if (view == false && edit == true) {
      view = false;
    }
    if (view == true) {
      const partyDetails = row.data;
      this.router.navigate(['../viewPartyDetails/' + view + '/' + partyDetails.partyId], { relativeTo: this.route });
    } else if (edit == true) {
      const partyDetails = row.data;
      this.router.navigate(['../editPartyDetails/' + view + '/' + partyDetails.partyId], { relativeTo: this.route });
    }
  }

  onDeleteConfirm(event: any): void {
    if (window.confirm('Are you sure you want to delete?')) {
      this.service.deleteParty(event.data.partyId).subscribe(data => {
        // event.confirm.resolve();
        this.service.getData().subscribe((data) => {
          this.source.load(data);
        });
      });

    } else {
      // event.confirm.reject();
    }
  }

}
