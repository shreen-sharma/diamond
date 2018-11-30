import {Component} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';

import { AuthenticationService } from '../../../../core/authentication/authentication.service';
import { Logger } from '../../../../core/logger.service';
import { RoleService } from './role.service';
import { CommonModalComponent } from '../../../../shared/common-modal/common-modal.component';
import {  NgbModal} from '@ng-bootstrap/ng-bootstrap';

const log = new Logger('Users');

@Component({
  selector: 'roles',
  templateUrl: './roles.html',
  styleUrls: ['./roles.scss']
})
export class Roles {

  query = '';
  settings: any;

  preapreSetting() {
    return{
      actions: {
        position: 'right'
      },
      mode: 'external',
      add: {
        addButtonContent: '<i class="ion-ios-plus-outline"></i>',
        createButtonContent: '<i class="ion-checkmark"></i>',
        cancelButtonContent: '<i class="ion-close"></i>',
      },
      edit: {
        editButtonContent: '<i class="ion-edit"></i>',
        saveButtonContent: '<i class="ion-checkmark"></i>',
        cancelButtonContent: '<i class="ion-close"></i>',
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
        roleName: {
          title: 'Role Name',
          type: 'string'
        },
        displayName: {
          title: 'Display Name',
          type: 'string'
        }
      }
    }
  };

  source: LocalDataSource = new LocalDataSource();

  constructor(private router: Router,
    private route: ActivatedRoute,
    private service: RoleService,
    private modalService: NgbModal,
    private authService: AuthenticationService) {
     this.settings =  this.preapreSetting();
    this.service.getAllRoles().subscribe( roles => {
      this.source.load(roles);
    });
  }

  handleCreate() {
    this.router.navigate(['../createRole'], { relativeTo: this.route });
  }

  handleEdit( row: any ) {
    const role = row.data;
    this.router.navigate(['../editRole', role.roleId], { relativeTo: this.route });
  }

  onDeleteConfirm(event: any): void {
    console.log(event)
    const activeModal = this.modalService.open(CommonModalComponent, {size : 'lg'});
    activeModal.componentInstance.showHide = true;
    activeModal.componentInstance.modalHeader = "Warning";
    activeModal.componentInstance.modalContent = "Are you sure you want to delete role?";
    activeModal.result.then(res =>{
      if(res == 'Y'){
        this.service.deleteRole(event.data.roleId).subscribe(res =>{
          this.service.getAllRoles().subscribe(result =>{
            this.source.load(result);
          })
        })
      }
    })
  }

}
