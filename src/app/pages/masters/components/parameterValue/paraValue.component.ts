import {Component} from '@angular/core';
import { Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { Http } from '@angular/http';
import { AuthenticationService } from '../../../../core/authentication/authentication.service';
import { Logger } from '../../../../core/logger.service';
import { ParaValueService } from './paraValue.service';
import { ParaListService } from '../parameterList/paraList.service';

const log = new Logger('ParameterValue');

@Component({
  selector: 'paraValue',
  templateUrl: './paraValue.html',
  styleUrls: ['./paraValue.scss']
})
export class ParaValue {

  query = '';
  paraList: any[] = [];
  errorMsg: string;
  settings: any;
  accessList: any[] = [];

  parameterTypeList: any[] = [];


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
      confirmCreate: true
    },
    edit: {
      editButtonContent: '<i class="ion-edit"></i>',
      saveButtonContent: '<i class="ion-checkmark"></i>',
      cancelButtonContent: '<i class="ion-close"></i>',
      confirmSave: true
    },
    delete: {
      deleteButtonContent: '<i class="ion-trash-a"></i>',
      confirmDelete: true
    },
    columns: {
      parameterType: {
        title: 'Parameter Name',
        editor: {
          type: 'list',
          config: {
            selectText: 'Select',
            list: this.parameterTypeList
          }
        },
        filter: {
          type: 'list',
          config: {
            selectText: 'All',
            list: this.parameterTypeList
          }
        },
        valuePrepareFunction: value => this.getParaById(value),
      },

      paramValue: {
        title: 'Parameter Value',
        type: 'string',
      },

      parameterValueOrder: {
        title: 'Value Order',
        type: 'number',
      },
  }
};
  }


  constructor(private router: Router,
    private service: ParaValueService,
    private parameterListService: ParaListService,
    private authService: AuthenticationService, private http: Http) {
      this.accessList = this.authService.getUserAccessOfMenu('paraValue');


     this.parameterListService.getData().subscribe((paraList) => {
      paraList.forEach(parameterType => {
       this.parameterTypeList.push({'value': parameterType.paramId, 'title': parameterType.paramName});
      });
       this.settings = this.prepareSetting();
      });
    this.service.getData().subscribe((data) => {
      this.source.load(data);
    });
  }


  getParaById( paramId: any ) {
    // debugger;
    const len: number = this.parameterTypeList.length;
    for (let i = 0; i < len; i++) {
      if (this.parameterTypeList[i].value === paramId) {
        return this.parameterTypeList[i].title;
      }
    }
    return paramId;
  }
  onCreateConfirm(event: any, createNew: boolean = false): void {
    const data: any = event.newData;
    debugger;
    this.errorMsg = '';
    const b = data.paramValue;
    if (!data.parameterType || !b || !data.parameterValueOrder || b.trim().length == 0) {
      this.errorMsg = 'Required fields are empty';
      setTimeout(() => this.errorMsg = null, 10000);
      event.confirm.reject();
      return;
    }

    if (data.parameterValueOrder == 0) {
      this.errorMsg = 'Value Order field is required & Cannot be 0';
      setTimeout(() => this.errorMsg = null, 10000);
      event.confirm.reject();
      return;
    }

    const abc: string = data.parameterValueOrder.toString();
    if (abc.trim().length == 0) {
      this.errorMsg = 'Value Order field is required';
      setTimeout(() => this.errorMsg = null, 10000);
      event.confirm.reject();
      return;
    }

    if (isNaN(data.parameterValueOrder) || data.parameterValueOrder.length > 10) {
      this.errorMsg = 'Value Order should be a Number!';
      setTimeout(() => this.errorMsg = null, 10000);
      event.confirm.reject();
      return;
    }

    if (data.paramValue.length > 50) {
      this.errorMsg = 'Parameter Value length must not be more than 50!';
      setTimeout(() => this.errorMsg = null, 10000);
      event.confirm.reject();
      return;
    }

    this.source.getAll().then( items => {
      items.forEach(element => {

        // parameter Value validation
        const a = data.paramValue;
        const b = element.paramValue;
       if (createNew) {
        if (a.trim().toUpperCase() ==  b.trim().toUpperCase() ) {
          this.errorMsg = 'Duplicate value for the parameter.';
          setTimeout(() => this.errorMsg = null, 10000);
          event.confirm.reject();
        }
       }else {
        if (data.paramValId != element.paramValId && a.trim().toUpperCase() ==  b.trim().toUpperCase()) {
          this.errorMsg = 'Duplicate value for the parameter.';
          setTimeout(() => this.errorMsg = null, 10000);
          event.confirm.reject();
       }
      }
      // value order validation
      if (data.parameterType == element.parameterType &&
        data.parameterValueOrder == element.parameterValueOrder ) {
          if (createNew) {
            this.errorMsg = 'Duplicate value order for the parameter.';
            setTimeout(() => this.errorMsg = null, 10000);
            event.confirm.reject();
          } else {
              if (data.paramValId != element.paramValId) {
                this.errorMsg = 'Duplicate value order for the parameter.';
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
        this.service.createParaValue(event.newData).subscribe(parameterValue => {
          event.confirm.resolve(parameterValue);
        })
      } else {
        this.service.updateParaValue(event.newData).subscribe( res => {
          this.service.getData().subscribe((updatedData) => {
            this.source.load(updatedData);
          });
          event.confirm.resolve(res);
        })
      }
    })
  }

  /* onSaveConfirm(event: any): void {
    this.service.updateParaValue(event.newData).subscribe(data => {
      event.confirm.resolve(data);
    })
  } */

  onDeleteConfirm(event: any): void {
    if (window.confirm('Are you sure you want to delete?')) {
      this.service.deleteParaValue(event.data.paramValId).subscribe(data => {
        this.service.getData().subscribe((updatedData) => {
          this.source.load(updatedData);
        });
        event.confirm.resolve();
      })
    } else {
      event.confirm.reject();
    }
  }

}
