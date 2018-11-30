import { CategoryService } from '../categories';
import { Http } from '@angular/http';
import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';

import { AuthenticationService } from '../../../../core/authentication/authentication.service';
import { Logger } from '../../../../core/logger.service';
import { ItemDetailsService } from './itemDetails.service';

const log = new Logger('ItemDetails');

@Component({
  selector: 'itemDetails',
  templateUrl: './itemDetails.html',
  styleUrls: ['./itemDetails.scss']
})
export class ItemDetails {

  query = '';
  settings: any;
  accessList: any[] = [];
  isEdit: any;
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
        /* id: {
          title: 'ID',
          type: 'number'
        }, */
        itemCategory: {
          title: 'Item Category',
          filter: {
            type: 'completer',
            config: {
              completer: {
                // data: this.categoryService.categoryData,
                searchFields: 'categoryName',
                titleField: 'categoryName',
              },
            },
          },
          valuePrepareFunction: (value, row) => row.categoryMaster.catName,
        },
        itemCode: {
          title: 'Item Code',
          type: 'string'
        },
        itemName: {
          title: 'Item Name',
          type: 'string'
        },
        itemDesc: {
          title: 'Description',
          type: 'string'
        },
        costPrice: {
          title: 'Cost Price',
          type: 'number'
        },
        salePrice: {
          title: 'Selling Price',
          type: 'number'
        },
        taxable: {
          title: 'Taxable',
          type: 'boolean',
          editor: {
            type: 'checkbox',
            config: {
              true: 'true',
              false: 'false'
            }
          },
          filter: {
            type: 'checkbox',
            config: {
              true: 'true',
              false: 'false',
              resetText: 'clear',
            }
          }
        }
      }
    };
  }

  source: LocalDataSource = new LocalDataSource();

  constructor(private router: Router,
    private service: ItemDetailsService,
    private route: ActivatedRoute,
    private http: Http,
    private categoryService: CategoryService,
    private authService: AuthenticationService) {


    this.accessList = this.authService.getUserAccessOfMenu('itemDetail');
    let edit = this.accessList.includes("UPDATE");
    let view = this.accessList.includes("GET");
    if (edit == true) {
      this.isEdit = true;
    } else if (view == true) {
      this.isEdit = true;
    } else {
      this.isEdit = false;
    }
    this.settings = this.prepareSetting();

    this.service.getData().subscribe((data) => {
      this.source.load(data);
    });
  }

  handleCreate() {
    this.router.navigate(['../createItemDetail'], { relativeTo: this.route });
  }

  handleEdit(row: any) {
    let edit = this.accessList.includes("UPDATE");
    let view = this.accessList.includes("GET");
    if (edit == true && view == true) {
      view = false;
    } else if (edit == true && view == false) {
      view = false;
    }
    const itemDetails = row.data;
    this.router.navigate(['../editItemDetail/' + view + '/' + itemDetails.itemId], { relativeTo: this.route });
  }

  onDeleteConfirm(event: any): void {
    if (window.confirm('Are you sure you want to delete?')) {
      this.service.deleteItemDetails(event.data.itemId).subscribe(response => {
        // TODO: Need to improve
        this.service.getData().subscribe((data) => {
          this.source.load(data);
        });
      })

    } else {
      // event.confirm.reject();
    }
  }

}
