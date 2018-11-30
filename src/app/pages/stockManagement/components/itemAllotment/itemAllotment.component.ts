import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';

import { AuthenticationService } from '../../../../core/authentication/authentication.service';
import { Logger } from '../../../../core/logger.service';
import { ItemAllotmentService } from './itemAllotment.service';

const log = new Logger('ItemAllotment');

@Component({
  selector: 'itemAllotment',
  templateUrl: './itemAllotment.html',
  styleUrls: ['./itemAllotment.scss']
})
export class ItemAllotment {

  query = '';
  settings: any;
  accessList: any[] = [];
  itemList: any[] = [];

  source: LocalDataSource = new LocalDataSource();

  constructor(private router: Router,
    private service: ItemAllotmentService,
    private route: ActivatedRoute,
    private authService: AuthenticationService) {
    this.accessList = this.authService.getUserAccessOfMenu('itemAllotment');

    this.settings = this.prepareSetting();
    this.service.getAllLotTransactionByTransTypeAndInvoiceType('SA', 'LA').subscribe((resp) => {
      this.source.load(resp);
    });

  }

  prepareSetting() {
    return {
      actions: {
        position: 'right',
        add: this.accessList.includes("ADD"),
        edit: false,
        delete: false
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
        lotMasterByFromLotId: {
          title: 'Source Lot',
          type: 'string',
        },
        lotItemByFromLotItemId: {
          title: 'Source Item',
          type: 'string',
        },
        lotMasterByToLotId: {
          title: 'Destination Lot',
          type: 'string',
        },
        lotItemByToLotItemId: {
          title: 'Destination Item',
          type: 'string',
        },
        transDate: {
          title: 'Allotment Date',
          type: 'string'
        },
        adjustCarats: {
          title: 'Alloted Carats',
          type: 'number'
        },
        adjustRate: {
          title: 'Alloted Rate',
          type: 'number'
        },
        remarks: {
          title: 'Remarks',
          type: 'string'
        },
      }
    };
  }

  handleCreate() {
    this.router.navigate(['../createItemAllotment'], { relativeTo: this.route });
  }

  handleEdit(row: any) {
    const itemAllotment = row.data;
    this.router.navigate(['../editItemAllotment', itemAllotment.lotTransId], { relativeTo: this.route });
  }

  onDeleteConfirm(event: any): void {
    if (window.confirm('Are you sure you want to delete?')) {
      this.service.deleteItemAllotmentById(event.data.lotTransId).subscribe(data => {
        event.confirm.resolve();
      });
    } else {
      event.confirm.reject();
    }
  }

}
