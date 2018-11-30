import { FormGroup, FormArray, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { AuthenticationService } from '../../../../../core/authentication/authentication.service';
import { Logger } from '../../../../../core/logger.service';
import { ItemMovementAnalyzers, ItemMovementAnalyzerService} from '../itemMovementAnalyzer.service';

const log = new Logger('createItemMovementAnalyzer');

@Component({
  selector: 'create-ItemMovementAnalyzer',
  templateUrl: './createItemMovementAnalyzer.html',
  styleUrls: ['./createItemMovementAnalyzer.scss']
})
export class CreateItemMovementAnalyzer implements OnInit  {
  itemMovementAnalyzerIdParam: string;
  pageTitle = 'Create Item Movement Analyzer';

  error: string = null;
  isLoading = false;
  createItemMovementAnalyzerForm: FormGroup;

  public company: AbstractControl;
  public category: AbstractControl;
  public searchType: AbstractControl;
  public transactionType: AbstractControl;
  public partyType: AbstractControl;
  public party: AbstractControl;
  public fromDate: AbstractControl;
  public toDate: AbstractControl;
  public lot: AbstractControl;
  public item: AbstractControl;
  public remark: AbstractControl;
  public itemParameters: AbstractControl;



  constructor(private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private service: ItemMovementAnalyzerService,
    private authService: AuthenticationService) {
      this.initForm();
  }

  ngOnInit() {

    this.route.params.subscribe((params: Params) => {
      this.itemMovementAnalyzerIdParam = params['itemMovementAnalyzerId'];
      if (this.itemMovementAnalyzerIdParam) {
        this.pageTitle = 'Edit item Movement Analyzer';
        let itemMovementAnalyzerData: any = this.service.getItemMovementAnalyzerById(this.itemMovementAnalyzerIdParam);
        this.createItemMovementAnalyzerForm.patchValue(itemMovementAnalyzerData);
      }
    });
  }

   submit() {
    this.isLoading = true;
    const formValue: any = this.createItemMovementAnalyzerForm.value;

  if (this.itemMovementAnalyzerIdParam) {
    this.service.updateItemMovementAnalyzer(this.createItemMovementAnalyzerForm.value)
    .subscribe( itemMovementAnalyzer => {
      // log.debug(`${credentials.selectCategory} successfully logged in`);
      this.handleBack();
      this.finally();
    }, error => {
      log.debug(`Creation error: ${error}`);
      this.error = error;
      this.finally();
    });
  } else {
      this.service.createItemMovementAnalyzer(this.createItemMovementAnalyzerForm.value)
      .subscribe(itemMovementAnalyzer => {
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
      this.createItemMovementAnalyzerForm.markAsPristine();
  }

  handleBack(cancelling: boolean = false) {
    // TODO: if cancelling then ask to confirn

    if (this.itemMovementAnalyzerIdParam) {
      this.router.navigate(['../../itemMovementAnalyzer'], {relativeTo: this.route});
    } else {
      this.router.navigate(['../itemMovementAnalyzer'], {relativeTo: this.route});
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
    const control = <FormArray>this.createItemMovementAnalyzerForm.controls['parameters'];
    control.push(this.initParameter());
  }

  removeParameter(i: number) {
    // remove parameter from the list
    const control = <FormArray>this.createItemMovementAnalyzerForm.controls['parameters'];
    control.removeAt(i);
  }

  private initForm() {
    this.createItemMovementAnalyzerForm = this.fb.group({
      'id': [''],
      'company': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'category': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'searchType': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'transactionType': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'partyType': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'party': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'fromDate': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'toDate': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'lot': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'item': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'remark': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'parameters': this.fb.array([this.initParameter()]),

    });

    this.company = this.createItemMovementAnalyzerForm.controls['company'];
    this.category = this.createItemMovementAnalyzerForm.controls['category'];
    this.searchType = this.createItemMovementAnalyzerForm.controls['searchType'];
    this.transactionType = this.createItemMovementAnalyzerForm.controls['transactionType'];
    this.partyType = this.createItemMovementAnalyzerForm.controls['partyType'];
    this.party = this.createItemMovementAnalyzerForm.controls['party'];
    this.fromDate = this.createItemMovementAnalyzerForm.controls['fromDate'];
    this.toDate = this.createItemMovementAnalyzerForm.controls['toDate'];
    this.lot = this.createItemMovementAnalyzerForm.controls['lot'];
    this.item = this.createItemMovementAnalyzerForm.controls['item'];
    this.remark = this.createItemMovementAnalyzerForm.controls['remark'];
    this.itemParameters = this.createItemMovementAnalyzerForm.controls['parameters'];


  }
}
