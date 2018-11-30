import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';

import { AuthenticationService } from '../../../../core/authentication/authentication.service';
import { Logger } from '../../../../core/logger.service';
import { ParaListService } from './paraList.service';

const log = new Logger('ParameterList');

@Component({
  selector: 'paraList',
  templateUrl: './paraList.html',
  styleUrls: ['./paraList.scss']
})
export class ParaList {

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
        paramCode: {
          title: 'Parameter Code',
          type: 'string'
        },
        paramName: {
          title: 'Parameter Name',
          type: 'string'
        },

      }
    };
  }

  source: LocalDataSource = new LocalDataSource();

  constructor(private router: Router,
    private service: ParaListService,
    private authService: AuthenticationService) {


    this.accessList = this.authService.getUserAccessOfMenu('paraList');
    this.settings = this.prepareSetting();

    this.service.getData().subscribe((data) => {
      this.source.load(data);
    });
  }


  onCreateConfirm(event: any, createNew: boolean = false): void {
    const data: any = event.newData;
    debugger;
    this.errorMsg = '';
    const a = data.paramCode;
    const b = data.paramName;
    if (!a || a.trim().length == 0) {
      this.errorMsg = 'Parameter Code field is required';
      setTimeout(() => this.errorMsg = null, 10000);
      event.confirm.reject();
      return;
    }

    if (!b || b.trim().length == 0) {
      this.errorMsg = 'Parameter Name field is required';
      setTimeout(() => this.errorMsg = null, 10000);
      event.confirm.reject();
      return;
    }

    if (a.length > 5) {
      this.errorMsg = 'Parameter Code length must not be more than 5!';
      setTimeout(() => this.errorMsg = null, 10000);
      event.confirm.reject();
      return;
    }

    if (b.length > 100) {
      this.errorMsg = 'Parameter Name length must not be more than 100!';
      setTimeout(() => this.errorMsg = null, 10000);
      event.confirm.reject();
      return;
    }

    this.source.getAll().then(items => {
      items.forEach(element => {

        const c = element.paramCode;
        const d = element.paramName;
        if (a.trim().toUpperCase() == c.trim().toUpperCase()) {
          if (createNew) {
            this.errorMsg = 'Duplicate Parameter Code!';
            setTimeout(() => this.errorMsg = null, 10000);
            event.confirm.reject();
          } else {
            if (data.paramId != element.paramId) {
              this.errorMsg = 'Duplicate Parameter Code!';
              setTimeout(() => this.errorMsg = null, 10000);
              event.confirm.reject();
            }
          }
        }

        if (b.trim().toUpperCase() == d.trim().toUpperCase()) {
          if (createNew) {
            this.errorMsg = 'Duplicate Parameter Name!';
            setTimeout(() => this.errorMsg = null, 10000);
            event.confirm.reject();
          } else {
            if (data.paramId != element.paramId) {
              this.errorMsg = 'Duplicate Parameter Name!';
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
        this.service.createParaList(event.newData).subscribe(dataVal => {
          event.confirm.resolve(dataVal);
        })
      } else {
        this.service.updateParaList(event.newData).subscribe(res => {
          event.confirm.resolve(res);
        })
      }
    })
  }

  // onSaveConfirm(event: any): void {
  //   this.service.updateParaList(event.newData).subscribe(data => {
  //     event.confirm.resolve(data);
  //   })
  // }

  onDeleteConfirm(event: any): void {
    if (window.confirm('Are you sure you want to delete?')) {
      this.service.deleteParaList(event.data.paramId).subscribe(data => {
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
