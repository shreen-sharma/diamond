import { LotItemCreationService } from '../../../../stockManagement/components/lotItemCreation/index';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap/tabset/tabset.module';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { LotService } from '../../../../stockManagement/components/lots';
import { Observable } from 'rxjs/Rx';
import { FormGroup, AbstractControl, FormBuilder, Validators} from '@angular/forms';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';

import { AuthenticationService } from 'app/core/authentication/';
import { Logger } from 'app/core/';
import { SalesOrders, SalesOrderService } from '../salesOrder.service';
import { CategoryService } from 'app/pages/masters/components/categories/';
import { PartyDetailsService } from 'app/pages/company/components/partyDetails/partyDetails.service';
import { CommonService } from 'app/pages/masters/components/common/common.service';
import { AbstractClassPart } from '@angular/compiler/src/output/output_ast';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModalComponent } from '../../../../../shared/common-modal/common-modal.component';
import { CurrencyService } from 'app/pages/masters/components/currency/currency.service';
import { ExchangeRateService } from 'app/pages/masters/components/exchangeRate/exchangeRate.service';
import {HierarchyRelationService} from 'app/pages/company/components/hierarchyRelation';
import { debug } from 'util';
import { SalesOrderModals } from '../createSalesOrder/salesOrder-modal/salesOrder-modal.component';
//import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

const log = new Logger('SalesOrder');

@Component({
  selector: 'create-salesOrder',
  templateUrl: './createSalesOrder.html',
  styleUrls: ['./createSalesOrder.scss']
})
export class CreateSalesOrder implements OnInit  {

  @ViewChild(NgbTabset) ngbTabset: NgbTabset;
  @ViewChild('selectParty') selectParty: ElementRef;

  qulty: string;
  mySettings: any;
  size: string;
  totCarats: number;
  showSbmtBtn: boolean = true;
  baseCurrName: any;
  soCurrName: any;
  stockCurrName: any;
  showButton = false;
  orderIdParam: string;
  pageTitle = 'Create Local Sales Order';
  error: string = null;
  errorMsg: string;
  isLoading = false;
  perchOrderData: any = {};
  isViewMode: boolean;
  orderForm: FormGroup;
  todayDate: string;
  catMasterList: Observable<any>;
  partyTypeList: Observable<any>;
  bankNameList: any[] = [];
  currList: any[] = [];
  exchangeRateList: any[] = [];
  bankList: any;
  selectedCat: any;
  exchRate: number;
  selectedCurr: any;
  itemMasterList: Observable<any>;
  lotMasterList: Observable<any>;
  lotItemList: Observable<any>;
  partyStatus: boolean;
  partyBankBranches: any[];
  // stockCurrencyCode: string = "USD";
  // defaultCurrencyCode: string = "INR";
  stockCurrCode: any;
  baseCurrCode: any;
  public soDate: AbstractControl;
  public categoryMaster: AbstractControl;
  public party: AbstractControl;
  public partyMasterByPartyId: AbstractControl;
  public bankId: AbstractControl;
  public soCurrency: AbstractControl;
  public exchangeRate: AbstractControl;
  public stockExchangeRate: AbstractControl;
  public baseExchangeRate: AbstractControl;
  public stockCurrency: AbstractControl;
  public baseCurr: AbstractControl;
  termsList: any[] = [];
  modelList: any[] = [];
  xList: any = [];
  isView: any;
  loading : boolean = false;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private catService: CategoryService,
    private lotService: LotService,
    private modalService: NgbModal,
    private service: SalesOrderService,
    private partyService: PartyDetailsService,
    private commonService: CommonService,
    private lotItemService: LotItemCreationService,
    private hierService: HierarchyRelationService,
    private excnageService: ExchangeRateService,
    //private spinnerService: Ng4LoadingSpinnerService,
    private currencyService: CurrencyService,
    private authService: AuthenticationService) {
    this.todayDate = this.today();
    this.hierService.getHierById(this.authService.credentials.company).subscribe( data => {
      debugger
      this.hierService.getHierMasterById(data.hierarchyMaster.hierId).subscribe( res => {
        this.currencyService.getAllCurrencies().subscribe((currList) => {
          this.currList = currList;
          // const a = this.currList.find( ele => {
          //   if(ele.currName.trim().toUpperCase() == 'RUPEES') {
          //     return true;
          //   }
          // })
          if (res.hierarchyDetailRequestDTO) {
            this.stockCurrency.setValue(res.hierarchyDetailRequestDTO.currencyMasterByStockCurrId);
            const b = this.currList.find( ele => {
              if (ele.currId == this.stockCurrency.value) {
                return true;
              }
            })
            this.stockCurrName = b.currName;
            this.stockCurrCode = b.currCode;
            this.baseCurr.setValue(res.hierarchyDetailRequestDTO.currencyMasterByCurrId);
            const c = this.currList.find( ele => {
              if (ele.currId == this.baseCurr.value) {
                return true;
              }
            })
            this.baseCurrName = c.currName;
            this.baseCurrCode = c.currCode;
            // setting So Currency
            this.soCurrency.setValue(this.baseCurr.value);
            this.soCurrName = this.baseCurrName;
            this.selectedCurr = this.baseCurr.value;
          }

          this.excnageService.getData().subscribe((exchangeRateList) => {
            this.exchangeRateList = exchangeRateList;
            if (this.baseCurr.value && this.stockCurrency.value && this.baseCurr.value == this.stockCurrency.value) {
              this.exchangeRate.setValue(1);
            } else {
              let flag = 0;
              this.exchangeRateList.forEach(res => {
                debugger;
                 if (res.exchType == "ST" && res.currencyMasterByFromCurrId == this.stockCurrency.value && res.currencyMasterByToCurrId == this.baseCurr.value) {
                   if (!res.toDate || res.toDate <= this.todayDate){
                  this.exchRate = res.exchRate;
                  this.exchangeRate.setValue(this.exchRate);
                   }
                   flag = 1;
                 }
              });
              if (flag != 1) {
                this.loading = false;
                const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
                activeModal.componentInstance.showHide = false;
                activeModal.componentInstance.modalHeader = 'Alert';
                activeModal.componentInstance.modalContent = 'Please Add Stock Exchange Rate for Stock Currency to Base Currency in Custom Exchange Rate Screen!';
              }
            }
          });
        });

      });
    });
    this.commonService.getAllCommonMasterByType('TS').subscribe( data =>{
      this.termsList = data;
    });
    this.partyTypeList = this.partyService.getPartyByType('CU');
    this.catMasterList = this.catService.getData();
    this.lotMasterList = this.lotService.getData();
    this.initForm();
    this.soDate.setValue(this.todayDate);
  }



  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      debugger;
      this.orderIdParam = params['soId'];
      this.isView = params['isView'];
      if (this.orderIdParam) {
        if(this.isView == 'true'){
          this.loading = true;
          this.pageTitle = 'View Sales Order';
          this.partyTypeList.subscribe(parties => {
            this.service.getSalesOrderById(this.orderIdParam).subscribe( res => {             
              if (res && params['status'] == 'COMPLETED') {
                this.pageTitle = 'View Sales Order';
                this.isViewMode = true;
                this.showSbmtBtn = false;
                this.perchOrderData = res;
                this.baseExchangeRate.setValue(res.baseExchangeRate);
                this.orderForm.patchValue(res);
                this.orderForm.disable();
                this.loading = false;
                this.orderForm.markAsUntouched();
              } else {
                this.isViewMode = false;
                this.markAllTouched(this.orderForm);
                this.loading = false;
              }
              parties.forEach((party, i) => {
                debugger
                if (party.partyId == res.party.partyId) {
                  res.party = party;
                  setTimeout(() => {this.selectParty.nativeElement.selectedIndex = i},500);
                }
              });        
              setTimeout(() => {
                this.exchangeRate.setValue(res.exchangeRate);
                this.soCurrency.setValue(res.soCurrency);
                this.baseExchangeRate.setValue(res.baseExchangeRate);
              }, 1000);
              this.perchOrderData = res;
              this.baseExchangeRate.setValue(res.baseExchangeRate);            
              this.bankId.setValue(res.bankId);
              this.currList.forEach( ele => {
                if(ele.currId == res.stockCurrency) {
                  this.stockCurrCode = ele.currCode;
                  this.stockCurrName = ele.currName;
                }
                if(ele.currId == res.baseCurr) {
                  this.baseCurrCode = ele.currCode;
                  this.baseCurrName = ele.currName;
                }
              })
              this.orderForm.patchValue(res);
              this.loading = false;
              this.isViewMode = true;
              this.showSbmtBtn = false;
              this.orderForm.disable();
              this.orderForm.markAsUntouched();
              this.soDate.setValue(this.dateFormate(res.soDate));
            });
          });
        } else {          
          this.loading = true;
          this.pageTitle = 'Edit Sales Order';
          this.partyTypeList.subscribe(parties => {
            this.service.getSalesOrderById(this.orderIdParam).subscribe( res => {             
              if (res && params['status'] == 'COMPLETED') {
                this.pageTitle = 'View Sales Order';
                this.isViewMode = true;
                this.showSbmtBtn = false;
                this.perchOrderData = res;
                this.baseExchangeRate.setValue(res.baseExchangeRate);
                this.orderForm.patchValue(res);
                this.loading = false;
                this.orderForm.disable();
                this.orderForm.markAsUntouched();
              } else {
                this.isViewMode = false;
                this.loading = false;
                this.markAllTouched(this.orderForm);
              }
              parties.forEach((party, i) => {
                debugger
                if (party.partyId == res.party.partyId) {
                  res.party = party;
                  setTimeout(() => {this.selectParty.nativeElement.selectedIndex = i},500);
                }
              });
              setTimeout(() => {
                this.exchangeRate.setValue(res.exchangeRate);
                this.soCurrency.setValue(res.soCurrency);
                this.baseExchangeRate.setValue(res.baseExchangeRate);
              }, 1000);
              this.perchOrderData = res;
              this.baseExchangeRate.setValue(res.baseExchangeRate);            
              this.bankId.setValue(res.bankId);
              this.currList.forEach( ele => {
                if(ele.currId == res.stockCurrency) {
                  this.stockCurrCode = ele.currCode;
                  this.stockCurrName = ele.currName;
                }
                if(ele.currId == res.baseCurr) {
                  this.baseCurrCode = ele.currCode;
                  this.baseCurrName = ele.currName;
                }
              })
              this.orderForm.patchValue(res);
              this.loading = false;
              this.soDate.setValue(this.dateFormate(res.soDate));
            });
            this.loading = false;
          });
        }
      }
    });
  }

  dateFormate(value) {
    const bankDate = value.split('-');
    const newDate = (bankDate[2] + '-' + bankDate[1] + '-' + bankDate[0]);
    return newDate;
  }

  today (): string {
    const today = new Date();
    const dd = today.getDate();
    const mm = today.getMonth() + 1; // January is 0!
    const yyyy = today.getFullYear();
    return yyyy + '-' + (mm < 10 ? '0' + mm : mm) + '-' + (dd < 10 ? '0' + dd : dd);
  }  
  
  prepareSettingSize() {
    return {
      hideSubHeader: true,
      actions: false,
      pager: {
        display: false,
        perPage: 50,
      },
      selectMode: 'single',
      columns: {
        id: {
          title: 'Size',
        }
      }
    }
  }


  estimatedCarats() {
    this.loading = false;
    const activeModal = this.modalService.open(SalesOrderModals, {size: 'lg'});
    activeModal.componentInstance.modalHeader = 'ESTIMATED CARATS & VALUES';
    activeModal.componentInstance.estimatedSizeFlag = false;
    this.service.getLatestLocSalesOrdersOfCustomer(Number(this.orderIdParam)).subscribe(res => {
      activeModal.componentInstance.ordLst = res;
    })
    this.service.getAllLocalSalesOrderStockItemsReportLotwise(Number(this.orderIdParam)).subscribe((reportList: any[])=>{
      reportList.forEach( invoiceItem => {
        invoiceItem.lot = invoiceItem.lotName;
        invoiceItem.sellingPrice = invoiceItem.carats==0?0: parseFloat(((invoiceItem.amount/invoiceItem.carats)*100).toFixed(3));
        invoiceItem.baseAmount = parseFloat((invoiceItem.amount*invoiceItem.exchRate).toFixed(3));
        const tot = parseFloat(this.getColTotal('carats', reportList).toFixed(3));
        invoiceItem.ctsPerc = parseFloat(((invoiceItem.carats / tot) * 100).toFixed(3));
      });
      this.modelList = reportList;
      activeModal.componentInstance.totalCarets = this.ttlCarats;
      activeModal.componentInstance.totalAvgAmt = this.ttlCarats == 0 ? 0 : parseFloat((this.ttlNetAmt/this.ttlCarats).toFixed(2));
      activeModal.componentInstance.totalNetAmt = this.ttlNetAmt;
      activeModal.componentInstance.totalBaseAmt = this.ttlBaseAmt;
      activeModal.componentInstance.source.load(reportList);
    });
  }
  estimatedSize() {
    this.xList = [];
    this.loading = false;
    const activeModal = this.modalService.open(SalesOrderModals, { size: 'lg' });
    activeModal.componentInstance.modalHeader = 'Estimated Size & Values';
    activeModal.componentInstance.estimatedSizeFlag = true;
    this.mySettings = this.prepareSettingSize();
    this.service.getLatestLocSalesOrdersOfCustomer(Number(this.orderIdParam)).subscribe(res => {
      activeModal.componentInstance.ordLst = res;
    })
    this.service.localSalesOrderEstimateDistinctSizeReport(Number(this.orderIdParam)).subscribe((reportList: any[]) => {

      for (var i = 0; i <= reportList.length ; i++) {
        this.xList[i] = [];
      }
      for (var i = 0; i < reportList.length; i++) {
        this.xList[i]["id"] = reportList[i];
      }


    });

    this.service.localSalesOrderEstimateSizeReport(Number(this.orderIdParam)).subscribe((reportList: any[]) => {
      var rowTotValue: number = 0;
      for (var i = 0; i < Object.keys(reportList).length; i++) {
        rowTotValue = this.totCarats;
        this.totCarats = 0;


        this.size = Object.keys(reportList)[i].toString();

        this.mySettings.columns[this.size] = { title: '' + this.size };
        activeModal.componentInstance.settings = Object.assign({}, this.mySettings);
        for (var j = 0; j < Object.keys(reportList[Object.keys(reportList)[i]]).length; j++) {

          if (Object.keys(reportList[Object.keys(reportList)[i]])[j] != undefined) {




            this.qulty = Object.keys(reportList[Object.keys(reportList)[i]])[j];

            if (i % 2 == 1) {
              this.xList[this.lotSizeIndex(this.qulty)][Object.keys(reportList)[i].toString()] = Number(((reportList[this.size][this.qulty]["carats"] / rowTotValue) * 100).toFixed(2));
              // this.totCarats += Number(((reportList[this.size][this.qulty]["carats"] / rowTotValue) * 100).toFixed(2)) ;
            } else {
              this.totCarats += reportList[this.size][this.qulty]["carats"];
              this.xList[this.lotSizeIndex(this.qulty)][Object.keys(reportList)[i].toString()] = reportList[this.size][this.qulty]["carats"];
            }


          }



        }
        this.xList[this.xList.length - 1]["id"] = "Total";
        this.xList[this.xList.length - 1][Object.keys(reportList)[i].toString()] = this.totCarats.toFixed(2);
      }


      var s: string;

      this.mySettings.columns["Total"] = { title: 'Total' };
      activeModal.componentInstance.settings = Object.assign({}, this.mySettings);

      this.mySettings.columns["%"] = { title: '%' };
      activeModal.componentInstance.settings = Object.assign({}, this.mySettings);

      for (var i = 0; i < this.xList.length; i++) {

        this.totCarats = 0;
        for (var j = 0; j < Object.keys(reportList).length; j++) {

          if (this.xList[i][Object.keys(reportList)[j].toString()] != undefined) {
            this.totCarats += Number(this.xList[i][Object.keys(reportList)[j].toString()]);

          }

        }
        this.xList[i]["Total"] = Number(this.totCarats.toFixed(2));

      }
      rowTotValue = this.getCaratColTotal("Total") -  this.totCarats;
      this.xList[this.xList.length-1]["Total"] = rowTotValue;
      for (var i = 0; i < this.xList.length; i++) {
        this.xList[i]["%"] = Number((this.xList[i]["Total"] / rowTotValue) * 100).toFixed(2);
      }

      activeModal.componentInstance.source.load(this.xList);
    });
  }

  getCaratColTotal(colName: string) {
    let total: number;
    total = 0;
    this.xList.forEach(row => {
      total += parseFloat((row[colName]));
    });
    return total;
  }
  lotSizeIndex(size: string): number {
    // console.log(size);
    // console.log(this.xList.length);

    for (var i = 0; i < this.xList.length; i++) {
      if (this.xList[i].id === size) {
        // console.log(i);
        return i;
      }
    }
  }
  get ttlCarats(): number {
    return parseFloat(this.getColTotal('carats', this.modelList).toFixed(3));
  }

  get ttlNetAmt(): number {
    return parseFloat(this.getColTotal('amount', this.modelList).toFixed(3));
  }

  get ttlBaseAmt(): number {
    return parseFloat(this.getColTotal('baseAmount', this.modelList).toFixed(3));
  }

  getColTotal(colName: string, list: any) {
    let total: number;
    total = 0;
    list.forEach(row => {
      total += parseFloat(row[colName]);
    });
    return total;
  }

  onChangeCat(catId: any) {
    if (this.orderForm.controls.hasOwnProperty('salesOrderItems')) {
      const ctrl = <any>this.orderForm.controls['salesOrderItems'];
      if (ctrl.length > 0) {
        this.ngbTabset.select('order');
        this.loading = false;
        const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
        activeModal.componentInstance.showHide = true;
        activeModal.componentInstance.modalHeader = 'Alert';
        activeModal.componentInstance.modalContent = 'Your all previous Added Order Item info will be get removed!';
        activeModal.result.then ((res) => {
          if (res == 'Y') {
            
            this.selectedCat = catId;
            this.categoryMaster.setValue(this.selectedCat);
          } else if (res == 'N') {
            this.categoryMaster.setValue(this.selectedCat);
          }
        });
      } else {
        this.selectedCat = this.categoryMaster.value;
      }
    } else {
      this.selectedCat = this.categoryMaster.value;
    }
    this.categoryMaster.setValue(this.selectedCat);
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

  getBankBranch() {
    debugger;
    let flag = 0;
    this.partyBankBranches.forEach(data =>{
        if (data.bankBranch.bankId == this.bankList.id ) {          
          if (this.bankNameList.length > 0) {
            this.bankNameList.forEach(res => {
              if (res.value == data.bankBranch.bankBrId) {
                flag = 1;
              }
            });
            if(flag != 1) {
              this.bankNameList.push({'value': data.id, 'title': this.bankList.name + '_' + data.bankBranch.bankBrName });
            }
          } else {
           this.bankNameList.push({'value': data.id, 'title': this.bankList.name + '_' + data.bankBranch.bankBrName });
          }
        }
    });
  }

  validSubmit() {
    const formValue: any = this.orderForm.value;
    if (this.orderIdParam) {
      this.loading = true;
    //  this.spinnerService.show();
      this.service.updateSalesOrder(formValue).subscribe(salesOrder => {
      // log.debug(`${credentials.username} successfully logged in`);
      this.loading = false;
      this.handleBack();
      this.finally();
     // this.spinnerService.hide();
      }, error => {
          log.debug(`Creation error: ${error}`);
          this.error = error;
          this.loading = false;
          this.finally();
        });
    } else {
      this.loading = true;
      this.service.createSalesOrder(formValue).subscribe(salesOrder => {
        // log.debug(`${credentials.selectCategory} successfully logged in`);
        this.loading = false;
        this.handleBack();
        this.finally();
      }, error => {
        log.debug(`Creation error: ${error}`);
        this.error = error;
        this.loading = false;
        this.finally();
      });
    }
  }

  submit() {
    debugger;
    
    this.loading = true;
    this.errorMsg = '';

    // if(this.error){
    //     this.loading = false;
    //   }
    if (this.orderForm.controls['soDate'].valid &&
       this.orderForm.controls['categoryMaster'].valid && this.orderForm.controls['party'].valid) {

        if (this.orderForm.controls.hasOwnProperty('salesDetails') &&
           this.orderForm.controls['salesDetails'].valid) {

                 if (this.orderForm.controls.hasOwnProperty('orderItems')) {
                  this.loading = false;
                    const ctrl = <any>this.orderForm.controls['orderItems'];
                    if (ctrl.length > 0) {
                      this.ngbTabset.select('stock');
                      setTimeout(() => {
                        this.validSubmit();
                      });
                    } else {
                      this.loading = false;
                      this.ngbTabset.select('stock');
                      this.errorMsg = 'Please Add Stock Effect Item List!';
                      setTimeout(() => this.errorMsg = null, 3000);
                    }
                } else {
                  this.loading = false;
                  this.ngbTabset.select('stock');
                  this.errorMsg = 'Please Add Stock Effect Item List!';
                  setTimeout(() => this.errorMsg = null, 3000);
                }
        } else {
          this.loading = false;
          this.markAllTouched(this.orderForm);
          this.ngbTabset.select('general');
          this.errorMsg = 'Please Add General Details!';
          setTimeout(() => this.errorMsg = null, 3000);
        }
     } else {
      this.loading = false;
      this.markAllTouched(this.orderForm);
     }
  }

  finally() {
      this.isLoading = false;
      this.orderForm.markAsPristine();
  }

  handleBack(cancelling: boolean = false) {
    // TODO: if cancelling then ask to confirn

    if (this.orderIdParam) {
      this.router.navigate(['../../../../salesOrder'], {relativeTo: this.route});
    } else {
      this.router.navigate(['../salesOrder'], {relativeTo: this.route});
    }
  }

  private initForm() {
    this.orderForm = this.fb.group({
      'soId': [''],
       'soDate': [''],
       'categoryMaster': ['', Validators.compose([Validators.required])],
       'party': ['', Validators.compose([Validators.required])],
       'orderAmount': [''],
       'orderAmountBase': [''],
       'partyMasterByPartyId': [''],
       'bankId': [''],
       'profit': [''],
       'stockExchangeRate': [''],
       'soCurrency': ['', Validators.compose([Validators.required])],
       'exchangeRate': [''],
       'baseExchangeRate': ['', Validators.compose([Validators.required])],
       'stockCurrency': [''],
       'baseCurr': [''],
     });

    this.soDate = this.orderForm.controls['soDate'];
    this.categoryMaster = this.orderForm.controls['categoryMaster'];
    this.party = this.orderForm.controls['party'];
    this.bankId = this.orderForm.controls['bankId'];
    this.soCurrency = this.orderForm.controls['soCurrency'];
    this.exchangeRate = this.orderForm.controls['exchangeRate'];
    this.stockExchangeRate = this.orderForm.controls['stockExchangeRate'];
    this.baseExchangeRate = this.orderForm.controls['baseExchangeRate'];
    this.stockCurrency = this.orderForm.controls['stockCurrency'];
    this.baseCurr = this.orderForm.controls['baseCurr'];

    this.soCurrency.valueChanges.subscribe(currencyId => {
      debugger;
      if (this.soCurrency.value) {
        this.currencyService.getAllCurrencies().subscribe((currList) => {
          const b = currList.find( ele => {
            if (ele.currId == this.soCurrency.value) {
              return true;
            }
          })
          if (b != undefined || b != null || b != '') {
            this.soCurrName = b.currName;
          }
        })
      }

      if (this.baseCurr.value == this.soCurrency.value) {
          this.baseExchangeRate.setValue(1);
      } else {
        this.exchangeRateList.forEach(res => {
          if (res.exchType == 'ST' && res.currencyMasterByToCurrId == this.baseCurr.value
           && res.currencyMasterByFromCurrId == this.soCurrency.value) {
            if (!res.toDate || res.toDate <= this.todayDate) {
              this.baseExchangeRate.setValue(res.exchRate);
            }
          }
        });
      }

    })

     this.party.valueChanges.subscribe( resp => {
       this.bankNameList = [];
       debugger
       this.partyStatus = true;
       if (!resp.bankBranches) {
          this.partyService.getAllBankBranchByPartyId(resp.partyId, resp.partyType.code).subscribe(res => {
             this.partyBankBranches = res;
             res.forEach(element => {
              if (element.bankBranch.bankId) {
              this.commonService.getCommonMasterById(element.bankBranch.bankId).subscribe(data => {
                this.bankList = data;
                this.getBankBranch();
              });
            }
          });
        });
     }
   })
}
}
