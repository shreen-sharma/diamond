import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';

import { AuthenticationService } from '../../../../core/authentication/authentication.service';
import { Logger } from '../../../../core/logger.service';
import { ProDetailService } from './proDetails.service';
import { ProTypeService } from '../processType/proType.service';

const log = new Logger('proDetails');

@Component({
  selector: 'proDetails',
  templateUrl: './proDetails.html',
  styleUrls: ['./proDetails.scss']
})
export class ProDetails {

  query = '';
  proList: any[] = [];
  source: LocalDataSource = new LocalDataSource();
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
        processType: {
          title: 'Process Type',
          type: 'string',
          valuePrepareFunction: value => this.getProName(value),
        },
        code: {
          title: 'Process Code',
          type: 'string'
        },
        name: {
          title: 'Process Name',
          type: 'string'
        },
        chargeRequired: {
          title: 'Chargeable',
          type: 'boolean',
          editor: {
            type: 'checkbox',
            config: {
              true: 'Yes',
              false: 'No'
            }
          },
          filter: {
            type: 'checkbox',
            config: {
              true: 'Yes',
              false: 'No',
              resetText: 'clear',
            }
          }
        },
      }
    };
  }

  constructor(private router: Router,
    private service: ProDetailService,
    private route: ActivatedRoute,
    private proService: ProTypeService,
    private authService: AuthenticationService) {

    this.accessList = this.authService.getUserAccessOfMenu('proDetail');
    const edit = this.accessList.includes("UPDATE");
    const view = this.accessList.includes("GET");
    if (edit == true) {
      this.isEdit = true;
    } else if (view == true) {
      this.isEdit = true;
    }
    this.settings = this.prepareSetting();

    this.service.getData().subscribe((data) => {
      this.source.load(data);
    });

    this.proService.getData().subscribe(res => {
      this.proList = res;
    });

  }
  getProName(value: any) {
    this.proList.forEach((type) => {
      if (value == type.processTypeId) {
        value = type.processName;
      }
    });
    return value;
  }

  handleCreate() {
    this.router.navigate(['../createProcessDetails'], { relativeTo: this.route });
  }

  handleEdit(row: any) {
    let edit = this.accessList.includes("UPDATE");
    let view = this.accessList.includes("GET");
    if (edit == true && view == true) {
      view = false;
    } else if (edit == true && view == false) {
      view = false;
    }
    const proDetails = row.data;
    this.router.navigate(['../editProcessDetails/' + view + '/' + proDetails.processId], { relativeTo: this.route });
  }

  onDeleteConfirm(event: any): void {
    debugger;
    if (window.confirm('Are you sure you want to delete?')) {
      this.service.deleteProcessDetails(event.data.processId).subscribe(data => {
        // event.confirm.resolve();
        this.service.getData().subscribe((dataw) => {
          this.source.load(dataw);
        });
      })
    } else {
      // event.confirm.reject();
    }
  }

}
