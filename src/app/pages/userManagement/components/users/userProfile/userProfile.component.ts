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
import {EmailValidator, EqualPasswordsValidator} from '../../../../../theme/validators';
import { CommonModalComponent } from '../../../../../shared/common-modal/common-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

const log = new Logger('User Profile');

@Component({
  selector: 'userProfile',
  templateUrl: './userProfile.html',
  styleUrls: ['./userProfile.scss']
})
export class UserProfile implements OnInit  {

  userNameParam: string;
  pageTitle = 'User Profile';

  status: boolean;
  message: String;
  error: string = null;
  isLoading = false;
  userProfileForm: FormGroup;
  onChangePwd: boolean = false;
  currentUser:any [] =[];
  roleItems: TreeviewItem[] = [];
  companies: Observable<any>;
  pass:boolean;
  passValid:boolean =false; 
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
  public rolesId: any[] = [];


  constructor(private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private service: UserService,
    private modalService: NgbModal,
    private hierarchyService: HierarchyCreationService,
    private authService: AuthenticationService) {
      this.initForm();
      this.companies = this.hierarchyService.getAllHierachyByType('CO');
      
      service.getRoles().subscribe(roles => {
        for ( let index = 0; index < roles.length; index++) {
          const role = roles[index];
          this.roleItems.push(new TreeviewItem({value: role.roleId , text: role.roleName, checked: false}));
        }
      });
  }

  ngOnInit() {
debugger
    this.route.params.subscribe((params: Params) => {
      this.userNameParam = params['username'];
      if (this.userNameParam) {
         this.service.getUsers().subscribe(userData => {
            userData.forEach(element => {
              if (this.userNameParam == element.userName ){
                this.service.getUserById(element.userId).subscribe(user => {
                  this.currentUser = user;
                  if(user.userRoleDTOSet.length > 0){
                    setTimeout(()=>{
                      user.userRoleDTOSet.forEach(element => {
                       this.roles.push(element.roleName);
                       this.rolesId.push(element.id);
                     });
                     this.setRoleValue(this.rolesId);
                    },500)
                  }
                  // this.markAllTouched(this.userProfileForm);
                  this.userProfileForm.patchValue( this.currentUser);
                })
              }
            });          
         });
      }
    });
  }

  onChangePass(){
     this.onChangePwd = true
      this.userProfileForm.controls['password'].reset();
      this.userProfileForm.controls['confPassword'].reset();
  }
  submit() {
    if (this.userProfileForm.valid) {
      debugger;
      if (this.password.value == this.confPassword.value){
          this.isLoading = true;
          const formValue: any = this.userProfileForm.value;
          formValue.roles = this.rolesId;
          delete formValue.confPassword;

          if (this.userNameParam) {
            this.service.updateUser(formValue).subscribe(user => {
              const activeModal = this.modalService.open(CommonModalComponent);
              activeModal.componentInstance.showHide = false;
              activeModal.componentInstance.modalHeader = 'Success';
              activeModal.componentInstance.modalContent = 'Password Changed Successfully';
              activeModal.result.then(res => {
                  if(res == 'Y'){
                    this.router.navigate(['/login']);
                  } else {
                  }
              })
              // this.handleBack();
              // this.finally();
            }, error => {
              log.debug(`Creation error: ${error}`);
              this.error = error;
              this.finally();
            });
          } 

      } else {
          const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
          activeModal.componentInstance.showHide = false;
          activeModal.componentInstance.modalHeader = 'Alert';
          activeModal.componentInstance.modalContent = 'Password and confirm password does not match!';
        }
    }
  }

  finally() {
      this.isLoading = false;
      this.userProfileForm.markAsPristine();
  }

  setRoleValue(roles: any[]) {
    roles.forEach(item =>{
      const index = this.roleItems.findIndex(ite =>{
        if(ite.value == item){
          ite.checked = true;
          return true;
        }
      })
    })
  }

  public hasRoleFound(role:any, allRoles:any[]): boolean{
   
      allRoles.forEach(userRole => {
          if(userRole.id == role.value){
           this.status = true;
          } else {
            this.status = false;
          }
      });
     return this.status;
  }

  handleBack(cancelling: boolean = false) {
    if (this.userNameParam) {
      this.router.navigate(['/dashboard'], {relativeTo: this.route});
    } else {
      this.router.navigate(['/dashboard'], {relativeTo: this.route});
    }
  }
  focusOutFunction(){
    console.log(this.password.value)
    if(this.password.value != "" && this.password.value != null ) {

        if(this.password.value != this.confPassword.value){
          this.message = 'Password mismatch!';
          setTimeout(() => this.message = null, 3000);
          this.password.invalid;
      }

    }else {
      this.message = 'Enter New Password!';
      setTimeout(() => this.message = null, 3000);
      this.password.invalid;
    }
  }

  private initForm() {
    this.userProfileForm = this.fb.group({
      'userId': [''],
      'userName': [''],
      'password': ['', Validators.compose([  Validators.required, Validators.minLength(6)])],
      'confPassword': ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      'firstName': [''],
      'lastName': [''],
      'mobileNumber': [''],
      'email': [''],
      'status': [''],
      'companyId': [''],
      'userRoles': this.fb.array([this.rolesId]),
    }, {validator: EqualPasswordsValidator.validate('password', 'confPassword')});
 
    this.userName = this.userProfileForm.controls['userName'];
    this.password = this.userProfileForm.controls['password'];
    this.confPassword = this.userProfileForm.controls['confPassword'];
    this.firstName = this.userProfileForm.controls['firstName'];
    this.lastName = this.userProfileForm.controls['lastName'];
    this.mobileNumber = this.userProfileForm.controls['mobileNumber'];
    this.email = this.userProfileForm.controls['email'];
    this.companyId = this.userProfileForm.controls['companyId'];
  

    this.confPassword.valueChanges.subscribe(val =>{
      if(val){
          if(val == this.password.value) {
             this.passValid = true;
          } else {
              this.passValid = false;
          }
      }
  })

  } 
  
}
