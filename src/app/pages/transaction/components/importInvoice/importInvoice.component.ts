import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from '../../../../core/authentication/authentication.service';
import { Logger } from '../../../../core/logger.service';
import { ImportInvoiceService } from './importInvoice.service';
import { CommonModalComponent } from '../../../../shared/common-modal/common-modal.component';

const log = new Logger('Import-invoice');

class ImportInvoiceDetail {
  supplier: string;
  invoiceNo: string;
  purOrderNo: string;
  purDate: string;
  netAmount: number
  status: string;
  provisional: string;
}

@Component({
  selector: 'importInvoice',
  templateUrl: './importInvoice.html',
  styleUrls: ['./importInvoice.scss']
})

export class ImportInvoice {
  invoiceList: ImportInvoiceDetail[] = [];
  settings: any;
  source: LocalDataSource = new LocalDataSource();
  openingStockInvoice: boolean = false;
  accessList: any[] = [];
  public isEdit: boolean;
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
      },
      edit: {
        editButtonContent: '<i class="ion-edit"></i>',
        saveButtonContent: '<i class="ion-checkmark"></i>',
        cancelButtonContent: '<i class="ion-close"></i>',
      },
      delete: {
        deleteButtonContent: '<i class="ion-trash-a"></i>',
        confirmDelete: true
      },
      columns: {
        supplier: {
          title: 'Supplier Name',
        },
        invoiceNo: {
          title: 'Invoice No',
        },
        purOrderNo: {
          title: 'Import Order No',
        },
        purDate: {
          title: 'Import Date',
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
      },
      edit: {
        editButtonContent: '<i class="ion-edit"></i>',
        saveButtonContent: '<i class="ion-checkmark"></i>',
        cancelButtonContent: '<i class="ion-close"></i>',
      },
      columns: {
        supplier: {
          title: 'Supplier Name',
        },
        invoiceNo: {
          title: 'Invoice No',
        },
        purOrderNo: {
          title: 'Import Order No',
        },
        purDate: {
          title: 'Import Date',
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
    private service: ImportInvoiceService,
    private authService: AuthenticationService) {
      this.loading = true;
    this.accessList = this.authService.getUserAccessOfMenu('importInvoice');
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


  }
  ngOnInit(): void {

    if (this.router.url.includes('ImpPurInvoice')) {
      this.openingStockInvoice = true;
      this.service.getAllOpeningStockImportPurchaseOrderInvoice().subscribe(value => {
        this.invoiceList = [];
        value.forEach(data => {
          const invoice = new ImportInvoiceDetail();
          invoice.invoiceNo = data.invoiceId;
          invoice.netAmount = data.netAmount;
          const date: any[] = data.invoiceDate.split('-');
          const newDate = (date[2] + '-' + date[1] + '-' + date[0]);
          invoice.purDate = newDate;
          invoice.purOrderNo = data.poId;
          invoice.supplier = data.supplier;
          if (data.isCompleted) {
            invoice.status = 'COMPLETED';
          } else {
            invoice.status = 'NOT_COMPLETED';
          }
          if (data.provitionalStatus) {
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

      this.service.getImportInvoiceData().subscribe(value => {
        this.invoiceList = [];
        value.forEach(data => {
          const invoice = new ImportInvoiceDetail();
          invoice.invoiceNo = data.invoiceId;
          invoice.netAmount = data.netAmount;
          const date: any[] = data.invoiceDate.split('-');
          const newDate = (date[2] + '-' + date[1] + '-' + date[0]);
          invoice.purDate = newDate;
          invoice.purOrderNo = data.poId;
          invoice.supplier = data.supplier;
          if (data.isCompleted) {
            invoice.status = 'COMPLETED';
          } else {
            invoice.status = 'NOT_COMPLETED';
          }
          if (data.provitionalStatus) {
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

      this.router.navigate(['../openingImportnvoice'], { relativeTo: this.route });
    }
    else {
      this.router.navigate(['../createImportInvoice'], { relativeTo: this.route });
    }
  }

  handleEdit(row: any) {
    const importData = row.data;
    let view = this.accessList.includes("GET");
    let edit = this.accessList.includes("UPDATE");
    if (view == true && edit == true) {
      view = false;
    } else if (view == false && edit == true) {
      view = false;
    }
    if (this.openingStockInvoice) {
      // this.router.navigateByUrl("openingPurchaseInvoice");
      this.router.navigate(['../viewImpPurInvoice', importData.invoiceNo, importData.status],
        { relativeTo: this.route });
      //this.router.navigate(['../viewImpPurInvoice'], { relativeTo: this.route });
    } else {
      if (row.data.status == 'DELETED') {
        const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
        activeModal.componentInstance.showHide = false;
        activeModal.componentInstance.modalHeader = 'Alert';
        activeModal.componentInstance.modalContent = 'Deleted Invoice cannot be modified!';
      } else if (row.data.status == 'COMPLETED' || view == true) {

        this.router.navigate(['../viewImportInvoice/' + view + '/' + importData.invoiceNo, importData.status],
          { relativeTo: this.route });
      } else if (edit == true && view == false) {
        const importData = row.data;
        this.router.navigate(['../editImportInvoice/' + view + '/' + importData.invoiceNo, importData.status],
          { relativeTo: this.route });
      }
    }
  }

  onDeleteConfirm(event: any): void {
    if (event.data.status == 'DELETED') {
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = false;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Cannot Delete Already Deleted Item!';
    } else if (event.data.status == 'COMPLETED') {
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
        if (res == 'Y') {

          this.service.deleteImportInvoiceById(event.data.invoiceNo).subscribe(resp => {
            this.service.getImportInvoiceData().subscribe(value => {
              this.invoiceList = [];
              value.forEach(data => {
                const invoice = new ImportInvoiceDetail();
                invoice.invoiceNo = data.invoiceId;
                invoice.netAmount = data.netAmount;
                const date: any[] = data.invoiceDate.split('-');
                const newDate = (date[2] + '-' + date[1] + '-' + date[0]);
                invoice.purDate = newDate;
                invoice.purOrderNo = data.poId;
                invoice.supplier = data.supplier;
                if (data.isCompleted) {
                  invoice.status = 'COMPLETED';
                } else {
                  invoice.status = 'NOT_COMPLETED';
                }
                if (data.provitionalStatus) {
                  invoice.provisional = 'YES';
                } else {
                  invoice.provisional = 'NO';
                }
                this.invoiceList.push(invoice);
                this.settings = this.prepareSetting();
                this.source.load(this.invoiceList);
              });
            });
          });
        }
      });
    }
  }

}
