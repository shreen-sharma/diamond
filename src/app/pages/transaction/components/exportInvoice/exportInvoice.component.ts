import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModalComponent } from '../../../../shared/common-modal/common-modal.component';
import { AuthenticationService } from '../../../../core/authentication/authentication.service';
import { Logger } from '../../../../core/logger.service';
import { ExportInvoiceService } from './exportInvoice.service';

const log = new Logger('exportInvoice');

class ExportInvoiceDetail {
  expId: number;
  customerName: string;
  expNo: string;
  ordNo: string;
  expDate: string;
  fobAmount: number;
  status: string;
  provisional: string;
  isDcReturn: string;
}

@Component({
  selector: 'exportInvoice',
  templateUrl: './exportInvoice.html',
  styleUrls: ['./exportInvoice.scss']
})
export class ExportInvoice {

  invoiceList: ExportInvoiceDetail[] = [];
  settings: any;
  openingStockInvoice: boolean = false;
  source: LocalDataSource = new LocalDataSource();
  accessList: any[] = [];
  isEdit: any;
  loading: boolean = false;
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
        customerName: {
          title: 'Customer Name',
        },
        expId: {
          title: 'Exp. Invoice No',
        },
        ordNo: {
          title: 'Exp Sales Ord No / DC CN Return No',
        },
        expDate: {
          title: 'Invoice Date',
        },
        fobAmount: {
          title: 'Receivable Amount',
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
        customerName: {
          title: 'Customer Name',
        },
        expId: {
          title: 'Exp. Invoice No',
        },
        expDate: {
          title: 'Invoice Date',
        },
        fobAmount: {
          title: 'Receivable Amount',
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
    private service: ExportInvoiceService,
    private modalService: NgbModal,
    private authService: AuthenticationService) {
      this.loading = true;
      this.accessList = this.authService.getUserAccessOfMenu('exportInvoice');
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

    if (this.router.url.includes('ExpSalesInvoice')) {
      this.openingStockInvoice = true;
      this.service.getAllOpeningStockExportSalesOrderInvoice().subscribe((value) => {
        this.invoiceList = [];
        value.forEach(data => {
          const invoice = new ExportInvoiceDetail();
          invoice.expId = data.expId;
          invoice.customerName = data.customerName;
          invoice.expNo = data.expNo;
          invoice.fobAmount = data.fobAmount;
          invoice.expDate = this.dateFormate(data.expDate);
          invoice.ordNo = data.ordNo;
          if (data.isCompleted) {
            invoice.status = 'COMPLETED';
          } else {
            invoice.status = 'NOT_COMPLETED';
          }
          if (data.isDcReturn) {
            invoice.isDcReturn = 'YES';
          } else {
            invoice.isDcReturn = 'NO';
          }
          if (data.provisional) {
            invoice.provisional = 'YES';
          } else {
            invoice.provisional = 'NO';
          }
          this.invoiceList.push(invoice);
        });
        this.settings = this.prepareSettingOSI();
        this.source.load(this.invoiceList);
        this.loading = false;
      });
    }
    else {

      this.service.getAllExportInvoice().subscribe((value) => {
        this.invoiceList = [];
        value.forEach(data => {
          const invoice = new ExportInvoiceDetail();
          invoice.expId = data.expId;
          invoice.customerName = data.customerName;
          invoice.expNo = data.expNo;
          invoice.fobAmount = data.fobAmount;
          invoice.expDate = this.dateFormate(data.expDate);
          invoice.ordNo = data.ordNo;
          if (data.isCompleted) {
            invoice.status = 'COMPLETED';
          } else {
            invoice.status = 'NOT_COMPLETED';
          }
          if (data.isDcReturn) {
            invoice.isDcReturn = 'YES';
          } else {
            invoice.isDcReturn = 'NO';
          }
          if (data.provisional) {
            invoice.provisional = 'YES';
          } else {
            invoice.provisional = 'NO';
          }
          this.invoiceList.push(invoice);
        });
        this.settings = this.prepareSetting();
        this.source.load(this.invoiceList);
        this.loading = false;
      });
    }
  }
  dateFormate(value: any) {
    const expDate = value.split('-');
    const newDate = (expDate[2] + '-' + expDate[1] + '-' + expDate[0]);
    return newDate;
  }

  handleCreate() {
    if (this.openingStockInvoice) {
      this.router.navigate(['../openingExpSalesInvoice'], { relativeTo: this.route });
    } else {
      this.router.navigate(['../createExportInvoice'], { relativeTo: this.route });
    }
  }

  handleEdit(row: any) {
    if (this.openingStockInvoice) {
      const exportInvoice = row.data;
      this.router.navigate(['../viewExpSalesInvoice', exportInvoice.expId, row.data.status], { relativeTo: this.route });
    } else {
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
        activeModal.componentInstance.modalContent = 'Deleted Invoice cannot be modified!';
      } else if (row.data.status == "COMPLETED"  || view == true) {
        const exportInvoice = row.data;
        this.router.navigate(['../viewExportInvoice/' + view + '/' + exportInvoice.expId, row.data.status], { relativeTo: this.route });
      } else if(edit == true && view == false) {
        const exportInvoice = row.data;
        this.router.navigate(['../editExportInvoice/' + view + '/' + exportInvoice.expId], { relativeTo: this.route });
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

            this.service.deleteExportInvoiceById(event.data.expId).subscribe(data => {
              this.service.getAllExportInvoice().subscribe(value => {
                this.invoiceList = [];
                value.forEach(data => {
                  const invoice = new ExportInvoiceDetail();
                  invoice.expId = data.expId;
                  invoice.customerName = data.customerName;
                  invoice.expNo = data.expNo;
                  invoice.fobAmount = data.fobAmount;
                  invoice.expDate = this.dateFormate(data.expDate);
                  invoice.ordNo = data.ordNo;
                  if (data.isCompleted) {
                    invoice.status = 'COMPLETED';
                  } else {
                    invoice.status = 'NOT_COMPLETED';
                  }
                  if (data.isDcReturn) {
                    invoice.isDcReturn = 'YES';
                  } else {
                    invoice.isDcReturn = 'NO';
                  }
                  if (data.provisional) {
                    invoice.provisional = 'YES';
                  } else {
                    invoice.provisional = 'NO';
                  }
                  this.invoiceList.push(invoice);
                });
                this.settings = this.prepareSetting();
                this.source.load(this.invoiceList);
              });
            });
          } else if (res == 'N') {

          }
        });
      }
    }
  }
}
