import {Component} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';

import { AuthenticationService } from '../../../../core/authentication/authentication.service';
import { Logger } from '../../../../core/logger.service';
import { CompanyEmployeeService} from './companyEmployee.service';

const log = new Logger('CompanyEmployee');

@Component({
  selector: 'companyEmployee',
  templateUrl: './companyEmployee.html',
  styleUrls: ['./companyEmployee.scss']
})
export class CompanyEmployee {

  query = '';

  source: LocalDataSource = new LocalDataSource();

  settings = {
    actions: {
      position: 'right'
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
      empCode: {
        title: 'Person Code',
        type: 'string',
      },
      empName: {
        title: 'Person Name',
        type: 'string',
      },
      gender: {
        title: 'Gender',
        type: 'string',
      },
      dob: {
        title: 'Date of Birth ',
        type: 'string',
      },
      nationality: {
        title: 'Nationality',
        type: 'string',
      },
    }
}

  constructor(private router: Router,
    private service: CompanyEmployeeService,
    private route: ActivatedRoute,
    private authService: AuthenticationService) {
    this.service.getData().subscribe((data) => {
      this.source.load(data);
    });
  }

  handleCreate() {
    this.router.navigate(['../createCompanyEmployee'], { relativeTo: this.route });
  }

  handleEdit( row: any ) {
    const companyEmployee = row.data;
    this.router.navigate(['../editCompanyEmployee', companyEmployee.empId], { relativeTo: this.route });
  }

  onDeleteConfirm(event: any): void {
    if (window.confirm('Are you sure you want to delete?')) {
      this.service.deleteEmployee(event.data.empId).subscribe( data => {
      // event.confirm.resolve();
      this.service.getData().subscribe((resp) => {
        this.source.load(resp);
      });
    });

    } else {
      // event.confirm.reject();
    }
  }

}
