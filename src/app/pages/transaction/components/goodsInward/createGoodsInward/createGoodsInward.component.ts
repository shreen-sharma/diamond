import { FormGroup, FormArray, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';

import { AuthenticationService } from '../../../../../core/authentication/authentication.service';
import { Logger } from '../../../../../core/logger.service';
import { GoodsInwardForManufacturing, GoodsInwardService } from '../goodsInward.service';


const log = new Logger('GoodsInward');

@Component({
  selector: 'create-goodsInward',
  templateUrl: './createGoodsInward.html',
  styleUrls: ['./createGoodsInward.scss']
})
export class CreateGoodsInward implements OnInit  {
  goodsInwardIdParam: string;
  pageTitle = 'Goods Inward For Manufacturing';

  error: string = null;
  isLoading = false;
  goodsInwardForm: FormGroup;

  public selectParty: AbstractControl;
  public process: AbstractControl;
  public jangadNo: AbstractControl;
  public inwardNo: AbstractControl;
  public inwardDate: AbstractControl
  public inwardNoFormat: AbstractControl;
  public jangadDate: AbstractControl;
  public lot: AbstractControl;
  public remark: AbstractControl;
  public issuedItem: AbstractControl;
  public instruction: AbstractControl;
  public pieces: AbstractControl;
  public carats: AbstractControl;
  public totalPieces: AbstractControl;
  public totalCarats: AbstractControl;
  public itemParameters: AbstractControl;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private service: GoodsInwardService,
    private authService: AuthenticationService) {
      this.createForm();
  }

  ngOnInit() {

    this.route.params.subscribe((params: Params) => {
      this.goodsInwardIdParam = params['goodsInwardId'];
      if (this.goodsInwardIdParam) {
        this.pageTitle = 'Goods Inward For Manufactioring';
        let GoodsInwardData: any = this.service.getGoodsInwardById(this.goodsInwardIdParam);
        this.goodsInwardForm.patchValue(GoodsInwardData);
      }
    });
  }

  submit() {
    this.isLoading = true;
    const formValue: any = this.goodsInwardForm.value;

  if (this.goodsInwardIdParam) {
    this.service.updateGoodsInward(this.goodsInwardForm.value)
    .subscribe( goodsInward => {
      // log.debug(`${credentials.selectedCompany} successfully logged in`);
      this.handleBack();
      this.finally();
    }, error => {
      log.debug(`Creation error: ${error}`);
      this.error = error;
      this.finally();
    });
  } else {
      this.service.createGoodsInward(this.goodsInwardForm.value)
      .subscribe(goodsInward => {
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
      this.goodsInwardForm.markAsPristine();
  }

  handleBack(cancelling: boolean= false) {
    // TODO: if cancelling then ask to confirn

    if (this.goodsInwardIdParam) {
      this.router.navigate(['../../goodsInward'], {relativeTo: this.route});
    } else {
      this.router.navigate(['../goodsInward'], {relativeTo: this.route});
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
    const control = <FormArray>this.goodsInwardForm.controls['parameters'];
    control.push(this.initParameter());
}

removeParameter(i: number) {
    // remove parameter from the list
    const control = <FormArray>this.goodsInwardForm.controls['parameters'];
    control.removeAt(i);
}

  private createForm() {
    this.goodsInwardForm = this.fb.group({
      'id': [''],
      'selectParty': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'process': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'jangadNo': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'inwardNo': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'inwardNoFormat': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'inwardDate': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'jangadDate': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'lot': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'remark': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'instruction': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'issuedItem': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'pieces': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'carats': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'totalPieces': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'totalCarats': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'parameters': this.fb.array([this.initParameter()])
    });

    this.selectParty = this.goodsInwardForm.controls['selectParty'];
    this.process = this.goodsInwardForm.controls['process'];
    this.jangadNo = this.goodsInwardForm.controls['jangadNo'];
    this.inwardNo = this.goodsInwardForm.controls['inwardNo'];
    this.inwardNoFormat = this.goodsInwardForm.controls['inwardNoFormat'];
    this.inwardDate = this.goodsInwardForm.controls['inwardDate'];
    this.jangadDate = this.goodsInwardForm.controls['jangadDate'];
    this.lot = this.goodsInwardForm.controls['lot'];
    this.remark = this.goodsInwardForm.controls['remark'];
    this.instruction = this.goodsInwardForm.controls['instruction'];
    this.issuedItem = this.goodsInwardForm.controls['issuedItem'];
    this.pieces = this.goodsInwardForm.controls['pieces'];
    this.carats = this.goodsInwardForm.controls['carats'];
    this.totalPieces = this.goodsInwardForm.controls['totalPieces'];
    this.totalCarats = this.goodsInwardForm.controls['totalCarats'];
    this.itemParameters = this.goodsInwardForm.controls['parameters'];
  }
}
