import { NgbTabset, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { LotService } from '../../../../stockManagement/components/lots';
import { Observable } from 'rxjs/Rx';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { Location } from '@angular/common';
import { AuthenticationService } from '../../../../../core/authentication/authentication.service';
import { Logger } from '../../../../../core/logger.service';
import { ExportSalesOrderService } from '../exportSalesOrder.service';
import { CategoryService } from '.../../app/pages/masters/components/categories/category.service';
import { PartyDetailsService } from '.../../app/pages/company/components/partyDetails/partyDetails.service';
import { CommonService } from 'app/pages/masters/components/common/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModalComponent } from '../../../../../shared/common-modal/common-modal.component';
import { CurrencyService } from 'app/pages/masters/components/currency/currency.service';
import { ExchangeRateService } from 'app/pages/masters/components/exchangeRate/exchangeRate.service';
import { HierarchyRelationService } from 'app/pages/company/components/hierarchyRelation';
import { LotItemCreationService } from '../../../../stockManagement/components/lotItemCreation/index';

const log = new Logger('ExportSalesOrder');

@Component({
  selector: 'create-exportSalesOrder',
  templateUrl: './createExportSalesOrder.html',
  styleUrls: ['./createExportSalesOrder.scss']
})
export class CreateExportSalesOrder implements OnInit {

  @ViewChild(NgbTabset) ngbTabset: NgbTabset;
  @ViewChild('selectParty') selectParty: ElementRef;

  errorMessage: string;
  showSbmtBtn: boolean = true;
  isViewMode: boolean;

  exportSalesOrderForm: FormGroup;
  salesOrderData: any = {};
  exportSalesOrderIdParam: string;
  pageTitle = 'Create Export Sales Order';
  error: string = null;
  isLoading = false;
  stockCurrName: any;
  baseCurrName: any;
  soCurrName: any;
  stockCurrCode: string;
  baseCurrCode: string;
  soCurrCode: string;
  partyNote: string = '';
  originCountryId: number;

  loading: boolean = false;
  todayDate: string;
  catMasterList: Observable<any[]>;
  partyTypeList: Observable<any[]>;

  lotItems: Observable<any[]>;
  lotMasterList: Observable<any[]>;
  partyStatus: boolean;
  partyBankBranches: any[] = [];
  bankNameList: any[] = [];
  currList: any[] = [];
  exchangeRateList: any[] = [];
  termsList: any[] = [];
  bankList: any;
  selectedCat: any;


  public soDate: AbstractControl;
  public categoryMaster: AbstractControl;
  public partyMasterByPartyId: AbstractControl;
  public advReal: AbstractControl;
  public custbank: AbstractControl;
  public soCurrency: AbstractControl;
  public stockCurrency: AbstractControl;
  public baseCurrency: AbstractControl;
  public stockExchangeRate: AbstractControl;
  public soExchangeRate: AbstractControl;
  public draftStatus: AbstractControl;
  isView: any;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private catService: CategoryService,
    private lotService: LotService,
    private modalService: NgbModal,
    private commonService: CommonService,
    private service: ExportSalesOrderService,
    private partyService: PartyDetailsService,
    private lotItemService: LotItemCreationService,
    private hierService: HierarchyRelationService,
    private excnageService: ExchangeRateService,
    private currencyService: CurrencyService,
    private back: Location,
    private authService: AuthenticationService) {

    this.todayDate = this.today();
    this.hierService.getHierById(this.authService.credentials.company).subscribe(data => {

      this.hierService.getHierMasterById(data.hierarchyMaster.hierId).subscribe(res => {

        this.originCountryId = res.addressMaster.country;

        this.currencyService.getAllCurrencies().subscribe((currList) => {
          this.currList = currList;

          if (res.hierarchyDetailRequestDTO) {
            this.stockCurrency.setValue(res.hierarchyDetailRequestDTO.currencyMasterByStockCurrId);
            const stock = this.currList.find(ele => {
              if (ele.currId == this.stockCurrency.value) {
                return true;
              }
            })
            this.stockCurrName = stock.currName;
            this.stockCurrCode = stock.currCode;

            this.baseCurrency.setValue(res.hierarchyDetailRequestDTO.currencyMasterByCurrId);
            const base = this.currList.find(ele => {
              if (ele.currId == this.baseCurrency.value) {
                return true;
              }
            })
            this.baseCurrName = base.currName;
            this.baseCurrCode = base.currCode;

            // setting So Currency
            //this.soCurrency.setValue(this.stockCurrency.value);
            this.soCurrName = this.stockCurrName;
            this.soCurrCode = this.stockCurrCode;
          }

          this.excnageService.getData().subscribe((exchangeRateList) => {
            this.exchangeRateList = exchangeRateList;
            this.soCurrency.setValue(this.stockCurrency.value);
            if (this.baseCurrency.value && this.stockCurrency.value && this.baseCurrency.value == this.stockCurrency.value) {
              this.stockExchangeRate.setValue(1);
            } else {
              let flag = 0;
              this.exchangeRateList.forEach(res => {
                if (res.exchType == "ST" && res.currencyMasterByFromCurrId == this.stockCurrency.value && res.currencyMasterByToCurrId == this.baseCurrency.value) {
                  if (!res.toDate || res.toDate <= this.todayDate) {
                    this.stockExchangeRate.setValue(res.exchRate);
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
    // For partyType as Customer & Associates
    // this.partyTypeList = this.partyService.getData().map(a => a.filter(b => b.partyType.code == 'CU' || b.partyType.code == 'AS'));

    // For partyType as Customer
    this.partyTypeList = this.partyService.getData().map(a => a.filter(b => b.partyType.code == 'CU'));
    this.catMasterList = this.catService.getData();
    this.lotMasterList = this.lotService.getData();

    this.createForm();
    this.soDate.setValue(this.todayDate);
  }

  ngOnInit() {

    this.route.params.subscribe((params: Params) => {
      this.exportSalesOrderIdParam = params['soId'];
      this.isView = params['isView'];
      if (this.exportSalesOrderIdParam) {
        if (this.isView == 'true') {
          this.pageTitle = 'View Export Sales Order';
          this.partyTypeList.subscribe(parties => {

            this.service.getExportSalesOrderById(this.exportSalesOrderIdParam).subscribe(res => {
              parties.forEach((party, i) => {
                if (party.partyId == res.partyMasterByPartyId) {
                  res.partyMasterByPartyId = party;
                  setTimeout(() => { this.selectParty.nativeElement.selectedIndex = i }, 500);
                }
              });

              if (res && params['status'] == 'COMPLETED') {
                this.pageTitle = 'View Export Sales Order';
                this.isViewMode = true;
                this.showSbmtBtn = false;
                this.salesOrderData = res;
                this.soExchangeRate.setValue(res.soExchangeRate);
                this.exportSalesOrderForm.patchValue(res);
                this.exportSalesOrderForm.disable();
                this.exportSalesOrderForm.markAsUntouched();
              } else {
                this.isViewMode = false;
                this.markAllTouched(this.exportSalesOrderForm);
              }

              setTimeout(() => {
                this.stockExchangeRate.setValue(res.stockExchangeRate);
                this.soCurrency.setValue(res.soCurrency);
                this.soExchangeRate.setValue(res.soExchangeRate);
              }, 1000);

              this.salesOrderData = res;
              this.soExchangeRate.setValue(res.soExchangeRate);
              this.currList.forEach(ele => {
                if (ele.currId == res.stockCurrency) {
                  this.stockCurrCode = ele.currCode;
                  this.stockCurrName = ele.currName;
                }
                if (ele.currId == res.baseCurrency) {
                  this.baseCurrCode = ele.currCode;
                  this.baseCurrName = ele.currName;
                }
              })
              this.isViewMode = true;
              this.showSbmtBtn = false;
              this.exportSalesOrderForm.patchValue(res);
              this.exportSalesOrderForm.markAsUntouched();
            });
          });
        } else {
          this.pageTitle = 'Edit Export Sales Order';
          this.partyTypeList.subscribe(parties => {

            this.service.getExportSalesOrderById(this.exportSalesOrderIdParam).subscribe(res => {
              parties.forEach((party, i) => {
                if (party.partyId == res.partyMasterByPartyId) {
                  res.partyMasterByPartyId = party;
                  setTimeout(() => { this.selectParty.nativeElement.selectedIndex = i }, 500);
                }
              });

              if (res && params['status'] == 'COMPLETED') {
                this.pageTitle = 'View Export Sales Order';
                this.isViewMode = true;
                this.showSbmtBtn = false;
                this.salesOrderData = res;
                this.soExchangeRate.setValue(res.soExchangeRate);
                this.exportSalesOrderForm.patchValue(res);
                this.exportSalesOrderForm.disable();
                this.exportSalesOrderForm.markAsUntouched();
              } else {
                this.isViewMode = false;
                this.markAllTouched(this.exportSalesOrderForm);
              }

              setTimeout(() => {
                this.stockExchangeRate.setValue(res.stockExchangeRate);
                this.soCurrency.setValue(res.soCurrency);
                this.soExchangeRate.setValue(res.soExchangeRate);
              }, 1000);

              this.salesOrderData = res;
              this.soExchangeRate.setValue(res.soExchangeRate);
              this.currList.forEach(ele => {
                if (ele.currId == res.stockCurrency) {
                  this.stockCurrCode = ele.currCode;
                  this.stockCurrName = ele.currName;
                }
                if (ele.currId == res.baseCurrency) {
                  this.baseCurrCode = ele.currCode;
                  this.baseCurrName = ele.currName;
                }
              })
              this.exportSalesOrderForm.patchValue(res);
            });
          });
        }
      }
    });
  }

  dateFormate(value: any) {
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
    let flag = 0;
    this.partyBankBranches.forEach(data => {
      if (data.bankBranch.bankId == this.bankList.id) {
        if (this.bankNameList.length > 0) {
          this.bankNameList.forEach(res => {
            if (res.value == data.bankBranch.bankBrId) {
              flag = 1;
            }
          });

          if (flag != 1) {
            this.bankNameList.push({ 'value': data.id, 'title': this.bankList.name + '_' + data.bankBranch.bankBrName });
          }
        } else {
          this.bankNameList.push({ 'value': data.id, 'title': this.bankList.name + '_' + data.bankBranch.bankBrName });
        }
      }
    });
  }

  onChangeCat(catId: any) {
    // if (this.exportSalesOrderForm.controls.hasOwnProperty('orderItems')) {
    //   const ctrl = <any>this.exportSalesOrderForm.controls['orderItems'];
    //   if (ctrl.length > 0) {
    //     this.ngbTabset.select('order');
    //     const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
    //     activeModal.componentInstance.showHide = true;
    //     activeModal.componentInstance.modalHeader = 'Alert';
    //     activeModal.componentInstance.modalContent = 'Your all previous Added Order Item info will be get removed!';
    //     activeModal.result.then ((res) => {
    //       if (res == 'Y') {
    //         this.selectedCat = catId;
    //         this.categoryMaster.setValue(this.selectedCat);
    //       } else if (res == 'N') {
    //         this.categoryMaster.setValue(this.selectedCat);
    //       }
    //     });
    //   } else {
    //     this.selectedCat = this.categoryMaster.value;
    //   }
    // } else {
    //   this.selectedCat = this.categoryMaster.value;
    // }
    // this.categoryMaster.setValue(this.selectedCat);
  }

  validSubmit() {

    if (!this.advReal.value) {
      this.advReal.setValue(false);
    } else {
      this.advReal.setValue(true);
    }
    if (!this.draftStatus.value) {
      this.draftStatus.setValue(false);
    } else {
      this.draftStatus.setValue(true);
    }
    const formValue: any = this.exportSalesOrderForm.value;
    formValue.partyMasterByPartyId = this.partyMasterByPartyId.value.partyId;

    if (this.exportSalesOrderIdParam) {
      this.service.createExportSalesOrder(formValue).subscribe(salesOrder => {
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
      this.service.createExportSalesOrder(formValue).subscribe(salesOrder => {
        // log.debug(`${credentials.selectCategory} successfully logged in`);
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

  submit() {
    this.loading = true;
    this.errorMessage = '';
    if (this.exportSalesOrderForm.controls['soDate'].valid && this.exportSalesOrderForm.controls['categoryMaster'].valid &&
      this.exportSalesOrderForm.controls['partyMasterByPartyId'].valid) {

      if (this.exportSalesOrderForm.controls.hasOwnProperty('orderItems')) {

        const ctrl = <any>this.exportSalesOrderForm.controls['orderItems'];
        if (ctrl.length > 0) {

          if (this.exportSalesOrderForm.controls.hasOwnProperty('customerDetails') &&
            this.exportSalesOrderForm.controls['customerDetails'].valid) {

            if (this.exportSalesOrderForm.controls.hasOwnProperty('saleDetails') &&
              this.exportSalesOrderForm.controls['saleDetails'].valid) {

              this.ngbTabset.select('order');
              setTimeout(() => {
                this.validSubmit();
              });
            } else {
              this.loading = false;
              this.markAllTouched(this.exportSalesOrderForm);
              this.ngbTabset.select('general');
              this.errorMessage = 'Please Add General Details!';
              // this.loading = false;
              setTimeout(() => this.errorMessage = null, 3000);
            }

          } else {
            this.loading = false;
            this.markAllTouched(this.exportSalesOrderForm);
            this.ngbTabset.select('customer');
            this.errorMessage = 'Please Add Customer Details!';
            // this.loading = false;
            setTimeout(() => this.errorMessage = null, 3000);
          }

        } else {
          this.loading = false;
          this.ngbTabset.select('order');
          this.errorMessage = 'Please Add Order Item List!';
          // this.loading = false;
          setTimeout(() => this.errorMessage = null, 3000);
        }

      } else {
        this.loading = false;
        this.ngbTabset.select('order');
        this.errorMessage = 'Please Add Order Item List!';
        // this.loading = false;
        setTimeout(() => this.errorMessage = null, 3000);
      }

    } else {
      this.loading = false;
      this.markAllTouched(this.exportSalesOrderForm);
    }
  }

  finally() {
    this.isLoading = false;
    this.exportSalesOrderForm.markAsPristine();
  }

  handleBack(cancelling: boolean = false) {
    // TODO: if cancelling then ask to confirn

    // if (this.exportSalesOrderIdParam) {
    //   this.router.navigate(['../../../exportSalesOrder'], {relativeTo: this.route});
    // } else {
    //   this.router.navigate(['../exportSalesOrder'], {relativeTo: this.route});
    // }
    this.back.back();
  }

  private createForm() {
    this.exportSalesOrderForm = this.fb.group({
      'soId': [''],
      'soDate': [''],
      'categoryMaster': ['', Validators.compose([Validators.required])],
      'partyMasterByPartyId': ['', Validators.compose([Validators.required])],
      'stockCurrency': [''],
      'stockExchangeRate': [''],
      'soCurrency': ['', Validators.compose([Validators.required])],
      'soExchangeRate': ['', Validators.compose([Validators.required])],
      'baseCurrency': [''],
      'advReal': [''],
      'draftStatus': [''],
      'custbank': [''],
      'orderAmountFC': [''],
      'orderAmountSTK': [''],
      'orderAmountBase': [''],
      'profitSTK': [''],
      'profitBase': [''],
    });
    this.soDate = this.exportSalesOrderForm.controls['soDate'];
    this.categoryMaster = this.exportSalesOrderForm.controls['categoryMaster'];
    this.partyMasterByPartyId = this.exportSalesOrderForm.controls['partyMasterByPartyId'];
    this.stockCurrency = this.exportSalesOrderForm.controls['stockCurrency'];
    this.stockExchangeRate = this.exportSalesOrderForm.controls['stockExchangeRate'];
    this.soCurrency = this.exportSalesOrderForm.controls['soCurrency'];
    this.soExchangeRate = this.exportSalesOrderForm.controls['soExchangeRate'];
    this.baseCurrency = this.exportSalesOrderForm.controls['baseCurrency'];
    this.advReal = this.exportSalesOrderForm.controls['advReal'];
    this.draftStatus = this.exportSalesOrderForm.controls['draftStatus'];
    this.custbank = this.exportSalesOrderForm.controls['custbank'];

    this.soCurrency.valueChanges.subscribe(currency => {
      debugger;
      if (this.soCurrency.value) {
        this.currencyService.getAllCurrencies().subscribe((currList) => {
          const curr = currList.find(ele => {
            if (ele.currId == this.soCurrency.value) {
              return true;
            }
          })
          if (curr != undefined || curr != null || curr != '') {
            this.soCurrName = curr.currName;
            this.soCurrCode = curr.currCode;
          }
        })
      }

      if (this.baseCurrency.value == this.soCurrency.value) {
        this.soExchangeRate.setValue(1);
      } else {
        this.exchangeRateList.forEach(res => {
          if (res.exchType == 'ST' && res.currencyMasterByToCurrId == this.baseCurrency.value
            && res.currencyMasterByFromCurrId == this.soCurrency.value) {
            if (!res.toDate || res.toDate <= this.todayDate) {
              this.soExchangeRate.setValue(res.exchRate);
            }
          }
        });
      }

    })

    this.partyMasterByPartyId.valueChanges.subscribe(resp => {
      if (resp) {
        this.bankNameList = [];
        this.partyStatus = true;
        if (resp.remarks) {
          this.partyNote = resp.remarks;
        } else {
          this.partyNote = '';
        }

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
      }
    })
  }
}
