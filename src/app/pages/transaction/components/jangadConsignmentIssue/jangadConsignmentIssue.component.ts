import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { CommonModalComponent } from '../../../../shared/common-modal/common-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { AuthenticationService } from '../../../../core/authentication/authentication.service';
import { Logger } from '../../../../core/logger.service';
import { JangadConsignmentIssueService } from './jangadConsignmentIssue.service';
import { ItemDetailsService } from '.../../app/pages/masters/components/itemDetails/itemDetails.service';
import { LotItemCreationService } from 'app/pages/stockManagement/components/lotItemCreation/lotItemCreation.service';
import { LotService } from '.../../app/pages/stockManagement/components/lots/lot.service';
import { CategoryService } from '.../../app/pages/masters/components/categories/category.service';
import { DefaultNumberComponent } from './../../../../shared/defaultNumberComponent/defaultNumber.components';
// import { ProDetailService } from '.../../app/pages/masters/components/processDetails/proDetails.service';
import { PartyDetailsService } from '.../../app/pages/company/components/partyDetails/partyDetails.service';
// import { PartyAccountService } from '.../../app/pages/company/components/partyAccount/partyAccount.service';

const log = new Logger('jangadConsignmentIssue');

@Component({
  selector: 'jangadConsignmentIssue',
  templateUrl: './jangadConsignmentIssue.html',
  styleUrls: ['./jangadConsignmentIssue.scss']
})
export class JangadConsignmentIssue {

  query = '';
  openingStockIssue: boolean = false;
  source: LocalDataSource = new LocalDataSource();
  settings: any;
  accessList: any[] = [];
  public isEdit: boolean;
  loading: boolean = false;
  prepareSettings() {
    return {
      actions: {
        position: 'right',
        add: this.accessList.includes("ADD"),
        edit: this.isEdit,
        delete: this.accessList.includes("DELETE"),
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
        issueId: {
          title: 'Issue No',
          type: 'string',
        },
        partyId: {
          title: 'Party Name',
          type: 'string',
          // valuePrepareFunction: value => value.partyName,
        },
        processTypeId: {
          title: 'Process Name',
          type: 'string',
          // valuePrepareFunction: value => value.processName,
        },
        issueDate: {
          title: 'Issue Date',
          type: 'string',
        },
        totalCarets: {
          title: 'Issued Carats',
          type: 'string',
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
        provisional: {
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
        status: {
          title: 'Status',
          type: 'string',  
        },
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
    private service: JangadConsignmentIssueService,
    private route: ActivatedRoute,
    private lotService: LotService,
    private modalService: NgbModal,   
    // private proService: ProDetailService,
    private partyService: PartyDetailsService,
    // private partAccService: PartyAccountService,
    private authService: AuthenticationService) {
      this.loading = true;
      this.accessList = this.authService.getUserAccessOfMenu('deliveryChallanIssue');
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

      if (this.router.url.includes('openingDCIssue')) {
        this.openingStockIssue = true;
        this.service.getAllOpeningStockIssue().subscribe((dta) => {
          dta.forEach(res => {
            res.partyId = res.partyId.partyName;
            res.processTypeId = res.processTypeId.processName;
          });
          this.settings = this.prepareSettings();
        this.source.load(dta);
        this.loading = false;
        });
      } else {
        this.service.getAllConsignmentIssue().subscribe((dta) => {
          dta.forEach(res => {
            res.partyId = res.partyId.partyName;
            res.processTypeId = res.processTypeId.processName;
          });
          this.settings = this.prepareSettings();
        this.source.load(dta);
        this.loading = false;
        });
      }
    }

  handleCreate() {
    if (this.openingStockIssue) {
      this.router.navigate(['../createOpeningDCIssue'], { relativeTo: this.route });
    } else {
      this.router.navigate(['../createDeliveryChallanIssue'], { relativeTo: this.route });
    }
  }

  handleEdit( row: any ) {
    let view = this.accessList.includes("GET");
    let edit = this.accessList.includes("UPDATE");
    if (view == true && edit == true) {
      view = false;
    } else if (view == false && edit == true) {
      view = false;
    }
    if(this.openingStockIssue) {
      const jangadConsignmentIssue = row.data;
      this.router.navigate(['../viewOpeningDCIssue', jangadConsignmentIssue.issueId, jangadConsignmentIssue.status], { relativeTo: this.route });
    } else {
      if (row.data.status == "CLOSED" || row.data.status == "IN_PROCESS"  || view == true){
        const jangadConsignmentIssue = row.data;
        this.router.navigate(['../viewDeliveryChallanIssue/' + view + '/' + jangadConsignmentIssue.issueId, jangadConsignmentIssue.status], { relativeTo: this.route });
      } else if(edit == true && view == false) {
        const jangadConsignmentIssue = row.data;
        this.router.navigate(['../editDeliveryChallanIssue/' + view + '/' + jangadConsignmentIssue.issueId], { relativeTo: this.route });
      }
    }
  }

  onDeleteConfirm(event: any): void {
    if (event.data.status == "CLOSED"){
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = false;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Cannot delete Closed Issue!';
    } else if (event.data.status == "IN_PROCESS"){
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = false;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Cannot delete Issue Entry whose Return is in Process!';
    } else {
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = true;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Are you sure you want to delete!';
      activeModal.result.then ((res) => {
      // console.log(res == 'Y');
        if (res == 'Y') {
          this.service.deleteConsignmentIssue(event.data.issueId).subscribe( response => {
            // event.confirm.resolve();

            if (this.openingStockIssue) {
              this.service.getAllOpeningStockIssue().subscribe((data) => {
                data.forEach(res => {
                  res.partyId = res.partyId.partyName;
                  res.processTypeId = res.processTypeId.processName;
                });
                this.settings = this.prepareSettings();
              this.source.load(data);
              this.loading = false;
              });
            } else {
              this.service.getAllConsignmentIssue().subscribe((data) => {
                data.forEach(res => {
                  res.partyId = res.partyId.partyName;
                  res.processTypeId = res.processTypeId.processName;
                });
                this.settings = this.prepareSettings();
                this.source.load(data);
                this.loading = false;
              });
            }
           
          });
        } else if (res == 'N') {
        
        }
      });
    } 
  }

}
