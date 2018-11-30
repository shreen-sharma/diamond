import {Component} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';

import { AuthenticationService } from '../../../../core/authentication/authentication.service';
import { Logger } from '../../../../core/logger.service';
import { CompanyLotAllotmentsService } from './companyLotAllotments.service';

const log = new Logger('companyLotAllotment');

@Component({
  selector: 'companyLotAllotment',
  templateUrl: './companyLotAllotment.html',
  styleUrls: ['./companyLotAllotment.scss']
})
export class CompanyLotAllotment {

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
      selectedCompany: {
        title: 'Selected Company',
        type: 'string'
      },
      lotAllotmentDate: {
        title: 'Lot Allotment Date',
        type: 'string'
      },
      availableLot: {
        title: 'Available Lot Under Selected Company',
        type: 'string'
      },
    }
  };

  source: LocalDataSource = new LocalDataSource();

  constructor(private router: Router,
    private service: CompanyLotAllotmentsService,
    private route: ActivatedRoute,
    private authService: AuthenticationService) {
    this.service.getData().then((data) => {
      this.source.load(data);
    });
  }

  handleCreate() {
    this.router.navigate(['../createCompanyLotAllotment'], { relativeTo: this.route });
  }

  handleEdit( row: any ) {
    const companyLotAllotment = row.data;
    this.router.navigate(['../editCompanyLotAllotment', companyLotAllotment.id], { relativeTo: this.route });
  }

  onDeleteConfirm(event: any): void {
    if (window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }

}
