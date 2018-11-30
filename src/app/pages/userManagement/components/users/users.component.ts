import {Component} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';

import { AuthenticationService } from '../../../../core/authentication/authentication.service';
import { Logger } from '../../../../core/logger.service';
import { UserService } from './user.service';

const log = new Logger('Users');

@Component({
  selector: 'users',
  templateUrl: './users.html',
  styleUrls: ['./users.scss']
})
export class Users {

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
      deleteButtonContent: '<i class="ion-android-open"></i>',
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
      },
      enabled: {
        title: 'Status',
        type: 'string',
        valuePrepareFunction: (value) => { return value === true ? 'Active' : 'Inactive' }
      }
    }
  };

  source: LocalDataSource = new LocalDataSource();

  constructor(private router: Router,
    private route: ActivatedRoute,
    private service: UserService,
    private authService: AuthenticationService) {
      /*this.service.getData().then((data) => {
        this.source.load(data);
      });*/
       this.service.getUsers().subscribe((data) => {
        this.source.load(data);
      });
  }
  
  handleCreate() {
    this.router.navigate(['../createUser'], { relativeTo: this.route });
  }

  handleEdit( row: any ) {
    const user = row.data;
    this.router.navigate(['../editUser', user.userId], { relativeTo: this.route });
  }

  onDeleteConfirm(event: any): void {
    if (window.confirm('Are you sure you want to Activate/Deactivate User?')) {
      this.service.deleteUser(event.data.userId).subscribe(res => {
        debugger
        this.service.getUsers().subscribe((data) => {
          this.source.load(data);
        });
      })
      // event.confirm.resolve();
    } else {
      // event.confirm.reject();
    }
  }

}
