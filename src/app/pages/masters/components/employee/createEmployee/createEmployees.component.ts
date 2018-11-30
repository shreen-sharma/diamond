import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { AuthenticationService } from '../../../../../core/authentication/authentication.service';
import { Logger } from '../../../../../core/logger.service';
import { Employee, EmployeeService } from '../employee.service';
import { TreeviewItem } from 'ngx-treeview';
import {EmailValidator, EqualPasswordsValidator} from '../../../../../theme/validators';

const log = new Logger('create-Employee');

@Component({
  selector: 'create-employee',
  templateUrl: './createEmployees.html',
  styleUrls: ['./createEmployees.scss']
})
export class CreateEmployees implements OnInit  {
  employeeIdParam: string;
  pageTitle = 'Create Employees';

  error: string = null;
  isLoading = false;
  createEmployeeForm: FormGroup;

  treeConfig: any;
  //roleItems: TreeviewItem[];

  public userName: AbstractControl;
  public loginName: AbstractControl;
  public password: AbstractControl;
  public confPassword: AbstractControl;
  public firstName: AbstractControl;
  public lastName: AbstractControl;
  public mobileNumber: AbstractControl;
  public email: AbstractControl;
  public roles: string[] = [];

  constructor(private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private service: EmployeeService,
    private authService: AuthenticationService) {
      this.initForm();
      //this.data = service.getData();
  }

  ngOnInit() {

    /*this.route.params.subscribe((params: Params) => {
      this.employeeIdParam = params['userId'];
      if (this.employeeIdParam) {
        this.pageTitle = 'Edit User';
        const employeeData: any = this.service.getUserById(this.employeeIdParam);
        this.createEmployeeForm.patchValue(employeeData);
        if (employeeData.roles) {
          this.setRoleValue(employeeData.roles);
        }
      }
    });*/
  }

onOperationChange() {

  }

  submit() {
    /*this.isLoading = true;
    const formValue: any = this.createEmployeeForm.value;
    formValue.roles = this.roles;

    if (this.employeeIdParam) {
      this.service.updateUser(this.createEmployeeForm.value)
      .subscribe(user => {
        // log.debug(`${credentials.username} successfully logged in`);
        this.router.navigate(['../../'], {relativeTo: this.route});
        this.finally();
      }, error => {
        log.debug(`Creation error: ${error}`);
        this.error = error;
        this.finally();
      });
    } else {
      this.service.createUser(this.createEmployeeForm.value)
      .subscribe(user => {
        // log.debug(`${credentials.username} successfully logged in`);
        this.router.navigate(['../'], {relativeTo: this.route});
        this.finally();
      }, error => {
        log.debug(`Creation error: ${error}`);
        this.error = error;
        this.finally();
      });
    }*/
  }

  onRoleChange (roles: string[]) {
    this.roles = roles;
    console.log('Roles', roles);
  }

  finally() {
      this.isLoading = false;
      this.createEmployeeForm.markAsPristine();
  }

  /*setRoleValue(roles: string[]) {
    this.roleItems.forEach(item => {
      if (roles.indexOf(item.value) !== -1) {
        item.checked = true;
      }
    });
  }*/

  handleBack(cancelling: boolean) {
    // TODO: if cancelling then ask to confirn

    if (this.employeeIdParam) {
      this.router.navigate(['../../employees'], {relativeTo: this.route});
    } else {
      this.router.navigate(['../employees'], {relativeTo: this.route});
    }
  }
  private initForm() {
    this.createEmployeeForm = this.fb.group({
      'id': [''],
      'userName': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'password': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'confPassword': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'firstName': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'lastName': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'mobileNumber': ['', Validators.compose([Validators.required, Validators.minLength(10)])],
      'email': ['', Validators.compose([Validators.required, EmailValidator.validate])],
      'roles': this.fb.array([this.roles], Validators.compose([Validators.required]))
    }, {validator: EqualPasswordsValidator.validate('password', 'confPassword')});

    this.userName = this.createEmployeeForm.controls['userName'];
    this.password = this.createEmployeeForm.controls['password'];
    this.confPassword = this.createEmployeeForm.controls['confPassword'];
    this.firstName = this.createEmployeeForm.controls['firstName'];
    this.lastName = this.createEmployeeForm.controls['lastName'];
    this.mobileNumber = this.createEmployeeForm.controls['mobileNumber'];
    this.email = this.createEmployeeForm.controls['email'];


    this.treeConfig = {
        hasAllCheckBox: false,
        hasFilter: false,
        hasCollapseExpand: false,
        maxHeight: 500
    };
  }
}
