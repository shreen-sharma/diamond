import {Component} from '@angular/core';
import { Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';

import { AuthenticationService } from '../../../../core/authentication/authentication.service';
import { Logger } from '../../../../core/logger.service';
import { CompanyStockService } from './companyStock.service';

const log = new Logger('employee');

@Component({
  selector: 'companyStock',
  templateUrl: './companyStock.html',
  styleUrls: ['./companyStock.scss']
})
export class CompanyStockComponent {

  query = '';
  pageTitle = 'Company Stock(Item)';

  settings = {
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
      selectDivision: {
        title: 'Selected Division,Location,Department & Sub-Department',
        type: 'string'
      },
      selectEmployee: {
        title: 'Select Employee',
        type: 'string'
      },
      selectProcess: {
        title: 'Select Process',
        type: 'string'
      },
      selectLot: {
        title: 'select Lot',
        type: 'string'
      },
       issueDate: {
        title: 'Issue Date',
        type: 'Date'
      },
       issueNumber: {
        title: 'Issue Number',
        type: 'Number'
      },
      totalIssueCarat: {
        title: 'Total Issue Carat :',
        type: 'Number'
      },
      remark: {
        title: 'Remark:',
        type: 'string'
      },
      selectItem: {
        title: 'Select Item:',
        type: 'string'
      },
      issuedPiece: {
        title: 'Issued Piece:',
        type: 'string'
      },
      issuedCarats: {
        title: 'Issued Carats:',
        type: 'Number'
      },
      avliableItems: {
        title: 'Avliable Items:',
        type: 'string'
      },
    }
  };

  source: LocalDataSource = new LocalDataSource();

  constructor(private router: Router, private service: CompanyStockService,
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

  submit() {
    
  }

}
