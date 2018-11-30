import { Http } from '@angular/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';

import { AuthenticationService } from '../../../../core/authentication/authentication.service';
import { Logger } from '../../../../core/logger.service';
import { CurrencyService } from './currency.service';

const log = new Logger('currency');

@Component({
  selector: 'currency',
  templateUrl: './currency.html',
  styleUrls: ['./currency.scss']
})
export class Currency {

  query = '';
  errorMsg: string;
  settings: any;
  accessList: any[] = [];

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
        currName: {
          title: 'Currency Name',
          type: 'string'
        },
        currCode: {
          title: 'Currency Code',
          type: 'string'
        },
        convertible: {
          title: 'Freely Convertible',
          editor: {
            type: 'list',
            config: {
              selectText: 'Select',
              list: [
                { value: 'Y', title: 'Yes' },
                { value: 'N', title: 'No' },
              ],
            },
          },
          filter: {
            type: 'list',
            config: {
              selectText: 'All',
              list: [
                { value: 'Y', title: 'Yes' },
                { value: 'N', title: 'No' },
              ],
              //     type: 'boolean',
              // editor: {
              //   type: 'checkbox',
              //   config: {
              //    true: 'Y',
              //     false: 'N',
              //   }
              //   },
              // filter: {
              //   type: 'checkbox',
              //   config: {
              //     true: 'Y',
              //     false: 'N',
              //     resetText: 'clear',
              //   }
              // }
            },
          },
        },
      }
    };
  }

  source: LocalDataSource = new LocalDataSource();
  constructor(private service: CurrencyService, private http: Http, private authService:AuthenticationService) {

    this.accessList = this.authService.getUserAccessOfMenu('currency');
    this.settings = this.prepareSetting();

    this.service.getAllCurrencies().subscribe((data) => {
      this.source.load(data);
    });
  }

  onCreateConfirm(event: any, createNew: boolean = false): void {
    const data: any = event.newData;
    debugger;
    this.errorMsg = '';
    const a = data.currName;
    const b = data.currCode;
    if (!a || a.trim().length == 0) {
      this.errorMsg = 'Currency Name field is required';
      setTimeout(() => this.errorMsg = null, 10000);
      event.confirm.reject();
      return;
    }

    if (!b || b.trim().length == 0) {
      this.errorMsg = 'Currency Code field is required';
      setTimeout(() => this.errorMsg = null, 10000);
      event.confirm.reject();
      return;
    }

    if (!data.convertible) {
      this.errorMsg = 'Freely Convertible field is required';
      setTimeout(() => this.errorMsg = null, 10000);
      event.confirm.reject();
      return;
    }

    if (b.length > 5) {
      this.errorMsg = 'Currency Code length must not be more than 5!';
      setTimeout(() => this.errorMsg = null, 10000);
      event.confirm.reject();
      return;
    }

    if (a.length > 100) {
      this.errorMsg = 'Currency Name length must not be more than 100!';
      setTimeout(() => this.errorMsg = null, 10000);
      event.confirm.reject();
      return;
    }

    this.source.getAll().then(items => {
      items.forEach(element => {

        const c = element.currName;
        const d = element.currCode;
        if (a.trim().toUpperCase() == c.trim().toUpperCase()) {
          if (createNew) {
            this.errorMsg = 'Duplicate Currency Name!';
            setTimeout(() => this.errorMsg = null, 10000);
            event.confirm.reject();
          } else {
            if (data.currId != element.currId) {
              this.errorMsg = 'Duplicate Currency Name!';
              setTimeout(() => this.errorMsg = null, 10000);
              event.confirm.reject();
            }
          }
        }

        if (b.trim().toUpperCase() == d.trim().toUpperCase()) {
          if (createNew) {
            this.errorMsg = 'Duplicate Currency Code!';
            setTimeout(() => this.errorMsg = null, 10000);
            event.confirm.reject();
          } else {
            if (data.currId != element.currId) {
              this.errorMsg = 'Duplicate Currency Code!';
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
        this.service.addCurrency(event.newData).subscribe(dataVal => {
          event.confirm.resolve(dataVal);
        })
      } else {
        this.service.updateCurrency(event.newData).subscribe(res => {
          event.confirm.resolve(res);
        })
      }
    })
  }

  // onSaveConfirm(event: any): void {
  //   this.service.updateCurrency(event.newData).subscribe(data => {
  //     event.confirm.resolve(data);
  //   })
  // }

  onDeleteConfirm(event: any): void {
    if (window.confirm('Are you sure you want to delete?')) {
      this.service.deleteCurrency(event.data.currId).subscribe(data => {
        //event.confirm.resolve();
        this.service.getAllCurrencies().subscribe((resp) => {
          this.source.load(resp);
        });
      })
    } else {
      event.confirm.reject();
    }
  }

}
