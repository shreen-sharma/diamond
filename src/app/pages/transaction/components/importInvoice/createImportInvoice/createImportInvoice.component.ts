import { FormGroup, AbstractControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Component, Pipe, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { AuthenticationService } from '../../../../../core/authentication/authentication.service';
import { Logger } from '../../../../../core/logger.service';
import { Location } from '@angular/common';
import { ImportInvoiceService } from '../importInvoice.service';
import { LotItemCreationService } from '../../../../stockManagement/components/lotItemCreation/index';
import { Observable } from 'rxjs/Observable';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
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
import { ImportInvoiceModal } from '../createImportInvoice/importInvoice-modal/importInvoice-modal.component';
import { ZoneEntryService } from '../../../../masters/components/zoneEntry/zoneEntry.service';
import { PrintExportComponent } from '../../../../../shared/print-export/print-export.component';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

const log = new Logger('createImportInvoice');

class Item {
  itemId: number;
  amount: number;
  carats: number;
  itemName: string;
  itemDesc: string;
  lotItemId: number;
  lotId: number;
  lotName: string;
  sellingPrice: number;
  pieces: number;
  rate: number;
  poDetailId: number;
  tAmount: number;
}

class ItemTab1 {
  description: string;
  carats: number;
  rate: number;
  amount: number;
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
  selector: 'create-ImportInvoice',
  templateUrl: './createImportInvoice.html',
  styleUrls: ['./createImportInvoice.scss']
})

export class CreateImportInvoice implements OnInit {

  @ViewChild(NgbTabset) ngbTabset: NgbTabset;

  public itemNameSearch: AbstractControl;
  lotItems: any[] = [];

  search = (text$: Observable<string>) =>
    text$
      .debounceTime(200)
      .distinctUntilChanged()
      .map(term => term.length < 1 ? []
        : this.lotItems.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10));


  notionalProfit: number;
  notPerc: number;
  totCaratsTab2: number;
  totTAmount: number;
  totSellAmountTab2: number;
  doNotCallInvExchRateChngFunctionWhenValueOne: number;
  changedCurrstat: number;
  invCurrName: any;
  invCurrCode: any;
  stockCurrName: any;
  stockCurrCode: any;
  baseCurrCode: any;
  selectedCurr: any;
  purchaseOrderItems: ItemTab1[] = []
  settings: any;
  setting: any;
  source: LocalDataSource = new LocalDataSource();
  sourceTab1: LocalDataSource = new LocalDataSource();
  totCarats: any;
  totAmt: number;
  wtAvgRate: number;
  lotList: any[] = [];
  lotItemList: any[] = [];
  catItemList: any[] = [];
  exchRateVal: number;
  stockCurrVsInvCurr: number;
  baseCurrName: any;
  isViewMode: boolean;
  showSbmtBtn: boolean = true;
  igAmount: Number;
  cgAmount: Number;
  sgAmount: Number;
  loading: boolean = false;

  importInvoiceIdParam: string;
  pageTitle = 'Create Import Purchase Invoice';
  error: string = null;
  createImportInvoiceForm: FormGroup;

  errorMsg: string = null;
  selectPo: boolean = false;
  invoiceId: number;
  party: any;
  partyBankBranches: any[] = [];
  bankList: any[];
  grossAmount: number;
  currList: any[] = [];
  exchangeRateList: any[] = [];
  trco: any[] = [];
  catMasterList: any[] = [];
  itemDetails: Item[] = [];
  calItemDetails: Item[] = [];
  notifierList: any[] = [];
  tolGrossAmt: number;
  invoicePrefixList: any[] = [];
  invoiceSuffixList: any[] = [];
  brokerList: any[] = [];
  igstAmountRs: number;
  cgstAmountRs: number;
  sgstAmountRs: number;
  totalGrossAmountRs: number;
  totalTaxAmountRs: number;
  totAmountRs: number;
  netAmountRs: number;
  countryList: any[] = [];
  cityList: any[] = [];
  openingStockInvoice: boolean = false;
  importInvoiceForm: FormGroup;
  customerList: any[] = [];
  public prefix: AbstractControl;
  public poId: AbstractControl;
  public invoiceNo: AbstractControl; // invoice no
  public suffix: AbstractControl;
  public invoiceDate: AbstractControl;
  public category: AbstractControl;
  public supplier: AbstractControl;
  public suppBillDate: AbstractControl;
  public brokerId: AbstractControl;
  public poNo: AbstractControl; // supplier order no
  public sCreditDays: AbstractControl;
  public sDueDate: AbstractControl;
  public bankId: AbstractControl;
  public bankTrCo: AbstractControl;
  public currencyId: AbstractControl;
  public bCreditDays: AbstractControl;
  public bDueDate: AbstractControl;
  public totalGrossAmount: AbstractControl;
  public isCompleted: AbstractControl;
  public stockCurr: AbstractControl;
  public baseCurr: AbstractControl;
  public invExchRate: AbstractControl;
  public totalGrossAmountSTK: AbstractControl;

  public suppBankBranchId: AbstractControl;
  public suppBankerNote: AbstractControl;
  public stockExchRate: AbstractControl;

  public notifier: AbstractControl;
  public notifierNote: AbstractControl;
  public importerRefNo: AbstractControl;
  public othRefNo: AbstractControl;
  public orgCountry: AbstractControl;
  public portDisChrg: AbstractControl;

  public igst: AbstractControl;
  public cgst: AbstractControl;
  public sgst: AbstractControl;
  public tot: AbstractControl;
  public igstAmount: AbstractControl;
  public cgstAmount: AbstractControl;
  public sgstAmount: AbstractControl;
  public totAmount: AbstractControl
  public freight: AbstractControl;
  public insurance: AbstractControl;
  public commission: AbstractControl;
  public discount: AbstractControl;
  public oded: AbstractControl;
  public stockItems: AbstractControl;
  public importItems: AbstractControl;
  public brokerage: AbstractControl;
  public brok: AbstractControl;

  public netAmount: AbstractControl;
  public totalWgtCts: AbstractControl;
  public netWgtKg: AbstractControl;
  public boxWgt: AbstractControl;
  public grossWgt: AbstractControl;
  public remark: AbstractControl;
  public totalTaxAmount: AbstractControl;
  public otherDed: AbstractControl;
  public dsc: AbstractControl;
  public comm: AbstractControl;
  public itemDesc: AbstractControl;
  public carets: AbstractControl;
  public rate: AbstractControl;
  public lotCtrl: AbstractControl;
  public item: AbstractControl;
  public descCtrl: AbstractControl;
  public piecesCtrl: AbstractControl;
  public caratsCtrl: AbstractControl;
  public supplierId: AbstractControl;
  public provitionalStatus: AbstractControl;         // For Provision
  public totCDO: AbstractControl;         // For total of Comm, Dsc & OtherDed (CDO)
  public totTaxableAmt: AbstractControl;         // Total Item Amt - totCDO amt in BaseCurr
  public kattiDifference: AbstractControl;
  public suppNote: AbstractControl;
  public profitBase: AbstractControl;
  public profitSTK: AbstractControl;
  public advRemitt: AbstractControl;
  public vessel: AbstractControl;
  public corresBank: AbstractControl;
  public portLoading: AbstractControl;
  public customExchRate: AbstractControl;
  public customTotValFc: AbstractControl;
  public customTotValRs: AbstractControl;
  public bankExchRate1: AbstractControl;
  public bankFcAmt1: AbstractControl;
  public bankRsAmt1: AbstractControl;
  public freightFc: AbstractControl;
  public insuranceFc: AbstractControl;
  public commFc: AbstractControl;
  public dscFc: AbstractControl;
  public otherDedFc: AbstractControl;
  public brokFc: AbstractControl;
  public totCDOFc: AbstractControl;
  public totFICDORs: AbstractControl;
  public totFICDOFc: AbstractControl;
  public osi: AbstractControl;
  public totAmt1: AbstractControl;
  //For Print
  printItems: listItems[] = [];
  customerPrint: any; //Used For printing Invoice
  isView: any;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private service: ImportInvoiceService,
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

    this.settings = this.prepareSettings();
    this.setting = this.prepareTableSettings();

    this.excnageService.getData().subscribe(exchangeRateList => {
      this.exchangeRateList = exchangeRateList;
    });

    this.catService.getData().subscribe(data => {
      this.catMasterList = data;
    });
    this.service.getAllCommonMasterByType('BK').subscribe(res => {
      this.bankList = res;
    });
    this.service.getAllCommonMasterByType('PX').subscribe(res => {
      this.invoicePrefixList = res;
      this.prefix.setValue(res[0]["id"]);
    });
    this.service.getAllCommonMasterByType('SX').subscribe(res => {
      this.invoiceSuffixList = res;
      this.suffix.setValue(res[0]["id"]);
    });
    this.service.getAllCommonMasterByType('TS').subscribe(res => {
      this.trco = res;
    });
    this.currencyService.getAllCurrencies().subscribe(currList => {
      this.currList = currList;
    });
    this.partyService.getPartyByType('BR').subscribe(res => {
      this.brokerList = res;
    });
    this.partyService.getPartyByType('NO').subscribe(party => {
      this.notifierList = party;
    });
    this.zoneService.getAllCountries().subscribe(countryList => {
      this.countryList = countryList;
    });

    this.lotService.getData().subscribe((list) => {
      this.lotList = list;
    });
    this.zoneService.getAllGeoByType('CT').subscribe(cityList => {
      this.cityList = cityList;
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

  onChangeLoading(val: any) {
    if (this.portLoading.value == this.portDisChrg.value) {
      this.portLoading.reset();
      this.loading = false;
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = false;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Loading & Discharge Port cannot be same!';
    }

  }

  onChangeDischarge(val: any) {
    if (this.portLoading.value) {
      this.onChangeLoading(this.portLoading.value);
    }
  }
  OpeningStockInvoice() {
    this.openingStockInvoice = true;
    this.osi.setValue(true);
    this.isCompleted.setValue(true);
    //  this.purchaseInvoiceForm.disable();
    this.selectPo = true;
    this.baseCurrName = "RUPEES";
    this.stockCurrName = "DOLLAR";
    this.stockExchRate.setValue(61);
    this.partyService.getPartyByType('SU').subscribe(data => {
      this.customerList = data;
    })
    this.invoiceDate.setValue(this.dateFormate(new Date()));
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
        this.currencyId.setValue(b.currId);
        let flag = 0;
        this.exchangeRateList.forEach(res => {
          if (res.exchType == "ST" && res.currencyMasterByToCurrId == this.baseCurr.value
            && res.currencyMasterByFromCurrId == this.stockCurr.value) {
            if (!res.toDate || res.toDate <= this.invoiceDate.value) {
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
    // this.salesInvoiceForm.enable();
    // this.soId.disable();
    //  this.settings = this.prepareSettings();
  }

  ngOnInit() {
    if (this.router.url.includes('openingImportnvoice')) {
      // this.openingStockInvoice = true;
      // this.osi.setValue(true);
      this.OpeningStockInvoice();
      this.isViewMode = true;
      this.showSbmtBtn = true;
      this.createImportInvoiceForm.enable();

    } else if (this.router.url.includes('viewImpPurInvoice')) {
      this.osi.setValue(true);
      this.openingStockInvoice = true;
      this.partyService.getPartyByType('SU').subscribe(data => {
        this.customerList = data;
      })
      this.route.params.subscribe((params: Params) => {
        this.importInvoiceIdParam = params['locSaleId'];
        this.isView = params['isView'];
        debugger
        if (this.importInvoiceIdParam) {
          if(this.isView == 'true'){
            this.pageTitle = 'View Import Invoice for Purchase Order';

            this.selectPo = true;
            this.service.getOpeningStockImportPurchaseOrderInvoiceByInvoiceId(this.importInvoiceIdParam).subscribe(data => {
              this.invoiceId = data.invoiceId;
              this.pageTitle = 'View Import Invoice for Purchase Order';
              this.isViewMode = true;
              this.showSbmtBtn = false;
              this.createImportInvoiceForm.disable();
              this.onEditPatchDataFunc(data);
            })
          } else {
            this.pageTitle = 'Edit Import Invoice for Purchase Order';

          this.selectPo = true;
          this.service.getOpeningStockImportPurchaseOrderInvoiceByInvoiceId(this.importInvoiceIdParam).subscribe(data => {
            this.invoiceId = data.invoiceId;
            this.pageTitle = 'View Import Invoice for Purchase Order';
            this.isViewMode = true;
            this.showSbmtBtn = false;
            this.createImportInvoiceForm.disable();
            this.onEditPatchDataFunc(data);
          })
          }
          
        } else {
          debugger
          this.createImportInvoiceForm.disable();
          this.selectPo = false;
        }
      });
    } else {
      debugger
      this.osi.setValue(false);
      this.route.params.subscribe((params: Params) => {
        this.importInvoiceIdParam = params['id'];
        this.isView = params['isView'];
        if (this.importInvoiceIdParam) {
          if(this.isView == 'true'){
            this.pageTitle = 'View Import Invoice for Purchase Order';

            this.selectPo = true;
            this.service.getImportInvoiceDataById(this.importInvoiceIdParam).subscribe(data => {
              this.invoiceId = data.invoiceId;
              if (params['status'] == 'COMPLETED' && data) {
                this.pageTitle = 'View Import Invoice for Purchase Order';
                this.isViewMode = true;
                this.showSbmtBtn = false;
                this.createImportInvoiceForm.disable();
                this.onEditPatchDataFunc(data);
              } else {
                this.isViewMode = true;
              this.showSbmtBtn = false;
                this.onEditPatchDataFunc(data);
                this.createImportInvoiceForm.disable();
                this.createImportInvoiceForm.markAsUntouched();
              }
            })
          } else {
            this.pageTitle = 'Edit Import Invoice for Purchase Order';

            this.selectPo = true;
            this.service.getImportInvoiceDataById(this.importInvoiceIdParam).subscribe(data => {
              this.invoiceId = data.invoiceId;
              if (params['status'] == 'COMPLETED' && data) {
                this.pageTitle = 'View Import Invoice for Purchase Order';
                this.isViewMode = true;
                this.showSbmtBtn = false;
                this.createImportInvoiceForm.disable();
                this.onEditPatchDataFunc(data);
              } else {
                this.isViewMode = false;
                this.createImportInvoiceForm.enable();
                this.onEditPatchDataFunc(data);
                this.markAllTouched(this.createImportInvoiceForm);
              }
            })
          }
        } else {
          this.createImportInvoiceForm.disable();
          this.selectPo = false;
        }
      });
    }
  }


  validP() {
    if (this.importInvoiceIdParam) {
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
    let hsnNo: any;
    if (this.category.value) {
      hsnNo = this.catMasterList.find(element => {
        if (element.catId == this.category.value) {
          return true;
        }
      })
    }

    let i = 1;
    this.printItems = [];
    this.purchaseOrderItems.forEach(ele => {
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
    const totalP = 0;
    let totalA = 0;
    this.printItems.forEach(item => {
      totalC = totalC + item.carats;
      totalA = totalA + item.amount;
    });
    const cumuRate = totalA / totalC;
    this.loading = false;
    const activeModal = this.modalService.open(PrintExportComponent, { size: 'lg' });
    this.partyService.getPartyById(this.supplierId.value).subscribe(data => {
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
    activeModal.componentInstance.printDate = this.invoiceDate.value;
    activeModal.componentInstance.invoiceNo = ('IMP/' + this.importInvoiceIdParam);
    this.countryList.forEach(element => {
      if (element.geoId == this.orgCountry.value) {
        activeModal.componentInstance.companyCountry = element.name;
      }
    })
    this.countryList.forEach(element => {
      if (element.geoId == this.portDisChrg.value) {
        activeModal.componentInstance.portOfDischarge = element.name;
      }
    })
  }

  dateFormate(date: Date) {
    const dd = date.getDate();
    const mm = date.getMonth() + 1; // January is 0!
    const yyyy = date.getFullYear();
    return yyyy + '-' + (mm < 10 ? '0' + mm : mm) + '-' + (dd < 10 ? '0' + dd : dd);
  }

  onEditPatchDataFunc(data: any) {
    this.partyService.getAllBankBranchByPartyId(data.supplierId, 'SU').subscribe(partyBranchList => {
      this.grossAmount = data.totalGrossAmount;
      this.partyBankBranches = partyBranchList;
      this.doNotCallInvExchRateChngFunctionWhenValueOne = 1;
      this.baseCurr.setValue(data.baseCurr);
      this.createImportInvoiceForm.patchValue(data);
      this.invoiceDate.setValue(data.invoiceDate);
      this.bDueDate.setValue(data.bDueDate);
      this.sDueDate.setValue(data.sDueDate);
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


      if (this.openingStockInvoice) {
        if (this.invCurrCode == "USD")
          this.totAmt = data.totalGrossAmountSTK;
        else this.totAmt = data.totalGrossAmount;
        this.totAmt1.setValue(this.totAmt);
        this.supplier.setValue(data.supplierId);
        this.supplierId.setValue(data.supplierId);
      }
      else {

        this.itemDetails = data.stockItems;
        this.purchaseOrderItems = data.importItems;
        this.totAmt = this.getTotalAmount();
        this.settings = this.prepareSettings();
        this.source.load(this.itemDetails);
        this.setting = this.prepareTableSettings();
        this.sourceTab1.load(this.purchaseOrderItems);
      }
      this.totCarats = this.totalCarats;

      this.totalGrossAmount.setValue(parseFloat((this.totAmt * data.invExchRate).toFixed(2)));
      this.freight.setValue(data.freight);
      this.insurance.setValue(data.insurance);
      this.commission.setValue(data.commission);
      this.discount.setValue(data.discount);
      this.oded.setValue(data.oded);
      this.brokerage.setValue(data.brokerage);

      this.wtAvgRate = this.weightAvgRate;
      this.setTimeoutStockEffect();
      setTimeout(() => {
        this.doNotCallInvExchRateChngFunctionWhenValueOne = 0;
      });
    });
  }

  prepareTableSettings() {
    return {
      hideSubHeader: true,
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
        perPage: 50,
      },
      columns: {
        description: {
          title: 'Item Description',
          type: 'text',
        },
        carats: {
          title: 'Carats',
          type: 'text',
        },
        rate: {
          title: 'Rate Per Carat',
          type: 'text',
        },
        amount: {
          title: 'Total Amount',
          type: 'text',
          editable: false,
          valuePrepareFunction: (value, row) => {
            row.amount = row.carats * row.rate;
            return parseFloat(row.amount.toFixed(2));
          }
        }
      }
    };
  }

  handleAddTab1() {
    if (this.itemDesc.value && this.rate.value && this.carets.value) {
      if (this.carets.value <= 0 || this.rate.value <= 0) {
        this.loading = false;
        const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
        activeModal.componentInstance.showHide = false;
        activeModal.componentInstance.modalHeader = 'Alert';
        activeModal.componentInstance.modalContent = 'Carats & Rate should be greater than 0!';
      } else if (this.purchaseOrderItems.length > 0) {
        let flag = 0;
        this.purchaseOrderItems.forEach(element => {
          const a = element.description;
          if (this.itemDesc.value.trim().toUpperCase() == a.trim().toUpperCase()) {
            flag = 1;
            this.loading = false;
            const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
            activeModal.componentInstance.showHide = false;
            activeModal.componentInstance.modalHeader = 'Alert';
            activeModal.componentInstance.modalContent = 'Item already added!';
          }
        });
        if (flag == 0) {
          this.validHandleAddTab1();
        }
      } else {
        this.validHandleAddTab1();
      }
    }
  }

  validHandleAddTab1() {
    const orderItem = new ItemTab1();
    orderItem.description = this.itemDesc.value;
    orderItem.carats = parseFloat(this.carets.value.toFixed(3));
    orderItem.rate = parseFloat(this.rate.value.toFixed(2));
    orderItem.amount = parseFloat((this.carets.value * this.rate.value).toFixed(2));
    this.purchaseOrderItems.push(orderItem);
    this.sourceTab1.load(this.purchaseOrderItems);
    this.itemDesc.reset();
    this.carets.reset();
    this.rate.reset();
    this.setTimeoutCalcFunc();
  }

  setTimeoutCalcFunc() {
    setTimeout(() => {
      if (!this.openingStockInvoice) {
        this.totAmt = this.getTotalAmount();
      }
      //  this.totAmt = this.getTotalAmount();
      this.totalGrossAmount.setValue(parseFloat((this.totAmt * this.invExchRate.value).toFixed(2)));    // in base currency
      this.totalGrossAmountSTK.setValue(parseFloat((this.totalGrossAmount.value / parseFloat(this.stockExchRate.value.toString())).toFixed(2)));
      this.customTotValFc.setValue(this.totAmt);
      this.customTotValRs.setValue(this.totalGrossAmount.value);
      this.totCarats = this.totalCarats;
      this.wtAvgRate = this.weightAvgRate;
      this.itemDetails.forEach(de => {
        // if (this.changedCurrstat == 1) {
        //   de.rate = parseFloat((this.wtAvgRate / parseFloat(this.invExchRate.value.toString())).toFixed(2));
        // } else {
        de.rate = this.wtAvgRate;
        // }
        de.tAmount = parseFloat((de.carats * de.rate).toFixed(2));
      })
      this.totTAmount = this.getTAmount;
      this.notionalProfit = this.notProfit;
      this.notPerc = this.notProfitPerc;
      this.source.load(this.itemDetails);
    })
  }

  get totalCarats(): number {
    return parseFloat(this.getColTotal('carats', this.purchaseOrderItems).toFixed(3));
  }

  get weightAvgRate(): number {
    // let freightAmount: number, insuranceAmount: number;
    let commissionAmount: number, discountAmount: number, otherDeduction: number, brokerageAmount: number;
    if (this.comm.value) { commissionAmount = parseFloat(this.comm.value.toFixed(2)); } else { commissionAmount = 0 }
    if (this.dsc.value) { discountAmount = parseFloat(this.dsc.value.toFixed(2)); } else { discountAmount = 0 }
    if (this.otherDed.value) { otherDeduction = parseFloat(this.otherDed.value.toFixed(2)); } else { otherDeduction = 0 }
    if (this.brok.value) { brokerageAmount = parseFloat(this.brok.value.toFixed(2)); } else { brokerageAmount = 0 }

    const netAmount = parseFloat(this.totalGrossAmount.value.toString()) + commissionAmount + discountAmount + otherDeduction + brokerageAmount;
    return parseFloat(((netAmount / this.totalCarats) / parseFloat(this.stockExchRate.value.toString())).toFixed(2));
  }

  onDeleteConfirmTab1(event: any): void {
    this.loading = false;
    const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
    activeModal.componentInstance.showHide = true;
    activeModal.componentInstance.modalHeader = 'Alert';
    activeModal.componentInstance.modalContent = 'Are you sure you want to delete?';
    activeModal.result.then((res) => {
      if (res == 'Y') {
        let index = 0;
        this.purchaseOrderItems.forEach(element => {
          if (element.description.trim().toUpperCase() == event.data.description.trim().toUpperCase()) {
            this.purchaseOrderItems.splice(index, 1);
            this.sourceTab1.load(this.purchaseOrderItems);
            event.confirm.resolve();
            this.setTimeoutCalcFunc();
            const abc = this.itemDetails.findIndex(elem => {
              if (elem.itemDesc == event.data.description) {
                return true;
              }
            });
            if (abc != -1) {
              this.loading = false;
              const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
              activeModal.componentInstance.showHide = true;
              activeModal.componentInstance.modalHeader = 'Alert';
              activeModal.componentInstance.modalContent = 'Item Deleted!! Do you want to delete ' + element.description.toUpperCase() + ' based Description Entries From Stock Effects Also?';
              activeModal.result.then((res) => {
                if (res == 'Y') {
                  let abc: Item[] = [];
                  this.itemDetails.forEach(ele => {
                    if (ele.itemDesc != event.data.description) {
                      abc.push(ele);
                    }
                  });
                  this.itemDetails = abc;
                  this.setTimeoutStockEffect();
                } else {
                  event.confirm.reject();
                }
              });
            }
          } else {
            index++;
          }
        });
      } else {
        event.confirm.reject();
      }
    });
  }

  onEditConfirmTab1(event: any): void {
    if (event.newData.carats <= 0 || event.newData.rate <= 0) {
      this.loading = false;
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = false;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Carats & Rate should be greater than 0!';
      event.confirm.reject();
    } else if (event.newData.description.trim().length == 0) {
      this.loading = false;
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = false;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Description is required!';
      event.confirm.reject();
    } else {
      event.newData.amount = parseFloat((event.newData.carats * event.newData.rate).toFixed(2));
      event.confirm.resolve(event.newData);
      this.sourceTab1.load(this.purchaseOrderItems);
      this.setTimeoutCalcFunc();
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
        perPage: 50,
      },
      columns: {
        lotName: {
          title: 'Lot Name',
          type: 'text',
          editable: false,
        },
        itemName: {
          title: 'Item Name',
          type: 'text',
          editable: false,
        },
        itemDesc: {
          title: 'Item Desc',
          type: 'text',
          editable: false,
        },
        pieces: {
          title: 'Pieces',
          type: 'text',
          editable: false,
        },
        carats: {
          title: 'Carats',
          type: 'text',
        },
        sellingPrice: {
          title: 'Selling Price',
          type: 'text',
          editable: false,
        },
        amount: {
          title: 'Selling Amount',
          type: 'text',
          editable: false,
          valuePrepareFunction: (value, row) => {
            row.amount = row.carats * row.sellingPrice;
            return parseFloat(row.amount.toFixed(2));
          }
        },
        rate: {
          title: 'Cost Price',
          type: 'text',
          editable: false,
          valuePrepareFunction: value => {
            // if (this.wtAvgRate && this.changedCurrstat == 1) {
            //   return parseFloat((this.wtAvgRate / this.invExchRate.value).toFixed(2));
            // } else
            if (this.wtAvgRate) {
              return parseFloat(this.wtAvgRate.toFixed(2));
            } else {
              return 0;
            }
          }
        },
        tAmount: {
          title: 'Total Amount',
          type: 'text',
          editable: false,
          valuePrepareFunction: (value, row) => {
            row.tAmount = row.carats * row.rate;
            return parseFloat(row.tAmount.toFixed(2));
          }
        }
      }
    };
  }

  get getTotalSellingAmountTab2(): number {
    return parseFloat(this.getColTotal('amount', this.itemDetails).toFixed(2));
  }

  get getTAmount(): number {
    return parseFloat(this.getColTotal('tAmount', this.itemDetails).toFixed(2));
  }

  get totalCaratsTab2(): number {
    return parseFloat(this.getColTotal('carats', this.itemDetails).toFixed(3));
  }

  get notProfit(): number {

    if (this.getTotalSellingAmountTab2 && this.getTotalAmount()) {
      let commissionAmount: number, discountAmount: number, otherDeduction: number, brokerageAmount: number;
      if (this.comm.value) { commissionAmount = parseFloat(this.comm.value.toFixed(2)); } else { commissionAmount = 0 }
      if (this.dsc.value) { discountAmount = parseFloat(this.dsc.value.toFixed(2)); } else { discountAmount = 0 }
      if (this.otherDed.value) { otherDeduction = parseFloat(this.otherDed.value.toFixed(2)); } else { otherDeduction = 0 }
      if (this.brok.value) { brokerageAmount = parseFloat(this.brok.value.toFixed(2)); } else { brokerageAmount = 0 }

      return parseFloat(((this.getTotalSellingAmountTab2 * this.stockExchRate.value) - ((this.getTotalAmount() * this.invExchRate.value) + commissionAmount + discountAmount + otherDeduction + brokerageAmount)).toFixed(2));
    }
  }

  get notProfitPerc(): number {
    let brokerageAmount: number;
    if (this.brok.value) { brokerageAmount = parseFloat(this.brok.value.toFixed(2)); } else { brokerageAmount = 0 }
    const perc = parseFloat((((this.notProfit) / (this.getTaxableAmount() + brokerageAmount)) * 100).toFixed(2));
    return perc;
  }

  handleAdd() {
    if (this.caratsCtrl.value && this.lotCtrl.value && this.item.value) {
      if (this.caratsCtrl.value <= 0) {
        this.loading = false;
        const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
        activeModal.componentInstance.showHide = false;
        activeModal.componentInstance.modalHeader = 'Alert';
        activeModal.componentInstance.modalContent = 'Carats should be greater than 0!';
      } else if (this.itemDetails.length > 0) {
        let flag = 0;
        this.itemDetails.forEach(element => {
          if (this.item.value.lotItemId == element.lotItemId) {
            flag = 1;
            this.loading = false;
            const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
            activeModal.componentInstance.showHide = false;
            activeModal.componentInstance.modalHeader = 'Alert';
            activeModal.componentInstance.modalContent = 'Item already added!';
          }
        });
        if (flag == 0) {
          this.validHandleAdd();
        }
      } else {
        this.validHandleAdd();
      }
    }
  }

  validHandleAdd() {
    const orderItem = new Item();
    orderItem.lotId = this.lotCtrl.value.lotId;
    orderItem.lotName = this.lotCtrl.value.lotName;
    orderItem.itemName = this.item.value.itemMaster.itemName;
    orderItem.itemId = this.item.value.itemMaster.itemId;
    orderItem.itemDesc = this.descCtrl.value;
    if (this.piecesCtrl.value) {
      orderItem.pieces = this.piecesCtrl.value;
    } else {
      orderItem.pieces = 0;
    }
    orderItem.carats = parseFloat(this.caratsCtrl.value.toFixed(3));
    orderItem.sellingPrice = this.item.value.itemMaster.salePrice;
    orderItem.amount = parseFloat((orderItem.carats * orderItem.sellingPrice).toFixed(2));
    // if (this.changedCurrstat == 1) {
    //   orderItem.rate = parseFloat((this.weightAvgRate / parseFloat(this.invExchRate.value.toString())).toFixed(2));
    // } else {
    orderItem.rate = this.weightAvgRate;
    // }
    orderItem.tAmount = parseFloat((orderItem.carats * orderItem.rate).toFixed(2));
    orderItem.lotItemId = this.item.value.lotItemId;

    this.itemDetails.push(orderItem);
    //this.item.reset();
    // this.descCtrl.reset();
    this.lotCtrl.setValue(this.lotList[0]);
    this.piecesCtrl.reset();
    this.caratsCtrl.reset();
    this.setTimeoutStockEffect();
  }

  onEditConfirm(event: any): void {
    if (event.newData.carats <= 0) {
      this.loading = false;
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = false;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Carats should be greater than 0!';
      event.confirm.reject();
    } else {
      event.newData.amount = parseFloat((event.newData.carats * event.newData.sellingPrice).toFixed(2));
      event.newData.tAmount = parseFloat((event.newData.carats * event.newData.rate).toFixed(2));
      event.confirm.resolve(event.newData);
      this.setTimeoutStockEffect();
    }
  }

  onDeleteConfirm(event: any): void {
    this.loading = false;
    const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
    activeModal.componentInstance.showHide = true;
    activeModal.componentInstance.modalHeader = 'Alert';
    activeModal.componentInstance.modalContent = 'Are you sure you want to delete?';
    activeModal.result.then((res) => {
      if (res == 'Y') {
        let index = 0;
        this.itemDetails.forEach(element => {
          if (element.lotItemId == event.data.lotItemId) {
            this.itemDetails.splice(index, 1);
            this.setTimeoutStockEffect();
            event.confirm.resolve();
          } else {
            index++;
          }
        });
      } else {
        event.confirm.reject();
      }
    });
  }

  scrollTo(id: string) {
    const ele = document.getElementById(id);
    ele.scrollIntoView();
    window.scrollBy(0, -100);
  }

  validCaratsBfrSbmt(): boolean {
    debugger;
    const caratsTab1 = this.totalCarats;     // Purchase Order Item Total carats
    const caratsTab2 = this.totalCaratsTab2;     // Stock Order Item Total carats
    let remainCaratsTab1: number;                   // diff of above both carats

    remainCaratsTab1 = Math.abs(caratsTab1 - caratsTab2);
    remainCaratsTab1 = parseFloat(remainCaratsTab1.toFixed(3));
    if (remainCaratsTab1 >= 0 && remainCaratsTab1 <= 0.2) {
      if (remainCaratsTab1 != 0) {
        this.loading = false;
        const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
        activeModal.componentInstance.showHide = true;
        activeModal.componentInstance.modalHeader = 'Alert';
        activeModal.componentInstance.modalContent = 'Allocated Item\'s Carats Difference is ' + (remainCaratsTab1) + ' ! Press OK to Submit or Cancel to review your Allocation!';
        activeModal.result.then((res) => {
          if (res == 'Y') {
            this.loading = true;
            this.kattiDifference.setValue(parseFloat((caratsTab1 - caratsTab2).toFixed(3)));
            this.validSubmit();

            return true;
          } else if (res == 'N') {
            this.loading = false;
            this.ngbTabset.select('stock');
            return false;
          }
        });
      } else {
        this.kattiDifference.setValue(parseFloat((caratsTab1 - caratsTab2).toFixed(3)));
        this.validSubmit();
        return true;
      }

    } else if (remainCaratsTab1 > 0.2) {
      this.loading = false;
      this.ngbTabset.select('stock');

      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = false;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Allocated Item\'s Carats Difference is more than 20 cents. So Please Review your Allocation!';
      return false;
    }
  }

  lgModalShow() {
    this.loading = false;
    const activeModal = this.modalService.open(ImportInvoiceModal, { size: 'lg' });
    activeModal.componentInstance.modalHeader = 'Import Order Details';
    activeModal.componentInstance.emitService.subscribe((emmitedValue) => {

      if (emmitedValue) {
        this.invoiceDate.setValue(this.dateFormate(new Date()));
        if (emmitedValue.status == 'COMPLETED') {
          this.isCompleted.setValue(true);
        } else {
          this.isCompleted.setValue(false);
        }
        this.createImportInvoiceForm.enable();
        this.category.setValue(emmitedValue.categoryMaster);
        this.suppBillDate.setValue(emmitedValue.poDate);
        this.poNo.setValue(emmitedValue.poId);
        this.poId.setValue(emmitedValue.poId);

        this.service.getImportPurchaseOrderById(emmitedValue.poId).subscribe((data: any) => {

          this.hierService.getHierById(this.authService.credentials.company).subscribe(da => {

            this.hierService.getHierMasterById(da.hierarchyMaster.hierId).subscribe(res => {

              this.doNotCallInvExchRateChngFunctionWhenValueOne = 1;
              this.stockCurr.setValue(res.hierarchyDetailRequestDTO.currencyMasterByStockCurrId);
              this.baseCurr.setValue(res.hierarchyDetailRequestDTO.currencyMasterByCurrId);
              this.currencyId.setValue(data.poCurrency);            //Invoice Currency which is a purchaseOrder Currency
              this.selectedCurr = data.poCurrency;
              this.invExchRate.setValue(data.baseExchangeRate);
              this.customExchRate.setValue(data.baseExchangeRate);

              this.currList.forEach(ele => {
                if (ele.currId == this.stockCurr.value) {
                  this.stockCurrCode = ele.currCode;
                  this.stockCurrName = ele.currName;
                }
                if (ele.currId == this.baseCurr.value) {
                  this.baseCurrCode = ele.currCode;
                  this.baseCurrName = ele.currName;
                }
                if (ele.currId == data.poCurrency) {
                  this.invCurrName = ele.currName.trim().toUpperCase();
                  this.invCurrCode = ele.currCode;
                }
              })

              let flag = 0;
              this.exchangeRateList.forEach(res => {
                if (res.exchType == 'ST' && res.currencyMasterByToCurrId == this.baseCurr.value
                  && res.currencyMasterByFromCurrId == this.stockCurr.value) {
                  if (!res.toDate || res.toDate <= this.invoiceDate.value) {
                    this.stockExchRate.setValue(res.exchRate);
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

          this.partyService.getAllBankBranchByPartyId(data.party.partyId, 'SU').subscribe(partyBranchList => {
            this.partyBankBranches = partyBranchList;
          });

          this.party = data.party;
          if (data.generalDetails.bank) { // our bank
            this.bankId.setValue(data.generalDetails.bank);
          }

          if (data.bankId) {
            this.suppBankBranchId.setValue(data.bankId);
          }

          if (data.corresBank) {
            this.corresBank.setValue(data.corresBank);
          }

          if (data.notifier) {
            this.notifier.setValue(data.notifier);
          }

          this.advRemitt.setValue(data.advRemitt);
          this.bankTrCo.setValue(data.generalDetails.bankTnC);
          this.bCreditDays.setValue(data.generalDetails.creditDays);
          this.sCreditDays.setValue(data.suppDays);
          this.orgCountry.setValue(data.orgCountry);
          if (data.portDisChrg) {
            this.portDisChrg.setValue(data.portDisChrg);
          }
          setTimeout(() => {
            this.notifierNote.setValue(data.notifierNote);
            this.suppBankerNote.setValue(data.generalDetails.supBankNote);
            this.bDueDate.setValue(data.generalDetails.dueDate);
            this.sDueDate.setValue(data.sDueDate);
          });

          this.supplier.setValue(this.party.partyName);
          this.supplierId.setValue(data.party.partyId);

          // for purchase order item
          this.purchaseOrderItems = data.purchaseOrderItems;
          this.purchaseOrderItems.forEach(d => {
            d.amount = parseFloat((d.carats * d.rate).toFixed(2));
          })
          this.setting = this.prepareTableSettings();
          this.sourceTab1.load(this.purchaseOrderItems);

          this.grossAmount = parseFloat(data.orderAmountBase.toFixed(2));
          this.totalGrossAmount.setValue(this.grossAmount);
          this.totalGrossAmountSTK.setValue(parseFloat((data.orderAmountBase / this.stockExchRate.value).toFixed(2)));
          this.customTotValFc.setValue(this.getTotalAmount());
          this.customTotValRs.setValue(this.totalGrossAmount.value);
          // for stock Effect

          this.itemDetails = [];
          const wt = this.weightAvgRate;
          data.stockEffectsItems.forEach(itm => {
            const orderItem = new Item();
            orderItem.lotId = itm.lot.lotId;
            orderItem.lotName = itm.lot.lotName;
            orderItem.itemName = itm.item.itemName;
            orderItem.itemDesc = itm.itemDesc;
            orderItem.pieces = itm.pieces;
            orderItem.carats = itm.carats;
            orderItem.sellingPrice = itm.sellingPrice;
            orderItem.amount = parseFloat((itm.carats * itm.sellingPrice).toFixed(2));
            //yasar //
            orderItem.rate = wt;
            //orderItem.rate = itm.rate;
            orderItem.tAmount = parseFloat((itm.carats * orderItem.rate).toFixed(2));
            orderItem.lotItemId = itm.item.lotItemId;
            this.itemDetails.push(orderItem);       // itemDetails means stockEffect list will always be in dollar
          });
          this.setTimeoutStockEffectCalcFunc();
          this.onChangeBankExchRate1(data.baseExchangeRate);
          this.selectPo = true;
          setTimeout(() => {
            this.doNotCallInvExchRateChngFunctionWhenValueOne = 0;
          });
        });
      } else {
        this.createImportInvoiceForm.disable();
      }
    });
  }
  onSupplierChange(val) {
    this.partyService.getAllBankBranchByPartyId(val, 'SU').subscribe(partyBranchList => {
      this.partyBankBranches = partyBranchList;
    });
  }
  setTimeoutStockEffectCalcFunc() {
    setTimeout(() => {
      if (!this.openingStockInvoice) {
        this.totAmt = this.getTotalAmount();
      }
      //  this.totAmt = this.getTotalAmount();
      this.totCarats = this.totalCarats;
      this.wtAvgRate = this.weightAvgRate;

      this.itemDetails.forEach(d => {
        d.rate = this.wtAvgRate;
        d.tAmount = parseFloat((d.carats * d.rate).toFixed(2));
      })
      this.settings = this.prepareSettings();
      this.setTimeoutStockEffect();
    }, 3000)
  }

  setTimeoutStockEffect() {
    this.source.load(this.itemDetails);
    setTimeout(() => {
      if (!this.openingStockInvoice) {
        this.totAmt = this.getTotalAmount();
      }
      this.totalGrossAmountSTK.setValue(parseFloat((this.totalGrossAmount.value / parseFloat(this.stockExchRate.value.toString())).toFixed(2)));
      this.customTotValFc.setValue(this.totAmt);
      this.customTotValRs.setValue(this.totalGrossAmount.value);
      this.totSellAmountTab2 = this.getTotalSellingAmountTab2;
      this.totTAmount = this.getTAmount;
      this.totCaratsTab2 = this.totalCaratsTab2;
      this.notionalProfit = this.notProfit;
      this.notPerc = this.notProfitPerc;
      this.profitBase.setValue(this.notProfit);
      this.profitSTK.setValue(parseFloat((this.notProfit / this.stockExchRate.value).toFixed(2)));
    })
  }

  onInvExchRateChange(val: any) {
    if (this.doNotCallInvExchRateChngFunctionWhenValueOne != undefined && this.doNotCallInvExchRateChngFunctionWhenValueOne != 1) {
      this.invExchRate.setValue(val);
      const d = this.getTotalAmount() * this.invExchRate.value;
      this.totalGrossAmount.setValue(parseFloat(d.toFixed(2)));
    }
    this.customExchRate.setValue(val);
  }

  onChangeBankExchRate1(value: any) {
    this.bankExchRate1.setValue(parseFloat(value.toString()));
    if (this.bankFcAmt1.value != '') {
      this.bankFcAmt1.setValue(parseFloat(this.bankFcAmt1.value.toString()));
    } else {
      this.bankFcAmt1.setValue(0);
    }
    this.bankRsAmt1.setValue(parseFloat((this.bankFcAmt1.value * value).toFixed(2)));
  }

  onChangeBankFcAmt1(value: any) {
    this.bankFcAmt1.setValue(value);
    this.onChangeBankExchRate1(this.bankExchRate1.value);
  }

  getTotalAmount(): number {
    return parseFloat(this.getColTotal('amount', this.purchaseOrderItems).toFixed(2));
  }

  getColTotal(colName: string, value: any[]): number {
    let total: number;
    total = 0;
    value.forEach(row => {
      total += parseFloat(row[colName]);
    });
    return total;
  }

  submit() {
    this.loading = true;
    this.validateRequiredField();
    if (this.errorMsg) {
      this.loading = false;
      return; // TODO: Need to add client side validation.
    }
    if (this.isCompleted.value) {
      this.validCaratsBfrSbmt();
    } else {
      this.validSubmit();
    }
  }

  validSubmit() {
    this.showSbmtBtn = false;
    this.totTaxableAmt.setValue(this.getTaxableAmount());
    if (!this.provitionalStatus.value) {
      this.provitionalStatus.setValue(false);
    }
    if (!this.advRemitt.value) {
      this.advRemitt.setValue(false);
    }
    if (this.openingStockInvoice) {
      this.supplierId.setValue(this.supplier.value);
      this.stockItems.setValue(this.itemDetails);
      this.importItems.setValue(this.purchaseOrderItems);
      const formValue: any = this.createImportInvoiceForm.value;

      this.service.addOpeningStockImportPurchaseOrderInvoice(formValue).subscribe(res => {
        this.handleBack();

      }, error => {
        this.loading = false;
        this.showSbmtBtn = true;
        log.debug(`Creation error: ${error}`);
        if (error._body) {
          this.errorMsg = error._body;
        } else {
          this.errorMsg = 'Internal Server Error!'
        }
      })
    } else {
      if (this.createImportInvoiceForm.value && this.itemDetails.length > 0) {
        this.stockItems.setValue(this.itemDetails);
        this.importItems.setValue(this.purchaseOrderItems);
        const formValue: any = this.createImportInvoiceForm.value;

        this.service.createImportInvoice(formValue).subscribe(res => {
          this.handleBack();
        }, error => {
          this.loading = false;
          this.showSbmtBtn = true;
          log.debug(`Creation error: ${error}`);
          if (error._body) {
            this.errorMsg = error._body;
          } else {
            this.errorMsg = 'Internal Server Error!'
          }
        })
      }
      else {
        this.loading = false;
        this.showSbmtBtn = true;
        const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
        activeModal.componentInstance.showHide = true;
        activeModal.componentInstance.modalHeader = 'Alert';
        activeModal.componentInstance.modalContent = 'Please Add Some Stock Item for Import Purchase!!'
      }
    }
  }

  finally() {
    this.back.back();
  }

  handleBack(cancelling: boolean = false) {
    if (this.openingStockInvoice) {
      // this.router.navigate(['../ImpPurInvoice'], { relativeTo: this.route });
      this.back.back();

    } else if (this.importInvoiceIdParam) {
      this.back.back();
    } else {
      this.back.back();
    }
  }

  calculateTax() {
    let igstTaxAmout: number = 0;
    let cgstTaxAmount: number = 0;
    let sgstTaxAmount: number = 0;

    if (this.igst.value) {
      igstTaxAmout = this.igst.value;
    }
    if (this.cgst.value) {
      cgstTaxAmount = this.cgst.value;
    }
    if (this.sgst.value) {
      sgstTaxAmount = this.sgst.value;
    }

    let totalTaxPercent;
    totalTaxPercent = igstTaxAmout + cgstTaxAmount + sgstTaxAmount;
    this.tot.setValue(totalTaxPercent);
  }

  calculateTaxAmount() {
    if (!this.igstAmount.value) { this.igAmount = 0 } else { this.igAmount = this.igstAmount.value }
    if (!this.cgstAmount.value) { this.cgAmount = 0 } else { this.cgAmount = this.cgstAmount.value }
    if (!this.sgstAmount.value) { this.sgAmount = 0 } else { this.sgAmount = this.sgstAmount.value }
    let amount = +this.igAmount + +this.cgAmount + +this.sgAmount;
    //tax amount
    amount = parseFloat(amount.toFixed(2));
    this.totAmount.setValue(amount);
    this.totAmountRs = amount;
    this.totalTaxAmount.setValue(amount);
    this.totalTaxAmountRs = amount;
  }

  calculateNetAmount() {
    const amount = this.getTaxableAmount();
    this.getTaxableAmountFc();
    this.totCDO.setValue(parseFloat((amount - this.totalGrossAmount.value).toFixed(2)));
    this.reCalculateGstTaxAmt();
    let netAmt;
    if (this.totAmount.value) {
      netAmt = parseFloat((amount + parseFloat(this.totAmount.value.toFixed(2))).toFixed(2));
    } else {
      netAmt = parseFloat(amount.toFixed(2)) + 0;
    }
    //set in ui
    this.netAmount.setValue(netAmt);
    this.netAmountRs = netAmt;
  }

  getTaxableAmountFc() {
    let amountCDOFc: number = 0;
    let amountFICDOFc: number = 0;

    if (this.commFc.value) {
      amountCDOFc = amountCDOFc + this.commFc.value;
    }

    if (this.dscFc.value) {
      amountCDOFc = amountCDOFc + this.dscFc.value;
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

    this.totCDOFc.setValue(parseFloat((amountCDOFc).toFixed(2)));
    this.totFICDOFc.setValue(parseFloat((amountFICDOFc).toFixed(2)));
  }

  getTaxableAmount() {
    let amountCDO: number = 0;
    let amountFICDO: number = 0;
    if (this.totalGrossAmount.value) {
      amountCDO = amountCDO + this.totalGrossAmount.value;
    }
    if (this.comm.value) {
      amountCDO = amountCDO + this.comm.value;
    }

    if (this.dsc.value) {
      amountCDO = amountCDO + this.dsc.value;
    }
    if (this.otherDed.value) {
      amountCDO = amountCDO + this.otherDed.value;
    }

    amountCDO = parseFloat(amountCDO.toFixed(2));

    if (this.freight.value || this.insurance.value) {
      let fritAmt: number, insurAmt: number;
      if (this.freight.value) {
        fritAmt = parseFloat(this.freight.value.toFixed(2));
      } else {
        fritAmt = 0;
      }
      if (this.insurance.value) {
        insurAmt = parseFloat(this.insurance.value.toFixed(2));
      } else {
        insurAmt = 0;
      }
      amountFICDO = amountCDO + fritAmt + insurAmt;
    } else {
      amountFICDO = amountCDO;
    }

    this.totFICDORs.setValue(parseFloat((amountFICDO - (this.totalGrossAmount.value * 1)).toFixed(2)));

    return amountCDO;
  }

  reCalculateGstTaxAmt() {
    const igstAmt = parseFloat(((this.getTaxableAmount() * this.igst.value) / 100).toFixed(2));
    this.igstAmount.setValue(igstAmt);

    const cgstAmt = parseFloat(((this.getTaxableAmount() * this.cgst.value) / 100).toFixed(2));
    this.cgstAmount.setValue(cgstAmt);

    const sgstAmt = parseFloat(((this.getTaxableAmount() * this.sgst.value) / 100).toFixed(2));
    this.sgstAmount.setValue(sgstAmt);
    this.calculateTaxAmount();
  }

  validateRequiredField() {
    this.errorMsg = null;
    if (this.netAmount.value <= 0) {
      this.loading = false;
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = false;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Net Amount can not be zero or negative!';
      this.errorMsg = 'Net Amount can not be zero or negative!';
      return;
    }

    if (!this.prefix.value) {
      this.loading = false;
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = false;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Please select Prefix!';
      this.errorMsg = 'Please select prefix.'
      return;
    }

    if (!this.suffix.value) {
      this.loading = false;
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = false;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Please select suffix!';
      this.errorMsg = 'Please select suffix.'
      return;
    }

    if (!this.category.value) {
      this.loading = false;
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = false;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Please select Category!';
      this.errorMsg = 'Please select category.'
      return;
    }

    if (!this.supplier.value) {
      this.loading = false;
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = false;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Please select Supplier!';
      this.errorMsg = 'Please select Supplier.'
      return;
    }


    if (!this.orgCountry.value) {
      this.loading = false;
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = false;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Please select Origin Country!';
      this.errorMsg = 'Please select Origin Country.'
      return;
    }
    if (!this.suppBankBranchId.value) {
      this.loading = false;
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = false;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Please select Supplier Bank!';
      this.errorMsg = 'Please select Supplier Bank.'
      return;
    }

    if (!this.bankTrCo.value) {
      this.loading = false;
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = false;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Please select Terms & Condition!';
      this.errorMsg = 'Please select terms.'
      return;
    }

    if (!isNumber(this.bCreditDays.value)) {
      this.loading = false;
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = false;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Enter Bank Credit Days!';
      this.errorMsg = 'Enter Bank credit days.'
      return;
    }

    if (!isNumber(this.sCreditDays.value)) {
      this.loading = false;
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = false;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Enter Supplier Credit Days!';
      this.errorMsg = 'Enter Supplier credit days.'
      return;
    }

    if (this.totalGrossAmount.value <= 0) {
      this.loading = false;
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = false;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Gross Amount can not be zero or negative!';
      this.errorMsg = 'Gross Amount can not be zero or negative.'
      return;
    }

    if (!this.supplier.value) {
      this.loading = false;
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = false;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Please select Supplier!';
      this.errorMsg = 'Please select Supplier.'
      return;
    }

  }

  private createForm() {
    this.createImportInvoiceForm = this.fb.group({
      'poId': [''],
      'invoiceId': [this.invoiceId],
      'prefix': ['', Validators.compose([Validators.required])],
      'invoiceNo': [''],
      'suffix': ['', Validators.compose([Validators.required])],
      'invoiceDate': ['', Validators.compose([Validators.required])],
      'category': ['', Validators.compose([Validators.required])],
      'supplier': ['', Validators.compose([Validators.required])],
      'supplierId': [''],
      'brokerId': [''],
      'suppBillDate': ['', Validators.compose([Validators.required])],
      'isCompleted': [''],
      'poNo': ['', Validators.compose([Validators.required])], // supplier order no. // change it to poId
      'sCreditDays': ['', Validators.compose([Validators.required])],
      'sDueDate': [''],
      'bankId': [''],
      'bankTrCo': ['', Validators.compose([Validators.required])],
      'currencyId': ['', Validators.compose([Validators.required])],
      'bCreditDays': ['', Validators.compose([Validators.required])],
      'bDueDate': [''],
      'totalGrossAmount': [''],
      'stockCurr': [''],
      'baseCurr': [''],
      'invExchRate': ['', Validators.compose([Validators.required])],
      'totalGrossAmountSTK': [''],

      'suppBankBranchId': ['', Validators.compose([Validators.required])],
      'suppBankerNote': [''],
      'stockExchRate': [''],

      'notifier': [''],
      'notifierNote': [''],
      'importerRefNo': [''],
      'othRefNo': [''],
      'orgCountry': ['', Validators.compose([Validators.required])],
      'portDisChrg': [''],

      'stockItems': [],
      'importItems': [],
      'igst': [''],
      'cgst': [''],
      'sgst': [''],
      'tot': [''],
      'igstAmount': [''],
      'cgstAmount': [''],
      'sgstAmount': [''],
      'totAmount': [''],
      'freight': [''],
      'insurance': [''],
      'commission': [''],
      'discount': [''],
      'oded': [''],
      'netAmount': [''],
      'totalWgtCts': [''],
      'netWgtKg': [''],
      'boxWgt': [''],
      'grossWgt': [''],
      'remark': [''],
      'dsc': [''],
      'comm': [''],
      'otherDed': [''],
      'totalTaxAmount': [''],
      'itemDesc': [''],
      'carets': [''],
      'rate': [''],
      'lotCtrl': [''],
      'item': [''],
      'descCtrl': [''],
      'piecesCtrl': [''],
      'caratsCtrl': [''],
      'provitionalStatus': [''],
      'totCDO': [''],
      'totTaxableAmt': [''],
      'brokerage': [''],
      'brok': [''],
      'kattiDifference': [''],
      'itemNameSearch': [''],
      'suppNote': [''],
      'profitBase': [''],
      'profitSTK': [''],
      'advRemitt': [''],
      'vessel': [''],
      'corresBank': [''],
      'portLoading': [''],
      'customExchRate': [''],
      'customTotValFc': [''],
      'customTotValRs': [''],
      'bankExchRate1': [''],
      'bankFcAmt1': [''],
      'bankRsAmt1': [''],
      'freightFc': [''],
      'insuranceFc': [''],
      'commFc': [''],
      'dscFc': [''],
      'otherDedFc': [''],
      'brokFc': [''],
      'totCDOFc': [''],
      'totFICDORs': [''],
      'totFICDOFc': [''],
      'osi': [''],
      'totAmt1': [''],
    });
    this.poId = this.createImportInvoiceForm.controls['poId']
    this.stockItems = this.createImportInvoiceForm.controls['stockItems'];
    this.importItems = this.createImportInvoiceForm.controls['importItems'];
    this.prefix = this.createImportInvoiceForm.controls['prefix'];
    this.invoiceNo = this.createImportInvoiceForm.controls['invoiceNo'];
    this.suffix = this.createImportInvoiceForm.controls['suffix'];
    this.invoiceDate = this.createImportInvoiceForm.controls['invoiceDate'];
    this.category = this.createImportInvoiceForm.controls['category'];
    this.supplier = this.createImportInvoiceForm.controls['supplier'];
    this.supplierId = this.createImportInvoiceForm.controls['supplierId'];
    this.suppBillDate = this.createImportInvoiceForm.controls['suppBillDate'];
    this.brokerId = this.createImportInvoiceForm.controls['brokerId'];
    this.poNo = this.createImportInvoiceForm.controls['poNo'];
    this.isCompleted = this.createImportInvoiceForm.controls['isCompleted'];
    this.sCreditDays = this.createImportInvoiceForm.controls['sCreditDays'];
    this.sDueDate = this.createImportInvoiceForm.controls['sDueDate'];
    this.bankId = this.createImportInvoiceForm.controls['bankId'];
    this.bankTrCo = this.createImportInvoiceForm.controls['bankTrCo'];
    this.currencyId = this.createImportInvoiceForm.controls['currencyId'];
    this.bCreditDays = this.createImportInvoiceForm.controls['bCreditDays'];
    this.bDueDate = this.createImportInvoiceForm.controls['bDueDate'];
    this.totalGrossAmount = this.createImportInvoiceForm.controls['totalGrossAmount'];
    this.suppBankBranchId = this.createImportInvoiceForm.controls['suppBankBranchId'];
    this.suppBankerNote = this.createImportInvoiceForm.controls['suppBankerNote'];
    this.stockCurr = this.createImportInvoiceForm.controls['stockCurr'];
    this.invExchRate = this.createImportInvoiceForm.controls['invExchRate'];
    this.totalGrossAmountSTK = this.createImportInvoiceForm.controls['totalGrossAmountSTK'];
    this.stockExchRate = this.createImportInvoiceForm.controls['stockExchRate'];
    this.baseCurr = this.createImportInvoiceForm.controls['baseCurr'];
    // tax section

    this.notifier = this.createImportInvoiceForm.controls['notifier'];
    this.notifierNote = this.createImportInvoiceForm.controls['notifierNote'];
    this.importerRefNo = this.createImportInvoiceForm.controls['importerRefNo'];
    this.othRefNo = this.createImportInvoiceForm.controls['othRefNo'];
    this.orgCountry = this.createImportInvoiceForm.controls['orgCountry'];
    this.portDisChrg = this.createImportInvoiceForm.controls['portDisChrg'];

    this.igst = this.createImportInvoiceForm.controls['igst'];
    this.cgst = this.createImportInvoiceForm.controls['cgst'];
    this.sgst = this.createImportInvoiceForm.controls['sgst'];
    this.tot = this.createImportInvoiceForm.controls['tot'];
    this.igstAmount = this.createImportInvoiceForm.controls['igstAmount'];
    this.cgstAmount = this.createImportInvoiceForm.controls['cgstAmount'];
    this.sgstAmount = this.createImportInvoiceForm.controls['sgstAmount'];
    this.totAmount = this.createImportInvoiceForm.controls['totAmount'];
    this.freight = this.createImportInvoiceForm.controls['freight'];
    this.insurance = this.createImportInvoiceForm.controls['insurance'];
    this.commission = this.createImportInvoiceForm.controls['commission'];
    this.discount = this.createImportInvoiceForm.controls['discount'];
    this.oded = this.createImportInvoiceForm.controls['oded'];
    // bottom section
    this.netAmount = this.createImportInvoiceForm.controls['netAmount'];
    this.totalWgtCts = this.createImportInvoiceForm.controls['totalWgtCts'];
    this.netWgtKg = this.createImportInvoiceForm.controls['netWgtKg'];
    this.boxWgt = this.createImportInvoiceForm.controls['boxWgt'];
    this.grossWgt = this.createImportInvoiceForm.controls['grossWgt'];
    this.remark = this.createImportInvoiceForm.controls['remark'];
    this.comm = this.createImportInvoiceForm.controls['comm'];
    this.dsc = this.createImportInvoiceForm.controls['dsc'];
    this.otherDed = this.createImportInvoiceForm.controls['otherDed'];
    this.totalTaxAmount = this.createImportInvoiceForm.controls['totalTaxAmount'];

    this.itemDesc = this.createImportInvoiceForm.controls['itemDesc'];
    this.carets = this.createImportInvoiceForm.controls['carets'];
    this.rate = this.createImportInvoiceForm.controls['rate'];
    this.lotCtrl = this.createImportInvoiceForm.controls['lotCtrl'];
    this.item = this.createImportInvoiceForm.controls['item'];
    this.descCtrl = this.createImportInvoiceForm.controls['descCtrl'];
    this.piecesCtrl = this.createImportInvoiceForm.controls['piecesCtrl'];
    this.caratsCtrl = this.createImportInvoiceForm.controls['caratsCtrl'];
    this.provitionalStatus = this.createImportInvoiceForm.controls['provitionalStatus'];
    this.totCDO = this.createImportInvoiceForm.controls['totCDO'];
    this.totTaxableAmt = this.createImportInvoiceForm.controls['totTaxableAmt'];
    this.brokerage = this.createImportInvoiceForm.controls['brokerage'];
    this.brok = this.createImportInvoiceForm.controls['brok'];
    this.kattiDifference = this.createImportInvoiceForm.controls['kattiDifference'];
    this.itemNameSearch = this.createImportInvoiceForm.controls['itemNameSearch'];
    this.suppNote = this.createImportInvoiceForm.controls['suppNote'];
    this.profitSTK = this.createImportInvoiceForm.controls['profitSTK'];
    this.profitBase = this.createImportInvoiceForm.controls['profitBase'];
    this.advRemitt = this.createImportInvoiceForm.controls['advRemitt'];
    this.vessel = this.createImportInvoiceForm.controls['vessel'];
    this.corresBank = this.createImportInvoiceForm.controls['corresBank'];
    this.portLoading = this.createImportInvoiceForm.controls['portLoading'];
    this.customExchRate = this.createImportInvoiceForm.controls['customExchRate'];
    this.customTotValFc = this.createImportInvoiceForm.controls['customTotValFc'];
    this.customTotValRs = this.createImportInvoiceForm.controls['customTotValRs'];
    this.bankExchRate1 = this.createImportInvoiceForm.controls['bankExchRate1'];
    this.bankFcAmt1 = this.createImportInvoiceForm.controls['bankFcAmt1'];
    this.bankRsAmt1 = this.createImportInvoiceForm.controls['bankRsAmt1'];
    this.freightFc = this.createImportInvoiceForm.controls['freightFc'];
    this.insuranceFc = this.createImportInvoiceForm.controls['insuranceFc'];
    this.commFc = this.createImportInvoiceForm.controls['commFc'];
    this.dscFc = this.createImportInvoiceForm.controls['dscFc'];
    this.otherDedFc = this.createImportInvoiceForm.controls['otherDedFc'];
    this.brokFc = this.createImportInvoiceForm.controls['brokFc'];
    this.totCDOFc = this.createImportInvoiceForm.controls['totCDOFc'];
    this.totFICDORs = this.createImportInvoiceForm.controls['totFICDORs'];
    this.totFICDOFc = this.createImportInvoiceForm.controls['totFICDOFc'];
    this.osi = this.createImportInvoiceForm.controls['osi'];
    this.totAmt1 = this.createImportInvoiceForm.controls['totAmt1'];

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

    this.totAmt1.valueChanges.subscribe(val => {
      if (val) {
        this.totalGrossAmount.setValue(val * (this.invExchRate.value == '' ? 1 : this.invExchRate.value));
      }
    })

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

    this.supplierId.valueChanges.subscribe(data => {
      if (data) {
        this.partyService.getPartyById(data).subscribe(detail => {
          this.suppNote.setValue(detail.remarks);
        });
      }
    })

    this.notifier.valueChanges.subscribe(not => {
      this.notifierList.forEach(note => {
        if (note.partyId == not) {
          this.notifierNote.setValue(note.remarks)
        }
      });
    });

    this.currencyId.valueChanges.subscribe(data => {

      const a = this.currList.find(i => {
        if (i.currId == data) {
          return true;
        }
      })
      if (a) {
        this.invCurrName = a.currName;
        this.invCurrCode = a.currCode;
      }
      if (this.currencyId.value) {
        if (this.baseCurr.value == this.currencyId.value) {
          this.invExchRate.setValue(1);
          this.onInvExchRateChange(this.invExchRate.value);
        } else {
          let check = 0;
          this.exchangeRateList.forEach(res => {
            if (res.exchType == 'ST' && res.currencyMasterByToCurrId == this.baseCurr.value
              && res.currencyMasterByFromCurrId == this.currencyId.value) {
              if (!res.toDate || res.toDate <= this.invoiceDate.value) {
                this.invExchRate.setValue(res.exchRate);
                this.onInvExchRateChange(this.invExchRate.value);
              }
              check = 1;
            }
          });
          if (check != 1) {
            this.loading = false;
            const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
            activeModal.componentInstance.showHide = false;
            activeModal.componentInstance.modalHeader = 'Alert';
            activeModal.componentInstance.modalContent = 'Please Add Invoice Exchange Rate or Change your Currency!';
          }
        }
      }
    });

    this.category.valueChanges.subscribe(data => {
      this.lotCtrl.setValue(this.lotList[0]);
      //this.item.reset();
    });

    this.totalGrossAmount.valueChanges.subscribe(res => {

      this.commission.setValue(this.commission.value);
      this.discount.setValue(this.discount.value);
      this.oded.setValue(this.oded.value);
      this.brokerage.setValue(this.brokerage.value);
      this.calculateTaxAmount();
      this.calculateNetAmount();

      this.setTimeoutStockEffectCalcFunc();
    })

    this.igst.valueChanges.subscribe(res => {
      if (res) {
        if (this.totalGrossAmount.value) {
          const pAmout = parseFloat(((this.getTaxableAmount() * res) / 100).toFixed(2));
          this.igstAmount.setValue(pAmout);
          this.igstAmountRs = pAmout;
        } else {
          this.igstAmountRs = this.igstAmount.value;
        }

      } else {
        this.igstAmount.setValue(0);
      }
      this.calculateTax();
      this.calculateTaxAmount();
      this.calculateNetAmount();
    });

    this.cgst.valueChanges.subscribe(res => {
      if (res) {
        if (this.totalGrossAmount.value) {
          const pAmout = parseFloat(((this.getTaxableAmount() * res) / 100).toFixed(2));
          this.cgstAmount.setValue(pAmout);
          this.cgstAmountRs = pAmout;
        } else {
          this.cgstAmountRs = this.cgstAmount.value;
        }
      } else {
        this.cgstAmount.setValue(0);
      }
      this.calculateTax();
      this.calculateTaxAmount();
      this.calculateNetAmount();
    });

    this.sgst.valueChanges.subscribe(res => {
      if (res) {
        if (this.totalGrossAmount.value) {
          const pAmout = parseFloat(((this.getTaxableAmount() * res) / 100).toFixed(2));
          this.sgstAmount.setValue(pAmout);
          this.sgstAmountRs = pAmout;
        } else {
          this.sgstAmountRs = this.sgstAmount.value;
        }
      } else {
        this.sgstAmount.setValue(0);
      }
      this.calculateTax();
      this.calculateTaxAmount();
      this.calculateNetAmount();
    });

    this.bankTrCo.valueChanges.subscribe(val => {
      if (val) {
        if (isNumber(this.bCreditDays.value)) {
          this.bCreditDays.setValue(this.bCreditDays.value);
        } else {
          this.bCreditDays.setValue(0);
        }
        if (isNumber(this.sCreditDays.value)) {
          this.sCreditDays.setValue(this.sCreditDays.value);
        } else {
          this.sCreditDays.setValue(0);
        }
      }
    });

    this.sCreditDays.valueChanges.subscribe(val => {
      if (this.trco.length > 0) {
        this.trco.forEach(tr => {
          if (this.bankTrCo.value == tr.id) {
            const crDays = parseInt(tr.name.split(' ')[0]);
            const daysTotal = crDays + val;
            const milis = 86400000 * daysTotal + (new Date()).getTime();
            const date = new Date(milis);
            const dd = date.getDate();
            const mm = date.getMonth() + 1; // January is 0!
            const yyyy = date.getFullYear();
            this.sDueDate.setValue((dd < 10 ? '0' + dd : dd) + '-' + (mm < 10 ? '0' + mm : mm) + '-' + yyyy);
          }
        })
      }
    })

    this.bCreditDays.valueChanges.subscribe(val => {

      if (this.trco.length > 0) {
        this.trco.forEach(tr => {
          if (this.bankTrCo.value == tr.id) {
            const crDays = parseInt(tr.name.split(' ')[0]);
            const daysTotal = crDays + val;
            const milis = 86400000 * daysTotal + (new Date()).getTime();
            const date = new Date(milis);
            const dd = date.getDate();
            const mm = date.getMonth() + 1; // January is 0!
            const yyyy = date.getFullYear();
            this.bDueDate.setValue((dd < 10 ? '0' + dd : dd) + '-' + (mm < 10 ? '0' + mm : mm) + '-' + yyyy);
          }
        })
      }
    });

    this.freight.valueChanges.subscribe(val => {
      if (this.freight.value) {
        this.freightFc.setValue(parseFloat((val / this.invExchRate.value).toFixed(2)));
      } else {
        this.freightFc.setValue(0);
      }
      this.calculateNetAmount();
    })

    this.insurance.valueChanges.subscribe(val => {
      if (this.insurance.value) {
        this.insuranceFc.setValue(parseFloat((val / this.invExchRate.value).toFixed(2)));
      } else {
        this.insuranceFc.setValue(0);
      }
      this.calculateNetAmount();
    })

    this.commission.valueChanges.subscribe(val => {
      if (this.commission.value) {
        if (isNumber(this.totalGrossAmount.value)) {
          const commissionAmt: number = parseFloat((parseFloat(this.totalGrossAmount.value.toString()) * parseFloat(val) / 100).toFixed(2));
          this.comm.setValue(commissionAmt);

          const commissionAmtFc: number = parseFloat((parseFloat(this.getTotalAmount().toString()) * parseFloat(val) / 100).toFixed(2));
          this.commFc.setValue(commissionAmtFc);
        } else {
          this.comm.setValue(0);
          this.commFc.setValue(0);
        }
      } else {
        this.comm.setValue(0);
        this.commFc.setValue(0);
      }
      if (this.discount.value) {
        this.discount.setValue(this.discount.value);
      }
      this.calculateNetAmount();
      this.setTimeoutStockEffectCalcFunc();
      // setTimeout(() => {
      //   this.wtAvgRate = this.weightAvgRate;
      // })
    })

    this.discount.valueChanges.subscribe(val => {
      if (this.discount.value) {
        if (isNumber(this.totalGrossAmount.value) && isNumber(this.comm.value)) {
          const grossAmtAfterCommission = parseFloat(this.totalGrossAmount.value.toString()) + parseFloat(this.comm.value.toString());
          const discountAmt: number = parseFloat((grossAmtAfterCommission * parseFloat(val) / 100).toFixed(2));
          this.dsc.setValue(discountAmt);

          const grossAmtAfterCommissionFc = parseFloat(this.getTotalAmount().toString()) + parseFloat(this.commFc.value.toString());
          const discountAmtFc: number = parseFloat((grossAmtAfterCommissionFc * parseFloat(val) / 100).toFixed(2));
          this.dscFc.setValue(discountAmtFc);
        } else {
          this.dsc.setValue(0);
          this.dscFc.setValue(0);
        }
      } else {
        this.dsc.setValue(0);
        this.dscFc.setValue(0);
      }
      if (this.oded.value) {
        this.oded.setValue(this.oded.value);
      }
      this.calculateNetAmount();
      this.setTimeoutStockEffectCalcFunc();
      // setTimeout(() => {
      //   this.wtAvgRate = this.weightAvgRate;
      // })
    })

    this.oded.valueChanges.subscribe(val => {
      if (this.oded.value) {
        if (isNumber(this.totalGrossAmount.value) && isNumber(this.dsc.value) && isNumber(this.comm.value)) {
          const grossAmtAfterDiscount = parseFloat(this.totalGrossAmount.value.toString()) + parseFloat(this.dsc.value.toString()) + parseFloat(this.comm.value.toString());
          const value: number = parseFloat((grossAmtAfterDiscount * parseFloat(val) / 100).toFixed(2));
          this.otherDed.setValue(value);

          const grossAmtAfterDiscountFc = parseFloat(this.getTotalAmount().toString()) + parseFloat(this.dscFc.value.toString()) + parseFloat(this.commFc.value.toString());
          const valueFc: number = parseFloat((grossAmtAfterDiscountFc * parseFloat(val) / 100).toFixed(2));
          this.otherDedFc.setValue(valueFc);
        } else {
          this.otherDed.setValue(0);
          this.otherDedFc.setValue(0);
        }
      } else {
        this.otherDed.setValue(0);
        this.otherDedFc.setValue(0);
      }
      if (this.brokerage.value) {
        this.brokerage.setValue(this.brokerage.value);
      }
      this.calculateNetAmount();
      this.setTimeoutStockEffectCalcFunc();
      // setTimeout(() => {
      //   this.wtAvgRate = this.weightAvgRate;
      // })
    })

    this.brokerage.valueChanges.subscribe(val => {
      if (this.brokerage.value) {
        if (isNumber(this.totalGrossAmount.value) && isNumber(this.dsc.value) && isNumber(this.comm.value) && isNumber(this.otherDed.value)) {
          const grossAmtAfterOtherDed = parseFloat(this.totalGrossAmount.value.toString()) + parseFloat(this.dsc.value.toString()) + parseFloat(this.comm.value.toString()) + parseFloat(this.otherDed.value.toString());
          const value: number = parseFloat((grossAmtAfterOtherDed * parseFloat(val) / 100).toFixed(2));
          this.brok.setValue(value);

          const grossAmtAfterOtherDedFc = parseFloat(this.getTotalAmount().toString()) + parseFloat(this.dscFc.value.toString()) + parseFloat(this.commFc.value.toString()) + parseFloat(this.otherDedFc.value.toString());
          const valueFc: number = parseFloat((grossAmtAfterOtherDedFc * parseFloat(val) / 100).toFixed(2));
          this.brokFc.setValue(valueFc);
        } else {
          this.brok.setValue(0);
          this.brokFc.setValue(0);
        }
      } else {
        this.brok.setValue(0);
        this.brokFc.setValue(0);
      }
      this.calculateNetAmount();
      this.setTimeoutStockEffectCalcFunc();
      // setTimeout(() => {
      //   this.wtAvgRate = this.weightAvgRate;
      // })
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

}
