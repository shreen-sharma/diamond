import { Http } from '@angular/http';
import {Component} from '@angular/core';
import { Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';

import { Logger } from '../../../../core/logger.service';
import { SetupService } from './setup.service';

const log = new Logger('setup');

@Component({
  selector: 'setup',
  templateUrl: './setup.html',
  styleUrls: ['./setup.scss']
})
export class Setup {

  query = '';
  message: string;

  settings = {
    actions: {
      position: 'right',
      edit: false,
      delete: false
    },
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
      groupName: {
        title: 'Group Name',
        type: 'string'
      },
      groupCode: {
        title: 'Group Code',
        type: 'string'
      },
      companyName: {
        title: 'Company Name',
        type: 'string'
      },
      companyCode: {
        title: 'Company Code',
        type: 'string'
      },

        },
        }

  source: LocalDataSource = new LocalDataSource();
  constructor(private service: SetupService, private http: Http) {

  }

  onCreateConfirm(event: any): void {
    this.service.addGroupCompany(event.newData).subscribe(data => {
      if(data && data.hierRelId){
        this.message = 'Successfully Group and Company created.';
      }else {
        this.message = 'Successfully Group and Company failed.';
      }

    })
  }
  onDeleteConfirm(event: any): void {
  }

}
