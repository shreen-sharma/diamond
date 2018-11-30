import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { Location } from '@angular/common';
import { AuthenticationService } from '../../../../../core/authentication/authentication.service';
import { Logger } from '../../../../../core/logger.service';
import { Hierarchy, HierarchyCreationService } from '../hierarchyCreation.service';
import { ZoneEntryService} from '../../../../masters/components/zoneEntry/zoneEntry.service';
import {CommonService} from '../../../../masters/components/common/common.service';
import {CurrencyService} from '../../../../masters/components/currency/currency.service';
import { CommonModalComponent } from '../../../../../shared/common-modal/common-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

const log = new Logger('createHierarchy');

@Component({
  selector: 'createHierarchy',
  templateUrl: './createHierarchy.html',
  styleUrls: ['./createHierarchy.scss']
})
export class CreateHierarchy implements OnInit {

  pageTitle = 'Create Hierarchy';
  error: string = null;
  isLoading = false;
  hierForm: FormGroup;
  addressMaster: FormGroup;
  hierarchyDetailRequestDTO: FormGroup;
  // showDv = false;
  showLo = false;
  showCm = false;
  data;
  hierId: number;
  hierarchyType: string;

  countryList: any[] = [];
  stateList: any[] = [];
  cityList: any[] = [];
  businessNatureList: any[] = [];
  businessTypeList: any[] = [];
  firmNatureList: any[] = [];
  currencyMasterList: any[] = [];
  isView: any;

  public hierType: AbstractControl;
  public hierName: AbstractControl;
  public hierCode: AbstractControl;
  public add11: AbstractControl;
  public add12: AbstractControl;
  public pinCode: AbstractControl;
  public country: AbstractControl;
  public state: AbstractControl;
  public city: AbstractControl;
  public phoneR: AbstractControl;
  public phoneO: AbstractControl;
  public mobile: AbstractControl;
  public email: AbstractControl;
  public estabDate: AbstractControl;
  public gSTNo: AbstractControl;
  public currencyMasterByCurrId: AbstractControl;
  public currencyMasterByStockCurrId: AbstractControl;
  public commonMasterByBussNatureId: AbstractControl;
  public commonMasterByBussTypeId: AbstractControl;
  public commonMasterByFirmNatureId: AbstractControl;
  public decPlace: AbstractControl;
  public finMonth: AbstractControl;
  public cinNo: AbstractControl;
  public panNo: AbstractControl;
  showSbtBtn: any;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder,
    private zoneService: ZoneEntryService,
    private commonService: CommonService,
    private currencyService: CurrencyService,
    private service: HierarchyCreationService,
    private authService: AuthenticationService,
    private modalService: NgbModal,) {
    this.createForm();

    this.commonService.getAllCommonMasterByType('BN').subscribe( (businessNatureList) => {
      this.businessNatureList = businessNatureList;
     });

     this.commonService.getAllCommonMasterByType('FN').subscribe( (firmNatureList) => {
      this.firmNatureList = firmNatureList;
     });

     this.commonService.getAllCommonMasterByType('BT').subscribe( (businessTypeList) => {
      this.businessTypeList = businessTypeList;
     });

     this.currencyService.getAllCurrencies().subscribe( (currencyMasterList) => {
      this.currencyMasterList = currencyMasterList;
     });

    this.zoneService.getAllCountries().subscribe( (countryList) => {
     this.countryList = countryList;
    });
  }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {

      this.hierId = params['hierId'];
      this.isView = params['isView'];
      if (this.hierId) {
        this.pageTitle = 'Edit Hierarchy';
        this.service.getHierById(this.hierId).subscribe(res => {
         
          this.hierarchyType = res.hierType;
          if ( res.hierType === 'LO' || res.hierType === 'CO' ) {
            if ( res.hierType === 'LO') {
              this.showLo = true;
              this.showCm = false;
            } else if ( res.hierType === 'CO' ) {
                this.showLo = true;
                this.showCm = true;
            }
            // Get state list
            this.onCountryChange(res.addressMaster.country);
            this.onStateChange(res.addressMaster.state);
            // Get city list


          }
          this.markAllTouched(this.hierForm);

          if (res.hierarchyDetailRequestDTO == null && res.addressMaster == null) {
            this.hierForm.controls['hierType'].patchValue(res.hierType);
            this.hierForm.controls['hierName'].patchValue(res.hierName);
            this.hierForm.controls['hierCode'].patchValue(res.hierCode);
          } else if (res.hierarchyDetailRequestDTO == null) {
            this.hierForm.controls['hierType'].patchValue(res.hierType);
            this.hierForm.controls['hierName'].patchValue(res.hierName);
            this.hierForm.controls['hierCode'].patchValue(res.hierCode);
            this.hierForm.controls['addressMaster'].patchValue(res.addressMaster);
          } else {
            this.hierForm.patchValue(res);
          }

          if(this.isView == 'true'){
            this.pageTitle = 'View Hierarchy';
            this.hierForm.disable();
            this.hierForm.markAsUntouched();
            this.showSbtBtn = false;
          } else {
            this.showSbtBtn = true;
          }
        })
      }
      else{
        this.showSbtBtn = true;
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

  validSubmit() {
    this.isLoading = true;
    const formValue: any = this.hierForm.value;
    this.data = formValue;

    if (this.hierId) {
      this.data.hierId = this.hierId;
      this.service.updateHier(this.hierId, this.data)
        .subscribe(hier => {
           this.location.back();
          this.finally();
        }, error => {
          log.debug(`Creation error: ${error}`);
          this.error = error;
          this.finally();
        });
    } else {
      this.service.createHier(this.data)
        .subscribe(hier => {
          this.location.back();
          this.finally();
        }, error => {
          log.debug(`Creation error: ${error}`);
          this.error = error;
          this.finally();
        });
      }
  }

  submit() {
    if (this.hierType.valid && this.hierName.valid && this.hierCode.valid) {
      if (this.hierForm.controls['hierType'].value == 'LO' && this.hierForm.controls['addressMaster'].valid) {
            this.validSubmit();
      } else if (this.hierForm.controls['hierType'].value == 'CO' && this.hierForm.controls['addressMaster'].valid
          && this.hierForm.controls['hierarchyDetailRequestDTO'].valid) {
          this.validSubmit();
      } else if(this.hierForm.controls['hierType'].value == 'DV' || this.hierForm.controls['hierType'].value == 'DP' || this.hierForm.controls['hierType'].value == 'SD') {
          this.validSubmit();
      }
    }
  }

  finally() {
    this.isLoading = false;
    this.hierForm.markAsPristine();
  }

  onSelect(value: any) {
    this.selectType(value);
  }

  onCountryChange(value: any) {
    this.hierForm.get('addressMaster.state').setValue('');
   this.zoneService.getAllStatesOfCountry(value).subscribe((stateList) => {
     this.stateList = stateList;
   });
  }

  onStateChange(stateId: number ) {
    this.hierForm.get('addressMaster.city').setValue('');
   this.zoneService.getAllCitiesOfState(stateId).subscribe((cityList) => {
     this.cityList = cityList;
   });
  }
  selectType(value: any) {
    if(this.hierId) {
      this.hierType.setValue(this.hierarchyType);
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = false;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'You cannot Change Hierarchy Type in Edit Mode!!';
    } else {
      if (value == 'LO') {
        this.zoneService.getAllCountries().subscribe( (countryList) => {
           this.countryList = countryList;
            this.showLo = true;
            this.showCm = false;
            if (!this.hierId) {
              this.hierForm.controls['addressMaster'].reset();
            }
        });
      } else if (value == 'CO') {
        this.zoneService.getAllCountries().subscribe( (countryList) => {
          this.countryList = countryList;
          this.showCm = true;
          this.showLo = true;
          if (!this.hierId) {
              this.hierForm.controls['addressMaster'].reset();
            }
        });
      }else {
        this.showCm = false;
        this.showLo = false;
        if (!this.hierId) {
          this.hierForm.controls['hierCode'].reset();
          this.hierForm.controls['hierName'].reset();          }
      }
    }
  }

  handleBack(cancelling: boolean) {
//    if (this.hierTypeParam) {
      // this.router.navigate(['../../bankBranch'], {relativeTo: this.route});
      this.location.back();
  //  } else {
    //  this.location.back();
      // this.router.navigate(['../bankBranch'], {relativeTo: this.route});
  //  }
  }
  private createForm() {
    this.hierForm = this.fb.group({
      'hierId': [''],
      'hierType': ['', Validators.required],
      'hierName': ['', Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(100)])],
      'hierCode': ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(20)])],

      'hierarchyDetailRequestDTO' : this.fb.group({
        'hierDetId': [''],
        'estabDate': ['', Validators.required],
        'gSTNo': ['', Validators.compose([Validators.required, Validators.minLength(15), Validators.maxLength(15)])],
        'currencyMasterByCurrId': ['', Validators.required],
        'currencyMasterByStockCurrId': ['', Validators.required],
        'commonMasterByBussNatureId': ['', Validators.required],
        'commonMasterByBussTypeId': ['', Validators.required],
        'commonMasterByFirmNatureId': ['', Validators.required],
        'decPlace': ['', Validators.compose([Validators.required])],
        'finMonth':  ['', Validators.compose([Validators.required])],
        'cinNo': ['', Validators.compose([Validators.required, Validators.minLength(21), Validators.maxLength(21)])],
        'panNo': ['', Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(10)])]
      }),

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

    this.hierType = this.hierForm.controls['hierType'];
    this.hierName = this.hierForm.controls['hierName'];
    this.hierCode = this.hierForm.controls['hierCode'];

    this.estabDate = this.hierForm.get('hierarchyDetailRequestDTO.estabDate');
    this.gSTNo = this.hierForm.get('hierarchyDetailRequestDTO.gSTNo');
    this.currencyMasterByCurrId = this.hierForm.get('hierarchyDetailRequestDTO.currencyMasterByCurrId');
    this.currencyMasterByStockCurrId = this.hierForm.get('hierarchyDetailRequestDTO.currencyMasterByStockCurrId');
    this.commonMasterByBussNatureId = this.hierForm.get('hierarchyDetailRequestDTO.commonMasterByBussNatureId');
    this.commonMasterByBussTypeId = this.hierForm.get('hierarchyDetailRequestDTO.commonMasterByBussTypeId');
    this.commonMasterByFirmNatureId = this.hierForm.get('hierarchyDetailRequestDTO.commonMasterByFirmNatureId');
    this.finMonth = this.hierForm.get('hierarchyDetailRequestDTO.finMonth');
    this.decPlace = this.hierForm.get('hierarchyDetailRequestDTO.decPlace');
    this.cinNo = this.hierForm.get('hierarchyDetailRequestDTO.cinNo');
    this.panNo = this.hierForm.get('hierarchyDetailRequestDTO.panNo');

    this.add11 = this.hierForm.get('addressMaster.add11');
    this.add12 = this.hierForm.get('addressMaster.add12');
    this.country = this.hierForm.get('addressMaster.country');
    this.city = this.hierForm.get('addressMaster.city');
    this.state = this.hierForm.get('addressMaster.state');
    this.pinCode = this.hierForm.get('addressMaster.pinCode');
    this.phoneR = this.hierForm.get('addressMaster.phoneR');
    this.phoneO = this.hierForm.get('addressMaster.phoneO');
    this.mobile = this.hierForm.get('addressMaster.mobile');
    this.email = this.hierForm.get('addressMaster.email');

  }

}
