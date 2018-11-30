import { CommonService } from '../../../../../masters/components/common/index';
import { CurrencyService } from '../../../../../masters/components/currency/index';

import { Observable } from 'rxjs/Rx';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Component, Input } from '@angular/core';
import { PartyDetailsService } from 'app/pages/company/components/partyDetails/partyDetails.service';
import { ZoneEntryService } from '../../../../../masters/components/zoneEntry/zoneEntry.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModalComponent } from '../../../../../../shared/common-modal/common-modal.component';
import { Logger } from 'app/core/';
import { isNumber } from 'util';


const log = new Logger('importGeneralDetails');

@Component({
  selector: 'import-order-general-details',
  templateUrl: './orderGeneralDetails.html',
  styleUrls: ['./orderGeneralDetails.scss']
})
export class ImportGeneralDetails {

  @Input('parentForm')
  set parentForm(parentForm: FormGroup) {
    this._parentForm = parentForm;
    this.wtAvgRate = this._parentForm.controls['wtAvgRate'];
    this.poCurrency = this._parentForm.controls['poCurrency'];
    this.exchangeRate = this._parentForm.controls['exchangeRate'];
    this.selectedCurr = this.poCurrency.value;
    this.initForm();
    if (!this.creditDays.value) {
      this.creditDays.setValue(0);
    }

  }
  @Input('isViewMode')
  isViewMode: boolean;

  @Input('bankBranches')
  bankMasterList: any[];

  @Input('bankNameList')
  bankNameList: any[];

  @Input('termsList')
  termsList: any[];

 @Input()
  set data(orderGeneral: any) {
    if ( orderGeneral) {
      this.isEdit = true;
      if (this.importGeneralDetailsForm.invalid) {
        this.importGeneralDetailsForm.patchValue(orderGeneral);
        setTimeout(() => {
          this.dueDate.setValue(orderGeneral.dueDate);
        });
      }
      if (this.isViewMode) {
        this.importGeneralDetailsForm.disable();
      }
    }
  }

  isEdit: boolean;
  correncyMasterList: Observable<any>;

 // termsList:  Observable<any>;
  termName: any;
  public bankId: AbstractControl;
  public supBankNote: AbstractControl;
  bankList: any[] = [];
  public bank: AbstractControl;
  public bankTnC: AbstractControl;
  public dueDate: AbstractControl;
  public creditDays: AbstractControl;
  public localCurrency: AbstractControl;
  public orderAmount: AbstractControl;
  public orderAmountBase: AbstractControl;
  public generalDetails: AbstractControl;
  public wtAvgRate: AbstractControl;
  public exchangeRate: AbstractControl;
  public poCurrency: AbstractControl;
  selectedCurr: any;

  // totalAmount: AbstractControl;
  party: AbstractControl;

  public importGeneralDetailsForm: FormGroup;
  private _parentForm: FormGroup;

  constructor(private fb: FormBuilder, currencyService: CurrencyService,
    private partyService: PartyDetailsService,
    private commonService: CommonService) {
    this.importGeneralDetailsForm = this.fb.group({});
    this.correncyMasterList = currencyService.getAllCurrencies();
   // this.termsList = commonService.getAllCommonMasterByType('TS');
    this.commonService.getAllCommonMasterByType('BK').subscribe( (bankList) => {
      this.bankList = bankList;
     });
  }

  private initForm() {
    if (!this._parentForm.contains('generalDetails')) {
      this.importGeneralDetailsForm = this.fb.group({
        //'bankId': ['', Validators.compose([Validators.required])],
        'bank': [''],
        'supBankNote': ['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(150)])],
        'dueDate': [''],
        'creditDays': ['', Validators.compose([Validators.required])],
        'bankTnC': ['', Validators.compose([Validators.required])],
        'localCurrency': ['', Validators.compose([Validators.required])],
        // 'orderAmount': ['']
      });

      this._parentForm.addControl('generalDetails', this.importGeneralDetailsForm);
    } else {
      this.importGeneralDetailsForm = this._parentForm.controls['generalDetails'] as FormGroup;
    }

    this.bankId = this._parentForm.controls['bankId'];
    this.supBankNote = this.importGeneralDetailsForm.controls['supBankNote'];
    this.bank = this.importGeneralDetailsForm.controls['bank'];
    this.bankTnC = this.importGeneralDetailsForm.controls['bankTnC'];
    this.dueDate = this.importGeneralDetailsForm.controls['dueDate'];
    this.creditDays = this.importGeneralDetailsForm.controls['creditDays'];
    this.localCurrency = this.importGeneralDetailsForm.controls['localCurrency'];

    this.orderAmount = this._parentForm.controls['orderAmount'];
    this.orderAmountBase = this._parentForm.controls['orderAmountBase'];
    this.party = this._parentForm.controls['party'];

    this.localCurrency.setValue(this.party.value.currencyMaster.currId);

    if (!this.bankTnC.value) {
      this.bankTnC.setValue(this.party.value.commonMasterByTermsId.id);
      this.termName = this.party.value.commonMasterByTermsId.name;
     }
      this.bankTnC.valueChanges.subscribe(val => {
        if (val) {
          // this.dueDate.setValue('');
          this.termsList.forEach(element => {
            if (element.id == this.bankTnC.value) {
              this.termName = element.name;
            }
          })

          if (this.bankTnC.value) {
            const crDays = parseInt(this.termName.split(' ')[0]);
            const daysTotal = crDays + this.creditDays.value;
            const milis = 86400000 * daysTotal + (new Date()).getTime();
            const date = new Date(milis);
            const dd = date.getDate();
            const mm = date.getMonth() + 1; // January is 0!
            const yyyy = date.getFullYear();
              this.dueDate.setValue((dd < 10 ? '0' + dd : dd) + '-' + (mm < 10 ? '0' + mm : mm) + '-' + yyyy);
          }
        }
      });
       this.creditDays.valueChanges.subscribe(val => {
        if (isNumber(val)) {
          // this.dueDate.setValue('');
          if (this.bankTnC.value && this.termName != '' && this.termName != undefined && this.termName != null) {
            const crDays = parseInt(this.termName.split(' ')[0]);
            const daysTotal = crDays + val;
            const milis = 86400000 * daysTotal + (new Date()).getTime();
            const date = new Date(milis);
            const dd = date.getDate();
            const mm = date.getMonth() + 1; // January is 0!
            const yyyy = date.getFullYear();
              this.dueDate.setValue((dd < 10 ? '0' + dd : dd) + '-' + (mm < 10 ? '0' + mm : mm) + '-' + yyyy);
          }
        }
      });
      this.party.valueChanges.subscribe( resp => {
      // this.partyStatus = true;
       if (!resp.bankBranches) {
          this.partyService.getAllBankBranchByPartyId(resp.partyId, resp.partyType.code).subscribe(res => {
            this.bankMasterList = res;
            this.bankId.reset();
          });
       }
     })

     this.bankId.valueChanges.subscribe(val => {
       debugger
      this.supBankNote.reset();

      this.partyService.getPartyById(this.party.value.partyId).subscribe( data => {
        data.partyBankBranchList.forEach(element => {
          if (element.contactBankBranchId == val) {
            this.supBankNote.setValue(element.bankerNote);
          }
        });
      })
    });

  }
}
