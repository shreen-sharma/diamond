import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../userManagement/components/users/user.service';

@Component({
  selector: 'add-forgot-password',
  styleUrls: [('./forgot-password.scss')],
  templateUrl: './forgot-password.html'
})

export class ForgotPasswordComponent implements OnInit {

  modalHeader: string;

  showHide: boolean;

  modalContent: string;

  oKMessage: string = 'SEND EMAIL';

  cancelMessage: string = 'Cancel';

  email: any;
  success: boolean = false;
  fail: boolean = false;
  successMsg: string = 'Reset Password link sent in registered mail, Please check the mail to reset password!!!';
  failMsg: string = 'Given E-mail is not registerd!! Please check the E-mail Address!!'
  constructor(private activeModal: NgbActiveModal, private service: UserService) { }

  ngOnInit() {
    this.service.getUsers().subscribe(result => {
      console.log(result)
    })
    this.modalHeader = "FORGOT YOUR PASSWORD?";
  }


  cancelModal() {
    this.activeModal.close('N');
  }


  okModal() {
    this.service.resetPassword(this.email).subscribe(res => {
      debugger;
      if (res) {
        this.success = true;
        this.fail = false;
      } else {
        this.fail = true;
        this.success = false;
      }

      console.log(res);
    }, res => console.log(res))
    //  console.log(this.email);
    // this.activeModal.close('Y');
  }
}
