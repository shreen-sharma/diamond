import { PurchaseInvoiceService } from './../../purchaseInvoice.service';
import { LocalDataSource } from 'ng2-smart-table';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'purchase-invoice-modal',
  styleUrls: [('./purchaseInvoice-modal.component.scss')],
  templateUrl: './purchaseInvoice-modal.component.html'
})

export class PurchaseInvoiceModal implements OnInit {

  private data: any;
  @Output() emitService = new EventEmitter();

  modalContent: string;
  settings: any;
  modalHeader: any;

  constructor(private activeModal: NgbActiveModal,
    private service: PurchaseInvoiceService) {

    this.service.getAllPurchaseOrdersByTypeAndStatus('completed&notdeleted&notdraft', 'N').subscribe((data) => {
      data.forEach(res => {
        res.party = res.party.partyName;
      });
      this.source.load(data);   
    });
  }

  ngOnInit() {
    this.settings = this.prepareSetting();
  }

  prepareSetting() {
    return {
      hideSubHeader: false,
      actions: false,
      // actions: {
      //   position: 'right',
      //   edit: false,
      //   delete: false
      // },

      edit: {
        editButtonContent: '<i class="ion-edit"></i>',
        saveButtonContent: '<i class="ion-checkmark"></i>',
        cancelButtonContent: '<i class="ion-close"></i>',
        confirmSave: true,
      },
      delete: {
        deleteButtonContent: '<i class="ion-trash-a"></i>',
        confirmDelete: true
      },
      pager: {
        display: true,
        perPage: 7,
      },
      selectMode: 'single',
      columns: {
        party: {
          title: 'Party Name',
          // valuePrepareFunction: value => value.partyName,
        },
        poNo: {
          title: 'Purchase Order No',
        },
        poDate: {
          title: 'Date',
        },
        netAmount: {
          title: 'Net Amount',
        }
      }
    };
  }

  source: LocalDataSource = new LocalDataSource();

  closeModal() {
    this.activeModal.close();
  }

  onUserRowSelect(event: any){
   this.data = event.data;
    this.emitService.next(this.data)
    // window.alert("Your Choose: " +event.data.party.partyName);
    this.activeModal.close();
  }
}
