import { TreeviewItem } from 'ngx-treeview/src';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModalComponent } from '../../../../../shared/common-modal/common-modal.component';

import { AuthenticationService } from '../../../../../core/authentication/authentication.service';
import { Logger } from '../../../../../core/logger.service';
import { PartyAccountService } from '../partyAccount.service';
import { ProDetailService } from '.../../app/pages/masters/components/processDetails/proDetails.service';
import { PartyDetailsService } from '.../../app/pages/company/components/partyDetails/partyDetails.service';
import { ProTypeService } from '.../../app/pages/masters/components/processType/proType.service';

const log = new Logger('PartyAccount');

@Component({
  selector: 'create-partyAccount',
  templateUrl: './createPartyAccount.html',
  styleUrls: ['./createPartyAccount.scss']
})
export class CreatePartyAccount implements OnInit  {

  partyAccountIdParam: string;
  pageTitle = 'Create Party Account';

  errorMsg: string = null;
  isLoading = false;
  partyAccountForm: FormGroup;

  partyList: any [] = [];
  processList: any[] = [];
  processTypeList: any[] = [];
  partyLAList: any[] = [];
  availPocessList: any[] = [];
  availList: any[] = [];
  partyWiseProcess: TreeviewItem [] = [];
  treeConfig: any;
  partyAccList: any[] = [];

  public partyMasterId: AbstractControl;
  public partyAccCode: AbstractControl;
  public partyAccDesc: AbstractControl;
  public items: AbstractControl;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private service: PartyAccountService,
    private partyService: PartyDetailsService,
    private modalService: NgbModal,
    private proTypeService: ProTypeService,
    private proService: ProDetailService) {
      this.createForm();

    // this.partyService.getPartyByType('LA').subscribe( (partyList) => {       // Getting partyType = LA & AS
    //   debugger;
    // partyList.forEach(element => {
    //     if (element.partyStatus == 'L') {
    //     this.partyLAList.push(element);
    //     }
    //   });
    //   this.partyService.getPartyByType('AS').subscribe( (partyList) => {
    //   this.partyList = this.partyList.concat(this.partyLAList);
    //   partyList.forEach(elemen => {
    //       if (elemen.partyStatus == 'L') {
    //       this.partyList.push(elemen);
    //       }
    //     });
    //   });
    // });
     
    this.partyService.getPartyByType('CU').subscribe( (partyList) => {
      partyList.forEach(elemen => {
        if (elemen.partyStatus == 'L') {
        this.partyList.push(elemen);
        }
      });
    });
     
     this.proTypeService.getData().subscribe((types) => {
       this.processTypeList = types;
       this.proService.getData().subscribe( (processList) => {
        this.processList = processList;
      });
     });

     this.service.getAllPartyAccount().subscribe( (partyAccList) => {
        this.partyAccList = partyAccList;
      });
  }


  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.partyAccountIdParam = params['partyAccId'];
      if (this.partyAccountIdParam) {
        this.pageTitle = 'Edit Party Account Creation';
        this.service.getPartyAccountById(this.partyAccountIdParam).subscribe(res => {
          this.partyAccountForm.patchValue(res);
          this.markAllTouched(this.partyAccountForm);
            this.proTypeService.getData().subscribe((types) => {
              this.processTypeList = types;

              this.proService.getData().subscribe( (processList) => {
                this.processList = processList;
                this.onPartyChange(res.partyMasterId);
                  res.partyAccountDetailDTO.forEach(element => {
                    this.availList.forEach( d => {
                      if (d.value == element.processMasterId) {
                        d.checked = true;
                      }
                    })
                });
              });
            });
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

 onProcessListChange(selected: any[]) {
    let i = 0;
    debugger;
    selected.forEach(  a => {
     selected[i] = { 'processMasterId': a};
     i++;
    })
     this.items.setValue(selected);
  }

onPartyChange(proId: any) {
  this.availPocessList = [];
  if (this.processList.length > 0) {
    this.processList.forEach( pro => {
          const item = this.processTypeList.find( typ => {
            if (typ.processTypeId == pro.processType) {
              return true;
            }
          });
          if (item) {
            this.availPocessList.push({value: pro.processId, title: item.processName + ' -- ' +
            pro.name + '__' + pro.code});
          }
        });
        this.createAvailableListItem(this.availPocessList);
          if (this.availPocessList.length == 0) {
          const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
          activeModal.componentInstance.showHide = false;
          activeModal.componentInstance.modalHeader = 'Alert';
          activeModal.componentInstance.modalContent = 'No items belongs to selected Process!';
          }
        }
}

  createAvailableListItem(listArr: any[]) {
    this.availList = [];
      listArr.forEach( item => {
      this.availList.push(new TreeviewItem({ text: item.title, value: item.value + '', checked: false }));
      })
  }

  submit() {
    if (!this.partyAccountForm.valid) {
      this.errorMsg = 'Required fields are empty.';
      return;
    }

  if (this.partyAccountForm.valid) {
      if (this.items.value.length > 0) {
        this.isLoading = true;
        const formValue: any = this.partyAccountForm.value;
         let flag = 0;
         const itemIndex = this.partyAccList.findIndex(item => {
        if (this.partyAccountIdParam) {
          if (this.partyAccountIdParam != item.partyAccId && this.partyAccCode.value.trim().toUpperCase() == item.partyAccCode.trim().toUpperCase()) {
            flag = 1;
            return true;
          } else if (this.partyAccountIdParam != item.partyAccId && this.partyAccDesc.value.trim().toUpperCase() == item.partyAccDesc.trim().toUpperCase()) {
            flag = 2;
            return true;
          }
        } else {
          if (this.partyAccCode.value.trim().toUpperCase() == item.partyAccCode.trim().toUpperCase()) {
            flag = 1;
            return true;
          } else if (this.partyAccDesc.value.trim().toUpperCase() == item.partyAccDesc.trim().toUpperCase()) {
            flag = 2;
            return true;
          }
        }
      });

       if (itemIndex > -1 && flag == 1) {
        const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
        activeModal.componentInstance.showHide = false;
        activeModal.componentInstance.modalHeader = 'Alert';
        activeModal.componentInstance.modalContent = 'Party Account Code already Exist!';
      } else if (itemIndex > -1 && flag == 2) {
        const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
        activeModal.componentInstance.showHide = false;
        activeModal.componentInstance.modalHeader = 'Alert';
        activeModal.componentInstance.modalContent = 'Party Account Description already Exist!';
      } else {
      if (this.partyAccountIdParam) {
        debugger;
        this.service.updatePartyAccount(this.partyAccountForm.value)
        .subscribe( partyAccount => {
          // log.debug(`${credentials.selectedCompany} successfully logged in`);
          this.handleBack();
          this.finally();
        }, error => {
          log.debug(`Creation error: ${error}`);
          this.errorMsg = error;
          this.finally();
        });
      } else {
          this.service.createPartyAccount(this.partyAccountForm.value)
          .subscribe( partyAccount => {
            // log.debug(`${credentials.selectedCompany} successfully logged in`);
            this.handleBack();
            this.finally();
          }, error => {
            log.debug(`Creation error: ${error}`);
            this.errorMsg = error;
            this.finally();
          });
        }
        }
      } else {
            const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
            activeModal.componentInstance.showHide = false;
            activeModal.componentInstance.modalHeader = 'Alert';
            activeModal.componentInstance.modalContent = 'Please Select Some Process !!!';
          }
  }
  }

  finally() {
      this.isLoading = false;
      this.partyAccountForm.markAsPristine();
  }

  handleBack(cancelling: boolean = false) {
    if (this.partyAccountIdParam) {
      this.router.navigate(['../../partyAccount'], {relativeTo: this.route});
    } else {
      this.router.navigate(['../partyAccount'], {relativeTo: this.route});
    }
  }

  private createForm() {
    this.partyAccountForm = this.fb.group({
      'partyAccId': [''],
      'partyMasterId': ['', Validators.compose([Validators.required])],
      'partyAccCode': ['', Validators.compose([Validators.required, Validators.maxLength(10)])],
      'partyAccDesc': ['', Validators.compose([Validators.required, Validators.maxLength(100)])],
      'partyAccountDetailDTO': [[]],

  });

    this.partyMasterId = this.partyAccountForm.controls['partyMasterId'];
    this.partyAccCode = this.partyAccountForm.controls['partyAccCode'];
    this.partyAccDesc = this.partyAccountForm.controls['partyAccDesc'];
    this.items = this.partyAccountForm.controls['partyAccountDetailDTO'];

    this.treeConfig = {
      hasAllCheckBox: true,
      hasFilter: true,
      hasCollapseExpand: false,
      maxHeight: 500
    };
  }
}
