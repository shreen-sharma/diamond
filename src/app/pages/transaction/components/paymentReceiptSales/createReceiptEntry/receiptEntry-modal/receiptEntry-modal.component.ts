import { ReceiptEntryService } from './../../receiptEntry.service';
import { LocalDataSource } from 'ng2-smart-table';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'receipt-entry-modal',
  styleUrls: [('./receiptEntry-modal.component.scss')],
  templateUrl: './receiptEntry-modal.component.html'
})

export class ReceiptEntryModal implements OnInit {

  source: LocalDataSource = new LocalDataSource();
  @Output() emitService = new EventEmitter();

  modalContent: string;
  modalHeader:string;
  settings: any;
  private data: any;

  constructor(private activeModal: NgbActiveModal,
    private service: ReceiptEntryService) {

    if (this.service.isExport) {

      this.service.getExportSalesInvoiceByCompletedAndPaymentStatus('Y', 'N').subscribe((data) => {
        this.source.load(data);
        this.settings = this.prepareSettingExport();
      });
    } else {

      this.service.getAllLocSalesInvoicesByCompletedAndPaymentStatus('Y', 'N').subscribe((data) => {
      for(var i=0;i<data.length;i++){
        if(data[i].soNo=='null'){
          data[i].soNo='';
        }
      }
        this.source.load(data);
        this.settings = this.prepareSetting();
      });
    }
  }

  ngOnInit() {

  }

  prepareSetting() {
    return {
      actions: false,
      selectMode: 'single',
      pager: {
        display: true,
        perPage: 7,
      },
      columns: {
        invoiceNo: {
          title: 'Invoice No',
        },
        soNo: {
          title: 'Sales Order No/ DC Ret. No',
          valuePrepareFunction: value => {
            if (value) {
              return value;
            } else if(value==null) {
              return '';
            } else {
              return '-';
            }

          }
        },
        invoiceDate: {
          title: 'Date',
        },
        customer: {
          title: 'Party Name',
        },
        payableAmountBase: {
          title: 'Payable/Net Amount',
        },
        paymentProcessStatus: {
          title: 'Payment Status',
        },
        partyDueDate: {
          title: 'Party Due Date'
        },
        bankDueDate: {
          title: 'Bank Due Date'
        }
      }
    };
  }

  prepareSettingExport() {
    return {
      actions: false,
      selectMode: 'single',
      pager: {
        display: true,
        perPage: 7,
      },
      columns: {
        expNo: {
          title: 'Invoice No',
        },
        ordNo: {
          title: 'Sales Order No/ DC Ret. No',
          valuePrepareFunction: value => {
            if (value) {
              return value;
            } else if(value==null) {
              return '';
            } else {
              return '-';
            }
          }
        },
        expDate: {
          title: 'Date',
        },
        customerName: {
          title: 'Party Name',
        },
        fobAmount: {
          title: 'Payable/Net Amount',
        },
        paymentStatus: {
          title: 'Payment Status',
        },
        partyDueDate: {
          title: 'Party Due Date'
        },
        bankDueDate: {
          title: 'Bank Due Date'
        }
      }
    };
  }

  closeModal() {
    this.activeModal.close();
  }

  onUserRowSelect(event: any) {
    this.data = event.data;
    this.emitService.next(this.data)
    // window.alert("Your Choose: " +event.data.party.partyName);
    this.activeModal.close();
  }
}
