import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';

import { AuthenticationService } from '../../../../core/authentication/authentication.service';
import { Logger } from '../../../../core/logger.service';
import { HierarchyCreationService } from './hierarchyCreation.service';

const log = new Logger('hierarchyCreation');

@Component({
  selector: 'hierarchyCreation',
  templateUrl: './hierarchyCreation.html',
  styleUrls: ['./hierarchyCreation.scss']
})
export class HierarchyCreation {

  query = '';
  accessList: any[] = [];
  public isEdit: boolean;
  public settings: any;

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
        hierType: {
          title: 'Type',
          editor: {
            type: 'list',
            config: {
              selectText: 'Select',
              list: [
                { value: 'CO', title: 'Company' },
                { value: 'LO', title: 'Location' },
                { value: 'DV', title: 'Division' },
                { value: 'DP', title: 'Department' },
                { value: 'SD', title: 'Sub-Department' }
              ],
            },
          },
          filter: {
            type: 'list',
            config: {
              selectText: 'All',
              list: [
                { value: 'DV', title: 'Division' },
                { value: 'LO', title: 'Location' },
                { value: 'DP', title: 'Department' },
                { value: 'SD', title: 'Sub Department' },
                { value: 'CO', title: 'Company Detail' },

              ],
            },
          },
        },
        hierName: {
          title: 'Name',
          type: 'string'
        },
        hierCode: {
          title: 'Code',
          type: 'string'
        }
      }
    };
  }

  source: LocalDataSource = new LocalDataSource();

  constructor(private router: Router, private service: HierarchyCreationService, private route: ActivatedRoute,
    private authService: AuthenticationService) {

    this.accessList = this.authService.getUserAccessOfMenu('hierarchyCreation');
    const edit = this.accessList.includes("UPDATE");
    const view = this.accessList.includes("GET");
    if (edit == true) {
      this.isEdit = true;
    } else if (view == true) {
      this.isEdit = true;
    } else {
      this.isEdit = false;
    }
    this.settings = this.prepareSetting();
    this.service.getData().subscribe((data) => {
      this.source.load(data);
    });
  }

  handleCreate() {
    this.router.navigate(['../createHierarchy'], { relativeTo: this.route });
  }

  handleEdit(row: any) {
    let view = this.accessList.includes("GET");
    let edit = this.accessList.includes("UPDATE");
    if (view == true && edit == true) {
      view = false;
    } else if (view == false && edit == true) {
      view = false;
    }

    const hier = row.data;
    if(edit == true){
      this.router.navigate(['../editHierarchy/' + view + '/' + hier.hierId], { relativeTo: this.route });
      console.log(hier.hierType);
    } else if(view == true) {
      this.router.navigate(['../viewHierarchy/' + view + '/' + hier.hierId], { relativeTo: this.route });
      console.log(hier.hierType);
    }
  }
  onDeleteConfirm(event: any): void {
    if (window.confirm('Are you sure you want to delete?')) {
      this.service.deleteHier(event.data.hierId).subscribe(response => {
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
