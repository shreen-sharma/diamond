import { LocalDataSource } from 'ng2-smart-table';
import { Component, OnInit, ElementRef } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'paymentPreview-modal',
  styleUrls: [('./brokerPaymentPreview-modal.scss')],
  templateUrl: './brokerPaymentPreview-modal.html'
})
export class BrokerPaymentPreviewModal implements OnInit {

  settings: any;
  InvoiceType: string;
  invoiceNo: string;
  source: LocalDataSource = new LocalDataSource();

  ngOnInit() {
    this.settings = this.prepareSetting();
  }

  constructor(private activeModal: NgbActiveModal,
    private ele: ElementRef) {
    this.ele.nativeElement.style.width = '1200px';
    this.ele.nativeElement.style.position = 'fixed';
    this.ele.nativeElement.style.top = '-28px';
    this.ele.nativeElement.style.right = 0;
    this.ele.nativeElement.style.bottom = 0;
    this.ele.nativeElement.style.left = '-12em';
  }

  prepareSetting() {
    return {
      hideSubHeader: true,
      actions: false,
      pager: {
        display: true,
        perPage: 5,
      },
      columns: {
        crOrDb: {
          title: 'Credit/Debit',
          valuePrepareFunction: value => {
            return value === 'DR' ? 'Debit' : 'Credit';
          }
        },
        accountNo: {
          title: 'Account No'
        },
        paymentModeName: {
          title: 'Payment Mode'
        },
        bankBranchName: {
          title: 'Bank Branch Name',
          valuePrepareFunction: value => {
            return value ? value : '-';
          }
        },
        paidAmount: {
          title: 'Paid Amount',
        },
        narration: {
          title: 'Narration',
          valuePrepareFunction: value => {
            return value ? value : '-';
          }
        },
        chequeNo: {
          title: 'Cheque No',
          valuePrepareFunction: value => {
            return value ? value : '-';
          }
        },
        chequeDate: {
          title: 'Cheque Date',
          valuePrepareFunction: value => {
            return value ? value : '-';
          }
        }
      }
    };
  }

  closeModal() {
    this.activeModal.close();
  }

  okModal() {
    this.activeModal.close();
  }
}
