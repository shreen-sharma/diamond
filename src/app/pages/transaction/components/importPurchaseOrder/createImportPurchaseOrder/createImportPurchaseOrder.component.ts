import { NgbTabset, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { LotService } from '../../../../stockManagement/components/lots';
import { Observable } from 'rxjs/Rx';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { Location } from '@angular/common';
import { CurrencyService } from '../../../../masters/components/currency/index';
import { AuthenticationService } from '../../../../../core/authentication/authentication.service';
import { Logger } from '../../../../../core/logger.service';
import { ImportPurchaseOrderService } from '../importPurchaseOrder.service';
import { CategoryService } from '.../../app/pages/masters/components/categories/category.service';
import { PartyDetailsService } from '.../../app/pages/company/components/partyDetails/partyDetails.service';
import { CommonService } from 'app/pages/masters/components/common/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModalComponent } from '../../../../../shared/common-modal/common-modal.component';
import { HierarchyRelationService } from 'app/pages/company/components/hierarchyRelation';
import { ExchangeRateService } from 'app/pages/masters/components/exchangeRate/exchangeRate.service';
import { ZoneEntryService } from '../../../../masters/components/zoneEntry/zoneEntry.service';

const log = new Logger('ImportPurchaseOrder');

@Component({
  selector: 'create-importPurchaseOrder',
  templateUrl: './createImportPurchaseOrder.html',
  styleUrls: ['./createImportPurchaseOrder.scss']
})

export class CreateImportPurchaseOrder implements OnInit  {
  baseCurrName: any;
  poCurrName: any;
  stockCurrName: any;
  
  @ViewChild(NgbTabset) ngbTabset: NgbTabset;
  @ViewChild('selectParty') selectParty: ElementRef;

  errorMessage: string;
  showButton = false;
  isViewMode: boolean;
  showSbmtBtn: Boolean = true;
  purchOrderData: any = {};
  orderIdParam: string;
  pageTitle = 'Create Import Purchase Order';
  error: string = null;
  isLoading = false;

  importOrderForm: FormGroup;

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
  selectedCat: any;
  stockCurrencyCode: string;
  baseCurrencyCode: string;
  poCurrencyCode: string;

  correncyMasterList: any[] = [];
  termsList: any[] = [];
  bnkList: any[] = [];
  notifierList: any[] = [];
  countryList: any[] = [];
  cityList: any[] = [];
  loading: boolean = false;

  public poDate: AbstractControl;
  public categoryMaster: AbstractControl;
  public party: AbstractControl;
  public bankId: AbstractControl;
  public poCurrency: AbstractControl;
  public exchangeRate: AbstractControl;
  public baseExchangeRate: AbstractControl;
  public wtAvgRate: AbstractControl;
  public stockCurrency: AbstractControl;
  public baseCurr: AbstractControl;
  public draftStatus: AbstractControl;
  public advRemitt: AbstractControl;
  // public supBankName: AbstractControl;
  // public supplierNote: AbstractControl;
  // public supBankNote: AbstractControl;
  public notifier: AbstractControl;
  public notifierNote: AbstractControl;
  public corresBank: AbstractControl;
  // public bank: AbstractControl;
  // public bankTnC: AbstractControl;
  // public currency: AbstractControl;
  // public bankDays: AbstractControl;
  // public bDueDate: AbstractControl;
  public suppDays: AbstractControl;
  public sDueDate: AbstractControl;
  public orgCountry: AbstractControl;
  public portDisChrg: AbstractControl;
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
    private service: ImportPurchaseOrderService,
    private hierService: HierarchyRelationService,
    private partyService: PartyDetailsService,
    private authService: AuthenticationService,
    private zoneService: ZoneEntryService,
    private back: Location) {

    this.todayDate = this.today();

    this.hierService.getHierById(this.authService.credentials.company).subscribe( data => {
      this.hierService.getHierMasterById(data.hierarchyMaster.hierId).subscribe( res => {
        this.currencyService.getAllCurrencies().subscribe((currList) => {
          this.currList = currList;

          if (res.hierarchyDetailRequestDTO) {
            this.stockCurrency.setValue(res.hierarchyDetailRequestDTO.currencyMasterByStockCurrId);
            const b = this.currList.find( ele => {
              if (ele.currId == this.stockCurrency.value) {
                return true;
              }
            })
            this.stockCurrName = b.currName;
            this.stockCurrencyCode = b.currCode;

            this.baseCurr.setValue(res.hierarchyDetailRequestDTO.currencyMasterByCurrId);
            const c = this.currList.find( ele => {
              if (ele.currId == this.baseCurr.value) {
                return true;
              }
            })
            this.baseCurrName = c.currName;
            this.baseCurrencyCode = c.currCode;

            this.poCurrName = this.stockCurrName;
            this.poCurrencyCode = this.stockCurrencyCode;
          }

          this.excnageService.getData().subscribe((exchangeRateList) => {
            this.exchangeRateList = exchangeRateList;
            this.poCurrency.setValue(this.stockCurrency.value);
            if (this.baseCurr.value && this.stockCurrency.value && this.baseCurr.value == this.stockCurrency.value) {
              this.exchangeRate.setValue(1);
            } else {
              let flag = 0;
              this.exchangeRateList.forEach( resp => {
                 if (resp.exchType == 'ST' && resp.currencyMasterByFromCurrId == this.stockCurrency.value
                  && resp.currencyMasterByToCurrId == this.baseCurr.value) {
                  if (!resp.toDate || resp.toDate <= this.todayDate) {
                    this.exchangeRate.setValue(resp.exchRate);
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

    this.zoneService.getAllCountries().subscribe((countryList) => {
      this.countryList = countryList;
    });

    this.zoneService.getAllGeoByType('CT').subscribe( (cityList) => {
      this.cityList = cityList;
    });

    this.commonService.getAllCommonMasterByType('TS').subscribe( data => {
      this.termsList = data;
    });

    this.currencyService.getAllCurrencies().subscribe( data => {
      this.correncyMasterList = data;
    });

    this.commonService.getAllCommonMasterByType('BK').subscribe( (bnkList) => {
      this.bnkList = bnkList;
    });

    this.partyService.getPartyByType('NO').subscribe( (par) => {
      this.notifierList = par;
    });

    this.partyTypeList = this.partyService.getPartyByType('SU');
    this.catMasterList = this.catService.getData();
    this.lotMasterList = this.lotService.getData();

    this.initForm();
    this.poDate.setValue(this.todayDate);
  }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.orderIdParam = params['poId'];
      this.isView = params['isView'];
      if (this.orderIdParam) {
        if(this.isView == 'true'){
          this.pageTitle = 'View Import Purchase Order';
          this.partyTypeList.subscribe(parties => {
  
            this.service.getImportPurchaseOrderById(this.orderIdParam).subscribe( res => {
              parties.forEach((par, i) => {
                if (par.partyId == res.party.partyId) {
                  res.party = par;
                  setTimeout(() => {this.selectParty.nativeElement.selectedIndex = i}, 500);
                }
              });
  
              if (res && params['status'] == 'COMPLETED') {
                this.pageTitle = 'View Import Purchase Order';
                this.isViewMode = true;
                this.showSbmtBtn = false;
                this.purchOrderData = res;
                this.importOrderForm.patchValue(res);
                this.importOrderForm.disable();
                this.importOrderForm.markAsUntouched();
              } else {
                this.isViewMode = false;
                this.markAllTouched(this.importOrderForm);
              }           
  
              this.purchOrderData = res;
              this.baseExchangeRate.setValue(res.baseExchangeRate);
              this.currList.forEach( ele => {
                if (ele.currId == res.stockCurrency) {
                  this.stockCurrencyCode = ele.currCode;
                  this.stockCurrName = ele.currName;
                }
                if (ele.currId == res.baseCurrency) {
                  this.baseCurrencyCode = ele.currCode;
                  this.baseCurrName = ele.currName;
                }
              })
              setTimeout(() => {
                this.exchangeRate.setValue(res.exchangeRate);
                this.poCurrency.setValue(res.poCurrency);
                this.suppDays.setValue(res.suppDays);
                this.sDueDate.setValue(res.sDueDate);
                this.baseExchangeRate.setValue(res.baseExchangeRate);
              }, 1000);
              this.importOrderForm.patchValue(res);
              this.isViewMode = true;
              this.showSbmtBtn = false;
              this.importOrderForm.markAsUntouched();
            });
          });
        } else {
          this.pageTitle = 'Edit Import Purchase Order';
          this.partyTypeList.subscribe(parties => {
  
            this.service.getImportPurchaseOrderById(this.orderIdParam).subscribe( res => {
              parties.forEach((par, i) => {
                if (par.partyId == res.party.partyId) {
                  res.party = par;
                  setTimeout(() => {this.selectParty.nativeElement.selectedIndex = i}, 500);
                }
              });
  
              if (res && params['status'] == 'COMPLETED') {
                this.pageTitle = 'View Import Purchase Order';
                this.isViewMode = true;
                this.showSbmtBtn = false;
                this.purchOrderData = res;
                this.importOrderForm.patchValue(res);
                this.importOrderForm.disable();
                this.importOrderForm.markAsUntouched();
              } else {
                this.isViewMode = false;
                this.markAllTouched(this.importOrderForm);
              }           
  
              this.purchOrderData = res;
              this.baseExchangeRate.setValue(res.baseExchangeRate);
              this.currList.forEach( ele => {
                if (ele.currId == res.stockCurrency) {
                  this.stockCurrencyCode = ele.currCode;
                  this.stockCurrName = ele.currName;
                }
                if (ele.currId == res.baseCurrency) {
                  this.baseCurrencyCode = ele.currCode;
                  this.baseCurrName = ele.currName;
                }
              })
              this.importOrderForm.patchValue(res);
              setTimeout(() => {
                this.exchangeRate.setValue(res.exchangeRate);
                this.poCurrency.setValue(res.poCurrency);
                this.suppDays.setValue(res.suppDays);
                this.sDueDate.setValue(res.sDueDate);
                this.baseExchangeRate.setValue(res.baseExchangeRate);
              }, 1000);
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

  today (): string {
    const today = new Date();
    const dd = today.getDate();
    const mm = today.getMonth() + 1; // January is 0!
    const yyyy = today.getFullYear();
    return yyyy + '-' + (mm < 10 ? '0' + mm : mm) + '-' + (dd < 10 ? '0' + dd : dd) ;
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
    let flag = 0;
    this.bankNameList = [];
    this.partyBankBranches.forEach(data => {
      if (data.bankBranch.bankId == this.bankList.id ) {
        if (this.bankNameList.length > 0) {
          this.bankNameList.forEach(res => {
            if (res.value == data.bankBranch.bankBrId) {
              flag = 1;
            }
          });
          if (flag != 1) {
            //  id is contactBankBranch Id
          this.bankNameList.push({'value': data.id, 'title': this.bankList.name + '_' + data.bankBranch.bankBrName });
          }
        } else {
          this.bankNameList.push({'value': data.id, 'title': this.bankList.name + '_' + data.bankBranch.bankBrName });
        }
      }
    });
  }

  onChangeCat(catId: any) {
    // if (this.importOrderForm.controls.hasOwnProperty('stockEffectsItems')) {
    //   const ctrl = <any>this.importOrderForm.controls['stockEffectsItems'];
    //   if (ctrl.length > 0) {
    //     this.ngbTabset.select('stock');
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
    if (!this.advRemitt.value) {
        this.advRemitt.setValue(false);
    }
    if (!this.draftStatus.value) {
      this.draftStatus.setValue(false);
    } else {
      this.draftStatus.setValue(true);
    }
    const formValue: any = this.importOrderForm.value;
    if (this.orderIdParam) {
      this.service.updateImportPurchaseOrder(formValue).subscribe(purchaseOrder => {
      this.handleBack();
      this.finally();
      }, error => {
        this.loading = false;
          log.debug(`Creation error: ${error}`);
          this.error = error;
          this.finally();
        });
    } else {
      this.service.createImportPurchaseOrder(formValue).subscribe(purchaseOrder => {
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
    const ctrls = <any>this.importOrderForm.controls['purchaseOrderItems'];
    const ctrl = <any>this.importOrderForm.controls['stockEffectsItems'];
    let caratsTab1 = 0;     // Purchase Order Item Total carats
    let caratsTab2 = 0;     // Stock Order Item Total carats
    let remainCaratsTab1:  number;   // diff of above both carats
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
        activeModal.result.then ((res) => {
          if (res == 'Y') {
            this.validSubmit();
            this.loading = true;
            return true;
          } else if (res == 'N') {
            this.loading = false;
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
    activeModal.result.then ((res) => {
      if (res == 'Y') {
       this.validSubmit();
      }
    });
  }

  submit() {
    
    this.errorMessage = '';
    if (this.importOrderForm.controls['poDate'].valid &&
       this.importOrderForm.controls['categoryMaster'].valid && this.importOrderForm.controls['party'].valid &&
        this.importOrderForm.controls['bankId'].valid && this.orgCountry.valid) {
          this.loading = true;
        if (this.importOrderForm.controls.hasOwnProperty('generalDetails') &&
           this.importOrderForm.controls['generalDetails'].valid) {

            if (this.importOrderForm.controls.hasOwnProperty('purchaseOrderItems')) {
              const ctrls = <any>this.importOrderForm.controls['purchaseOrderItems'];
              if (ctrls.length > 0) {

                if (this.importOrderForm.controls.hasOwnProperty('stockEffectsItems')) {
                    const ctrl = <any>this.importOrderForm.controls['stockEffectsItems'];
                    if (ctrl.length > 0) {
                      if (this.draftStatus.value) {
                        this.checkDraftStat();
                      } else {
                        this.draftStatus.setValue(false);
                        this.validCaratsBfrSbmt();
                      }
                    } else {
                      this.loading = false;
                      this.ngbTabset.select('stock');
                      this.errorMessage = 'Please Add Stock Effect Item List!';
                     
                      setTimeout(() => this.errorMessage = null, 3000);
                    }
                } else {
                  this.loading = false;
                  this.ngbTabset.select('stock');
                  this.errorMessage = 'Please Add Stock Effect Item List!';
                 
                  setTimeout(() => this.errorMessage = null, 3000);
                }
              } else {
                this.loading = false;
                this.ngbTabset.select('order');
                this.errorMessage = 'Please Add Purchase Order Item List!';
              //  this.loading = false;
                setTimeout(() => this.errorMessage = null, 3000);
              }
            } else {
              this.loading = false;
              this.ngbTabset.select('order');
              this.errorMessage = 'Please Add Purchase Order Item List!';
            //  this.loading = false;
              setTimeout(() => this.errorMessage = null, 3000);
            }

        } else {
          this.loading = false;
          this.markAllTouched(this.importOrderForm);
          this.ngbTabset.select('general');
          this.errorMessage = 'Please Add General Details!';
        //  this.loading = false;
          setTimeout(() => this.errorMessage = null, 3000);
        }
     } else {
      this.loading = false;
      this.markAllTouched(this.importOrderForm);
     }
  }

  finally() {
      this.isLoading = false;
      this.importOrderForm.markAsPristine();
  }

  handleBack(cancelling: boolean = false) {
    // TODO: if cancelling then ask to confirn

    // if (this.orderIdParam) {
    //   this.router.navigate(['../../../importPurchaseOrder'], {relativeTo: this.route});
    // } else {
    //   this.router.navigate(['../importPurchaseOrder'], {relativeTo: this.route});
    // }
    this.back.back();
  }

  private initForm() {
    this.importOrderForm = this.fb.group({
      'poId': [''],
     // 'poNo': ['', Validators.compose([Validators.required])],
      'poDate': [''],
      'categoryMaster': ['', Validators.compose([Validators.required])],
      'party': ['', Validators.compose([Validators.required])],
      'orderAmount': [''],
      'orderAmountBase': [''],
      'bankId': ['', Validators.compose([Validators.required])],
      'wtAvgRate': [''],
      'profit': [''],
      'poCurrency': ['', Validators.compose([Validators.required])],
      'exchangeRate': [''],
      'baseExchangeRate': ['', Validators.compose([Validators.required])],
      'stockCurrency': [''],
      'baseCurr': [''],
      'draftStatus': [''],
      'advRemitt': [''],
      // 'supplierNote': [''],
      // 'supBankNote': [''],
      'notifier': [''],
      'notifierNote': [''],
      // 'supBankName': [''],
      'corresBank': [''],
      // 'bank': [''],
      // 'bankTnC': [''],
      // 'currency': [''],
      // 'bDueDate': [''],
      // 'bankDays': ['', Validators.compose([Validators.required])],
      'sDueDate': [''],
      'suppDays': ['', Validators.compose([Validators.required])],
      'orgCountry': ['', Validators.compose([Validators.required])],
      'portDisChrg': [''],
    });

    // this.poNo = this.importOrderForm.controls['poNo'];
     this.poDate = this.importOrderForm.controls['poDate'];
     this.categoryMaster = this.importOrderForm.controls['categoryMaster'];
     this.party = this.importOrderForm.controls['party'];
     this.bankId = this.importOrderForm.controls['bankId'];
     this.poCurrency = this.importOrderForm.controls['poCurrency'];
     this.exchangeRate = this.importOrderForm.controls['exchangeRate'];
     this.baseExchangeRate = this.importOrderForm.controls['baseExchangeRate'];
     this.stockCurrency = this.importOrderForm.controls['stockCurrency'];
     this.baseCurr = this.importOrderForm.controls['baseCurr'];
     this.draftStatus = this.importOrderForm.controls['draftStatus'];
     this.advRemitt = this.importOrderForm.controls['advRemitt'];

    // this.supplierNote = this.importOrderForm.controls['supplierNote'];
    // this.supBankNote = this.importOrderForm.controls['supBankNote'];
    this.notifier = this.importOrderForm.controls['notifier'];
    this.notifierNote = this.importOrderForm.controls['notifierNote'];
    // this.supBankName = this.importOrderForm.controls['supBankName'];
    this.corresBank = this.importOrderForm.controls['corresBank'];
    // this.bank = this.importOrderForm.controls['bank'];
    // this.bankTnC = this.importOrderForm.controls['bankTnC'];
    // this.currency = this.importOrderForm.controls['currency'];
    // this.bankDays = this.importOrderForm.controls['bankDays'];
    // this.bDueDate = this.importOrderForm.controls['bDueDate'];
    this.suppDays = this.importOrderForm.controls['suppDays'];
    this.sDueDate = this.importOrderForm.controls['sDueDate'];
    this.orgCountry = this.importOrderForm.controls['orgCountry'];
    this.portDisChrg = this.importOrderForm.controls['portDisChrg'];


    this.poCurrency.valueChanges.subscribe(currencyId => {
      debugger;
      if (this.poCurrency.value) {
        this.currencyService.getAllCurrencies().subscribe((currList) => {
          const curr = currList.find( ele => {
            if (ele.currId == this.poCurrency.value) {
              return true;
            }
          })
          if (curr != undefined || curr != null || curr != '') {
            this.poCurrName = curr.currName;
            this.poCurrencyCode = curr.currCode;
          }
        })
      }
      if (this.baseCurr.value == this.poCurrency.value) {
        this.baseExchangeRate.setValue(1);
      } else {
        this.exchangeRateList.forEach(res => {
          if (res.exchType == 'ST' && res.currencyMasterByToCurrId == this.baseCurr.value
           && res.currencyMasterByFromCurrId == this.poCurrency.value) {
            if (!res.toDate || res.toDate <= this.todayDate) {
              this.baseExchangeRate.setValue(res.exchRate);
            }
          }
        });
      }
    })

    this.notifier.valueChanges.subscribe( not => {
      if(not) {
        this.notifierList.forEach( note => {
          if ( note.partyId == not ) {
            this.notifierNote.setValue(note.remarks)
           }
         });
      }
    });

    this.suppDays.valueChanges.subscribe(val => {
      if (this.party.value) {
        const crDays = parseInt(this.party.value.commonMasterByTermsId.name.split(' ')[0]);
        const daysTotal = crDays + val;
        const milis = 86400000 * daysTotal + (new Date()).getTime();
        const date = new Date(milis);
        const dd = date.getDate();
        const mm = date.getMonth() + 1; // January is 0!
        const yyyy = date.getFullYear();
        this.sDueDate.setValue((dd < 10 ? '0' + dd : dd) + '-' + (mm < 10 ? '0' + mm : mm) + '-' + yyyy);
      }
    });

     this.party.valueChanges.subscribe( resp => {
       if (resp) {
        this.bankNameList = [];
        this.suppDays.setValue(0);
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
       }
     })
  }
}
