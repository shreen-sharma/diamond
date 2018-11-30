import { Validator } from 'codelyzer/walkerFactory/walkerFn';
import { ItemDetail } from '../../../../masters/components/itemDetails';
import { CurrencyService } from 'app/pages/masters/components/currency/';
import { Observable } from 'rxjs/Observable';
import { CategoryService } from './../../../../masters/components/categories/category.service';
import { PurchaseInvoiceModal } from '../createPurchaseInvoice/purchaseInvoice-modal/purchaseInvoice-modal.component';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, Pipe, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModalComponent } from '../../../../../shared/common-modal/common-modal.component';
import { AuthenticationService } from '../../../../../core/authentication/authentication.service';
import { Logger } from '../../../../../core/logger.service';
import { PurchaseInvoiceService } from '../purchaseInvoice.service';
import { PartyDetailsService } from 'app/pages/company/components/partyDetails/partyDetails.service';
import { ExchangeRateService } from 'app/pages/masters/components/exchangeRate/exchangeRate.service';
import { HierarchyRelationService } from 'app/pages/company/components/hierarchyRelation';
import { LotService } from '../../../../stockManagement/components/lots';
import { LotItemCreationService } from '../../../../stockManagement/components/lotItemCreation';
import { debug, isNumber } from 'util';
import { DecimalPipe } from '@angular/common';
import { NgbTabset, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { PrintInvoiceComponent } from '../../../../../shared/print-invoice/print-invoice.component';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

const log = new Logger('purchaseInvoice');

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

class items {
  si: any;
  description: any;
  hsn: any;
  carats: any;
  rate: any;
  amount: any;
}

@Component({
  selector: 'createPurchaseInvoice',
  templateUrl: './createPurchaseInvoice.html',
  styleUrls: ['./createPurchaseInvoice.scss']
})

export class CreatePurchaseInvoiceComponent implements OnInit {

  @ViewChild(NgbTabset) ngbTabset: NgbTabset;

  public itemNameSearch: AbstractControl;

  lotItem: any[] = [];

  search = (text$: Observable<string>) =>
    text$
      .debounceTime(200)
      .distinctUntilChanged()
      .map(term => term.length < 1 ? []
        : this.lotItems.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10));

  lotItems: any[] = [];
  notionalProfit: number;
  notPerc: number;
  totCaratsTab2: number;
  totTAmount: number;
  totSellAmountTab2: number;
  flag: number;
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
  curValChange: boolean;
  stockCurrVsInvCurr: number;
  baseCurrName: any;
  isViewMode: boolean;
  showSbmtBtn: boolean = true;

  purchaseInvoiceIdParam: string;
  pageTitle = 'Create Purchase Invoice for Purchase Order';
  errorMsg: string = null;
  selectPo: boolean = false;
  invoiceId: number;
  party: any;
  partyBankBranches: any[];
  bankList: any[];
  grossAmount: number;
  currList: any[] = [];
  exchangeRateList: any[] = [];
  trco: any[];
  catMasterList: any[] = [];
  itemDetails: Item[] = [];
  calItemDetails: Item[] = [];

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
  openingStockInvoice: boolean = false;
  //OPSTIN: boolean=false;
  customerList: any[] = [];

  purchaseInvoiceForm: FormGroup;
  public prefix: AbstractControl;
  public poId: AbstractControl;
  public invoiceNo: AbstractControl; //invoice no
  public suffix: AbstractControl;
  public invoiceDate: AbstractControl;
  public category: AbstractControl;
  public supplier: AbstractControl;
  public suppBillDate: AbstractControl;
  public supplierNote: AbstractControl;
  public brokerId: AbstractControl;
  public poNo: AbstractControl; //supplier order no
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
  public prevInvExchRate: AbstractControl;

  public suppBankBranchId: AbstractControl;
  public suppBankerNote: AbstractControl;
  public stockExchRate: AbstractControl;

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
  public items: AbstractControl;
  public purchaseItems: AbstractControl;
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
  public insur: AbstractControl;
  public frit: AbstractControl;

  public itemDesc: AbstractControl;
  public carets: AbstractControl;
  public rate: AbstractControl;
  public lotCtrl: AbstractControl;
  public item: AbstractControl;
  public descCtrl: AbstractControl;
  public piecesCtrl: AbstractControl;
  public caratsCtrl: AbstractControl;
  public supplierId: AbstractControl;
  public status: AbstractControl;         // For Provision
  public totFICDO: AbstractControl;         // For total of Comm, Dsc & OtherDed (FICDO)
  public totTaxableAmt: AbstractControl;         // Total Item Amt - totFICDO amt in BaseCurr
  public kattiDifference: AbstractControl;
  public profitBase: AbstractControl;
  public osi: AbstractControl;
  public totAmt1: AbstractControl;

  //Print
  customerPrint: any; //Used For printing Invoice
  printItems: items[] = [];
  isView: any;
  loading: boolean = false;
  constructor(private router: Router,
    private service: PurchaseInvoiceService,
    private route: ActivatedRoute,
    private currencyService: CurrencyService,
    private excnageService: ExchangeRateService,
    private hierService: HierarchyRelationService,
    private authService: AuthenticationService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private partyService: PartyDetailsService,
    private back: Location,
    private lotItemService: LotItemCreationService,
    private lotService: LotService,
    private catService: CategoryService) {

    this.itemDetails = [];
    this.createForm();
    this.settings = this.prepareSettings();
    this.setting = this.prepareTableSettings();
    this.catService.getData().subscribe(data => {
      this.catMasterList = data;
    });

    this.service.getAllCommonMasterByType('BK').subscribe(res => {
      this.bankList = res;
    });
    this.service.getAllCommonMasterByType('PX').subscribe(res => {
      debugger;
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
    this.currencyService.getAllCurrencies().subscribe((currList) => {
      this.currList = currList;
    });
    this.partyService.getPartyByType('BR').subscribe(res => {
      this.brokerList = res;
    })
    this.excnageService.getData().subscribe((exchangeRateList) => {
      this.exchangeRateList = exchangeRateList;
    });

    this.lotService.getData().subscribe((list) => {
      this.lotList = list;
    });
  }

  ngOnInit(): void {
    
    if (this.router.url.includes('openingPurchaseInvoice')) {

      this.OpeningStockInvoice();

    } else if (this.router.url.includes('viewlocPurInvoice')) {
      this.openingStockInvoice = true;
      this.osi.setValue(true);
      this.partyService.getPartyByType('SU').subscribe(data => {
        this.customerList = data;
      })
      this.route.params.subscribe((params: Params) => {
        
        this.purchaseInvoiceIdParam = params['locSaleId'];
        this.isView = params['isView'];
        if (this.purchaseInvoiceIdParam) {
          if(this.isView == 'true'){
            this.pageTitle = 'View Purchase';

            this.selectPo = true;
            this.service.getOpeningStockLocalPurchaseInvoiceById(this.purchaseInvoiceIdParam).subscribe(data => {
              this.invoiceId = data.invoiceId;
              // if (params['status'] == 'COMPLETED' && data) {
                this.pageTitle = 'View Purchase Invoice ';
                this.isViewMode = true;
                this.showSbmtBtn = false;
                this.purchaseInvoiceForm.disable();
                this.onEditPatchDataFunc(data);
                this.purchaseInvoiceForm.markAsUntouched();
              // } else {
              //   this.isViewMode = false;
              //   this.purchaseInvoiceForm.enable();
              //   this.onEditPatchDataFunc(data);
              //   this.markAllTouched(this.purchaseInvoiceForm);
              // }
            })
          } else{
            this.pageTitle = 'Edit Purchase Invoice for Purchase Order';

          this.selectPo = true;
          this.service.getOpeningStockLocalPurchaseInvoiceById(this.purchaseInvoiceIdParam).subscribe(data => {
            this.invoiceId = data.invoiceId;
            // if (params['status'] == 'COMPLETED' && data) {
              this.pageTitle = 'View Purchase Invoice ';
              this.isViewMode = true;
              this.showSbmtBtn = false;
              this.purchaseInvoiceForm.disable();
              this.onEditPatchDataFunc(data);
            // } else {
            //   this.isViewMode = false;
            //   this.purchaseInvoiceForm.enable();
            //   this.onEditPatchDataFunc(data);
            //   this.markAllTouched(this.purchaseInvoiceForm);
            // }
          })
          }
        } else {
          this.purchaseInvoiceForm.disable();
          this.selectPo = false;
        }
      });
    } else {
      this.osi.setValue(false);
      this.route.params.subscribe((params: Params) => {
        
        this.purchaseInvoiceIdParam = params['id'];
        this.isView = params['isView'];
        if (this.purchaseInvoiceIdParam) {
          if(this.isView == 'true'){
            this.pageTitle = 'View Purchase Invoice';

            this.selectPo = true;
            this.service.getPurchaseInvoiceDataById(this.purchaseInvoiceIdParam).subscribe(data => {
              this.invoiceId = data.invoiceId;
              if (params['status'] == 'COMPLETED' && data) {
                this.pageTitle = 'View Purchase Invoice for Purchase Order';
                this.isViewMode = true;
                this.showSbmtBtn = false;
                this.purchaseInvoiceForm.disable();
                this.onEditPatchDataFunc(data);
              } else {
                this.isViewMode = true;
                this.showSbmtBtn = false;
                this.onEditPatchDataFunc(data);
                this.purchaseInvoiceForm.disable();
                this.purchaseInvoiceForm.markAsUntouched();
              }
            })
          } else {
            this.pageTitle = 'Edit Purchase Invoice for Purchase Order';

            this.selectPo = true;
            this.service.getPurchaseInvoiceDataById(this.purchaseInvoiceIdParam).subscribe(data => {
              this.invoiceId = data.invoiceId;
              if (params['status'] == 'COMPLETED' && data) {
                this.pageTitle = 'View Purchase Invoice for Purchase Order';
                this.isViewMode = true;
                this.showSbmtBtn = false;
                this.purchaseInvoiceForm.disable();
                this.onEditPatchDataFunc(data);
              } else {
                this.isViewMode = false;
                this.purchaseInvoiceForm.enable();
                this.onEditPatchDataFunc(data);
                this.markAllTouched(this.purchaseInvoiceForm);
              }
            })
          }
         
        } else {
          this.purchaseInvoiceForm.disable();
          this.selectPo = false;
        }
      });
    }
  }

  OpeningStockInvoice() {
    this.openingStockInvoice = true;
    this.osi.setValue(true);
    //  this.purchaseInvoiceForm.disable();
    this.isCompleted.setValue(true);
    this.selectPo = true;
    this.baseCurrName = "RUPEES";
    this.stockCurrName = "DOLLAR";
    this.stockExchRate.setValue(61);
    this.suppBillDate.setValue(this.dateFormate(new Date()));
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
          this.loading=false;
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

  validP() {
    if (this.purchaseInvoiceIdParam) {
      this.print();
    } else {
      this.loading=false;
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = false;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Please submit the Invoice first & Edit again to proceed for Print!!';
    }
  }

  print() {
    let hsnNo: any;
    if (this.category.value) {
      this.catMasterList.forEach(element => {
      
        if (element.catId == this.category.value) {
          hsnNo = element.statisticalCode;
        }
      })
    }
    let i = 1;
    this.printItems = [];
    this.purchaseOrderItems.forEach(ele => {
      const newItem = new items;
      newItem.si = i;
      i++;
      newItem.description = ele.description;
      newItem.carats = ele.carats;
      newItem.rate = ele.rate;
      newItem.hsn = hsnNo;
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
    this.loading=false;
    const activeModal = this.modalService.open(PrintInvoiceComponent, { size: 'lg' });
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
    activeModal.componentInstance.invoiceNo = ('LOC/' + this.purchaseInvoiceIdParam); // This will be issue no_return no combination
    activeModal.componentInstance.items = this.printItems;  // item list with columns(si, description, pcs, carats, rate)
    activeModal.componentInstance.totalPcs = totalP;
    activeModal.componentInstance.printDate = this.invoiceDate.value;
    activeModal.componentInstance.totalCarats = parseFloat(totalC.toFixed(3));
    activeModal.componentInstance.tAmount = parseFloat(totalA.toFixed(2));
    activeModal.componentInstance.avgRate = parseFloat(cumuRate.toFixed(2));
    activeModal.componentInstance.hsnNo = hsnNo;
  }


  onEditPatchDataFunc(data: any) {
    this.partyService.getAllBankBranchByPartyId(data.supplierId, 'SU').subscribe(partyBranchList => {
      this.grossAmount = data.totalGrossAmount;
      this.partyBankBranches = partyBranchList;
      this.flag = 1;
      this.purchaseInvoiceForm.patchValue(data);
      // const date: any[] = data.invoiceDate.split('-');
      // const newDate = (date[2] + '-' + date[1] +'-' + date[0]);
      this.invoiceDate.setValue(data.invoiceDate);
      this.bDueDate.setValue(data.bDueDate);
      this.sDueDate.setValue(data.sDueDate);
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
        this.totAmt = data.totalGrossAmountSTK;
        this.totAmt1.setValue(this.totAmt);
        this.supplier.setValue(data.supplierId);
        this.supplierId.setValue(data.supplierId);
      } else {
      
        this.itemDetails = data.items;
        this.purchaseOrderItems = data.purchaseItems;
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
        this.flag = 0;
      });
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

  onSupplierChange(val) {
    this.partyService.getAllBankBranchByPartyId(val, 'SU').subscribe(partyBranchList => {
      this.partyBankBranches = partyBranchList;
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
        this.loading=false;
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
            this.loading=false;
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
      this.totAmt = this.getTotalAmount();
      this.totalGrossAmount.setValue(parseFloat((this.totAmt * this.invExchRate.value).toFixed(2)));    // in base currency
      this.totalGrossAmountSTK.setValue(parseFloat((this.totalGrossAmount.value / parseFloat(this.stockExchRate.value.toString())).toFixed(2)));
      this.totCarats = this.totalCarats;
      this.wtAvgRate = this.weightAvgRate;
      this.itemDetails.forEach(de => {
        // if(this.changedCurrstat == 1) {
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

  getTotalAmount(): number {
    return parseFloat(this.getColTotal('amount', this.purchaseOrderItems).toFixed(2));
  }

  get totalCarats(): number {
    return parseFloat(this.getColTotal('carats', this.purchaseOrderItems).toFixed(3));
  }

  get weightAvgRate(): number {
    // let freightAmount: number, insuranceAmount: number;
    let commissionAmount: number, discountAmount: number, otherDeduction: number, brokerageAmount: number;
    // if(this.frit.value)     {   freightAmount = parseFloat(this.frit.value.toFixed(2));     } else { freightAmount = 0   }
    // if(this.insur.value)    {   insuranceAmount = parseFloat(this.insur.value.toFixed(2));    } else { insuranceAmount = 0   }
    if (this.comm.value) { commissionAmount = parseFloat(this.comm.value.toFixed(2)); } else { commissionAmount = 0 }
    if (this.dsc.value) { discountAmount = parseFloat(this.dsc.value.toFixed(2)); } else { discountAmount = 0 }
    if (this.otherDed.value) { otherDeduction = parseFloat(this.otherDed.value.toFixed(2)); } else { otherDeduction = 0 }
    if (this.brok.value) { brokerageAmount = parseFloat(this.brok.value.toFixed(2)); } else { brokerageAmount = 0 }

    const netAmount = parseFloat(this.totalGrossAmount.value.toString()) + commissionAmount + discountAmount + otherDeduction + brokerageAmount;
    return parseFloat(((netAmount / this.totalCarats) / parseFloat(this.stockExchRate.value.toString())).toFixed(2));
  }

  getColTotal(colName: string, value: any[]): number {
    let total: number;
    total = 0;
    value.forEach(row => {
      total += parseFloat(row[colName]);
    });
    return total;
  }

  onDeleteConfirmTab1(event: any): void {
    this.loading=false;
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
              this.loading=false;
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
      this.loading=false;
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = false;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Carats & Rate should be greater than 0!';
      event.confirm.reject();
    } else if (event.newData.description.trim().length == 0) {
      this.loading=false;
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
            // if(this.wtAvgRate && this.changedCurrstat == 1){
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
          filter: false,
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
    // if(this.getTotalSellingAmountTab2 && this.totalGrossAmount.value) {   //getTotalSellingAmountTab2 value will always be in dollar
    //   if(this.changedCurrstat == 1) {                           // converting in Dollar
    //     return parseFloat((this.getTotalSellingAmountTab2 - (parseFloat(this.totalGrossAmount.value.toString()) / this.invExchRate.value)).toFixed(2));
    //   } else if(this.changedCurrstat == 0) {                          //converting in currency Rs
    //     return parseFloat(((this.getTotalSellingAmountTab2 * this.invExchRate.value) - parseFloat(this.totalGrossAmount.value.toString())).toFixed(2));
    //   }
    // }

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
        this.loading=false;
        const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
        activeModal.componentInstance.showHide = false;
        activeModal.componentInstance.modalHeader = 'Alert';
        activeModal.componentInstance.modalContent = 'Carats should be greater than 0!';
      } else if (this.itemDetails.length > 0) {
        let flag = 0;
        this.itemDetails.forEach(element => {
          if (this.item.value.lotItemId == element.lotItemId) {
            flag = 1;
            this.loading=false;
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
    // if(this.changedCurrstat == 1) {
    //   orderItem.rate = parseFloat((this.weightAvgRate / parseFloat(this.invExchRate.value.toString())).toFixed(2));
    // } else {
    orderItem.rate = this.weightAvgRate;
    // }
    orderItem.tAmount = parseFloat((orderItem.carats * orderItem.rate).toFixed(2));
    orderItem.lotItemId = this.item.value.lotItemId;

    this.itemDetails.push(orderItem);
    //this.item.reset();
    this.descCtrl.reset();
    this.lotCtrl.setValue(this.lotList[0]);
    this.piecesCtrl.reset();
    this.caratsCtrl.reset();
    this.setTimeoutStockEffect();
  }

  onEditConfirm(event: any): void {
    if (event.newData.carats <= 0) {
      this.loading=false;
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
    this.loading=false;
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
    
    let caratsTab1 = this.totalCarats;     // Purchase Order Item Total carats
    let caratsTab2 = this.totalCaratsTab2;     // Stock Order Item Total carats
    let remainCaratsTab1: number;                   // diff of above both carats

    remainCaratsTab1 = Math.abs(caratsTab1 - caratsTab2);
    remainCaratsTab1 = parseFloat(remainCaratsTab1.toFixed(3));
    if (remainCaratsTab1 >= 0 && remainCaratsTab1 <= 0.2) {
      if (remainCaratsTab1 != 0) {
        this.loading=false;
        const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
        activeModal.componentInstance.showHide = true;
        activeModal.componentInstance.modalHeader = 'Alert';
        activeModal.componentInstance.modalContent = 'Allocated Item\'s Carats Difference is ' + (remainCaratsTab1) + ' ! Press OK to Submit or Cancel to review your Allocation!';
        activeModal.result.then((res) => {
          if (res == 'Y') {
            this.kattiDifference.setValue(parseFloat((caratsTab1 - caratsTab2).toFixed(3)));
            this.validSubmit();
            return true;
          } else if (res == 'N') {
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
      this.ngbTabset.select('stock');
      this.loading=false;
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = false;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Allocated Item\'s Carats Difference is more than 20 cents. So Please Review your Allocation!';
      return false;
    }
  }

  submit() {
    //  this.totalGrossAmount.setValue(100);
    this.loading = true;
    if (this.openingStockInvoice){
      this.supplierId.setValue(this.supplier.value);
      this.totalGrossAmountSTK.setValue(this.totAmt1.value);
    }
    this.validateRequiredField();
    if (this.errorMsg) {
      this.loading = false;
      return; //TODO: Need to add client side validation.
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
    if (!this.status.value) {
      this.status.setValue(false);
    }
    if (this.openingStockInvoice) {
      if (this.purchaseInvoiceForm.value) {
        this.items.setValue(this.itemDetails);
        this.purchaseItems.setValue(this.purchaseOrderItems);
        const formValue: any = this.purchaseInvoiceForm.value;
        this.service.addOpeningStockLocalPurchaseInvoice(formValue).subscribe(res => {
          this.handleBack();
        }, error => {
          this.loading = false;
          this.showSbmtBtn = true;
          log.debug(`Creation error: ${error}`);
          if (error._body) {
            this.errorMsg = error._body;
          } else {
            this.errorMsg = "Internal Server Error!"
          }
        })
      } else {
        this.service.createPurchaseOrderInvoice(this.purchaseInvoiceForm.value).subscribe(res => {
          this.handleBack();
        }, error => {
          this.showSbmtBtn = true;
          log.debug(`Creation error: ${error}`);
          this.errorMsg = error._body;
        })
        this.showSbmtBtn = true;
      }


    } else {
      if (this.purchaseInvoiceForm.value) {
        this.items.setValue(this.itemDetails);
        this.purchaseItems.setValue(this.purchaseOrderItems);
        const formValue: any = this.purchaseInvoiceForm.value;
        this.service.createPurchaseOrderInvoice(formValue).subscribe(res => {
          this.handleBack();
        }, error => {
          this.loading = false;
          this.showSbmtBtn = true;
          log.debug(`Creation error: ${error}`);
          if (error._body) {
            this.errorMsg = error._body;
          } else {
            this.errorMsg = "Internal Server Error!"
          }
        })
      } else {
        this.service.createPurchaseOrderInvoice(this.purchaseInvoiceForm.value).subscribe(res => {
          this.handleBack();
        }, error => {
          this.loading = false;
          this.showSbmtBtn = true;
          log.debug(`Creation error: ${error}`);
          this.errorMsg = error._body;
        })
        this.showSbmtBtn = true;
      }
    }
  }

  handleBack() {
    this.back.back();
  }

  dateFormate(date: Date) {
    const dd = date.getDate();
    const mm = date.getMonth() + 1; // January is 0!
    const yyyy = date.getFullYear();
    return yyyy + '-' + (mm < 10 ? '0' + mm : mm) + '-' + (dd < 10 ? '0' + dd : dd);
  }

  lgModalShow() {
    this.loading=false;
    const activeModal = this.modalService.open(PurchaseInvoiceModal, { size: 'lg' });
    activeModal.componentInstance.modalHeader = 'Purchase Order Details';
    activeModal.componentInstance.emitService.subscribe((emmitedValue) => {

      if (emmitedValue) {
        this.invoiceDate.setValue(this.dateFormate(new Date()));
        if (emmitedValue.status == 'COMPLETED') {
          this.isCompleted.setValue(true);
        } else {
          this.isCompleted.setValue(false);
        }
        //const purchaseNo = parseInt(emmitedValue.poNo);
        this.purchaseInvoiceForm.enable();
        this.category.setValue(emmitedValue.categoryMaster);
        this.suppBillDate.setValue(emmitedValue.poDate);
        this.poNo.setValue(emmitedValue.poId);
        this.poId.setValue(emmitedValue.poId);
        this.service.getPurchaseOrderDataById(emmitedValue.poId).subscribe((data: any) => {

          this.partyService.getAllBankBranchByPartyId(data.party.partyId, 'SU').subscribe(partyBranchList => {
            this.partyBankBranches = partyBranchList;
          });

          this.party = data.party;
          if (data.generalDetails.bank) {
            this.bankId.setValue(data.generalDetails.bank);
          }
          if (data.bankId) {
            this.suppBankBranchId.setValue(data.bankId);
          }

          this.bankTrCo.setValue(data.party.commonMasterByTermsId.id);
          this.bCreditDays.setValue(data.generalDetails.creditDays);
          setTimeout(() => {
            this.bDueDate.setValue(data.generalDetails.dueDate);
          });

          // const a = this.currList.find( ele => {
          //   if(ele.currName.trim().toUpperCase() == 'RUPEES') {
          //     return true;
          //   }
          // })
          const ab = this.currList.find(ele => {
            if (ele.currId == data.poCurrency) {
              return true;
            }
          })
          
          this.flag = 1;
          this.currencyId.setValue(ab.currId);  //Invoice Currency which is a purchaseOrder Currency
          this.invCurrName = ab.currName.trim().toUpperCase();
          this.invCurrCode = ab.currCode;
          this.selectedCurr = ab.currId;
          this.invExchRate.setValue(data.baseExchangeRate);
          this.prevInvExchRate.setValue(this.invExchRate.value);
          setTimeout(() => {
            this.flag = 0;
          });

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
                  if (!res.toDate || res.toDate <= this.invoiceDate.value) {
                    this.stockExchRate.setValue(res.exchRate);
                    this.setTimeoutStockEffectCalcFunc();
                    this.totalGrossAmountSTK.setValue(parseFloat((data.orderAmountBase / this.stockExchRate.value).toFixed(2)));
                  }
                  flag = 1;
                }
              });
              if (flag != 1) {
                this.loading=false;
                const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
                activeModal.componentInstance.showHide = false;
                activeModal.componentInstance.modalHeader = 'Alert';
                activeModal.componentInstance.modalContent = 'Please Add Stock Exchange Rate for ' + this.stockCurrName + ' To ' + this.baseCurrName + ' Currency in Custom Exchange Rate Screen!';
              }
            });
          });
          this.grossAmount = parseFloat(data.orderAmountBase.toFixed(2));
          this.totalGrossAmount.setValue(this.grossAmount);
          if (this.invCurrName == 'RUPEES') {
            this.changedCurrstat = 1;
          } else if (this.invCurrName == 'DOLLAR') {
            this.changedCurrstat = 0;
          } else {
            this.changedCurrstat = 2;   // for EURO
          }

          this.supplier.setValue(this.party.partyName);
          this.supplierId.setValue(data.party.partyId);
          if (data.contactBankBranch) {
            this.suppBankBranchId.setValue(data.contactBankBranch.id);
          }

          // for purchase order item

          this.purchaseOrderItems = data.purchaseOrderItems;
          this.purchaseOrderItems.forEach(d => {
            d.amount = parseFloat((d.carats * d.rate).toFixed(2));
          })
          this.setting = this.prepareTableSettings();
          this.sourceTab1.load(this.purchaseOrderItems);


          // for stock Effect

          this.itemDetails = [];
          data.orderItems.forEach(itm => {
            const orderItem = new Item();
            orderItem.lotId = itm.lot.lotId;
            orderItem.lotName = itm.lot.lotName;
            orderItem.itemName = itm.item.itemName;
            orderItem.itemId = itm.item.itemId;
            orderItem.itemDesc = itm.itemDesc;
            orderItem.pieces = itm.pieces;
            orderItem.carats = itm.carats;
            orderItem.sellingPrice = itm.sellingPrice;
            orderItem.amount = itm.carats * itm.sellingPrice;
            // if(this.changedCurrstat == 1) {
            //   orderItem.rate = parseFloat((this.weightAvgRate / parseFloat(this.invExchRate.value.toString())).toFixed(2));
            // } else {
            orderItem.rate = this.weightAvgRate;
            // }
            orderItem.tAmount = itm.carats * orderItem.rate;
            orderItem.lotItemId = itm.item.lotItemId;
            orderItem.poDetailId = itm.poDetId;
            this.itemDetails.push(orderItem);       // itemDetails means stockEffect list will always be in dollar
          });
          this.setTimeoutStockEffectCalcFunc();
        });
        this.selectPo = true;
      } else {
        this.purchaseInvoiceForm.disable();
      }
    });
  }

  setTimeoutStockEffectCalcFunc() {
    setTimeout(() => {
      this.totAmt = this.getTotalAmount();
      this.totCarats = this.totalCarats;
      this.wtAvgRate = this.weightAvgRate;

      this.itemDetails.forEach(d => {
        d.rate = this.wtAvgRate;
        d.tAmount = parseFloat((d.carats * d.rate).toFixed(2));
      })
      this.settings = this.prepareSettings();
      this.setTimeoutStockEffect();
    })
  }

  setTimeoutStockEffect() {
    this.source.load(this.itemDetails);
    setTimeout(() => {
      this.totAmt = this.getTotalAmount();
      this.totSellAmountTab2 = this.getTotalSellingAmountTab2;
      this.totTAmount = this.getTAmount;
      this.totCaratsTab2 = this.totalCaratsTab2;
      this.notionalProfit = this.notProfit;
      this.notPerc = this.notProfitPerc;
      this.profitBase.setValue(this.notProfit);
    })
  }

  calculateAfterCurrencychange() {
    if (this.curValChange == true) {
      if (this.invCurrName == 'DOLLAR') {
        this.changedCurrstat = 0;
      } else if (this.invCurrName == 'RUPEES') {
        this.changedCurrstat = 1;
      } else {
        this.changedCurrstat = 2;
      }
    }
    const d = this.getTotalAmount() * this.invExchRate.value;
    this.totalGrossAmount.setValue(parseFloat(d.toFixed(2)));

    //this.totalGrossAmount.setValue(parseFloat(this.totalGrossAmount.value.toString()) * this.stockCurrVsInvCurr);
  }

  onInvExchRateChange(val: any) {
    if (this.flag != undefined && this.flag != 1) {
      if (this.curValChange == true) {
        if (this.stockCurr.value == this.currencyId.value) {
          // this.stockCurrVsInvCurr = 1 / (parseFloat(this.prevInvExchRate.value.toString()));
          this.calculateAfterCurrencychange();
        } else {
          // this.stockCurrVsInvCurr = parseFloat(val.toString());
          this.calculateAfterCurrencychange();
          //this.prevInvExchRate.setValue(this.invExchRate.value);
        }
      } else {
        // const a = parseFloat(val.toString());
        // const b = parseFloat(this.prevInvExchRate.value.toString());
        // const c = parseFloat((a / b).toFixed(2));
        // const d = this.grossAmount * c;
        const d = this.getTotalAmount() * val;
        this.totalGrossAmount.setValue(parseFloat(d.toFixed(2)));
        // this.prevInvExchRate.setValue(this.invExchRate.value);
      }
    }
  }


  private createForm() {
    this.purchaseInvoiceForm = this.fb.group({
      'poId': [''],
      'invoiceId': [this.invoiceId],
      'prefix': ['', Validators.compose([Validators.required])],
      'invoiceNo': ['', Validators.compose([Validators.required])],
      'suffix': ['', Validators.compose([Validators.required])],
      'invoiceDate': ['', Validators.compose([Validators.required])],
      'category': ['', Validators.compose([Validators.required])],
      'supplier': ['', Validators.compose([Validators.required])],
      'supplierId': [''],
      'brokerId': [''],
      'suppBillDate': ['', Validators.compose([Validators.required])],
      'supplierNote': [''],
      'isCompleted': [''],
      'poNo': ['', Validators.compose([Validators.required])], //supplier order no. // change it to poId
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

      'suppBankBranchId': [''],
      'suppBankerNote': [''],
      'stockExchRate': [''],
      'items': [],
      'purchaseItems': [],
      'igst': [''],
      'cgst': [''],
      'sgst': [''],
      'tot': [''],
      'igstAmount': [''],
      'cgstAmount': [''],
      'sgstAmount': [''],
      'totAmount': [''],
      'freight': ['', Validators.compose([Validators.required])],
      'insurance': ['', Validators.compose([Validators.required])],
      'commission': ['', Validators.compose([Validators.required])],
      'discount': ['', Validators.compose([Validators.required])],
      'oded': ['', Validators.compose([Validators.required])],
      'netAmount': ['', Validators.compose([Validators.required])],
      'totalWgtCts': ['', Validators.compose([Validators.required])],
      'netWgtKg': ['', Validators.compose([Validators.required])],
      'boxWgt': ['', Validators.compose([Validators.required])],
      'grossWgt': ['', Validators.compose([Validators.required])],
      'remark': [''],
      'frit': [''],
      'dsc': [''],
      'comm': [''],
      'insur': [''],
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
      'prevInvExchRate': [''],
      'status': [''],
      'totFICDO': [''],
      'totTaxableAmt': [''],
      'brokerage': [''],
      'brok': [''],
      'kattiDifference': [''],
      'profitBase': [''],
      'itemNameSearch': [''],
      'osi': [''],
      'totAmt1': ['']
    });
    this.poId = this.purchaseInvoiceForm.controls['poId']
    this.items = this.purchaseInvoiceForm.controls['items'];
    this.purchaseItems = this.purchaseInvoiceForm.controls['purchaseItems'];
    this.prefix = this.purchaseInvoiceForm.controls['prefix'];
    this.invoiceNo = this.purchaseInvoiceForm.controls['invoiceNo'];
    this.suffix = this.purchaseInvoiceForm.controls['suffix'];
    this.invoiceDate = this.purchaseInvoiceForm.controls['invoiceDate'];
    this.category = this.purchaseInvoiceForm.controls['category'];
    this.supplier = this.purchaseInvoiceForm.controls['supplier'];
    this.supplierId = this.purchaseInvoiceForm.controls['supplierId'];
    this.suppBillDate = this.purchaseInvoiceForm.controls['suppBillDate'];
    this.supplierNote = this.purchaseInvoiceForm.controls['supplierNote'];
    this.brokerId = this.purchaseInvoiceForm.controls['brokerId'];
    this.poNo = this.purchaseInvoiceForm.controls['poNo'];
    this.isCompleted = this.purchaseInvoiceForm.controls['isCompleted'];
    this.sCreditDays = this.purchaseInvoiceForm.controls['sCreditDays'];
    this.sDueDate = this.purchaseInvoiceForm.controls['sDueDate'];
    this.bankId = this.purchaseInvoiceForm.controls['bankId'];
    this.bankTrCo = this.purchaseInvoiceForm.controls['bankTrCo'];
    this.currencyId = this.purchaseInvoiceForm.controls['currencyId'];
    this.bCreditDays = this.purchaseInvoiceForm.controls['bCreditDays'];
    this.bDueDate = this.purchaseInvoiceForm.controls['bDueDate'];
    this.totalGrossAmount = this.purchaseInvoiceForm.controls['totalGrossAmount'];
    this.suppBankBranchId = this.purchaseInvoiceForm.controls['suppBankBranchId'];
    this.suppBankerNote = this.purchaseInvoiceForm.controls['suppBankerNote'];
    this.stockCurr = this.purchaseInvoiceForm.controls['stockCurr'];
    this.invExchRate = this.purchaseInvoiceForm.controls['invExchRate'];
    this.totalGrossAmountSTK = this.purchaseInvoiceForm.controls['totalGrossAmountSTK'];
    this.stockExchRate = this.purchaseInvoiceForm.controls['stockExchRate'];
    this.prevInvExchRate = this.purchaseInvoiceForm.controls['prevInvExchRate'];
    this.baseCurr = this.purchaseInvoiceForm.controls['baseCurr'];
    // tax section
    this.igst = this.purchaseInvoiceForm.controls['igst'];
    this.cgst = this.purchaseInvoiceForm.controls['cgst'];
    this.sgst = this.purchaseInvoiceForm.controls['sgst'];
    this.tot = this.purchaseInvoiceForm.controls['tot'];
    this.igstAmount = this.purchaseInvoiceForm.controls['igstAmount'];
    this.cgstAmount = this.purchaseInvoiceForm.controls['cgstAmount'];
    this.sgstAmount = this.purchaseInvoiceForm.controls['sgstAmount'];
    this.totAmount = this.purchaseInvoiceForm.controls['totAmount'];
    this.freight = this.purchaseInvoiceForm.controls['freight'];
    this.insurance = this.purchaseInvoiceForm.controls['insurance'];
    this.commission = this.purchaseInvoiceForm.controls['commission'];
    this.discount = this.purchaseInvoiceForm.controls['discount'];
    this.oded = this.purchaseInvoiceForm.controls['oded'];
    // bottom section
    this.netAmount = this.purchaseInvoiceForm.controls['netAmount'];
    this.totalWgtCts = this.purchaseInvoiceForm.controls['totalWgtCts'];
    this.netWgtKg = this.purchaseInvoiceForm.controls['netWgtKg'];
    this.boxWgt = this.purchaseInvoiceForm.controls['boxWgt'];
    this.grossWgt = this.purchaseInvoiceForm.controls['grossWgt'];
    this.remark = this.purchaseInvoiceForm.controls['remark'];
    this.frit = this.purchaseInvoiceForm.controls['frit'];
    this.insur = this.purchaseInvoiceForm.controls['insur'];
    this.comm = this.purchaseInvoiceForm.controls['comm'];
    this.dsc = this.purchaseInvoiceForm.controls['dsc'];
    this.otherDed = this.purchaseInvoiceForm.controls['otherDed'];
    this.totalTaxAmount = this.purchaseInvoiceForm.controls['totalTaxAmount'];

    this.itemDesc = this.purchaseInvoiceForm.controls['itemDesc'];
    this.carets = this.purchaseInvoiceForm.controls['carets'];
    this.rate = this.purchaseInvoiceForm.controls['rate'];
    this.lotCtrl = this.purchaseInvoiceForm.controls['lotCtrl'];
    this.item = this.purchaseInvoiceForm.controls['item'];
    this.descCtrl = this.purchaseInvoiceForm.controls['descCtrl'];
    this.piecesCtrl = this.purchaseInvoiceForm.controls['piecesCtrl'];
    this.caratsCtrl = this.purchaseInvoiceForm.controls['caratsCtrl'];
    this.status = this.purchaseInvoiceForm.controls['status'];
    this.totFICDO = this.purchaseInvoiceForm.controls['totFICDO'];
    this.totTaxableAmt = this.purchaseInvoiceForm.controls['totTaxableAmt'];
    this.brokerage = this.purchaseInvoiceForm.controls['brokerage'];
    this.brok = this.purchaseInvoiceForm.controls['brok'];
    this.kattiDifference = this.purchaseInvoiceForm.controls['kattiDifference'];
    this.profitBase = this.purchaseInvoiceForm.controls['profitBase'];
    this.itemNameSearch = this.purchaseInvoiceForm.controls['itemNameSearch'];
    this.osi = this.purchaseInvoiceForm.controls['osi'];
    this.totAmt1 = this.purchaseInvoiceForm.controls['totAmt1'];

    this.lotCtrl.valueChanges.subscribe(val => {
      if (val) {
        this.itemNameSearch.reset();
        this.lotItems = [];
        this.lotItemService.getAllLotItemByLotId(val.lotId).subscribe(res => {
          this.lotItem = res;
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
        this.lotItem.find(ele => {
          if (ele.itemMaster.itemName == val) {
            this.item.setValue(ele);
            return true;
          }
        })
      }
    })


    this.totAmt1.valueChanges.subscribe(val => {
      if (val) {
        this.totalGrossAmount.setValue(val * (this.invExchRate.value == '' ? 1 : this.invExchRate.value));
      }
    })

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
      if (this.currencyId.value && this.flag != 1) {
        if (this.baseCurr.value == this.currencyId.value) {
          this.curValChange = true;
          this.invExchRate.setValue(1);
          this.onInvExchRateChange(this.invExchRate.value);
        } else {
          let check = 0;
          this.exchangeRateList.forEach(res => {
            if (res.exchType == "ST" && res.currencyMasterByToCurrId == this.baseCurr.value
              && res.currencyMasterByFromCurrId == this.currencyId.value) {
              if (!res.toDate || res.toDate <= this.invoiceDate.value) {
                this.curValChange = true;     // setting that currency has been changed
                this.invExchRate.setValue(res.exchRate);
                this.onInvExchRateChange(this.invExchRate.value);
              }
              check = 1;
            }
          });
          if (check != 1) {
            this.curValChange = true;
            this.loading=false;
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
    // this.lotCtrl.valueChanges.subscribe( data => {
    //   if (data) {
    //     this.item.reset();
    //   if(this.category.value) {
    //       this.lotItemService.getAllLotItemByLotId(data.lotId).subscribe( dato => {
    //         this.lotItemList = [];
    //         if(dato) {
    //           dato.forEach(element => {
    //             if(this.category.value == element.itemMaster.categoryMaster.catId) {
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
    //   }
    // }
    // });

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
      if (this.trco) {
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

      if (this.trco) {
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
        const value: Number = parseFloat(val);
        this.frit.setValue(value);
      } else {
        this.frit.setValue(0);
      }
      // this.calculateNetAmount();
      // this.setTimeoutStockEffectCalcFunc();
      // setTimeout(() => {
      //   this.wtAvgRate = this.weightAvgRate;
      // })
    })

    this.insurance.valueChanges.subscribe(val => {
      if (this.insurance.value) {
        const value: Number = parseFloat(val);
        this.insur.setValue(value);
      } else {
        this.insur.setValue(0);
      }
      // this.calculateNetAmount();
      // this.setTimeoutStockEffectCalcFunc();
      // setTimeout(() => {
      //   this.wtAvgRate = this.weightAvgRate;
      // })
    })

    this.commission.valueChanges.subscribe(val => {
      if (this.commission.value) {
        if (isNumber(this.totalGrossAmount.value)) {
          const commissionAmt: number = parseFloat((parseFloat(this.totalGrossAmount.value.toString()) * parseFloat(val) / 100).toFixed(2));
          this.comm.setValue(commissionAmt);
        } else {
          this.comm.setValue(0);
        }
      } else {
        this.comm.setValue(0);
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
        } else {
          this.dsc.setValue(0);
        }
      } else {
        this.dsc.setValue(0);
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
        } else {
          this.otherDed.setValue(0);
        }
      } else {
        this.otherDed.setValue(0);
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
        } else {
          this.brok.setValue(0);
        }
      } else {
        this.brok.setValue(0);
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

  igAmount: Number;
  cgAmount: Number;
  sgAmount: Number;

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
    this.totFICDO.setValue(parseFloat((amount - this.totalGrossAmount.value).toFixed(2)));
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

  getTaxableAmount() {
    let totalGrossAmt: number = 0;
    let amount: number = 0;
    if (this.totalGrossAmount.value) {
      amount = amount + this.totalGrossAmount.value;
    }
    // if(this.frit.value){
    //  amount = amount + this.frit.value;
    // }
    // if(this.insur.value){
    //  amount = amount + this.insur.value;
    // }
    if (this.comm.value) {
      amount = amount + this.comm.value;
    }

    if (this.dsc.value) {
      amount = amount + this.dsc.value;
    }
    if (this.otherDed.value) {
      amount = amount + this.otherDed.value;
    }

    amount = parseFloat(amount.toFixed(2));
    return amount;
  }

  // reCalculateTaxAndGrossAmountOnItemEditDelete(itemList: any[]) {

  //   //calculate gross amount
  //     let totalItemPrice = 0;
  //     itemList.forEach( item=>{
  //       totalItemPrice = item.rate * item.carats;
  //     });
  //     this.grossAmount = parseFloat(totalItemPrice.toFixed(2));
  //     this.totalGrossAmount.setValue(this.grossAmount);
  //     this.totalGrossAmountRs = this.grossAmount;
  //   //recalculate tax and set in ui
  //   this.reCalculateGstTaxAmt();

  //   this.calculateTax();
  //   this.calculateTaxAmount();
  //   this.calculateNetAmount();

  // }

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
      this.loading=false;
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = false;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Net Amount can not be zero or negative!';
      this.errorMsg = 'Net Amount can not be zero or negative!';
      return;
    }

    //  if(!this.invoiceNo.value){
    //   this.errorMsg = "Please enter local purchase invoice no.";
    //   return;
    //  }

    if (!this.prefix.value) {
      this.loading=false;
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = false;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Please select Prefix!';
      this.errorMsg = "Please select prefix."
      return;
    }

    if (!this.suffix.value) {
      this.loading=false;
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = false;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Please select suffix!';
      this.errorMsg = "Please select suffix."
      return;
    }

    if (!this.category.value) {
      this.loading=false;
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = false;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Please select Category!';
      this.errorMsg = "Please select category."
      return;
    }
    // if(!this.suppBillDate.value){
    //   this.errorMsg = "Supplier bill date cannot be empty."
    // }

    if (!this.bankTrCo.value) {
      this.loading=false;
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = false;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Please select Terms!';
      this.errorMsg = "Please select terms."
      return;
    }

    if (!isNumber(this.sCreditDays.value)) {
      this.loading=false;
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = false;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Enter Supplier Credit Days!';
      this.errorMsg = "Enter Supplier credit days."
      return;
    }

    if (this.totalGrossAmount.value <= 0) {
      this.loading=false;
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = false;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Gross Amount can not be zero or negative!';
      this.errorMsg = "Gross Amount can not be zero or negative."
      return;
    }

    if(this.openingStockInvoice){
      if (!this.supplier.value) {
        this.loading=false;
        const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
        activeModal.componentInstance.showHide = false;
        activeModal.componentInstance.modalHeader = 'Alert';
        activeModal.componentInstance.modalContent = 'Please select Supplier!';
        this.errorMsg = "Please select Supplier."
        return;
      }
    }

  }

}
