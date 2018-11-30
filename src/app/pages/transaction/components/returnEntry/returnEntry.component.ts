import {Component} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';

import { AuthenticationService } from '../../../../core/authentication/authentication.service';
import { Logger } from '../../../../core/logger.service';
import { ReturnEntryService } from './returnEntry.service';

const log = new Logger('Users');

@Component({
  selector: 'returnEntry',
  templateUrl: './returnEntry.html',
  styleUrls: ['./returnEntry.scss']
})
export class ReturnEntrys {

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
      /* id: {
        title: 'ID',
        type: 'number'
      }, */
      employee: {
        title: 'Employee',
        type: 'string'
      },
      lot: {
        title: 'LOT',
        type: 'string'
      },
      issueNo: {
        title: 'Issue No',
        type: 'string'
      },
      issueDate: {
        title: 'Issue Date',
        type: 'string'
      },
      returnDate: {
        title: 'Return Date',
        type: 'string'
      },
    }
  };

  source: LocalDataSource = new LocalDataSource();

  constructor(private router: Router,
    private route: ActivatedRoute,
    private service: ReturnEntryService,
    private authService: AuthenticationService) {
      this.service.getData().then((data) => {
        this.source.load(data);
      });
  }

  handleCreate() {
    this.router.navigate(['../createReturnEntry'], { relativeTo: this.route });
  }

  handleEdit( row: any ) {
    const returnEntry = row.data;
    this.router.navigate(['../editReturnEntry', returnEntry.employee], { relativeTo: this.route });
  }

  onDeleteConfirm(event: any): void {
    if (window.confirm('Are you sure you want to delete?')) {
      // event.confirm.resolve();
      this.service.getData().then((data) => {
        this.source.load(data);
      });
    } else {
      // event.confirm.reject();
    }
  }

}
