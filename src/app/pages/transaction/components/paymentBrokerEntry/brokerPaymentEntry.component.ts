import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { AuthenticationService } from '../../../../core/authentication/authentication.service';
import { BrokerPaymentEntryService } from './brokerPaymentEntry.service';

@Component({
  selector: 'brokerPaymentEntry',
  templateUrl: './brokerPaymentEntry.html',
  styleUrls: ['./brokerPaymentEntry.scss']
})
export class BrokerPaymentEntryComponent {

  pageTitle = 'Broker Payment';
  source: LocalDataSource = new LocalDataSource();
  accessList: any[] = [];
  public isEdit = false;
  settings: any;

  prepareSettings() {
    return {
      actions: {
        position: 'right',
        add: this.accessList.includes("ADD"),
        edit: this.isEdit,
        delete: false
      },
      mode: 'external',
      add: {
        addButtonContent: '<i class="ion-ios-plus-outline"></i>'
      },
      edit: {
        editButtonContent: '<i class="ion-edit"></i>'
      },
      pager: {
        display: true,
        perPage: 7
      },
      columns: {
        brokerPaymentId: {
          title: 'Payment Id',
          type: 'number'
        },
        invoiceId: {
          title: 'Invoice Id',
          type: 'number'
        },
        invoiceType: {
          title: 'Invoice Type'
        },
        brokerName: {
          title: 'Broker'
        },
        partyName: {
          title: 'Party'
        },
        paymentStatus: {
          title: 'Payment Status',
          valuePrepareFunction: paymentStatus => {
            return paymentStatus == 'Y' ? "COMPLETED" : "NOT_COMPLETED";
          }
        },
        totalAmount: {
          title: 'Total Amount',
          type: 'number'
        },
        currentPaidAmount: {
          title: 'Paid Amount',
          type: 'number'
        },
        totalPaidAmount: {
          title: 'Total Paid Amount',
          type: 'number'
        },
        outStandingAmount: {
          title: 'OutStanding Amount',
          type: 'number'
        },
        provisional: {
          title: 'Provisinal',
          valuePrepareFunction: value => {
            return value ? 'Y' : 'N';
          }
        }
      }
    }
  };

  constructor(private router: Router,
    private route: ActivatedRoute,
    private service: BrokerPaymentEntryService,
    private authService: AuthenticationService) {
    this.accessList = this.authService.getUserAccessOfMenu('brokerPayment');
    const edit = this.accessList.includes("UPDATE");
    const view = this.accessList.includes("GET");

    this.isEdit = edit || view;

    this.settings = this.prepareSettings();

    this.service.getAllBrokerPayment().subscribe(data => {
      this.source.load(data);
    });
  }

  handleCreate() {
    this.router.navigate(['../createBrokerPaymentEntry'], { relativeTo: this.route });
  }

  handleEdit(row: any) {
    const brokerPaymentEntry = row.data;
    this.router.navigate(['../viewBrokerPaymentEntry', brokerPaymentEntry.brokerPaymentId], { relativeTo: this.route });
  }

}
