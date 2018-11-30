import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';

import { AuthenticationService } from '../../../../../core/authentication/authentication.service';
import { Logger } from '../../../../../core/logger.service';
import { PaymentReceipt, PaymentReceiptEntryService } from '../paymentReceiptEntry.service';


const log = new Logger('PaymentReceiptEntry');

@Component({
  selector: 'create-paymentReceiptEntry',
  templateUrl: './createPaymentReceiptEntry.html',
  styleUrls: ['./createPaymentReceiptEntry.scss']
})
export class CreatePaymentReceiptEntry implements OnInit  {
  paymentReceiptEntryIdParam: string;
  pageTitle = 'Payment Receipt Entry';

  error: string = null;
  isLoading = false;
  paymentReceiptEntryForm: FormGroup;

  public invoiceNo: AbstractControl;
  public docNo: AbstractControl;
  public docDate: AbstractControl;
  public bank: AbstractControl;
  public bankName: AbstractControl;
  public chequeDate: AbstractControl;
  public chequeNo: AbstractControl;
  public outstandingAmount: AbstractControl;
  public totalAmount: AbstractControl;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private service: PaymentReceiptEntryService,
    private authService: AuthenticationService) {
      this.createForm();
  }

  ngOnInit() {

    this.route.params.subscribe((params: Params) => {
      this.paymentReceiptEntryIdParam = params['paymentReceiptEntryId'];
      if (this.paymentReceiptEntryIdParam) {
        this.pageTitle = 'Payment Receipt Entry';
        let PaymentReceiptEntryData: any = this.service.getPaymentReceiptEntryById(this.paymentReceiptEntryIdParam);
        this.paymentReceiptEntryForm.patchValue(PaymentReceiptEntryData);
      }
    });
  }

  submit() {
    this.isLoading = true;
    const formValue: any = this.paymentReceiptEntryForm.value;

  if (this.paymentReceiptEntryIdParam) {
    this.service.updatePaymentReceiptEntry(this.paymentReceiptEntryForm.value)
    .subscribe( paymentReceiptEntry => {
      // log.debug(`${credentials.selectedCompany} successfully logged in`);
      this.handleBack();
      this.finally();
    }, error => {
      log.debug(`Creation error: ${error}`);
      this.error = error;
      this.finally();
    });
  } else {
      this.service.createPaymentReceiptEntry(this.paymentReceiptEntryForm.value)
      .subscribe(paymentReceiptEntry => {
        // log.debug(`${credentials.selectedCompany} successfully logged in`);
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
      this.paymentReceiptEntryForm.markAsPristine();
  }

  handleBack(cancelling: boolean= false) {
    // TODO: if cancelling then ask to confirn

    if (this.paymentReceiptEntryIdParam) {
      this.router.navigate(['../../paymentReceiptEntry'], {relativeTo: this.route});
    } else {
      this.router.navigate(['../paymentReceiptEntry'], {relativeTo: this.route});
    }
  }

  private createForm() {
    this.paymentReceiptEntryForm = this.fb.group({
      'id': [''],
      'invoiceNo': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'docNo': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'docDate': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'bank': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'bankName': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'chequeDate': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'chequeNo': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'outstandingAmount': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'totalAmount': ['', Validators.compose([Validators.required, Validators.minLength(4)])]
    });

    this.invoiceNo = this.paymentReceiptEntryForm.controls['invoiceNo'];
    this.docNo = this.paymentReceiptEntryForm.controls['docNo'];
    this.docDate = this.paymentReceiptEntryForm.controls['docDate'];
    this.bank = this.paymentReceiptEntryForm.controls['bank'];
    this.bankName = this.paymentReceiptEntryForm.controls['bankName'];
    this.chequeDate = this.paymentReceiptEntryForm.controls['chequeDate'];
    this.chequeNo = this.paymentReceiptEntryForm.controls['chequeNo'];
    this.outstandingAmount = this.paymentReceiptEntryForm.controls['outstandingAmount'];
    this.totalAmount = this.paymentReceiptEntryForm.controls['totalAmount'];
  }
}
