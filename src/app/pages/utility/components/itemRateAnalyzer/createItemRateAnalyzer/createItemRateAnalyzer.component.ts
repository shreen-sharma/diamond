import { FormGroup, FormArray, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { AuthenticationService } from '../../../../../core/authentication/authentication.service';
import { Logger } from '../../../../../core/logger.service';
import { ItemRateAnalyzers, ItemRateAnalyzerService} from '../itemRateAnalyzer.service';

const log = new Logger('createItemRateAnalyzer');

@Component({
  selector: 'create-ItemRateAnalyzer',
  templateUrl: './createItemRateAnalyzer.html',
  styleUrls: ['./createItemRateAnalyzer.scss']
})
export class CreateItemRateAnalyzer implements OnInit  {
  itemRateAnalyzerIdParam: string;
  pageTitle = 'Create Item Rate Analyzer';

  error: string = null;
  isLoading = false;
  createItemRateAnalyzerForm: FormGroup;

  public company: AbstractControl;
  public partyType: AbstractControl;
  public party: AbstractControl;
  public searchMode: AbstractControl;
  public zone: AbstractControl;
  public country: AbstractControl;
  public currency: AbstractControl;
  public curFromDate: AbstractControl;
  public curToDate: AbstractControl;
  public terms: AbstractControl;
  public termsFromDate: AbstractControl;
  public termsToDate: AbstractControl;
  public category: AbstractControl;
  public item: AbstractControl;
  public itemDesc: AbstractControl;
  public itemParameters: AbstractControl;



  constructor(private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private service: ItemRateAnalyzerService,
    private authService: AuthenticationService) {
      this.initForm();
  }

  ngOnInit() {

    this.route.params.subscribe((params: Params) => {
      this.itemRateAnalyzerIdParam = params['itemRateAnalyzerId'];
      if (this.itemRateAnalyzerIdParam) {
        this.pageTitle = 'Edit item Rate Analyzer';
        let itemRateAnalyzerData: any = this.service.getItemRateAnalyzerById(this.itemRateAnalyzerIdParam);
        this.createItemRateAnalyzerForm.patchValue(itemRateAnalyzerData);
      }
    });
  }

   submit() {
    this.isLoading = true;
    const formValue: any = this.createItemRateAnalyzerForm.value;

  if (this.itemRateAnalyzerIdParam) {
    this.service.updateItemRateAnalyzer(this.createItemRateAnalyzerForm.value)
    .subscribe( itemRateAnalyzer => {
      // log.debug(`${credentials.selectCategory} successfully logged in`);
      this.handleBack();
      this.finally();
    }, error => {
      log.debug(`Creation error: ${error}`);
      this.error = error;
      this.finally();
    });
  } else {
      this.service.createItemRateAnalyzer(this.createItemRateAnalyzerForm.value)
      .subscribe(itemRateAnalyzer => {
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
      this.createItemRateAnalyzerForm.markAsPristine();
  }

  handleBack(cancelling: boolean = false) {
    // TODO: if cancelling then ask to confirn

    if (this.itemRateAnalyzerIdParam) {
      this.router.navigate(['../../itemRateAnalyzer'], {relativeTo: this.route});
    } else {
      this.router.navigate(['../itemRateAnalyzer'], {relativeTo: this.route});
    }
  }

  initParameter() {
    // initialize parameter
    return this.fb.group({
        parameterName: ['', Validators.required],
        parameterValue: ['', Validators.required]
    });
  }

  addParameter() {
    // add parameter to the list
    const control = <FormArray>this.createItemRateAnalyzerForm.controls['parameters'];
    control.push(this.initParameter());
  }

  removeParameter(i: number) {
    // remove parameter from the list
    const control = <FormArray>this.createItemRateAnalyzerForm.controls['parameters'];
    control.removeAt(i);
  }

  private initForm() {
    this.createItemRateAnalyzerForm = this.fb.group({
      'id': [''],
      'company': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'partyType': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'party': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'searchMode': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'zone': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'country': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'currency': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'curFromDate': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'curToDate': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'terms': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'termsFromDate': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'termsToDate': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'item': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'itemDesc': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'parameters': this.fb.array([this.initParameter()]),

    });

    this.company = this.createItemRateAnalyzerForm.controls['company'];
    this.partyType = this.createItemRateAnalyzerForm.controls['partyType'];
    this.party = this.createItemRateAnalyzerForm.controls['party'];
    this.searchMode = this.createItemRateAnalyzerForm.controls['searchMode'];
    this.zone = this.createItemRateAnalyzerForm.controls['zone'];
    this.party = this.createItemRateAnalyzerForm.controls['party'];
    this.country = this.createItemRateAnalyzerForm.controls['country'];
    this.currency = this.createItemRateAnalyzerForm.controls['currency'];
    this.curFromDate = this.createItemRateAnalyzerForm.controls['curFromDate'];
    this.curToDate = this.createItemRateAnalyzerForm.controls['curToDate'];
    this.terms = this.createItemRateAnalyzerForm.controls['terms'];
    this.termsFromDate = this.createItemRateAnalyzerForm.controls['termsFromDate'];
    this.termsToDate = this.createItemRateAnalyzerForm.controls['termsToDate'];
    this.item = this.createItemRateAnalyzerForm.controls['item'];
    this.itemDesc = this.createItemRateAnalyzerForm.controls['itemDesc'];
    this.itemParameters = this.createItemRateAnalyzerForm.controls['parameters'];


  }
}
