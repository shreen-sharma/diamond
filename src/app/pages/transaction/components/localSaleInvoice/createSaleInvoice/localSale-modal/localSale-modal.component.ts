import { LocalSaleService } from '../../localSaleInvoice.service';
import { LocalDataSource } from 'ng2-smart-table';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'local-sale-modal',
  styleUrls: [('./localSale-modal.component.scss')],
  templateUrl: './localSale-modal.component.html'
})

export class LocalSaleModal implements OnInit {

  private data: any;
  @Output() emitService = new EventEmitter();

  modalContent: string;
  settings: any;
  // modalHeader: string;
  // modalContent: string = `Lorem ipsum dolor sit amet,
  //  consectetuer adipiscing elit, sed diam nonummy
  //  nibh euismod tincidunt ut laoreet dolore magna aliquam
  //  erat volutpat. Ut wisi enim ad minim veniam, quis
  //  nostrud exerci tation ullamcorper suscipit lobortis
  //  nisl ut aliquip ex ea commodo consequat.`;

  constructor(private activeModal: NgbActiveModal, private service: LocalSaleService) {

    this.service.getAllSalesOrdersByTypeAndStatus('completed&notdeleted', 'N').subscribe((data) => {
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
        perPage: 6
      },
      columns: {
        party: {
          // editable: false,
          title: 'Party Name',
          // valuePrepareFunction: value => value.partyName,
        },
        soNo: {
          // editable: false,
          title: 'Sales Order No',
        },
        soDate: {
          title: 'Date',
        },
        netAmount: {
          title: 'Total Amount',
          type: 'Number'
        },
      }
    };
  }
  source: LocalDataSource = new LocalDataSource();

  closeModal() {
    this.activeModal.close();
  }

  onUserRowSelect(event: any){
    debugger;
   this.data = event.data;
    this.emitService.next(this.data);
   // window.alert("Your Choose: " +event.data.party.partyName);
    this.activeModal.close();
  }
  okModal() {
    this.activeModal.close();
  }
}
