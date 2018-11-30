import { LocalDataSource } from 'ng2-smart-table';
import { Component, OnInit, ElementRef } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'paymentPreview-modal',
  styleUrls: [('./paymentPreview-modal.scss')],
  templateUrl: './paymentPreview-modal.html'
})

export class PaymentPreviewModal implements OnInit {

  settings: any;
  modalHeader: any;
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
        crDr: {
          title: 'Credit/Debit',
          valuePrepareFunction: value => {
            if (value == 'CR') {
              return 'Credit';
            } else if(value == 'DR') {
              return 'Debit';
            }
          }
        },
        account: {
          title: 'Account',
        },
        amount: {
          title: 'Amount',
        },
        paymentModeName: {
          title: 'Payment Mode',
        },
        bankBranchName: {
          title: 'Bank-Branch Name',
          type: 'text',
          valuePrepareFunction: value => {
            if (value) {
              return value;
            } else {
              return '-';
            }
          }
        },
        chequeNo: {
          title: 'Cheque No',
          valuePrepareFunction: value => {
            if (value) {
              return value;
            } else {
              return '-';
            }
          }
        },
        chequeDate: {
          title: 'Cheque Date',
          valuePrepareFunction: value => {
            if (value) {
              return value;
            } else {
              return '-';
            }
          }
        },
        narrationLine: {
          title: 'Comment/Narration',
          valuePrepareFunction: value => {
            if (value) {
              return value;
            } else {
              return '-';
            }
          }
        },
        exchRate: {
          title: 'Exchange Rate',
          valuePrepareFunction: value => {
            if (value) {
              return value;
            } else {
              return '-';
            }
          }
        },
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
