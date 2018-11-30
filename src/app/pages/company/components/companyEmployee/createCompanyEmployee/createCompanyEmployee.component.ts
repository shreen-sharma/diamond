import { Component, OnInit } from '@angular/core';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { Observable } from 'rxjs/Observable';
import { FormGroup, AbstractControl, FormBuilder, Validators  } from '@angular/forms';
import { AuthenticationService } from '../../../../../core/authentication/authentication.service';
import { Logger } from '../../../../../core/logger.service';
import { Location } from '@angular/common';
import { EmployeePartyService, CompanyEmployeeService } from '../companyEmployee.service';
import {ZoneEntryService} from '../../../../masters/components/zoneEntry/zoneEntry.service';
import {CommonService} from '../../../../masters/components/common/common.service';
import { HierarchyRelationService } from '.../../app/pages/company/components/hierarchyRelation/hierarchyRelation.service'
import { CommonModalComponent } from '../../../../../shared/common-modal/common-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

const log = new Logger('companyEmployee');

@Component({
  selector: 'create-companyEmployee',
  templateUrl: './createCompanyEmployee.html',
  styleUrls: ['./createCompanyEmployee.scss']
})
export class CreateCompanyEmployee implements OnInit {

  companyParam: string;
  pageTitle = 'Create Company Employee';

  error: string = null;
  isLoading = false;
  companyEmployeeForm: FormGroup;
  addressMaster: FormGroup;

  countryList: any[] = [];
  empList: any[] = [];
  stateList: any[] = [];
  cityList: any[] = [];
  salutationList: any[] = [];
  designationList: any[] = [];
  departmentList: any[] = [];
  subDepartmentList: any[] = [];
  divisionList: any[] = [];
  locationList: any[] = [];
  hierList: any [] = [];
  valid: boolean = false;

  public empCode: AbstractControl;
  public empType: AbstractControl;
  public commonMasterBySalutationId: AbstractControl;
  public empName: AbstractControl;
  public gender: AbstractControl;
  public maritalStatus: AbstractControl;
  public dob: AbstractControl;
  public anniversaryDate: AbstractControl;
  public qualification: AbstractControl;
  public nationality: AbstractControl;
  public department: AbstractControl;
  public subDepartment: AbstractControl;
  public division: AbstractControl;
  public getlocation: AbstractControl;
  public commonMasterByDesignationId: AbstractControl;
  public doj: AbstractControl;
  public salary: AbstractControl;
  public itaxNo: AbstractControl;
  public panNo: AbstractControl;
  public panIssueDate: AbstractControl;
  public panIssuer: AbstractControl;
  public passNo: AbstractControl;
  public passIssueDate: AbstractControl;
  public passExpireDate: AbstractControl;
  public profitRatio: AbstractControl;
  public lossRatio: AbstractControl;
  public authSign: AbstractControl;
  public remarks: AbstractControl;
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


  constructor(private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder,
    private commonService: CommonService,
    private zoneService: ZoneEntryService,
    private hierarchyRelationService: HierarchyRelationService,
    private service: CompanyEmployeeService,
    private modalService: NgbModal,
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

    this.hierarchyRelationService.getHierarchyRelationByParentId(authService.credentials.company).subscribe( (divList) => {
      this.divisionList = divList;
    });

    this.hierarchyRelationService.getData().subscribe( hie => {
      this.hierList = hie;
    });


    this.service.getData().subscribe( (empList) => {
      this.empList = empList;
      });
  }

   ngOnInit() {
     this.route.params.subscribe((params: Params) => {
      this.companyParam = params['empId'];
      if (this.companyParam) {
        let a;
        let b;
        this.pageTitle = 'Edit Company Employee Creation';

        this.service.getEmployeeById(this.companyParam).subscribe(res => {
          if (this.companyParam) {

            this.hierList.forEach( resp => {
              if(resp.hierarchyMaster.hierId == res.refId.parent.hierId) {
                 a = resp.parent;
              }
            });
            this.hierList.forEach( respo => {
              if(respo.hierarchyMaster.hierId == a) {
                 b = respo.parent;
              }
            });
            
            this.companyEmployeeForm.patchValue(res);
            this.companyEmployeeForm.controls['division'].patchValue(b);
            this.onDivChange(b);
            this.companyEmployeeForm.controls['getlocation'].patchValue(a);
            this.onLocChange(a);
            this.companyEmployeeForm.controls['department'].patchValue(res.refId.parent.hierId);
            this.onDeptChange(res.refId.parent.hierId);
            this.companyEmployeeForm.controls['subDepartment'].patchValue(res.refId.hierarchyMaster.hierId);

            this.companyEmployeeForm.controls['commonMasterBySalutationId'].patchValue(res.commonMasterBySalutationId.id);
            this.companyEmployeeForm.controls['commonMasterByDesignationId'].patchValue(res.commonMasterByDesignationId.id);            
            this.companyEmployeeForm.get('addressMaster.country').patchValue(res.addressMaster.country.geoId);
            this.onCountryChange(res.addressMaster.country.geoId);
            this.companyEmployeeForm.get('addressMaster.state').patchValue(res.addressMaster.state.geoId);            
            this.onStateChange(res.addressMaster.state.geoId);
            this.companyEmployeeForm.get('addressMaster.city').patchValue(res.addressMaster.city.geoId);   

          this.markAllTouched(this.companyEmployeeForm);
          
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

  today (): string {
    const today = new Date();
    const dd = today.getDate();
    const mm = today.getMonth() + 1; //January is 0!

    const yyyy = today.getFullYear();
    return yyyy + '-' + (mm < 10 ? '0' + mm : mm) + '-' + (dd < 10 ? '0' + dd : dd);
  }

   submit() {
    if (this.companyEmployeeForm.valid) {
      this.valid = false;
      this.dateValid();

      if(this.valid) {
        this.isLoading = true;
        const formValue: any = this.companyEmployeeForm.value;
        if (this.companyParam) {
          this.service.updateEmployee(this.companyEmployeeForm.value)
            .subscribe(employee => {
              this.location.back();
              this.finally();
            }, error => {
              log.debug(`Creation error: ${error}`);
              this.error = error;
              this.finally();
            });
        } else {
          const itemIndex = this.empList.findIndex(item => {
            if (this.empCode.value.trim().toUpperCase() == item.empCode.trim().toUpperCase()) {
              return true;
            }
          });
          const itemInd = this.empList.findIndex(item => {
            if (this.empName.value.trim().toUpperCase() == item.empName.trim().toUpperCase()) {
              return true;
            }
          });
  
  
          if(itemIndex > -1) {
            const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
            activeModal.componentInstance.showHide = false;
            activeModal.componentInstance.modalHeader = 'Alert';
            activeModal.componentInstance.modalContent = 'Person Code already Exist!';
          } else if(itemInd > -1) {
            const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
            activeModal.componentInstance.showHide = false;
            activeModal.componentInstance.modalHeader = 'Alert';
            activeModal.componentInstance.modalContent = 'Person Name already Exist!';
          } else {
            this.service.createEmployee(this.companyEmployeeForm.value)
              .subscribe(employee => {
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
    }
  }

  dateValid() { // set valid as true after passing all vaidation
this.valid = true;  // delete this & add validation
  }

   finally() {
    this.isLoading = false;
    this.companyEmployeeForm.markAsPristine();
  }

  onDivChange(value: any) {
    this.locationList = [];
    this.departmentList = [];
    this.subDepartmentList = [];
    this.getlocation.reset();
    this.department.reset();
    this.subDepartment.reset();
    this.hierarchyRelationService.getHierarchyRelationByParentId(value).subscribe( (locList) => {
      this.locationList = locList;
      if (this.locationList.length == 0) {
        const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
        activeModal.componentInstance.showHide = false;
        activeModal.componentInstance.modalHeader = 'Alert';
        activeModal.componentInstance.modalContent = 'No Location Entries in selected Division!';
      }
    });
  }

  onLocChange(value: any) {
    this.departmentList = [];
    this.subDepartmentList = [];
    this.department.reset();
    this.subDepartment.reset();
    this.hierarchyRelationService.getHierarchyRelationByParentId(value).subscribe( (deptList) => {
      this.departmentList = deptList;
      if (this.departmentList.length == 0) {
        const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
        activeModal.componentInstance.showHide = false;
        activeModal.componentInstance.modalHeader = 'Alert';
        activeModal.componentInstance.modalContent = 'No Departments in selected Location!';
      }
    });
  }

  onDeptChange(value: any) {
    this.subDepartmentList = [];
    this.subDepartment.reset();
    this.hierarchyRelationService.getHierarchyRelationByParentId(value).subscribe( (subDeptList) => {
      this.subDepartmentList = subDeptList;
      if (this.subDepartmentList.length == 0) {
        const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
        activeModal.componentInstance.showHide = false;
        activeModal.componentInstance.modalHeader = 'Alert';
        activeModal.componentInstance.modalContent = 'No Sub-Departments in selected Department!';
      }
    });
  }

  onCountryChange(value: any) {
  this.companyEmployeeForm.get('addressMaster.state').setValue('');
   this.zoneService.getAllStatesOfCountry(value).subscribe((stateList) => {
     this.stateList = stateList;
   });
  }

  onStateChange(stateId: number ) {
  this.companyEmployeeForm.get('addressMaster.city').setValue('');
   this.zoneService.getAllCitiesOfState(stateId).subscribe((cityList) => {
     this.cityList = cityList;
   });
  }

  handleBack(cancelling: boolean= false) {
    // TODO: if cancelling then ask to confirn

    if (this.companyParam) {
      this.location.back();
    } else {
      this.location.back();
    }
  }

private createForm() {
    this.companyEmployeeForm = this.fb.group({
    'empId': [''],
   'empType': ['E'],

   'empCode': ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(20)])],
   'commonMasterBySalutationId': ['', Validators.required],
   'empName': ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
   'gender': [''],
   'dob': ['', Validators.required],
   'maritalStatus': ['', Validators.required],
   'anniversaryDate':  [''],
   'qualification': ['', Validators.compose([Validators.maxLength(50)])],
   'nationality': ['', Validators.compose([Validators.required, Validators.maxLength(50)])],

   'department': ['', Validators.required],
   'subDepartment': ['', Validators.required],
   'division': ['', Validators.required],
   'getlocation': ['', Validators.required],
   'commonMasterByDesignationId': ['', Validators.required],
   'doj': [''],
   'salary': ['', Validators.compose([Validators.maxLength(10), Validators.pattern('[0-9]*')])],

   'itaxNo': ['', Validators.compose([Validators.minLength(9), Validators.maxLength(9)])],
   'panNo': ['', Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(10)])],
   'panIssueDate': ['', Validators.required],
   'panIssuer': ['', Validators.compose([Validators.minLength(2), Validators.maxLength(100)])],
   'passNo': ['', Validators.compose([Validators.minLength(8), Validators.maxLength(9)])],
   'passIssueDate': [''],
   'passExpireDate': [''],
   'profitRatio': ['', Validators.compose([Validators.maxLength(5), Validators.pattern('[0-9]*')])],
   'lossRatio':  ['', Validators.compose([Validators.maxLength(5), Validators.pattern('[0-9]*')])],
   'authSign': ['', Validators.required],
   'remarks': ['', Validators.compose([Validators.maxLength(255)])],

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

    this.empCode = this.companyEmployeeForm.controls['empCode'];
    this.empName = this.companyEmployeeForm.controls['empName'];
    this.gender = this.companyEmployeeForm.controls['gender'];
    this.dob = this.companyEmployeeForm.controls['dob'];
    this.maritalStatus = this.companyEmployeeForm.controls['maritalStatus'];
    this.anniversaryDate =  this. companyEmployeeForm.controls['anniversaryDate'];
    this.qualification = this.companyEmployeeForm.controls['qualification'];
    this.nationality = this.companyEmployeeForm.controls['nationality'];
    this.commonMasterBySalutationId = this.companyEmployeeForm.controls['commonMasterBySalutationId'];

    this.department = this.companyEmployeeForm.controls['department'];
    this.subDepartment = this.companyEmployeeForm.controls['subDepartment'];
    this.commonMasterByDesignationId = this.companyEmployeeForm.controls['commonMasterByDesignationId'];
    this.division = this.companyEmployeeForm.controls['division'];
    this.getlocation = this.companyEmployeeForm.controls['getlocation'];
    this.doj = this.companyEmployeeForm.controls['doj'];
    this.salary = this.companyEmployeeForm.controls['salary'];

    this.itaxNo = this.companyEmployeeForm.controls['itaxNo'];
    this.panNo = this.companyEmployeeForm.controls['panNo'];
    this.panIssueDate = this.companyEmployeeForm.controls['panIssueDate'];
    this.panIssuer = this.companyEmployeeForm.controls['panIssuer'];
    this.passNo = this.companyEmployeeForm.controls['passNo'];
    this.passIssueDate = this.companyEmployeeForm.controls['passIssueDate'];
    this.passExpireDate = this.companyEmployeeForm.controls['passExpireDate'];
    this.profitRatio = this.companyEmployeeForm.controls['profitRatio'];
    this.lossRatio = this.companyEmployeeForm.controls['lossRatio'];

    this.authSign = this.companyEmployeeForm.controls['authSign'];
    this.remarks = this.companyEmployeeForm.controls['remarks'];

    this.gender.setValue('M');
    this.maritalStatus.setValue('U');
    this.add11 = this.companyEmployeeForm.get('addressMaster.add11');
    this.add12 = this.companyEmployeeForm.get('addressMaster.add12');
    this.country = this.companyEmployeeForm.get('addressMaster.country');
    this.city = this.companyEmployeeForm.get('addressMaster.city');
    this.state = this.companyEmployeeForm.get('addressMaster.state');
    this.pinCode = this.companyEmployeeForm.get('addressMaster.pinCode');
    this.phoneR = this.companyEmployeeForm.get('addressMaster.phoneR');
    this.phoneO = this.companyEmployeeForm.get('addressMaster.phoneO');
    this.mobile = this.companyEmployeeForm.get('addressMaster.mobile');
    this.email = this.companyEmployeeForm.get('addressMaster.email');

    this.gender.markAsTouched();
   this.maritalStatus.valueChanges.subscribe( data => {
      if (this.maritalStatus.value === 'M') {
      this.anniversaryDate.enable();
      } else {
        this.anniversaryDate.disable();
      }
      });
  }
}
