import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';

import { AuthenticationService } from '../../../../core/authentication/authentication.service';
import { Logger } from '../../../../core/logger.service';
import { ItemTransferService } from './itemTransfer.service';

const log = new Logger('ItemTransfer');

@Component({
  selector: 'itemTransfer',
  templateUrl: './itemTransfer.html',
  styleUrls: ['./itemTransfer.scss']
})

export class ItemTransfer {

  query = '';
  source: LocalDataSource = new LocalDataSource();
  accessList: any[] = [];
  settings: any;

  prepareSetting() {
    return {
      actions: {
        position: 'right',
        add: this.accessList.includes("ADD"),
        // edit: this.accessList.includes("GET"),
        // delete: this.accessList.includes("DELETE"),
        edit: false,
        delete: false
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
        lotMasterByFromLotId: {
          title: 'Source Lot',
          type: 'string'
        },
        lotItemByFromLotItemId: {
          title: 'Source Item',
          type: 'string',
        },
        lotMasterByToLotId: {
          title: 'Destination Lot',
          type: 'string'
        },
        transDate: {
          title: 'Transfer Date',
          type: 'string'
        },
        adjustCarats: {
          title: 'Carats Transferred',
          type: 'number'
        },
        adjustRate: {
          title: 'Transferred Rate',
          type: 'number'
        },
        remarks: {
          title: 'Remarks',
          type: 'number'
        },
      }
    };

  }
  constructor(private router: Router,
    private service: ItemTransferService,
    private route: ActivatedRoute,
    private authService: AuthenticationService) {

    this.accessList = this.authService.getUserAccessOfMenu('itemTransfer');

    this.settings = this.prepareSetting();
    this.service.getAllItemTransfer().subscribe((data) => {
      this.source.load(data);
    });
  }


  handleCreate() {
    this.router.navigate(['../createItemTransfer'], { relativeTo: this.route });
  }

  handleEdit(row: any) {
    const itemTransfer = row.data;
    this.router.navigate(['../editItemTransfer', itemTransfer.lotTransId], { relativeTo: this.route });
  }

}
