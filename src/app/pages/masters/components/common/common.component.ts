import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';

import { AuthenticationService } from '../../../../core/authentication/authentication.service';
import { Logger } from '../../../../core/logger.service';
import { CommonService } from './common.service';
import { forEach } from '@angular/router/src/utils/collection';

const log = new Logger('common');

@Component({
  selector: 'common',
  templateUrl: './common.html',
  styleUrls: ['./common.scss']
})
export class Common {
  query = '';
  errorMsg: string;
  settings: any;
  accessList: any[] = [];
  nameList: any[] = [
    { value: 'AC', title: 'Bank Account Type' },
    { value: 'BK', title: 'Bank Code' },
    { value: 'BN', title: 'Business Nature' },
    { value: 'BT', title: 'Business Type' },
    { value: 'BX', title: 'Box Size' },
    { value: 'BY', title: 'Bank Type' },
    { value: 'CH', title: 'Charge Type' },
    { value: 'CM', title: 'Communication Type' },
    { value: 'CT', title: 'Company Type' },
    { value: 'DE', title: 'Despatched By Note' },
    { value: 'DS', title: 'Designation' },
    { value: 'EU', title: 'Export Under' },
    { value: 'FN', title: 'Firm Nature' },
    { value: 'IT', title: 'Invoice Type' },
    { value: 'KC', title: 'Kind of Container' },
    { value: 'MA', title: 'Mark No' },
    { value: 'NI', title: 'Negotiation Issue' },
    { value: 'PM', title: 'Payment Mode' },
    { value: 'PX', title: 'Prefix' },
    { value: 'SH', title: 'Shipment Type' },
    { value: 'SL', title: 'Salutation' },
    { value: 'SX', title: 'Suffix' },
    { value: 'TS', title: 'Terms Description' },
    { value: 'UT', title: 'Unit Detail' },
  ]

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

        itemType: {
          title: 'Item Type',
          editor: {
            type: 'list',
            config: {
              selectText: 'Select',
              list: this.nameList,
            },
          },
          filter: {
            type: 'list',
            config: {
              selectText: 'All',
              list: this.nameList,
            },
          },
          valuePrepareFunction: value => {
            debugger;
            for (let nameList of this.nameList) {
              if (value === nameList.value)
                return nameList.title;
            }
            return value;
          }
        },
        name: {
          title: 'Common Name'
        },
        code: {
          title: 'Common Code'
        },
      }
    };
  }

  source: LocalDataSource = new LocalDataSource();

  constructor(private router: Router,
    private service: CommonService,
    private authService: AuthenticationService) {

    this.accessList = this.authService.getUserAccessOfMenu('common');
    this.settings = this.prepareSetting();
    this.service.getAllCommonMaster().subscribe((data) => {
      this.source.load(data);
    })
  }

  onCreateConfirm(event: any, createNew: boolean = false): void {
    const data: any = event.newData;
    debugger;
    this.errorMsg = '';
    const name = data.name;
    const code = data.code;
    if (!data.itemType) {
      this.errorMsg = 'Item Type field is required';
      setTimeout(() => this.errorMsg = null, 10000);
      event.confirm.reject();
      return;
    }

    if (!name || name.trim().length == 0) {
      this.errorMsg = 'Common Name field is required';
      setTimeout(() => this.errorMsg = null, 10000);
      event.confirm.reject();
      return;
    }

    if (!code || code.trim().length == 0) {
      this.errorMsg = 'Common Code field is required';
      setTimeout(() => this.errorMsg = null, 10000);
      event.confirm.reject();
      return;
    }

    if (code.length > 5) {
      this.errorMsg = 'Common Code length must not be more than 5!';
      setTimeout(() => this.errorMsg = null, 10000);
      event.confirm.reject();
      return;
    }

    if (name.length > 100) {
      this.errorMsg = 'Common Name length must not be more than 100!';
      setTimeout(() => this.errorMsg = null, 10000);
      event.confirm.reject();
      return;
    }

    this.source.getAll().then(items => {
      items.forEach(element => {

        const c = element.name;
        const d = element.code;
        if (name.trim().toUpperCase() === c.trim().toUpperCase()) {
          if (createNew) {
            this.errorMsg = 'Duplicate Common Name!';
            setTimeout(() => this.errorMsg = null, 10000);
            event.confirm.reject();
          } else {
            if (data.id != element.id) {
              this.errorMsg = 'Duplicate Common Name!';
              setTimeout(() => this.errorMsg = null, 10000);
              event.confirm.reject();
            }
          }
        }

        if (code.trim().toUpperCase() == d.trim().toUpperCase()) {
          if (createNew) {
            this.errorMsg = 'Duplicate Common Code!';
            setTimeout(() => this.errorMsg = null, 10000);
            event.confirm.reject();
          } else {
            if (data.id != element.id) {
              this.errorMsg = 'Duplicate Common Code!';
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
        this.service.createCommon(event.newData).subscribe(dataVal => {
          event.confirm.resolve(dataVal);
        })
      } else {
        this.service.updateCommon(event.newData).subscribe(res => {
          event.confirm.resolve(res);
        })
      }
    })
  }

  onDeleteConfirm(event: any): void {
    if (window.confirm('Are you sure you want to delete?')) {
      this.service.deleteCommon(event.data.id).subscribe(data => {
        // event.confirm.resolve();
        this.service.getAllCommonMaster().subscribe((resp) => {
          this.source.load(resp);
        });
      })
    } else {
      event.confirm.reject();
    }
  }
}
