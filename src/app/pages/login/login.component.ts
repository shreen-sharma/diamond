import { HierarchyRelationService } from '../company/components/hierarchyRelation';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService, Credentials } from '../../core/authentication/authentication.service';
import { Logger } from '../../core/logger.service';
import { Observable } from 'rxjs/Observable';
import { HierarchyCreationService } from 'app/pages/company/components/hierarchyCreation';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Session } from '../../../../node_modules/@types/selenium-webdriver';

const log = new Logger('Login');

@Component({
  selector: 'login',
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class Login {

  error: string = null;
  isLoading = false;
  loginForm: FormGroup;
  companies: Observable<any>;
  groups: Observable<any>;

  public username: AbstractControl;
  public password: AbstractControl;
  public group: AbstractControl;
  public company: AbstractControl;
  public remember: AbstractControl;

  constructor(private router: Router,
    private fb: FormBuilder,
    private hierarchyService: HierarchyCreationService,
    private hierarchyRelationService: HierarchyRelationService,
    private modalService: NgbModal,
    private authService: AuthenticationService) {
    this.createForm();
    //   this.companies = this.hierarchyService.getAllHierachyByType('CO');
    this.groups = this.hierarchyService.getAllHierachyByType('GR');
  }
  onGroupChange(target) {
    if (target.value) {
      this.companies = this.hierarchyRelationService.getHierarchyRelationByParentId(target.value);
    }
  }
  login() {
    // this.router.navigate(['/']);
    this.isLoading = true;
    this.authService.login(this.loginForm.value)
      /* .finally(() => {
        this.isLoading = false;
        this.loginForm.markAsPristine();
      }) */
      .subscribe(credentials => {
        debugger
        log.debug(`${credentials.username} successfully logged in`);
        sessionStorage.setItem("loggedUser", credentials.username);
        this.authService.loadUserRole().subscribe(role => {
          this.router.navigate(['/']);
        });

        // this.authService.getLoggedInUserPermission().subscribe(data => {
        //   log.debug(' UserPermission successfully logged in');
        //   log.debug(data);
        //   sessionStorage.setItem('UserPermission', JSON.stringify(data));
        // });


      }, error => {
        log.debug(`Login error: ${error}`);
        this.error = error;
        this.finally();
      });
  }

  finally() {
    this.isLoading = false;
    this.loginForm.markAsPristine();
  }

  forgot_password() {
    this.router.navigate(['login/forget-password']);
  }

  private createForm() {
    this.loginForm = this.fb.group({
      'username': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'password': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'group': ['', Validators.compose([Validators.required])],
      'company': ['', Validators.compose([Validators.required])],
      'remember': false
    });

    this.username = this.loginForm.controls['username'];
    this.password = this.loginForm.controls['password'];
    this.group = this.loginForm.controls['group'];
    this.company = this.loginForm.controls['company'];
    this.remember = this.loginForm.controls['remember'];
  }
}
