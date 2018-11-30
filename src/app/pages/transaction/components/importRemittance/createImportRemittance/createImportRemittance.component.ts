import { FormGroup, AbstractControl, FormBuilder, Validators, FormArray} from '@angular/forms';
import { Component, Pipe, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { AuthenticationService } from '../../../../../core/authentication/authentication.service';
import { Logger } from '../../../../../core/logger.service';
import { Location } from '@angular/common';
import { ImportRemittanceService } from '../importRemittance.service';
import { LotItemCreationService } from '../../../../stockManagement/components/lotItemCreation/index';
import { Observable } from 'rxjs/Observable';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Validator } from 'codelyzer/walkerFactory/walkerFn';
import { NgbTabset, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { debug, isNumber } from 'util';
import { DecimalPipe } from '@angular/common';
import { HierarchyRelationService } from 'app/pages/company/components/hierarchyRelation';
import { CommonModalComponent } from '../../../../../shared/common-modal/common-modal.component';
import { CategoryService } from './../../../../masters/components/categories';
import { LotService } from '../../../../stockManagement/components/lots';
import { ExchangeRateService } from 'app/pages/masters/components/exchangeRate';
import { PartyDetailsService } from 'app/pages/company/components/partyDetails';
import { CurrencyService } from 'app/pages/masters/components/currency';
import { ImportRemittanceModal } from '../createImportRemittance/importRemittance-modal/importRemittance-modal.component';
import { ItemDetail } from '../../../../masters/components/itemDetails';
import { ZoneEntryService } from '../../../../masters/components/zoneEntry/zoneEntry.service';
import { PrintExportComponent } from '../../../../../shared/print-export/print-export.component';

const log = new Logger('createImportRemittance');

@Component({
  selector: 'create-ImportRemittance',
  templateUrl: './createImportRemittance.html',
  styleUrls: ['./createImportRemittance.scss']
})
export class CreateImportRemittance implements OnInit  {

  settings: any;
  source: LocalDataSource = new LocalDataSource();

  importRemittanceIdParam: string;
  pageTitle = 'Create Import Remittance';
  error: string = null;
  createImportRemittanceForm: FormGroup;

  errorMsg: string = null;
  selectPo: boolean = false;
  invoiceId: number;
  party: any;
  partyBankBranches: any[];
  bankList: any[];
  exchangeRateList: any[] = [];
  brokerList: any[] = [];

  totalTaxAmountRs: number
  totAmountRs: number;
  netAmountRs: number;
  countryList: any[] = [];
  cityList: any[] = [];

  importRemittanceForm: FormGroup;

  public invoiceNo: AbstractControl;
  public advRemitt: AbstractControl;
  public bankId: AbstractControl;
  public adviceNo: AbstractControl;
  public adviceDate: AbstractControl;
  public valueDate: AbstractControl;

  public amtInFC: AbstractControl;
  public bnkExhRate: AbstractControl;
  public amtInRs: AbstractControl;
  public broker: AbstractControl;
  public commissionRate: AbstractControl;
  public commission: AbstractControl;
  public addcharge: AbstractControl;
  public processFee: AbstractControl;
  public avgRate: AbstractControl;

  public remAdjustType: AbstractControl;
  public fwdContract: AbstractControl;
  public AdjustAmtFc: AbstractControl;
  public remExchRate: AbstractControl;
  public RemtAmtInRs: AbstractControl;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private service: ImportRemittanceService,
    private authService: AuthenticationService,
    private currencyService: CurrencyService,
    private excnageService: ExchangeRateService,
    private hierService: HierarchyRelationService,
    private modalService: NgbModal,
    private partyService: PartyDetailsService,
    private back: Location,
    private lotItemService: LotItemCreationService,
    private lotService: LotService,
    private zoneService: ZoneEntryService,
    private catService: CategoryService) {

     this.createForm();
      this.service.getAllCommonMasterByType('BK').subscribe(res => {
      this.bankList = res;
    });
    this.partyService.getPartyByType('BR').subscribe(res => {
      this.brokerList = res;
    });
    this.zoneService.getAllCountries().subscribe((countryList) => {
      this.countryList = countryList;
    });
     this.excnageService.getData().subscribe((exchangeRateList) => {
      this.exchangeRateList = exchangeRateList;
    });
  }

  ngOnInit() {
debugger;
    this.route.params.subscribe((params: Params) => {
      this.importRemittanceIdParam = params['id'];
      if (this.importRemittanceIdParam) {
        this.selectPo = true;
        this.service.getImportRemittanceDataById(this.importRemittanceIdParam).subscribe(data => {
            this.invoiceId = data.invoiceId;
              this.createImportRemittanceForm.enable();
              this.markAllTouched(this.createImportRemittanceForm);
        })
      } else {
          this.createImportRemittanceForm.disable();
          this.selectPo = false;
      }
    });
  }


    markAllTouched(control: AbstractControl) {
    if (control.hasOwnProperty('controls')) {
      const ctrol = <any>control;
      for (const inner in ctrol.controls) {
        if (ctrol.controls) {
          this.markAllTouched(ctrol.controls[inner]);
        }
      }
    } else {
        control.markAsTouched();
    }
  }


  scrollTo(id: string) {
    const ele = document.getElementById(id);
    ele.scrollIntoView();
    window.scrollBy(0, -100);
  }

 lgModalShow() {
    const activeModal = this.modalService.open(ImportRemittanceModal, {size: 'lg'});
    activeModal.componentInstance.modalHeader = 'Import Invoice Details';
    activeModal.componentInstance.emitService.subscribe((emmitedValue) => {

    if (emmitedValue) {
      this.createImportRemittanceForm.enable();
        this.selectPo = true;
    } else {
      this.createImportRemittanceForm.disable();
    }
    });
  }


  submit() {
    if (this.errorMsg) {
      return; // TODO: Need to add client side validation.
    }
  }

  validSubmit() {

    if (this.createImportRemittanceForm.value) {

      const formValue: any = this.createImportRemittanceForm.value;
      this.service.createImportRemittance(formValue).subscribe(res => {
        this.handleBack();
      }, error => {
        log.debug(`Creation error: ${error}`);
        if (error._body) {
          this.errorMsg = error._body;
        }else {
          this.errorMsg = 'Internal Server Error!'
        }
      })
    } else {
      this.service.createImportRemittance(this.createImportRemittanceForm.value).subscribe(res => {
        this.handleBack();
      }, error => {
        log.debug(`Creation error: ${error}`);
        this.errorMsg = error._body;
      })
    }
  }

  finally() {
      this.back.back();
  }
handleBack(cancelling: boolean = false) {

    if (this.importRemittanceIdParam) {
      this.router.navigate(['../../../importRemittance'], {relativeTo: this.route});
    } else {
      this.router.navigate(['../importRemittance'], {relativeTo: this.route});
    }
  }

  private createForm() {
    this.createImportRemittanceForm = this.fb.group({
    'invoiceNo': ['', Validators.compose([Validators.required])],
    'advRemitt': [''],
    'bankId': ['', Validators.compose([Validators.required])],
    'adviceNo': [''],
    'adviceDate': [''],
    'valueDate': [''],

    'amtInFC': [''],
    'bnkExhRate': [''],
    'amtInRs': [''],
    'broker': [''],
    'commissionRate': [''],
    'commission': [''],
    'addcharge': [''],
    'processFee': [''],
    'avgRate': [''],

    'remAdjustType': [''],
    'fwdContract': [''],
    'AdjustAmtFc': [''],
    'remExchRate': [''],
    'RemtAmtInRs': [''],
    });
    this.invoiceNo = this.createImportRemittanceForm.controls['invoiceNo'];
    this.advRemitt = this.createImportRemittanceForm.controls['advRemitt'];
    this.bankId = this.createImportRemittanceForm.controls['bankId'];
    this.adviceNo = this.createImportRemittanceForm.controls['adviceNo'];
    this.adviceDate = this.createImportRemittanceForm.controls['adviceDate'];
    this.valueDate = this.createImportRemittanceForm.controls['valueDate'];
    this.amtInFC = this.createImportRemittanceForm.controls['amtInFC'];
    this.bnkExhRate = this.createImportRemittanceForm.controls['bnkExhRate'];
    this.amtInRs = this.createImportRemittanceForm.controls['amtInRs'];
    this.broker = this.createImportRemittanceForm.controls['broker'];
    this.commissionRate = this.createImportRemittanceForm.controls['commissionRate'];
    this.commission = this.createImportRemittanceForm.controls['commission'];
    this.addcharge = this.createImportRemittanceForm.controls['addcharge'];
    this.processFee = this.createImportRemittanceForm.controls['processFee'];
    this.avgRate = this.createImportRemittanceForm.controls['avgRate'];

    this.remAdjustType = this.createImportRemittanceForm.controls['remAdjustType'];
    this.fwdContract = this.createImportRemittanceForm.controls['fwdContract'];
    this.AdjustAmtFc = this.createImportRemittanceForm.controls['AdjustAmtFc'];
    this.remExchRate = this.createImportRemittanceForm.controls['remExchRate'];
    this.RemtAmtInRs = this.createImportRemittanceForm.controls['RemtAmtInRs'];
  }

}
