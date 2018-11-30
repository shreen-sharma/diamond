import { ItemDetailsService } from './../../../masters/components/itemDetails/itemDetails.service';
import { DefaultNumberComponent } from './../../../../shared/defaultNumberComponent/defaultNumber.components';
import {Component} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';

import { AuthenticationService } from '../../../../core/authentication/authentication.service';
import { Logger } from '../../../../core/logger.service';
import { PartyAccountService } from './partyAccount.service';
import { CategoryService } from '.../../app/pages/masters/components/categories/category.service';
import { PartyDetailsService } from '.../../app/pages/company/components/partyDetails/partyDetails.service';

const log = new Logger('partyAccount');

@Component({
  selector: 'partyAccount',
  templateUrl: './partyAccount.html',
  styleUrls: ['./partyAccount.scss']
})
export class PartyAccount {

  query = '';
  settings: any;
  errorMessage: string;
  successMessage: string;
  partyList: any [] = [];
  partyLAList: any[] = [];

  source: LocalDataSource = new LocalDataSource();

  prepareSetting() {
    return {
    actions: {
      position: 'right',
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
      partyName: {
        title: 'Party Name',
        type: 'string',
      },
      partyType: {
        title: 'Party Type',
        type: 'string',
      },
      partyAccCode: {
        title: 'Party Account Code',
        type: 'string',
      },
      partyAccDesc: {
        title: 'Account Description',
        type: 'string',
      },
    }
  };
}


  constructor(private router: Router,
    private service: PartyAccountService,
    private route: ActivatedRoute,
    private partyService: PartyDetailsService,
    private authService: AuthenticationService) {
    this.partyService.getData().subscribe( partyList => {
         this.partyList = partyList;
    });
        this.service.getAllPartyAccount().subscribe((data) => {
      this.settings = this.prepareSetting();
      this.source.load(data);
    });
  }

  handleCreate() {
    this.router.navigate(['../createPartyAccount'], { relativeTo: this.route });
  }

 handleEdit( row: any ) {
    const partyAccount = row.data;
    this.router.navigate(['../editPartyAccount', partyAccount.partyAccId], { relativeTo: this.route });
  }

  onDeleteConfirm(event: any): void {
    if (window.confirm('Are you sure you want to delete?')) {
     this.service.deletePartyAccount(event.data.partyAccId).subscribe(response => {
     this.service.getAllPartyAccount().subscribe((data) => {
     this.source.load(data);
          });
       })
      } else {
      // event.confirm.reject();
      }
  }
}
