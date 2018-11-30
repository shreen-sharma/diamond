import {Component} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModalComponent } from '../../../../shared/common-modal/common-modal.component';
import { AuthenticationService } from '../../../../core/authentication/authentication.service';
import { Logger } from '../../../../core/logger.service';
import { JangadConsignmentReturnService } from './jangadConsignmentReturn.service';

const log = new Logger('jangadConsignmentReturn');

@Component({
  selector: 'jangadConsignmentReturn',
  templateUrl: './jangadConsignmentReturn.html',
  styleUrls: ['./jangadConsignmentReturn.scss']
})

export class JangadConsignmentReturn {

    query = '';
    source: LocalDataSource = new LocalDataSource();
    settings: any;
    accessList: any[] = [];
    public isEdit: boolean;
    loading: boolean = false;
    prepareSetting() {
      return {
        actions: {
          position: 'right',
          add: this.accessList.includes("ADD"),
          edit: this.isEdit,
          delete: false
        },
        mode: 'external',
        add: {
          addButtonContent: '<i class="ion-ios-plus-outline"></i>',
          createButtonContent: '<i class="ion-checkmark"></i>',
          cancelButtonContent: '<i class="ion-close"></i>',
          confirmCreate: true,
        },
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
        columns: {
          returnId: {
            title: 'Return No.',
            type: 'number'
          },
          returnIssueRefNo: {
            title: 'Return Issue Ref No.',
          },
          partyName: {
            title: 'Party',
            type: 'string'
          },
          issueNo: {
            title: 'Issue No.',
            type: 'number'
          },
          receiptDate: {
            title: 'Receipt Date',
            valuePrepareFunction: value => {
              if(value) {
                const date: any[] = value.split('-');
                const newDate = (date[2] + '-' + date[1] +'-' + date[0]);
                return newDate;
              }
            },
          },
          isConsignment: {
            title: 'Consignment',
            filter: {
              type: 'list',
              config: {
                selectText: 'All',
                list: [{ value: true, title: 'Yes' }, { value: false, title: 'No' }],
              },
            },
            valuePrepareFunction: value => this.getpartyStatusById(value)
            },
          totalIssuedCarats:{
            title:'Issued Carats',
            type: 'number'
          },
          totalSelectedCarats:{
            title:'Selected Carats',
            type: 'number'
          },
          rejectedCts:{
            title:'Rejected Carats',
            type: 'number'
          },
          status: {
            title: 'Provisional',
            filter: {
              type: 'list',
              config: {
                selectText: 'All',
                list: [{ value: true, title: 'Yes' }, { value: false, title: 'No' }],
              },
            },
            valuePrepareFunction: value => this.getpartyStatusById(value)
          },
          closeDC: {
            title: 'DC Status',
            valuePrepareFunction: (value, row) => {
              if(value && row.bookSale) {
                return 'CLOSED & BOOKED';
              } else if(value && !row.bookSale) {
                return 'CLOSED';
              } else if(!value && row.bookSale) {
                return 'NOT_CLOSED & BOOKED';
              } else {
                return 'NOT_CLOSED';
              }
            },
          }
        }
      }
    };

    getpartyStatusById(value: any) {
      let title = '';
      if (value === true) {
        title = 'Yes'
      } else if (value === false) {
        title = 'No';
      }
      return title;
    }

    constructor(private router: Router,
      private service: JangadConsignmentReturnService,
      private modalService: NgbModal,
      private route: ActivatedRoute,
      private authService: AuthenticationService) {
        this.loading = true;
        this.accessList = this.authService.getUserAccessOfMenu('deliveryChallanReturn');
      const edit = this.accessList.includes("UPDATE");
      const view = this.accessList.includes("GET");
      debugger
      if (edit == true) {
        this.isEdit = true;
      } else if (view == true) {
        this.isEdit = true;
      } else {
        this.isEdit = false;
      }
        this.settings = this.prepareSetting();
        this.service.getAllJangadCNReturn().subscribe((data) => {
          this.source.load(data);
          this.loading = false;
        });
    }

  handleCreate() {
      this.router.navigate(['../createDeliveryChallanReturn'], { relativeTo: this.route });
    }

  handleEdit( row: any ) {
    const jangadCNReturn = row.data;
    this.router.navigate(['../editDeliveryChallanReturn', jangadCNReturn.returnId], { relativeTo: this.route });
  }

  // onDeleteConfirm(event: any): void {
  //   const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
  //   activeModal.componentInstance.showHide = true;
  //   activeModal.componentInstance.modalHeader = 'Alert';
  //   activeModal.componentInstance.modalContent = 'Are you sure you want to delete!';
  //   activeModal.result.then ((res) => {
  //     if (res == 'Y') {

  //     this.service.deleteJangadCNReturn(event.data.returnId).subscribe( data => {
  //       this.service.getAllJangadCNReturn().subscribe( value => {
  //         this.source.load(value);
  //       });
  //     });
  //   };
  //   });
  // }

}
