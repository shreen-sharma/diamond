import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';

import { AuthenticationService } from '../../../../../core/authentication/authentication.service';
import { Logger } from '../../../../../core/logger.service';
import { ReturnEntry, ReturnEntryService } from '../returnEntry.service';

const log = new Logger('Users');

@Component({
  selector: 'create-returnEntry',
  templateUrl: './createReturnEntry.html',
  styleUrls: ['./createReturnEntry.scss']
})
export class CreateReturnEntry implements OnInit  {
  userNameParam: string;
   empRIdParam: string;
  pageTitle = 'Create Employee Return Entry';

  error: string = null;
  isLoading = false;
  returnEntryForm: FormGroup;

  public employee: AbstractControl;
  public lot: AbstractControl;
  public issueDate: AbstractControl;
  public issueNo: AbstractControl;
  public returnDate: AbstractControl;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private service: ReturnEntryService,
    private authService: AuthenticationService) {
      this.createForm();
  }

  ngOnInit() {

    this.route.params.subscribe((params: Params) => {
      this.userNameParam = params['employee'];
      if (this.userNameParam) {
        this.pageTitle = 'Edit Employee Return Entry';
      }
    });
  }

  submit() {
    this.isLoading = true;
    this.service.createReturnEntry(this.returnEntryForm.value as ReturnEntry)
    .subscribe(entry => {
      // log.debug(`${credentials.username} successfully logged in`);
      // this.router.navigate(['../../']);
      this.finally();
    }, error => {
      this.isLoading=false;
      log.debug(`Creation error: ${error}`);
      this.error = error;
      this.finally();
    });
  }

  finally() {
      this.isLoading = false;
      this.returnEntryForm.markAsPristine();
  }
   handleBack(cancelling: boolean) {
    // TODO: if cancelling then ask to confirn

    if (this.userNameParam) {
      this.router.navigate(['../../returnEntry'], {relativeTo: this.route});
    } else {
      this.router.navigate(['../returnEntry'], {relativeTo: this.route});
    }
  }

  private createForm() {
    this.returnEntryForm = this.fb.group({
      'employee': ['', Validators.compose([Validators.required])],
      'returnDate': ['', Validators.compose([Validators.required])],
      'lot': ['', Validators.compose([Validators.required])],
      'issueDate': ['', Validators.compose([Validators.required])],
      'issueNo': ['', Validators.compose([Validators.required])],
    });

    this.employee = this.returnEntryForm.controls['employee'];
    this.returnDate = this.returnEntryForm.controls['returnDate'];
    this.lot = this.returnEntryForm.controls['lot'];
    this.issueDate = this.returnEntryForm.controls['issueDate'];
    this.issueNo = this.returnEntryForm.controls['issueNo'];
  }

}
