import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { AuthenticationService } from '../../../../core/authentication/authentication.service';
import { Logger } from '../../../../core/logger.service';
import { ReceiptEntryService } from './receiptEntry.service';
import { CommonModalComponent } from '../../../../shared/common-modal/common-modal.component';

const log = new Logger('receiptEntry');

@Component({
  selector: 'receiptEntry',
  templateUrl: './receiptEntry.html',
  styleUrls: ['./receiptEntry.scss']
})
export class ReceiptEntryComponent {

  query = '';
  pageTitle = 'Receipt Entry';
  source: LocalDataSource = new LocalDataSource();
  accessList: any[] = [];
  public isEdit: boolean;
  settings: any;

  prepareSettings () {
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
        receiptId: {
          title: 'Doc. / Receipt No.',
          type: 'string'
        },
        docDate: {
          title: 'Doc. Date',
          type: 'string'
        },
        invoiceNo: {
          title: 'Sales Invoice No.',
          type: 'string'
        },    
        partyName: {
          title: 'Party',
          type: 'string'
        },
        totalAmount: {
          title: 'Total Amount',
          type: 'number'
        },
        payingAmount: {
          title: 'Received Amount',
          type: 'number'
        },
        narration: {
          title: 'Narration/Remarks',
          type: 'string',
          valuePrepareFunction: value => {
            if(value) {
              return value;
            } else {
              return '-';
            }
          }
        },
        paymentStatus: {
          title: 'Received Status',
          type: 'string'
        },
        docCode:{
          title:'Invoice Type',
          type:'string'
        }
      }
    }
  };

  constructor(private router: Router,
    private route: ActivatedRoute,
    private service: ReceiptEntryService,
    private authService: AuthenticationService) {
      this.accessList = this.authService.getUserAccessOfMenu('salesOrder');
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
      this.settings = this.prepareSettings();
      this.service.getAllReceiptEntry().subscribe( data => {
        data.forEach(element => {       
          const date: any[] = element.docDate.split('-');
          element.docDate = (date[2] + '-' + date[1] + '-' + date[0]);
        });
        this.source.load(data);
      })
  }

  handleCreate() {
    this.router.navigate(['../createReceiptEntry'], { relativeTo: this.route });
  }

  handleEdit( row: any ) {
    const receiptEntry = row.data;
    this.router.navigate(['../viewReceiptEntry', receiptEntry.receiptId], { relativeTo: this.route });
  }

}
