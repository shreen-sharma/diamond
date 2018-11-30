import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { UserService } from '../userManagement/components/users/user.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'; // from forget-password

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
  providers: [
    NgbActiveModal
  ],
})


export class ChangePasswordComponent implements OnInit {

  changePassword: FormGroup;
  public password: AbstractControl;
  public confPassword: AbstractControl;
  public token: AbstractControl;

  error: any = '';
  onChangePwd: boolean = true;
  //  token: any;
  pwd: any;

  success: boolean = false;
  fail: boolean = false;
  successMsg: string = 'Password reseted successfully!! ';
  failMsg: string = 'Password not reseted!! Please Contact Admin!'

  constructor(private fb: FormBuilder, private route: ActivatedRoute,
    private service: UserService,
    private router: Router) {
    this.initForm();


  }

  ngOnInit() {
  }

  Submit() {
    debugger;
    this.changePassword.value;
    this.service.confirmPassword(this.changePassword.value).subscribe(res => {
      if (res) {
        this.success = true;
        this.fail = false;
        this.router.navigate(['/login']);
      } else {
        this.fail = true;
        this.success = false;
      }
    })
  }

  initForm() {
    this.changePassword = this.fb.group({
      'userId': [''],
      'password': [''],
      'confPassword': [''],
      'email': [''],
      'token': ['']
    })

    this.password = this.changePassword.controls['password'];
    this.confPassword = this.changePassword.controls['confPassword'];
    this.route.queryParams.subscribe(params => {
      this.changePassword.controls['token'].setValue(params['token']);

    });
    //this.token = this.changePassword.controls['token'];

    this.confPassword.valueChanges.subscribe(val => {
      if (val) {
        if (this.password.value != val) {
          this.error = 'Password does not match! Please make sure that both of the password should be same.';
        } else {
          this.error = '';
        }
      }
    })
  }

  // Forget Password
  // modalHeader: string;

  // showHide: boolean;

  // modalContent: string;

  // oKMessage: string = 'SEND EMAIL';

  // cancelMessage: string = 'Cancel';

  // email: any;
  // success: boolean = false;
  // fail: boolean = false;
  // successMsg: string = 'Reset Password link sent in registered mail, Please check the mail to reset password!!!';
  // failMsg: string = 'Given E-mail is not registerd!! Please check the E-mail Address!!'
  // constructor(private activeModal: NgbActiveModal, private service: UserService) { }

  // ngOnInit() {
  //   this.service.getUsers().subscribe(result => {
  //     console.log(result)
  //   })
  //   this.modalHeader = "FORGOT YOUR PASSWORD?";
  // }


  // cancelModal() {
  //   this.activeModal.close('N');
  // }


  // okModal() {
  //   this.service.resetPassword(this.email).subscribe(res => {
  //     debugger;
  //     if (res) {
  //       this.success = true;
  //       this.fail = false;
  //     } else {
  //       this.fail = true;
  //       this.success = false;
  //     }

  //     console.log(res);
  //   }, res => console.log(res))
  //   //  console.log(this.email);
  //   // this.activeModal.close('Y');
  // }
}
