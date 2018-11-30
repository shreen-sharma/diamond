import {Component} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';

import { AuthenticationService } from '../../../../core/authentication/authentication.service';
import { Logger } from '../../../../core/logger.service';
import { PaymentReceiptEntryService } from './paymentReceiptEntry.service';

const log = new Logger('PaymentReceiptEntry');

@Component({
  selector: 'paymentReceiptEntry',
  templateUrl: './paymentReceiptEntry.html',
  styleUrls: ['./paymentReceiptEntry.scss']
})
export class PaymentReceiptEntry {

  query = '';
  pageTitle = 'Payment and Receipt Entry';

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
      invoiceNo: {
        title: 'Invoice No.',
        type: 'string'
      },
      docNo: {
        title: 'Doc. No.',
        type: 'string'
      },
      docDate: {
        title: 'Doc. Date',
        type: 'string'
      },
      bank: {
        title: 'Bank/Cash',
        type: 'string'
      },
      bankName: {
        title: 'Bank Name',
        type: 'string'
      },
      chequeNo: {
        title: 'Cheque No.',
        type: 'string'
      },
      totalAmount: {
        title: 'Total Amount',
        type: 'number'
      },
    }
  };

  source: LocalDataSource = new LocalDataSource();

  constructor(private router: Router,
    private service: PaymentReceiptEntryService,
    private route: ActivatedRoute,
    private authService: AuthenticationService) {
    this.service.getData().then((data) => {
      this.source.load(data);
    });
  }

handleCreate() {
    this.router.navigate(['../createPaymentReceiptEntry'], { relativeTo: this.route });
  }

  handleEdit( row: any ) {
    const paymentReceiptEntry = row.data;
    this.router.navigate(['../editPaymentReceiptEntry', paymentReceiptEntry.id], { relativeTo: this.route });
  }

  onDeleteConfirm(event: any): void {
    if (window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }

}
