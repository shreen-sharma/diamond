import { Observable } from 'rxjs/Rx';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Component, Input } from '@angular/core';
import { Logger } from 'app/core/';
import { PartyDetailsService } from 'app/pages/company/components/partyDetails/partyDetails.service';
import { CommonService } from '../../../../../masters/components/common/index';
import { isNumber } from 'util';

const log = new Logger('OrderCustomerDetails');

@Component({
  selector: 'export-order-customer-details',
  templateUrl: './orderCustomerDetails.html',
  styleUrls: ['./orderCustomerDetails.scss']
})
export class ExportOrderCustomerDetails {

  @Input('parentForm')
  set parentForm(parentForm: FormGroup) {
    this._parentForm = parentForm;
    this.initForm();
  }

  @Input('isViewMode')
  isViewMode: boolean;

  // @Input('partyNote') set _partyNote(partyNote: string) {
  //   this.partyNote.setValue(partyNote);
  // }
  
  @Input('bankBranches')
  bankMasterList: any[];

  @Input('termsList')
  termsList: any[];

  @Input('bankNameList')
  bankNameList: any[];

  @Input('currList')
  currencyMasterList: any[];

  @Input()
  set data(orderCustomer: any) {
    if (orderCustomer) {
      this.isEdit = true;
      if(this.cusDetailsForm.invalid) {
        this.cusDetailsForm.patchValue(orderCustomer);
      }
      if (this.isViewMode) {
        this.cusDetailsForm.disable();
      }
    }
  }

  
  isEdit: boolean;
  bankList: any[] = [];
  notifierList: any[] = [];
  termName: any;

  public custbank: AbstractControl;
  public partyNote: AbstractControl;
  public bankerNote: AbstractControl;
  public notifier: AbstractControl;
  public notifierNote: AbstractControl;
  public ourBank: AbstractControl;
  public bankTnC: AbstractControl;
  public bdueDate: AbstractControl;
  public cbbDueDate: AbstractControl;
  public bcreditDays: AbstractControl;
  public cCreditDays: AbstractControl;  
  public localCurrency: AbstractControl;

  partyMasterByPartyId: AbstractControl;

  public cusDetailsForm: FormGroup;
  private _parentForm: FormGroup;

  constructor(private fb: FormBuilder,
    private partyService: PartyDetailsService,    
    private commonService: CommonService) {
      
    this.cusDetailsForm = this.fb.group({});
    
    this.commonService.getAllCommonMasterByType('BK').subscribe( (bankList) => {
      this.bankList = bankList;
     });

    this.partyService.getPartyByType('NO').subscribe( (party) => {
      this.notifierList = party;
    });

    setTimeout(() => {
      if(!this.localCurrency.value) {
        this.localCurrency.setValue(this.partyMasterByPartyId.value.currencyMaster.currId);
      }
      if(!this.bankTnC.value) {
        this.bankTnC.setValue(this.partyMasterByPartyId.value.commonMasterByTermsId.id);
        this.termName = this.partyMasterByPartyId.value.commonMasterByTermsId.name;
      }
    });
  }

  onNotifierChange(partyId: any) {
    this.partyService.getPartyById(partyId).subscribe( detail => {
      this.notifierNote.setValue(detail.remarks);
    });
  }

  private initForm() {
    if (!this._parentForm.contains('customerDetails')) {
      this.cusDetailsForm = this.fb.group({
        'partyNote': [''],
        'bankerNote': [''],
        'notifier': [''],
        'notifierNote': [''],
  
        'ourBank': ['', Validators.compose([Validators.required])],
        'bankTnC': ['', Validators.compose([Validators.required])],
        'bdueDate': [''],
        'cbbDueDate': [''],
        'bcreditDays': ['', Validators.compose([Validators.required])],
        'cCreditDays': ['', Validators.compose([Validators.required])],
        'localCurrency': ['', Validators.compose([Validators.required])],        
      });

      this._parentForm.addControl('customerDetails', this.cusDetailsForm);
    } else {
      this.cusDetailsForm = this._parentForm.controls['customerDetails'] as FormGroup;
    }

    this.custbank = this._parentForm.controls['custbank'];
    this.partyMasterByPartyId = this._parentForm.controls['partyMasterByPartyId'];

    this.partyNote = this.cusDetailsForm.controls['partyNote'];
    this.bankerNote = this.cusDetailsForm.controls['bankerNote'];
    this.notifier = this.cusDetailsForm.controls['notifier'];
    this.notifierNote = this.cusDetailsForm.controls['notifierNote'];
    
    this.ourBank = this.cusDetailsForm.controls['ourBank'];
    this.bankTnC = this.cusDetailsForm.controls['bankTnC'];
    this.bdueDate = this.cusDetailsForm.controls['bdueDate'];
    this.cbbDueDate = this.cusDetailsForm.controls['cbbDueDate'];
    this.bcreditDays = this.cusDetailsForm.controls['bcreditDays'];
    this.cCreditDays = this.cusDetailsForm.controls['cCreditDays'];
    this.localCurrency = this.cusDetailsForm.controls['localCurrency'];

    this.bankTnC.valueChanges.subscribe(val => {
      if(val) {
        if(isNumber(this.bcreditDays.value)) {
          this.bcreditDays.setValue(this.bcreditDays.value);
        } else {
          this.bcreditDays.setValue(0);
        }
        if(isNumber(this.cCreditDays.value)) {
          this.cCreditDays.setValue(this.cCreditDays.value);
        } else {
          this.cCreditDays.setValue(0);
        }
      }
    });

    this.custbank.valueChanges.subscribe(val => {
      this.bankerNote.reset();
      this.partyService.getPartyById(this.partyMasterByPartyId.value.partyId).subscribe( data => {
        data.partyBankBranchList.forEach(element => {
          if(element.contactBankBranchId == val) {
            this.bankerNote.setValue(element.bankerNote);
          }
        });
      })
    });

    this.bcreditDays.valueChanges.subscribe(val => {
      if (this.termsList.length > 0) {
        this.termsList.forEach( tr => {

          if(this.bankTnC.value == tr.id) {
            const crDays = parseInt(tr.name.split(' ')[0]);
            const daysTotal = crDays + val;
            const milis = 86400000 * daysTotal + (new Date()).getTime();
            const date = new Date(milis);
            const dd = date.getDate();
            const mm = date.getMonth() + 1; // January is 0!
            const yyyy = date.getFullYear();
            this.bdueDate.setValue((dd < 10 ? '0' + dd : dd) + '-' + (mm < 10 ? '0' + mm : mm) + '-' + yyyy);
          }

        })
      }
    });

    this.cCreditDays.valueChanges.subscribe(val => {
      if (this.termsList.length > 0) {
        this.termsList.forEach( tr => {

          if(this.bankTnC.value == tr.id) {
            const crDays = parseInt(tr.name.split(' ')[0]);
            const daysTotal = crDays + val;
            const milis = 86400000 * daysTotal + (new Date()).getTime();
            const date = new Date(milis);
            const dd = date.getDate();
            const mm = date.getMonth() + 1; // January is 0!
            const yyyy = date.getFullYear();
            this.cbbDueDate.setValue((dd < 10 ? '0' + dd : dd) + '-' + (mm < 10 ? '0' + mm : mm) + '-' + yyyy);
          }

        })
      }
    });

    this.partyMasterByPartyId.valueChanges.subscribe( resp => {
      if (!resp.bankBranches) {
        debugger;
        this.partyService.getAllBankBranchByPartyId(resp.partyId, resp.partyType.code).subscribe(res => {
          this.bankMasterList = res;
          this.custbank.reset();
        });
      }
    })

  }
}
