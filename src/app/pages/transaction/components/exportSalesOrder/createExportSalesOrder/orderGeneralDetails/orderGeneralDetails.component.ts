import { Observable } from 'rxjs/Rx';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Component, Input } from '@angular/core';
import { PartyDetailsService } from 'app/pages/company/components/partyDetails/partyDetails.service';
import { ZoneEntryService } from '../../../../../masters/components/zoneEntry/zoneEntry.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModalComponent } from '../../../../../../shared/common-modal/common-modal.component';
import { Logger } from 'app/core/';

const log = new Logger('OrderGeneralDetails');

@Component({
  selector: 'export-order-general-details',
  templateUrl: './orderGeneralDetails.html',
  styleUrls: ['./orderGeneralDetails.scss']
})

export class ExportOrderGeneralDetails {

  @Input('parentForm')
  set parentForm(parentForm: FormGroup) {
    this._parentForm = parentForm;
    this.orderAmountFC = this._parentForm.controls['orderAmountFC'].value;
    this.orderAmountSTK = this._parentForm.controls['orderAmountSTK'].value;
    this.orderAmountBase =this._parentForm.controls['orderAmountBase'].value;
    this.initForm();
  }

  @Input('isViewMode')
  isViewMode: boolean;

  @Input()
  set data(orderGeneral: any) {
    if (orderGeneral) {
      this.isEdit = true;
      if(this.detailsForm.invalid) {
        this.detailsForm.patchValue(orderGeneral);
      }
      if (this.isViewMode) {
        this.detailsForm.disable();
      }
    }
  }

  @Input('stockCurrCode')
  stockCurrCode: string;

  @Input('baseCurrCode')
  baseCurrCode: string;

  @Input('soCurrCode')
  soCurrCode: string;

  @Input('originCountryId') set _originCountryId(originCountryId: number) {
    this.cityMasterByOriginCountryId.setValue(originCountryId);
  }
  
  isEdit: boolean;
  orderAmountFC: number;
  orderAmountSTK: number;
  orderAmountBase: number;

  countryOriginList: any[] = [];
  reAssortList: any[] = [];
  cnFList: any[] = [];
  // netHeadList: any[] = [];

  public cityMasterByOriginCountryId: AbstractControl;
  public cityMasterByFinalDestId: AbstractControl;
  public partyMasterByCnfAgentId: AbstractControl;
  public partyMasterByReassortPartyId: AbstractControl;
  public reassortPerc: AbstractControl;
  public reassortCharge: AbstractControl;
  // public netHead: AbstractControl;
  // public headDesc: AbstractControl;
  public remark: AbstractControl;

  public detailsForm: FormGroup;
  private _parentForm: FormGroup;

  constructor(private fb: FormBuilder,
    private partyService: PartyDetailsService,
    private modalService: NgbModal,
    private zoneService: ZoneEntryService) {
    this.detailsForm = this.fb.group({});

    this.zoneService.getAllCountries().subscribe( country => {
      this.countryOriginList = country;
    });

    this.partyService.getPartyByType('RE').subscribe( party => {
      this.reAssortList = party;
    });
    this.partyService.getPartyByType('CF').subscribe( party => {
      this.cnFList = party;
    });
  }

  onChangeDest(val: any) {
    if(this.cityMasterByOriginCountryId.value == this.cityMasterByFinalDestId.value) {
      this.cityMasterByFinalDestId.reset();
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = false;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Origin Country & Destination Country cannot be same!';
    }
  }

  private initForm() {
    if (!this._parentForm.contains('saleDetails')) {
      this.detailsForm = this.fb.group({

        'cityMasterByOriginCountryId': [''],
        'cityMasterByFinalDestId': ['', Validators.compose([Validators.required])],
        'partyMasterByCnfAgentId': [''],
        'partyMasterByReassortPartyId': [''],
        'reassortPerc': [''],
        'reassortCharge': [''],
        // 'netHead': [''],
        // 'headDesc': [''],
        'remark': [''],
      });

      this._parentForm.addControl('saleDetails', this.detailsForm);
    } else {
      this.detailsForm = this._parentForm.controls['saleDetails'] as FormGroup;
    }

    this.cityMasterByOriginCountryId = this.detailsForm.controls['cityMasterByOriginCountryId'];
    this.cityMasterByFinalDestId = this.detailsForm.controls['cityMasterByFinalDestId'];
    this.partyMasterByCnfAgentId = this.detailsForm.controls['partyMasterByCnfAgentId'];
    this.partyMasterByReassortPartyId = this.detailsForm.controls['partyMasterByReassortPartyId'];
    this.reassortPerc = this.detailsForm.controls['reassortPerc'];
    this.reassortCharge = this.detailsForm.controls['reassortCharge'];
    // this.netHead = this.detailsForm.controls['netHead'];
    // this.headDesc = this.detailsForm.controls['headDesc'];
    this.remark = this.detailsForm.controls['remark'];
  }
}
