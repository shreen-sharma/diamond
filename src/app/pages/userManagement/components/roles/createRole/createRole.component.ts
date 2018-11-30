import { debug } from 'util';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';

import { AuthenticationService } from '../../../../../core/authentication/authentication.service';
import { Logger } from '../../../../../core/logger.service';
import { RoleService, Role } from '../role.service';

import { TreeviewItem } from 'ngx-treeview';
import { MenueDataService } from './data/menuItemsData';

const log = new Logger('Roles');

@Component({
  selector: 'create-role',
  templateUrl: './createRole.html',
  styleUrls: ['./createRole.scss']
})
export class CreateRole implements OnInit {
  roleIdParam: string;
  pageTitle = 'Create Role';

  error: string = null;
  isLoading = false;
  roleForm: FormGroup;

  // operations: string[];
  modules: string[] = [];

  treeConfig: any;
  operationItems: TreeviewItem[];
  modulesTreeData: TreeviewItem[];

  public roleId: AbstractControl;
  public roleName: AbstractControl;
  public displayName: AbstractControl;
  public addRec: AbstractControl;
  public deleteRec: AbstractControl;
  public modifyRec: AbstractControl;
  public printRec: AbstractControl;
  public supervisor: AbstractControl;
  public viewRec: AbstractControl;
  menuList: any[] = [];

  constructor(private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private service: RoleService,
    private authService: AuthenticationService) {
    debugger
    this.service.getModuleData().subscribe(res => {
      debugger
      this.menuList = res;
      this.prepareTreeStructure(res);
      this.operationItems = this.getOperations();
    });
    debugger
    this.initForm();
  }

  ngOnInit() {
    debugger
    this.route.params.subscribe((params: Params) => {
      this.roleIdParam = params['roleId'];
      if (this.roleIdParam) {
        this.pageTitle = 'Edit Role';
        this.service.getRoleById(this.roleIdParam).subscribe(res => {
          console.log(res)
          this.modules = [];
          if (this.modulesTreeData) {
            this.modulesTreeData.forEach(item => {
              item.checked = true;
              if (item.children) {
                item.children.forEach(ite => {
                  ite.checked = true;
                  if (ite.children) {
                    ite.children.forEach(i => {
                      i.checked = true;
                      if (i.children) {
                        i.children.forEach(a => {
                          a.checked = true;
                        })
                      }
                    })
                  }
                })
              }
            });
          }
          if (res.menuRoleList) {
            res.menuRoleList.forEach(element => {
              this.modules.push(element.menu.menuId);
            });
          }

          this.roleForm.patchValue(res);
          if (this.operationItems) {
            this.operationItems.forEach(item => {
              if (item.value == 'addRec') {
                if (res.addRec == 'Y') {
                  item.checked = true;
                }
              } else if (item.value == 'supervisor') {
                if (res.supervisor == 'Y') {
                  item.checked = true;
                }
              } else if (item.value == 'modifyRec') {
                if (res.modifyRec == 'Y') {
                  item.checked = true;
                }
              } else if (item.value == 'deleteRec') {
                if (res.deleteRec == 'Y') {
                  item.checked = true;
                }
              } else if (item.value == 'viewRec') {
                if (res.viewRec == 'Y') {
                  item.checked = true;
                }
              } else if (item.value == 'printRec') {
                if (res.printRec == 'Y') {
                  item.checked = true;
                }
              }
            })
          }
        });
      }
    });
  }

  getOperations(): TreeviewItem[] {
    const items: TreeviewItem[] = [];
    const permissions = [
      { label: 'Supervisor', name: 'supervisor' },
      { label: 'Add Record', name: 'addRec' },
      { label: 'Modify Record', name: 'modifyRec' },
      { label: 'Delete Record', name: 'deleteRec' },
      { label: 'View Record', name: 'viewRec' },
      { label: 'View and Print Report', name: 'printRec' }
    ]

    for (let i = 0; i < permissions.length; i++) {
      let permName = permissions[i]['name'];
      const item = new TreeviewItem({ text: permissions[i]['label'], value: permName, checked: (this[permName] as AbstractControl).value == "Y" });
      items.push(item);
    };

    return items;
  }

  prepareTreeStructure(menuItemsData: any[]) {
    debugger;
    const menuMap: any = {};
    const rootItems: any[] = [];
    menuItemsData.forEach(item => {
      const menuId = item['menuId'];
      const tItem = { text: item['menuCaption'], value: menuId, checked: this.modules.indexOf(menuId) !== -1 };
      menuMap['id_' + menuId] = tItem;
    })

    menuItemsData.forEach(item => {
      if (item.parentId === 0) {
        rootItems.push(item);
      } else {
        const parentItem = menuMap['id_' + item['parentId']];
        if (!parentItem.children) {
          parentItem.children = [];
        }
        parentItem.children.push(menuMap['id_' + item['menuId']]);
      }
    })

    this.modulesTreeData = [];
    rootItems.forEach(item => {
      const treeItem = menuMap['id_' + item['menuId']];
      this.modulesTreeData.push(new TreeviewItem(treeItem));
    })
  }

  handleBack(cancelling: boolean = false) {
    // TODO: if cancelling then ask to confirn

    if (this.roleIdParam) {
      this.router.navigate(['../../roles'], { relativeTo: this.route });
    } else {
      this.router.navigate(['../roles'], { relativeTo: this.route });
    }
  }

  onOperationChange(value: string[]) {
    debugger;
    this.addRec.setValue('N');
    this.deleteRec.setValue('N');
    this.modifyRec.setValue('N');
    this.printRec.setValue('N');
    this.supervisor.setValue('N');
    this.viewRec.setValue('N');
    value.forEach(el => {
      (this[el] as AbstractControl).setValue('Y');
    });
  }

  onModuleChange(value: any) {
    debugger
    this.modules = [];
    value.forEach(element => {
      const index = this.menuList.findIndex(item => {
        if (item.menuId == element) {
          if (item.parentId) {
            this.parentCheck(item.parentId);
          }
          if (this.modules.length == 0) {
            this.modules.push(item.menuId);
          } else {
            const i = this.modules.findIndex(ite => {
              if (ite == item.menuId) {
                return true;
              }
            })
            if (i == -1) {
              this.modules.push(item.menuId);
            }
          }
          return true;
        }
      })
    });
    console.log(this.modules);
  }

  parentCheck(id: any) {
    const index = this.menuList.findIndex(item => {
      if (item.menuId == id) {
        if (this.modules.length == 0) {
          this.modules.push(item.menuId);
        } else {
          const i = this.modules.findIndex(ite => {
            if (ite == item.menuId) {
              return true;
            }
          })
          if (i == -1) {
            this.modules.push(item.menuId);
          }
        }
        if (item.parentId != 0) {
          if (this.modules.length == 0) {
            this.modules.push(item.parentId);
          } else {
            const i = this.modules.findIndex(ite => {
              if (ite == item.parentId) {
                return true;
              }
            })
            if (i == -1) {
              this.modules.push(item.parentId);
            }
          }
        }
        return true;
      }
    })
  }

  submit() {
    this.isLoading = true;
    if (this.roleIdParam) {
      this.roleId.setValue(this.roleIdParam);
    }
    let formValue: any = { roleMaster: this.roleForm.value, roleMenusId: this.modules };

    if (this.roleIdParam) {
      this.service.updateRole(formValue)
        .subscribe(role => {
          // log.debug(`${credentials.username} successfully logged in`);
          this.handleBack();
          this.finally();
        }, error => {
          log.debug(`Creation error: ${error}`);
          this.error = error;
          this.finally();
        });
    } else {
      this.service.createRole(formValue)
        .subscribe(role => {
          // log.debug(`${credentials.rolename} successfully logged in`);
          this.handleBack();
          this.finally();
        }, error => {
          log.debug(`Creation error: ${error}`);
          this.error = error;
          this.finally();
        });
    }
  }

  finally() {
    this.isLoading = false;
    this.roleForm.markAsPristine();
  }

  private initForm() {
    this.roleForm = this.fb.group({
      'roleId': [''],
      'roleName': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'displayName': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'addRec': ['N'],
      'deleteRec': ['N'],
      'modifyRec': ['N'],
      'printRec': ['N'],
      'supervisor': ['N'],
      'viewRec': ['N']
    });
    this.roleId = this.roleForm.controls['roleId'];
    this.roleName = this.roleForm.controls['roleName'];
    this.displayName = this.roleForm.controls['displayName'];
    this.addRec = this.roleForm.controls['addRec'],
      this.deleteRec = this.roleForm.controls['deleteRec'],
      this.modifyRec = this.roleForm.controls['modifyRec'],
      this.printRec = this.roleForm.controls['printRec'],
      this.supervisor = this.roleForm.controls['supervisor'],
      this.viewRec = this.roleForm.controls['viewRec'],

      this.treeConfig = {
        hasAllCheckBox: true,
        hasFilter: false,
        hasCollapseExpand: false,
        maxHeight: 500
      };
  }
}
