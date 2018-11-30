import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from '../../../../core/authentication/authentication.service';
import { Logger } from '../../../../core/logger.service';
import { PurchaseInvoiceService } from './purchaseInvoice.service';
import { CommonModalComponent } from '../../../../shared/common-modal/common-modal.component';

const log = new Logger('purchaseInvoice');

class PurchaseInvoiceDetail {
  id: number;
  supplier: string;
  invoiceNo: string;
  purOrderNo: string;
  purDate: string;
  netAmount: number
  status: string;
  provisional: string;
}

@Component({
  selector: 'purchaseInvoice',
  templateUrl: './purchaseInvoice.html',
  styleUrls: ['./purchaseInvoice.scss']
})
export class PurchaseInvoiceComponent {

  invoiceList: PurchaseInvoiceDetail[] = [];
  settings: any;
  openingStockInvoice: boolean = false;
  accessList: any[] = [];
  public isEdit: boolean;
  source: LocalDataSource = new LocalDataSource();
  loading:boolean = false;
  prepareSetting() {
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
        supplier: {
          // editable: false,
          title: 'Supplier Name',

        },
        invoiceNo: {
          // editable: false,
          title: 'Invoice No',
        },
        purOrderNo: {
          // editable: false,
          title: 'Purchase Order No',
        },
        purDate: {
          title: 'Purchase Date',
        },
        netAmount: {
          title: 'Net Amount',

        },
        status: {
          title: 'Status',
        },
        provisional: {
          title: 'Provisional',
        },
      }
    };
  }


  prepareSettingOSI() {
    return {
      actions: {
        position: 'right',
        add: this.accessList.includes("ADD"),
        edit: this.isEdit,
        delete: false,
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

      columns: {
        supplier: {
          // editable: false,
          title: 'Supplier Name',

        },
        invoiceNo: {
          // editable: false,
          title: 'Invoice No',
        },
        purOrderNo: {
          // editable: false,
          title: 'Purchase Order No',
        },
        purDate: {
          title: 'Purchase Date',
        },
        netAmount: {
          title: 'Net Amount',

        },
        status: {
          title: 'Status',
        },
        provisional: {
          title: 'Provisional',
        },
      }
    };
  }

  constructor(private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private service: PurchaseInvoiceService,
    private authService: AuthenticationService) {
      this.loading = true;
      this.accessList = this.authService.getUserAccessOfMenu('purchaseInvoice');
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


  }
  ngOnInit(): void {
   
    if (this.router.url.includes('locPurInvoice')) {
      this.openingStockInvoice = true;
      
      this.service.getAllOpeningStockLocalPurchaseInvoices().subscribe(value => {
        this.invoiceList = [];
        value.forEach(data => {
          const invoice = new PurchaseInvoiceDetail();
          invoice.id = data.locPurId;
          invoice.invoiceNo = data.invoiceNo;
          invoice.netAmount = data.netAmount;
          const date: any[] = data.locPurDate.split('-');
          const newDate = (date[2] + '-' + date[1] + '-' + date[0]);
          invoice.purDate = newDate;
          invoice.purOrderNo = data.locPurNo;
          invoice.supplier = data.party.partyName;
          if (data.completed == 'Y') {
            invoice.status = 'COMPLETED';
          } else {
            invoice.status = 'NOT_COMPLETED';
          }
          if (data.provisional == 'Y') {
            invoice.provisional = 'YES';
          } else {
            invoice.provisional = 'NO';
          }
          this.invoiceList.push(invoice);
        });
        this.settings = this.prepareSettingOSI();
        this.source.load(this.invoiceList);
        this.loading = false;
      })
    } else {
      this.service.getPurchaseInvoiceData().subscribe(value => {
        this.invoiceList = [];
        value.forEach(data => {
          const invoice = new PurchaseInvoiceDetail();
          invoice.id = data.locPurId;
          invoice.invoiceNo = data.invoiceNo;
          invoice.netAmount = data.netAmount;
          const date: any[] = data.locPurDate.split('-');
          const newDate = (date[2] + '-' + date[1] + '-' + date[0]);
          invoice.purDate = newDate;
          invoice.purOrderNo = data.locPurNo;
          invoice.supplier = data.party.partyName;
          if (data.completed == 'Y') {
            invoice.status = 'COMPLETED';
          } else {
            invoice.status = 'NOT_COMPLETED';
          }
          if (data.provisional == 'Y') {
            invoice.provisional = 'YES';
          } else {
            invoice.provisional = 'NO';
          }
          this.invoiceList.push(invoice);
        });
        this.settings = this.prepareSetting();
        this.source.load(this.invoiceList);
        this.loading = false;
      })
    }
  }

  handleCreate() {
    if (this.openingStockInvoice) {
      // this.router.navigateByUrl("openingPurchaseInvoice");

      this.router.navigate(['../openingPurchaseInvoice'], { relativeTo: this.route });
    }
    else {
      this.router.navigate(['../createPurchaseInvoice'], { relativeTo: this.route });
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
    if (this.openingStockInvoice) {
      // this.router.navigateByUrl("openingPurchaseInvoice");
      const purchseInvoiceData = row.data;
      this.router.navigate(['../viewlocPurInvoice', purchseInvoiceData.id, row.data.status],
        { relativeTo: this.route });
      //this.router.navigate(['../viewImpPurInvoice'], { relativeTo: this.route });
    } else {
      if (row.data.status == "DELETED") {
        const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
        activeModal.componentInstance.showHide = false;
        activeModal.componentInstance.modalHeader = 'Alert';
        activeModal.componentInstance.modalContent = 'Deleted Invoice cannot be modified!';
      } else if (row.data.status == "COMPLETED"  || view == true) {
        const purchseInvoiceData = row.data;
        this.router.navigate(['../viewPurchaseInvoice/' + view + '/' + purchseInvoiceData.id, row.data.status], { relativeTo: this.route });
      } else if(edit == true && view == false) {
        const purchseInvoiceData = row.data;
        this.router.navigate(['../editPurchaseInvoice/' + view + '/' + purchseInvoiceData.id, row.data.status], { relativeTo: this.route });
      }
    }
  }

  onDeleteConfirm(event: any): void {
    debugger
    if (event.data.status == "DELETED") {
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = false;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Cannot Delete Already Deleted Item!';
    } else if (event.data.status == "COMPLETED") {
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = false;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Cannot Delete Completed Invoice!';
    } else {
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = true;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Are you sure you want to delete!';
      activeModal.result.then((res) => {
        // console.log(res == 'Y');
        if (res == 'Y') {

          this.service.deletePurchaseOrderInvoiceById(event.data.id).subscribe(data => {
            this.service.getPurchaseInvoiceData().subscribe(value => {
              this.invoiceList = [];
              value.forEach(data => {
                const invoice = new PurchaseInvoiceDetail();
                invoice.id = data.locPurId;
                invoice.invoiceNo = data.invoiceNo;
                invoice.netAmount = data.netAmount;
                const date: any[] = data.locPurDate.split('-');
                const newDate = (date[2] + '-' + date[1] + '-' + date[0]);
                invoice.purDate = newDate;
                invoice.purOrderNo = data.locPurNo;
                invoice.supplier = data.party.partyName;
                if (data.completed == 'Y') {
                  invoice.status = 'COMPLETED';
                } else {
                  invoice.status = 'NOT_COMPLETED';
                }
                if (data.provisional == 'Y') {
                  invoice.provisional = 'YES';
                } else {
                  invoice.provisional = 'NO';
                }
                this.invoiceList.push(invoice);
                this.settings = this.prepareSetting();
                this.source.load(this.invoiceList);
                this.loading = false;
              });
            });
          });
        } else if (res == 'N') {

        }
      });
    }
  }

}
