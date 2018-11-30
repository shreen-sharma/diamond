import { HierarchyCreationService } from '../../../../company/components/hierarchyCreation/index';
import { Observable } from 'rxjs/Rx';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { AuthenticationService } from '../../../../../core/authentication/authentication.service';
import { Logger } from '../../../../../core/logger.service';
import { User, UserService } from '../user.service';
import { TreeviewItem } from 'ngx-treeview';
import { EmailValidator, EqualPasswordsValidator } from '../../../../../theme/validators';
import { CommonModalComponent } from '../../../../../shared/common-modal/common-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

const log = new Logger('Users');

@Component({
  selector: 'create-user',
  templateUrl: './createUser.html',
  styleUrls: ['./createUser.scss']
})
export class CreateUser implements OnInit {

  userIdParam: string;
  pageTitle = 'Create User';

  status: boolean;
  message: String;
  error: string = null;
  isLoading = false;
  userForm: FormGroup;

  treeConfig: any;
  roleItems: TreeviewItem[] = [];
  companies: Observable<any>;
  public userName: AbstractControl;
  public loginName: AbstractControl;
  public password: AbstractControl;
  public confPassword: AbstractControl;
  public firstName: AbstractControl;
  public lastName: AbstractControl;
  public mobileNumber: AbstractControl;
  public email: AbstractControl;
  public companyId: AbstractControl;
  public roles: any[] = [];
  public isEdit: boolean = false;
  errorMsg: any;
  users: any[] = [];

  constructor(private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private service: UserService,
    private modalService: NgbModal,
    private hierarchyService: HierarchyCreationService,
    private authService: AuthenticationService) {
    this.initForm();
    this.userName.disable();
    this.errorMsg = "Please wait for Login name to enable";
    this.companies = this.hierarchyService.getAllHierachyByType('CO');
    this.service.getRoles().subscribe(roles => {
      for (let index = 0; index < roles.length; index++) {
        const role = roles[index];
        this.roleItems.push(new TreeviewItem({ value: role.roleId, text: role.roleName, checked: false }));
        this.setRoleValue(this.roles);
      }
    });
    this.service.getUsers().subscribe(result => {
      result.forEach(element => {
        if (element.userName && element.email) {
          this.users.push(element.userName.toString().toLowerCase(), element.email.toString().toLowerCase());
        }
      });
      this.userName.enable();
      this.errorMsg = "";
    })
  }

  ngOnInit() {
    debugger
    this.route.params.subscribe((params: Params) => {
      this.userIdParam = params['userId'];
      if (this.userIdParam) {
        this.pageTitle = 'Edit User';
        this.isEdit = true;
        this.service.getUserById(this.userIdParam).subscribe(userData => {
          this.roles = [];
          if (userData.userRoleDTOSet.length > 0) {
            userData.userRoleDTOSet.forEach(element => {
              this.roles.push(element.id);
            });
            this.onRoleChange(this.roles);
          }
          this.markAllTouched(this.userForm);
          this.userForm.patchValue(userData);
        });
      }
    });
  }

  markAllTouched(control: AbstractControl) {
    if (control.hasOwnProperty('controls')) {
      const ctrl = <any>control;
      for (const inner in ctrl.controls) {
        if (ctrl.controls) {
          this.markAllTouched(ctrl.controls[inner]);
        }
      }
    } else {
      control.markAsTouched();
    }
  }


  onOperationChange() {

  }


  submit() {
    // if (this.userForm.valid) {
    // debugger;

    this.isLoading = true;
    const formValue: any = this.userForm.value;
    formValue.roles = this.roles;
    delete formValue.confPassword;
    if (this.errorMsg == "") {
      if (this.userIdParam) {
        this.service.updateUser(formValue)
          .subscribe(user => {
            debugger
            // log.debug(`${credentials.username} successfully logged in`);
            this.handleBack();
            this.finally();
          }, error => {
            log.debug(`Creation error: ${error}`);
            this.error = error;
            this.finally();
          });
      } else {
        if (this.password.value == this.confPassword.value) {
          this.service.createUser(formValue)
            .subscribe(user => {
              // log.debug(`${credentials.username} successfully logged in`);

              this.handleBack();
              this.finally();
            }, error => {
              log.debug(`Creation error: ${error}`);
              this.error = error;
              this.finally();
            });
        }
        else {
          const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
          activeModal.componentInstance.showHide = false;
          activeModal.componentInstance.modalHeader = 'Alert';
          activeModal.componentInstance.modalContent = 'Password and confirm password did not match!';
        }
      }
    }
    // }
  }

  onRoleChange(roles: any[]) {
    debugger;
    this.roles = roles;

  }

  finally() {
    this.isLoading = false;
    this.userForm.markAsPristine();
  }

  setRoleValue(roles: any[]) {
    roles.forEach(item => {
      const index = this.roleItems.findIndex(ite => {
        if (ite.value == item) {
          ite.checked = true;
          return true;
        }
      })
    })
  }

  public hasRoleFound(role: any, allRoles: any[]): boolean {

    allRoles.forEach(userRole => {
      debugger;
      if (userRole.id == role.value) {
        this.status = true;
      } else {
        this.status = false;
      }
    });
    return this.status;
  }

  handleBack(cancelling: boolean = false) {
    // TODO: if cancelling then ask to confirn

    if (this.userIdParam) {
      this.router.navigate(['../../users'], { relativeTo: this.route });
    } else {
      this.router.navigate(['../users'], { relativeTo: this.route });
    }
  }
  focusOutFunction() {
    if (this.password.value != this.confPassword.value) {
      this.message = 'Password mismatch!';
      setTimeout(() => this.message = null, 5000);
      this.password.invalid;
    }
  }

  private initForm() {
    this.userForm = this.fb.group({
      'userId': [''],
      'userName': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'password': ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      'confPassword': ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      'firstName': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'lastName': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'mobileNumber': ['', Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(10)])],
      'email': ['', Validators.compose([Validators.required, EmailValidator.validate])],
      'status': [''],
      'companyId': [''],
      'userRoles': this.fb.array([this.roles], Validators.compose([Validators.required])),
    }, { validator: EqualPasswordsValidator.validate('password', 'confPassword') });

    this.userName = this.userForm.controls['userName'];
    this.password = this.userForm.controls['password'];
    this.confPassword = this.userForm.controls['confPassword'];
    this.firstName = this.userForm.controls['firstName'];
    this.lastName = this.userForm.controls['lastName'];
    this.mobileNumber = this.userForm.controls['mobileNumber'];
    this.email = this.userForm.controls['email'];
    this.companyId = this.userForm.controls['companyId'];

    this.treeConfig = {
      hasAllCheckBox: false,
      hasFilter: false,
      hasCollapseExpand: false,
      maxHeight: 500
    };

    this.userName.valueChanges.subscribe(val => {
      if (val) {
        if (this.users) {
          const index = this.users.findIndex(item => {
            if (item == val.toLowerCase()) {
              return true;
            }
          })
          if (index == -1) {
            this.errorMsg = "";
          } else {
            this.errorMsg = "Login Name already exists. Please try another name.";
          }
        }
      }
    })

    this.email.valueChanges.subscribe(val => {
      if (val) {
        if (this.users) {
          const index = this.users.findIndex(item => {
            if (item == val.toLowerCase()) {
              return true;
            }
          })
          if (index == -1) {
            this.errorMsg = "";
          } else {
            this.errorMsg = "Email already exists. Please try another email.";
          }
        }
      }
    })
  }
}
