import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { Location } from '@angular/common';
import { AuthenticationService } from '../../../../../core/authentication/authentication.service';
import { Logger } from '../../../../../core/logger.service';
import { ContactPerson, ContactPersonService } from '../contactPerson.service';
import {ZoneEntryService} from '../../zoneEntry/zoneEntry.service';
import {CommonService} from '../../common/common.service';
import { PartyDetailsService } from 'app/pages/company/components/partyDetails/partyDetails.service';
import { TreeviewItem } from 'ngx-treeview/src';
import { HierarchyCreationService } from 'app/pages/company/components/hierarchyCreation';

const log = new Logger('ContactPerson');

@Component({
  selector: 'create-contactPerson',
  templateUrl: './createContactPerson.html',
  styleUrls: ['./createContactPerson.scss']
})
export class CreateContactPerson implements OnInit  {

  contactPersonIdParam: string;
  pageTitle = 'Create Contact Person';

  error: string = null;
  isLoading = false;
  contactPersonForm: FormGroup;
  addressMaster: FormGroup;

  countryList: any[] = [];
  stateList: any[] = [];
  cityList: any[] = [];
  salutationList: any[] = [];
  designationList: any[] = [];
  bankList: Observable<any>;
  partyTypeList: Observable<any>;
  companies: Observable<any>;
  selectedValue: any;
  //refTypeId: any;
  refTypeList: any[] =[];
  availableitemList: any[] = [];

  public refType: AbstractControl;
  public refId: AbstractControl;
  public personCode: AbstractControl;
  public commonMasterBySalutationId: AbstractControl;
  public personName: AbstractControl;
  public gender: AbstractControl;
  public marritalStatus: AbstractControl;
  public dob: AbstractControl;
  public anniversaryDate: AbstractControl;
  public nationality: AbstractControl;
  public commonMasterByDesignationId: AbstractControl;
  public qualification: AbstractControl;
  public remark: AbstractControl;
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
 // public name: AbstractControl;
 isView: any;
 upDateAccess: any;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder,
    private commonService: CommonService,
    private zoneService: ZoneEntryService,
    private partyDetailsService: PartyDetailsService,
    private service: ContactPersonService,
    private hierarchyService: HierarchyCreationService,
    private authService: AuthenticationService) {
      this.createForm();

      this.zoneService.getAllCountries().subscribe( (countryList) => {
        this.countryList = countryList;
            });

        this.commonService.getAllCommonMasterByType('SL').subscribe( (salutationList) => {
        this.salutationList = salutationList;
            });

        this.commonService.getAllCommonMasterByType('DS').subscribe( (designationList) => {
          this.designationList = designationList;
            });
          
        this.commonService.getAllCommonMasterByType('BK').subscribe( (bankList) => {
            this.bankList = bankList;
            debugger;
            });

        this.partyDetailsService.getAllPartyTypes().subscribe( (partyTypeList) => {
             this.partyTypeList = partyTypeList;
             debugger;
            });
        this.hierarchyService.getAllHierachyByType('CO').subscribe( (companies) => {
          this.companies = companies;
            });    
  }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
     this.contactPersonIdParam = params['personId'];
     this.isView = params['isView'];
     if (this.contactPersonIdParam) {
       this.pageTitle = 'Edit Contact Person';

       this.service.getPersonById(this.contactPersonIdParam).subscribe(res => {
         if(this.isView == 'true'){
          this.onCountryChange(res.addressMaster.country);
          this.onStateChange(res.addressMaster.state);
         this.contactPersonForm.patchValue(res);
         this.contactPersonForm.disable();
         this.contactPersonForm.markAsUntouched();
         this.upDateAccess = true;
         } else {
          this.onCountryChange(res.addressMaster.country);
          this.onStateChange(res.addressMaster.state);
        this.markAllTouched(this.contactPersonForm);
         this.contactPersonForm.patchValue(res);
         }
       })
     }
   });
  }
  markAllTouched(control: AbstractControl) {
    debugger;
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
    if (this.contactPersonForm.valid) {
    this.isLoading = true;
    const formValue: any = this.contactPersonForm.value;

    if (this.contactPersonIdParam) {
      this.service.updateContactPerson(this.contactPersonForm.value)
        .subscribe(person => {
           this.location.back();
          this.finally();
        }, error => {
          log.debug(`Creation error: ${error}`);
          this.error = error;
          this.finally();
        });
    } else {
      this.service.createContactPerson(this.contactPersonForm.value)
        .subscribe(person => {
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

   finally() {
    this.isLoading = false;
    this.contactPersonForm.markAsPristine();
  }

  onCountryChange(value: any) {
    this.contactPersonForm.get('addressMaster.state').setValue('');
   this.zoneService.getAllStatesOfCountry(value).subscribe((stateList) => {
     this.stateList = stateList;
   });
  }

  onStateChange(stateId: number ) {
    this.contactPersonForm.get('addressMaster.city').setValue('');
   this.zoneService.getAllCitiesOfState(stateId).subscribe((cityList) => {
     this.cityList = cityList;
   });
  }
  onrefTypeChange(value: any) {
    this.selectedValue = value;
    debugger;
    this.refTypeList = [];
    if (this.selectedValue === 'BA' ) {
      debugger;
      this.bankList.forEach(item => {
         this.refTypeList.push(new TreeviewItem({ text: item.name, value: item.id + '', checked: false }));
      });
      this.availableitemList = this.refTypeList;
    }
    if (this.selectedValue === 'PA') {
      debugger;
      this.partyTypeList.forEach(item => {
        this.refTypeList.push(new TreeviewItem({ text: item.name, value: item.id + '', checked: false }));
     });
     this.availableitemList = this.refTypeList;
    } 
    if (this.selectedValue === 'CO') {
      debugger;
      this.companies.forEach(item => {
        this.refTypeList.push(new TreeviewItem({ text: item.hierName, value: item.hierId + '', checked: false }));
     });
     this.availableitemList = this.refTypeList;
 
    }
   }
  handleBack(cancelling: boolean= false) {
    // TODO: if cancelling then ask to confirn

    if (this.contactPersonIdParam) {
      this.location.back();
    } else {
      this.location.back();
    }
  }

  private createForm() {
    this.contactPersonForm = this.fb.group({
      'personId': [''],
      'refType': [''],
      'personCode': ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(20)])],
      'personName': ['', Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(100)])],
      'commonMasterBySalutationId': ['', Validators.required],
      'gender': ['', Validators.required],
      //'name': [''],
      'refId': ['', Validators.required],
      'marritalStatus': ['', Validators.required],
      'dob': ['', Validators.required],
      'anniversaryDate': [''],
      'nationality': ['', Validators.compose([Validators.required, Validators.maxLength(50)])],
      'commonMasterByDesignationId': ['', Validators.required],
      'qualification': ['', Validators.compose([Validators.maxLength(50)])],
      'remark': ['', Validators.compose([Validators.maxLength(255)])],

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


    this.refType= this.contactPersonForm.controls['refType']; 
    this.personName = this.contactPersonForm.controls['personName'];
    this.refId = this.contactPersonForm.controls['refId'];
    this.commonMasterBySalutationId = this.contactPersonForm.controls['commonMasterBySalutationId'];
    this.personCode = this.contactPersonForm.controls['personCode'];
    this.gender = this.contactPersonForm.controls['gender'];
    this.marritalStatus = this.contactPersonForm.controls['marritalStatus'];
    this.dob = this.contactPersonForm.controls['dob'];
    this.anniversaryDate = this.contactPersonForm.controls['anniversaryDate'];
    this.nationality = this.contactPersonForm.controls['nationality'];
    this.commonMasterByDesignationId = this.contactPersonForm.controls['commonMasterByDesignationId'];
    this.qualification = this.contactPersonForm.controls['qualification'];
    this.remark = this.contactPersonForm.controls['remark'];
    //this.name = this.contactPersonForm.controls['refType'];
    this.gender.setValue('M');
    this.marritalStatus.setValue('U');
    this.add11 = this.contactPersonForm.get('addressMaster.add11');
    this.add12 = this.contactPersonForm.get('addressMaster.add12');
    this.country = this.contactPersonForm.get('addressMaster.country');
    this.city = this.contactPersonForm.get('addressMaster.city');
    this.state = this.contactPersonForm.get('addressMaster.state');
    this.pinCode = this.contactPersonForm.get('addressMaster.pinCode');
    this.phoneR = this.contactPersonForm.get('addressMaster.phoneR');
    this.phoneO = this.contactPersonForm.get('addressMaster.phoneO');
    this.mobile = this.contactPersonForm.get('addressMaster.mobile');
    this.email = this.contactPersonForm.get('addressMaster.email');
    this.marritalStatus.valueChanges.subscribe( data => {
      if (this.marritalStatus.value === 'M') {
      this.anniversaryDate.enable();
      } else {
        this.anniversaryDate.disable();
      }
    }); 
  }
}
