import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { CommonModalComponent } from '../../../../shared/common-modal/common-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { AuthenticationService } from '../../../../core/authentication/authentication.service';
import { Logger } from '../../../../core/logger.service';
import { ExportSalesOrderService } from './exportSalesOrder.service';
import { PartyDetailsService } from '.../../app/pages/company/components/partyDetails/partyDetails.service';

const log = new Logger('ExportSalesOrder');

@Component({
  selector: 'exportSalesOrder',
  templateUrl: './exportSalesOrder.html',
  styleUrls: ['./exportSalesOrder.scss']
})
export class ExportSalesOrder {

  query = '';
  successMessage: String;
  status: boolean;
  action: boolean = true;
  accessList: any[] = [];
  public isEdit: boolean;
  settings: any;
  loading: boolean = false;
  source: LocalDataSource = new LocalDataSource();

  preapreSettings() {
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
          confirmCreate: true
        },
        edit: {
          editButtonContent: '<i class="ion-edit"></i>',
          saveButtonContent: '<i class="ion-checkmark"></i>',
          cancelButtonContent: '<i class="ion-close"></i>',
          confirmSave: true
        },
        delete: {
          deleteButtonContent: '<i class="ion-trash-a"></i>',
          confirmDelete: true
        },
        columns: {
          soNo: {
            title: 'Sales Order No',
            type: 'string'
          },
          soDate: {
            title: 'Order Date',
            type: 'string'
          },
          party: {
            title: 'Customer/Associates',
            type: 'string',
            // valuePrepareFunction: value => value.partyName,
          },
          netAmount: {
            title: 'Total Amount',
            type: 'string'
          },
          status: {
            title: 'Status',
            type: 'string'
          },
          advReal: {
            title: 'Adv. Realisation',
            type: 'string'
          },
        }
    }
  };

 constructor(private router: Router,
    private service: ExportSalesOrderService,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private partyService: PartyDetailsService,
    private authService: AuthenticationService) {
      this.loading = true;
      this.accessList = this.authService.getUserAccessOfMenu('exportSalesOrder');
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
      this.service.getOpeningStockStatus().subscribe(res => {
        debugger
       if(res.object == false){
         this.status = res.object;
         this.successMessage = 'OpenStockEntry Incomplete. Please Complete OpenStockEntry.';
        //  setTimeout(() => this.successMessage = null, 5000);
       }
      })

    this.service.getAllExportSalesOrder().subscribe((data) => {
      data.forEach(res => {
      if(res.status == "DELETED"){
        this.action = false;
      } else {
        this.action = true;
      }
      res.party = res.party.partyName;
      if(res.advReal) {
        res.advReal = 'Yes';
      } else {
        res.advReal = 'No';
      }
      });
      this.settings = this.preapreSettings();
      this.source.load(data);
      this.loading = false;
    });
  }

  handleCreate() {
    if(this.status != false){
      this.router.navigate(['../createExportSalesOrder'], { relativeTo: this.route });
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
    if (row.data.status == "DELETED") {
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
     activeModal.componentInstance.showHide = false;
     activeModal.componentInstance.modalHeader = 'Alert';
     activeModal.componentInstance.modalContent = 'Deleted order cannot be modified!';
    this.action = true;
  } else if (row.data.status == "COMPLETED"  || view == true) {
    this.service.salesOrderData = row.data;
    this.router.navigate(['../viewExportSalesOrder/' + view + '/' + this.service.salesOrderData.soNo, this.service.salesOrderData.status], { relativeTo: this.route });
  } else if(edit == true && view == false) {
    this.service.salesOrderData = row.data;
    this.router.navigate(['../editExportSalesOrder/' + view + '/' + this.service.salesOrderData.soNo, this.service.salesOrderData.status], { relativeTo: this.route });
    }
  }

  onDeleteConfirm(event: any): void {
    if (event.data.status == "DELETED") {
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = false;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Cannot delete already deleted item!';
    } else if (event.data.status == "COMPLETED") {
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = false;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Cannot delete completed order!';
    } else {
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = true;
      activeModal.componentInstance.modalHeader = 'Alert';
      if(event.data.status == "DRAFT") {
        activeModal.componentInstance.modalContent = 'Are you sure you want to delete this DRAFT order?';
      } else {
        activeModal.componentInstance.modalContent = 'Are you sure you want to delete?';
      }
      activeModal.result.then ((res) => {

        if (res == 'Y') {
          this.service.deleteExportSalesOrder(event.data.soNo).subscribe( resp => {
          // event.confirm.resolve();
            this.service.getAllExportSalesOrder().subscribe((data) => {
              data.forEach(res => {
                res.party = res.party.partyName;
                if(res.advReal) {
                  res.advReal = 'Yes';
                } else {
                  res.advReal = 'No';
                }
              });
              this.source.load(data);
            });
          });
        } else if (res == 'N') {
          // event.confirm.reject();
        }
      });
    }
  }
}
