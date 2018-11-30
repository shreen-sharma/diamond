import { LotItemCreationService } from '../../../../stockManagement/components/lotItemCreation/index';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, Pipe, OnInit } from '@angular/core';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { Observable } from 'rxjs/Observable';
import { Location } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from 'app/core/authentication/authentication.service';
import { Logger } from 'app/core/logger.service';
import { LocalSaleService } from '../localSaleInvoice.service';
import { LocalSaleModal } from './localSale-modal/localSale-modal.component';
import { PartyDetailsService } from 'app/pages/company/components/partyDetails/partyDetails.service';
import { LotService } from 'app/pages/stockManagement/components/lots';
import { CategoryService } from 'app/pages/masters/components/categories/';
import { CurrencyService } from 'app/pages/masters/components/currency/';
import { HierarchyRelationService } from 'app/pages/company/components/hierarchyRelation';
import { CommonModalComponent } from '../../../../../shared/common-modal/common-modal.component';
import { ExchangeRateService } from 'app/pages/masters/components/exchangeRate/exchangeRate.service';
import { JangadConsignmentReturnService } from '../../jangadConsignmentReturn';
import { isNumber } from 'util';
import { PrintInvoiceComponent } from '../../../../../shared/print-invoice/print-invoice.component';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

const log = new Logger('CreateSaleInvoiceComponent');

class AddItemDetails {
  itemId: Number;
  lotItemId: Number;
  lotId: Number;
  lotName: String;
  itemName: String;
  desc: String;
  code: String;
  piece: Number;
  rate: Number;
  carats: Number;
  amount: Number;
  tAmount: number;
  stockItemSellingPrice: number;
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
  selector: 'createSaleInvoice',
  templateUrl: './createSaleInvoice.html',
  styleUrls: ['./createSaleInvoice.scss']
})

export class CreateSaleInvoiceComponent implements OnInit {


  pageTitle = 'Create Sales Invoice for Sales Order';
  salesInvoiceIdParam: string;
  errorMsg: string = null;
  btnDisable: boolean = false;
  invoiceId: number;

  doNotCallInvExchRateChngFunctionWhenValueOne: number;
  orderDate: String;
  party: any;
  categoryMaster: any;
  settings: any;
  salesDetails: any[] = [];
  partyBankBranches: any[] = [];
  printItems: items[] = [];
  bankList: any[];
  selectBank: Number;
  selectBranch: Number;
  bankCrDays: Number;
  grossAmount: number;
  bankDueDate: String;
  localCurrency: any[] = [];
  trco: any[] = [];
  bankTermCon: { id: "", name: "" };
  catMasterList: any[] = [];
  itemDetails: AddItemDetails[] = [];
  invoicePrefixList: any[] = [];
  invoiceSuffixList: any[] = [];
  orderItems: any[] = [];
  customerList: any[] = [];
  cusOrderNo: string;
  contactBankBranch: any;
  customerId: number;
  salesInvoiceNo: number;
  // exchangeRate: number = 1;
  brokerList: any[];
  igstAmountRs: number;
  cgstAmountRs: number;
  sgstAmountRs: number;
  stockExchRateChange: number;
  totalTaxAmountRs: number;
  totAmountRs: number;
  netAmountRs: number;
  convertName: string;
  stockCurrCode: any;
  baseCurrCode: any;
  currList: any[] = [];
  stockCurrName: any;
  baseCurrName: any;
  exchangeRateList: any[] = [];
  salePrice: any;
  lotMasterList: Observable<any>;
  lotItems: any[] = [];
  curValChange: boolean;
  invCurrName: any;
  invCurrCode: any;
  openingStockInvoice: boolean = false;
  loading : boolean = false;
  
  salesInvoiceForm: FormGroup;
  public prefix: AbstractControl;
  public soId: AbstractControl;
  public invoiceNo: AbstractControl; //invoice no
  public suffix: AbstractControl;
  public invoiceDate: AbstractControl;
  public category: AbstractControl;
  public customer: AbstractControl;
  public cusBillDate: AbstractControl;
  public customerNote: AbstractControl;
  public brokerId: AbstractControl;
  // public soNo: AbstractControl; //supplier order no
  public cCreditDays: AbstractControl;
  public cDueDate: AbstractControl;
  public bankId: AbstractControl;
  public bankTrCo: AbstractControl;
  public currencyId: AbstractControl;
  public bCreditDays: AbstractControl;
  public bDueDate: AbstractControl;
  public isCompleted: AbstractControl;
  public provisional: AbstractControl;

  public cusBankBranchId: AbstractControl;
  public cusBankerNote: AbstractControl;
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
  public itemList: AbstractControl;

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
  public totFICDO: AbstractControl;
  public stockCurr: AbstractControl;
  public baseCurr: AbstractControl;
  public invExchRate: AbstractControl;
  public prevInvExchRate: AbstractControl;

  public lot: AbstractControl;
  public item: AbstractControl;
  public rate: AbstractControl;
  public pieces: AbstractControl;
  public carats: AbstractControl;
  public desc: AbstractControl;

  public isDcReturn: AbstractControl;       // status for whether invoice is generating from DC return book sale
  public dcReturnId: AbstractControl;

  public itemName: AbstractControl;
  public osi: AbstractControl;

  lotItemList: any[] = [];
  isView: any;

  search = (text$: Observable<string>) =>
    text$
      .debounceTime(200)
      .distinctUntilChanged()
      .map(term => term.length < 1 ? []
        : this.lotItems.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10));

  sellingAmount: any;
  stockAmount: any;
  public profit: AbstractControl;
  totSellingAmt: any;
  notional: any;
  baseNotional: any;
  public orderAmount: AbstractControl;
  public orderAmountBase: AbstractControl;
  public stockItemSellingPriceCtrl: AbstractControl;
  stockItemSalePrice: number = 0;
  public payableAmount: AbstractControl;
  public payableAmountBase: AbstractControl;
  addOrSubs: AbstractControl;
  public brokerage: AbstractControl;
  public brokerageAmt: AbstractControl;
  totTax: any;
  isViewMode: boolean;
  showSbmtBtn: boolean = true;
  public locsaleId: AbstractControl;
  customerPrint: any; //Used For printing Invoice

  constructor(private router: Router,
    private route: ActivatedRoute,
    private service: LocalSaleService,
    private fb: FormBuilder,
    private partyService: PartyDetailsService,
    private currencyService: CurrencyService,
    private lotService: LotService,
    private lotItemService: LotItemCreationService,
    private excnageService: ExchangeRateService,
    private catService: CategoryService,
    private hierService: HierarchyRelationService,
    private back: Location,
    private authService: AuthenticationService,
    private modalService: NgbModal,
    private dcReturnService: JangadConsignmentReturnService) {

    this.createForm();
    this.isDcReturn.setValue(false);
    this.stockExchRate.setValue(1);
    this.settings = this.prepareSettings();

    this.currencyService.getAllCurrencies().subscribe((currList) => {
      this.localCurrency = currList;
      this.currList = currList;
    });
    this.excnageService.getData().subscribe((exchangeRateList) => {
      this.exchangeRateList = exchangeRateList;
    });
    this.partyService.getPartyByType('CU').subscribe(data => {
      this.customerList = data;
    })
    this.catService.getData().subscribe(res => {
      this.catMasterList = res;
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

    this.partyService.getPartyByType('BR').subscribe(res => {
      this.brokerList = res;
    });
    this.lotMasterList = this.lotService.getData();
    // this.lotItems = this.service.getAllLotItems();    
  }

  ngOnInit(): void {
    if (this.router.url.includes('openingSalesInvoice')) {
      this.openingStockInvoice = true;
      this.osi.setValue(true);
      this.isCompleted.setValue(true);
      this.directSale();
    } else if (this.router.url.includes('viewOpeningSalesInvoice')) {
      this.openingStockInvoice = true;
      this.osi.setValue(true);
      this.route.params.subscribe((params: Params) => {

        this.dcReturnId.setValue(params['retId']);
        this.salesInvoiceIdParam = params['locSaleId'];
        this.isView = params['isView'];
        debugger;
        if (this.salesInvoiceIdParam) {
         if(this.isView == 'true'){
          this.pageTitle = 'View Sales Invoice for Sales Order';
          this.salesInvoiceForm.enable();
          this.btnDisable = true;
          this.showSbmtBtn = true;
          this.service.getSalesInvoiceDataById(this.salesInvoiceIdParam).subscribe(data => {
            if (data) {
              this.pageTitle = 'View Sales Invoice ';
              this.isViewMode = true;
              this.showSbmtBtn = false;
              this.salesInvoiceForm.disable();
            }
            //  else {
            //   this.isViewMode = false;
            //   this.salesInvoiceForm.enable();
            // }
            //this.invoiceId = data.invoiceId;
            // this.isCompleted.setValue(data.completed);
            this.locsaleId.setValue(this.salesInvoiceIdParam);
            this.partyService.getAllBankBranchByPartyId(data.customer, 'CU').subscribe(partyBranchList => {
              // this.grossAmount = data.totalGrossAmount;
              this.partyBankBranches = partyBranchList;
              this.doNotCallInvExchRateChngFunctionWhenValueOne = 1;
           
              this.bDueDate.setValue(data.bDueDate);
              this.cDueDate.setValue(data.cDueDate);
              this.stockCurr.setValue(data.stockCurr);
              this.baseCurr.setValue(data.baseCurr);
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
              this.stockExchRate.setValue(data.stockExchRate);

              this.cusBankBranchId.setValue(data.cusBankBranchId);
              this.soId.setValue(data.soId);
              this.salesInvoiceForm.patchValue(data);
              this.isViewMode = true;
              this.showSbmtBtn = false;
              this.salesInvoiceForm.disable();
              this.salesInvoiceForm.markAsUntouched();
            });
          })
         } else {
          this.pageTitle = 'Edit Sales Invoice for Sales Order';
          this.salesInvoiceForm.enable();
          this.btnDisable = true;
          this.showSbmtBtn = true;
          this.service.getSalesInvoiceDataById(this.salesInvoiceIdParam).subscribe(data => {
            if (data) {
              this.pageTitle = 'View Sales Invoice ';
              this.isViewMode = true;
              this.showSbmtBtn = false;
              this.salesInvoiceForm.disable();
            }
            //  else {
            //   this.isViewMode = false;
            //   this.salesInvoiceForm.enable();
            // }
            //this.invoiceId = data.invoiceId;
            // this.isCompleted.setValue(data.completed);
            this.locsaleId.setValue(this.salesInvoiceIdParam);
            this.partyService.getAllBankBranchByPartyId(data.customer, 'CU').subscribe(partyBranchList => {
              // this.grossAmount = data.totalGrossAmount;
              this.partyBankBranches = partyBranchList;
              this.doNotCallInvExchRateChngFunctionWhenValueOne = 1;
           
              this.bDueDate.setValue(data.bDueDate);
              this.cDueDate.setValue(data.cDueDate);
              this.stockCurr.setValue(data.stockCurr);
              this.baseCurr.setValue(data.baseCurr);
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
              this.stockExchRate.setValue(data.stockExchRate);

              this.cusBankBranchId.setValue(data.cusBankBranchId);
              this.soId.setValue(data.soId);
              this.salesInvoiceForm.patchValue(data);

            });

          })
         }
        } else {
          //   this.service.getNextInvoiceOrderNo().subscribe(data =>{
          //     this.invoiceNo.setValue(data.number);
          //  });
          this.salesInvoiceForm.disable();
          this.btnDisable = false;
        }

        if (this.dcReturnId.value) {
          window.scrollTo(0, 0);
          this.onRouteToInvFromDC();
        } else {
          this.isDcReturn.setValue(false);
        }
      });
    }
    else {
      this.osi.setValue(false);
      this.route.params.subscribe((params: Params) => {

        this.dcReturnId.setValue(params['retId']);
        this.salesInvoiceIdParam = params['locSaleId'];
        this.isView = params['isView'];
        if (this.salesInvoiceIdParam) {
          if(this.isView == 'true'){
            this.pageTitle = 'Edit Sales Invoice for Sales Order';
            this.salesInvoiceForm.enable();
            this.btnDisable = true;
            this.showSbmtBtn = true;
            this.service.getSalesInvoiceDataById(this.salesInvoiceIdParam).subscribe(data => {
              if (params['status'] == 'COMPLETED' && data) {
                this.pageTitle = 'View Sales Invoice for Sales Order';
                this.isViewMode = true;
                this.showSbmtBtn = false;
                this.salesInvoiceForm.disable();
              } else {
                this.isViewMode = false;
                this.salesInvoiceForm.enable();
              }
              //this.invoiceId = data.invoiceId;
              // this.isCompleted.setValue(data.completed);
              this.locsaleId.setValue(this.salesInvoiceIdParam);
              this.partyService.getAllBankBranchByPartyId(data.customer, 'CU').subscribe(partyBranchList => {
                // this.grossAmount = data.totalGrossAmount;
                this.partyBankBranches = partyBranchList;
                this.doNotCallInvExchRateChngFunctionWhenValueOne = 1;
                this.salesInvoiceForm.patchValue(data);
                this.salesInvoiceForm.disable();
                this.isViewMode = true;
                this.showSbmtBtn = false;
                this.salesInvoiceForm.markAsUntouched;
                this.bDueDate.setValue(data.bDueDate);
                this.cDueDate.setValue(data.cDueDate);
                this.stockCurr.setValue(data.stockCurr);
                this.baseCurr.setValue(data.baseCurr);
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
                this.stockExchRate.setValue(data.stockExchRate);
  
                this.cusBankBranchId.setValue(data.cusBankBranchId);
                this.soId.setValue(data.soId);
  
                // this.customerId = data.party.partyId; //supplier of selected order.
                this.itemDetails = [];
                data.itemList.forEach(item => {
  
                  const newItem = new AddItemDetails();
                  newItem.itemId = item.itemId;
                  newItem.lotId = item.lotId;
                  newItem.lotName = item.lotName;
                  newItem.lotItemId = item.lotItemId;
                  newItem.itemName = item.itemName;
                  newItem.code = item.code;
                  newItem.desc = item.desc;
                  newItem.piece = item.piece;
                  newItem.carats = item.carats;
                  newItem.rate = item.rate;
                  newItem.stockItemSellingPrice = item.stockItemSellingPrice;
                  newItem.tAmount = parseFloat((item.carats * item.rate).toFixed(2));
                  newItem.amount = parseFloat((item.carats * item.stockItemSellingPrice).toFixed(2));
                  this.itemDetails.push(newItem);
                });
                this.source.load(this.itemDetails);
                this.orderAmount.setValue(parseFloat(((this.getTAmount * this.invExchRate.value) / this.stockExchRate.value).toFixed(2)));
                this.setTimeoutCalcFunc();
                this.settings = this.prepareSettings();
                setTimeout(() => {
                  this.doNotCallInvExchRateChngFunctionWhenValueOne = 0;
                });
              });
  
            })
          } else{
            this.pageTitle = 'Edit Sales Invoice for Sales Order';
          this.salesInvoiceForm.enable();
          this.btnDisable = true;
          this.showSbmtBtn = true;
          this.service.getSalesInvoiceDataById(this.salesInvoiceIdParam).subscribe(data => {
            if (params['status'] == 'COMPLETED' && data) {
              this.pageTitle = 'View Sales Invoice for Sales Order';
              this.isViewMode = true;
              this.showSbmtBtn = false;
              this.salesInvoiceForm.disable();
            } else {
              this.isViewMode = false;
              this.salesInvoiceForm.enable();
            }
            //this.invoiceId = data.invoiceId;
            // this.isCompleted.setValue(data.completed);
            this.locsaleId.setValue(this.salesInvoiceIdParam);
            this.partyService.getAllBankBranchByPartyId(data.customer, 'CU').subscribe(partyBranchList => {
              // this.grossAmount = data.totalGrossAmount;
              this.partyBankBranches = partyBranchList;
              this.doNotCallInvExchRateChngFunctionWhenValueOne = 1;
              this.salesInvoiceForm.patchValue(data);
              this.bDueDate.setValue(data.bDueDate);
              this.cDueDate.setValue(data.cDueDate);
              this.stockCurr.setValue(data.stockCurr);
              this.baseCurr.setValue(data.baseCurr);
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
              this.stockExchRate.setValue(data.stockExchRate);

              this.cusBankBranchId.setValue(data.cusBankBranchId);
              this.soId.setValue(data.soId);

              // this.customerId = data.party.partyId; //supplier of selected order.
              this.itemDetails = [];
              data.itemList.forEach(item => {

                const newItem = new AddItemDetails();
                newItem.itemId = item.itemId;
                newItem.lotId = item.lotId;
                newItem.lotName = item.lotName;
                newItem.lotItemId = item.lotItemId;
                newItem.itemName = item.itemName;
                newItem.code = item.code;
                newItem.desc = item.desc;
                newItem.piece = item.piece;
                newItem.carats = item.carats;
                newItem.rate = item.rate;
                newItem.stockItemSellingPrice = item.stockItemSellingPrice;
                newItem.tAmount = parseFloat((item.carats * item.rate).toFixed(2));
                newItem.amount = parseFloat((item.carats * item.stockItemSellingPrice).toFixed(2));
                this.itemDetails.push(newItem);
              });
              this.source.load(this.itemDetails);
              this.orderAmount.setValue(parseFloat(((this.getTAmount * this.invExchRate.value) / this.stockExchRate.value).toFixed(2)));
              this.setTimeoutCalcFunc();
              this.settings = this.prepareSettings();
              setTimeout(() => {
                this.doNotCallInvExchRateChngFunctionWhenValueOne = 0;
              });
            });

          })
          }
        } else {
          //   this.service.getNextInvoiceOrderNo().subscribe(data =>{
          //     this.invoiceNo.setValue(data.number);
          //  });
          this.salesInvoiceForm.disable();
          this.btnDisable = false;
        }

        if (this.dcReturnId.value) {
          window.scrollTo(0, 0);
          this.onRouteToInvFromDC();
        } else {
          this.isDcReturn.setValue(false);
        }
      });
    }
  }

  onRouteToInvFromDC() {
    this.salesInvoiceForm.enable();
    this.btnDisable = true;
    this.isDcReturn.setValue(true);
    this.invoiceDate.setValue(this.dateFormate(new Date()));
    this.isCompleted.setValue(false);
    this.provisional.setValue(false);
    this.hierService.getHierById(this.authService.credentials.company).subscribe(da => {

      this.hierService.getHierMasterById(da.hierarchyMaster.hierId).subscribe(res => {
        this.stockCurr.setValue(res.hierarchyDetailRequestDTO.currencyMasterByStockCurrId);
        this.baseCurr.setValue(res.hierarchyDetailRequestDTO.currencyMasterByCurrId);
        this.doNotCallInvExchRateChngFunctionWhenValueOne = 1;
        this.currencyId.setValue(this.stockCurr.value);

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
              this.invExchRate.setValue(res.exchRate);
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

        this.dcReturnService.getJangadCNReturnById(this.dcReturnId.value).subscribe(ele => {
          console.log(ele);

          this.brokerId.setValue(ele.broker);
          this.cusBillDate.setValue(ele.receiptDate);
          this.soId.setValue(this.dcReturnId.value);
          this.customer.setValue(ele.partyId);

          this.dcReturnService.getIssueDetailById(ele.issueNo).subscribe(resp => {
            if (this.catMasterList.length > 0) {
              this.category.setValue(this.catMasterList[0].catId);
            }
            if (resp.bankId) {
              this.cusBankBranchId.setValue(resp.bankId);
            }
            if (resp.bank) {
              this.bankId.setValue(resp.bank);
            }
            if (resp.bankTnC) {
              this.bankTrCo.setValue(resp.bankTnC);
            }
            if (resp.creditDays) {
              this.bCreditDays.setValue(resp.creditDays);
            }
          });
          this.dcReturnService.getAllReturnDetailDataByIssueNo(ele.issueNo).subscribe(respo => {
            const dcReturnItems: any[] = respo;
            this.itemDetails = [];
            dcReturnItems.forEach(item => {
              if (item.selectedCts > 0) {
                const newItem = new AddItemDetails();
                newItem.itemId = item.itemId;
                newItem.lotId = item.lotId;
                newItem.lotName = item.lotName;
                newItem.lotItemId = item.lotItemId;
                newItem.itemName = item.itemName;
                newItem.piece = item.selectedPcs;
                newItem.carats = item.selectedCts;
                newItem.rate = item.agreedRate;
                newItem.stockItemSellingPrice = item.spRate;
                newItem.tAmount = parseFloat((item.selectedCts * item.agreedRate).toFixed(2));
                newItem.amount = parseFloat((item.selectedCts * item.spRate).toFixed(2));
                this.itemDetails.push(newItem);
              }
            });
            this.source.load(this.itemDetails);
            this.orderAmount.setValue(parseFloat(((this.getTAmount * this.invExchRate.value) / this.stockExchRate.value).toFixed(2)));
            this.setTimeoutCalcFunc();
            this.settings = this.prepareSettings();
          })
        })

        setTimeout(() => {
          this.doNotCallInvExchRateChngFunctionWhenValueOne = 0;
        });
      });
    });

  }

  onEditConfirm(event: any): void {
    this.lotItemService.getLotItemCreationById(event.data.lotItemId).subscribe(data => {
      const availCarats = data.totalCarets;
      if (event.newData.carats <= 0 && event.newData.rate <= 0) {
        const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
        activeModal.componentInstance.showHide = false;
        activeModal.componentInstance.modalHeader = 'Alert';
        activeModal.componentInstance.modalContent = 'Carats and Rate should be greater than 0!';
        event.confirm.reject();
      } else if (event.newData.carats > availCarats) {
        const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
        activeModal.componentInstance.showHide = false;
        activeModal.componentInstance.modalHeader = 'Alert';
        activeModal.componentInstance.modalContent = 'Carats should not be greater than available carats i.e ' + availCarats + ' Cts!!';
      } else {
        let index = 0;
        this.itemDetails.forEach(element => {
          const avc = <any>element;
          if (avc.lotItemId == event.data.lotItemId) {
            const ac = <any>this.itemDetails[index];
            ac.desc = event.newData.desc;
            ac.carats = ((parseFloat(event.newData.carats)).toFixed(2));
            ac.rate = ((parseFloat(event.newData.rate)).toFixed(2));
            ac.amount = ((parseFloat(event.newData.carats) * parseFloat(event.newData.stockItemSellingPrice)).toFixed(2));
            ac.tAmount = ((parseFloat(event.newData.carats) * parseFloat(event.newData.rate)).toFixed(2));
          } else {
            index++;
          }
        });
        this.source.load(this.itemDetails);
        this.orderAmount.setValue(parseFloat(((this.getTAmount * this.invExchRate.value) / this.stockExchRate.value).toFixed(2)));
        this.setTimeoutCalcFunc();
        this.reCalculateTaxAndGrossAmountOnItemEditDelete();
      }
    });
  }

  handleAdd() {
    if (this.isDcReturn.value) {
      this.rate.reset();
      this.carats.reset();
      this.pieces.reset();
      this.desc.reset()
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = false;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Cannot Add Item in DC Return Book Sale Mode!!';
    } else {
      if (this.carats.value && this.rate.value && this.lot.value && this.item.value) {
        if (this.carats.value <= 0) {
          const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
          activeModal.componentInstance.showHide = false;
          activeModal.componentInstance.modalHeader = 'Alert';
          activeModal.componentInstance.modalContent = 'Carats should be greater than 0!';
        } else if (this.rate.value <= 0) {
          const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
          activeModal.componentInstance.showHide = false;
          activeModal.componentInstance.modalHeader = 'Alert';
          activeModal.componentInstance.modalContent = 'Rate should be greater than 0!';
        } else if (this.carats.value > this.item.value.totalCarets) {
          const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
          activeModal.componentInstance.showHide = false;
          activeModal.componentInstance.modalHeader = 'Alert';
          activeModal.componentInstance.modalContent = 'Carats should not be greater than available carats i.e ' + this.item.value.totalCarets + ' Cts!!';
        } else if (this.itemDetails.length > 0) {
          let flag = 0;
          this.itemDetails.forEach(ele => {
            if (ele.lotItemId == this.item.value.lotItemId) {
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
            orderItem.desc = this.desc.value;
            orderItem.itemId = this.item.value.itemMaster.itemId;
            orderItem.carats = this.carats.value;
            if (this.pieces.value) {
              orderItem.piece = this.pieces.value;
            } else {
              orderItem.piece = 0;
            }
            orderItem.rate = this.rate.value;
            orderItem.lotItemId = this.item.value.lotItemId;
            orderItem.lotId = this.lot.value.lotId;
            orderItem.lotName = this.lot.value.lotName;
            orderItem.tAmount = parseFloat((this.carats.value * this.rate.value).toFixed(2));
            orderItem.stockItemSellingPrice = this.stockItemSalePrice;
            orderItem.amount = parseFloat((this.carats.value * this.stockItemSalePrice).toFixed(2));
            this.itemDetails.push(orderItem);
            this.source.load(this.itemDetails);
            this.orderAmount.setValue(parseFloat(((this.getTAmount * this.invExchRate.value) / this.stockExchRate.value).toFixed(2)));
            this.setTimeoutCalcFunc();
            this.rate.reset();
            this.carats.reset();
            this.pieces.reset();
            this.desc.reset();
          }
        } else {
          const orderItem = new AddItemDetails();
          orderItem.itemName = this.item.value.itemMaster.itemName;
          orderItem.desc = this.desc.value;
          orderItem.itemId = this.item.value.itemMaster.itemId;
          orderItem.carats = this.carats.value;
          if (this.pieces.value) {
            orderItem.piece = this.pieces.value;
          } else {
            orderItem.piece = 0;
          }
          orderItem.rate = this.rate.value;
          orderItem.lotId = this.lot.value.lotId;
          orderItem.lotItemId = this.item.value.lotItemId;
          orderItem.lotName = this.item.value.lotMaster.lotName;//this.lot.value.lotName;//this.item.value.lotName;
          orderItem.tAmount = parseFloat((this.carats.value * this.rate.value).toFixed(2));
          orderItem.stockItemSellingPrice = this.stockItemSalePrice;
          orderItem.amount = parseFloat((this.carats.value * this.stockItemSalePrice).toFixed(2));
          this.itemDetails.push(orderItem);
          this.source.load(this.itemDetails);
          this.orderAmount.setValue(parseFloat(((this.getTAmount * this.invExchRate.value) / this.stockExchRate.value).toFixed(2)));
          this.setTimeoutCalcFunc();
          this.rate.reset();
          this.carats.reset();
          this.pieces.reset();
          this.desc.reset();
        }
      }
    }
  }

  onDeleteConfirm(event: any): void {
    if (this.isDcReturn.value) {
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = false;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Cannot Delete Item in DC Return Book Sale Mode!!';
    } else {
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
              this.source.load(this.itemDetails);
              event.confirm.resolve();
              this.orderAmount.setValue(parseFloat(((this.getTAmount * this.invExchRate.value) / this.stockExchRate.value).toFixed(2)));
              this.setTimeoutCalcFunc();
              this.reCalculateTaxAndGrossAmountOnItemEditDelete();
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
        display: false
      },
      columns: {
        lotName: {
          title: 'Lot',
          type: 'text',
          filter: false,
          editable: false,
        },
        itemName: {
          title: 'Item Name',
          type: 'text',
          filter: false,
          editable: false,
        },
        desc: {
          title: 'Item Description',
          type: 'text',
          filter: false,
          editable: true,
          valuePrepareFunction: value => {
            if (value == '' || value == null) {
              return '-';
            } else {
              return value;
            }
          }
        },
        piece: {
          title: 'Pieces',
          type: 'text',
          filter: false,
          editable: false,
        },
        carats: {
          title: 'Total Carats',
          type: 'text',
          filter: false,
          editable: !this.isDcReturn.value,
        },
        stockItemSellingPrice: {
          title: 'Selling Price (USD)',
          type: 'number',
          editable: false,
          valuePrepareFunction: (value) => {
            return value;
          }
        },
        amount: {
          title: 'Selling Amount (USD)',
          type: 'text',
          editable: false,
        },
        rate: {
          title: 'Rate',
          type: 'text',
          editable: !this.isDcReturn.value,
        },
        tAmount: {
          title: 'Total Amount',
          type: 'text',
          editable: false,
        },
      }
    };
  }
  source: LocalDataSource = new LocalDataSource();

  submit() {
    this.loading = true;
    //this.soId.setValue(this.soNo);
    if (this.salesInvoiceIdParam) {
      this.locsaleId.setValue(this.salesInvoiceIdParam);
    }
    this.validateRequiredField();
    if (this.errorMsg) {
      this.loading = false;
      return; //TODO: Need to add client side validation.
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
      if (this.salesInvoiceForm.value) {
        this.itemList.setValue(this.itemDetails);
        this.lot.setValue('');
        this.item.setValue('');
        const formValue: any = this.salesInvoiceForm.value;
        //formValue.customerId = this.customerId;
        // formValue.contactBankBranch = this.contactBankBranch;
        this.service.addOpeningStockLocalSalesOrderInvoice(formValue).subscribe(resp => {
          // if (this.isDcReturn.value && this.dcReturnId.value != null && this.dcReturnId.value != '') {
          //   this.router.navigate(['../../deliveryChallanReturn'], { relativeTo: this.route });
          //   const activeModal = this.modalService.open(CommonModalComponent, { size: 'lg' });
          //   activeModal.componentInstance.showHide = true;
          //   activeModal.componentInstance.modalHeader = 'Alert';
          //   activeModal.componentInstance.modalContent = 'Sales Invoice has been successfully Submitted!! Do you want to Generate the Print of DC Return Memo - No.' + this.dcReturnId.value + ' ??';
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
    } else {
      if (this.salesInvoiceForm.value && this.itemDetails.length > 0) {
        this.itemList.setValue(this.itemDetails);
        this.lot.setValue('');
        this.item.setValue('');
        const formValue: any = this.salesInvoiceForm.value;
        //formValue.customerId = this.customerId;
        // formValue.contactBankBranch = this.contactBankBranch;
        this.service.createSalesInvoice(formValue).subscribe(resp => {
          if (this.isDcReturn.value && this.dcReturnId.value != null && this.dcReturnId.value != '') {
            this.router.navigate(['../../deliveryChallanReturn'], { relativeTo: this.route });
            this.loading = false;
            const activeModal = this.modalService.open(CommonModalComponent, { size: 'lg' });
            activeModal.componentInstance.showHide = true;
            activeModal.componentInstance.modalHeader = 'Alert';
            activeModal.componentInstance.modalContent = 'Sales Invoice has been successfully Submitted!! Do you want to Generate the Print of DC Return Memo - No.' + this.dcReturnId.value + ' ??';
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
      } else {
        this.showSbmtBtn = true;
        this.loading = false;
        const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
        activeModal.componentInstance.showHide = true;
        activeModal.componentInstance.modalHeader = 'Alert';
        activeModal.componentInstance.modalContent = 'Please Add Some Item for Local Sale!!'
      }
    }
  }

  validP() {
    if (this.salesInvoiceIdParam) {
      this.loading = false;
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
      this.catMasterList.forEach(element => {
        debugger;
        if (element.catId == this.category.value) {
          hsnNo = element.statisticalCode;
        }
      })
    }
    let i = 1;
    this.printItems = [];
    this.itemDetails.forEach(ele => {
      const newItem = new items;
      newItem.si = i;
      i++;
      newItem.description = ele.desc;
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
    this.loading = false;
    const activeModal = this.modalService.open(PrintInvoiceComponent, { size: 'lg' });
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
    activeModal.componentInstance.invoiceNo = ('LOC/' + this.salesInvoiceIdParam); // This will be issue no_return no combination
    activeModal.componentInstance.items = this.printItems;  // item list with columns(si, description, pcs, carats, rate)
    activeModal.componentInstance.totalPcs = totalP;
    activeModal.componentInstance.printDate = this.invoiceDate.value;
    activeModal.componentInstance.totalCarats = parseFloat(totalC.toFixed(3));
    activeModal.componentInstance.tAmount = parseFloat(totalA.toFixed(2));
    activeModal.componentInstance.avgRate = parseFloat(cumuRate.toFixed(2));
    activeModal.componentInstance.hsnNo = hsnNo;
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
    debugger;
    this.loading = false;
    const activeModal = this.modalService.open(LocalSaleModal, { size: 'lg' });
    activeModal.componentInstance.modalHeader = 'Sales Order Details';
    activeModal.componentInstance.emitService.subscribe((emmitedValue) => {
      if (emmitedValue) {
        this.invoiceDate.setValue(this.dateFormate(new Date()));
        if (emmitedValue.status == 'COMPLETED') {
          this.isCompleted.setValue(true);
        } else {
          this.isCompleted.setValue(false);
        }
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
                  //Yasar Added
                  this.calculateNetAmount()
                  // this.setTimeoutStockEffectCalcFunc();
                  // this.totalGrossAmountSTK.setValue(parseFloat((data.orderAmountBase / this.stockExchRate.value).toFixed(2)));
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
        // if(this.baseCurr.value == this.currencyId.value) {
        //   this.curValChange = true;
        //   this.invExchRate.setValue(1);
        //  // this.onInvExchRateChange(this.invExchRate.value);
        // } else {
        //   let check = 0;
        //   this.exchangeRateList.forEach(res => {
        //     if(res.exchType == "ST" && res.currencyMasterByToCurrId == this.baseCurr.value
        //      && res.currencyMasterByFromCurrId == this.currencyId.value) {
        //       if(!res.toDate || res.toDate <= this.invoiceDate.value) {
        //         this.curValChange = true;     // setting that currency has been changed
        //         this.invExchRate.setValue(res.exchRate);
        //        // this.onInvExchRateChange(this.invExchRate.value);
        //       }
        //       check = 1;
        //     }
        //   });
        //   if(check != 1) {
        //     if (!this.stockCurr && !this.baseCurr){
        //       this.curValChange = true;
        //       const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
        //       activeModal.componentInstance.showHide = false;
        //       activeModal.componentInstance.modalHeader = 'Alert';
        //       activeModal.componentInstance.modalContent = 'Please Add Invoice Exchange Rate or Change your Currency!';
        //     }
        //   }
        // }
        // this.invExchRate.setValue()
        // this.orderDate = emmitedValue.poDate;


        //const purchaseNo = parseInt(emmitedValue.poNo);
        // this.cusOrderNo = emmitedValue.soNo;
        // this.soNo.setValue(emmitedValue.soId);
        this.service.getSalesOrderById(emmitedValue.soId).subscribe((data: any) => {

          this.doNotCallInvExchRateChngFunctionWhenValueOne = 1;
          this.currencyId.setValue(data.soCurrency);
          this.invExchRate.setValue(data.baseExchangeRate);
          this.party = data.party;
          this.partyService.getAllBankBranchByPartyId(data.party.partyId, 'CU').subscribe(partyBranchList => {
            ;
            this.partyBankBranches = partyBranchList;
          });
          this.cusBankBranchId.setValue(data.bankId);
          this.itemDetails = [];
          data.orderItems.forEach(itm => {
            ;
            const orderItem = new AddItemDetails();
            orderItem.itemName = itm.item.itemName;
            orderItem.code = itm.item.itemCode;
            orderItem.desc = itm.itemDesc;
            orderItem.itemId = itm.item.itemId;
            orderItem.carats = itm.carats;
            orderItem.amount = parseFloat((itm.amount * 1).toFixed(2));
            if (itm.pieces) {
              orderItem.piece = itm.pieces;
            } else {
              orderItem.piece = 0;
            }
            orderItem.rate = itm.rate;
            orderItem.tAmount = parseFloat((itm.rate * itm.carats).toFixed(2));
            orderItem.stockItemSellingPrice = itm.sellingPrice;
            orderItem.lotId = itm.lot.lotId;
            orderItem.lotName = itm.lot.lotName;
            orderItem.lotItemId = itm.item.lotItemId;
            this.itemDetails.push(orderItem);
          });

          this.source.load(this.itemDetails);
          this.settings = this.prepareSettings();
          const date: any[] = data.soDate.split('-');
          const newDate = (date[2] + '-' + date[1] + '-' + date[0]);
          this.cusBillDate.setValue(newDate);
          this.soId.setValue(data.soNo); // Customer order no
          //this.currencyId.setValue(data.salesDetails.localCurrency);
          this.bankTrCo.setValue(data.salesDetails.bankTnC);
          this.bCreditDays.setValue(data.salesDetails.creditDays);
          setTimeout(() => {
            this.bDueDate.setValue(data.salesDetails.dueDate);
          });
          this.customer.setValue(data.party.partyId);
          this.bankId.setValue(data.salesDetails.bank);
          // this.notional = parseFloat((data.profit).toFixed(2));
          this.orderAmountBase.setValue(data.orderAmountBase);
          this.orderAmount.setValue(data.orderAmount);
          this.setTimeoutCalcFunc();


          //  if(this.baseCurr.value == this.currencyId.value) {
          //   this.curValChange = true;
          //   this.invExchRate.setValue(1);
          //  // this.onInvExchRateChange(this.invExchRate.value);
          // } else {
          //   let check = 0;
          //   this.exchangeRateList.forEach(res => {
          //     if(res.exchType == "ST" && res.currencyMasterByToCurrId == this.baseCurr.value
          //      && res.currencyMasterByFromCurrId == this.currencyId.value) {
          //       if(!res.toDate || res.toDate <= this.invoiceDate.value) {
          //         this.curValChange = true;     // setting that currency has been changed
          //         this.invExchRate.setValue(res.exchRate);
          //        // this.onInvExchRateChange(this.invExchRate.value);
          //       }
          //       check = 1;
          //     }
          //   });
          //   if(check != 1) {
          //     if(!this.currencyId.value){
          //       this.curValChange = true;
          //     const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
          //     activeModal.componentInstance.showHide = false;
          //     activeModal.componentInstance.modalHeader = 'Alert';
          //     activeModal.componentInstance.modalContent = 'Please Add Invoice Exchange Rate or Change your Currency!';
          //     }          
          //   }
          // }
        });
        this.category.setValue(emmitedValue.categoryMaster);
        this.salesInvoiceForm.enable();
        this.btnDisable = true;
        setTimeout(() => {
          this.doNotCallInvExchRateChngFunctionWhenValueOne = 0;
        });
      } else {
        this.salesInvoiceForm.disable();
      }
    });

  }

  directSale() {
    this.btnDisable = true;
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
    this.salesInvoiceForm.enable();
    this.soId.disable();
    this.settings = this.prepareSettings();
  }

  getColTotal(colName: string): number {
    let total: number;
    total = 0;
    this.itemDetails.forEach(row => {
      total += parseFloat(row[colName]);
    });
    return parseFloat(total.toFixed(3));
  }

  setTimeoutCalcFunc() {
    // this.itemDetails.forEach(element => {
    //   const ac = <any>element;
    //   ac.controls['tAmount'].setValue((parseFloat(ac.value.carats) * parseFloat(ac.value.rate)).toFixed(2));
    // });
    if (!this.openingStockInvoice)
      this.orderAmountBase.setValue(parseFloat((this.getTAmount * this.invExchRate.value).toFixed(2)));

    setTimeout(() => {
      this.sellingAmount = this.getTotalAmount;
      this.stockAmount = this.getTAmount;
      this.totSellingAmt = parseFloat((this.sellingAmount / this.totalCarats).toFixed(2));
      this.notional = this.notProfit;
      this.profit.setValue(this.notProfit);
      this.baseNotional = parseFloat((this.notional * this.stockExchRate.value).toFixed(2));
    });
  }

  get getTotalAmount(): number {
    return parseFloat((this.getColTotal('amount')).toFixed(2));
  }
  get getTAmount(): number {
    return parseFloat((this.getColTotal('tAmount')).toFixed(2));
  }
  get avgRate(): number {
    const totRate = parseFloat((this.getColTotal('tAmount')).toFixed(2));
    return parseFloat((((totRate / this.totalCarats) * this.invExchRate.value) / this.stockExchRate.value).toFixed(2));
  }

  get totalCarats(): number {
    return parseFloat((this.getColTotal('carats')).toFixed(3));
  }

  get notProfit(): number {
    if (this.totTax) {
      if (this.sellingAmount && this.getTAmount) {
        return parseFloat((((this.getTAmount * this.invExchRate.value) / this.stockExchRate.value) - this.sellingAmount - (this.brokerageAmt.value / this.stockExchRate.value) + (this.totTax / this.stockExchRate.value)).toFixed(2));
      }
    } else {
      if (this.sellingAmount && this.getTAmount) {
        return parseFloat((((this.getTAmount * this.invExchRate.value) / this.stockExchRate.value) - this.sellingAmount - (this.brokerageAmt.value / this.stockExchRate.value)).toFixed(2));
      }
    }

  }

  onInvExchRateChange(event: any) {
    if (this.doNotCallInvExchRateChngFunctionWhenValueOne != undefined && this.doNotCallInvExchRateChngFunctionWhenValueOne != 1) {
      this.invExchRate.setValue(event);
      this.orderAmount.setValue(parseFloat(((this.getTAmount * this.invExchRate.value) / this.stockExchRate.value).toFixed(2)));
    }
  }

  private createForm() {
    this.salesInvoiceForm = this.fb.group({
      'soId': [''],
      'invoiceId': [this.invoiceId],
      'prefix': [''],
      'invoiceNo': [''],
      'suffix': [''],
      'invoiceDate': [''],
      'category': [''],
      'customer': [''],
      'brokerId': [''],
      'cusBillDate': [''],
      'customerNote': [''],
      'isCompleted': [''],
      'provisional': [''],
      //'soNo': [''], //Customer order no.
      'cCreditDays': [''],
      'cDueDate': [''],
      'bankId': [''],
      'bankTrCo': [''],
      'currencyId': [''],
      'bCreditDays': [''],
      'bDueDate': [''],
      // 'totalGrossAmount': ['', Validators.compose([Validators.required])],

      'cusBankBranchId': [''],
      'cusBankerNote': [''],
      'stockExchRate': [''],
      'itemList': [''],
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
      'frit': [''],
      'dsc': [''],
      'comm': [''],
      'insur': [''],
      'otherDed': [''],
      'totalTaxAmount': [''],
      'totFICDO': [''],
      'baseCurr': [''],
      'stockCurr': [''],
      'invExchRate': [''],
      'prevInvExchRate': [''],
      'lot': [''],
      'item': [''],
      'rate': [''],
      'pieces': [''],
      'carats': [''],
      'desc': [''],
      'orderAmount': [''],
      'orderAmountBase': [''],
      'profit': [''],
      'stockItemSellingPrice': [''],
      'payableAmount': [''],
      'payableAmountBase': [''],
      //'addOrSubs': [''],
      'brokerage': [''],
      'brokerageAmt': [''],
      'locsaleId': [''],
      'isDcReturn': [''],
      'dcReturnId': [''],
      'itemName': [''],
      'osi': [''],
    });
    this.soId = this.salesInvoiceForm.controls['soId'];
    this.itemList = this.salesInvoiceForm.controls['itemList'];
    this.prefix = this.salesInvoiceForm.controls['prefix'];
    this.invoiceNo = this.salesInvoiceForm.controls['invoiceNo'];
    this.suffix = this.salesInvoiceForm.controls['suffix'];
    this.invoiceDate = this.salesInvoiceForm.controls['invoiceDate'];
    this.category = this.salesInvoiceForm.controls['category'];
    this.customer = this.salesInvoiceForm.controls['customer'];
    this.cusBillDate = this.salesInvoiceForm.controls['cusBillDate'];
    this.customerNote = this.salesInvoiceForm.controls['customerNote'];
    this.brokerId = this.salesInvoiceForm.controls['brokerId'];
    //this.soNo = this.salesInvoiceForm.controls['soNo'];
    this.isCompleted = this.salesInvoiceForm.controls['isCompleted'];
    this.provisional = this.salesInvoiceForm.controls['provisional'];
    this.cCreditDays = this.salesInvoiceForm.controls['cCreditDays'];
    this.cDueDate = this.salesInvoiceForm.controls['cDueDate'];
    this.bankId = this.salesInvoiceForm.controls['bankId'];
    this.bankTrCo = this.salesInvoiceForm.controls['bankTrCo'];
    this.currencyId = this.salesInvoiceForm.controls['currencyId'];
    this.bCreditDays = this.salesInvoiceForm.controls['bCreditDays'];
    this.bDueDate = this.salesInvoiceForm.controls['bDueDate'];
    // this.totalGrossAmount = this.salesInvoiceForm.controls['totalGrossAmount'];
    this.cusBankBranchId = this.salesInvoiceForm.controls['cusBankBranchId'];
    this.cusBankerNote = this.salesInvoiceForm.controls['cusBankerNote'];
    this.stockExchRate = this.salesInvoiceForm.controls['stockExchRate'];
    // tax section
    this.igst = this.salesInvoiceForm.controls['igst'];
    this.cgst = this.salesInvoiceForm.controls['cgst'];
    this.sgst = this.salesInvoiceForm.controls['sgst'];
    this.tot = this.salesInvoiceForm.controls['tot'];
    this.igstAmount = this.salesInvoiceForm.controls['igstAmount'];
    this.cgstAmount = this.salesInvoiceForm.controls['cgstAmount'];
    this.sgstAmount = this.salesInvoiceForm.controls['sgstAmount'];
    this.totAmount = this.salesInvoiceForm.controls['totAmount'];
    this.freight = this.salesInvoiceForm.controls['freight'];
    this.insurance = this.salesInvoiceForm.controls['insurance'];
    this.commission = this.salesInvoiceForm.controls['commission'];
    this.discount = this.salesInvoiceForm.controls['discount'];
    this.oded = this.salesInvoiceForm.controls['oded'];
    // bottom section
    this.netAmount = this.salesInvoiceForm.controls['netAmount'];
    this.totalWgtCts = this.salesInvoiceForm.controls['totalWgtCts'];
    this.netWgtKg = this.salesInvoiceForm.controls['netWgtKg'];
    this.boxWgt = this.salesInvoiceForm.controls['boxWgt'];
    this.grossWgt = this.salesInvoiceForm.controls['grossWgt'];
    this.remark = this.salesInvoiceForm.controls['remark'];
    this.frit = this.salesInvoiceForm.controls['frit'];
    this.insur = this.salesInvoiceForm.controls['insur'];
    this.comm = this.salesInvoiceForm.controls['comm'];
    this.dsc = this.salesInvoiceForm.controls['dsc'];
    this.otherDed = this.salesInvoiceForm.controls['otherDed'];
    this.totalTaxAmount = this.salesInvoiceForm.controls['totalTaxAmount'];
    this.totFICDO = this.salesInvoiceForm.controls['totFICDO'];
    this.baseCurr = this.salesInvoiceForm.controls['baseCurr'];
    this.invExchRate = this.salesInvoiceForm.controls['invExchRate'];
    this.stockCurr = this.salesInvoiceForm.controls['stockCurr'];
    this.prevInvExchRate = this.salesInvoiceForm.controls['prevInvExchRate'];
    this.lot = this.salesInvoiceForm.controls['lot'];
    this.item = this.salesInvoiceForm.controls['item'];
    this.rate = this.salesInvoiceForm.controls['rate'];
    this.pieces = this.salesInvoiceForm.controls['pieces'];
    this.carats = this.salesInvoiceForm.controls['carats'];
    this.desc = this.salesInvoiceForm.controls['desc'];
    this.orderAmount = this.salesInvoiceForm.controls['orderAmount'];
    this.orderAmountBase = this.salesInvoiceForm.controls['orderAmountBase'];
    this.profit = this.salesInvoiceForm.controls['profit'];
    this.stockItemSellingPriceCtrl = this.salesInvoiceForm.controls['stockItemSellingPrice'];
    this.payableAmount = this.salesInvoiceForm.controls['payableAmount'];
    this.payableAmountBase = this.salesInvoiceForm.controls['payableAmountBase'];
    //this.addOrSubs = this.salesInvoiceForm.controls['addOrSubs'];
    this.brokerage = this.salesInvoiceForm.controls['brokerage'];
    this.brokerageAmt = this.salesInvoiceForm.controls['brokerageAmt'];
    this.locsaleId = this.salesInvoiceForm.controls['locsaleId'];
    this.isDcReturn = this.salesInvoiceForm.controls['isDcReturn'];
    this.dcReturnId = this.salesInvoiceForm.controls['dcReturnId'];
    this.itemName = this.salesInvoiceForm.controls['itemName'];
    this.osi = this.salesInvoiceForm.controls['osi'];

    // this.addOrSubs.valueChanges.subscribe(data =>{
    //   if(!data){
    //     this.sign = '-';
    //   } else{
    //     this.sign = '+';
    //   }
    //   this.calculateNetAmount();
    // })
    this.lot.valueChanges.subscribe(val => {
      console.log(val);
      this.itemName.setValue('');
      this.lotItems = [];
      if (val) {
        this.lotItemService.getAllLotItemByLotId(val.lotId).subscribe(data => {
          let i = 0;
          this.lotItemList = data;
          data.forEach(element => {
            this.lotItems[i] = element.itemMaster.itemName;
            i++;
          });
        })
      }
    })

    this.itemName.valueChanges.subscribe(val => {
      if (val) {
        this.lotItemList.find(ele => {
          if (ele.itemMaster.itemName == val) {
            this.item.setValue(ele);
            return true;
          }
        })
      }
    });


    this.item.valueChanges.subscribe(data => {
      if (this.itemName.value) {
        if (data) {
          if (data.itemMaster.salePrice) {
            this.salePrice = data.itemMaster.salePrice;
            this.stockItemSalePrice = data.itemMaster.salePrice;
            this.stockItemSellingPriceCtrl.setValue(data.itemMaster.salePrice);
          } else {
            this.salePrice = 0;
            this.stockItemSalePrice = 0;
            this.stockItemSellingPriceCtrl.setValue(0);
          }
        }
      }
    });

    this.customer.valueChanges.subscribe(data => {
      if (data) {
        console.log(data);
        this.customerPrint = data;
        this.partyBankBranches = [];
        this.partyService.getAllBankBranchByPartyId(data, 'CU').subscribe(partyBranchList => {
          ;
          let i = 0;
          partyBranchList.forEach(element => {
            this.partyBankBranches[i] = element;
            i++;
          });

        });
      }
    });

    this.orderAmount.valueChanges.subscribe(ele => {
      if (this.openingStockInvoice) {
        this.orderAmountBase.setValue(ele * this.stockExchRate.value);
      }
      this.reCalculateTaxAndGrossAmountOnItemEditDelete();
      this.commission.setValue(this.commission.value);
      this.discount.setValue(this.discount.value);
      this.oded.setValue(this.oded.value);
      this.brokerage.setValue(this.brokerage.value);
      this.reCalculateTaxAndGrossAmountOnItemEditDelete();

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
            if (!this.baseCurr && !this.stockCurr) {
              this.curValChange = true;
              this.loading = false;
              const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
              activeModal.componentInstance.showHide = false;
              activeModal.componentInstance.modalHeader = 'Alert';
              activeModal.componentInstance.modalContent = 'Please Add Invoice Exchange Rate or Change your Currency!';
            }
          }
        }
      }
    });

    this.cusBillDate.valueChanges.subscribe(val => {
      if (val != "" && val != null) {
        const suppDate = val.split('-');
        const invDate = this.invoiceDate.value.split('-');

        const sDate = new Date(suppDate[0], suppDate[1], suppDate[2]);
        const iDate = new Date(invDate[2], invDate[1], invDate[0]);
        if (sDate < iDate) {
          this.errorMsg = "Supplier date can not be less than invoice date.";
          return;
        } else {
          this.errorMsg = "";
        }
      }

    })

    this.bankTrCo.valueChanges.subscribe(val => {
      if (val) {
        if (isNumber(this.bCreditDays.value)) {
          this.bCreditDays.setValue(this.bCreditDays.value);
        } else {
          this.bCreditDays.setValue(0);
        }
        if (isNumber(this.cCreditDays.value)) {
          this.cCreditDays.setValue(this.cCreditDays.value);
        } else {
          this.cCreditDays.setValue(0);
        }
      }
    });

    this.cCreditDays.valueChanges.subscribe(val => {
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
            this.cDueDate.setValue((dd < 10 ? '0' + dd : dd) + '-' + (mm < 10 ? '0' + mm : mm) + '-' + yyyy);
          }
        })
      }
      // else {
      //   this.cDueDate.setValue(this.bDueDate.value);
      // }
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
    this.totAmount.valueChanges.subscribe(resp => {
      if (this.totFICDO.value) {
        this.payableAmount.setValue(parseFloat(((resp + this.totFICDO.value) / this.stockExchRate.value).toFixed(2)));
        this.payableAmountBase.setValue(parseFloat((this.payableAmount.value * this.stockExchRate.value).toFixed(2)));
      } else {
        this.payableAmount.setValue(parseFloat((resp / this.stockExchRate.value).toFixed(2)));
        this.payableAmountBase.setValue(parseFloat((this.payableAmount.value * this.stockExchRate.value).toFixed(2)));
      }
    });

    this.totFICDO.valueChanges.subscribe(data => {
      if (this.totAmount.value) {
        this.payableAmount.setValue(parseFloat(((data + this.totAmount.value) / this.stockExchRate.value).toFixed(2)));
        this.payableAmountBase.setValue(parseFloat((this.payableAmount.value * this.stockExchRate.value).toFixed(2)));

      } else {
        this.payableAmount.setValue(parseFloat((data / this.stockExchRate.value).toFixed(2)));
        this.payableAmountBase.setValue(parseFloat((this.payableAmount.value * this.stockExchRate.value).toFixed(2)));
      }
    })

    this.igst.valueChanges.subscribe(res => {
      if (res) {
        const pAmout = ((this.getTaxableAmount() * res) / 100);
        this.igstAmount.setValue(parseFloat((pAmout).toFixed(2)));
      } else {
        this.igstAmount.setValue(0);
      }
      this.calculateTax();
      this.calculateTaxAmount();
      this.calculateNetAmount();
    });
    this.cgst.valueChanges.subscribe(res => {
      if (res) {
        const pAmout = ((this.getTaxableAmount() * res) / 100);
        this.cgstAmount.setValue(parseFloat((pAmout).toFixed(2)));

      } else {
        this.cgstAmount.setValue(0);
      }
      this.calculateTax();
      this.calculateTaxAmount();
      this.calculateNetAmount();
    });

    this.sgst.valueChanges.subscribe(res => {
      if (res) {
        const pAmout = ((this.getTaxableAmount() * res) / 100);
        this.sgstAmount.setValue(parseFloat((pAmout).toFixed(2)));
      } else {
        this.sgstAmount.setValue(0);
      }
      this.calculateTax();
      this.calculateTaxAmount();
      this.calculateNetAmount();
    });

    this.freight.valueChanges.subscribe(val => {
      if (this.freight.value) {
        const value: Number = parseFloat(val);
        this.frit.setValue(value);
      } else {
        this.frit.setValue(0);
      }
      this.calculateNetAmount();
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
      this.calculateNetAmount();
      //this.setTimeoutStockEffectCalcFunc();
      // setTimeout(() => {
      //   this.wtAvgRate = this.weightAvgRate;
      // })
    })

    this.commission.valueChanges.subscribe(val => {
      let grossAmount = 0;
      if (this.commission.value) {
        // const grossAmtAfterCommission = parseFloat(this.orderAmount.value.toString());
        const commissionAmt: number = parseFloat((parseFloat(this.orderAmountBase.value.toString()) * parseFloat(val) / 100).toFixed(2));
        this.comm.setValue(commissionAmt);
        grossAmount = commissionAmt;
      } else {
        this.comm.setValue(0);
      }
      if (this.brokerage.value) {
        this.setDscCommOtherDedValue();
        const grossAmtAfterBrokerage = parseFloat(this.orderAmountBase.value.toString()) + parseFloat(this.otherDed.value.toString()) + parseFloat(this.dsc.value.toString()) + parseFloat(grossAmount.toString());
        const value: number = parseFloat((grossAmtAfterBrokerage * parseFloat(this.brokerage.value) / 100).toFixed(2));
        debugger;
        this.brokerageAmt.setValue(value);
      }
      this.calculateNetAmount();
      this.notional = this.notProfit;
      this.profit.setValue(this.notProfit);
      this.baseNotional = parseFloat((this.notional * this.stockExchRate.value).toFixed(2));
      //this.setTimeoutStockEffectCalcFunc();
      // setTimeout(() => {
      //   this.wtAvgRate = this.weightAvgRate;
      // })
    })

    this.discount.valueChanges.subscribe(val => {
      let grossAmount = 0;
      if (this.discount.value) {
        const grossAmtAfterCommission = parseFloat(this.orderAmountBase.value.toString()) + parseFloat(this.comm.value.toString());
        console.log(parseFloat(this.comm.value.toString()))
        const discountAmt: number = parseFloat((grossAmtAfterCommission * parseFloat(val) / 100).toFixed(2));
        this.dsc.setValue(discountAmt);
        grossAmount = discountAmt;
      } else {
        this.dsc.setValue(0);
      }
      if (this.brokerage.value) {
        this.setDscCommOtherDedValue();
        const grossAmtAfterBrokerage = parseFloat(this.orderAmountBase.value.toString()) + parseFloat(this.otherDed.value.toString()) + parseFloat(grossAmount.toString()) + parseFloat(this.comm.value.toString());
        const value: number = parseFloat((grossAmtAfterBrokerage * parseFloat(this.brokerage.value) / 100).toFixed(2));
        debugger;
        this.brokerageAmt.setValue(value);
      }
      this.calculateNetAmount();
      this.notional = this.notProfit;
      this.profit.setValue(this.notProfit);
      this.baseNotional = parseFloat((this.notional * this.stockExchRate.value).toFixed(2));
      // this.setTimeoutStockEffectCalcFunc();
      // setTimeout(() => {
      //   this.wtAvgRate = this.weightAvgRate;
      // })
    })

    this.oded.valueChanges.subscribe(val => {
      let grossAmount = 0;
      if (this.oded.value) {
        const grossAmtAfterDiscount = parseFloat(this.orderAmountBase.value.toString()) + parseFloat(this.dsc.value.toString()) + parseFloat(this.comm.value.toString());
        const value: number = parseFloat((grossAmtAfterDiscount * parseFloat(val) / 100).toFixed(2));
        this.otherDed.setValue(value);
        grossAmount = value;
      } else {
        this.otherDed.setValue(0);
      }
      if (this.brokerage.value) {
        this.setDscCommOtherDedValue();
        const grossAmtAfterBrokerage = parseFloat(this.orderAmountBase.value.toString()) + parseFloat(grossAmount.toString()) + parseFloat(this.dsc.value.toString()) + parseFloat(this.comm.value.toString());
        const value: number = parseFloat((grossAmtAfterBrokerage * parseFloat(this.brokerage.value) / 100).toFixed(2));
        debugger;
        this.brokerageAmt.setValue(value);
      }
      this.calculateNetAmount();
      this.notional = this.notProfit;
      this.profit.setValue(this.notProfit);
      this.baseNotional = parseFloat((this.notional * this.stockExchRate.value).toFixed(2));
      // this.setTimeoutStockEffectCalcFunc();
      // setTimeout(() => {
      //   this.wtAvgRate = this.weightAvgRate;
      // })
    })

    this.brokerage.valueChanges.subscribe(val => {
      if (this.brokerage.value) {
        this.setDscCommOtherDedValue();
        const grossAmtAfterBrokerage = parseFloat(this.orderAmountBase.value.toString()) + parseFloat(this.otherDed.value.toString()) + parseFloat(this.dsc.value.toString()) + parseFloat(this.comm.value.toString());
        const value: number = parseFloat((grossAmtAfterBrokerage * parseFloat(val) / 100).toFixed(2));
        debugger;
        this.brokerageAmt.setValue(value);
      } else {
        this.brokerageAmt.setValue(0);
      }
    })

    this.brokerageAmt.valueChanges.subscribe(val => {
      this.notional = this.notProfit;
      this.profit.setValue(this.notProfit);
      this.baseNotional = parseFloat((this.notional * this.stockExchRate.value).toFixed(2));
    });

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
    let igstTaxAmount: number = 0;
    let cgstTaxAmount: number = 0;
    let sgstTaxAmount: number = 0;

    if (this.igst.value) {
      igstTaxAmount = this.igst.value;
    }
    if (this.cgst.value) {
      cgstTaxAmount = this.cgst.value;
    }

    if (this.sgst.value) {
      sgstTaxAmount = this.sgst.value;
    }

    let totalTaxPercent;
    totalTaxPercent = igstTaxAmount + cgstTaxAmount + sgstTaxAmount;
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
  }

  calculateNetAmount() {
    const amount = this.getTaxableAmount();
    this.totFICDO.setValue(amount);
    if (this.comm.value || this.dsc.value || this.otherDed.value) {
      this.totTax = parseFloat((this.comm.value + this.dsc.value + this.otherDed.value).toFixed(2));
    } else {
      this.totTax = 0;
    }

    // this.reCalculateGstTaxAmt();
    // let netAmt;
    // if(this.totAmount.value) {
    //   netAmt = parseFloat((amount + parseFloat(this.totAmount.value.toFixed(2))).toFixed(2));
    // } else {
    //   netAmt = parseFloat(amount.toFixed(2)) + 0;
    // }
    // //set in ui
    // this.netAmount.setValue(netAmt);
    // this.netAmountRs = netAmt;
  }

  getTaxableAmount() {
    let totalGrossAmt: number = 0;
    let amount: number = 0;
    if (this.orderAmountBase.value) {
      amount = amount + this.orderAmountBase.value;
    }
    // if(this.frit.value){
    //  amount = amount + this.frit.value;
    // }
    // if(this.insur.value){
    //   amount = amount + this.insur.value;
    //  }    
    if (this.comm.value) {
      amount = amount + this.comm.value;
    }
    if (this.dsc.value) {
      amount = amount + this.dsc.value;
    }
    if (this.otherDed.value) {
      amount = amount + this.otherDed.value;
    }
    //  if(this.brokerageAmt.value){
    //    amount = amount - this.brokerageAmt.value;
    //  }
    amount = parseFloat(amount.toFixed(2));
    return amount;
  }


  reCalculateTaxAndGrossAmountOnItemEditDelete() {
    this.setTimeoutCalcFunc();
    this.calculateTax();
    this.reCalculateGstTaxAmt();
    this.calculateTaxAmount();
    this.calculateNetAmount();
  }
  reCalculateGstTaxAmt() {
    const igstAmt = ((this.orderAmountBase.value * this.igst.value) / 100);
    this.igstAmount.setValue(parseFloat((igstAmt).toFixed(2)));
    const cgstAmt = ((this.orderAmountBase.value * this.cgst.value) / 100);
    this.cgstAmount.setValue(parseFloat((cgstAmt).toFixed(2)));
    const sgstAmt = ((this.orderAmountBase.value * this.sgst.value) / 100);
    this.sgstAmount.setValue(parseFloat((sgstAmt).toFixed(2)));
  }

  setDscCommOtherDedValue() {
    if (this.comm.value) {
      this.comm.setValue(this.comm.value);
    } else {
      this.comm.setValue(0);
    }

    if (this.dsc.value) {
      this.dsc.setValue(this.dsc.value);
    } else {
      this.dsc.setValue(0);
    }

    if (this.otherDed.value) {
      this.otherDed.setValue(this.otherDed.value);
    } else {
      this.otherDed.setValue(0);
    }
  }

  validateRequiredField() {
    this.errorMsg = null;

    if (!this.prefix.value) {
      this.loading = false;
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = false;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Please select Prefix!';
      this.errorMsg = "Please select prefix."
      return;
    }

    if (!this.suffix.value) {
      this.loading = false;
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = false;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Please select suffix!';
      this.errorMsg = "Please select suffix."
      return;
    }

    if (!this.category.value) {
      this.loading = false;
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
      this.loading = false;
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = false;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Please Select Terms & Condition!';
      this.errorMsg = "Please select Terms & Condition"
      return;
    }

    if (!isNumber(this.bCreditDays.value)) {
      this.loading = false;
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = false;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Enter Bank Credit Days!';
      this.errorMsg = "Enter Bank Credit days."
      return;
    }

    if (!isNumber(this.cCreditDays.value)) {
      this.loading = false;
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = false;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Enter Customer Credit Days!';
      this.errorMsg = "Enter Customer Credit days."
      return;
    }

    if (this.orderAmount.value <= 0) {
      this.loading = false;
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = false;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Gross Amount can not be zero or negative!';
      this.errorMsg = "Order Amount can not be zero or negative."
      return;
    }


    if (!this.customer.value) {
      this.loading = false;
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = false;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Please select Customer!';
      this.errorMsg = "Please select Customer."
      return;
    }


  }

}
