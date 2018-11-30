import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';

import { AuthenticationService } from '../../../../core/authentication/authentication.service';
import { Logger } from '../../../../core/logger.service';
import { PhysicalStockAdjustmentService } from './physicalStockAdjustment.service';

const log = new Logger('physicalStockAdjustment');

@Component({
  selector: 'physical-stock-adjustment',
  templateUrl: './physicalStockAdjustment.html',
  styleUrls: ['./physicalStockAdjustment.scss']
})
export class PhysicalStockAdjustment {

  query = '';
  accessList: any[] = [];
  settings: any;
  source: LocalDataSource = new LocalDataSource();

  constructor(private router: Router,
    private service: PhysicalStockAdjustmentService,
    private route: ActivatedRoute,
    private authService: AuthenticationService) {
    this.accessList = this.authService.getUserAccessOfMenu('physicalStockAdjustment');
    this.settings = this.prepareSetting();

    this.service.getAllPhysicalStockAdjust().subscribe((data) => {
      this.source.load(data);
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
        lotName: {
          title: 'Lot Name',
          type: 'string',
        },
        itemName: {
          title: 'Item Name',
          type: 'string',
        },
        stockUpdationDate: {
          title: 'Updation Date',
          type: 'string'
        },
        prevCarats: {
          title: 'Previous Carats',
          type: 'number'
        },
        adjustedCarats: {
          title: 'Adjusted Carats',
          type: 'number'
        },
        prevRate: {
          title: 'Previous Rate',
          type: 'number'
        },
        adjustedRate: {
          title: 'Adjusted Rate',
          type: 'number'
        },
        invoiceType: {
          title: 'Invoice Type',
          type: 'string'
        },
        invoiceNumber: {
          title: 'Invoice No',
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
    this.router.navigate(['../createPhysicalStockAdjustment'], { relativeTo: this.route });
  }

  // handleEdit( row: any ) {
  //   const stockAdjustment = row.data;
  //   this.router.navigate(['../viewPhysicalStockAdjustment', stockAdjustment.lotTransId], { relativeTo: this.route });
  // }

  // onDeleteConfirm(event: any): void {
  //   if (window.confirm('Are you sure you want to delete?')) {
  //     this.service.deleteItemMerge( event.data.lotTransId).subscribe( data => {
  //     event.confirm.resolve();
  //     });

  //   } else {
  //     event.confirm.reject();
  //   }
  // }

}
