import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';

import { AuthenticationService } from '../../../../core/authentication/authentication.service';
import { Logger } from '../../../../core/logger.service';
import { ProTypeService } from './proType.service';

const log = new Logger('ProcessType');

@Component({
  selector: 'proType',
  templateUrl: './proType.html',
  styleUrls: ['./proType.scss']
})
export class ProType {

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
        processCode: {
          title: 'Process Code',
          type: 'string'
        },
        processName: {
          title: 'Process Name',
          type: 'string'
        },
        chargeRequired: {
          title: 'Chargeable',
          type: 'boolean',
          editor: {
            type: 'checkbox',
            config: {
              true: 'Y',
              false: 'N'
            }
          },
          filter: {
            type: 'checkbox',
            config: {
              true: 'Y',
              false: 'N',
              resetText: 'clear',
            }
          }
        },
      },
    };
  }
  source: LocalDataSource = new LocalDataSource();

  constructor(private router: Router,
    private service: ProTypeService,
    private http: Http,
    private authService: AuthenticationService) {

    this.accessList = this.authService.getUserAccessOfMenu('proType');
    this.settings = this.prepareSetting();

    this.service.getData().subscribe((data) => {
      this.source.load(data);
    });
  }

  onCreateConfirm(event: any, createNew: boolean = false): void {
    const data: any = event.newData;
    debugger;
    this.errorMsg = '';
    const a = data.processCode;
    const b = data.processName;
    if (!a || a.trim().length == 0) {
      this.errorMsg = 'Process Code field is required';
      setTimeout(() => this.errorMsg = null, 10000);
      event.confirm.reject();
      return;
    }

    if (!b || b.trim().length == 0) {
      this.errorMsg = 'Process Name field is required';
      setTimeout(() => this.errorMsg = null, 10000);
      event.confirm.reject();
      return;
    }

    if (a.length > 5) {
      this.errorMsg = 'Process Code length must not be more than 5!';
      setTimeout(() => this.errorMsg = null, 10000);
      event.confirm.reject();
      return;
    }

    if (b.length > 100) {
      this.errorMsg = 'Process Name length must not be more than 100!';
      setTimeout(() => this.errorMsg = null, 10000);
      event.confirm.reject();
      return;
    }

    this.source.getAll().then(items => {
      items.forEach(element => {

        const c = element.processCode;
        const d = element.processName;
        if (a.trim().toUpperCase() == c.trim().toUpperCase()) {
          if (createNew) {
            this.errorMsg = 'Duplicate Process Code!';
            setTimeout(() => this.errorMsg = null, 10000);
            event.confirm.reject();
          } else {
            if (data.processTypeId != element.processTypeId) {
              this.errorMsg = 'Duplicate Process Code!';
              setTimeout(() => this.errorMsg = null, 10000);
              event.confirm.reject();
            }
          }
        }

        if (b.trim().toUpperCase() == d.trim().toUpperCase()) {
          if (createNew) {
            this.errorMsg = 'Duplicate Process Name!';
            setTimeout(() => this.errorMsg = null, 10000);
            event.confirm.reject();
          } else {
            if (data.processTypeId != element.processTypeId) {
              this.errorMsg = 'Duplicate Process Name!';
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
        this.service.createProType(event.newData).subscribe(dataVal => {
          event.confirm.resolve(dataVal);
        })
      } else {
        this.service.updateProType(event.newData).subscribe(res => {
          event.confirm.resolve(res);
        })
      }
    })
  }

  // onSaveConfirm(event: any): void {
  //   this.service.updateProType(event.newData).subscribe(data => {
  //     event.confirm.resolve(data);
  //   })
  // }

  onDeleteConfirm(event: any): void {
    if (window.confirm('Are you sure you want to delete?')) {
      this.service.deleteProType(event.data.processTypeId).subscribe(data => {
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
