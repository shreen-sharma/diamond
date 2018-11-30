import { Http } from '@angular/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';

import { AuthenticationService } from '../../../../core/authentication/authentication.service';
import { Logger } from '../../../../core/logger.service';
import { CategoryService } from './category.service';

const log = new Logger('categories');

@Component({
  selector: 'categories',
  templateUrl: './categories.html',
  styleUrls: ['./categories.scss']
})
export class Categories {

  query = '';
  errorMsg: string;
  accessList: any[] = [];
  settings: any;
  prepareSetting() {
    return {
      actions: {
        position: 'right',
        add: this.accessList.includes("ADD"),
        edit: this.accessList.includes("UPDATE"),
        delete: this.accessList.includes("DELETE"),
      },
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
        catCode: {
          title: 'Category Code',
          type: 'string'
        },
        catName: {
          title: 'Category Name',
          type: 'string'
        },
        description: {
          title: 'Description',
          type: 'string'
        },
        statisticalCode: {
          title: 'HSN No.',
          type: 'string'
        }
      }
    };
  }

  source: LocalDataSource = new LocalDataSource();
  constructor(
    private service: CategoryService,
    private http: Http,
    private authService: AuthenticationService) {
    this.accessList = this.authService.getUserAccessOfMenu('categories');

    this.settings=this.prepareSetting();
    this.service.getData().subscribe((data) => {
      this.source.load(data);
    });


  }

  onCreateConfirm(event: any, createNew: boolean = false): void {
    const data: any = event.newData;
    debugger;
    this.errorMsg = '';
    const a = data.catCode;
    const b = data.catName;
    const h = data.statisticalCode;
    if (!a || a.trim().length == 0) {
      this.errorMsg = 'Category Code field is required';
      setTimeout(() => this.errorMsg = null, 10000);
      event.confirm.reject();
      return;
    }
    if (!b || b.trim().length == 0) {
      this.errorMsg = 'Category Name field is required';
      setTimeout(() => this.errorMsg = null, 10000);
      event.confirm.reject();
      return;
    }

    if (!h || h.trim().length == 0) {
      this.errorMsg = 'HSN No. field is required';
      setTimeout(() => this.errorMsg = null, 10000);
      event.confirm.reject();
      return;
    }

    if (a.length > 5) {
      this.errorMsg = 'Category Code length must not be more than 5.';
      setTimeout(() => this.errorMsg = null, 10000);
      event.confirm.reject();
      return;
    }
    if (b.length > 100) {
      this.errorMsg = 'Category Name length must not be more than 100.';
      setTimeout(() => this.errorMsg = null, 10000);
      event.confirm.reject();
      return;
    }
    if (data.description.length > 100) {
      this.errorMsg = 'Description length must not be more than 100.';
      setTimeout(() => this.errorMsg = null, 10000);
      event.confirm.reject();
      return;
    }
    if (h.length > 25) {
      this.errorMsg = 'HSN No. must not be more than 25.';
      setTimeout(() => this.errorMsg = null, 10000);
      event.confirm.reject();
      return;
    }

    this.source.getAll().then(items => {
      items.forEach(element => {

        const c = element.catCode;
        const d = element.catName;
        const e = element.statisticalCode;
        if (a.trim().toUpperCase() == c.trim().toUpperCase()) {
          if (createNew) {
            this.errorMsg = 'Duplicate Category Code!';
            setTimeout(() => this.errorMsg = null, 10000);
            event.confirm.reject();
          } else {
            if (data.catId != element.catId) {
              this.errorMsg = 'Duplicate Category Code!';
              setTimeout(() => this.errorMsg = null, 10000);
              event.confirm.reject();
            }
          }
        }

        if (b.trim().toUpperCase() == d.trim().toUpperCase()) {
          if (createNew) {
            this.errorMsg = 'Duplicate Category Name!';
            setTimeout(() => this.errorMsg = null, 10000);
            event.confirm.reject();
          } else {
            if (data.catId != element.catId) {
              this.errorMsg = 'Duplicate Category Name!';
              setTimeout(() => this.errorMsg = null, 10000);
              event.confirm.reject();
            }
          }
        }

        if (h.trim().toUpperCase() == e.trim().toUpperCase()) {
          if (createNew) {
            this.errorMsg = 'Duplicate HSN No.!';
            setTimeout(() => this.errorMsg = null, 10000);
            event.confirm.reject();
          } else {
            if (data.catId != element.catId) {
              this.errorMsg = 'Duplicate HSN No.!';
              setTimeout(() => this.errorMsg = null, 10000);
              event.confirm.reject();
            }
          }
        }
      });

      if (this.errorMsg) {
        return;
      }

      if (createNew) {
        this.service.createLot(event.newData).subscribe(dataVal => {
          event.confirm.resolve(dataVal);
        })
      } else {
        this.service.updateLot(event.newData).subscribe(res => {
          event.confirm.resolve(res);
        })
      }
    })
  }

  // onSaveConfirm(event: any): void {
  //   this.service.updateLot(event.newData).subscribe(data => {
  //     event.confirm.resolve(data);
  //   })
  // }

  onDeleteConfirm(event: any): void {
    if (window.confirm('Are you sure you want to delete?')) {
      this.service.deleteLot(event.data.catId).subscribe(data => {
        // event.confirm.resolve();
        this.service.getData().subscribe((resp) => {
          this.source.load(resp);
        });
      })
    } else {
      event.confirm.reject();
    }
  }

}
