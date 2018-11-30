import {Component} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from '../../../../core/authentication/authentication.service';
import { Logger } from '../../../../core/logger.service';
import { ExportRealisationService } from './exportRealisation.service';
import { CommonModalComponent } from '../../../../shared/common-modal/common-modal.component';

const log = new Logger('export-realisation');

class ExportRealisationDetail {
  supplier: string;
  invoiceNo: string;
  purOrderNo: string;
  purDate: string;
  netAmount: number
  status: string;
  provisional: string;
}

@Component({
  selector: 'export-Realisation',
  templateUrl: './exportRealisation.html',
  styleUrls: ['./exportRealisation.scss']
})

export class ExportRealisation {
  invoiceList: ExportRealisationDetail[] = [];
  settings: any;
  source: LocalDataSource = new LocalDataSource();

 prepareSetting() {
      return {
    actions: {
      position: 'right'
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
          // editable: false,
          title: 'Supplier Name',

        },
        invoiceNo: {
          // editable: false,
          title: 'Invoice No',
        },
        purOrderNo: {
          // editable: false,
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
    private service: ExportRealisationService,
    private authService: AuthenticationService) {
      this.settings = this.prepareSetting();

      this.service.getExportRealisationData().subscribe(value => {
        this.invoiceList = [];
        value.forEach(data => {
          const invoice = new ExportRealisationDetail();
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
      })

  }

  handleCreate() {
    this.router.navigate(['../createExportRealisation'], { relativeTo: this.route });
  }

  handleEdit( row: any ) {
    if (row.data.status == 'DELETED') {
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = false;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Deleted Realisation cannot be modified!';
    } else if (row.data.status == 'COMPLETED') {
      const importData = row.data;
      this.router.navigate(['../viewExportRealisation', importData.invoiceNo, importData.status],
      { relativeTo: this.route });
    } else {
      const importData = row.data;
      this.router.navigate(['../editExportRealisation', importData.invoiceNo, importData.status],
      { relativeTo: this.route });
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
      activeModal.componentInstance.modalContent = 'Cannot Delete Completed Realisation!';
    } else {
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = true;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Are you sure you want to delete!';
      activeModal.result.then ((res) => {
        if (res == 'Y') {

          this.service.deleteExportRealisationById(event.data.invoiceNo).subscribe( resp => {
            this.service.getExportRealisationData().subscribe(value => {
              this.invoiceList = [];
              value.forEach( data => {
                const invoice = new ExportRealisationDetail();
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
