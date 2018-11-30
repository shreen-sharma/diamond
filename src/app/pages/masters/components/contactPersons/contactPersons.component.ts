import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';

import { AuthenticationService } from '../../../../core/authentication/authentication.service';
import { Logger } from '../../../../core/logger.service';
import { ContactPersonService } from './contactPerson.service';

const log = new Logger('ContactPersons');

@Component({
  selector: 'contactPersons',
  templateUrl: './contactPersons.html',
  styleUrls: ['./contactPersons.scss']
})
export class ContactPersons {

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
        refType: {
          title: 'Type',
          type: 'string'
        },
        refId: {
          title: 'Name',
          type: 'string'
          // add valuePrepareFunction for gettingNameById
        },
        personCode: {
          title: 'Contact Person Code',
          type: 'string'
        },
        personName: {
          title: 'Contact Person Name',
          type: 'string'
        },
        qualification: {
          title: 'Qualification',
          type: 'string'
        },
        gender: {
          title: 'Gender',
          type: 'string'
        },
      }
    }
  }

  source: LocalDataSource = new LocalDataSource();

  constructor(private router: Router,
    private service: ContactPersonService,
    private route: ActivatedRoute,
    private authService: AuthenticationService) {
    this.accessList = this.authService.getUserAccessOfMenu('contactPersons');
    const edit = this.accessList.includes("UPDATE");
    const view = this.accessList.includes("GET");
    if (edit == true) {
      this.isEdit = true;
    } else if (view == true) {
      this.isEdit = true;
    } else {
      this.isEdit = false;
    }
    this.service.getData().subscribe((data) => {
      this.settings = this.prepareSetting();
      this.source.load(data);
    });
  }

  handleCreate() {
    this.router.navigate(['../createContactPerson'], { relativeTo: this.route });
  }

  handleEdit(row: any) {
    let view = this.accessList.includes("GET");
    let edit = this.accessList.includes("UPDATE");
    if(view == true && edit == true){
      view = false;
    } else if(view == false && edit == true){
      view = false;
    }
    const contactPerson = row.data;
    this.router.navigate(['../editContactPerson/' + view + '/' + contactPerson.personId], { relativeTo: this.route });
  }

  onDeleteConfirm(event: any): void {
    if (window.confirm('Are you sure you want to delete?')) {
      this.service.deleteContactPerson(event.data.personId).subscribe(response => {
        // event.confirm.resolve();
        this.service.getData().subscribe((data) => {
          this.source.load(data);
        });
      });
    } else {
      // event.confirm.reject();
    }
  }

}
