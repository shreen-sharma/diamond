import { ExportInvoiceService } from '../../exportInvoice.service';
import { LocalDataSource } from 'ng2-smart-table';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'export-sale-modal',
  styleUrls: [('./exportSale-modal.scss')],
  templateUrl: './exportSale-modal.html'
})

export class ExportSaleModal implements OnInit {

  private data: any;
  @Output() emitService = new EventEmitter();

  modalContent: string;
  modalHeader: string;
  settings: any;

  constructor(private activeModal: NgbActiveModal, 
    private service: ExportInvoiceService) {

    this.service.getAllExportOrdersByTypeAndStatus('completed&notdeleted&notdraft', 'N').subscribe((data) => {
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
      selectMode: 'single',
      pager: {
        display: true,
        perPage: 7
      },
      columns: {
        party: {
          title: 'Customer Name',
          // valuePrepareFunction: value => value.partyName,
        },
        soNo: {
          title: 'Export Sales Order No',
        },
        soDate: {
          title: 'Sales Date',
        },
        netAmount: {
          title: 'Total Amount',
        },
      }
    };
  }

  source: LocalDataSource = new LocalDataSource();

  closeModal() {
    this.activeModal.close();
  }

  onUserRowSelect(event: any){
   this.data = event.data;
    this.emitService.next(this.data);
    // window.alert("Your Choose: " +event.data.party.partyName);
    this.activeModal.close();
  }
}
