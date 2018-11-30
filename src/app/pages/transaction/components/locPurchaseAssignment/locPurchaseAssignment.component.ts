import {Component} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';

import { AuthenticationService } from '../../../../core/authentication/authentication.service';
import { Logger } from '../../../../core/logger.service';
import { LocPurchaseAssignmentService } from './locPurchaseAssignment.service';

const log = new Logger('LocPurchaseAssignment');

@Component({
  selector: 'locPurchaseAssignment',
  templateUrl: './locPurchaseAssignment.html',
  styleUrls: ['./locPurchaseAssignment.scss']
})
export class LocPurchaseAssignment {

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
      selectCategory: {
        title: 'Select Category',
        type: 'string'
      },
      selectSupplier: {
        title: 'Select Supplier',
        type: 'string'
      },
      assignFrom: {
        title: 'Assign From',
        type: 'string'
      },
      assignmentDate: {
        title: 'Assignment Date',
        type: 'string'
      },
      selectLot: {
        title: 'Select Lot',
        type: 'string'
      },
      selectItem: {
        title: 'Select Item',
        type: 'string'
      },
      totalCarats: {
        title: 'Total Carats',
        type: 'number'
      },
      avgRate: {
        title: 'Avg. Rate',
        type: 'number'
      },
    }
  };

  source: LocalDataSource = new LocalDataSource();

  constructor(private router: Router,
    private service: LocPurchaseAssignmentService,
    private route: ActivatedRoute,
    private authService: AuthenticationService) {
    this.service.getData().then((data) => {
      this.source.load(data);
    });
  }

  handleCreate() {
    this.router.navigate(['../createLocPurchaseAssignment'], { relativeTo: this.route });
  }

  handleEdit( row: any ) {
    const locPurchaseAssignment = row.data;
    this.router.navigate(['../editLocPurchaseAssignment', locPurchaseAssignment.id], { relativeTo: this.route });
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
