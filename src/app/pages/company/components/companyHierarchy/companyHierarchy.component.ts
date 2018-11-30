import {Component} from '@angular/core';
import { Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';

import { AuthenticationService } from '../../../../core/authentication/authentication.service';
import { Logger } from '../../../../core/logger.service';
import { CompanyHierarchyService } from './companyHierarchy.service';

const log = new Logger('companyhierarchyCreation');

@Component({
  selector: 'companyHierarchy',
  templateUrl: './companyHierarchy.html',
  styleUrls: ['./companyHierarchy.scss']
})
export class CompanyHierarchy {

  query = '';

  settings = {
    actions: {
      position: 'right'
    },
    add: {
      addButtonContent: '<i class="ion-ios-plus-outline"></i>',
      createButtonContent: '<i class="ion-checkmark"></i>',
      cancelButtonContent: '<i class="ion-close"></i>',
    },
    edit: {
      editButtonContent: '<i class="ion-edit"></i>',
      saveButtonContent: '<i class="ion-checkmark"></i>',
      cancelButtonContent: '<i class="ion-close"></i>',
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
      loggedCompanyName: {
        title: 'Logged Company Name',
        type: 'string'
      },
      division: {
        title: 'Division',
        type: 'string'
      },
      location: {
        title: 'Location',
        type: 'string'
      },
      department: {
        title: 'Department',
        type: 'string'
      },
      sub_department: {
        title: 'Sub-Department',
        type: 'string'
      }
    }
  };

  source: LocalDataSource = new LocalDataSource();

  constructor(private router: Router, private service: CompanyHierarchyService,
     private authService: AuthenticationService) {
    this.service.getData().then((data) => {
      this.source.load(data);
    });
  }

  onDeleteConfirm(event: any): void {
    if (window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }

}
