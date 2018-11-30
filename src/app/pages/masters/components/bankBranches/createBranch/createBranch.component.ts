import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { Location } from '@angular/common';
import { AuthenticationService } from '../../../../../core/authentication/authentication.service';
import { Logger } from '../../../../../core/logger.service';
import { Branch, BranchService } from '../branch.service';
import { ZoneEntryService } from '../../zoneEntry/zoneEntry.service';
import { CommonService } from '../../common/common.service';


const log = new Logger('Branch');

@Component({
  selector: 'create-branch',
  templateUrl: './createBranch.html',
  styleUrls: ['./createBranch.scss']
})
export class CreateBranch implements OnInit  {

  branchIdParam: string;
  pageTitle = 'Create Branch';
  error: string = null;
  isLoading = false;
  branchForm: FormGroup;
  addressMaster: FormGroup;

  bankList: any[] = [];
  countryList: any[] = [];
  stateList: any[] = [];
  cityList: any[] = [];
  bankTypeList: any[] = [];
  businessList: any[] = [];
  accessList: any[] = [];
  upDateAccess:boolean = false;

  public commonMasterByBankName: AbstractControl;
  public bankBrName: AbstractControl;
  public bankBrCode: AbstractControl;
  public bankType: AbstractControl;
  public commonMasterByBussNatureId: AbstractControl;
  public fidNo: AbstractControl;
  public routingNo: AbstractControl;
  public swiftNo: AbstractControl;
  public telexNo: AbstractControl;
  public websiteAddress: AbstractControl;
  public bankStatus: AbstractControl;
  public note: AbstractControl;
  public add11: AbstractControl;
  public add12: AbstractControl;
  public country: AbstractControl;
  public city: AbstractControl;
  public state: AbstractControl;
  public pinCode: AbstractControl;
  public phoneR: AbstractControl;
  public phoneO: AbstractControl;
  public mobile: AbstractControl;
  public email: AbstractControl;
  isView: any;


  constructor(private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder,
    private service: BranchService,
    private zoneService: ZoneEntryService,
    // private countryService: CountryService,
    // private stateService: StateService,
    // private cityService: CityService,
    private commonService: CommonService,
    private authService: AuthenticationService) {

      this.accessList = this.authService.getUserAccessOfMenu('bankBranch');
      this.createForm();

      this.commonService.getAllCommonMasterByType('BK').subscribe( (bankList) => {
        this.bankList = bankList;
       });

       this.zoneService.getAllCountries().subscribe( (countryList) => {
        this.countryList = countryList;
       });

       this.commonService.getAllCommonMasterByType('BY').subscribe( (bankTypeList) => {
        this.bankTypeList = bankTypeList;
       });

       this.commonService.getAllCommonMasterByType('BN').subscribe( (businessList) => {
        this.businessList = businessList;
       });

  }

  ngOnInit() {

    this.route.params.subscribe((params: Params) => {
      this.branchIdParam = params['bankBrId'];
      this.isView = params['isView'];
      if (this.branchIdParam) {
        this.pageTitle = 'Edit Branch';
        this.service.getBankBranchById(this.branchIdParam).subscribe(res => {
        if(this.isView == 'true'){
          this.onCountryChange(res.addressMaster.country);
          this.onStateChange(res.addressMaster.state);
          this.branchForm.patchValue(res);
          this.branchForm.disable();
          this.branchForm.markAsUntouched();
          this.upDateAccess = true;
        } else {
          this.onCountryChange(res.addressMaster.country);
          this.onStateChange(res.addressMaster.state);
          this.markAllTouched(this.branchForm);
          this.branchForm.patchValue(res);
        }
        })
      }
    });
  }

    markAllTouched(control: AbstractControl) {
      if (control.hasOwnProperty('controls')) {
          const ctrl = <any>control;
          for (const inner in ctrl.controls) {
            if (ctrl.controls) {
              this.markAllTouched(ctrl.controls[inner]);
            }
          }
      } else {
          control.markAsTouched();
        }
    }

  submit() {
    if (this.branchForm.valid) {
    this.isLoading = true;
    const formValue: any = this.branchForm.value;
    debugger;
    if (this.branchIdParam) {
      this.service.updateBranch(this.branchForm.value)
      .subscribe(branch => {
        // log.debug(`${credentials.username} successfully logged in`);
        // this.router.navigate(['../../'], {relativeTo: this.route});
        this.location.back();
        this.finally();
      }, error => {
        log.debug(`Creation error: ${error}`);
        this.error = error;
        this.finally();
      });
    } else {
      this.service.createBranch(this.branchForm.value)
      .subscribe(branch => {
        console.log(branch);
        // log.debug(`${credentials.username} successfully logged in`);
        // this.router.navigate(['../bankBranch'], {relativeTo: this.route});
        this.location.back();
        this.finally();
      }, error => {
        log.debug(`Creation error: ${error}`);
        this.error = error;
        this.finally();
      });
     }
    }
  }

  onCountryChange(value: any) {
    this.branchForm.get('addressMaster.state').setValue('');
    this.zoneService.getAllStatesOfCountry(value).subscribe((stateList) => {
      this.stateList = stateList;
    });
   }

  onStateChange(stateId: number ) {
    this.branchForm.get('addressMaster.city').setValue('');
    this.zoneService.getAllCitiesOfState(stateId).subscribe((cityList) => {
      this.cityList = cityList;
    });
   }

  finally() {
      this.isLoading = false;
      this.branchForm.markAsPristine();
  }

  handleBack(cancelling: boolean) {
    // TODO: if cancelling then ask to confirn

    if (this.branchIdParam) {
      // this.router.navigate(['../../bankBranch'], {relativeTo: this.route});
      this.location.back();
    } else {
      this.location.back();
      // this.router.navigate(['../bankBranch'], {relativeTo: this.route});
    }
  }
  private createForm() {
    this.branchForm = this.fb.group({
      'bankBrId': [''],
      'commonMasterByBankName':   ['', Validators.compose([Validators.required])],
      'bankBrName': ['', Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(100)])],
      'bankBrCode': ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(100)])],
      'commonMasterByBussNatureId': ['', Validators.compose([Validators.required])],
      'bankType': ['', Validators.compose([Validators.required])],
      'fidNo': ['', Validators.compose([Validators.maxLength(20)])],
      'routingNo': ['', Validators.compose([Validators.maxLength(20)])],
      'swiftNo': ['', Validators.compose([Validators.maxLength(20)])],
      'telexNo': ['', Validators.compose([Validators.maxLength(20)])],
      'websiteAddress': ['', Validators.compose([Validators.required,
        Validators.minLength(4), Validators.maxLength(100)])],
      'bankStatus': ['', Validators.compose([Validators.required])],
      'note': ['', Validators.compose([Validators.maxLength(250)])],

      'addressMaster': this.fb.group({
      'addressId': [''],
      'add11': ['', Validators.compose([Validators.required, Validators.maxLength(50)])],
      'add12': ['', Validators.compose([Validators.required, Validators.maxLength(50)])],
      'country': ['', Validators.required],
      'state': ['', Validators.required],
      'city': ['', Validators.required],
      'pinCode': ['', Validators.compose([Validators.required, Validators.pattern('[0-9]*'),
        Validators.minLength(6), Validators.maxLength(6)])],
      'phoneR': ['', Validators.compose([Validators.pattern('[0-9]*'), Validators.maxLength(15)])],
      'phoneO': ['', Validators.compose([Validators.pattern('[0-9]*'), Validators.maxLength(15)])],
      'mobile': ['', Validators.compose([Validators.required, Validators.pattern('[0-9]*'),
       Validators.minLength(10), Validators.maxLength(10)])],
      'email': ['', Validators.compose([Validators.required, Validators.email])],
      }),

    });

    this.commonMasterByBankName = this.branchForm.controls['commonMasterByBankName'];
    this.bankBrName = this.branchForm.controls['bankBrName'];
    this.bankBrCode = this.branchForm.controls['bankBrCode'];
    this.commonMasterByBussNatureId = this.branchForm.controls['commonMasterByBussNatureId'];
    this.bankType = this.branchForm.controls['bankType'];
    this.fidNo = this.branchForm.controls['fidNo'];
    this.routingNo = this.branchForm.controls['routingNo'];
    this.swiftNo = this.branchForm.controls['swiftNo'];
    this.telexNo = this.branchForm.controls['telexNo'];
    this.websiteAddress = this.branchForm.controls['websiteAddress'];
    this.bankStatus = this.branchForm.controls['bankStatus'];
    this.note = this.branchForm.controls['note'];

    this.add11 = this.branchForm.get('addressMaster.add11');
    this.add12 = this.branchForm.get('addressMaster.add12');
    this.country = this.branchForm.get('addressMaster.country');
    this.city = this.branchForm.get('addressMaster.city');
    this.state = this.branchForm.get('addressMaster.state');
    this.pinCode = this.branchForm.get('addressMaster.pinCode');
    this.phoneR = this.branchForm.get('addressMaster.phoneR');
    this.phoneO = this.branchForm.get('addressMaster.phoneO');
    this.mobile = this.branchForm.get('addressMaster.mobile');
    this.email = this.branchForm.get('addressMaster.email');
  }

}
