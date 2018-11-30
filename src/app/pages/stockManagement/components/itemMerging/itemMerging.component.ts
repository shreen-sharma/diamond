import {Component} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';

import { AuthenticationService } from '../../../../core/authentication/authentication.service';
import { Logger } from '../../../../core/logger.service';
import { ItemMergingService } from './itemMerging.service';

const log = new Logger('ItemMerging');

@Component({
  selector: 'itemMerging',
  templateUrl: './itemMerging.html',
  styleUrls: ['./itemMerging.scss']
})
export class ItemMerging {

  query = '';
  accessList: any[] = [];
  source: LocalDataSource = new LocalDataSource();
  settings: any;

    constructor(private router: Router,
      private service: ItemMergingService,
      private route: ActivatedRoute,
      private authService: AuthenticationService) {

        this.accessList = this.authService.getUserAccessOfMenu('itemMerging');
        this.settings = this.prepareSetting();
        
      this.service.getAllLotTransactionByTransTypeAndInvoiceType('SA','LM').subscribe((data) => {
        this.source.load(data);
      });
    }
prepareSetting(){
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
        title: 'Merging Date',
        type: 'string'
      },
      adjustCarats: {
        title: 'Carats Merged',
        type: 'number'
      },
      adjustRate: {
        title: 'Merged Rate',
        type: 'number'
      },
      remarks: {
        title: 'Remarks',
        type: 'number'
      },
    }
  };
}

  handleCreate() {
    this.router.navigate(['../createItemMerging'], { relativeTo: this.route });
  }

  handleEdit( row: any ) {
    const itemMerging = row.data;
    this.router.navigate(['../editItemMerging', itemMerging.lotTransId], { relativeTo: this.route });
  }

  onDeleteConfirm(event: any): void {
    if (window.confirm('Are you sure you want to delete?')) {
      this.service.deleteItemMerge( event.data.lotTransId).subscribe( data => {
      event.confirm.resolve();
      });

    } else {
      event.confirm.reject();
    }
  }

}
