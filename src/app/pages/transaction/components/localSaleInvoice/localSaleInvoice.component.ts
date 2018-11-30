import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from '../../../../core/authentication/authentication.service';
import { Logger } from '../../../../core/logger.service';
import { LocalSaleService } from './localSaleInvoice.service';
import { CommonModalComponent } from '../../../../shared/common-modal/common-modal.component';

const log = new Logger('localSaleInvoice');

class SalesInvoiceDetail {
  id: number;
  customer: string;
  invoiceNo: string;
  soNo: string;
  invoiceDate: string;
  payableAmountBase: number;
  brokerId: string;
  status: string;
  provisional: string;
  isDcReturn: string;
  payableAmountStock: number;
}

@Component({
  selector: 'localSaleInvoice',
  templateUrl: './localSaleInvoice.html',
  styleUrls: ['./localSaleInvoice.scss']
})
export class LocalSaleInvoiceComponent {

  invoiceList: any[] = [];
  settings: any;
  openingStockInvoice: boolean = false;
  accessList: any[] = [];
  public isEdit: boolean;
  source: LocalDataSource = new LocalDataSource();
  loading : boolean = false;

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
        customer: {
          title: 'Customer Name',
        },
        id: {
          title: 'Sales Invoice No',
        },
        soNo: {
          title: 'Order No / DC Return No',
        },
        invoiceDate: {
          title: 'Invoice Date',
        },
        brokerId: {
          title: 'Broker'
        },
        payableAmountBase: {
          title: 'Receivable Amount (INR)',
        },
        payableAmountStock: {
          title: 'Receivable Amount (USD)',
        },
        status: {
          title: 'Status',
        },
        provisional: {
          title: 'Provisional',
        },
        isDcReturn: {
          title: 'DC Status',
        }
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
        customer: {
          title: 'Customer Name',
        },
        id: {
          title: 'Sales Invoice No',
        },
      
        invoiceDate: {
          title: 'Invoice Date',
        },
        brokerId: {
          title: 'Broker'
        },
        payableAmountBase: {
          title: 'Receivable Amount (INR)',
        },
        payableAmountStock: { 
          title: 'Receivable Amount (USD)',
        },
        status: {
          title: 'Status',
        },
        provisional: {
          title: 'Provisional',
        },
        isDcReturn: {
          title: 'DC Status',
        }
      }
    };
  }

  constructor(private router: Router,
    private route: ActivatedRoute,
    private service: LocalSaleService,
    private modalService: NgbModal,
    private authService: AuthenticationService) {
      this.loading = true;
      this.accessList = this.authService.getUserAccessOfMenu('localSaleInvoice');
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
    
    if (this.router.url.includes('locSalInvoice')) {
      this.loading = true;
      this.openingStockInvoice = true;
      this.settings = this.prepareSettingOSI();
      this.service.getAllOpeningStockLocalSalesOrderInvoice().subscribe(value => {
        this.invoiceList = [];
        value.forEach(data => {

          const invoice = new SalesInvoiceDetail();
          invoice.customer = data.customer;
          invoice.id = data.id;
          invoice.payableAmountBase = data.payableAmountBase;
          invoice.payableAmountStock = data.payableAmountStock;
          invoice.invoiceDate = data.invoiceDate;
          invoice.brokerId = data.brokerId;
          invoice.status = data.status;
          if (data.isDcReturn == 'Y') {
            invoice.isDcReturn = 'YES';
          } else {
            invoice.isDcReturn = 'NO';
          }
          if (data.provisional == 'Y') {
            invoice.provisional = 'YES';
          } else {
            invoice.provisional = 'NO';
          }
          invoice.soNo = data.soNo;

          this.invoiceList.push(invoice);
          this.source.load(this.invoiceList);
          this.loading = false;
        });
      });

    
    } else {
      this.service.getSalesInvoiceData().subscribe(value => {
        this.invoiceList = [];
        value.forEach(data => {

          const invoice = new SalesInvoiceDetail();
          invoice.customer = data.customer;
          invoice.id = data.id;
          invoice.payableAmountBase = data.payableAmountBase;
          invoice.payableAmountStock = data.payableAmountStock;
          invoice.invoiceDate = data.invoiceDate;
          invoice.brokerId = data.brokerId;
          invoice.status = data.status;
          if (data.isDcReturn == 'Y') {
            invoice.isDcReturn = 'YES';
          } else {
            invoice.isDcReturn = 'NO';
          }
          if (data.provisional == 'Y') {
            invoice.provisional = 'YES';
          } else {
            invoice.provisional = 'NO';
          }
          invoice.soNo = data.soNo;

          this.invoiceList.push(invoice);
          this.source.load(this.invoiceList);
          this.loading = false;
        });
      });

      this.settings = this.prepareSetting();
    }
  }


  handleCreate() {
    if (this.openingStockInvoice) {
      // this.router.navigateByUrl("openingPurchaseInvoice");

      this.router.navigate(['../openingSalesInvoice'], { relativeTo: this.route });
    }
    else {
      this.router.navigate(['../createSaleInvoice'], { relativeTo: this.route });
    }
  }

  handleEdit(row: any) {
    let view = this.accessList.includes("GET");
    let edit = this.accessList.includes("UPDATE");
    if (view == true && edit == true) {
      view = false;
    } else if (view == false && edit == true) {
      view = false;
    };
    if (this.openingStockInvoice) {
      const saleInvoiceData = row.data;
      this.router.navigate(['../viewOpeningSalesInvoice', saleInvoiceData.id, row.data.status], { relativeTo: this.route });
    } else {
      if (row.data.status == "DELETED") {
        const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
        activeModal.componentInstance.showHide = false;
        activeModal.componentInstance.modalHeader = 'Alert';
        activeModal.componentInstance.modalContent = 'Deleted Invoice cannot be modified!';
      } else if (row.data.status == "COMPLETED" || view == true) {
        const saleInvoiceData = row.data;
        this.router.navigate(['../viewSaleInvoice/' + view + '/' + saleInvoiceData.id, row.data.status], { relativeTo: this.route });
      } else if(edit == true && view == false) {
        const saleInvoiceData = row.data;
        this.router.navigate(['../editSaleInvoice/' + view + '/' + saleInvoiceData.id, row.data.status], { relativeTo: this.route });
      }
    }
  }

  onDeleteConfirm(event: any): void {
    if (event.data.isDcReturn == 'YES') {
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = false;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Cannot Delete Invoice associated with DC Return!';
    } else {
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

            this.service.deleteSalesOrderInvoiceById(event.data.id).subscribe(dat => {
              this.service.getSalesInvoiceData().subscribe(value => {
                this.invoiceList = [];
                value.forEach(data => {
                  const invoice = new SalesInvoiceDetail();
                  invoice.customer = data.customer;
                  invoice.id = data.id;
                  invoice.payableAmountBase = data.payableAmountBase;
                  invoice.invoiceDate = data.invoiceDate;
                  invoice.brokerId = data.brokerId;
                  invoice.status = data.status;
                  if (data.isDcReturn == 'Y') {
                    invoice.isDcReturn = 'YES';
                  } else {
                    invoice.isDcReturn = 'NO';
                  }
                  if (data.provisional == 'Y') {
                    invoice.provisional = 'YES';
                  } else {
                    invoice.provisional = 'NO';
                  }
                  invoice.soNo = data.soNo;
                  this.invoiceList.push(invoice);
                  this.source.load(this.invoiceList);
                  this.settings = this.prepareSetting();
                });
              });
            });
          } else if (res == 'N') {

          }
        });
      }
    }
  }
}
