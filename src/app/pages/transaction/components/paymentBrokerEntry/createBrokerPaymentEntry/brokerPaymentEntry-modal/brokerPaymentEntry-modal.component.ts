import { BrokerPaymentEntryService } from '../../brokerPaymentEntry.service';
import { LocalDataSource } from 'ng2-smart-table';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'payment-entry-modal',
  templateUrl: './brokerPaymentEntry-modal.html',
  styleUrls: [('./brokerPaymentEntry-modal.scss')],
})
export class BrokerPaymentEntryModal implements OnInit {

  source: LocalDataSource = new LocalDataSource();
  @Output() emitService = new EventEmitter();

  modalHeader: string;
  settings: any;
  private invoiceData: any;

  invoiceType: string;
  brokerId: number;
  completedStatus: string = 'Y';
  brokerPaymentStatus: string = 'N';

  invoiceGeneration(invoiceType: string, brokerId: number) {

    this.brokerId = brokerId;
    this.invoiceType = invoiceType;

    if (invoiceType === 'LPI') {
      debugger;
      this.service.getLocalPurchaseInvoiceByBrokerIdAndBrokerPayment(this.completedStatus,
        this.brokerId, this.brokerPaymentStatus).subscribe((data) => {
          this.settings = this.prepareSettingForLocalPurchase();
          this.source.load(data);
        });
    } else if (invoiceType === 'IPI') {
      debugger;
      this.service.getImportPurchaseInvoiceByBrokerIdAndBrokerPayment(this.completedStatus,
        this.brokerId, this.brokerPaymentStatus).subscribe((data) => {
          this.settings = this.prepareSettingForImportPurchase();
          this.source.load(data);
        });
    } else if (invoiceType === 'LSI') {
      debugger;
      this.service.getLocalSalesInvoiceByBrokerIdAndBrokerPayment(this.completedStatus,
        this.brokerId, this.brokerPaymentStatus).subscribe((data) => {
          this.settings = this.prepareSettingForLocalSales();
          this.source.load(data);
        });
    } else if (invoiceType === 'ESI') {
      debugger;
      this.service.getExportSalesInvoiceByBrokerIdAndBrokerPayment(this.completedStatus,
        this.brokerId, this.brokerPaymentStatus).subscribe((data) => {
          this.settings = this.prepareSettingForExportSales();
          this.source.load(data);
        });
    }
  }

  constructor(private activeModal: NgbActiveModal, private service: BrokerPaymentEntryService) { }

  ngOnInit() { }

  prepareSettingForLocalSales() {
    return {
      actions: false,
      selectMode: 'single',
      pager: {
        display: true,
        perPage: 7,
      },
      columns: {
        locsaleId: {
          title: 'Invoice No',
          type: 'number'
        },
        invoiceDate: {
          title: 'Invoice Date',
          type: 'Date'
        },
        customerName: {
          title: 'Customer',
        },
        payableAmountBase: {
          title: 'Net Amount (INR)',
          type: 'number'
        },
        bDueDate: {
          title: 'Bank Due Date'
        },
        invExchRate: {
          title: 'Inv Exch Rate',
          type: 'number'
        },
        provisional: {
          title: 'Provisional',
          valuePrepareFunction: value => {
            return value ? 'YES' : 'NO';
          }
        },
        brokerageAmt: {
          title: 'Broker Amount(INR)',
          type: 'number'
        }
      }
    };
  }

  prepareSettingForExportSales() {
    return {
      actions: false,
      selectMode: 'single',
      pager: {
        display: true,
        perPage: 7,
      },
      columns: {
        expId: {
          title: 'Invoice No',
          type: 'number'
        },
        expDate: {
          title: 'Invoice Date',
          type: 'Date'
        },
        customerName: {
          title: 'Customer',
        },
        orderAmountBase: {
          title: 'Net Amount (INR)',
          type: 'number'
        },
        partyDueDate: {
          title: 'Party Due Date'
        },
        invExchRate: {
          title: 'Inv Exch Rate',
          type: 'number'
        },
        isDcReturn: {
          title: 'DC Status',
          valuePrepareFunction: value => {
            return value ? 'YES' : 'NO';
          }
        },
        brokerageRs: {
          title: 'Broker Amount(INR)'
        }
      }
    };
  }

  prepareSettingForLocalPurchase() {
    return {
      actions: false,
      selectMode: 'single',
      pager: {
        display: true,
        perPage: 7,
      },
      columns: {
        locPurId: {
          title: 'Invoice No',
        },
        locPurNo: {
          title: 'Pur Order No',
        },
        locPurDate: {
          title: 'Invoice Date',
        },
        party: {
          title: 'Party Name',
          valuePrepareFunction: value => {
            return value ? value.partyName : '-';
          }
        },
        netAmount: {
          title: 'Net Amount',
        },
        partyDueDate: {
          title: 'Party Due Date'
        },
        bankDueDate: {
          title: 'Bank Due Date'
        },
        provisional: {
          title: 'Provisional'
        },
        brokerAmount: {
          title: 'Broker Amount(INR)'
        }
      }
    };
  }

  prepareSettingForImportPurchase() {
    return {
      actions: false,
      selectMode: 'single',
      pager: {
        display: true,
        perPage: 7,
      },
      columns: {
        invoiceId: {
          title: 'Invoice No',
        },
        poNo: {
          title: 'Pur Order No',
        },
        invoiceDate: {
          title: 'Invoice Date',
        },
        supplier: {
          title: 'Supplier',
        },
        invExchRate: {
          title: 'Inv Exch Rate',
          type: 'number'
        },
        netAmount: {
          title: 'Net Amount',
        },
        paymentProcessStatus: {
          title: 'Payment Status',
        },
        bDueDate: {
          title: 'Bank Due Date'
        },
        brok: {
          title: 'Broker Amount(INR)'
        }
      }
    };
  }

  closeModal() {
    this.activeModal.close();
  }

  onUserRowSelect(event: any) {
    this.invoiceData = event.data;
    this.emitService.next(this.invoiceData);
    // window.alert("Your Choose: " +event.data.party.partyName);
    this.activeModal.close();
  }

}
