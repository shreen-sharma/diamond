import { FormGroup, FormArray, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { Observable } from 'rxjs/Observable';
import { Location } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModalComponent } from '../../../../../shared/common-modal/common-modal.component';
import { AuthenticationService } from '../../../../../core/authentication/authentication.service';
import { Logger } from '../../../../../core/logger.service';
import { ExportInvoiceService } from '../exportInvoice.service';
import { PartyDetailsService } from 'app/pages/company/components/partyDetails/partyDetails.service';
import { LotService } from 'app/pages/stockManagement/components/lots';
import { LotItemCreationService } from '../../../../stockManagement/components/lotItemCreation/index';
import { CategoryService } from 'app/pages/masters/components/categories/';
import { ExportSaleModal } from './exportSale-modal/exportSale-modal.component';
import { ItemDetailsService } from 'app/pages/masters/components/itemDetails/';
import { CurrencyService } from 'app/pages/masters/components/currency/';
import { HierarchyRelationService } from 'app/pages/company/components/hierarchyRelation';
import { ExchangeRateService } from 'app/pages/masters/components/exchangeRate/exchangeRate.service';
import { ZoneEntryService } from 'app/pages/masters/components/zoneEntry/zoneEntry.service';
import { JangadConsignmentReturnService } from '../../jangadConsignmentReturn';
import { isNumber } from 'util';
import { PrintExportComponent } from '../../../../../shared/print-export/print-export.component';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

const log = new Logger('CreateExportInvoice');

class AddItemDetails {
  lotItemId: number;
  lotId: number;
  lotName: string;
  itemId: number;
  itemName: string;
  description: string;
  pieces: number;
  carats: number;
  stockSellingPrice: number;
  stockAmount: number;
  rate: number;
  tAmount: number;
}

class listItems {
  si: any;
  description: any;
  hsn: any;
  carats: any;
  rate: any;
  amount: any;
}

@Component({
  selector: 'create-exportInvoice',
  templateUrl: './createExportInvoice.html',
  styleUrls: ['./createExportInvoice.scss']
})

export class CreateExportInvoice implements OnInit {

  public itemNameSearch: AbstractControl;

  lotItemList: any[] = [];
  lotItems: any[] = [];
  search = (text$: Observable<string>) =>
    text$
      .debounceTime(200)
      .distinctUntilChanged()
      .map(term => term.length < 1 ? []
        : this.lotItems.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10));


  pageTitle = 'Create Export Sales Invoice';
  exportInvoiceIdParam: string;
  errorMsg: string = null;
  isLoading = false;

  exportInvoiceForm: FormGroup;
  btnDisable: boolean = false;
  settings: any;
  isViewMode: boolean;
  showSbmtBtn: boolean = true;

  source: LocalDataSource = new LocalDataSource();

  stockCurrName: string;
  stockCurrCode: string;
  baseCurrName: string;
  baseCurrCode: string;
  invCurrName: string;
  invCurrCode: string;

  // totValueInv: number = 0;
  doNotCallInvExchRateChngFunctionWhenValueOne: number;
  sellingAmount: number = 0;
  ordAmount: number = 0;
  totSellingAmt: number = 0;
  notionalSTK: number = 0;
  notionalBase: number = 0;
  notPerc: number = 0;

  itemDetailsList: AddItemDetails[] = [];
  prefixList: any[] = [];
  suffixList: any[] = [];
  bankList: any[] = [];
  termsList: any[] = [];
  categoryList: any[] = [];
  currList: any[] = [];
  partyBankBranchesList: any[] = [];
  notifierList: any[] = [];
  vesselList: any[] = [];
  portDischargeList: any[] = [];
  lotList: any[] = [];
  exchangeRateList: any[] = [];
  customerList: any[] = [];
  brokerList: any[] = [];
  countryList: any[] = [];
  cityList: any[] = [];
  openingStockInvoice: boolean = false;
  loading: boolean = false;

  public commonMasterByPrefixId: AbstractControl;
  public commonMasterBySuffixId: AbstractControl;
  public customerName: AbstractControl;
  public partyMasterByPartyId: AbstractControl;     // customer party
  public expNo: AbstractControl;                    //invoice no  
  public expDate: AbstractControl;                  // invoice date
  public categoryMaster: AbstractControl;
  public expAdvReal: AbstractControl;
  public partyNote: AbstractControl;
  public ordNo: AbstractControl;                    // Exp sales order no 
  public brokerId: AbstractControl;
  public ourBank: AbstractControl;
  public commonMasterByTermsId: AbstractControl;
  public bankCrDays: AbstractControl;
  public cbbDueDate: AbstractControl;
  public partyDays: AbstractControl;
  public partyDueDate: AbstractControl;
  public stockCurr: AbstractControl;
  public stockExchRate: AbstractControl;
  public baseCurr: AbstractControl;
  public currencyMaster: AbstractControl;
  public invExchRate: AbstractControl;
  public isCompleted: AbstractControl;
  public provisional: AbstractControl;
  public custBankBranchId: AbstractControl;
  public bankerNote: AbstractControl;
  public partyMasterByNotifierId: AbstractControl;
  public notifierNote: AbstractControl;
  public vessel: AbstractControl;
  public vesselRemark: AbstractControl;
  public cityMasterByPortOfLoadingId: AbstractControl;
  public cityMasterByPortOfDischargeId: AbstractControl;
  public cityMasterByDestCountryId: AbstractControl;
  public cityMasterByOriginCountryId: AbstractControl;
  public customExchRate: AbstractControl;
  public customTotValFc: AbstractControl;
  public customTotValRs: AbstractControl;
  public bankExchRate1: AbstractControl;
  public bankFcAmt1: AbstractControl;
  public bankRsAmt1: AbstractControl;
  public bankExchRate2: AbstractControl;
  public bankFcAmt2: AbstractControl;
  public bankRsAmt2: AbstractControl;
  public bankTotValFc: AbstractControl;
  public bankTotValRs: AbstractControl;
  public otherRemark: AbstractControl;
  // public igst: AbstractControl;
  // public cgst: AbstractControl;
  // public sgst: AbstractControl;
  // public totGSTPerc: AbstractControl;
  // public igstAmount: AbstractControl;
  // public cgstAmount: AbstractControl;
  // public sgstAmount: AbstractControl;
  // public totGSTAmount: AbstractControl;
  public freightRs: AbstractControl;
  public insuranceRs: AbstractControl;
  public freightFc: AbstractControl;
  public insuranceFc: AbstractControl;
  public commissionPerc: AbstractControl;
  public discountPerc: AbstractControl;
  public odedPerc: AbstractControl;
  public commissionRs: AbstractControl;
  public discountRs: AbstractControl;
  public otherDedRs: AbstractControl;
  public commissionFc: AbstractControl;
  public discountFc: AbstractControl;
  public otherDedFc: AbstractControl;
  public totCDORs: AbstractControl;
  public totCDOFc: AbstractControl;
  public totFICDORs: AbstractControl;
  public totFICDOFc: AbstractControl;
  public brokeragePerc: AbstractControl;
  public brokerageRs: AbstractControl;
  public brokerageFc: AbstractControl;
  public lotCtrl: AbstractControl;
  public item: AbstractControl;
  public rateCtrl: AbstractControl;
  public piecesCtrl: AbstractControl;
  public caratsCtrl: AbstractControl;
  public descCtrl: AbstractControl;
  // public totValue: AbstractControl;                        // if uncommented, then uncomment from html file also
  public fobAmount: AbstractControl;
  public totalWgtCts: AbstractControl;
  public netWgtKg: AbstractControl;
  public boxWgt: AbstractControl;
  public grossWgt: AbstractControl;
  public remark: AbstractControl;
  public isDcReturn: AbstractControl;
  public dcReturnId: AbstractControl;
  public orderAmountSTK: AbstractControl;
  public orderAmountBase: AbstractControl;
  public profitSTK: AbstractControl;
  public profitBase: AbstractControl;
  public itemDetails: AbstractControl;
  public osi: AbstractControl;
  printItems: listItems[] = [];
  customerPrint: any; //Used For printing Invoice
  isView: any;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private back: Location,
    private fb: FormBuilder,
    private service: ExportInvoiceService,
    private authService: AuthenticationService,
    private partyService: PartyDetailsService,
    private currencyService: CurrencyService,
    private lotService: LotService,
    private lotItemService: LotItemCreationService,
    private excnageService: ExchangeRateService,
    private catService: CategoryService,
    private hierService: HierarchyRelationService,
    private modalService: NgbModal,
    private dcReturnService: JangadConsignmentReturnService,
    private zoneService: ZoneEntryService) {

    this.initForm();
    this.isDcReturn.setValue(false);
    this.settings = this.prepareSettings();

    this.currencyService.getAllCurrencies().subscribe((currList) => {
      this.currList = currList;
    });
    this.excnageService.getData().subscribe((exchangeRateList) => {
      this.exchangeRateList = exchangeRateList;
    });
    this.partyService.getPartyByType('CU').subscribe(data => {     // partystatus will be Foreign or 'F' not local
      this.customerList = data;
    })
    this.catService.getData().subscribe(res => {
      this.categoryList = res;
    });
    this.service.getAllCommonMasterByType('BK').subscribe(res => {
      this.bankList = res;
    });
    this.service.getAllCommonMasterByType('PX').subscribe(res => {
      this.prefixList = res;
      this.commonMasterByPrefixId.setValue(res[0]["id"]);
    });
    this.service.getAllCommonMasterByType('SX').subscribe(res => {
      this.suffixList = res;
      this.commonMasterBySuffixId.setValue(res[0]["id"]);
    });
    this.service.getAllCommonMasterByType('TS').subscribe(res => {
      this.termsList = res;
    });

    this.partyService.getPartyByType('BR').subscribe(res => {
      this.brokerList = res;
    });

    this.lotService.getData().subscribe(res => {
      this.lotList = res;
    });

    this.partyService.getPartyByType('NO').subscribe(res => {
      this.notifierList = res;
    });

    this.zoneService.getAllCountries().subscribe((countryList) => {
      this.countryList = countryList;
    });

    this.zoneService.getAllGeoByType('CT').subscribe((cityList) => {
      this.cityList = cityList;
    });

    // this.service.getAllCommonMasterByType().subscribe(res => {
    //   this.vesselList = res;
    // });

    // this.service.getAllCommonMasterByType().subscribe(res => {
    //   this.portDischargeList = res;
    // });
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

  onChangeLoading(val: any) {
    if (this.cityMasterByPortOfDischargeId.value) {
      this.onChangeDischarge(this.cityMasterByPortOfDischargeId.value);
    }
  }

  onChangeDischarge(val: any) {
    if (this.cityMasterByPortOfLoadingId.value == this.cityMasterByPortOfDischargeId.value) {
      this.cityMasterByPortOfDischargeId.reset();
      this.loading = false;
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = false;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Loading & Discharge Port cannot be same!';
    }
  }

  onChangeDest(val: any) {
    if (this.cityMasterByOriginCountryId.value == this.cityMasterByDestCountryId.value) {
      this.cityMasterByDestCountryId.reset();
      this.loading = false;
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = false;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Origin Country & Destination Country cannot be same!';
    }
  }

  dateFormate(date: Date) {
    const dd = date.getDate();
    const mm = date.getMonth() + 1; // January is 0!
    const yyyy = date.getFullYear();
    return yyyy + '-' + (mm < 10 ? '0' + mm : mm) + '-' + (dd < 10 ? '0' + dd : dd);
  }
  OpeningStockInvoice() {

    this.osi.setValue(true);
    this.isCompleted.setValue(true);

    //  this.purchaseInvoiceForm.disable();
    // this.selectPo = true;
    this.baseCurrName = "RUPEES";
    this.stockCurrName = "DOLLAR";
    this.stockExchRate.setValue(61);

    this.expDate.setValue(this.dateFormate(new Date()));
    this.hierService.getHierById(this.authService.credentials.company).subscribe(da => {

      this.hierService.getHierMasterById(da.hierarchyMaster.hierId).subscribe(res => {
        this.stockCurr.setValue(res.hierarchyDetailRequestDTO.currencyMasterByStockCurrId);
        this.baseCurr.setValue(res.hierarchyDetailRequestDTO.currencyMasterByCurrId);
        const a = this.currList.find(ele => {
          if (ele.currId == this.stockCurr.value) {
            return true;
          }
        })
        this.stockCurrName = a.currName;
        this.stockCurrCode = a.currCode;
        console.log(this.stockCurrCode);
        const b = this.currList.find(ele => {
          if (ele.currId == this.baseCurr.value) {
            return true;
          }
        })
        this.baseCurrName = b.currName;
        this.baseCurrCode = b.currCode;
        let flag = 0;
        this.exchangeRateList.forEach(res => {
          if (res.exchType == "ST" && res.currencyMasterByToCurrId == this.baseCurr.value
            && res.currencyMasterByFromCurrId == this.stockCurr.value) {
            if (!res.toDate || res.toDate <= this.expDate.value) {
              this.stockExchRate.setValue(res.exchRate);
              // this.setTimeoutStockEffectCalcFunc();
              // this.totalGrossAmountSTK.setValue(parseFloat((data.orderAmountBase / this.stockExchRate.value).toFixed(2)));
            }
            flag = 1;
          }
        });
        if (flag != 1) {
          this.loading = false;
          const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
          activeModal.componentInstance.showHide = false;
          activeModal.componentInstance.modalHeader = 'Alert';
          activeModal.componentInstance.modalContent = 'Please Add Stock Exchange Rate for ' + this.stockCurrName + ' To ' + this.baseCurrName + ' Currency in Custom Exchange Rate Screen!';
        }
      });
    });
  }

  ngOnInit() {
    if (this.router.url.includes('openingExpSalesInvoice')) {
      this.openingStockInvoice = true;
      // this.osi.setValue(true);
      this.OpeningStockInvoice();
      this.isViewMode = true;
      this.showSbmtBtn = true;
      this.exportInvoiceForm.enable();

    } else if (this.router.url.includes('viewExpSalesInvoice')) {

      this.openingStockInvoice = true;
      this.isCompleted.setValue(false);
      this.osi.setValue(false);
      this.route.params.subscribe((params: Params) => {

        this.dcReturnId.setValue(params['retId']);
        this.exportInvoiceIdParam = params['expId'];
        this.isView = params['isView'];

        if (this.exportInvoiceIdParam) {
          if(this.isView == 'true'){
            this.pageTitle = 'View Export Invoice';
            this.exportInvoiceForm.enable();
            this.btnDisable = true;
            this.showSbmtBtn = true;
            this.service.getOpeningStockExportSalesOrderInvoiceById(this.exportInvoiceIdParam).subscribe(data => {
              // if (params['status'] == 'COMPLETED' && data) {
              this.pageTitle = 'View Export Invoice';
              this.isViewMode = true;
              this.showSbmtBtn = false;
              this.exportInvoiceForm.disable();
              // } else {
              //   this.isViewMode = false;
              //   this.exportInvoiceForm.enable();
              //   this.markAllTouched(this.exportInvoiceForm);
              // }
  
              this.partyService.getAllBankBranchByPartyId(data.partyMasterByPartyId, 'CU').subscribe(partyBranchList => {
                this.partyBankBranchesList = partyBranchList;
                this.doNotCallInvExchRateChngFunctionWhenValueOne = 1;
                this.exportInvoiceForm.patchValue(data);
                this.expDate.setValue(data.expDate);
                this.cbbDueDate.setValue(data.cbbDueDate);
                this.partyDueDate.setValue(data.partyDueDate);
                this.stockCurr.setValue(data.stockCurr);
                this.baseCurr.setValue(data.baseCurr);
                this.currList.forEach(ele => {
                  if (ele.currId == data.stockCurr) {
                    this.stockCurrCode = ele.currCode;
                    this.stockCurrName = ele.currName;
                  }
                  if (ele.currId == data.baseCurr) {
                    this.baseCurrCode = ele.currCode;
                    this.baseCurrName = ele.currName;
                  }
                })
                this.stockExchRate.setValue(data.stockExchRate);
                this.ordNo.setValue(data.ordNo);
             //   this.orderAmountSTK.setValue(parseFloat(((this.getTAmount * this.invExchRate.value) / this.stockExchRate.value).toFixed(2)));
               // this.setTimeoutCalcFunc();
  
                setTimeout(() => {
                  this.doNotCallInvExchRateChngFunctionWhenValueOne = 0;
                });
              });
            })
            this.exportInvoiceForm.disable();
            this.exportInvoiceForm.markAsUntouched();
            this.showSbmtBtn = false;
          } else {
            this.pageTitle = 'Edit Export Invoice';
          this.exportInvoiceForm.enable();
          this.btnDisable = true;
          this.showSbmtBtn = true;
          this.service.getOpeningStockExportSalesOrderInvoiceById(this.exportInvoiceIdParam).subscribe(data => {
            // if (params['status'] == 'COMPLETED' && data) {
            this.pageTitle = 'View Export Invoice';
            this.isViewMode = true;
            this.showSbmtBtn = false;
            this.exportInvoiceForm.disable();
            // } else {
            //   this.isViewMode = false;
            //   this.exportInvoiceForm.enable();
            //   this.markAllTouched(this.exportInvoiceForm);
            // }

            this.partyService.getAllBankBranchByPartyId(data.partyMasterByPartyId, 'CU').subscribe(partyBranchList => {
              this.partyBankBranchesList = partyBranchList;
              this.doNotCallInvExchRateChngFunctionWhenValueOne = 1;
              this.exportInvoiceForm.patchValue(data);
              this.expDate.setValue(data.expDate);
              this.cbbDueDate.setValue(data.cbbDueDate);
              this.partyDueDate.setValue(data.partyDueDate);
              this.stockCurr.setValue(data.stockCurr);
              this.baseCurr.setValue(data.baseCurr);
              this.currList.forEach(ele => {
                if (ele.currId == data.stockCurr) {
                  this.stockCurrCode = ele.currCode;
                  this.stockCurrName = ele.currName;
                }
                if (ele.currId == data.baseCurr) {
                  this.baseCurrCode = ele.currCode;
                  this.baseCurrName = ele.currName;
                }
              })
              this.stockExchRate.setValue(data.stockExchRate);
              this.ordNo.setValue(data.ordNo);
           //   this.orderAmountSTK.setValue(parseFloat(((this.getTAmount * this.invExchRate.value) / this.stockExchRate.value).toFixed(2)));
             // this.setTimeoutCalcFunc();

              setTimeout(() => {
                this.doNotCallInvExchRateChngFunctionWhenValueOne = 0;
              });
            });
          })
          }
        } else {
          this.exportInvoiceForm.disable();
          this.btnDisable = false;
        }


      });

    }
    else {

      this.isCompleted.setValue(false);
      this.osi.setValue(false);
      this.route.params.subscribe((params: Params) => {

        this.dcReturnId.setValue(params['retId']);
        this.exportInvoiceIdParam = params['expId'];
        this.isView = params['isView'];
        debugger;
        if (this.exportInvoiceIdParam) {
          if(this.isView == 'true'){
            this.pageTitle = 'View Export Invoice';
            this.exportInvoiceForm.enable();
            this.btnDisable = true;
            this.showSbmtBtn = true;
            this.service.getExportInvoiceById(this.exportInvoiceIdParam).subscribe(data => {
              if (params['status'] == 'COMPLETED' && data) {
                this.pageTitle = 'View Export Invoice';
                this.isViewMode = true;
                this.showSbmtBtn = false;
                this.exportInvoiceForm.disable();
              } else {
                this.isViewMode = false;
                this.exportInvoiceForm.enable();
                this.markAllTouched(this.exportInvoiceForm);
              }
  
              this.partyService.getAllBankBranchByPartyId(data.partyMasterByPartyId, 'CU').subscribe(partyBranchList => {
                this.partyBankBranchesList = partyBranchList;
                this.doNotCallInvExchRateChngFunctionWhenValueOne = 1;
                this.exportInvoiceForm.patchValue(data);
                this.exportInvoiceForm.disable();
                this.exportInvoiceForm.markAsUntouched();
                this.showSbmtBtn = false;
                this.isViewMode = true;
                this.expDate.setValue(data.expDate);
                this.cbbDueDate.setValue(data.cbbDueDate);
                this.partyDueDate.setValue(data.partyDueDate);
                this.stockCurr.setValue(data.stockCurr);
                this.baseCurr.setValue(data.baseCurr);
                this.currList.forEach(ele => {
                  if (ele.currId == data.stockCurr) {
                    this.stockCurrCode = ele.currCode;
                    this.stockCurrName = ele.currName;
                  }
                  if (ele.currId == data.baseCurr) {
                    this.baseCurrCode = ele.currCode;
                    this.baseCurrName = ele.currName;
                  }
                })
                this.stockExchRate.setValue(data.stockExchRate);
                this.ordNo.setValue(data.ordNo);
  
                this.itemDetailsList = data.itemDetails;
                // this.itemDetailsList = [];
                // data.itemList.forEach(item => {
                //   const newItem = new AddItemDetails();
                //   newItem.itemId = item.itemId;
                //   newItem.lotId = item.lotId;
                //   newItem.lotName = item.lotName;
                //   newItem.lotItemId = item.lotItemId;
                //   newItem.itemName = item.itemName;
                //   newItem.description = item.description;
                //   newItem.pieces = item.pieces;
                //   newItem.carats = item.carats;            
                //   newItem.stockSellingPrice = item.stockSellingPrice;
                //   newItem.stockAmount = parseFloat((item.carats * item.stockSellingPrice).toFixed(2));
                //   newItem.rate = item.rate;
                //   newItem.tAmount = parseFloat((item.carats * item.rate).toFixed(2));           
                //   this.itemDetailsList.push(newItem);
                // });
                this.source.load(this.itemDetailsList);
                this.orderAmountSTK.setValue(parseFloat(((this.getTAmount * this.invExchRate.value) / this.stockExchRate.value).toFixed(2)));
                this.setTimeoutCalcFunc();
                this.settings = this.prepareSettings();
                setTimeout(() => {
                  this.doNotCallInvExchRateChngFunctionWhenValueOne = 0;
                });
              });
            })
          } else {
            this.pageTitle = 'Edit Export Invoice';
            this.exportInvoiceForm.enable();
            this.btnDisable = true;
            this.showSbmtBtn = true;
            this.service.getExportInvoiceById(this.exportInvoiceIdParam).subscribe(data => {
              if (params['status'] == 'COMPLETED' && data) {
                this.pageTitle = 'View Export Invoice';
                this.isViewMode = true;
                this.showSbmtBtn = false;
                this.exportInvoiceForm.disable();
              } else {
                this.isViewMode = false;
                this.exportInvoiceForm.enable();
                this.markAllTouched(this.exportInvoiceForm);
              }
  
              this.partyService.getAllBankBranchByPartyId(data.partyMasterByPartyId, 'CU').subscribe(partyBranchList => {
                this.partyBankBranchesList = partyBranchList;
                this.doNotCallInvExchRateChngFunctionWhenValueOne = 1;
                this.exportInvoiceForm.patchValue(data);
                this.expDate.setValue(data.expDate);
                this.cbbDueDate.setValue(data.cbbDueDate);
                this.partyDueDate.setValue(data.partyDueDate);
                this.stockCurr.setValue(data.stockCurr);
                this.baseCurr.setValue(data.baseCurr);
                this.currList.forEach(ele => {
                  if (ele.currId == data.stockCurr) {
                    this.stockCurrCode = ele.currCode;
                    this.stockCurrName = ele.currName;
                  }
                  if (ele.currId == data.baseCurr) {
                    this.baseCurrCode = ele.currCode;
                    this.baseCurrName = ele.currName;
                  }
                })
                this.stockExchRate.setValue(data.stockExchRate);
                this.ordNo.setValue(data.ordNo);
  
                this.itemDetailsList = data.itemDetails;
                // this.itemDetailsList = [];
                // data.itemList.forEach(item => {
                //   const newItem = new AddItemDetails();
                //   newItem.itemId = item.itemId;
                //   newItem.lotId = item.lotId;
                //   newItem.lotName = item.lotName;
                //   newItem.lotItemId = item.lotItemId;
                //   newItem.itemName = item.itemName;
                //   newItem.description = item.description;
                //   newItem.pieces = item.pieces;
                //   newItem.carats = item.carats;            
                //   newItem.stockSellingPrice = item.stockSellingPrice;
                //   newItem.stockAmount = parseFloat((item.carats * item.stockSellingPrice).toFixed(2));
                //   newItem.rate = item.rate;
                //   newItem.tAmount = parseFloat((item.carats * item.rate).toFixed(2));           
                //   this.itemDetailsList.push(newItem);
                // });
                this.source.load(this.itemDetailsList);
                this.orderAmountSTK.setValue(parseFloat(((this.getTAmount * this.invExchRate.value) / this.stockExchRate.value).toFixed(2)));
                this.setTimeoutCalcFunc();
                this.settings = this.prepareSettings();
                setTimeout(() => {
                  this.doNotCallInvExchRateChngFunctionWhenValueOne = 0;
                });
              });
            })
          }
        } else {
          this.exportInvoiceForm.disable();
          this.btnDisable = false;
        }

        if (this.dcReturnId.value) {
          window.scrollTo(0, 0);
          this.onRouteToInvFromDC();
        } else {
          this.isDcReturn.setValue(false);
        }
      });
      this.cityMasterByOriginCountryId.disable();
    }
  }

  onRouteToInvFromDC() {
    this.exportInvoiceForm.enable();
    this.btnDisable = true;
    this.isDcReturn.setValue(true);
    this.expDate.setValue(this.dateFormate(new Date()));
    this.isCompleted.setValue(false);
    this.provisional.setValue(false);
    this.hierService.getHierById(this.authService.credentials.company).subscribe(da => {

      this.hierService.getHierMasterById(da.hierarchyMaster.hierId).subscribe(res => {
        this.stockCurr.setValue(res.hierarchyDetailRequestDTO.currencyMasterByStockCurrId);
        this.baseCurr.setValue(res.hierarchyDetailRequestDTO.currencyMasterByCurrId);
        this.doNotCallInvExchRateChngFunctionWhenValueOne = 1;
        this.currencyMaster.setValue(this.stockCurr.value);
        this.cityMasterByOriginCountryId.setValue(res.addressMaster.country);
        this.cityMasterByPortOfLoadingId.setValue(res.addressMaster.city);

        this.currList.forEach(ele => {
          if (ele.currId == this.stockCurr.value) {
            this.stockCurrCode = ele.currCode;
            this.stockCurrName = ele.currName;
          }
          if (ele.currId == this.baseCurr.value) {
            this.baseCurrCode = ele.currCode;
            this.baseCurrName = ele.currName;
          }
        })
        let flag = 0;
        this.exchangeRateList.forEach(res => {                        // If needed, change exchType to 'EX' for Export
          if (res.exchType == 'ST' && res.currencyMasterByToCurrId == this.baseCurr.value
            && res.currencyMasterByFromCurrId == this.stockCurr.value) {
            if (!res.toDate || res.toDate <= this.expDate.value) {
              this.stockExchRate.setValue(res.exchRate);
              this.invExchRate.setValue(res.exchRate);
            }
            flag = 1;
          }
        });
        if (flag != 1) {
          this.loading = false;
          const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
          activeModal.componentInstance.showHide = false;
          activeModal.componentInstance.modalHeader = 'Alert';
          activeModal.componentInstance.modalContent = 'Please Add Stock Exchange Rate for ' + this.stockCurrName + ' To ' + this.baseCurrName + ' Currency in Custom Exchange Rate Screen!';
        }


        this.dcReturnService.getJangadCNReturnById(this.dcReturnId.value).subscribe(ele => {
          console.log(ele);

          this.brokerId.setValue(ele.broker);
          this.ordNo.setValue(this.dcReturnId.value);
          this.partyMasterByPartyId.setValue(ele.partyId);
          this.customerName.setValue(ele.partyName);

          this.dcReturnService.getIssueDetailById(ele.issueNo).subscribe(resp => {
            if (this.categoryList.length > 0) {
              this.categoryMaster.setValue(this.categoryList[0].catId);
            }
            if (resp.bankId) {
              this.custBankBranchId.setValue(resp.bankId);
            }
            if (resp.bank) {
              this.ourBank.setValue(resp.bank);
            }
            if (resp.bankTnC) {
              this.commonMasterByTermsId.setValue(resp.bankTnC);
            }
            if (resp.creditDays) {
              this.bankCrDays.setValue(resp.creditDays);
            }
          });
          const dcReturnItems: any[] = ele.returnDetails;
          this.itemDetailsList = [];
          dcReturnItems.forEach(item => {
            if (item.selectedCts > 0) {
              const newItem = new AddItemDetails();
              newItem.itemId = item.itemId;
              newItem.lotId = item.lotId;
              newItem.lotName = item.lotName;
              newItem.lotItemId = item.lotItemId;
              newItem.itemName = item.itemName;
              newItem.pieces = item.selectedPcs;
              newItem.carats = item.selectedCts;
              newItem.rate = item.agreedRate;
              newItem.stockSellingPrice = item.spRate;
              newItem.tAmount = parseFloat((item.selectedCts * item.agreedRate).toFixed(2));
              newItem.stockAmount = parseFloat((item.selectedCts * item.spRate).toFixed(2));
              this.itemDetailsList.push(newItem);
            }
          });
          this.source.load(this.itemDetailsList);
          this.orderAmountSTK.setValue(parseFloat(((this.getTAmount * this.invExchRate.value) / this.stockExchRate.value).toFixed(2)));
          this.setTimeoutCalcFunc();
          this.settings = this.prepareSettings();
          this.onChangeBankExchRate1(this.invExchRate.value);
          this.onChangeBankExchRate2(this.invExchRate.value);
        });

        setTimeout(() => {
          this.doNotCallInvExchRateChngFunctionWhenValueOne = 0;
        });
      });
    });
  }

  validP() {
    if (this.exportInvoiceIdParam) {
      this.print();
    } else {
      this.loading = false;
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = false;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Please submit the Invoice first & Edit again to proceed for Print!!';
    }
  }

  print() {
    debugger;
    let hsnNo: any;
    if (this.categoryMaster.value) {
      hsnNo = this.categoryList.find(element => {
        debugger;
        if (element.catId == this.categoryMaster.value) {
          return true;
        }
      })
    }
    let i = 1;
    this.printItems = [];
    this.itemDetailsList.forEach(ele => {
      const newItem = new listItems;
      newItem.si = i;
      i++;
      newItem.description = ele.description;
      newItem.carats = ele.carats;
      newItem.rate = ele.rate;
      newItem.hsn = hsnNo.statisticalCode;
      newItem.amount = parseFloat((newItem.rate * newItem.carats).toFixed(2));
      this.printItems.push(newItem);
    })
    let totalC = 0;
    let totalP = 0;
    let totalA = 0;
    this.printItems.forEach(item => {
      totalC = totalC + item.carats;
      totalA = totalA + item.amount;
    });
    let cumuRate = totalA / totalC;
    this.loading = false;
    const activeModal = this.modalService.open(PrintExportComponent, { size: 'lg' });
    this.partyService.getPartyById(this.customerPrint).subscribe(data => {
      console.log(data);
      this.service.getAddressById(data.addressMasterDTO.addressId).subscribe(ele => {
        activeModal.componentInstance.cusAddress = ele.add11; //Selected party address
        activeModal.componentInstance.cusCity = ele.city.name;  //Selected party city
        activeModal.componentInstance.cusState = ele.state.name;  //Selected party State
        activeModal.componentInstance.supState = ele.state.name;  //Supplier's State
        activeModal.componentInstance.cusStateCode = ele.state.stateCode;
      })
      activeModal.componentInstance.cusName = data.partyName;  //Selected party for whom DC is generated
      activeModal.componentInstance.cusGst = data.gstNo;  //Selected party gst no
      activeModal.componentInstance.cusCin = data.cinNo;  //Selected party cin no
      activeModal.componentInstance.cusPan = data.panNo;  //Selected party pan no
    })
    activeModal.componentInstance.companyImage = 'assets/images/Logo.jpg';
    // activeModal.componentInstance.challanNo = 'DC101' // This will be issue no_return no combination
    activeModal.componentInstance.items = this.printItems;  // item list with columns(si, description, pcs, carats, rate)
    activeModal.componentInstance.totalPcs = totalP;
    activeModal.componentInstance.totalCarats = parseFloat(totalC.toFixed(3));
    activeModal.componentInstance.tAmount = parseFloat(totalA.toFixed(2));
    activeModal.componentInstance.avgRate = parseFloat(cumuRate.toFixed(2));
    activeModal.componentInstance.hsnNo = hsnNo;
    activeModal.componentInstance.printDate = this.expDate.value;
    activeModal.componentInstance.invoiceNo = this.exportInvoiceIdParam;
    this.countryList.forEach(element => {
      if (element.geoId == this.cityMasterByDestCountryId.value) {
        activeModal.componentInstance.suppCountry = element.name;
        activeModal.componentInstance.destination = element.name;
      }
      if (element.geoId == this.cityMasterByOriginCountryId.value) {
        activeModal.componentInstance.companyCountry = element.name;
      }
    })
    this.cityList.forEach(element => {
      if (element.geoId == this.cityMasterByPortOfDischargeId.value) {
        activeModal.componentInstance.portOfDischarge = element.name;
      }
      if (element.geoId == this.cityMasterByPortOfLoadingId.value) {
        activeModal.componentInstance.portOfLoad = element.name;
      }
    })
    // activeModal.componentInstance.vesselNo = this.vessel.value;
  }

  onEditConfirm(event: any): void {
    this.lotItemService.getLotItemCreationById(event.data.lotItemId).subscribe(data => {
      const availCarats = data.totalCarets;
      if (event.newData.carats <= 0 && event.newData.rate <= 0) {
        this.loading = false;
        const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
        activeModal.componentInstance.showHide = false;
        activeModal.componentInstance.modalHeader = 'Alert';
        activeModal.componentInstance.modalContent = 'Carats and Rate should be greater than 0!';
        event.confirm.reject();
      } else if (event.newData.carats > availCarats) {
        this.loading = false;
        const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
        activeModal.componentInstance.showHide = false;
        activeModal.componentInstance.modalHeader = 'Alert';
        activeModal.componentInstance.modalContent = 'Carats should not be greater than available carats i.e ' + availCarats + ' Cts!!';
      } else {
        let index = 0;
        this.itemDetailsList.forEach(element => {
          const avc = <any>element;
          if (avc.lotItemId == event.data.lotItemId) {
            const ac = <any>this.itemDetailsList[index];
            ac.description = event.newData.description;
            ac.carats = ((parseFloat(event.newData.carats)).toFixed(2));
            ac.rate = ((parseFloat(event.newData.rate)).toFixed(2));
            ac.stockAmount = ((parseFloat(event.newData.carats) * parseFloat(event.newData.stockSellingPrice)).toFixed(2));
            ac.tAmount = ((parseFloat(event.newData.carats) * parseFloat(event.newData.rate)).toFixed(2));
          } else {
            index++;
          }
        });
        this.source.load(this.itemDetailsList);
        this.orderAmountSTK.setValue(parseFloat(((this.getTAmount * this.invExchRate.value) / this.stockExchRate.value).toFixed(2)));
        this.setTimeoutCalcFunc();
        this.getTaxableAmountAndNetAmount();
        this.getTaxableAmountAndNetAmountFc();
      }
    });
  }

  handleAdd() {
    if (this.isDcReturn.value) {
      this.rateCtrl.reset();
      this.caratsCtrl.reset();
      this.piecesCtrl.reset();
      this.descCtrl.reset();
      this.loading = false;
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = false;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Cannot Add Item in DC Return Book Sale Mode!!';
    } else {
      if (this.caratsCtrl.value && this.rateCtrl.value && this.lotCtrl.value && this.item.value) {
        if (this.caratsCtrl.value <= 0) {
          this.loading = false;
          const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
          activeModal.componentInstance.showHide = false;
          activeModal.componentInstance.modalHeader = 'Alert';
          activeModal.componentInstance.modalContent = 'Carats should be greater than 0!';
        } else if (this.rateCtrl.value <= 0) {
          this.loading = false;
          const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
          activeModal.componentInstance.showHide = false;
          activeModal.componentInstance.modalHeader = 'Alert';
          activeModal.componentInstance.modalContent = 'Rate should be greater than 0!';
        } else if (this.caratsCtrl.value > this.item.value.totalCarets) {
          this.loading = false;
          const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
          activeModal.componentInstance.showHide = false;
          activeModal.componentInstance.modalHeader = 'Alert';
          activeModal.componentInstance.modalContent = 'Carats should not be greater than available carats i.e ' + this.item.value.totalCarets + ' Cts!!';
        } else if (this.itemDetailsList.length > 0) {
          let flag = 0;
          this.itemDetailsList.forEach(ele => {
            if (ele.lotItemId == this.item.value.lotItemId) {
              this.loading = false;
              const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
              activeModal.componentInstance.showHide = false;
              activeModal.componentInstance.modalHeader = 'Alert';
              activeModal.componentInstance.modalContent = 'Item Already Added';
              flag = 1;
            }
          })
          if (flag == 0) {
            const orderItem = new AddItemDetails();
            orderItem.itemName = this.item.value.itemMaster.itemName;
            orderItem.description = this.descCtrl.value;
            orderItem.itemId = this.item.value.itemMaster.itemId;
            orderItem.carats = this.caratsCtrl.value;
            if (this.piecesCtrl.value) {
              orderItem.pieces = this.piecesCtrl.value;
            } else {
              orderItem.pieces = 0;
            }
            orderItem.rate = this.rateCtrl.value;
            orderItem.lotItemId = this.item.value.lotItemId;
            orderItem.lotId = this.lotCtrl.value.lotId;
            orderItem.lotName = this.item.value.lotMaster.lotName;
            orderItem.tAmount = parseFloat((this.caratsCtrl.value * this.rateCtrl.value).toFixed(2));
            if (this.item.value.itemMaster.salePrice) {
              orderItem.stockSellingPrice = this.item.value.itemMaster.salePrice;
            } else {
              orderItem.stockSellingPrice = 0;
            }
            orderItem.stockAmount = parseFloat((this.caratsCtrl.value * orderItem.stockSellingPrice).toFixed(2));
            this.itemDetailsList.push(orderItem);
            this.source.load(this.itemDetailsList);
            this.orderAmountSTK.setValue(parseFloat(((this.getTAmount * this.invExchRate.value) / this.stockExchRate.value).toFixed(2)));
            this.setTimeoutCalcFunc();
            this.rateCtrl.reset();
            this.caratsCtrl.reset();
            this.piecesCtrl.setValue(0);
            this.descCtrl.reset();
          }
        } else {
          const orderItem = new AddItemDetails();
          orderItem.itemName = this.item.value.itemMaster.itemName;
          orderItem.description = this.descCtrl.value;
          orderItem.itemId = this.item.value.itemMaster.itemId;
          orderItem.carats = this.caratsCtrl.value;
          if (this.piecesCtrl.value) {
            orderItem.pieces = this.piecesCtrl.value;
          } else {
            orderItem.pieces = 0;
          }
          orderItem.rate = this.rateCtrl.value;
          orderItem.lotId = this.lotCtrl.value.lotId;
          orderItem.lotItemId = this.item.value.lotItemId;
          orderItem.lotName = this.item.value.lotMaster.lotName;
          orderItem.tAmount = parseFloat((this.caratsCtrl.value * this.rateCtrl.value).toFixed(2));
          if (this.item.value.itemMaster.salePrice) {
            orderItem.stockSellingPrice = this.item.value.itemMaster.salePrice;
          } else {
            orderItem.stockSellingPrice = 0;
          }
          orderItem.stockAmount = parseFloat((this.caratsCtrl.value * orderItem.stockSellingPrice).toFixed(2));
          this.itemDetailsList.push(orderItem);
          this.source.load(this.itemDetailsList);
          this.orderAmountSTK.setValue(parseFloat(((this.getTAmount * this.invExchRate.value) / this.stockExchRate.value).toFixed(2)));
          this.setTimeoutCalcFunc();
          this.rateCtrl.reset();
          this.caratsCtrl.reset();
          this.piecesCtrl.setValue(0);
          this.descCtrl.reset();
        }
      }
    }
  }

  onDeleteConfirm(event: any): void {
    if (this.isDcReturn.value) {
      this.loading = false;
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = false;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Cannot Delete Item in DC Return Book Sale Mode!!';
    } else {
      this.loading = false;
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = true;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Are you sure you want to delete?';
      activeModal.result.then((res) => {
        if (res == 'Y') {
          let index = 0;
          this.itemDetailsList.forEach(element => {
            if (element.lotItemId == event.data.lotItemId) {
              this.itemDetailsList.splice(index, 1);
              this.source.load(this.itemDetailsList);
              event.confirm.resolve();
              this.orderAmountSTK.setValue(parseFloat(((this.getTAmount * this.invExchRate.value) / this.stockExchRate.value).toFixed(2)));
              this.setTimeoutCalcFunc();
              this.getTaxableAmountAndNetAmount();
              this.getTaxableAmountAndNetAmountFc();
            } else {
              index++;
            }
          });
        } else {
          event.confirm.reject();
        }
      });
    }
  }

  prepareSettings() {
    return {
      actions: {
        position: 'right',
        add: false,
        edit: !this.isViewMode,
        delete: !this.isViewMode,
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
        display: true,
        perPage: 10,
      },
      columns: {
        lotName: {
          title: 'Lot',
          editable: false,
        },
        itemName: {
          title: 'Item Name',
          editable: false,
        },
        description: {
          title: 'Item Description',
          editable: true,
          valuePrepareFunction: value => {
            if (value == '' || value == null) {
              return '-';
            } else {
              return value;
            }
          }
        },
        pieces: {
          title: 'Pieces',
          editable: false,
        },
        carats: {
          title: 'Total Carats',
          editable: !this.isDcReturn.value,
        },
        stockSellingPrice: {
          title: 'Selling Price (USD)',
          editable: false,
          valuePrepareFunction: value => {
            return value;
          }
        },
        stockAmount: {
          title: 'Selling Amount (USD)',
          editable: false,
        },
        rate: {
          title: 'Rate',
          editable: !this.isDcReturn.value,
        },
        tAmount: {
          title: 'Total Amount',
          editable: false,
        },
      }
    };
  }

  submit() {
    this.loading = true;
    this.validateRequiredField();
    if (this.errorMsg) {
      this.loading = false;
      return;       //TODO: Need to add client side validation.
    }
    if (!this.expAdvReal.value) {
      this.expAdvReal.setValue(false);
    }
    if (!this.isCompleted.value) {
      this.isCompleted.setValue(false);
    }
    if (!this.provisional.value) {
      this.provisional.setValue(false);
    }
    if (!this.isDcReturn.value) {
      this.isDcReturn.setValue(false);
    }
    this.showSbmtBtn = false;

    if (this.openingStockInvoice) {
      if (this.exportInvoiceForm.value) {
        this.itemDetails.setValue(this.itemDetailsList);
        this.cityMasterByOriginCountryId.enable();
        if (this.cityMasterByOriginCountryId.value == this.cityMasterByDestCountryId.value) {
          this.showSbmtBtn = true;
          this.cityMasterByOriginCountryId.disable();
          this.loading = false;
          const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
          activeModal.componentInstance.showHide = false;
          activeModal.componentInstance.modalHeader = 'Alert';
          activeModal.componentInstance.modalContent = 'Origin & Destination Country should not be Same!!';
        } else {
          const formValue: any = this.exportInvoiceForm.value;
          this.service.addOpeningStockExportSalesOrderInvoice(formValue).subscribe(resp => {
            // if (this.isDcReturn.value && this.dcReturnId.value != null && this.dcReturnId.value != '') {
            //   this.router.navigate(['../../deliveryChallanReturn'], { relativeTo: this.route });
            //   const activeModal = this.modalService.open(CommonModalComponent, { size: 'lg' });
            //   activeModal.componentInstance.showHide = true;
            //   activeModal.componentInstance.modalHeader = 'Alert';
            //   activeModal.componentInstance.modalContent = 'Export Sales Invoice has been successfully Submitted!! Do you want to Generate the Print of DC Return Memo - No. ' + this.dcReturnId.value + ' ??';
            //   activeModal.componentInstance.oKMessage = 'Print';
            //   activeModal.componentInstance.cancelMessage = 'No';
            //   activeModal.result.then((res) => {
            //     if (res == 'Y') {
            //       this.print();
            //     }
            //   });
            // } else {
            this.handleBack();
            // }
          }, error => {
            this.loading = false;
            this.showSbmtBtn = true;
            log.debug(`Creation error: ${error}`);
            if (error._body) {
              this.errorMsg = error._body;
            } else {
              this.errorMsg = "Internal Server Error!"
            }
          });
        }
      }
    }
    else {




      if (this.exportInvoiceForm.value && this.itemDetailsList.length > 0) {
        this.itemDetails.setValue(this.itemDetailsList);
        this.cityMasterByOriginCountryId.enable();
        if (this.cityMasterByOriginCountryId.value == this.cityMasterByDestCountryId.value) {
          this.showSbmtBtn = true;
          this.cityMasterByOriginCountryId.disable();
          this.loading = false;
          const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
          activeModal.componentInstance.showHide = false;
          activeModal.componentInstance.modalHeader = 'Alert';
          activeModal.componentInstance.modalContent = 'Origin & Destination Country should not be Same!!';
        } else {
          const formValue: any = this.exportInvoiceForm.value;
          this.service.createExportInvoice(formValue).subscribe(resp => {
            if (this.isDcReturn.value && this.dcReturnId.value != null && this.dcReturnId.value != '') {
              this.router.navigate(['../../deliveryChallanReturn'], { relativeTo: this.route });
              this.loading = false;
              const activeModal = this.modalService.open(CommonModalComponent, { size: 'lg' });
              activeModal.componentInstance.showHide = true;
              activeModal.componentInstance.modalHeader = 'Alert';
              activeModal.componentInstance.modalContent = 'Export Sales Invoice has been successfully Submitted!! Do you want to Generate the Print of DC Return Memo - No. ' + this.dcReturnId.value + ' ??';
              activeModal.componentInstance.oKMessage = 'Print';
              activeModal.componentInstance.cancelMessage = 'No';
              activeModal.result.then((res) => {
                if (res == 'Y') {
                  this.print();
                }
              });
            } else {
              this.handleBack();
            }
          }, error => {
            this.loading = false;
            this.showSbmtBtn = true;
            log.debug(`Creation error: ${error}`);
            if (error._body) {
              
              this.errorMsg = error._body;
            } else {
              this.errorMsg = "Internal Server Error!"
            }
          });
        }
      } else {
        this.showSbmtBtn = true;
        this.loading = false;
        const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
        activeModal.componentInstance.showHide = true;
        activeModal.componentInstance.modalHeader = 'Alert';
        activeModal.componentInstance.modalContent = 'Please Add Some Item for Export Sale!!'
      }
    }
  }

  finally() {
    this.isLoading = false;
    this.exportInvoiceForm.markAsPristine();
  }

  handleBack() {
    // TODO: if cancelling then ask to confirn
    this.back.back();
  }

  lgModalShow() {
    this.loading = false;
    const activeModal = this.modalService.open(ExportSaleModal, { size: 'lg' });
    activeModal.componentInstance.modalHeader = 'Export Sales Order Details';
    activeModal.componentInstance.emitService.subscribe((emmitedValue) => {
      if (emmitedValue) {
        this.expDate.setValue(this.dateFormate(new Date()));
        this.categoryMaster.setValue(emmitedValue.categoryMaster);
        if (emmitedValue.status == 'COMPLETED') {
          this.isCompleted.setValue(true);
        } else {
          this.isCompleted.setValue(false);
        }

        this.hierService.getHierById(this.authService.credentials.company).subscribe(da => {

          this.hierService.getHierMasterById(da.hierarchyMaster.hierId).subscribe(res => {
            this.cityMasterByPortOfLoadingId.setValue(res.addressMaster.city);
            this.stockCurr.setValue(res.hierarchyDetailRequestDTO.currencyMasterByStockCurrId);
            this.baseCurr.setValue(res.hierarchyDetailRequestDTO.currencyMasterByCurrId);
            this.currList.forEach(ele => {
              if (ele.currId == this.stockCurr.value) {
                this.stockCurrCode = ele.currCode;
                this.stockCurrName = ele.currName;
              }
              if (ele.currId == this.baseCurr.value) {
                this.baseCurrCode = ele.currCode;
                this.baseCurrName = ele.currName;
              }
            })
            let flag = 0;
            this.exchangeRateList.forEach(res => {                        // If needed, change exchType to 'EX' for Export
              if (res.exchType == 'ST' && res.currencyMasterByToCurrId == this.baseCurr.value
                && res.currencyMasterByFromCurrId == this.stockCurr.value) {
                if (!res.toDate || res.toDate <= this.expDate.value) {
                  this.stockExchRate.setValue(res.exchRate);
                }
                flag = 1;
              }
            });
            if (flag != 1) {
              const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
              activeModal.componentInstance.showHide = false;
              activeModal.componentInstance.modalHeader = 'Alert';
              activeModal.componentInstance.modalContent = 'Please Add Stock Exchange Rate for ' + this.stockCurrName + ' To ' + this.baseCurrName + ' Currency in Custom Exchange Rate Screen!';
            }
          });
        });

        this.service.getExportSalesOrderById(emmitedValue.soNo).subscribe((data: any) => {

          this.doNotCallInvExchRateChngFunctionWhenValueOne = 1;
          this.currencyMaster.setValue(data.soCurrency);
          this.invExchRate.setValue(data.soExchangeRate);
          this.customExchRate.setValue(data.soExchangeRate);
          this.expAdvReal.setValue(data.advReal);

          this.partyService.getAllBankBranchByPartyId(data.partyMasterByPartyId, 'CU').subscribe(partyBranchList => {
            this.partyBankBranchesList = partyBranchList;
          });
          this.itemDetailsList = [];
          data.orderItems.forEach(itm => {
            const orderItem = new AddItemDetails();
            orderItem.lotItemId = itm.lotItemId;
            orderItem.lotId = itm.lotId.lotId;
            orderItem.lotName = itm.lotId.lotName;
            orderItem.itemId = itm.itemId.itemId;
            orderItem.itemName = itm.itemId.itemName;
            orderItem.description = itm.description;
            orderItem.carats = itm.carats;
            if (itm.pieces) {
              orderItem.pieces = itm.pieces;
            } else {
              orderItem.pieces = 0;
            }
            orderItem.stockSellingPrice = itm.stockItemSellingPrice;
            orderItem.stockAmount = parseFloat((itm.amount * 1).toFixed(2));
            orderItem.rate = itm.rate;
            orderItem.tAmount = parseFloat((itm.rate * itm.carats).toFixed(2));
            this.itemDetailsList.push(orderItem);
          });

          this.source.load(this.itemDetailsList);
          this.settings = this.prepareSettings();
          this.ordNo.setValue(data.soId);

          this.partyMasterByPartyId.setValue(data.partyMasterByPartyId);
          if (data.custbank) {
            this.custBankBranchId.setValue(data.custbank);
          }
          this.ourBank.setValue(data.customerDetails.ourBank);
          this.commonMasterByTermsId.setValue(data.customerDetails.bankTnC);
          this.bankCrDays.setValue(data.customerDetails.bcreditDays);
          this.partyDays.setValue(data.customerDetails.cCreditDays);
          this.customerName.setValue(data.partyName);
          if (data.customerDetails.notifier) {
            this.partyMasterByNotifierId.setValue(data.customerDetails.notifier);
          }
          this.cityMasterByOriginCountryId.setValue(data.saleDetails.cityMasterByOriginCountryId);
          this.cityMasterByDestCountryId.setValue(data.saleDetails.cityMasterByFinalDestId);
          this.otherRemark.setValue(data.saleDetails.remark);
          setTimeout(() => {
            this.cbbDueDate.setValue(data.customerDetails.bdueDate);
            this.partyDueDate.setValue(data.customerDetails.cbbDueDate);
            this.notifierNote.setValue(data.customerDetails.notifierNote);
            this.bankerNote.setValue(data.customerDetails.bankerNote);
            this.partyNote.setValue(data.customerDetails.partyNote);
          });

          this.orderAmountBase.setValue(data.orderAmountBase);
          this.orderAmountSTK.setValue(data.orderAmountSTK);
          this.setTimeoutCalcFunc();
          this.onChangeBankExchRate1(this.invExchRate.value);
          this.onChangeBankExchRate2(this.invExchRate.value);
        });
        this.exportInvoiceForm.enable();
        this.btnDisable = true;
        setTimeout(() => {
          this.doNotCallInvExchRateChngFunctionWhenValueOne = 0;
        });
      } else {
        this.exportInvoiceForm.disable();
      }
    });
  }

  getColTotal(colName: string): number {
    let total: number;
    total = 0;
    this.itemDetailsList.forEach(row => {
      total += parseFloat(row[colName]);
    });
    return parseFloat(total.toFixed(3));
  }

  get getTotalAmount(): number {
    return parseFloat((this.getColTotal('stockAmount')).toFixed(2));
  }
  get getTAmount(): number {
    if (this.openingStockInvoice)
      return this.orderAmountSTK.value;
    else
      return parseFloat((this.getColTotal('tAmount')).toFixed(2));
  }
  get avgRate(): number {
    return parseFloat((((this.getTAmount / this.totalCarats) * this.invExchRate.value) / this.stockExchRate.value).toFixed(2));
  }

  get totalCarats(): number {
    return parseFloat((this.getColTotal('carats')).toFixed(3));
  }

  get notProfitSTK(): number {
    if (this.totCDORs.value) {
      if (this.getTotalAmount && this.getTAmount) {
        return parseFloat((((this.getTAmount * this.invExchRate.value) / this.stockExchRate.value) - this.getTotalAmount - (this.brokerageRs.value / this.stockExchRate.value) + (this.totCDORs.value / this.stockExchRate.value)).toFixed(2));
      }
    } else {
      if (this.getTotalAmount && this.getTAmount) {
        return parseFloat((((this.getTAmount * this.invExchRate.value) / this.stockExchRate.value) - this.getTotalAmount - (this.brokerageRs.value / this.stockExchRate.value)).toFixed(2));
      }
    }
  }

  get notProfitPerc(): number {
    return parseFloat((((this.notProfitSTK) / this.getTotalAmount) * 100).toFixed(2));
  }

  onInvExchRateChange(value: any) {
    if (this.doNotCallInvExchRateChngFunctionWhenValueOne != undefined && this.doNotCallInvExchRateChngFunctionWhenValueOne != 1) {
      this.invExchRate.setValue(value);
      this.orderAmountSTK.setValue(parseFloat(((this.getTAmount * this.invExchRate.value) / this.stockExchRate.value).toFixed(2)));
    }
    this.customExchRate.setValue(value);
  }

  onChangeBankExchRate1(value: any) {
    this.bankExchRate1.setValue(parseFloat(value.toString()));
    if (this.bankFcAmt1.value != '') {
      this.bankFcAmt1.setValue(parseFloat(this.bankFcAmt1.value.toString()));
    } else {
      this.bankFcAmt1.setValue(0);
    }
    this.bankRsAmt1.setValue(parseFloat((this.bankFcAmt1.value * value).toFixed(2)));

    this.bankTotValFc.setValue(this.bankFcAmt1.value + this.bankFcAmt2.value);
    this.bankTotValRs.setValue(this.bankRsAmt1.value + this.bankRsAmt2.value);
  }

  onChangeBankExchRate2(value: any) {
    this.bankExchRate2.setValue(parseFloat(value.toString()));
    if (this.bankFcAmt2.value != '') {
      this.bankFcAmt2.setValue(parseFloat(this.bankFcAmt2.value.toString()));
    } else {
      this.bankFcAmt2.setValue(0);
    }
    this.bankRsAmt2.setValue(parseFloat((this.bankFcAmt2.value * value).toFixed(2)));

    this.bankTotValFc.setValue(this.bankFcAmt1.value + this.bankFcAmt2.value);
    this.bankTotValRs.setValue(this.bankRsAmt1.value + this.bankRsAmt2.value);
  }

  onChangeBankFcAmt1(value: any) {
    this.bankFcAmt1.setValue(value);
    this.onChangeBankExchRate1(this.bankExchRate1.value);
  }

  onChangeBankFcAmt2(value: any) {
    this.bankFcAmt2.setValue(value);
    this.onChangeBankExchRate2(this.bankExchRate2.value);
  }

  setTimeoutCalcFunc() {
    this.orderAmountBase.setValue(parseFloat((this.getTAmount * this.invExchRate.value).toFixed(2)));
    this.customTotValFc.setValue(this.getTAmount);
    this.customTotValRs.setValue(this.orderAmountBase.value);

    setTimeout(() => {
      this.sellingAmount = this.getTotalAmount;
      this.ordAmount = this.getTAmount;
      this.totSellingAmt = parseFloat((this.sellingAmount / this.totalCarats).toFixed(2));
      this.notionalSTK = this.notProfitSTK;
      this.profitSTK.setValue(this.notProfitSTK);
      this.notionalBase = parseFloat((this.notionalSTK * this.stockExchRate.value).toFixed(2));
      this.profitBase.setValue(this.notionalBase);
      this.notPerc = this.notProfitPerc;
    });
  }

  getTaxableAmountAndNetAmountFc() {
    let amountCDOFc: number = 0;
    let amountFICDOFc: number = 0;

    if (this.commissionFc.value) {
      amountCDOFc = amountCDOFc + this.commissionFc.value;
    }

    if (this.discountFc.value) {
      amountCDOFc = amountCDOFc + this.discountFc.value;
    }

    if (this.otherDedFc.value) {
      amountCDOFc = amountCDOFc + this.otherDedFc.value;
    }

    amountCDOFc = parseFloat(amountCDOFc.toFixed(2));

    if (this.freightFc.value || this.insuranceFc.value) {
      let fritAmtFc: number, insurAmtFc: number;
      if (this.freightFc.value) {
        fritAmtFc = parseFloat(this.freightFc.value.toFixed(2));
      } else {
        fritAmtFc = 0;
      }
      if (this.insuranceFc.value) {
        insurAmtFc = parseFloat(this.insuranceFc.value.toFixed(2));
      } else {
        insurAmtFc = 0;
      }
      amountFICDOFc = amountCDOFc + fritAmtFc + insurAmtFc;
    } else {
      amountFICDOFc = amountCDOFc;
    }
    //  if(this.brokerageAmt.value){
    //    amount = amount - this.brokerageAmt.value;
    //  }

    this.totCDOFc.setValue(parseFloat((amountCDOFc).toFixed(2)));
    this.totFICDOFc.setValue(parseFloat((amountFICDOFc).toFixed(2)));
  }

  getTaxableAmountAndNetAmount() {    // For Rupees or BaseCurrency
    let amountCDO: number = 0;
    let amountFICDO: number = 0;
    if (this.orderAmountBase.value) {
      amountCDO = amountCDO + this.orderAmountBase.value;
    }

    if (this.commissionRs.value) {
      amountCDO = amountCDO + this.commissionRs.value;
    }

    if (this.discountRs.value) {
      amountCDO = amountCDO + this.discountRs.value;
    }

    if (this.otherDedRs.value) {
      amountCDO = amountCDO + this.otherDedRs.value;
    }

    amountCDO = parseFloat(amountCDO.toFixed(2));

    if (this.freightRs.value || this.insuranceRs.value) {
      let fritAmt: number, insurAmt: number;
      if (this.freightRs.value) {
        fritAmt = parseFloat(this.freightRs.value.toFixed(2));
      } else {
        fritAmt = 0;
      }
      if (this.insuranceRs.value) {
        insurAmt = parseFloat(this.insuranceRs.value.toFixed(2));
      } else {
        insurAmt = 0;
      }
      amountFICDO = amountCDO + fritAmt + insurAmt;
    } else {
      amountFICDO = amountCDO;
    }
    //  if(this.brokerageAmt.value){
    //    amount = amount - this.brokerageAmt.value;
    //  }

    this.fobAmount.setValue(amountCDO);
    this.totCDORs.setValue(parseFloat((amountCDO - (this.orderAmountBase.value * 1)).toFixed(2)));
    this.totFICDORs.setValue(parseFloat((amountFICDO - (this.orderAmountBase.value * 1)).toFixed(2)));
  }

  private initForm() {
    this.exportInvoiceForm = this.fb.group({
      'expId': [''],
      'commonMasterByPrefixId': ['', Validators.compose([Validators.required])],
      'commonMasterBySuffixId': ['', Validators.compose([Validators.required])],
      'customerName': ['', Validators.compose([Validators.required])],
      'partyMasterByPartyId': [''],
      'expNo': [''],
      'expDate': ['', Validators.compose([Validators.required])],
      'categoryMaster': ['', Validators.compose([Validators.required])],
      'expAdvReal': [''],
      'partyNote': [''],
      'ordNo': [''],
      'brokerId': [''],
      'ourBank': ['', Validators.compose([Validators.required])],
      'commonMasterByTermsId': ['', Validators.compose([Validators.required])],
      'bankCrDays': ['', Validators.compose([Validators.required])],
      'cbbDueDate': [''],
      'partyDays': ['', Validators.compose([Validators.required])],
      'partyDueDate': [''],
      'stockCurr': [''],
      'stockExchRate': [''],
      'baseCurr': [''],
      'currencyMaster': ['', Validators.compose([Validators.required])],
      'invExchRate': ['', Validators.compose([Validators.required])],
      'isCompleted': [''],
      'provisional': [''],
      'custBankBranchId': [''],
      'bankerNote': [''],
      'partyMasterByNotifierId': [''],
      'notifierNote': [''],
      'vessel': [''],
      'vesselRemark': [''],
      'cityMasterByPortOfLoadingId': [''],
      'cityMasterByPortOfDischargeId': [''],
      'cityMasterByDestCountryId': ['', Validators.compose([Validators.required])],
      'cityMasterByOriginCountryId': [''],
      'customExchRate': [''],
      'customTotValFc': [''],
      'customTotValRs': [''],
      'bankExchRate1': [''],
      'bankFcAmt1': [''],
      'bankRsAmt1': [''],
      'bankExchRate2': [''],
      'bankFcAmt2': [''],
      'bankRsAmt2': [''],
      'bankTotValFc': [''],
      'bankTotValRs': [''],
      'otherRemark': [''],
      // 'igst': [''],
      // 'cgst': [''],
      // 'sgst': [''],
      // 'totGSTPerc': [''],
      // 'igstAmount': [''],
      // 'cgstAmount': [''],
      // 'sgstAmount': [''],
      // 'totGSTAmount': [''],
      'freightRs': [''],
      'insuranceRs': [''],
      'freightFc': [''],
      'insuranceFc': [''],
      'commissionPerc': [''],
      'discountPerc': [''],
      'odedPerc': [''],
      'commissionRs': [''],
      'discountRs': [''],
      'otherDedRs': [''],
      'commissionFc': [''],
      'discountFc': [''],
      'otherDedFc': [''],
      'totCDORs': [''],
      'totCDOFc': [''],
      'totFICDORs': [''],
      'totFICDOFc': [''],
      'brokeragePerc': [''],
      'brokerageRs': [''],
      'brokerageFc': [''],
      'lotCtrl': ['', Validators.compose([Validators.required])],
      'item': [''],
      'rateCtrl': [''],
      'piecesCtrl': [''],
      'caratsCtrl': [''],
      'descCtrl': [''],
      // 'totValue': [''],
      'fobAmount': [''],
      'totalWgtCts': [''],
      'netWgtKg': [''],
      'boxWgt': [''],
      'grossWgt': [''],
      'remark': [''],
      'isDcReturn': [''],
      'dcReturnId': [''],
      'orderAmountSTK': [''],
      'orderAmountBase': [''],
      'profitSTK': [''],
      'profitBase': [''],
      'itemDetails': [''],
      'itemNameSearch': [''],
      'osi': ['']
    });

    this.commonMasterByPrefixId = this.exportInvoiceForm.controls['commonMasterByPrefixId'];
    this.commonMasterBySuffixId = this.exportInvoiceForm.controls['commonMasterBySuffixId'];
    this.partyMasterByPartyId = this.exportInvoiceForm.controls['partyMasterByPartyId'];
    this.customerName = this.exportInvoiceForm.controls['customerName'];
    this.expNo = this.exportInvoiceForm.controls['expNo'];
    this.expDate = this.exportInvoiceForm.controls['expDate'];
    this.categoryMaster = this.exportInvoiceForm.controls['categoryMaster'];
    this.expAdvReal = this.exportInvoiceForm.controls['expAdvReal'];
    this.partyNote = this.exportInvoiceForm.controls['partyNote'];
    this.ordNo = this.exportInvoiceForm.controls['ordNo'];
    this.brokerId = this.exportInvoiceForm.controls['brokerId'];
    this.ourBank = this.exportInvoiceForm.controls['ourBank'];
    this.commonMasterByTermsId = this.exportInvoiceForm.controls['commonMasterByTermsId'];
    this.bankCrDays = this.exportInvoiceForm.controls['bankCrDays'];
    this.cbbDueDate = this.exportInvoiceForm.controls['cbbDueDate'];
    this.partyDays = this.exportInvoiceForm.controls['partyDays'];
    this.partyDueDate = this.exportInvoiceForm.controls['partyDueDate'];
    this.stockCurr = this.exportInvoiceForm.controls['stockCurr'];
    this.stockExchRate = this.exportInvoiceForm.controls['stockExchRate'];
    this.baseCurr = this.exportInvoiceForm.controls['baseCurr'];
    this.currencyMaster = this.exportInvoiceForm.controls['currencyMaster'];
    this.invExchRate = this.exportInvoiceForm.controls['invExchRate'];
    this.isCompleted = this.exportInvoiceForm.controls['isCompleted'];
    this.provisional = this.exportInvoiceForm.controls['provisional'];
    this.custBankBranchId = this.exportInvoiceForm.controls['custBankBranchId'];
    this.bankerNote = this.exportInvoiceForm.controls['bankerNote'];
    this.partyMasterByNotifierId = this.exportInvoiceForm.controls['partyMasterByNotifierId'];
    this.notifierNote = this.exportInvoiceForm.controls['notifierNote'];
    this.vessel = this.exportInvoiceForm.controls['vessel'];
    this.vesselRemark = this.exportInvoiceForm.controls['vesselRemark'];
    this.cityMasterByPortOfLoadingId = this.exportInvoiceForm.controls['cityMasterByPortOfLoadingId'];
    this.cityMasterByPortOfDischargeId = this.exportInvoiceForm.controls['cityMasterByPortOfDischargeId'];
    this.cityMasterByDestCountryId = this.exportInvoiceForm.controls['cityMasterByDestCountryId'];
    this.cityMasterByOriginCountryId = this.exportInvoiceForm.controls['cityMasterByOriginCountryId'];
    this.customExchRate = this.exportInvoiceForm.controls['customExchRate'];
    this.customTotValFc = this.exportInvoiceForm.controls['customTotValFc'];
    this.customTotValRs = this.exportInvoiceForm.controls['customTotValRs'];
    this.bankExchRate1 = this.exportInvoiceForm.controls['bankExchRate1'];
    this.bankFcAmt1 = this.exportInvoiceForm.controls['bankFcAmt1'];
    this.bankRsAmt1 = this.exportInvoiceForm.controls['bankRsAmt1'];
    this.bankExchRate2 = this.exportInvoiceForm.controls['bankExchRate2'];
    this.bankFcAmt2 = this.exportInvoiceForm.controls['bankFcAmt2'];
    this.bankRsAmt2 = this.exportInvoiceForm.controls['bankRsAmt2'];
    this.bankTotValFc = this.exportInvoiceForm.controls['bankTotValFc'];
    this.bankTotValRs = this.exportInvoiceForm.controls['bankTotValRs'];
    this.otherRemark = this.exportInvoiceForm.controls['otherRemark'];
    // this.igst = this.exportInvoiceForm.controls['igst'];
    // this.cgst = this.exportInvoiceForm.controls['cgst'];
    // this.sgst = this.exportInvoiceForm.controls['sgst'];
    // this.totGSTPerc = this.exportInvoiceForm.controls['totGSTPerc'];
    // this.igstAmount = this.exportInvoiceForm.controls['igstAmount'];
    // this.cgstAmount = this.exportInvoiceForm.controls['cgstAmount'];
    // this.sgstAmount = this.exportInvoiceForm.controls['sgstAmount'];
    // this.totGSTAmount = this.exportInvoiceForm.controls['totGSTAmount'];

    this.freightRs = this.exportInvoiceForm.controls['freightRs'];
    this.insuranceRs = this.exportInvoiceForm.controls['insuranceRs'];
    this.freightFc = this.exportInvoiceForm.controls['freightFc'];
    this.insuranceFc = this.exportInvoiceForm.controls['insuranceFc'];
    this.commissionPerc = this.exportInvoiceForm.controls['commissionPerc'];
    this.discountPerc = this.exportInvoiceForm.controls['discountPerc'];
    this.odedPerc = this.exportInvoiceForm.controls['odedPerc'];
    this.commissionRs = this.exportInvoiceForm.controls['commissionRs'];
    this.discountRs = this.exportInvoiceForm.controls['discountRs'];
    this.otherDedRs = this.exportInvoiceForm.controls['otherDedRs'];
    this.commissionFc = this.exportInvoiceForm.controls['commissionFc'];
    this.discountFc = this.exportInvoiceForm.controls['discountFc'];
    this.otherDedFc = this.exportInvoiceForm.controls['otherDedFc'];
    this.totCDORs = this.exportInvoiceForm.controls['totCDORs'];
    this.totCDOFc = this.exportInvoiceForm.controls['totCDOFc'];
    this.totFICDORs = this.exportInvoiceForm.controls['totFICDORs'];
    this.totFICDOFc = this.exportInvoiceForm.controls['totFICDOFc'];
    this.brokeragePerc = this.exportInvoiceForm.controls['brokeragePerc'];
    this.brokerageRs = this.exportInvoiceForm.controls['brokerageRs'];
    this.brokerageFc = this.exportInvoiceForm.controls['brokerageFc'];
    this.lotCtrl = this.exportInvoiceForm.controls['lotCtrl'];
    this.item = this.exportInvoiceForm.controls['item'];
    this.rateCtrl = this.exportInvoiceForm.controls['rateCtrl'];
    this.piecesCtrl = this.exportInvoiceForm.controls['piecesCtrl'];
    this.caratsCtrl = this.exportInvoiceForm.controls['caratsCtrl'];
    this.descCtrl = this.exportInvoiceForm.controls['descCtrl'];
    // this.totValue = this.exportInvoiceForm.controls['totValue'];
    this.fobAmount = this.exportInvoiceForm.controls['fobAmount'];
    this.totalWgtCts = this.exportInvoiceForm.controls['totalWgtCts'];
    this.netWgtKg = this.exportInvoiceForm.controls['netWgtKg'];
    this.boxWgt = this.exportInvoiceForm.controls['boxWgt'];
    this.grossWgt = this.exportInvoiceForm.controls['grossWgt'];
    this.remark = this.exportInvoiceForm.controls['remark'];
    this.isDcReturn = this.exportInvoiceForm.controls['isDcReturn'];
    this.dcReturnId = this.exportInvoiceForm.controls['dcReturnId'];
    this.orderAmountSTK = this.exportInvoiceForm.controls['orderAmountSTK'];
    this.orderAmountBase = this.exportInvoiceForm.controls['orderAmountBase'];
    this.profitSTK = this.exportInvoiceForm.controls['profitSTK'];
    this.profitBase = this.exportInvoiceForm.controls['profitBase'];
    this.itemDetails = this.exportInvoiceForm.controls['itemDetails'];
    this.itemNameSearch = this.exportInvoiceForm.controls['itemNameSearch'];
    this.osi = this.exportInvoiceForm.controls['osi'];


    this.lotCtrl.valueChanges.subscribe(val => {
      if (val) {
        this.itemNameSearch.reset();
        this.lotItems = [];
        this.lotItemService.getAllLotItemByLotId(val.lotId).subscribe(res => {
          this.lotItemList = res;
          let i = 0;
          res.forEach(element => {
            this.lotItems[i] = element.itemMaster.itemName;
            i++;
          });
        })
      }
    });

    this.itemNameSearch.valueChanges.subscribe(val => {
      if (val) {
        this.lotItemList.find(ele => {
          if (ele.itemMaster.itemName == val) {
            this.item.setValue(ele);
            return true;
          }
        })
      }
    })

    this.partyMasterByPartyId.valueChanges.subscribe(data => {
      if (data) {
        this.customerPrint = data;
        this.bankerNote.reset();
        this.partyService.getPartyById(data).subscribe(detail => {
          this.partyNote.setValue(detail.remarks);
          setTimeout(() => {
            if (this.custBankBranchId.value) {
              const val = detail.partyBankBranchList.find(d => {
                if (d.contactBankBranchId == this.custBankBranchId.value) {
                  return true;
                }
              })
              if (val) {
                this.bankerNote.setValue(val.bankerNote);
              }
            }
          });
        });

        this.partyBankBranchesList = [];
        this.partyService.getAllBankBranchByPartyId(data, 'CU').subscribe(partyBranchList => {
          let i = 0;
          partyBranchList.forEach(element => {
            this.partyBankBranchesList[i] = element;
            i++;
          });
        });
      }
    });

    this.partyMasterByNotifierId.valueChanges.subscribe(data => {
      if (data) {
        this.partyService.getPartyById(data).subscribe(detail => {
          this.notifierNote.setValue(detail.remarks);
        });
      }
    });

    this.orderAmountSTK.valueChanges.subscribe(ele => {
      if (this.openingStockInvoice) {
        this.orderAmountBase.setValue(ele * this.stockExchRate.value);
      }
      this.setTimeoutCalcFunc();
      this.getTaxableAmountAndNetAmount();
      this.getTaxableAmountAndNetAmountFc();
      this.commissionPerc.setValue(this.commissionPerc.value);
      this.discountPerc.setValue(this.discountPerc.value);
      this.odedPerc.setValue(this.odedPerc.value);
      this.brokeragePerc.setValue(this.brokeragePerc.value);
      this.setTimeoutCalcFunc();
      this.getTaxableAmountAndNetAmount();
      this.getTaxableAmountAndNetAmountFc();
    });

    this.currencyMaster.valueChanges.subscribe(data => {

      const curr = this.currList.find(i => {
        if (i.currId == data) {
          return true;
        }
      })
      if (curr) {
        this.invCurrName = curr.currName;
        this.invCurrCode = curr.currCode;
      }
      if (this.currencyMaster.value) {
        if (this.baseCurr.value == this.currencyMaster.value) {
          this.invExchRate.setValue(1);
          this.onInvExchRateChange(this.invExchRate.value);
        } else {
          let check = 0;
          this.exchangeRateList.forEach(res => {
            if (res.exchType == 'ST' && res.currencyMasterByToCurrId == this.baseCurr.value
              && res.currencyMasterByFromCurrId == this.currencyMaster.value) {
              if (!res.toDate || res.toDate <= this.expDate.value) {
                this.invExchRate.setValue(res.exchRate);
                this.onInvExchRateChange(this.invExchRate.value);
              }
              check = 1;
            }
          });
          if (check != 1) {
            if (!this.baseCurr && !this.stockCurr) {
              const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
              activeModal.componentInstance.showHide = false;
              activeModal.componentInstance.modalHeader = 'Alert';
              activeModal.componentInstance.modalContent = 'Please Add Invoice Exchange Rate or Change your Currency!';
            }
          }
        }
      }
    });

    this.categoryMaster.valueChanges.subscribe(data => {
      this.lotCtrl.setValue(this.lotList[0]);
      // this.item.reset();
    });

    // this.lotCtrl.valueChanges.subscribe( data => {
    //   if (data) {
    //     this.item.reset();
    //     if(this.categoryMaster.value) {
    //       this.lotItemService.getAllLotItemByLotId(data.lotId).subscribe( dato => {
    //         this.lotItemList = [];
    //         if(dato) {
    //           dato.forEach(element => {
    //             if(this.categoryMaster.value == element.itemMaster.categoryMaster.catId) {
    //               this.lotItemList.push(element);
    //             }
    //           });
    //           if (this.lotItemList.length === 0) {
    //             const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
    //             activeModal.componentInstance.showHide = false;
    //             activeModal.componentInstance.modalHeader = 'Alert';
    //             activeModal.componentInstance.modalContent = 'No items belongs to selected Category & Lot!';
    //           }
    //         } else {
    //           const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
    //           activeModal.componentInstance.showHide = false;
    //           activeModal.componentInstance.modalHeader = 'Alert';
    //           activeModal.componentInstance.modalContent = 'No items in selected Lot!';
    //         }
    //       });
    //     }
    //   }
    // });


    this.commonMasterByTermsId.valueChanges.subscribe(val => {
      if (val) {
        if (isNumber(this.bankCrDays.value)) {
          this.bankCrDays.setValue(this.bankCrDays.value);
        } else {
          this.bankCrDays.setValue(0);
        }
        if (isNumber(this.partyDays.value)) {
          this.partyDays.setValue(this.partyDays.value);
        } else {
          this.partyDays.setValue(0);
        }
      }
    });

    this.bankCrDays.valueChanges.subscribe(val => {
      if (this.termsList.length > 0) {
        this.termsList.forEach(tr => {

          if (this.commonMasterByTermsId.value == tr.id) {
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

    this.partyDays.valueChanges.subscribe(val => {
      if (this.termsList.length > 0) {
        this.termsList.forEach(tr => {

          if (this.commonMasterByTermsId.value == tr.id) {
            const crDays = parseInt(tr.name.split(' ')[0]);
            const daysTotal = crDays + val;
            const milis = 86400000 * daysTotal + (new Date()).getTime();
            const date = new Date(milis);
            const dd = date.getDate();
            const mm = date.getMonth() + 1; // January is 0!
            const yyyy = date.getFullYear();
            this.partyDueDate.setValue((dd < 10 ? '0' + dd : dd) + '-' + (mm < 10 ? '0' + mm : mm) + '-' + yyyy);
          }
        })
      }
    });

    this.freightRs.valueChanges.subscribe(val => {
      if (this.freightRs.value) {
        this.freightFc.setValue(parseFloat((val / this.invExchRate.value).toFixed(2)));
      } else {
        this.freightFc.setValue(0);
      }
      this.setTimeoutCalcFunc();
      this.getTaxableAmountAndNetAmount();
      this.getTaxableAmountAndNetAmountFc();

    })

    this.insuranceRs.valueChanges.subscribe(val => {
      if (this.insuranceRs.value) {
        this.insuranceFc.setValue(parseFloat((val / this.invExchRate.value).toFixed(2)));
      } else {
        this.insuranceFc.setValue(0);
      }
      this.setTimeoutCalcFunc();
      this.getTaxableAmountAndNetAmount();
      this.getTaxableAmountAndNetAmountFc();

    })

    this.commissionPerc.valueChanges.subscribe(val => {
      if (this.commissionPerc.value) {
        if (isNumber(this.orderAmountBase.value)) {
          const commissionAmt: number = parseFloat((parseFloat(this.orderAmountBase.value.toString()) * parseFloat(val) / 100).toFixed(2));
          this.commissionRs.setValue(commissionAmt);

          const commissionAmtFc: number = parseFloat((parseFloat(this.getTAmount.toString()) * parseFloat(val) / 100).toFixed(2));
          this.commissionFc.setValue(commissionAmtFc);
        } else {
          this.commissionRs.setValue(0);
          this.commissionFc.setValue(0);
        }
      } else {
        this.commissionRs.setValue(0);
        this.commissionFc.setValue(0);
      }
      if (this.discountPerc.value) {
        this.discountPerc.setValue(this.discountPerc.value);
      }
      this.setTimeoutCalcFunc();
      this.getTaxableAmountAndNetAmount();
      this.getTaxableAmountAndNetAmountFc();
    })

    this.discountPerc.valueChanges.subscribe(val => {
      if (this.discountPerc.value) {
        if (isNumber(this.orderAmountBase.value) && isNumber(this.commissionRs.value)) {
          const grossAmtAfterCommission = parseFloat(this.orderAmountBase.value.toString()) + parseFloat(this.commissionRs.value.toString());
          const discountAmt: number = parseFloat((grossAmtAfterCommission * parseFloat(val) / 100).toFixed(2));
          this.discountRs.setValue(discountAmt);

          const grossAmtAfterCommissionFc = parseFloat(this.getTAmount.toString()) + parseFloat(this.commissionFc.value.toString());
          const discountAmtFc: number = parseFloat((grossAmtAfterCommissionFc * parseFloat(val) / 100).toFixed(2));
          this.discountFc.setValue(discountAmtFc);
        } else {
          this.discountRs.setValue(0);
          this.discountFc.setValue(0);
        }
      } else {
        this.discountRs.setValue(0);
        this.discountFc.setValue(0);
      }
      if (this.odedPerc.value) {
        this.odedPerc.setValue(this.odedPerc.value);
      }
      this.setTimeoutCalcFunc();
      this.getTaxableAmountAndNetAmount();
      this.getTaxableAmountAndNetAmountFc();
    })

    this.odedPerc.valueChanges.subscribe(val => {
      if (this.odedPerc.value) {
        if (isNumber(this.orderAmountBase.value) && isNumber(this.discountRs.value) && isNumber(this.commissionRs.value)) {
          const grossAmtAfterDiscount = parseFloat(this.orderAmountBase.value.toString()) + parseFloat(this.discountRs.value.toString()) + parseFloat(this.commissionRs.value.toString());
          const value: number = parseFloat((grossAmtAfterDiscount * parseFloat(val) / 100).toFixed(2));
          this.otherDedRs.setValue(value);

          const grossAmtAfterDiscountFc = parseFloat(this.getTAmount.toString()) + parseFloat(this.discountFc.value.toString()) + parseFloat(this.commissionFc.value.toString());
          const valueFc: number = parseFloat((grossAmtAfterDiscountFc * parseFloat(val) / 100).toFixed(2));
          this.otherDedFc.setValue(valueFc);
        } else {
          this.otherDedRs.setValue(0);
          this.otherDedFc.setValue(0);
        }
      } else {
        this.otherDedRs.setValue(0);
        this.otherDedFc.setValue(0);
      }
      if (this.brokeragePerc.value) {
        this.brokeragePerc.setValue(this.brokeragePerc.value);
      }
      this.setTimeoutCalcFunc();
      this.getTaxableAmountAndNetAmount();
      this.getTaxableAmountAndNetAmountFc();
    })

    this.brokeragePerc.valueChanges.subscribe(val => {
      if (this.brokeragePerc.value) {
        if (isNumber(this.orderAmountBase.value) && isNumber(this.discountRs.value) && isNumber(this.commissionRs.value) && isNumber(this.otherDedRs.value)) {
          const grossAmtAfterOtherDed = parseFloat(this.orderAmountBase.value.toString()) + parseFloat(this.discountRs.value.toString()) + parseFloat(this.commissionRs.value.toString()) + parseFloat(this.otherDedRs.value.toString());
          const value: number = parseFloat((grossAmtAfterOtherDed * parseFloat(val) / 100).toFixed(2));
          this.brokerageRs.setValue(value);

          const grossAmtAfterOtherDedFc = parseFloat(this.getTAmount.toString()) + parseFloat(this.discountFc.value.toString()) + parseFloat(this.commissionFc.value.toString()) + parseFloat(this.otherDedFc.value.toString());
          const valueFc: number = parseFloat((grossAmtAfterOtherDedFc * parseFloat(val) / 100).toFixed(2));
          this.brokerageFc.setValue(valueFc);
        } else {
          this.brokerageRs.setValue(0);
          this.brokerageFc.setValue(0);
        }
      } else {
        this.brokerageRs.setValue(0);
        this.brokerageFc.setValue(0);
      }
      this.setTimeoutCalcFunc();
      this.getTaxableAmountAndNetAmount();
      this.getTaxableAmountAndNetAmountFc();
    })

    this.totalWgtCts.valueChanges.subscribe(val => {
      if (this.totalWgtCts.value) {
        this.netWgtKg.setValue(parseFloat((this.totalWgtCts.value * 0.0002).toFixed(4)));
      } else {
        this.netWgtKg.setValue(0);
      }
    });

    this.netWgtKg.valueChanges.subscribe(val => {
      if (this.netWgtKg.value) {
        if (this.boxWgt.value) {
          this.grossWgt.setValue(parseFloat((this.netWgtKg.value + this.boxWgt.value).toFixed(4)));
        } else {
          this.grossWgt.setValue(this.netWgtKg.value + 0);
        }
      } else {
        this.grossWgt.setValue(this.boxWgt.value + 0);
      }
    });

    this.boxWgt.valueChanges.subscribe(val => {
      if (this.boxWgt.value) {
        if (this.netWgtKg.value) {
          this.grossWgt.setValue(parseFloat((this.netWgtKg.value + this.boxWgt.value).toFixed(4)));
        } else {
          this.grossWgt.setValue(this.boxWgt.value + 0);
        }
      } else {
        this.grossWgt.setValue(this.netWgtKg.value + 0);
      }
    });


  }

  validateRequiredField() {
    this.errorMsg = null;

    if (!this.commonMasterByPrefixId.value) {
      this.loading = false;
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = false;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Please select Prefix!';
      this.errorMsg = "Please select prefix."
      return;
    }

    if (!this.commonMasterBySuffixId.value) {
      this.loading = false;
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = false;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Please select suffix!';
      this.errorMsg = "Please select suffix."
      return;
    }

    if (!this.categoryMaster.value) {
      this.loading = false;
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = false;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Please select Category!';
      this.errorMsg = "Please select category."
      return;
    }

    if (!this.ourBank.value) {
      this.loading = false;
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = false;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Please Select Our Bank!';
      this.errorMsg = "Please Select Our Bank"
      return;
    }

    if(!this.partyMasterByPartyId.value) {
      this.loading = false;
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = false;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Please Select Customer!';
      this.errorMsg = "Please Select Customer"
      return;
    }
    if(!this.currencyMaster.value) {
      this.loading = false;
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = false;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Please Select Invoice Currency!';
      this.errorMsg = "Please Select Invoice Currency"
      return;
    }

    

    if (!this.commonMasterByTermsId.value) {
      this.loading = false;
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = false;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Please Select Terms & Condition!';
      this.errorMsg = "Please Select Terms & Condition"
      return;
    }

    if (!isNumber(this.bankCrDays.value)) {
      this.loading = false;
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = false;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Enter Bank Credit Days!';
      this.errorMsg = "Enter Bank Credit days."
      return;
    }

    if (!isNumber(this.partyDays.value)) {
      this.loading = false;
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = false;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Enter Customer Credit Days!';
      this.errorMsg = "Enter Customer Credit days."
      return;
    }

    if (!this.cityMasterByOriginCountryId.value) {
      this.loading = false;
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = false;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Please select Origin Country!';
      this.errorMsg = "Please select Origin Country."
      return;
    }
    

    if (!this.cityMasterByDestCountryId.value) {
      this.loading = false;
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = false;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Please select Final Destination Country!';
      this.errorMsg = "Please select Final Destination Country."
      return;
    }

    if (this.orderAmountSTK.value <= 0) {
      this.loading = false;
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = false;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Gross Amount can not be zero or negative!';
      this.errorMsg = "Order Amount can not be zero or negative."
      return;
    }

  }
}
