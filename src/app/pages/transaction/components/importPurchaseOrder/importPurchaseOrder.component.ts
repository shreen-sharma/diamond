import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { CommonModalComponent } from '../../../../shared/common-modal/common-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from '../../../../core/authentication/authentication.service';
import { Logger } from '../../../../core/logger.service';
import { ImportPurchaseOrderService } from './importPurchaseOrder.service';
import { PartyDetailsService } from '.../../app/pages/company/components/partyDetails/partyDetails.service';
import { CategoryService } from '.../../app/pages/masters/components/categories/category.service';

const log = new Logger('ImportPurchaseOrder');

@Component({
  selector: 'importPurchaseOrder',
  templateUrl: './importPurchaseOrder.html',
  styleUrls: ['./importPurchaseOrder.scss']
})
export class ImportPurchaseOrder {

  query = '';
  catList: any[] = [];
  itemList: any[] = [];
  successMessage: String;
  status: boolean;
  action: boolean = true;
  accessList: any[] = [];
  public isEdit: boolean;
  settings: any;
  loading: boolean = false;

  source: LocalDataSource = new LocalDataSource();

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
        poId: {
          title: 'Order No',
          type: 'Number'
        },
        poDate: {
          title: 'Order Date',
          type: 'Number'
        },
        party: {
          title: 'Supplier',
          type: 'string',
          // valuePrepareFunction: value => value.partyName,
        },
        orderAmount: {
          title: 'Total Amount',
          type: 'Number'
        },
        status: {
          title: 'Status',
          type: 'string'
        },
        advRemitt: {
          title: 'Adv. Remitt',
          type: 'string',
        },
      }
    }
  };

  constructor(private router: Router,
    private service: ImportPurchaseOrderService,
    private route: ActivatedRoute,
    private catService: CategoryService,
    private modalService: NgbModal,
    private partyService: PartyDetailsService,
    private authService: AuthenticationService) {
      this.loading = true;
    this.accessList = this.authService.getUserAccessOfMenu('importPurchaseOrder');
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
      if (res.object == false) {
        this.status = res.object;
        this.successMessage = 'OpenStockEntry Incomplete. Please Complete OpenStockEntry.';
        //  setTimeout(() => this.successMessage = null, 5000);
      }
    })
    this.service.getImportPurchaseOrderData().subscribe((data) => {
      data.forEach(res => {
        if (res.status == "DELETED") {
          this.action = false;
        } else {
          this.action = true;
        }
        if (res.advRemitt) {
          res.advRemitt = 'Yes';
        } else {
          res.advRemitt = 'No';
        }
        res.party = res.party.partyName;
      });
      this.settings = this.prepareSettings();
      this.source.load(data);
      this.loading = false;
    });
  }

  handleCreate() {
    if (this.status != false) {
      this.router.navigate(['../createImportPurchaseOrder'], { relativeTo: this.route });
    }
  }

  handleEdit(row: any) {
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
    } else if (row.data.status == "COMPLETED" || view == true) {
      this.service.perchOrderData = row.data;
      this.router.navigate(['../viewImportPurchaseOrder/' + view + '/' + this.service.perchOrderData.poId, this.service.perchOrderData.status], { relativeTo: this.route });
    } else if(edit == true && view == false) {
      this.service.perchOrderData = row.data;
      this.router.navigate(['../editImportPurchaseOrder/' + view + '/' + this.service.perchOrderData.poId, this.service.perchOrderData.status], { relativeTo: this.route });
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
      activeModal.componentInstance.modalContent = 'Cannot delete completed  order!';
    } else {
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = true;
      activeModal.componentInstance.modalHeader = 'Alert';
      if (event.data.status == "DRAFT") {
        activeModal.componentInstance.modalContent = 'Are you sure you want to delete this DRAFT order?';
      } else {
        activeModal.componentInstance.modalContent = 'Are you sure you want to delete?';
      }
      activeModal.result.then((res) => {
        if (res == 'Y') {
          this.service.deleteImportPurchaseOrder(event.data.poId).subscribe(response => {
            // event.confirm.resolve();
            this.service.getImportPurchaseOrderData().subscribe((data) => {
              data.forEach(res => {
                res.party = res.party.partyName;
                if (res.advRemitt) {
                  res.advRemitt = 'Yes';
                } else {
                  res.advRemitt = 'No';
                }
              });
              this.source.load(data);
              this.loading = false;
            });
          });
        }
      });
    }
  }

}
