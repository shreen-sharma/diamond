import { PaymentEntryService } from './../../paymentEntry.service';
import { LocalDataSource } from 'ng2-smart-table';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'payment-entry-modal',
  styleUrls: [('./paymentEntry-modal.component.scss')],
  templateUrl: './paymentEntry-modal.component.html'
})

export class PaymentEntryModal implements OnInit {

  source: LocalDataSource = new LocalDataSource();
  @Output() emitService = new EventEmitter();

  modalContent: string;
  modalHeader: string;
  isExport: boolean;
  settings: any;
  private data: any;

  constructor(private activeModal: NgbActiveModal,
    private service: PaymentEntryService) {

    
      if(this.service.isExport) {
        this.service.getImportPurchaseInvoiceByCompletedAndPaymentStatus('Y', 'N').subscribe((data) => {
          data.forEach(res => {
           // res.party = res.party.partyName;
            const date: any[] = res.invoiceDate.split('-');
            res.invoiceDate = (date[2] + '-' + date[1] + '-' + date[0]);
          });
          this.settings = this.prepareSettingImport();
          this.source.load(data);
        });
      } else {
        this.service.getAllLocPurchaseInvoicesByCompletedAndPaymentStatus('Y', 'N').subscribe((data) => {
          data.forEach(res => {
            res.party = res.party.partyName;
            const date: any[] = res.locPurDate.split('-');
            res.locPurDate = (date[2] + '-' + date[1] + '-' + date[0]);
          });
          this.settings = this.prepareSetting();
          this.source.load(data);
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
        locPurNo: {
          title: 'Pur Order No',
        },
        locPurDate: {
          title: 'Date',
        },
        party: {
          title: 'Party Name',
        },
        netAmount: {
          title: 'Net Amount',
        },
        paymentProcessStatus: {
          title: 'Payment Status',
        },
        partyDueDate:{
          title: 'Party Due Date'
        },
        bankDueDate:{
          title: 'Bank Due Date'
        }
      }
    };
  }


  prepareSettingImport() {
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
        poNo: {
          title: 'Pur Order No',
        },
        invoiceDate: {
          title: 'Date',
        },
        supplier: {
          title: 'Supplier Name',
        },
        netAmount: {
          title: 'Net Amount',
        },
        paymentProcessStatus: {
          title: 'Payment Status',
        },
        sDueDate:{
          title: 'Supplier Due Date'
        },
        bDueDate:{
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
