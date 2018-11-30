import {Component} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';

import { AuthenticationService } from '../../../../core/authentication/authentication.service';
import { Logger } from '../../../../core/logger.service';
import { EmployeeService } from './employee.service';

const log = new Logger('Employees');

@Component({
  selector: 'employees',
  templateUrl: './employees.html',
  styleUrls: ['./employees.scss']
})
export class Employees {

  query = '';

  settings = {
    actions: {
      position: 'right'
    },
    mode: 'external',
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
      userName: {
        title: 'Login Name',
        type: 'string'
      },
      firstName: {
        title: 'Name',
        type: 'string'
      },
      mobileNumber: {
        title: 'Mobile Number',
        type: 'string'
      },
      email: {
        title: 'Email',
        type: 'string'
      }
    }
  };

  source: LocalDataSource = new LocalDataSource();

  constructor(private router: Router,
    private route: ActivatedRoute,
    private service: EmployeeService,
    private authService: AuthenticationService) {
      this.service.getData().then((data) => {
        this.source.load(data);
      });
  }

  handleCreate() {
    this.router.navigate(['../createEmployee'], { relativeTo: this.route });
  }

  handleEdit( row: any ) {
    const employee = row.data;
    this.router.navigate(['../editEmployee', employee.id], { relativeTo: this.route });
  }

  onDeleteConfirm(event: any): void {
    if (window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }

}
