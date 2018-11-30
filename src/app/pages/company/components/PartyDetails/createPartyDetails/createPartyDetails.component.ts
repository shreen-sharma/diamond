import { BankBranch } from './../../../../masters/components/bankBranches/branches.component';
import { Component, OnInit } from '@angular/core';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { FormGroup, FormArray, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Logger } from '../../../../../core/logger.service';
import { Location } from '@angular/common';
import { PartyService, PartyDetailsService } from '../partyDetails.service';
import { ZoneEntryService } from '../../../../masters/components/zoneEntry/zoneEntry.service';
import { CommonService } from '../../../../masters/components/common/common.service';
import { CurrencyService } from '../../../../masters/components/currency/currency.service';
import { BranchService } from '../../../../masters/components/bankBranches/branch.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModalComponent } from '../../../../../shared/common-modal/common-modal.component';

const log = new Logger('partyDetails');
class PartyBankBranch {
  bankBrId: number;
  bankBrName: string;
  bankerNote: string;
  bankAddress: string;
  delStatus: boolean = false;
  contactBankBranchId: any;
}

@Component({
  selector: 'create-partyDetails',
  templateUrl: './createPartyDetails.html',
  styleUrls: ['./createPartyDetails.scss']
})
export class CreatePartyDetails implements OnInit {
  partyParam: string;
  pageTitle = 'Create Party Details';

  error: string = null;
  isLoading = false;
  partyForm: FormGroup;
  addressMasterDTO: FormGroup;
  bankDetails: FormGroup;
  bankDetail: FormArray;
  settings: any;
  source: LocalDataSource = new LocalDataSource();
  partyBankBranchList: PartyBankBranch[] = [];
  addedBranchIds: number[] = [];
  countryList: any[] = [];
  stateList: any[] = [];
  cityList: any[] = [];
  companyList: any[] = [];
  bussNatureList: any[] = [];
  currList: any[] = [];
  partyTypeList: any[] = [];
  salutationList: any[] = [];
  creditTermsList: any[] = [];
  branchList: any[] = [];
  bankBrName: string;
  isView: any;

  public partyTypeId: AbstractControl;
  public salutation: AbstractControl;
  public partyCode: AbstractControl;
  public partyName: AbstractControl;
  public commonMasterByCompTypeId: AbstractControl;
  public currencyMasterDTO: AbstractControl;
  public commonMasterByBussNatureId: AbstractControl;
  public fidNo: AbstractControl;
  public partyStatus: AbstractControl;
  public creditLimit: AbstractControl;
  public commonMasterByTermsId: AbstractControl;
  public partyNo: AbstractControl;
  public remarks: AbstractControl;
  public selectBankBranch: AbstractControl;
  public bankAddress: AbstractControl;
  public bankersNote: AbstractControl;
  public gstNo: AbstractControl;
  public cinNo: AbstractControl;
  public panNo: AbstractControl;

  public add11: AbstractControl;
  public add12: AbstractControl;
  public phoneO: AbstractControl;
  public pinCode: AbstractControl;
  public country: AbstractControl;
  public state: AbstractControl;
  public city: AbstractControl;
  public phoneR: AbstractControl;
  public mobile: AbstractControl;
  public email: AbstractControl;
  showSbtBtn: any;


  getBankBranchById(bankBranchId: any): any {
    let bankBr = bankBranchId;
    if (this.branchList) {
      this.branchList.forEach(bankBranch => {
        if (bankBranch.bankBrId == bankBranchId) {
          bankBr = bankBranch;
        }
      });
    }
    return bankBr;
  }

  constructor(private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder,
    private commonService: CommonService,
    private currencyService: CurrencyService,
    private zoneService: ZoneEntryService,
    private branchService: BranchService,
    private modalService: NgbModal,
    private service: PartyDetailsService) {
    this.bankDetail = fb.array([]);
    this.createForm();
    this.settings = this.prepareTableSettings();

    this.zoneService.getAllCountries().subscribe((countryList) => {
      this.countryList = countryList;
    });

    this.commonService.getAllCommonMasterByType('CT').subscribe((companyList) => {
      this.companyList = companyList;
    });

    this.commonService.getAllCommonMasterByType('BN').subscribe((bussNatureList) => {
      this.bussNatureList = bussNatureList;
    });

    this.currencyService.getAllCurrencies().subscribe((currList) => {
      this.currList = currList;
    });

    this.service.getAllPartyTypes().subscribe((partyTypeList) => {
      this.partyTypeList = partyTypeList;
    });

    this.commonService.getAllCommonMasterByType('SL').subscribe((salutationList) => {
      this.salutationList = salutationList;
    });

    this.commonService.getAllCommonMasterByType('TS').subscribe((creditTermsList) => {
      this.creditTermsList = creditTermsList;
    });

    this.branchService.getData().subscribe((branchList) => {
      this.branchList = branchList;
    });
  }

  ngOnInit() {
    debugger
    this.route.params.subscribe((params: Params) => {
      this.partyParam = params['partyId'];
      this.isView = params['isView'];

      if (this.partyParam) {
        this.pageTitle = 'Edit Party Details';

        this.service.getPartyById(this.partyParam).subscribe(res => {

          if (this.partyParam) {
            this.partyBankBranchList = res.partyBankBranchList;
            this.partyBankBranchList.forEach(bankBranch => {
              this.addedBranchIds.push(bankBranch.bankBrId);
            });
            let list: any[] = [];
            this.partyBankBranchList.forEach(data => {
              if (data.delStatus == false) {
                list.push(data);
              }
            })
            this.source.load(list);
            // this.source.load(this.partyBankBranchList);
            this.onCountryChange(res.addressMasterDTO.country);
            this.onStateChange(res.addressMasterDTO.state);
          }
          if (this.isView == 'true') {
            this.pageTitle = 'View Party Details';
            this.partyForm.markAsUntouched();
            this.partyForm.patchValue(res);
            this.partyForm.disable();
            this.showSbtBtn = false;
          } else {
            this.markAllTouched(this.partyForm);
            this.partyForm.patchValue(res);
            this.showSbtBtn = true;
          }
        })
      }
      else {
        this.showSbtBtn = true;
      }
    });
    this.selectBankBranch.valueChanges.subscribe(bankBranchId => {
      if (bankBranchId) {
        let bankBranch = this.getBankBranchById(bankBranchId);
        this.bankBrName = bankBranch.bankBrName;
        //while select branch reset, it is null.
        if (!bankBranch) {
          return;
        }
        const address = bankBranch.address;
        let bkAddress = '';
        if (address) {

          if (address.city) {
            this.zoneService.getGeoById(address.city).subscribe(city => {
              if (address.add11) {
                bkAddress = address.add11
              }
              if (address.add12) {
                bkAddress += ', ' + address.add12;
              }
              bkAddress += ', ' + city.name;
              this.bankAddress.setValue(bkAddress);
            });

          } else {
            if (address.add11) {
              bkAddress = address.add11
            }
            if (address.add12) {
              bkAddress += ', ' + address.add12;
            }
            this.bankAddress.setValue(bkAddress);
          }
        }
      }
    })
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
    const formValue: any = this.partyForm.value;
    // formValue.bankBranchList = this.partyBankBranchList;
    if (this.partyParam) {
      this.service.updateParty(formValue)
        .subscribe(party => {
          this.location.back();
          this.finally();
        }, error => {
          log.debug(`Creation error: ${error}`);
          this.error = error;
          this.finally();
        });
    } else {
      this.service.createParty(formValue)
        .subscribe(party => {
          console.log(party);
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
    if (this.partyForm.valid) {
      // if(this.partyStatus.value ==  'L' ) {//&& (this.cinNo.value.length == 0 || this.panNo.value.length == 0 || this.gstNo.value.length == 0)
      //   const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      //   activeModal.componentInstance.showHide = false;
      //   activeModal.componentInstance.modalHeader = 'Alert';
      //   activeModal.componentInstance.modalContent = 'GST, CIN & PAN No. are required!!';
      // } else {
      this.validSubmit();
      //}
    }
  }

  finally() {
    this.isLoading = false;
    this.partyForm.markAsPristine();
  }

  onCountryChange(value: any) {
    this.partyForm.get('addressMasterDTO.state').setValue('');
    this.zoneService.getAllStatesOfCountry(value).subscribe((stateList) => {
      this.stateList = stateList;
    });
  }

  onStateChange(stateId: number) {
    this.partyForm.get('addressMasterDTO.city').setValue('');
    this.zoneService.getAllCitiesOfState(stateId).subscribe((cityList) => {
      this.cityList = cityList;
    });
  }

  getCityName(cityList: any[], cityId: any): string {
    if (cityList) {
      cityList.forEach(city => {
        if (city.id == cityId) {
          return city.name;
        }
      });
    }
    return cityId;
  }

  handleBack(cancelling: boolean = false) {
    this.location.back();
  }

  onBankBrAdd() {
    const partyBranch = new PartyBankBranch();
    partyBranch.bankBrId = this.selectBankBranch.value;
    partyBranch.bankerNote = this.bankersNote.value;
    partyBranch.bankAddress = this.bankAddress.value;
    partyBranch.delStatus = false;
    partyBranch.contactBankBranchId = '';
    partyBranch.bankBrName = this.bankBrName;
    this.addedBranchIds.push(parseInt(this.selectBankBranch.value.toString()));
    this.partyBankBranchList.push(partyBranch);
    let list: any[] = [];
    this.partyBankBranchList.forEach(data => {
      if (data.delStatus == false) {
        list.push(data);
      }
    })
    this.source.load(list);
    // this.source.load(this.partyBankBranchList);
    this.selectBankBranch.reset();
    this.bankersNote.setValue('');
    this.bankAddress.setValue('');
    this.bankBrName = '';
  }

  onDeleteConfirm(event: any): void {
    const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
    activeModal.componentInstance.showHide = true;
    activeModal.componentInstance.modalHeader = 'Alert';
    activeModal.componentInstance.modalContent = 'Are you sure you want to delete this Bank Branch?';
    activeModal.result.then((res) => {
      if (res == 'Y') {

        const i = this.addedBranchIds.indexOf(parseInt(event.data.bankBrId.toString()));
        this.addedBranchIds.splice(i, 1);
        let list: any[] = [];
        this.partyBankBranchList.forEach(data => {
          if (data.bankBrId == event.data.bankBrId) {
            data.delStatus = true;
            return true;
          }
          if (data.delStatus == false) {
            list.push(data);
          }
        })
        this.source.load(list);
      }
    });
  }

  prepareTableSettings() {
    return {
      actions: {
        position: 'right',
        add: false,
        edit: false
      },
      edit: {
        editButtonContent: '<i class="ion-edit"></i>',
        saveButtonContent: '<i class="ion-checkmark"></i>',
        cancelButtonContent: '<i class="ion-close"></i>',
        confirmSave: true,
      },
      delete: {
        deleteButtonContent: '<i class="ion-trash-a"></i>',
        confirmDelete: true
      },
      pager: {
        display: false
      },
      columns: {
        bankBrName: {
          title: 'Bank Branch',
          type: 'text',
        },
        bankerNote: {
          title: 'Bankers Note',
          type: 'text',
        },
        bankAddress: {
          title: 'Bank Address',
          type: 'text',
        },
      }
    };
  }



  private createForm() {
    this.partyForm = this.fb.group({
      'partyId': [''],
      'partyCode': ['', Validators.compose([Validators.minLength(2), Validators.maxLength(20)])],
      'partyName': ['', Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(100)])],
      'commonMasterByBussNatureId': ['', Validators.required],
      'fidNo': ['', Validators.compose([Validators.minLength(1), Validators.maxLength(50)])],
      'partyStatus': ['', Validators.required],
      'creditLimit': ['', Validators.compose([Validators.required, Validators.minLength(1)])],
      'commonMasterByCompTypeId': ['', Validators.required],
      'currencyMasterDTO': ['', Validators.required],
      'partyTypeId': ['', Validators.required],
      'salutation': ['', Validators.required],
      'commonMasterByTermsId': ['', Validators.required],
      'partyNo': ['', Validators.compose([Validators.minLength(1), Validators.maxLength(25)])],
      'remarks': ['', Validators.compose([Validators.maxLength(255)])],
      'gstNo': ['', Validators.compose([Validators.pattern('[a-zA-Z0-9]*'), Validators.minLength(15), Validators.maxLength(15)])],
      'cinNo': ['', Validators.compose([Validators.pattern('[a-zA-Z0-9]*'), Validators.minLength(21), Validators.maxLength(21)])],
      'panNo': ['', Validators.compose([Validators.pattern('[a-zA-Z0-9]*'), Validators.minLength(10), Validators.maxLength(10)])],
      'bankDetails': this.fb.group({
        'selectBankBranch': [''],
        'bankAddress': [''],
        'bankersNote': [''],
      }),
      'partyBankBranchList': [this.partyBankBranchList],

      'addressMasterDTO': this.fb.group({
        'addressId': [''],
        'add11': ['', Validators.compose([Validators.required, Validators.maxLength(50)])],
        'add12': ['', Validators.compose([Validators.maxLength(50)])],
        'country': ['', Validators.required],
        'state': ['', Validators.required],
        'city': ['', Validators.required],
        'pinCode': ['', Validators.compose([Validators.required, Validators.pattern('[0-9]*'),
        Validators.minLength(6), Validators.maxLength(6)])],
        'phoneR': ['', Validators.compose([Validators.pattern('[0-9]*'), Validators.maxLength(15)])],
        'phoneO': ['', Validators.compose([Validators.pattern('[0-9]*'), Validators.maxLength(15)])],
        'mobile': ['', Validators.compose([Validators.required, Validators.pattern('[0-9]*'),
        Validators.minLength(10), Validators.maxLength(10)])],
        'email': [''],
      }),

    });

    this.partyTypeId = this.partyForm.controls['partyTypeId'];
    this.salutation = this.partyForm.controls['salutation'];
    this.partyCode = this.partyForm.controls['partyCode'];
    this.partyName = this.partyForm.controls['partyName'];
    this.commonMasterByCompTypeId = this.partyForm.controls['commonMasterByCompTypeId'];
    this.currencyMasterDTO = this.partyForm.controls['currencyMasterDTO'];
    this.commonMasterByBussNatureId = this.partyForm.controls['commonMasterByBussNatureId'];
    this.fidNo = this.partyForm.controls['fidNo'];
    this.partyStatus = this.partyForm.controls['partyStatus'];
    this.creditLimit = this.partyForm.controls['creditLimit'];
    this.commonMasterByTermsId = this.partyForm.controls['commonMasterByTermsId'];
    this.partyNo = this.partyForm.controls['partyNo'];
    this.remarks = this.partyForm.controls['remarks'];
    this.gstNo = this.partyForm.controls['gstNo'];
    this.cinNo = this.partyForm.controls['cinNo'];
    this.panNo = this.partyForm.controls['panNo'];

    // address controls.
    this.add11 = this.partyForm.get('addressMasterDTO.add11');
    this.add12 = this.partyForm.get('addressMasterDTO.add12');
    this.country = this.partyForm.get('addressMasterDTO.country');
    this.city = this.partyForm.get('addressMasterDTO.city');
    this.state = this.partyForm.get('addressMasterDTO.state');
    this.pinCode = this.partyForm.get('addressMasterDTO.pinCode');
    this.phoneR = this.partyForm.get('addressMasterDTO.phoneR');
    this.phoneO = this.partyForm.get('addressMasterDTO.phoneO');
    this.mobile = this.partyForm.get('addressMasterDTO.mobile');
    this.email = this.partyForm.get('addressMasterDTO.email');

    // bank branch controls
    this.selectBankBranch = this.partyForm.get('bankDetails.selectBankBranch');
    this.bankAddress = this.partyForm.get('bankDetails.bankAddress');
    this.bankersNote = this.partyForm.get('bankDetails.bankersNote');


  }


}
