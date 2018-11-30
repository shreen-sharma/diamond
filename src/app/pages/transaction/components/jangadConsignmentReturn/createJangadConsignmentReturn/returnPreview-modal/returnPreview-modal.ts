import { LocalDataSource } from 'ng2-smart-table';
import { Component, OnInit, Output, ElementRef, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'returnPreview-modal',
  styleUrls: [('./returnPreview-modal.scss')],
  templateUrl: './returnPreview-modal.html'
})

export class ReturnPreviewModal implements OnInit {

  actionStatus: any;
  settings: any;
  showList: any[] = [];
  templist: any[] = [];
  successMessage: string;
  history: boolean;
  receiptDate: any;
  viewMode: boolean;
  modalHeader: string;
  
  @Output() emitService = new EventEmitter();

  ngOnInit() {
    if(this.history){
      this.actionStatus = !this.history;
    } else {
      this.actionStatus = {
        position: 'right',
        edit: false,
        delete: true,
      }
    }

    if(this.viewMode) {
      this.actionStatus = !this.viewMode;
    }

    this.settings = this.prepareSetting();
  }

  source: LocalDataSource = new LocalDataSource();

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
      hideSubHeader: 'true',
      actions: this.actionStatus,
      delete: {
        deleteButtonContent: '<i class="ion-trash-a"></i>',
        confirmDelete: true
      },
      pager: {
        display: true,
        perPage: 3
      },
      columns: {
        returnDate: {
          title: 'Return Date',                                    
          valuePrepareFunction: value => {
            if(!this.history) {
              return this.receiptDate;
            } else {
              return value; 
            }
          },
        },
        lotName: {
          title: 'Lot Name',
          type: 'text',
        },
        itemName: {
          title: 'Item Name',
          type: 'text',
        },
        totalCarats: {
          title: 'Issued Cts',
        },
        dcRate: {
          title: 'DC Rate',
        },
        selectedCts: {
          title: 'Selected Cts',
        },
        selectedPcs: {
          title: 'Selected Pcs',
        },
        agreedRate: {
          title: 'Agreed Rate',
        },
        rejectedCts: {
          title: 'Rejected Cts',
        },
        rejectedPcs: {
          title: 'Rejected Pcs',
        },
        negoIssueName: {
          title: 'Nego. Comment',
          valuePrepareFunction: value => {
            if(value == '' || value == null) {
              return '-';
            } else {
              return value;
            }
          }
        },
        remarks: {
          title: 'Remarks',
          valuePrepareFunction: value => {
            if(value == '' || value == null) {
              return '-';
            } else {
              return value;
            }
          }
        }
      }
    };
  }

  onDeleteConfirm(event: any) {

    if (window.confirm('Are you sure you want to delete?')) {
      const itemIndex = this.showList.findIndex(item => {
        if (event.data.lotItemId == item.lotItemId) {
          return true;
        }
      });

      this.showList.splice(itemIndex, 1);
      this.source.load(this.showList);
      this.successMessage = 'Item Deleted Succesfully!';
      setTimeout(() => this.successMessage = null, 1000);
      event.confirm.resolve();
      this.templist = [];
      this.templist.push(true, this.showList, event.data);
      this.emitService.next(this.templist);
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
