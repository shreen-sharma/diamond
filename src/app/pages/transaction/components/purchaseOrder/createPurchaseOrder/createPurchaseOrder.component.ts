import { NgbTabset, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { LotService } from '../../../../stockManagement/components/lots';
import { Observable } from 'rxjs/Rx';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { PurchaseOrderModal } from '../createPurchaseOrder/purchaseOrder-modal/purchaseOrder-modal.component';
import { AuthenticationService } from 'app/core/authentication/';
import { Logger } from 'app/core/';
import { PurchaseOrders, PurchaseOrderService } from '../';
import { CategoryService } from 'app/pages/masters/components/categories/';
import { PartyDetailsService } from 'app/pages/company/components/partyDetails/partyDetails.service';
import { CommonService } from 'app/pages/masters/components/common/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModalComponent } from '../../../../../shared/common-modal/common-modal.component';
import { CurrencyService } from 'app/pages/masters/components/currency/currency.service';
import { ExchangeRateService } from 'app/pages/masters/components/exchangeRate/exchangeRate.service';
import { HierarchyRelationService } from 'app/pages/company/components/hierarchyRelation';
import { debug } from 'util';
import { LoadingModule } from 'ngx-loading';

const log = new Logger('PurchaseOrder');

@Component({
  selector: 'create-purchaseOrder',
  templateUrl: './createPurchaseOrder.html',
  styleUrls: ['./createPurchaseOrder.scss']
})



export class CreatePurchaseOrder implements OnInit {
  qulty: string;
  mySettings: any;
  size: string;
  totCarats: number;
  modelList: any[] = [];
  baseCurrName: any;
  poCurrName: any;
  stockCurrName: any;

  @ViewChild(NgbTabset) ngbTabset: NgbTabset;
  @ViewChild('selectParty') selectParty: ElementRef;

  errorMessage: string;
  showButton = false;
  isViewMode: boolean;
  showSbmtBtn: boolean = true;
  purchOrderData: any = {};
  orderIdParam: string;
  pageTitle = 'Create Local Purchase Order';
  error: string = null;
  isLoading = false;
  estimatedSizeFlag: boolean = false;
  orderForm: FormGroup;
  loading: boolean = false;
  todayDate: string;
  catMasterList: Observable<any[]>;
  partyTypeList: Observable<any[]>;

  lotItems: Observable<any[]>;
  lotMasterList: Observable<any[]>;
  partyStatus: boolean;
  partyBankBranches: any[];
  currList: any[] = [];
  exchangeRateList: any[] = [];
  bankNameList: any[] = [];
  bankList: any;
  // purchaseOrderNo:number;
  selectedCat: any;
  exchRate: number;
  selectedCurr: any;

  stockCurrencyCode: string;
  baseCurrencyCode: string;
  poCurrencyCode: string;

  xList: any = [];

  // public poNo: AbstractControl;
  public poDate: AbstractControl;
  public categoryMaster: AbstractControl;
  public party: AbstractControl;
  public partyMasterByPartyId: AbstractControl;
  public bankId: AbstractControl;
  public poCurrency: AbstractControl;
  public exchangeRate: AbstractControl;
  public stockExchangeRate: AbstractControl;
  public baseExchangeRate: AbstractControl;
  public wtAvgRate: AbstractControl;
  public stockCurrency: AbstractControl;
  public baseCurr: AbstractControl;
  public draftStatus: AbstractControl;
  // sign: any;
  termsList: any[] = [];
  isView: any;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private catService: CategoryService,
    private lotService: LotService,
    private modalService: NgbModal,
    private currencyService: CurrencyService,
    private commonService: CommonService,
    private excnageService: ExchangeRateService,
    private service: PurchaseOrderService,
    private hierService: HierarchyRelationService,
    private partyService: PartyDetailsService,
    private authService: AuthenticationService
  ) {
    this.todayDate = this.today();

    this.hierService.getHierById(this.authService.credentials.company).subscribe(data => {
      debugger
      this.hierService.getHierMasterById(data.hierarchyMaster.hierId).subscribe(res => {

        this.currencyService.getAllCurrencies().subscribe((currList) => {
          this.currList = currList;
          // const a = this.currList.find( ele => {
          //   if(ele.currName.trim().toUpperCase() == 'RUPEES') {
          //     return true;
          //   }
          // })

          // this.sign = 'Rs';

          if (res.hierarchyDetailRequestDTO) {
            this.stockCurrency.setValue(res.hierarchyDetailRequestDTO.currencyMasterByStockCurrId);
            const b = this.currList.find(ele => {
              if (ele.currId == this.stockCurrency.value) {
                return true;
              }
            })
            this.stockCurrName = b.currName;
            this.stockCurrencyCode = b.currCode;

            this.baseCurr.setValue(res.hierarchyDetailRequestDTO.currencyMasterByCurrId);
            const c = this.currList.find(ele => {
              if (ele.currId == this.baseCurr.value) {
                return true;
              }
            })
            this.baseCurrName = c.currName;
            this.baseCurrencyCode = c.currCode;
            // setting Po Currency
            this.poCurrency.setValue(this.baseCurr.value);
            this.poCurrName = this.baseCurrName;
            this.poCurrencyCode = this.baseCurrencyCode;
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
                  if (!res.toDate || res.toDate <= this.todayDate) {
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
    this.commonService.getAllCommonMasterByType('TS').subscribe(data => {
      this.termsList = data;
    });
    this.partyTypeList = this.partyService.getPartyByType('SU');
    this.catMasterList = this.catService.getData();
    this.lotMasterList = this.lotService.getData();

    this.initForm();
    this.poDate.setValue(this.todayDate);
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

  ngOnInit() {
    // debugger;
    /* if(this.service.purchOrderData)
    {
      this.purchOrderData = JSON.parse(JSON.stringify(this.service.purchOrderData));
      this.service.purchOrderData = null;
    } */
    this.route.params.subscribe((params: Params) => {
      debugger;
      this.orderIdParam = params['poId'];
      // this.orderIdParam
      this.isView = params['isView'];
      if (this.orderIdParam) {
        if (this.isView == 'true') {
          this.pageTitle = 'View Purchase Order';
          this.partyTypeList.subscribe(parties => {
            this.service.getPurchaseOrderById(this.orderIdParam).subscribe(res => {
              if (res && params['status'] == 'COMPLETED') {
                this.pageTitle = 'View Purchase Order';
                this.isViewMode = true;
                this.showSbmtBtn = false;
                this.purchOrderData = res;
                this.orderForm.patchValue(res);
                this.orderForm.disable();
                this.orderForm.markAsUntouched();
              } else {
                this.isViewMode = false;
                this.markAllTouched(this.orderForm);
              }
              parties.forEach((party, i) => {
                debugger
                if (party.partyId == res.party.partyId) {
                  res.party = party;
                  setTimeout(() => { this.selectParty.nativeElement.selectedIndex = i }, 500);
                }
              });
              setTimeout(() => {
                this.exchangeRate.setValue(res.exchangeRate);
                this.poCurrency.setValue(res.poCurrency);
                this.baseExchangeRate.setValue(res.baseExchangeRate);
              }, 1000);

              this.purchOrderData = res;
              debugger
              this.orderForm.patchValue(res);
              this.showSbmtBtn = false;
              this.orderForm.disable();
              this.orderForm.markAsUntouched();
              this.poDate.setValue(this.dateFormate(res.poDate));

            });
          });
        } else {
          this.pageTitle = 'Edit Purchase Order';
          this.partyTypeList.subscribe(parties => {
            this.service.getPurchaseOrderById(this.orderIdParam).subscribe(res => {
              if (res && params['status'] == 'COMPLETED') {
                this.pageTitle = 'View Purchase Order';
                this.isViewMode = true;
                this.showSbmtBtn = false;
                this.purchOrderData = res;
                this.orderForm.patchValue(res);
                this.orderForm.disable();
                this.orderForm.markAsUntouched();
              } else {
                this.isViewMode = false;
                this.markAllTouched(this.orderForm);
              }
              parties.forEach((party, i) => {
                debugger
                if (party.partyId == res.party.partyId) {
                  res.party = party;
                  setTimeout(() => { this.selectParty.nativeElement.selectedIndex = i }, 500);
                }
              });
              setTimeout(() => {
                this.exchangeRate.setValue(res.exchangeRate);
                this.poCurrency.setValue(res.poCurrency);
                this.baseExchangeRate.setValue(res.baseExchangeRate);
              }, 1000);

              this.purchOrderData = res;
              debugger
              this.orderForm.patchValue(res);
              this.poDate.setValue(this.dateFormate(res.poDate));

            });
          });
        }
      } else {
        //incase of edit no need to create purchaseOrder No.
        // this.service.getNextPurchaseOrderNo().subscribe(res =>{
        //   this.poNo.setValue(res.number);

        //  });
      }
    });
  }
  dateFormate(value) {
    const bankDate = value.split('-');
    const newDate = (bankDate[2] + '-' + bankDate[1] + '-' + bankDate[0]);

    return newDate;
  }
  today(): string {
    const today = new Date();
    const dd = today.getDate();
    const mm = today.getMonth() + 1; // January is 0!
    const yyyy = today.getFullYear();
    return yyyy + '-' + (mm < 10 ? '0' + mm : mm) + '-' + (dd < 10 ? '0' + dd : dd);

    // return (dd < 10 ? '0' + dd : dd) + '-' + (mm < 10 ? '0' + mm : mm) + '-' + yyyy;
  }

  public beforeChange($event: NgbTabChangeEvent) {
    if ($event.nextId === 'stock') {
      this.showButton = true;
    } else {
      this.showButton = false;
    }
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

  getBankBranch() {
    debugger;
    let flag = 0;
    this.bankNameList = [];
    this.partyBankBranches.forEach(data => {
      if (data.bankBranch.bankId == this.bankList.id) {
        if (this.bankNameList.length > 0) {
          this.bankNameList.forEach(res => {
            if (res.value == data.bankBranch.bankBrId) {
              flag = 1;
            }
          });
          if (flag != 1) {
            //  id is contactBankBranch Id
            this.bankNameList.push({ 'value': data.id, 'title': this.bankList.name + "_" + data.bankBranch.bankBrName });
          }
        }
        else {
          this.bankNameList.push({ 'value': data.id, 'title': this.bankList.name + "_" + data.bankBranch.bankBrName });
        }
      }
    });
  }

  onChangeCat(catId: any) {
    if (this.orderForm.controls.hasOwnProperty('orderItems')) {
      const ctrl = <any>this.orderForm.controls['orderItems'];
      if (ctrl.length > 0) {
        this.ngbTabset.select('stock');
        this.loading = false;
        const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
        activeModal.componentInstance.showHide = true;
        activeModal.componentInstance.modalHeader = 'Alert';
        activeModal.componentInstance.modalContent = 'Your all previous Added Order Item info will be get removed!';
        activeModal.result.then((res) => {
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

  validSubmit() {
    const formValue: any = this.orderForm.value;
    if (this.orderIdParam) {
      this.service.updatePurchaseOrder(formValue).subscribe(purchaseOrder => {
        // log.debug(`${credentials.username} successfully logged in`);
        this.handleBack();
        this.finally();
      }, error => {
        this.loading = false;
        log.debug(`Creation error: ${error}`);
        this.error = error;
        this.finally();
      });
    } else {
      this.service.createPurchaseOrder(formValue).subscribe(purchaseOrder => {

        this.handleBack();
        this.finally();
      }, error => {
        this.loading = false;
        log.debug(`Creation error: ${error}`);
        this.error = error;
        this.finally();
      });
    }
  }

  validCaratsBfrSbmt(): boolean {
    debugger;
    const ctrls = <any>this.orderForm.controls['purchaseOrderItems'];
    const ctrl = <any>this.orderForm.controls['orderItems'];
    let caratsTab1 = 0;     // Purchase Order Item Total carats
    let caratsTab2 = 0;     // Stock Order Item Total carats
    let remainCaratsTab1: number;   // diff of above both carats
    ctrls.value.forEach(element => {
      caratsTab1 += parseFloat((element.carats));
    });
    ctrl.value.forEach(element => {
      caratsTab2 += parseFloat((element.carats));
    });
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
            this.validSubmit();
            return true;
          } else if (res == 'N') {
            this.ngbTabset.select('stock');
            return false;
          }
        });
      } else {
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

  checkDraftStat() {
    this.loading = false;
    const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
    activeModal.componentInstance.showHide = true;
    activeModal.componentInstance.modalHeader = 'Alert';
    activeModal.componentInstance.modalContent = 'Do You Really want to Save this Order as a Draft? Press Ok for Yes or Cancel for No!';
    activeModal.result.then((res) => {
      if (res == 'Y') {
        this.loading = true;
        this.validSubmit();
      }
    });
  }

  submit() {
    this.loading = true;
    debugger;
    this.errorMessage = '';
    if (this.orderForm.controls['poDate'].valid &&
      this.orderForm.controls['categoryMaster'].valid && this.orderForm.controls['party'].valid) {

      if (this.orderForm.controls.hasOwnProperty('generalDetails') &&
        this.orderForm.controls['generalDetails'].valid) {

        if (this.orderForm.controls.hasOwnProperty('purchaseOrderItems')) {
          debugger
          const ctrls = <any>this.orderForm.controls['purchaseOrderItems'];
          if (ctrls.length > 0) {

            if (this.orderForm.controls.hasOwnProperty('orderItems')) {
              debugger
              const ctrl = <any>this.orderForm.controls['orderItems'];
              if (ctrl.length > 0) {
                if (this.draftStatus.value) {
                  this.checkDraftStat();
                } else {
                  this.draftStatus.setValue(false);
                  this.validCaratsBfrSbmt();
                }
              } else {
                this.ngbTabset.select('stock');
                this.errorMessage = 'Please Add Stock Effect Item List!';
                this.loading = false;
                setTimeout(() => this.errorMessage = null, 3000);
              }

            } else {
              this.ngbTabset.select('stock');
              this.errorMessage = 'Please Add Stock Effect Item List!';
              this.loading = false;
              setTimeout(() => this.errorMessage = null, 3000);
            }

          } else {
            this.ngbTabset.select('order');
            this.errorMessage = 'Please Add Purchase Order Item List!';
            this.loading = false;
            setTimeout(() => this.errorMessage = null, 3000);
          }
        } else {
          this.ngbTabset.select('order');
          this.errorMessage = 'Please Add Purchase Order Item List!';
          this.loading = false;
          setTimeout(() => this.errorMessage = null, 3000);
        }

      }
      else {
        this.markAllTouched(this.orderForm);
        this.ngbTabset.select('general');
        this.errorMessage = 'Please Add General Details!';
        this.loading = false;
        setTimeout(() => this.errorMessage = null, 3000);
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
      this.router.navigate(['../../../../purchaseOrder'], { relativeTo: this.route });
    } else {
      this.router.navigate(['../purchaseOrder'], { relativeTo: this.route });
    }
  }


  estimatedCarats() {
    this.loading = false;
    const activeModal = this.modalService.open(PurchaseOrderModal, { size: 'lg' });
    activeModal.componentInstance.modalHeader = 'ESTIMATED CARATS & VALUES';
    activeModal.componentInstance.estimatedSizeFlag = false;
    this.service.getLatestLocPurchaseInvoicesOfSuppliers(Number(this.orderIdParam)).subscribe(res => {
      activeModal.componentInstance.ordLst = res;
    })
    this.service.getAllLocalPurchaseOrderStockItemsReportLotwise(Number(this.orderIdParam)).subscribe((reportList: any[]) => {
      reportList.forEach(invoiceItem => {
        invoiceItem.lot = invoiceItem.lot.lotName;
        const tot = parseFloat(this.getColTotal('carats', reportList).toFixed(3));
        invoiceItem.ctsPerc = parseFloat(((invoiceItem.carats / tot) * 100).toFixed(3));
      });
      this.modelList = reportList;
      activeModal.componentInstance.totalCarets = this.ttlCarats;
      activeModal.componentInstance.totalAvgAmt = this.ttlCarats == 0 ? 0 : parseFloat((this.ttlNetAmt / this.ttlCarats).toFixed(2));
      activeModal.componentInstance.totalNetAmt = this.ttlNetAmt;
      activeModal.componentInstance.totalBaseAmt = this.ttlBaseAmt;
      activeModal.componentInstance.source.load(reportList);
    });
  }



  estimatedSize() {
    this.xList = [];
    const activeModal = this.modalService.open(PurchaseOrderModal, { size: 'lg' });
    activeModal.componentInstance.modalHeader = 'Estimated Size & Values';
    activeModal.componentInstance.estimatedSizeFlag = true;
    this.mySettings = this.prepareSettingSize();
    this.service.getLatestLocPurchaseInvoicesOfSuppliers(Number(this.orderIdParam)).subscribe(res => {
      activeModal.componentInstance.ordLst = res;
    })
    this.service.localPurchaseOrderEstimateDistinctSizeReport(Number(this.orderIdParam)).subscribe((reportList: any[]) => {

      for (var i = 0; i <= reportList.length; i++) {
        this.xList[i] = [];
      }
      for (var i = 0; i < reportList.length; i++) {
        this.xList[i]["id"] = reportList[i];
      }
      this.service.localPurchaseOrderEstimateSizeReport(Number(this.orderIdParam)).subscribe((reportList: any[]) => {
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
        rowTotValue = this.getCaratColTotal("Total") - this.totCarats;
        this.xList[this.xList.length - 1]["Total"] = rowTotValue;
        for (var i = 0; i < this.xList.length; i++) {
          this.xList[i]["%"] = Number((this.xList[i]["Total"] / rowTotValue) * 100).toFixed(2);
        }

        activeModal.componentInstance.source.load(this.xList);
      }
      );

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

  private initForm() {
    this.orderForm = this.fb.group({
      'poId': [''],
      // 'poNo': ['', Validators.compose([Validators.required])],
      'poDate': [''],
      'categoryMaster': ['', Validators.compose([Validators.required])],
      'party': ['', Validators.compose([Validators.required])],
      'orderAmount': [''],
      'orderAmountBase': [''],
      'partyMasterByPartyId': [''],
      'bankId': [''],
      'wtAvgRate': [''],
      'profit': [''],
      'stockExchangeRate': [''],
      'poCurrency': ['', Validators.compose([Validators.required])],
      'exchangeRate': [''],
      'baseExchangeRate': ['', Validators.compose([Validators.required])],
      'stockCurrency': [''],
      'baseCurr': [''],
      'draftStatus': ['']
    });

    // this.poNo = this.orderForm.controls['poNo'];
    this.poDate = this.orderForm.controls['poDate'];
    this.categoryMaster = this.orderForm.controls['categoryMaster'];
    this.party = this.orderForm.controls['party'];
    this.bankId = this.orderForm.controls['bankId'];
    this.poCurrency = this.orderForm.controls['poCurrency'];
    this.exchangeRate = this.orderForm.controls['exchangeRate'];
    this.stockExchangeRate = this.orderForm.controls['stockExchangeRate'];
    this.baseExchangeRate = this.orderForm.controls['baseExchangeRate'];
    this.stockCurrency = this.orderForm.controls['stockCurrency'];
    this.baseCurr = this.orderForm.controls['baseCurr'];
    this.draftStatus = this.orderForm.controls['draftStatus'];

    this.poCurrency.valueChanges.subscribe(currencyId => {
      debugger;
      if (this.poCurrency.value) {
        this.currencyService.getAllCurrencies().subscribe((currList) => {
          const b = currList.find(ele => {
            if (ele.currId == this.poCurrency.value) {
              return true;
            }
          })
          if (b != undefined || b != null || b != '') {
            this.poCurrName = b.currName;
            this.poCurrencyCode = b.currCode;
          }
        })
      }

      if (this.baseCurr.value == this.poCurrency.value) {
        this.baseExchangeRate.setValue(1);
      } else {
        this.exchangeRateList.forEach(res => {
          if (res.exchType == "ST" && res.currencyMasterByToCurrId == this.baseCurr.value
            && res.currencyMasterByFromCurrId == this.poCurrency.value) {
            if (!res.toDate || res.toDate <= this.todayDate) {
              this.baseExchangeRate.setValue(res.exchRate);
            }
          }
        });
      }

    })

    this.party.valueChanges.subscribe(resp => {
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
