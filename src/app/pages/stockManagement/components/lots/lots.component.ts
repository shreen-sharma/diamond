import { CreatedDateRenderComponent } from '../../../../shared/createdDateRenderComponent/createdDateRender.component';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalDataSource, ServerDataSource } from 'ng2-smart-table';
import { Http, RequestOptions, Headers } from '@angular/http';
import { AuthenticationService } from '../../../../core/authentication/authentication.service';
import { Logger } from '../../../../core/logger.service';
import { LotService } from './lot.service';

const log = new Logger('lots');

@Component({
  selector: 'lots',
  templateUrl: './lots.html',
  styleUrls: ['./lots.scss']
})
export class Lots {

  lotData = [];
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
        lotName: {
          title: 'LOT Name',
          type: 'string'
        },
        lotCode: {
          title: 'LOT Code',
          type: 'string'
        },
        creationDate: {
          title: 'Created Date',
          type: 'text',
          editor: {
            type: 'custom',
            component: CreatedDateRenderComponent,
          }
        }
      }
    };
  }
  source: LocalDataSource = new LocalDataSource();
  constructor(
    private service: LotService,
    private http: Http,
    private authService: AuthenticationService
  ) {

    this.accessList = this.authService.getUserAccessOfMenu('lots');
    this.settings = this.prepareSetting();
    this.service.getData().subscribe((data) => {
      this.source.load(data);
    });
  }

  onCreateConfirm(event: any, createNew: boolean = false): void {
    const data: any = event.newData;
    debugger;
    this.errorMsg = '';
    const a = data.lotName;
    const b = data.lotCode;
    if (!a || a.trim().length == 0) {
      this.errorMsg = 'Lot Name field is required';
      setTimeout(() => this.errorMsg = null, 10000);
      event.confirm.reject();
      return;
    }

    if (!b || b.trim().length == 0) {
      this.errorMsg = 'Lot Code field is required';
      setTimeout(() => this.errorMsg = null, 10000);
      event.confirm.reject();
      return;
    }

    if (b.length > 10) {
      this.errorMsg = 'Lot Code length must not be more than 10!';
      setTimeout(() => this.errorMsg = null, 10000);
      event.confirm.reject();
      return;
    }

    if (a.length > 100) {
      this.errorMsg = 'Lot Name length must not be more than 100!';
      setTimeout(() => this.errorMsg = null, 10000);
      event.confirm.reject();
      return;
    }

    this.source.getAll().then(items => {
      items.forEach(element => {

        const c = element.lotName;
        const d = element.lotCode;
        if (a.trim().toUpperCase() == c.trim().toUpperCase()) {
          if (createNew) {
            this.errorMsg = 'Duplicate Lot Name!';
            setTimeout(() => this.errorMsg = null, 10000);
            event.confirm.reject();
          } else {
            if (data.lotId != element.lotId) {
              this.errorMsg = 'Duplicate Lot Name!';
              setTimeout(() => this.errorMsg = null, 10000);
              event.confirm.reject();
            }
          }
        }

        if (b.trim().toUpperCase() == d.trim().toUpperCase()) {
          if (createNew) {
            this.errorMsg = 'Duplicate Lot Code!';
            setTimeout(() => this.errorMsg = null, 10000);
            event.confirm.reject();
          } else {
            if (data.lotId != element.lotId) {
              this.errorMsg = 'Duplicate Lot Code!';
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
      this.service.deleteLot(event.data.lotId).subscribe(data => {
        //event.confirm.resolve();
        this.service.getData().subscribe((data) => {
          this.source.load(data);
        });
      })
    } else {
      event.confirm.reject();
    }
  }

}
