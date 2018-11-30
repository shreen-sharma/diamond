import { FormGroup, FormArray, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { AuthenticationService } from '../../../../../core/authentication/authentication.service';
import { Logger } from '../../../../../core/logger.service';
import { ItemAverageRateAnalyzers, ItemAverageRateAnalyzerService} from '../itemAverageRateAnalyzer.service';

const log = new Logger('createItemAverageRateAnalyzer');

@Component({
  selector: 'create-ItemAverageRateAnalyzer',
  templateUrl: './createItemAverageRateAnalyzer.html',
  styleUrls: ['./createItemAverageRateAnalyzer.scss']
})
export class CreateItemAverageRateAnalyzer implements OnInit  {
  itemAverageRateAnalyzerIdParam: string;
  pageTitle = 'Create Item Average Rate Analyzer';

  error: string = null;
  isLoading = false;
  createItemAverageRateAnalyzerForm: FormGroup;

  public company: AbstractControl;
  public category: AbstractControl;
  public lot: AbstractControl;
  public columnParameter: AbstractControl;
  public rowParameter: AbstractControl;
  public itemParameters: AbstractControl;


  constructor(private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private service: ItemAverageRateAnalyzerService,
    private authService: AuthenticationService) {
      this.createForm();
  }

  ngOnInit() {

    this.route.params.subscribe((params: Params) => {
      this.itemAverageRateAnalyzerIdParam = params['itemAverageRateAnalyzerId'];
      if (this.itemAverageRateAnalyzerIdParam) {
        this.pageTitle = 'Edit Item Average Rate Analyzer';
        let itemAverageRateAnalyzerData: any = this.service.getItemAverageRateAnalyzerById(this.itemAverageRateAnalyzerIdParam);
        this.createItemAverageRateAnalyzerForm.patchValue(itemAverageRateAnalyzerData);
      }
    });
  }

   submit() {
    this.isLoading = true;
    const formValue: any = this.createItemAverageRateAnalyzerForm.value;

  if (this.itemAverageRateAnalyzerIdParam) {
    this.service.updateItemAverageRateAnalyzer(this.createItemAverageRateAnalyzerForm.value)
    .subscribe( itemAverageRateAnalyzer => {
      // log.debug(`${credentials.selectCategory} successfully logged in`);
      this.handleBack();
      this.finally();
    }, error => {
      log.debug(`Creation error: ${error}`);
      this.error = error;
      this.finally();
    });
  } else {
      this.service.createItemAverageRateAnalyzer(this.createItemAverageRateAnalyzerForm.value)
      .subscribe(itemAverageRateAnalyzer => {
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
      this.createItemAverageRateAnalyzerForm.markAsPristine();
  }

  handleBack(cancelling: boolean = false) {
    // TODO: if cancelling then ask to confirn

    if (this.itemAverageRateAnalyzerIdParam) {
      this.router.navigate(['../../itemAverageRateAnalyzer'], {relativeTo: this.route});
    } else {
      this.router.navigate(['../itemAverageRateAnalyzer'], {relativeTo: this.route});
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
    const control = <FormArray>this.createItemAverageRateAnalyzerForm.controls['parameters'];
    control.push(this.initParameter());
  }

  removeParameter(i: number) {
    // remove parameter from the list
    const control = <FormArray>this.createItemAverageRateAnalyzerForm.controls['parameters'];
    control.removeAt(i);
  }

  private createForm() {
    this.createItemAverageRateAnalyzerForm = this.fb.group({
      'id': [''],
      'company': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'category': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'lot': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'columnParameter': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'rowParameter': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'parameters': this.fb.array([this.initParameter()]),
    }),

    this.company = this.createItemAverageRateAnalyzerForm.controls['company'];
    this.category = this.createItemAverageRateAnalyzerForm.controls['category'];
    this.lot = this.createItemAverageRateAnalyzerForm.controls['lot'];
    this.columnParameter = this.createItemAverageRateAnalyzerForm.controls['columnParameter'];
    this.rowParameter = this.createItemAverageRateAnalyzerForm.controls['rowParameter'];
    this.itemParameters = this.createItemAverageRateAnalyzerForm.controls['parameters'];
  }
}
