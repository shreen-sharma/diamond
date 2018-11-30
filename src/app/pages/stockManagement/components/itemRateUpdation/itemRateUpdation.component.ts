import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';

import { AuthenticationService } from '../../../../core/authentication/authentication.service';
import { Logger } from '../../../../core/logger.service';
import { ItemRateUpdationService } from './itemRateUpdation.service';
import { LotService } from '../lots/lot.service';
import { CategoryService } from '.../../app/pages/masters/components/categories/category.service';

const log = new Logger('ItemRateUpdation');

@Component({
  selector: 'itemRateUpdation',
  templateUrl: './itemRateUpdation.html',
  styleUrls: ['./itemRateUpdation.scss']
})
export class ItemRateUpdation {

  query = '';
  pageTitle = 'Updation of Item Rate';

  lotList: any[] = [];
  catList: any[] = [];
  itemList: any[] = [];
  updateItemList: any[] = [];
  settings: any;
  errorMessage: string;
  successMessage: string;
  accessList: any[] = [];
  source: LocalDataSource = new LocalDataSource();

  prepareSetting() {
    return {
      actions: {
        position: 'right',
        add: this.accessList.includes("ADD"),
        edit: false,
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
      delete: {
        deleteButtonContent: '<i class="ion-trash-a"></i>',
        confirmDelete: true
      },
      columns: {
        lotName: {
          title: 'Lot Name',
        },
        itemName: {
          title: 'Item Name',
        },
        availableCts: {
          title: 'Avail. Cts',
        },
        revDate: {
          title: 'Revision Date',
        },
        prevRate: {
          title: 'Previous Rate',
        },
        revisedRate: {
          title: 'Revised Rate',
        },
        prevCP: {
          title: 'Previous CP',
        },
        revisedCP: {
          title: 'Revised CP',
        },
        prevSP: {
          title: 'Previous SP',
        },
        revisedSP: {
          title: 'Revised SP',
        },
        remarks: {
          title: 'Remark',
        }
      }
    };
  }


  constructor(private router: Router,
    private service: ItemRateUpdationService,
    private route: ActivatedRoute,
    private authService: AuthenticationService) {

    this.accessList = this.authService.getUserAccessOfMenu('itemRateUpdation');
    this.settings = this.prepareSetting();
    this.service.getAllItemRateUpdation().subscribe((data) => {
      this.source.load(data);
    });
  }

  handleCreate() {
    this.router.navigate(['../createItemRateUpdation'], { relativeTo: this.route });
  }

  // handleEdit( row: any ) {
  //   const itemRateUpdation = row.data;
  //   this.router.navigate(['../editItemRateUpdation', itemRateUpdation.id], { relativeTo: this.route });
  // }

  // onDeleteConfirm(event: any): void {
  //   (window.confirm('Are you sure you want to delete?'))
  //     //event.confirm.resolve();
  //       this.service.deleteItemRateUpdation(event.data.lotItemId).subscribe(response => {
  //     console.log(response);
  //     this.successMessage = response._body;
  //     setTimeout(() => this.successMessage = null, 5000);
  //      this.service.getAllItemRateUpdation().subscribe((data) => {
  //       this.source.load(data);
  //     });
  //    }, error => {
  //        this.errorMessage = error._body;
  //        log.debug(`delete error: ${error}`);
  //      })
  // }
}
