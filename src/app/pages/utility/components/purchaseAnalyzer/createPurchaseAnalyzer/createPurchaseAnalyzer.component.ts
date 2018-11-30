import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { AuthenticationService } from '../../../../../core/authentication/authentication.service';
import { Logger } from '../../../../../core/logger.service';
import { PurchaseAnalyzers, PurchaseAnalyzerService} from '../purchaseAnalyzer.service';

const log = new Logger('createPurchaseAnalyzer');

@Component({
  selector: 'create-PurchaseAnalyzer',
  templateUrl: './createPurchaseAnalyzer.html',
  styleUrls: ['./createPurchaseAnalyzer.scss']
})
export class CreatePurchaseAnalyzer implements OnInit  {
  purchaseAnalyzerIdParam: string;
  pageTitle = 'Create Purchase Analyzer';

  error: string = null;
  isLoading = false;
  createPurchaseAnalyzerForm: FormGroup;

  public company: AbstractControl;
  public searchMode: AbstractControl;
  public category: AbstractControl;
  public dateOption: AbstractControl;
  public fromDate: AbstractControl;
  public toDate: AbstractControl;
  public partyType: AbstractControl;
  public party: AbstractControl;
  public mode: AbstractControl;
  public bank: AbstractControl;
  public terms: AbstractControl;
  public zone: AbstractControl;
  public country: AbstractControl;
  public vessel: AbstractControl;
  public paymentMode: AbstractControl;
  public remark: AbstractControl;
  public currency: AbstractControl;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private service: PurchaseAnalyzerService,
    private authService: AuthenticationService) {
      this.initForm();
  }

  ngOnInit() {

    this.route.params.subscribe((params: Params) => {
      this.purchaseAnalyzerIdParam = params['purchaseAnalyzerId'];
      if (this.purchaseAnalyzerIdParam) {
        this.pageTitle = 'Edit Purchase Analyzer';
      }
    });
  }


 submit() {
    this.isLoading = true;
    const formValue: any = this.createPurchaseAnalyzerForm.value;

  if (this.purchaseAnalyzerIdParam) {
    this.service.updatePurchaseAnalyzer(this.createPurchaseAnalyzerForm.value)
    .subscribe( purchaseAnalyzer => {
      // log.debug(`${credentials.selectCategory} successfully logged in`);
      this.handleBack();
      this.finally();
    }, error => {
      log.debug(`Creation error: ${error}`);
      this.error = error;
      this.finally();
    });
  } else {
      this.service.createPurchaseAnalyzer(this.createPurchaseAnalyzerForm.value)
      .subscribe(purchaseAnalyzer => {
        // log.debug(`${credentials.selectCategory} successfully logged in`);
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
      this.createPurchaseAnalyzerForm.markAsPristine();
  }
handleBack(cancelling: boolean = false) {
    // TODO: if cancelling then ask to confirn

    if (this.purchaseAnalyzerIdParam) {
      this.router.navigate(['../../purchaseAnalyzer'], {relativeTo: this.route});
    } else {
      this.router.navigate(['../purchaseAnalyzer'], {relativeTo: this.route});
    }
  }

  private initForm() {
    this.createPurchaseAnalyzerForm = this.fb.group({
      'id': [''],
      'company': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'searchMode': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'category': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'dateOption': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'fromDate': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'toDate': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'partyType': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'party': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'mode': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'bank': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'terms': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'zone': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'country': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'vessel': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'paymentMode': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'remark': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'currency': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
    });

    this.company = this.createPurchaseAnalyzerForm.controls['company'];
    this.searchMode = this.createPurchaseAnalyzerForm.controls['searchMode'];
    this.category = this.createPurchaseAnalyzerForm.controls['category'];
    this.dateOption = this.createPurchaseAnalyzerForm.controls['dateOption'];
    this.fromDate = this.createPurchaseAnalyzerForm.controls['fromDate'];
    this.toDate = this.createPurchaseAnalyzerForm.controls['toDate'];
    this.partyType = this.createPurchaseAnalyzerForm.controls['partyType'];
    this.party = this.createPurchaseAnalyzerForm.controls['party'];
    this.mode = this.createPurchaseAnalyzerForm.controls['mode'];
    this.bank = this.createPurchaseAnalyzerForm.controls['bank'];
    this.terms = this.createPurchaseAnalyzerForm.controls['terms'];
    this.zone = this.createPurchaseAnalyzerForm.controls['zone'];
    this.country = this.createPurchaseAnalyzerForm.controls['country'];
    this.vessel = this.createPurchaseAnalyzerForm.controls['vessel'];
    this.paymentMode = this.createPurchaseAnalyzerForm.controls['paymentMode'];
    this.remark = this.createPurchaseAnalyzerForm.controls['remark'];
    this.currency = this.createPurchaseAnalyzerForm.controls['currency'];


  }
}
