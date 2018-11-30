import { Component, Injectable, OnInit, ElementRef, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { LocalDataSource } from 'ng2-smart-table';


@Component({
  selector: 'add-service-modal',
  styleUrls: [('./physicalStock-modal.component.scss')],
  templateUrl: './physicalStock-modal.component.html'
})

export class PhysicalStockModalOpen implements OnInit {

  modalHeader: string;
  aList: any[] = [];
  bList: any[] =[];
  settings: any;
  successMessage: string;  

  @Output() emitService = new EventEmitter();

  ngOnInit() {
    this.settings = this.prepareSetting();
  }

  prepareSetting() {
    return {
      hideSubHeader: 'true',
      actions: {
        position: 'right',
        edit: false,
        delete: true,
      },      
      delete: {
        deleteButtonContent: '<i class="ion-trash-a"></i>',
        confirmDelete: true
      },
      pager: {
        display: true,
        perPage: 5
      },
      columns: {
        lotName: {
          title: 'Lot Name',
          type: 'string',
        },
        itemName: {
          title: 'Item Name',
          type: 'string',
        },
        adjustedCarats: {
          title: 'Adjusted Carats',
          type: 'string',
        },
        adjustedRate: {
          title: 'Adjusted Rate',
          type: 'string',
        },
        remarks: {
          title: 'Remarks',
          type: 'string',
        },
      }
    };
  }
  source: LocalDataSource = new LocalDataSource();
  constructor(private activeModal: NgbActiveModal,
    private ele: ElementRef) {
      this.ele.nativeElement.style.width = '900px';       
  }
  onDeleteConfirm(event: any) {
    if (window.confirm('Are you sure you want to delete?')) {
      const itemIndex = this.aList.findIndex(item => {
      if (event.data.lotItemId == item.lotItemId) {
        return true;
      }
    });
    this.aList.splice(itemIndex, 1);
    this.source.load(this.aList);
    this.successMessage = 'Adjusted Item Deleted Succesfully!';
    setTimeout(() => this.successMessage = null, 1000);
    event.confirm.resolve();
    this.bList = [];
    this.bList.push(true, this.aList, event.data);
    this.emitService.next(this.bList);
  } else {
    event.confirm.reject();
  }
}

  closeModal() {
    this.activeModal.close();
  }
  okModal() {
    this.activeModal.close();
  }
}
