import { ExportRealisationService } from './../../exportRealisation.service';

import { LocalDataSource } from 'ng2-smart-table';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'export-realisation-modal',
  styleUrls: [('./exportRealisation-modal.component.scss')],
  templateUrl: './exportRealisation-modal.component.html'
})

export class ExportRealisationModal implements OnInit {

  @Output() emitService = new EventEmitter();

  source: LocalDataSource = new LocalDataSource();

  modalContent: string;
  modalHeader: string;
  settings: any;
 
  private data: any;

  constructor(private activeModal: NgbActiveModal, private service: ExportRealisationService) {
    debugger
 this.service.getImportPurchaseOrderByTypeAndStatus('completed&notdeleted&notdraft', 'N').subscribe((data) => {
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
      // pager: {
      //   display: true,
      //   perPage: 10
      // },
      columns: {
        party: {
          // editable: false,
          title: 'Party Name',
          // valuePrepareFunction: value => value.party.partyName,
        },
        poId: {
          // editable: false,
          title: 'Import Order No',
        },
        poDate: {
          title: 'Date',
        },
        orderAmount: {
          title: 'Net Amount',
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
