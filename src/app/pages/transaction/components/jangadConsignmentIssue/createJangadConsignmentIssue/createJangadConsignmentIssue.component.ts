import { FormGroup, FormArray, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { CommonModalComponent } from '../../../../../shared/common-modal/common-modal.component';
import { AuthenticationService } from '../../../../../core/authentication/authentication.service';
import { Logger } from '../../../../../core/logger.service';
import { JangadConsignmentIssueService } from '../jangadConsignmentIssue.service';
import { LotService } from 'app/pages/stockManagement/components/lots/lot.service';
import { CategoryService } from '.../../app/pages/masters/components/categories/category.service';
import { ParaValueService } from '.../../app/pages/masters/components/parameterValue';
import { ParaListService } from '.../../app/pages/masters/components/parameterList';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LotItemCreationService } from 'app/pages/stockManagement/components/lotItemCreation/index';
// import { ProDetailService } from '.../../app/pages/masters/components/processDetails/proDetails.service';
import { PartyDetailsService } from '.../../app/pages/company/components/partyDetails/partyDetails.service';
// import { PartyAccountService } from '.../../app/pages/company/components/partyAccount/partyAccount.service';
import { ProTypeService } from '.../../app/pages/masters/components/processType/proType.service';
import { Observable } from 'rxjs/Rx';
import { HierarchyCreationService } from 'app/pages/company/components/hierarchyCreation';
import { CurrencyService } from 'app/pages/masters/components/currency/';
import { CommonService } from 'app/pages/masters/components/common/index';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap/tabset/tabset.module';
import { isNumber, isNull } from 'util';
import { PrintDCComponent } from '../../../../../shared/print-dc/print-dc.component';
import { PrintConsignmentComponent } from '../../../../../shared/print-consignment/print-consignment.component';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

const log = new Logger('JangadConsignmentIssue');
class JangadConIssue {
  issueMaster: number;
  itemName: string;
  totalCarats: number;
  lotItemId: number;
  issDetId: number;
  lotName: string;
  totalPcs: number;
  spRate: number;
  dcRate: number;
  stockRate: number;
  remark: string;
  stockAmount: number;
  sellingAmount: number;
  lotId: number;
  itemId: number;
  dcAmount: number;
  hsnCode: string;
}
class items {
  si: Number;
  description: String;
  pcs: any;
  carats: any;
  rate: any;
  amount: any;
  hsnCode: string;
}
@Component({
  selector: 'create-jangadConsignmentIssue',
  templateUrl: './createJangadConsignmentIssue.html',
  styleUrls: ['./createJangadConsignmentIssue.scss']
})

export class CreateJangadConsignmentIssue implements OnInit {

  @ViewChild(NgbTabset) ngbTabset: NgbTabset;

  // partyAccDropDownList: any[] = [];
  // partyAccList: any[] = [];
  // partyAccDetailList: any[] = [];
  // processDetailList: any[] = [];
  public itemNameSearch: AbstractControl;
  lotItems: any[] = [];

  search = (text$: Observable<string>) =>
    text$
      .debounceTime(200)
      .distinctUntilChanged()
      .map(term => term.length < 1 ? []
        : this.lotItems.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10));



  isViewMode: boolean;
  showSbmtBtn: boolean = true;
  caratsCtrl: number = 0;

  jangadConsignmentIssueIdParam: string;
  pageTitle = 'Create Delivery Challan Issue';

  error: string = null;
  isLoading = false;
  jangadConsignmentIssueForm: FormGroup;
  source: LocalDataSource = new LocalDataSource();
  successMessage: string;
  todayDate: string;
  lotList: any[] = [];
  processTypeList: any[] = [];
  departmentList: any[] = [];
  settings: any;
  jangadIssuedList: JangadConIssue[] = [];
  partyList: any[] = [];
  bankNameList: any[] = [];
  bankList: any[] = [];
  bankNList: any;
  // selectedPro: any;
  selectedParty: any;
  // proItemList: any [] = [];
  issueItemList: any[] = [];
  brokerList: any[] = [];
  item: any;
  salePrice: number;
  averageRate: number;
  avgSellAmt: number;
  totSellAmt: number;
  avgStockAmount: number;
  avgDcAmount: number;
  totStockAmount: number;
  totDcAmount: number;
  itemName: string;
  itemId: number;
  currencyList: any[] = [];
  lotId: number;
  partyBankBranches: any[] = [];
  printItems: items[] = [];
  loading: boolean = false;
  public partyId: AbstractControl;
  public processTypeId: AbstractControl;
  public lotMaster: AbstractControl;
  public issueDate: AbstractControl;
  public broker: AbstractControl;
  public instruction: AbstractControl;
  public isConsignment: AbstractControl;
  public provisional: AbstractControl;
  public totalCarets: AbstractControl;
  public avgRate: AbstractControl;
  public stockRate: AbstractControl;
  public jangadFormat: AbstractControl;
  public remark: AbstractControl;
  public issItem: AbstractControl;
  public carats: AbstractControl;
  public dcRate: AbstractControl;
  public totalPcs: AbstractControl;
  public department: AbstractControl;
  public carryPerson: AbstractControl;

  termsList: Observable<any>;
  termName: any;
  public bankId: AbstractControl;
  public bank: AbstractControl;
  public bankTnC: AbstractControl;
  public dueDate: AbstractControl;
  public creditDays: AbstractControl;
  public localCurrency: AbstractControl;
  customerPrint: any; //Used For printing Invoice
  brokerName: any; //Used For printing Broker Name in invoice
  public osi: AbstractControl;
  isView: any;
  issueNo : any;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private commonService: CommonService,
    private currencyService: CurrencyService,
    private lotService: LotService,
    private partyService: PartyDetailsService,
    private back: Location,
    // private proService: ProDetailService,
    // private partAccService: PartyAccountService,
    private proTypeService: ProTypeService, //type
    private lotItemService: LotItemCreationService,
    private service: JangadConsignmentIssueService,
    private authService: AuthenticationService,
    private hierService: HierarchyCreationService) {
    this.todayDate = this.today();
    this.createForm();
    this.settings = this.prepareSetting();
    this.issueDate.setValue(this.todayDate);

    this.commonService.getAllCommonMasterByType('TS').subscribe(data => {
      this.termsList = data;
    });

    this.hierService.getAllHierachyByType('DP').subscribe(data => {
      this.departmentList = data;
    })

    this.partyService.getPartyByType('CU').subscribe(res => {
      this.partyList = res;
    });

    this.lotService.getData().subscribe((lotList) => {
      this.lotList = lotList;
    });

    this.partyService.getPartyByType('BR').subscribe(res => {
      this.brokerList = res;
    });

    this.currencyService.getAllCurrencies().subscribe(data => {
      this.currencyList = data;
    });

    this.commonService.getAllCommonMasterByType('BK').subscribe((bankList) => {
      this.bankList = bankList;
    });

    this.proTypeService.getData().subscribe((list) => {
      this.processTypeList = list;
    });

    this.createForm();
    this.issueDate.setValue(this.todayDate);
    this.dueDate.setValue(this.todayDate);
  }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.jangadConsignmentIssueIdParam = params['issueId'];
      this.isView = params['isView'];
      if (this.jangadConsignmentIssueIdParam) {
        if (this.isView == 'true') {
          this.pageTitle = 'View Delivery Challan Issue Entry';
          this.service.getConsignmentIssueById(this.jangadConsignmentIssueIdParam).subscribe(res => {
            debugger;
            if (res && (params['status'] == 'CLOSED' || params['status'] == 'IN_PROCESS' || res.osi
              || this.router.url.includes('viewOpeningDCIssue'))) {
              this.pageTitle = 'View Delivery Challan Issue Entry';
              this.isViewMode = true;
              this.showSbmtBtn = false;
          //    this.issueNo = res.issueNo;
              this.jangadConsignmentIssueForm.patchValue(res);
              this.jangadConsignmentIssueForm.disable();
              this.jangadConsignmentIssueForm.markAsUntouched();
            } else {
            //  this.isViewMode = false;
              this.issueNo = res.issueNo;
              this.markAllTouched(this.jangadConsignmentIssueForm);
            }

            this.onChangeParty(res.partyId.partyId);
            this.selectedParty = res.partyId.partyId;
            this.issueNo = res.issueNo;
            this.jangadConsignmentIssueForm.patchValue(res);
            this.isViewMode = true;
            this.showSbmtBtn = false;
            this.jangadConsignmentIssueForm.disable();
            this.jangadConsignmentIssueForm.markAsUntouched();
            this.partyId.setValue(res.partyId.partyId);
            this.processTypeId.setValue(res.processTypeId.processTypeId);
            this.onChangeLot(res.lotMaster);
            const date: any[] = res.issueDate.split('-');
            const newDate = (date[2] + '-' + date[1] + '-' + date[0]);
            this.issueDate.setValue(newDate);
            this.dueDate.setValue(res.dueDate);

            res.issueDetails.forEach(element => {
              const ItemList = new JangadConIssue();
              ItemList.issDetId = element.issDetId;
              ItemList.issueMaster = element.issueMaster;
              ItemList.lotItemId = element.lotItemId;
              ItemList.totalCarats = parseFloat((element.totalCarats * 1).toFixed(3));
              ItemList.spRate = element.spRate;
              ItemList.dcRate = parseFloat((element.dcRate * 1).toFixed(2));
              ItemList.stockRate = parseFloat((element.stockRate * 1).toFixed(2));
              ItemList.lotName = element.lotName;
              ItemList.totalPcs = element.totalPcs;
              ItemList.itemId = element.itemId;
              ItemList.lotId = element.lotId;
              ItemList.itemName = element.itemName;
              ItemList.remark = element.remark;
              ItemList.stockAmount = parseFloat((ItemList.totalCarats * ItemList.stockRate).toFixed(2));
              ItemList.sellingAmount = parseFloat((ItemList.totalCarats * ItemList.spRate).toFixed(2));
              ItemList.dcAmount = parseFloat((ItemList.totalCarats * ItemList.dcRate).toFixed(2));
              ItemList.hsnCode = element.hsnCode;
              this.jangadIssuedList.push(ItemList);

            });

            if (!this.isViewMode) {
              this.markAllTouched(this.jangadConsignmentIssueForm);
            }

            this.settings = this.prepareSetting();
            this.source.load(this.jangadIssuedList);
            this.setTotalValue();
          });
        } else {
          this.pageTitle = 'Edit Delivery Challan Issue Entry';
          this.service.getConsignmentIssueById(this.jangadConsignmentIssueIdParam).subscribe(res => {
            if (res && (params['status'] == 'CLOSED' || params['status'] == 'IN_PROCESS' || res.osi
              || this.router.url.includes('viewOpeningDCIssue'))) {
              this.pageTitle = 'View Delivery Challan Issue Entry';
              this.isViewMode = true;
              this.showSbmtBtn = false;
              this.jangadConsignmentIssueForm.patchValue(res);
              this.jangadConsignmentIssueForm.disable();
              this.jangadConsignmentIssueForm.markAsUntouched();
            } else {
              this.isViewMode = false;
              this.markAllTouched(this.jangadConsignmentIssueForm);
            }
            this.issueNo = res.issueNo;
            this.onChangeParty(res.partyId.partyId);
            this.selectedParty = res.partyId.partyId;
            this.jangadConsignmentIssueForm.patchValue(res);
            this.partyId.setValue(res.partyId.partyId);
            this.processTypeId.setValue(res.processTypeId.processTypeId);
            this.onChangeLot(res.lotMaster);
            const date: any[] = res.issueDate.split('-');
            const newDate = (date[2] + '-' + date[1] + '-' + date[0]);
            this.issueDate.setValue(newDate);
            this.dueDate.setValue(res.dueDate);

            res.issueDetails.forEach(element => {
              const ItemList = new JangadConIssue();
              ItemList.issDetId = element.issDetId;
              ItemList.issueMaster = element.issueMaster;
              ItemList.lotItemId = element.lotItemId;
              ItemList.totalCarats = parseFloat((element.totalCarats * 1).toFixed(3));
              ItemList.spRate = element.spRate;
              ItemList.dcRate = parseFloat((element.dcRate * 1).toFixed(2));
              ItemList.stockRate = parseFloat((element.stockRate * 1).toFixed(2));
              ItemList.lotName = element.lotName;
              ItemList.totalPcs = element.totalPcs;
              ItemList.itemId = element.itemId;
              ItemList.lotId = element.lotId;
              ItemList.itemName = element.itemName;
              ItemList.remark = element.remark;
              ItemList.stockAmount = parseFloat((ItemList.totalCarats * ItemList.stockRate).toFixed(2));
              ItemList.sellingAmount = parseFloat((ItemList.totalCarats * ItemList.spRate).toFixed(2));
              ItemList.dcAmount = parseFloat((ItemList.totalCarats * ItemList.dcRate).toFixed(2));
              ItemList.hsnCode = element.hsnCode;
              this.jangadIssuedList.push(ItemList);

            });

            if (!this.isViewMode) {
              this.markAllTouched(this.jangadConsignmentIssueForm);
            }

            this.settings = this.prepareSetting();
            this.source.load(this.jangadIssuedList);
            this.setTotalValue();
          });
        }
      }
    });
  }

  dateFormate(date: any) {
    // const newDate = Date(date.toString());
    let newDate = new Date(date);

    const dd = newDate.getDate();
    const mm = newDate.getMonth() + 1; // January is 0!
    const yyyy = newDate.getFullYear();
    return (dd < 10 ? '0' + dd : dd) + '/' + (mm < 10 ? '0' + mm : mm) + '/' + yyyy;
  }

  print() {
    debugger;
    if (this.jangadConsignmentIssueIdParam) {
      let i = 1;
      this.printItems = [];
      console.log(this.jangadIssuedList)
      this.jangadIssuedList.forEach(ele => {
        const newItem = new items;
        newItem.si = i;
        i++;
        newItem.pcs = ele.totalPcs;
        newItem.carats = ele.totalCarats;
        newItem.rate = ele.dcRate;
        newItem.description = ele.remark;
        newItem.amount = parseFloat((Math.round((newItem.rate * newItem.carats)).toFixed(2)));
        newItem.hsnCode = ele.hsnCode;
        this.printItems.push(newItem);
      })
      let totalC = 0;
      let totalP = 0;
      let totalA = 0;
      this.printItems.forEach(item => {
        totalC = totalC + item.carats;
        totalP = totalP + item.pcs;
        totalA = totalA + item.amount;
      });
      let cumuRate = totalA / totalC;

      let activeModal: any;
      if (this.isConsignment.value) {
        this.loading = false;
        activeModal = this.modalService.open(PrintConsignmentComponent, { size: 'lg' });
      } else {
        this.loading = false;
        activeModal = this.modalService.open(PrintDCComponent, { size: 'lg' });
      }
      this.partyService.getPartyById(this.customerPrint).subscribe(data => {
        console.log(data);
        this.service.getAddressById(data.addressMasterDTO.addressId).subscribe(ele => {
          debugger;
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
      if (this.isConsignment.value) {
        activeModal.componentInstance.challanNo = this.issueNo;//('CON' + this.jangadConsignmentIssueIdParam)
      } else {
        activeModal.componentInstance.challanNo = this.issueNo;//('DC' + this.jangadConsignmentIssueIdParam)
      }
      // This will be issue no_return no combination
      activeModal.componentInstance.items = this.printItems;  // item list with columns(si, description, pcs, carats, rate)
      activeModal.componentInstance.totalPcs = totalP;
      activeModal.componentInstance.totalCarats = parseFloat(totalC.toFixed(3));
      activeModal.componentInstance.tAmount = parseFloat((Math.round(totalA).toString()));
      activeModal.componentInstance.avgRate = parseFloat(Math.floor(cumuRate).toString());
      debugger;
      activeModal.componentInstance.printDate = this.dateFormate(this.issueDate.value);
      if (this.isConsignment.value) {
        activeModal.componentInstance.invoiceNo = this.issueNo;//('CON' + this.jangadConsignmentIssueIdParam);
      } else {
        activeModal.componentInstance.invoiceNo = this.issueNo;//('DC' + this.jangadConsignmentIssueIdParam);
      }

      activeModal.componentInstance.selectBroker = this.brokerName;
      activeModal.componentInstance.carryPerson = this.carryPerson.value;
    } else {
      this.loading = false;
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = false;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Please submit the DC first & Edit again to proceed for Print!!';
    }

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

  today(): string {
    const today = new Date();
    const dd = today.getDate();
    const mm = today.getMonth() + 1;
    const yyyy = today.getFullYear();
    return yyyy + '-' + (mm < 10 ? '0' + mm : mm) + '-' + (dd < 10 ? '0' + dd : dd);
  }

  prepareSetting() {
    return {
      hideSubHeader: 'true',
      actions: {
        position: 'right',
        add: false,
        edit: !this.isViewMode,
        delete: !this.isViewMode
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
          editable: false,
          title: 'Lot',
          type: 'text',
        },
        itemName: {
          editable: false,
          title: 'Issued Item',
          type: 'text',
        },
        totalPcs: {
          editable: false,
          title: 'Pieces',
        },
        totalCarats: {
          title: 'Issued Carats',
          type: 'text',
        },
        spRate: {
          editable: false,
          title: 'SP Rate',
        },
        sellingAmount: {
          editable: false,
          title: 'Selling Amount',
          type: 'number',
        },
        stockRate: {
          editable: false,
          title: 'Stock Rate',
        },
        stockAmount: {
          editable: false,
          title: 'Stock Amount',
          type: 'number',
        },
        dcRate: {
          editable: true,
          title: 'DC Rate',
        },
        dcAmount: {
          editable: false,
          title: 'DC Amount',
          type: 'number',
        },
        remark: {
          title: 'Description',
          valuePrepareFunction: value => {
            if (value == '' || value == null) {
              return '-';
            } else {
              return value;
            }
          }
        }
      }
    };
  }

  submit() {   ///*** need to add validation of creating duplicate party && process name
    debugger;
    this.loading = true;
    if (this.router.url.includes('createOpeningDCIssue')) {
      this.osi.setValue(true);
    } else {
      this.osi.setValue(false);
    }
    if (this.jangadConsignmentIssueForm.valid) {

      if (!this.provisional.value) {
        this.provisional.setValue(false);
      }
      if (!this.isConsignment.value) {
        this.isConsignment.setValue(false);
        this.validSubmit();
      } else {

        // let flag = 0;
        // const process = this.processTypeList.find( pro => {
        //   if(pro.processTypeId == this.processTypeId.value && pro.processCode == 'CN') {
        //     flag = 1;
        //     return true;
        //   }
        // })

        // if (flag == 0) {
        //   const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
        //   activeModal.componentInstance.showHide = false;
        //   activeModal.componentInstance.modalHeader = 'Alert';
        //   activeModal.componentInstance.modalContent = 'Choose Consignment type Process or Uncheck Consignment!';   
        // } else {
        if (!this.bank.value || !this.bankTnC.value || !this.dueDate.value || !this.localCurrency.value || isNull(this.creditDays.value)) {
          this.loading = false;
          this.ngbTabset.select('general');
          
          const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
          activeModal.componentInstance.showHide = false;
          activeModal.componentInstance.modalHeader = 'Alert';
          activeModal.componentInstance.modalContent = 'Please fill all information of General Details Tab or Uncheck Consignment!';
        } else {
          this.validSubmit();
        }
        // }
      }
    }
    else {
      this.loading = false;
    }
  }

  validSubmit() {
    this.showSbmtBtn = false;
    if (this.jangadIssuedList.length > 0) {
      this.isLoading = false;
      this.jangadConsignmentIssueForm.controls['issueDetails'].setValue(this.jangadIssuedList);
      //this.partyAccountId.setValue(this.partyAccountId.value.partyAccId);

      let formValue: any = this.jangadConsignmentIssueForm.value;

      if (this.jangadConsignmentIssueIdParam) {
        this.service.updateConsignmentIssue(formValue).subscribe(jangadConsignmentIssue => {
          // log.debug(`${credentials.selectedCompany} successfully logged in`);
          this.handleBack();
          this.finally();
        }, error => {
          this.loading = false;
          this.showSbmtBtn = true;
          log.debug(`Creation error: ${error}`);
          this.error = error;
          this.finally();
        });
      } else {
        this.service.createConsignmentIssue(formValue).subscribe(jangadConsignmentIssue => {
          // log.debug(`${credentials.selectedCompany} successfully logged in`);
          this.handleBack();
          this.finally();
        }, error => {
          this.loading = false;
          this.showSbmtBtn = true;
          log.debug(`Creation error: ${error}`);
          this.error = error;
          this.finally();
        });
      }
    } else {
      this.loading = false;
      this.showSbmtBtn = true;
      this.ngbTabset.select('itemDetails');

      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = false;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Please Select Some Item to Issue!!!';
    }
  }

  onChangeParty(partyId: any): void {
    if (this.jangadIssuedList.length > 0) {
      this.loading = false;
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = true;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Your all previous Alloted Item Info will be get removed!';
      activeModal.result.then((res) => {
        if (res == 'Y') {
          this.selectedParty = partyId;
          this.jangadConsignmentIssueForm.controls['partyId'].setValue(this.selectedParty);
          this.forChangeParty(partyId);
        } else if (res == 'N') {
          this.jangadConsignmentIssueForm.controls['partyId'].setValue(this.selectedParty);
          this.issueDate.setValue(this.todayDate);
        }
      });
    } else {
      this.selectedParty = this.partyId.value;
      this.forChangeParty(partyId);
    }
    this.jangadConsignmentIssueForm.controls['partyId'].setValue(this.selectedParty);
  }

  forChangeParty(partyId: any) {
    this.customerPrint = partyId;
    this.jangadConsignmentIssueForm.reset();
    this.jangadConsignmentIssueForm.controls['partyId'].setValue(partyId);
    this.issueDate.setValue(this.todayDate);
    this.jangadIssuedList = [];
    this.source.load(this.jangadIssuedList);
    this.issueItemList = [];

    this.partyService.getAllBankBranchByPartyId(partyId, 'CU').subscribe(res => {
      this.partyBankBranches = res;
      debugger;
      res.forEach(element => {
        if (element.bankBranch.bankId) {
          this.commonService.getCommonMasterById(element.bankBranch.bankId).subscribe(data => {
            this.bankNList = data;
            this.getBankBranch();
          });
        }
      });
    });
  }

  getBankBranch() {
    debugger;
    this.bankNameList = [];
    let flag = 0;
    this.partyBankBranches.forEach(data => {
      debugger;
      if (data.bankBranch.bankId == this.bankNList.id) {
        if (this.bankNameList.length > 0) {
          this.bankNameList.forEach(res => {
            if (res.value == data.bankBranch.bankBrId) {
              flag = 1;
            }
          });
          if (flag != 1) {
            this.bankNameList.push({ 'value': data.id, 'title': this.bankNList.name + "_" + data.bankBranch.bankBrName });
          }
        }
        else {
          this.bankNameList.push({ 'value': data.id, 'title': this.bankNList.name + "_" + data.bankBranch.bankBrName });
        }
      }
    });
  }

  onChangeLot(lotId: any): void {
    this.jangadConsignmentIssueForm.controls['lotMaster'].setValue(lotId);
    this.issueItemList = [];
    this.itemNameSearch.reset();
    this.jangadConsignmentIssueForm.controls['issItem'].reset();
    this.jangadConsignmentIssueForm.controls['avgRate'].reset();
    this.jangadConsignmentIssueForm.controls['dcRate'].reset();
    this.jangadConsignmentIssueForm.controls['carats'].reset();
    this.jangadConsignmentIssueForm.controls['stockRate'].reset();
    this.jangadConsignmentIssueForm.controls['remark'].reset();
    this.lotItemService.getAllLotItemByLotId(lotId).subscribe(itemLotList => {
      this.lotItems = [];
      if (itemLotList) {
        if (itemLotList.length > 0) {
          this.issueItemList = itemLotList;
          let i = 0;
          itemLotList.forEach(element => {
            this.lotItems[i] = element.itemMaster.itemName;
            i++;
          });
        } else {
          this.loading = false;
          const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
          activeModal.componentInstance.showHide = false;
          activeModal.componentInstance.modalHeader = 'Alert';
          activeModal.componentInstance.modalContent = 'No items in selected Lot!';
        }
      }
    });
  }

  getColTotal(colName: string): number {
    let total: number;
    total = 0;
    this.jangadIssuedList.forEach(row => {
      total += parseFloat(row[colName]);
    });
    return total;
  }

  onEditConfirm(event: any): void {
    this.lotItemService.getLotItemCreationById(event.data.lotItemId).subscribe(data => {
      const availCarats = data.totalCarets;
      if (event.newData.totalCarats <= 0 || event.newData.totalCarats == null || event.newData.totalCarats == '') {
        this.loading = false;
        const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
        activeModal.componentInstance.showHide = false;
        activeModal.componentInstance.modalHeader = 'Alert';
        activeModal.componentInstance.modalContent = 'Issued Carats must be greater than 0!';
      } else if (event.newData.totalCarats > availCarats && !(this.router.url.includes('createOpeningDCIssue'))) {
        this.loading = false;
        const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
        activeModal.componentInstance.showHide = false;
        activeModal.componentInstance.modalHeader = 'Alert';
        activeModal.componentInstance.modalContent = 'Carats should not be greater than available carats i.e ' + availCarats + ' Cts!!';
      } else if (event.newData.dcRate <= 0 || event.newData.dcRate == null || event.newData.dcRate == '') {
        this.loading = false;
        const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
        activeModal.componentInstance.showHide = false;
        activeModal.componentInstance.modalHeader = 'Alert';
        activeModal.componentInstance.modalContent = 'Dc Rate must be greater than 0!';
      } else if (event.newData.dcRate < event.newData.stockRate) {
        this.loading = false;
        const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
        activeModal.componentInstance.showHide = true;
        activeModal.componentInstance.modalHeader = 'Alert';
        activeModal.componentInstance.modalContent = 'Dc Rate is smaller than Stock Rate! Are you sure you want to continue?';
        activeModal.result.then(res => {
          if (res == 'Y') {
            this.jangadIssuedList.forEach(item => {
              if (item.lotItemId == event.newData.lotItemId) {
                item.dcRate = parseFloat((event.newData.dcRate * 1).toFixed(2));
                item.totalCarats = parseFloat((event.newData.totalCarats * 1).toFixed(3));    // multiplied by 1 to convert tempcts into number type
                const temp: number = event.newData.totalCarats * event.newData.stockRate;
                item.stockAmount = parseFloat(temp.toFixed(2));
                const temp2: number = event.newData.totalCarats * event.newData.spRate;
                item.sellingAmount = parseFloat(temp2.toFixed(2));
                const temp3: number = event.newData.totalCarats * event.newData.dcRate;
                item.dcAmount = parseFloat(temp3.toFixed(2));
                item.remark = event.newData.remark;
              }
              this.source.load(this.jangadIssuedList);
              this.setTotalValue();
            })
          }
        })
      } else {
        this.jangadIssuedList.forEach(item => {
          if (item.lotItemId == event.newData.lotItemId) {
            item.dcRate = parseFloat((event.newData.dcRate * 1).toFixed(2));
            item.totalCarats = parseFloat((event.newData.totalCarats * 1).toFixed(3));    // multiplied by 1 to convert tempcts into number type
            const temp: number = event.newData.totalCarats * event.newData.stockRate;
            item.stockAmount = parseFloat(temp.toFixed(2));
            const temp2: number = event.newData.totalCarats * event.newData.spRate;
            item.sellingAmount = parseFloat(temp2.toFixed(2));
            const temp3: number = event.newData.totalCarats * event.newData.dcRate;
            item.dcAmount = parseFloat(temp3.toFixed(2));
            item.remark = event.newData.remark;
          }
          this.source.load(this.jangadIssuedList);
          this.setTotalValue();
        })
      }
    });
  }

  onDeleteConfirm(event: any): void {
    debugger;
    this.loading = false;
    const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
    activeModal.componentInstance.showHide = true;
    activeModal.componentInstance.modalHeader = 'Alert';
    activeModal.componentInstance.modalContent = 'Are you sure you want to delete?';
    activeModal.result.then((res) => {
      if (res == 'Y') {
        let index = 0;
        this.jangadIssuedList.forEach(ele => {
          if (ele.lotItemId == event.data.lotItemId) {
            this.jangadIssuedList.splice(index, 1);
            this.source.load(this.jangadIssuedList);
            this.setTotalValue();
          } else {
            index++;
          }
        })
      } else {
        event.confirm.reject();
      }
    });
  }

  onUpdate() {
    debugger;
    if (this.issItem.value == '' || this.issItem.value == null) {
      this.loading = false;
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = false;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Please Select One Item to Add';
    } else {
      if (this.jangadIssuedList.length > 0) {
        const itemIndex = this.jangadIssuedList.findIndex(item => {
          if (this.issItem.value.lotItemId == item.lotItemId) {
            return true;
          }
        });
        if (itemIndex > -1) {
          this.loading = false;
          const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
          activeModal.componentInstance.showHide = false;
          activeModal.componentInstance.modalHeader = 'Alert';
          activeModal.componentInstance.modalContent = 'Duplicate Item or Item already Exist!! Please change Item !';
        } else {
          this.validUpdate();
        }
      } else {
        this.validUpdate();
      }
    }
  }

  validUpdate() {
    const ItemList = new JangadConIssue();
    ItemList.issueMaster = this.issItem.value.itemMaster.itemId;
    ItemList.lotItemId = this.issItem.value.lotItemId;
    ItemList.totalCarats = parseFloat((this.carats.value * 1).toFixed(3));
    ItemList.itemName = this.issItem.value.itemMaster.itemName;
    ItemList.spRate = this.salePrice;
    ItemList.stockRate = this.averageRate;
    ItemList.dcRate = parseFloat((this.dcRate.value * 1).toFixed(2));
    ItemList.remark = this.remark.value;
    ItemList.lotName = this.issItem.value.lotMaster.lotName;
    ItemList.lotId = this.lotId;
    ItemList.itemId = this.itemId;
    if (this.totalPcs.value) {
      ItemList.totalPcs = this.totalPcs.value;
    } else {
      ItemList.totalPcs = 0;
    }
    ItemList.stockAmount = parseFloat((ItemList.totalCarats * ItemList.stockRate).toFixed(2));
    ItemList.sellingAmount = parseFloat((ItemList.totalCarats * ItemList.spRate).toFixed(2));
    if (this.dcRate.value == null || this.dcRate.value <= 0) {
      this.loading = false;
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = false;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'DC Rate should be greater than 0 !';
    } else if (this.carats.value == null || this.carats.value <= 0) {
      this.loading = false;
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = false;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Please Enter Carats & It should be greater than 0!';
    } else if (this.carats.value > this.issItem.value.totalCarets && !(this.router.url.includes('createOpeningDCIssue'))) {
      this.loading = false;
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = false;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Carats cannot be more than ' + this.issItem.value.totalCarets + ' Carats!';
    } else {
      if (this.dcRate.value < this.stockRate.value) {
        this.loading = false;
        const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
        activeModal.componentInstance.showHide = true;
        activeModal.componentInstance.modalHeader = 'Alert';
        activeModal.componentInstance.modalContent = 'DC Rate is smaller than Stock Rate! Are you sure you want to continue?';
        activeModal.result.then((res) => {
          if (res == 'Y') {
            const b = this.jangadIssuedList.findIndex(a => {
              if (a.lotItemId == ItemList.lotItemId) {
                return true;
              }
            });
            ItemList.dcAmount = parseFloat((ItemList.totalCarats * ItemList.dcRate).toFixed(2));
            this.jangadIssuedList.push(ItemList);
            this.source.load(this.jangadIssuedList);
            this.settings = this.prepareSetting();
            this.jangadConsignmentIssueForm.controls['issItem'].reset();
            this.jangadConsignmentIssueForm.controls['avgRate'].reset();
            this.jangadConsignmentIssueForm.controls['dcRate'].reset();
            this.jangadConsignmentIssueForm.controls['carats'].reset();
            this.jangadConsignmentIssueForm.controls['stockRate'].reset();
            this.jangadConsignmentIssueForm.controls['remark'].reset();
            this.jangadConsignmentIssueForm.controls['totalPcs'].reset();
            this.setTotalValue();
          } else if (res == 'N') {
            this.dcRate.setValue('');
          }
        })
      } else {
        ItemList.dcAmount = parseFloat((ItemList.totalCarats * ItemList.dcRate).toFixed(2));
        this.jangadIssuedList.push(ItemList);
        this.source.load(this.jangadIssuedList);
        this.settings = this.prepareSetting();
        this.jangadConsignmentIssueForm.controls['issItem'].reset();
        this.jangadConsignmentIssueForm.controls['avgRate'].reset();
        this.jangadConsignmentIssueForm.controls['dcRate'].reset();
        this.jangadConsignmentIssueForm.controls['carats'].reset();
        this.jangadConsignmentIssueForm.controls['stockRate'].reset();
        this.jangadConsignmentIssueForm.controls['remark'].reset();
        this.jangadConsignmentIssueForm.controls['totalPcs'].reset();
        this.setTotalValue();
      }
    }
  }

  setTotalValue() {
    this.totalCarets.setValue(parseFloat((this.totalAddedCarats).toFixed(3)));
    this.avgSellAmt = parseFloat((this.getTAmount / this.totalCarets.value).toFixed(2));
    this.avgStockAmount = parseFloat((this.getTotalAmount / this.totalCarets.value).toFixed(2));
    this.avgDcAmount = parseFloat((this.getTotalDcAmount / this.totalCarets.value).toFixed(2));
    this.totSellAmt = parseFloat((this.getTAmount).toFixed(2));
    this.totStockAmount = parseFloat((this.getTotalAmount).toFixed(2));
    this.totDcAmount = parseFloat((this.getTotalDcAmount).toFixed(2));
  }

  get getTotalAmount(): number {
    return parseFloat((this.getColTotal('stockAmount')).toFixed(2));
  }

  get getTAmount(): number {
    return parseFloat((this.getColTotal('sellingAmount')).toFixed(2));
  }

  get getTotalDcAmount(): number {
    return parseFloat((this.getColTotal('dcAmount')).toFixed(2));
  }

  get totalAddedCarats(): number {
    return parseFloat((this.getColTotal('totalCarats')).toFixed(3));
  }

  finally() {
    this.loading = false;
    this.jangadConsignmentIssueForm.markAsPristine();
  }

  handleBack() {
    // TODO: if cancelling then ask to confirn
    this.back.back();
  }

  private createForm() {
    this.jangadConsignmentIssueForm = this.fb.group({
      'issueId': [''],
      'partyId': ['', Validators.required],
      'processTypeId': ['', Validators.required],
      'lotMaster': ['', Validators.required],
      'broker': [''],
      //'jangadFormat': ['', Validators.required],
      'issueDate': [''],
      'instruction': [''],
      'issItem': [''],
      'stockRate': [''],
      'carats': [''],
      'avgRate': [''],
      'dcRate': [''],
      'remark': [''],
      'totalCarets': [''],
      'isConsignment': [''],
      'provisional': [''],
      'totalPcs': [''],
      'issueDetails': [this.jangadIssuedList],
      'department': ['', Validators.required],
      'bankId': [''],
      'bank': [''],
      'dueDate': [''],
      'creditDays': [''],
      'bankTnC': [''],
      'localCurrency': [''],
      'itemNameSearch': [''],
      'carryPerson': [''],
      'osi': ['']
    });

    this.partyId = this.jangadConsignmentIssueForm.controls['partyId'];
    this.processTypeId = this.jangadConsignmentIssueForm.controls['processTypeId'];
    this.lotMaster = this.jangadConsignmentIssueForm.controls['lotMaster'];
    this.broker = this.jangadConsignmentIssueForm.controls['broker'];
    // this.jangadFormat = this.jangadConsignmentIssueForm.controls['jangadFormat'];
    this.issueDate = this.jangadConsignmentIssueForm.controls['issueDate'];
    this.instruction = this.jangadConsignmentIssueForm.controls['instruction'];
    this.issItem = this.jangadConsignmentIssueForm.controls['issItem'];
    this.stockRate = this.jangadConsignmentIssueForm.controls['stockRate'];
    this.remark = this.jangadConsignmentIssueForm.controls['remark'];
    this.avgRate = this.jangadConsignmentIssueForm.controls['avgRate'];
    this.carats = this.jangadConsignmentIssueForm.controls['carats'];
    this.dcRate = this.jangadConsignmentIssueForm.controls['dcRate'];
    this.totalCarets = this.jangadConsignmentIssueForm.controls['totalCarets'];
    this.isConsignment = this.jangadConsignmentIssueForm.controls['isConsignment'];
    this.provisional = this.jangadConsignmentIssueForm.controls['provisional'];
    this.totalPcs = this.jangadConsignmentIssueForm.controls['totalPcs'];
    this.department = this.jangadConsignmentIssueForm.controls['department'];
    this.bankId = this.jangadConsignmentIssueForm.controls['bankId'];
    this.bank = this.jangadConsignmentIssueForm.controls['bank'];
    this.bankTnC = this.jangadConsignmentIssueForm.controls['bankTnC'];
    this.dueDate = this.jangadConsignmentIssueForm.controls['dueDate'];
    this.creditDays = this.jangadConsignmentIssueForm.controls['creditDays'];
    this.localCurrency = this.jangadConsignmentIssueForm.controls['localCurrency'];
    this.itemNameSearch = this.jangadConsignmentIssueForm.controls['itemNameSearch'];
    this.carryPerson = this.jangadConsignmentIssueForm.controls['carryPerson'];
    this.osi = this.jangadConsignmentIssueForm.controls['osi'];

    this.broker.valueChanges.subscribe(val => {
      const index = this.brokerList.findIndex(item => {
        if (item.partyId == val) {
          this.brokerName = item.partyName;
          return true;
        }
      })
    })

    this.itemNameSearch.valueChanges.subscribe(val => {
      if (val) {
        this.issueItemList.find(ele => {
          if (ele.itemMaster.itemName == val) {
            this.issItem.setValue(ele);
            return true;
          }
        })
      }
    })

    this.issItem.valueChanges.subscribe(data => {
      if (data) {
        this.salePrice = data.itemMaster.salePrice;
        this.itemId = data.itemMaster.itemId;
        this.lotId = data.lotMaster.lotId;
        this.itemName = data.itemMaster.itemName;
        this.averageRate = data.avgRate;
        this.remark.setValue(data.itemMaster.itemName);
        this.stockRate.setValue(data.avgRate);
        this.avgRate.setValue(data.itemMaster.salePrice);
        this.caratsCtrl = data.totalCarets;
        if (this.salePrice > this.averageRate) {
          this.dcRate.setValue(this.salePrice);
        } else {
          this.dcRate.setValue(this.averageRate);
        }
      }
    });

    this.bankTnC.valueChanges.subscribe(val => {
      if (val) {
        setTimeout(() => {
          this.termsList.forEach(element => {
            if (element.id == val) {
              this.termName = element.name;
              this.creditDays.setValue(this.creditDays.value);
            }
          })
        });
      }
    });

    this.creditDays.valueChanges.subscribe(val => {
      this.dueDate.setValue('');
      if (this.bankTnC.value) {
        setTimeout(() => {
          const crDays = parseInt(this.termName.split(' ')[0]);
          const daysTotal = crDays + val;
          const milis = 86400000 * daysTotal + (new Date()).getTime();
          const date = new Date(milis);
          const dd = date.getDate();
          const mm = date.getMonth() + 1; // January is 0!
          const yyyy = date.getFullYear();
          this.dueDate.setValue((dd < 10 ? '0' + dd : dd) + '-' + (mm < 10 ? '0' + mm : mm) + '-' + yyyy);
        });
      }
    });

  }
}
