import { FormGroup, FormArray, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';

import { AuthenticationService } from '../../../../../core/authentication/authentication.service';
import { Logger } from '../../../../../core/logger.service';
import { GoodsOutwardForManufacturing, GoodsOutwardService } from '../goodsOutward.service';


const log = new Logger('GoodsOutward');

@Component({
  selector: 'create-goodsOutward',
  templateUrl: './createGoodsOutward.html',
  styleUrls: ['./createGoodsOutward.scss']
})
export class CreateGoodsOutward implements OnInit  {
  goodsOutwardIdParam: string;
  pageTitle = 'Goods Outward For Manufacturing';

  error: string = null;
  isLoading = false;
  goodsOutwardForm: FormGroup;

  public selectParty: AbstractControl;
  public outwardNo: AbstractControl;
  public outwardDate: AbstractControl
  public outwardNoFormat: AbstractControl;
  public category: AbstractControl;
  public returnFromLot: AbstractControl;
  public utilisedCarats: AbstractControl;
  public remark: AbstractControl;
  public processedCategory: AbstractControl;
  public returnItem: AbstractControl;
  public processedPieces: AbstractControl;
  public processedCarats: AbstractControl;
  public processedTotalPieces: AbstractControl;
  public processedTotalCarats: AbstractControl;
  public unprocessedItem: AbstractControl;
  public unprocessedPieces: AbstractControl;
  public unprocessedCarats: AbstractControl;
  public unprocessedTotalPieces: AbstractControl;
  public unprocessedTotalCarats: AbstractControl;
  public processedCts: AbstractControl;
  public processLoss: AbstractControl;
  public unprocessedCts: AbstractControl;
  public totalReturnCts: AbstractControl;


  constructor(private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private service: GoodsOutwardService,
    private authService: AuthenticationService) {
      this.createForm();
  }

  ngOnInit() {

    this.route.params.subscribe((params: Params) => {
      this.goodsOutwardIdParam = params['goodsOutwardId'];
      if (this.goodsOutwardIdParam) {
        this.pageTitle = 'Edit Item Rate Updation';
        let GoodsOutwardData: any = this.service.getGoodsOutwardById(this.goodsOutwardIdParam);
        this.goodsOutwardForm.patchValue(GoodsOutwardData);
      }
    });
  }

  submit() {
    this.isLoading = true;
    const formValue: any = this.goodsOutwardForm.value;

  if (this.goodsOutwardIdParam) {
    this.service.updateGoodsOutward(this.goodsOutwardForm.value)
    .subscribe( goodsOutward => {
      // log.debug(`${credentials.selectedCompany} successfully logged in`);
      this.handleBack();
      this.finally();
    }, error => {
      log.debug(`Creation error: ${error}`);
      this.error = error;
      this.finally();
    });
  } else {
      this.service.createGoodsOutward(this.goodsOutwardForm.value)
      .subscribe(goodsOutward => {
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
      this.goodsOutwardForm.markAsPristine();
  }

  handleBack(cancelling: boolean= false) {
    // TODO: if cancelling then ask to confirn

    if (this.goodsOutwardIdParam) {
      this.router.navigate(['../../goodsOutward'], {relativeTo: this.route});
    } else {
      this.router.navigate(['../goodsOutward'], {relativeTo: this.route});
    }
  }

  private createForm() {
    this.goodsOutwardForm = this.fb.group({
      'id': [''],
      'selectParty': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'category': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'returnFromLot': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'outwardNo': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'outwardNoFormat': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'outwardDate': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'utilisedCarats': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'remark': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'processedCategory': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'returnItem': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'processedPieces': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'processedCarats': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'processedTotalPieces': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'processedTotalCarats': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'unprocessedItem': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'unprocessedPieces': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'unprocessedCarats': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'unprocessedTotalPieces': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'unprocessedTotalCarats': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'processedCts': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'processLoss': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'unprocessedCts': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'totalReturnCts': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
    });

    this.selectParty = this.goodsOutwardForm.controls['selectParty'];
    this.category = this.goodsOutwardForm.controls['category'];
    this.returnFromLot = this.goodsOutwardForm.controls['returnFromLot'];
    this.outwardNo = this.goodsOutwardForm.controls['outwardNo'];
    this.outwardNoFormat = this.goodsOutwardForm.controls['outwardNoFormat'];
    this.outwardDate = this.goodsOutwardForm.controls['outwardDate'];
    this.utilisedCarats = this.goodsOutwardForm.controls['utilisedCarats'];
    this.processedCategory = this.goodsOutwardForm.controls['processedCategory'];
    this.remark = this.goodsOutwardForm.controls['remark'];
    this.returnItem = this.goodsOutwardForm.controls['returnItem'];
    this.processedPieces = this.goodsOutwardForm.controls['processedPieces'];
    this.processedCarats = this.goodsOutwardForm.controls['processedCarats'];
    this.processedTotalPieces = this.goodsOutwardForm.controls['processedTotalPieces'];
    this.processedTotalCarats = this.goodsOutwardForm.controls['processedTotalCarats'];
    this.unprocessedItem = this.goodsOutwardForm.controls['unprocessedItem'];
    this.unprocessedPieces = this.goodsOutwardForm.controls['unprocessedPieces'];
    this.unprocessedCarats = this.goodsOutwardForm.controls['unprocessedCarats'];
    this.unprocessedTotalPieces = this.goodsOutwardForm.controls['unprocessedTotalPieces'];
    this.unprocessedTotalCarats = this.goodsOutwardForm.controls['unprocessedTotalCarats'];
    this.processedCts = this.goodsOutwardForm.controls['processedCts'];
    this.processLoss = this.goodsOutwardForm.controls['processLoss'];
    this.unprocessedCts = this.goodsOutwardForm.controls['unprocessedCts'];
    this.totalReturnCts = this.goodsOutwardForm.controls['totalReturnCts'];
  }
}
