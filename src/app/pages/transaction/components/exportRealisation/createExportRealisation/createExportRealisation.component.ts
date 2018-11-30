import { FormGroup, AbstractControl, FormBuilder, Validators, FormArray} from '@angular/forms';
import { Component, Pipe, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { AuthenticationService } from '../../../../../core/authentication/authentication.service';
import { Logger } from '../../../../../core/logger.service';
import { Location } from '@angular/common';
import { ExportRealisationService } from '../exportRealisation.service';
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
import { ExportRealisationModal } from '../createExportRealisation/exportRealisation-modal/exportRealisation-modal.component';
import { ItemDetail } from '../../../../masters/components/itemDetails';
import { ZoneEntryService } from '../../../../masters/components/zoneEntry/zoneEntry.service';
import { PrintExportComponent } from '../../../../../shared/print-export/print-export.component';

const log = new Logger('createExportRealisation');

@Component({
  selector: 'create-ExportRealisation',
  templateUrl: './createExportRealisation.html',
  styleUrls: ['./createExportRealisation.scss']
})
export class CreateExportRealisation implements OnInit  {

  settings: any;
  source: LocalDataSource = new LocalDataSource();

  exportRealisationIdParam: string;
  pageTitle = 'Create Export Realisation';
  error: string = null;
  createExportRealisationForm: FormGroup;

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

  exportRealisationForm: FormGroup;

  public invoiceNo: AbstractControl;
  public advRealisation: AbstractControl;
  public bankId: AbstractControl;
  public adviceNo: AbstractControl;
  public adviceDate: AbstractControl;
  public valueDate: AbstractControl;

  public amtInFC: AbstractControl;
  public bnkExhRate: AbstractControl;
  public amtInRs: AbstractControl;
  public broker: AbstractControl;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private service: ExportRealisationService,
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
      this.exportRealisationIdParam = params['id'];
      if (this.exportRealisationIdParam) {
        this.selectPo = true;
        this.service.getExportRealisationDataById(this.exportRealisationIdParam).subscribe(data => {
            this.invoiceId = data.invoiceId;
              this.createExportRealisationForm.enable();
              this.markAllTouched(this.createExportRealisationForm);
        })
      } else {
          this.createExportRealisationForm.disable();
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
    const activeModal = this.modalService.open(ExportRealisationModal, {size: 'lg'});
    activeModal.componentInstance.modalHeader = 'Import Invoice Details';
    activeModal.componentInstance.emitService.subscribe((emmitedValue) => {

    if (emmitedValue) {
      this.createExportRealisationForm.enable();
        this.selectPo = true;
    } else {
      this.createExportRealisationForm.disable();
    }
    });
  }


  submit() {
    if (this.errorMsg) {
      return; // TODO: Need to add client side validation.
    }
  }

  validSubmit() {

    if (this.createExportRealisationForm.value) {

      const formValue: any = this.createExportRealisationForm.value;
      this.service.createExportRealisation(formValue).subscribe(res => {
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
      this.service.createExportRealisation(this.createExportRealisationForm.value).subscribe(res => {
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

    if (this.exportRealisationIdParam) {
      this.router.navigate(['../../../exportRealisation'], {relativeTo: this.route});
    } else {
      this.router.navigate(['../exportRealisation'], {relativeTo: this.route});
    }
  }

  private createForm() {
    this.createExportRealisationForm = this.fb.group({
    'invoiceNo': ['', Validators.compose([Validators.required])],
    'advRealisation': [''],
    'bankId': ['', Validators.compose([Validators.required])],
    'adviceNo': [''],
    'adviceDate': [''],
    'valueDate': [''],

    'amtInFC': [''],
    'bnkExhRate': [''],
    'amtInRs': [''],
    'broker': [''],

    });

    this.invoiceNo = this.createExportRealisationForm.controls['invoiceNo'];
    this.advRealisation = this.createExportRealisationForm.controls['advRealisation'];
    this.bankId = this.createExportRealisationForm.controls['bankId'];
    this.adviceNo = this.createExportRealisationForm.controls['adviceNo'];
    this.adviceDate = this.createExportRealisationForm.controls['adviceDate'];
    this.valueDate = this.createExportRealisationForm.controls['valueDate'];

    this.amtInFC = this.createExportRealisationForm.controls['amtInFC'];
    this.bnkExhRate = this.createExportRealisationForm.controls['bnkExhRate'];
    this.amtInRs = this.createExportRealisationForm.controls['amtInRs'];
    this.broker = this.createExportRealisationForm.controls['broker'];

  }

}
