import {Component, OnInit} from '@angular/core';
import { FormGroup, FormArray, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';

import { AuthenticationService } from '../../../../../core/authentication/authentication.service';
import { Logger } from '../../../../../core/logger.service';
import { StockAnalyzers, StockAnalyzerService } from '../stockAnalyzer.service';

const log = new Logger('create_stock_Analyzer');

@Component({
  selector: 'createStockAnalyzer',
  templateUrl: './createStockAnalyzer.html',
  styleUrls: ['./createStockAnalyzer.scss']
})
export class CreateStockAnalyzer implements OnInit {
  stockAnalyzerIdParam: string;
  pageTitle = 'Create Stock Analyzer';

  error: string = null;
  isLoading = false;
  stockAnalyzerForm: FormGroup;

  public company: AbstractControl;
  public category: AbstractControl;
  public lot: AbstractControl;
  public item: AbstractControl;
  public itemParameters: AbstractControl;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private service: StockAnalyzerService,
    private authService: AuthenticationService) {
    this.createForm();
  }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.stockAnalyzerIdParam = params['stockAnalyzerId'];
      if (this.stockAnalyzerIdParam) {
        this.pageTitle = 'Edit Stock Analyzer';
        const stockAnalyzerData: any = this.service.getStockAnalyzerById(this.stockAnalyzerIdParam);
        this.stockAnalyzerForm.patchValue(stockAnalyzerData);
      }
    });
  }


  submit() {
    this.isLoading = true;
    const formValue: any = this.stockAnalyzerForm.value;

  if (this.stockAnalyzerIdParam) {
    this.service.updateStockAnalyzer(this.stockAnalyzerForm.value)
    .subscribe( stockAnalyzer => {
      // log.debug(`${credentials.selectCategory} successfully logged in`);
      this.handleBack();
      this.finally();
    }, error => {
      log.debug(`Creation error: ${error}`);
      this.error = error;
      this.finally();
    });
  } else {
      this.service.createStockAnalyzer(this.stockAnalyzerForm.value)
      .subscribe(stockAnalyzer => {
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
      this.stockAnalyzerForm.markAsPristine();
  }

  handleBack(cancelling: boolean = false) {
    // TODO: if cancelling then ask to confirn

    if (this.stockAnalyzerIdParam) {
      this.router.navigate(['../../stockAnalyzer'], {relativeTo: this.route});
    } else {
      this.router.navigate(['../stockAnalyzer'], {relativeTo: this.route});
    }
  }


  onGoToAvgRateAnalyzer(event: any) {
    this.router.navigate(['../itemAverageRateAnalyzer'], {relativeTo: this.route});
  }

  onGoToMovementAnalyzer($event: any) {
    this.router.navigate(['../itemMovementAnalyzer'], {relativeTo: this.route});

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
    const control = <FormArray>this.stockAnalyzerForm.controls['parameters'];
    control.push(this.initParameter());
}

removeParameter(i: number) {
    // remove parameter from the list
    const control = <FormArray>this.stockAnalyzerForm.controls['parameters'];
    control.removeAt(i);
}

private createForm() {
  this.stockAnalyzerForm = this.fb.group({
    'id': [''],
    'category': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
    'company': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
    'lot': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
    'item': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
    'parameters': this.fb.array([this.initParameter()])
  });

  this.category = this.stockAnalyzerForm.controls['category'];
  this.company = this.stockAnalyzerForm.controls['company'];
  this.lot = this.stockAnalyzerForm.controls['lot'];
  this.item = this.stockAnalyzerForm.controls['item'];
  this.itemParameters = this.stockAnalyzerForm.controls['parameters'];
}
}
