import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../userManagement/components/users/user.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss'],
  providers: [
    NgbActiveModal
  ],
})
export class ForgetPasswordComponent implements OnInit {

  modalHeader: string;

  showHide: boolean;

  modalContent: string;

  oKMessage: string = 'SEND EMAIL';

  cancelMessage: string = 'Cancel';

  email: string;
  success: boolean = false;
  fail: boolean = false;
  crypt: string;
  successMsg: string;
  failMsg: string = 'Given E-mail is not registerd!! Please check the E-mail Address!!'
  constructor(private activeModal: NgbActiveModal,private service: UserService) { }
 
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
    let a1 = this.email.split("@");
    let a2 = this.email.charAt(0) + this.email.charAt(1);
    this.crypt = a2 + '******@' + a1[1];
    this.successMsg = 'Reset Password link sent to registered mail ' + this.crypt + ', Please check the mail to reset password!!!';
    this.service.resetPassword(this.email).subscribe(res => {
      
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
