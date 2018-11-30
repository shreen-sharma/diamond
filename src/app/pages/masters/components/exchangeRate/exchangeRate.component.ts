import { CurrencyService } from '../currency';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';

import { AuthenticationService } from '../../../../core/authentication/authentication.service';
import { Logger } from '../../../../core/logger.service';
import { ExchangeRateService } from './exchangeRate.service';

const log = new Logger('ExchangeRate');

@Component({
  selector: 'ExchangeRate',
  templateUrl: './exchangeRate.html',
  styleUrls: ['./exchangeRate.scss']
})
export class ExchangeRate {

  query = '';
  errorMsg: string;
  todayDate: string;

  settings: any;
  currencyFromList: any[] = [];
  currencyToList: any[] = [];
  currList: any[] = [];

  accessList: any[] = [];

  source: LocalDataSource = new LocalDataSource();

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

        // exchangeRateType: {
        exchType: {

          title: 'Exchange Rate Type',
          editor: {
            type: 'list',
            config: {
              selectText: 'select',
              // list: [{value: 'F', label: 'Foreign'}, {value: 'L', title: 'Local'}],
              list: [{ value: 'IM', title: 'Import' }, { value: 'EX', title: 'Export' }, { value: 'ST', title: 'Stock' }],
            },
          },
          filter: {
            type: 'list',
            config: {
              selectText: 'All',
              // list: [{value: 'F', label: 'Foreign'}, {value: 'L', title: 'Local'}],
              list: [{ value: 'IM', title: 'Import' }, { value: 'EX', title: 'Export' }, { value: 'ST', title: 'Stock' }],
            },
          },
          valuePrepareFunction: value => this.getExchangeTypeTitle(value),
        },
        currencyMasterByFromCurrId: {

          title: 'From Currency',
          editor: {
            type: 'list',
            config: {
              selectText: 'select',
              list: this.currencyFromList,
            },
          },
          filter: {
            type: 'list',
            config: {
              selectText: 'All',
              list: this.currencyFromList,
            },
          },
          valuePrepareFunction: value => this.getCurrencyFromById(value),
        },

        currencyMasterByToCurrId: {
          title: 'To Currency',
          editor: {
            type: 'list',
            config: {
              selectText: 'Select',
              list: this.currencyToList,
            },
          },
          filter: {
            type: 'list',
            config: {
              selectText: 'All',
              list: this.currencyToList,
            },
          },
          valuePrepareFunction: value => this.getCurrencyToById(value),
        },

        fromDate: {
          title: 'From Date (YYYY-MM-DD)',
          type: 'string',
          editable: false,
        },

        toDate: {
          title: 'To Date (YYYY-MM-DD)',
          type: 'string',
          editable: false,
        },

        exchRate: {
          title: 'Exchange Rate',
          type: 'number'
        }
      }
    };
  }

  constructor(private router: Router,
    private service: ExchangeRateService,
    private currencyService: CurrencyService,
    private authService: AuthenticationService) {

    this.accessList = this.authService.getUserAccessOfMenu('exchangeRate');

    this.todayDate = this.today();

    this.currencyService.getAllCurrencies().subscribe((currencyData) => {
      currencyData.forEach(currency => {
        this.currencyFromList.push({ value: currency.currId, title: currency.currName });
        this.currencyToList.push({ value: currency.currId, title: currency.currName });
      });
      if (this.currencyToList) {
        this.settings = this.prepareSetting();
      }
    });

    // this.currencyService.getAllCurrencies().subscribe((currencyData) => {
    //   currencyData.forEach(currency => {
    //    this.currencyToList.push({value: currency.currId, title: currency.currName});
    //   });
    //   if (this.currencyFromList) {
    //     this.settings = this.prepareSetting();
    //   }
    // });

    this.service.getData().subscribe((data) => {
      this.source.load(data);
    });

  }

  getCurrencyFromById(currencyId: any) {
    const len: number = this.currencyFromList.length;
    for (let i = 0; i < len; i++) {
      if (this.currencyToList[i].value === currencyId) {
        return this.currencyToList[i].title;
      }
    }
    //  }
    return currencyId;
  }

  getCurrencyToById(currencyId: any) {
    const len: number = this.currencyToList.length;

    for (let i = 0; i < len; i++) {
      if (this.currencyToList[i].value === currencyId) {
        return this.currencyToList[i].title;
      }
    }
    return currencyId;
  }

  getExchangeTypeTitle(exchId: any) {
    let title = '';
    if (exchId == 'IM') {
      title = 'Import'
    } else if (exchId == 'EX') {
      title = 'Export';
    } else if (exchId == 'ST') {
      title = 'Stock';
    } else {
      title = exchId;
    }
    return title;
  }

  today(): string {
    const today = new Date();
    const dd = today.getDate();
    const mm = today.getMonth() + 1; //January is 0!

    const yyyy = today.getFullYear();
    return yyyy + '-' + (mm < 10 ? '0' + mm : mm) + '-' + (dd < 10 ? '0' + dd : dd);
  }


  onCreateConfirm(event: any, createNew: boolean = false): void {
    const data: any = event.newData;
    debugger;
    this.errorMsg = '';
    if (!data.exchType) {
      this.errorMsg = 'Exchange Rate Type field is required';
      setTimeout(() => this.errorMsg = null, 10000);
      event.confirm.reject();
      return;
    }

    if (!data.currencyMasterByFromCurrId) {
      this.errorMsg = 'From Currency field is required';
      setTimeout(() => this.errorMsg = null, 10000);
      event.confirm.reject();
      return;
    }

    if (!data.currencyMasterByToCurrId) {
      this.errorMsg = 'To Currency field is required';
      setTimeout(() => this.errorMsg = null, 10000);
      event.confirm.reject();
      return;
    }

    if (data.currencyMasterByFromCurrId == data.currencyMasterByToCurrId) {
      this.errorMsg = 'From Currency & To Currency should not be same.';
      setTimeout(() => this.errorMsg = null, 10000);
      event.confirm.reject();
      return;
    }

    // if (!data.fromDate) {
    //   this.errorMsg = 'From Date field is required';
    //   setTimeout(() => this.errorMsg = null, 10000);
    //   event.confirm.reject();
    //   return;
    // }

    // if (!data.toDate) {
    //   this.errorMsg = 'To Date field is required';
    //   setTimeout(() => this.errorMsg = null, 10000);
    //   event.confirm.reject();
    //   return;
    // }

    if (!data.exchRate || data.exchRate == 0) {
      this.errorMsg = 'Exchange Rate field is required & Cannot be 0';
      setTimeout(() => this.errorMsg = null, 10000);
      event.confirm.reject();
      return;
    }

    const a: string = data.exchRate.toString();
    if (a.trim().length == 0) {
      this.errorMsg = 'Exchange Rate field is required';
      setTimeout(() => this.errorMsg = null, 10000);
      event.confirm.reject();
      return;
    }

    if (isNaN(data.exchRate) || data.exchRate.length > 10) {
      this.errorMsg = 'Exchange Rate should be a Number!';
      setTimeout(() => this.errorMsg = null, 10000);
      event.confirm.reject();
      return;
    }
    if (this.errorMsg) {
      return;
    }

    if (createNew) {
      this.service.addCustomExchangeRate(event.newData).subscribe(res => {
        event.confirm.resolve();
        this.service.getData().subscribe((data) => {
          this.source.load(data);
        });

      })
    } else {
      this.service.updateCustomExchangeRate(event.newData).subscribe(res => {
        this.service.getData().subscribe((data) => {
          this.source.load(data);
        });
      })
    }
    // const b = data.fromDate;
    // const c = b.split('-');
    // if (b.length != 10 || c.length != 3 || isNaN(c[0]) || c[0].length != 4 || isNaN(c[1]) || c[1].length != 2 || isNaN(c[2]) || c[2].length != 2) {
    //   this.errorMsg = 'Invalid Format of From Date ( Valid Date Example- 2017-01-01 / 2017-12-30 )!';
    //   setTimeout(() => this.errorMsg = null, 10000);
    //   event.confirm.reject();
    //   return;
    // }

    // const d = data.toDate;
    // const e = d.split('-');
    // if (d.length != 10 || e.length != 3 || isNaN(e[0]) || e[0].length != 4 || isNaN(e[1]) || e[1].length != 2 || isNaN(e[2]) || e[2].length != 2) {
    //   this.errorMsg = 'Invalid Format of To Date ( Valid Date Example- 2017-01-01 / 2017-12-30 )!';
    //   setTimeout(() => this.errorMsg = null, 10000);
    //   event.confirm.reject();
    //   return;
    // }

    // if (c[1] > 12 || c[1] < 1 || e[1] > 12 || e[1] < 1) {
    //   this.errorMsg = 'Month should be between 1-12!';
    //   setTimeout(() => this.errorMsg = null, 10000);
    //   event.confirm.reject();
    //   return;
    // }

    // if (c[2] > 31 || c[2] < 1 || e[2] > 31 || e[2] < 1) {
    //   this.errorMsg = 'Day should be between 1-31!';
    //   setTimeout(() => this.errorMsg = null, 10000);
    //   event.confirm.reject();
    //   return;
    // } 

    // if(b.toString() > d.toString()) {
    //   this.errorMsg = 'From Date should be Less than To Date!';
    //   setTimeout(() => this.errorMsg = null, 10000);
    //   event.confirm.reject();
    //   return;
    // }


    // this.source.getAll().then( items => {
    // items.forEach(element => {

    //   if(data.exchType == element.exchType && 
    //     data.currencyMasterByFromCurrId == element.currencyMasterByFromCurrId && 
    //     data.currencyMasterByToCurrId == element.currencyMasterByToCurrId) {
    //     if (createNew) {
    //       this.errorMsg = 'Duplicate Entry for Exchange Rate!';
    //       setTimeout(() => this.errorMsg = null, 10000);
    //       event.confirm.reject();
    //     } else {
    //         if (data.customExchId != element.customExchId) {
    //           this.errorMsg = 'Duplicate Entry for Exchange Rate!';
    //           setTimeout(() => this.errorMsg = null, 10000);
    //           event.confirm.reject();
    //         }
    //     }
    //   }
    // });

    // if (this.errorMsg) {
    //   return;
    // }
    // this.service.updateCustomExchangeRate(event.newData).subscribe( res => {
    //   event.confirm.resolve(res);
    // })

    // if (createNew) {
    //   items.forEach(element => {
    //     if(element.exchType == event.newData.exchType && element.currencyMasterByFromCurrId == event.newData.currencyMasterByFromCurrId
    //       && element.currencyMasterByToCurrId == event.newData.currencyMasterByToCurrId
    //       && (element.toDate.trim().length == 0 || element.toDate == '' || element.toDate == null)) {


    //         element.toDate = this.todayDate;
    //         this.service.updateCustomExchangeRate(element).subscribe( res => {
    //           // event.confirm.resolve(res);
    //         });
    //     }
    //   });
    //   if(event.newData.fromDate == '') {
    //     event.newData.fromDate = this.todayDate;
    //     event.newData.toDate = '';
    //     this.service.addCustomExchangeRate(event.newData).subscribe(dataVal => {
    //       event.confirm.resolve(dataVal);
    //     })
    //   }

    // } else {
    //   this.service.updateCustomExchangeRate(event.newData).subscribe( res => {
    //     event.confirm.resolve(res);
    //   })
    // }
    // })
  }

  // onSaveConfirm(event: any): void {
  //   this.service.updateCustomExchangeRate(event.newData).subscribe(data => {
  //     event.confirm.resolve(data);
  //  })
  // }

  onDeleteConfirm(event: any): void {
    if (window.confirm('Are you sure you want to delete?')) {
      this.service.deleteCustomExchangeRate(event.data.customExchId).subscribe(data => {
        //event.confirm.resolve();
        this.service.getData().subscribe((resp) => {
          this.source.load(resp);
        });
      })
    } else {
      event.confirm.reject();
    }
  }

}
