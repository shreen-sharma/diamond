import { CurrencyService } from 'app/pages/masters/components/currency/';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, Pipe, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from '../../../../../core/authentication/authentication.service';
import { Logger } from '../../../../../core/logger.service';
import { ReceiptEntryService } from '../receiptEntry.service';
import { BranchService } from 'app/pages/masters/components/bankBranches/branch.service';
import { CommonService } from 'app/pages/masters/components/common/common.service';
import { ReceiptEntryModal } from './receiptEntry-modal/receiptEntry-modal.component';
import { CommonModalComponent } from '../../../../../shared/common-modal/common-modal.component';
import { PaymentPreviewModal } from '../../paymentReceiptPurchase/createPaymentEntry/paymentPreview-modal/paymentPreview-modal';

const log = new Logger('receiptEntry');

class AddDetails {
  id: number;
  crDr: string;
  account: number;
  amount: number;
  paymentMode: number;
  paymentModeName: string;
  bankBranchId: string;
  bankBranchName: string;
  chequeDate: string;
  chequeNo: string;
  narrationLine: string;
  exchRate: number;
}

@Component({
  selector: 'createReceiptEntry',
  templateUrl: '../../paymentReceiptPurchase/createPaymentEntry/createPaymentEntry.html',
  styleUrls: ['./createReceiptEntry.scss']
})

export class CreateReceiptEntryComponent implements OnInit {

  selectSum: number;

  receiptEntryIdParam: string;
  pageTitle = 'Receipt Entry';
  source: LocalDataSource = new LocalDataSource();
  isType: string = 'Export';
  error: string = null;
  isLoading = false;
  paymentEntryForm: FormGroup;
  isExportVal: string;
  bankBranchList: any[] = [];
  paymentModeList: any[] = [];
  currList: any[] = [];
  paymentList: AddDetails[] = [];
  previousInvPaymentDetList: any[] = [];

  selectInvBtn: boolean = false;
  showSbmtBtn: boolean = true;
  chequeCtrlStatus: Boolean = false;
  bankCtrlStatus: Boolean = false;
  counter: number = 1;
  settings: any;

  public docCode: AbstractControl;
  public invoiceNo: AbstractControl;
  public docDate: AbstractControl;
  public partyName: AbstractControl;
  public invoiceDate: AbstractControl;
  public ordNo: AbstractControl;
  public currency: AbstractControl;
  public narration: AbstractControl;
  public provisional: AbstractControl;

  public crDrCtrl: AbstractControl;
  public accountCtrl: AbstractControl;
  public amountCtrl: AbstractControl;
  public paymentModeCtrl: AbstractControl;
  public bankBranchNameCtrl: AbstractControl;
  public chequeDateCtrl: AbstractControl;
  public chequeNoCtrl: AbstractControl;
  public narrationLineCtrl: AbstractControl;
  public exchRateCtrl: AbstractControl;

  public totalAmount: AbstractControl;
  public totalPaidAmount: AbstractControl;
  public payingAmount: AbstractControl;
  public outstandingAmount: AbstractControl;
  public isExport: AbstractControl;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private back: Location,
    private service: ReceiptEntryService,
    private modalService: NgbModal,
    private bankBranchService: BranchService,
    private commonService: CommonService,
    private currencyService: CurrencyService,
    private authService: AuthenticationService) {
    this.createForm();
    this.isExport.setValue(false);
    this.settings = this.prepareSettings();

    this.currencyService.getAllCurrencies().subscribe((currList) => {
      this.currList = currList;
    });

    this.commonService.getAllCommonMasterByType('PM').subscribe(list => {
      this.paymentModeList = list;
    });

    this.bankBranchService.getData().subscribe(list => {
      this.bankBranchList = list;
    });
  }

  ngOnInit() {

    this.route.params.subscribe((params: Params) => {
      this.receiptEntryIdParam = params['id'];
      if (this.receiptEntryIdParam) {
        this.pageTitle = 'View Receipt Entry Details';
        this.selectInvBtn = true;
        this.showSbmtBtn = false;
        this.service.getReceiptEntryById(this.receiptEntryIdParam).subscribe(respo => {
          this.paymentEntryForm.patchValue(respo);
          this.paymentEntryForm.disable();
          this.isExport.enable();
          this.paymentList = respo.receiptDetailsList;
          this.source.load(this.paymentList);
        });
      } else {
        this.paymentEntryForm.disable();
        this.isExport.enable();
        this.selectInvBtn = false;
      }
      this.settings = this.prepareSettings();
    });
  }

  prepareSettings() {
    return {
      hideSubHeader: true,
      actions: {
        position: 'right',
        add: false,
        edit: false,
        delete: this.showSbmtBtn,
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
        crDr: {
          title: 'Credit / Debit',
          type: 'text',
          valuePrepareFunction: value => {
            if (value == 'CR') {
              return 'Credit';
            } else if (value == 'DR') {
              return 'Debit';
            }
          }
        },
        account: {
          title: 'Account',
          type: 'text',
        },
        amount: {
          title: 'Amount',
          type: 'text',
        },
        paymentModeName: {
          title: 'Payment Mode',
          type: 'text',
        },
        bankBranchName: {
          title: 'Bank-Branch Name',
          type: 'text',
          valuePrepareFunction: value => {
            if (value) {
              return value;
            } else {
              return '-';
            }
          }
        },
        chequeNo: {
          title: 'Cheque No',
          type: 'text',
          valuePrepareFunction: value => {
            if (value) {
              return value;
            } else {
              return '-';
            }
          }
        },
        chequeDate: {
          title: 'Cheque Date',
          type: 'text',
          valuePrepareFunction: value => {
            if (value) {
              return value;
            } else {
              return '-';
            }
          }
        },
        narrationLine: {
          title: 'Comment/Narration',
          type: 'text',
          valuePrepareFunction: value => {
            if (value) {
              return value;
            } else {
              return '-';
            }
          }
        },
        exchRate: {
          title: 'Exchange Rate',
          type: 'text',
          valuePrepareFunction: value => {
            if (value) {
              return value;
            } else {
              return '-';
            }
          }
        },
      }
    };
  }

  today(): string {
    const today = new Date();
    const dd = today.getDate();
    const mm = today.getMonth() + 1; // January is 0!
    const yyyy = today.getFullYear();
    return yyyy + '-' + (mm < 10 ? '0' + mm : mm) + '-' + (dd < 10 ? '0' + dd : dd);
  }

  submit() {
    if (this.paymentList.length > 0) {
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = true;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Do you Really Want to Submit?? You will not be able to edit this Receipt Entry again in Future!!';
      activeModal.result.then((res) => {
        if (res == 'Y') {
          this.isLoading = true;
          if (!this.provisional.value) {
            this.provisional.setValue(false);
          }
          this.paymentEntryForm.controls['receiptDetailsList'].setValue(this.paymentList);
          const formValue: any = this.paymentEntryForm.value;

          this.service.createReceiptEntry(this.paymentEntryForm.value).subscribe(resp => {
            // log.debug(`${credentials.selectedCompany} successfully logged in`);
            this.handleBack();
            this.finally();
          }, error => {
            log.debug(`Creation error: ${error}`);
            this.error = error;
            this.finally();
          });
        }
      });
    } else {
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = false;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Please Add Some Receipt Entries!!!';
    }
  }

  lgModalShow() {
    if (this.isExport.value) {
      this.service.isExport = true;
      const activeModal = this.modalService.open(ReceiptEntryModal, { size: 'lg' });
      activeModal.componentInstance.modalHeader = 'Local Sales Invoice Details';
      activeModal.componentInstance.emitService.subscribe((emmitedValue) => {
        if (emmitedValue) {
          this.paymentEntryForm.enable();
          this.service.getExportMasterById(emmitedValue.expId).subscribe((data: any) => {
            this.docDate.setValue(this.today());
            this.docCode.setValue('ESI');
            this.partyName.setValue(emmitedValue.customerName);
            this.invoiceNo.setValue(emmitedValue.expId);
            this.invoiceDate.setValue(data.expDate);
            if (data.currCode == "INR") {
              this.totalAmount.setValue(data.orderAmountBase);
            } else {
              this.totalAmount.setValue(data.orderAmountSTK);
            }

            this.currency.setValue(data.stockCurr);
            this.exchRateCtrl.setValue(data.invExchRate);
            if (data.expNo) {
              this.ordNo.setValue(data.expNo);
            }
            this.provisional.setValue(false);

            this.crDrCtrl.setValue('CR');

            this.service.getReceiptDetailsBySalesInvoiceId(data.expNo,'ESI').subscribe(res => {
              this.previousInvPaymentDetList = res;
              this.selectSum = parseFloat(this.getColTotal('amount', this.previousInvPaymentDetList).toFixed(2));
              this.setTotalCalculatedValues();
            });
            this.selectInvBtn = true;
            // this.isExport.disable();
          });
        } else {
          this.paymentEntryForm.disable();
        }
      });
    } else {
      this.service.isExport=false;
      const activeModal = this.modalService.open(ReceiptEntryModal, { size: 'lg' });
      activeModal.componentInstance.modalHeader = 'Local Sales Invoice Details';
      activeModal.componentInstance.emitService.subscribe((emmitedValue) => {
        if (emmitedValue) {
          this.paymentEntryForm.enable();
          this.service.getSalesInvoiceDataById(emmitedValue.id).subscribe((data: any) => {
            this.docDate.setValue(this.today());
            this.docCode.setValue('LSI');
            this.partyName.setValue(emmitedValue.customer);
            this.invoiceNo.setValue(emmitedValue.id);
            this.invoiceDate.setValue(data.invoiceDate);
            if (data.currCode == "INR") {
              this.totalAmount.setValue(emmitedValue.payableAmountBase);
            } else {
              this.totalAmount.setValue(data.payableAmount);
            }

            this.currency.setValue(data.currencyId);
            this.exchRateCtrl.setValue(data.invExchRate);
            if (emmitedValue.soNo) {
              this.ordNo.setValue(emmitedValue.soNo);
            }
            this.provisional.setValue(false);

            this.crDrCtrl.setValue('CR');

            this.service.getReceiptDetailsBySalesInvoiceId(data.locsaleId,'LSI').subscribe(res => {
              this.previousInvPaymentDetList = res;
              this.selectSum = parseFloat(this.getColTotal('amount', this.previousInvPaymentDetList).toFixed(2));
              this.setTotalCalculatedValues();
            });
            this.selectInvBtn = true;
          //  this.isExport.disable();
          });
        } else {
          this.paymentEntryForm.disable();
        }
      });
    }
  }

  handleAdd() {
    if (this.paymentModeCtrl.valid) {
      if (this.outstandingAmount.value > 0) {
        if (this.paymentModeCtrl.value.code == 'BNK') {
          if (!this.bankBranchNameCtrl.value) {
            const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
            activeModal.componentInstance.showHide = false;
            activeModal.componentInstance.modalHeader = 'Alert';
            activeModal.componentInstance.modalContent = 'Please add Bank Details!';
            return;
          }
        } else if (this.paymentModeCtrl.value.code == 'CHQ') {
          if (!this.chequeNoCtrl.value || !this.chequeDateCtrl.value || this.chequeNoCtrl.value <= 0) {
            const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
            activeModal.componentInstance.showHide = false;
            activeModal.componentInstance.modalHeader = 'Alert';
            activeModal.componentInstance.modalContent = 'Please add Cheque Details!';
            return;
          }
        }

        if (this.amountCtrl.value > this.outstandingAmount.value) {
          const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
          activeModal.componentInstance.showHide = false;
          activeModal.componentInstance.modalHeader = 'Alert';
          activeModal.componentInstance.modalContent = 'Amount cannot be greater than Outstanding Amount!';
          return;
        }

        const paymentDetails = new AddDetails();
        paymentDetails.id = this.counter;
        this.counter++;
        paymentDetails.crDr = this.crDrCtrl.value;
        paymentDetails.account = parseInt(this.accountCtrl.value.toString());
        paymentDetails.amount = this.amountCtrl.value;
        paymentDetails.paymentMode = this.paymentModeCtrl.value.id;
        paymentDetails.paymentModeName = this.paymentModeCtrl.value.name;
        if (this.bankBranchNameCtrl.value) {
          paymentDetails.bankBranchId = this.bankBranchNameCtrl.value.bankBrId;
          paymentDetails.bankBranchName = this.bankBranchNameCtrl.value.bankName + ' -- ' + this.bankBranchNameCtrl.value.bankBrName;
        } else {
          paymentDetails.bankBranchId = '';
          paymentDetails.bankBranchName = '';
        }
        if (this.chequeNoCtrl.value) {
          paymentDetails.chequeNo = (parseInt(this.chequeNoCtrl.value.toString())).toString();
        } else {
          paymentDetails.chequeNo = '';
        }
        paymentDetails.chequeDate = this.chequeDateCtrl.value;
        paymentDetails.narrationLine = this.narrationLineCtrl.value;
        paymentDetails.exchRate = this.exchRateCtrl.value;
        this.paymentList.push(paymentDetails);
        this.source.load(this.paymentList);
        this.setTotalCalculatedValues();
        this.accountCtrl.reset();
        this.amountCtrl.reset();
        this.paymentModeCtrl.reset();
        this.bankBranchNameCtrl.reset();
        this.chequeNoCtrl.reset();
        this.chequeDateCtrl.reset();
        this.narrationLineCtrl.reset();
        this.exchRateCtrl.reset();
        this.chequeCtrlStatus = false;
        this.bankCtrlStatus = false;
      } else {
        const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
        activeModal.componentInstance.showHide = false;
        activeModal.componentInstance.modalHeader = 'Alert';
        activeModal.componentInstance.modalContent = 'No Outstanding Amount to Pay!';
        return;
      }
    }
  }

  onDeleteConfirm(event: any): void {
    const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
    activeModal.componentInstance.showHide = true;
    activeModal.componentInstance.modalHeader = 'Alert';
    activeModal.componentInstance.modalContent = 'Are you sure you want to delete?';
    activeModal.result.then((res) => {
      if (res == 'Y') {
        let index = 0;
        this.paymentList.forEach(ele => {
          if (ele.id == event.data.id) {
            this.paymentList.splice(index, 1);
            this.source.load(this.paymentList);
            this.setTotalCalculatedValues();
          } else {
            index++;
          }
        })
      } else {
        event.confirm.reject();
      }
    });
  }

  setTotalCalculatedValues() {
    this.totalPaidAmount.setValue(this.totalPaidAmt);
    this.outstandingAmount.setValue(this.outstandingAmt);
    this.payingAmount.setValue(this.payingAmt);
  }

  get totalPaidAmt(): number {
    const sum = parseFloat(this.getColTotal('amount', this.paymentList).toFixed(2));
    return parseFloat((this.selectSum + sum).toFixed(2));
  }

  get payingAmt(): number {
    return parseFloat(this.getColTotal('amount', this.paymentList).toFixed(2));
  }

  get outstandingAmt(): number {
    return parseFloat((parseFloat(this.totalAmount.value.toFixed(2)) - this.totalPaidAmt).toFixed(2));
  }

  getColTotal(colName: string, value: any[]): number {
    let total: number;
    total = 0;
    value.forEach(row => {
      total += parseFloat(row[colName]);
    });
    return total;
  }

  onPreviewHistory() {
    const activeModal = this.modalService.open(PaymentPreviewModal, { size: 'lg' });
    activeModal.componentInstance.modalHeader = 'Receipt Detail History for Invoice No. ' + this.invoiceNo.value + ' !';
    activeModal.componentInstance.source.load(this.previousInvPaymentDetList);
  }

  onChangePaymentMode(paymentMode: any) {
    if (this.paymentModeCtrl.valid) {
      if (this.paymentModeCtrl.value.code == 'BNK') {
        this.bankCtrlStatus = true;
        this.chequeCtrlStatus = false;
        this.chequeNoCtrl.reset();
        this.chequeDateCtrl.reset();
      } else if (this.paymentModeCtrl.value.code == 'CHQ') {
        this.chequeCtrlStatus = true;
        this.bankCtrlStatus = false;
        this.bankBranchNameCtrl.reset();
      } else {
        this.chequeCtrlStatus = false;
        this.bankCtrlStatus = false;
        this.chequeNoCtrl.reset();
        this.chequeDateCtrl.reset();
        this.bankBranchNameCtrl.reset();
      }
    }
  }

  finally() {
    this.isLoading = false;
    this.paymentEntryForm.markAsPristine();
  }

  handleBack(cancelling: boolean = false) {
    // TODO: if cancelling then ask to confirm
    this.back.back();
  }

  private createForm() {
    this.paymentEntryForm = this.fb.group({
      'docCode': ['LSI'],
      'invoiceNo': [''],
      'docNo': [''],
      'docDate': [''],
      'partyName': [''],
      'invoiceDate': [''],
      'ordNo': [''],
      'currency': [''],
      'narration': [''],
      'provisional': [''],

      'crDrCtrl': [''],
      'accountCtrl': [''],
      'amountCtrl': [''],
      'paymentModeCtrl': ['', Validators.compose([Validators.required])],
      'bankBranchNameCtrl': [''],
      'chequeDateCtrl': [''],
      'chequeNoCtrl': [''],
      'narrationLineCtrl': [''],
      'exchRateCtrl': [''],

      'outstandingAmount': [''],
      'totalAmount': [''],
      'totalPaidAmount': [''],
      'payingAmount': [''],
      'receiptDetailsList': [],
      'isExport': [],
    });

    this.docCode = this.paymentEntryForm.controls['docCode'];
    this.invoiceNo = this.paymentEntryForm.controls['invoiceNo'];
    this.docDate = this.paymentEntryForm.controls['docDate'];
    this.partyName = this.paymentEntryForm.controls['partyName'];
    this.invoiceDate = this.paymentEntryForm.controls['invoiceDate'];
    this.ordNo = this.paymentEntryForm.controls['ordNo'];
    this.currency = this.paymentEntryForm.controls['currency'];
    this.narration = this.paymentEntryForm.controls['narration'];
    this.provisional = this.paymentEntryForm.controls['provisional'];

    this.crDrCtrl = this.paymentEntryForm.controls['crDrCtrl'];
    this.accountCtrl = this.paymentEntryForm.controls['accountCtrl'];
    this.amountCtrl = this.paymentEntryForm.controls['amountCtrl'];
    this.paymentModeCtrl = this.paymentEntryForm.controls['paymentModeCtrl'];
    this.bankBranchNameCtrl = this.paymentEntryForm.controls['bankBranchNameCtrl'];
    this.chequeDateCtrl = this.paymentEntryForm.controls['chequeDateCtrl'];
    this.chequeNoCtrl = this.paymentEntryForm.controls['chequeNoCtrl'];
    this.narrationLineCtrl = this.paymentEntryForm.controls['narrationLineCtrl'];
    this.exchRateCtrl = this.paymentEntryForm.controls['exchRateCtrl'];

    this.outstandingAmount = this.paymentEntryForm.controls['outstandingAmount'];
    this.totalAmount = this.paymentEntryForm.controls['totalAmount'];
    this.totalPaidAmount = this.paymentEntryForm.controls['totalPaidAmount'];
    this.payingAmount = this.paymentEntryForm.controls['payingAmount'];
    this.isExport = this.paymentEntryForm.controls['isExport'];


    this.isExport.valueChanges.subscribe(val => {
      if (val == true) {
        this.isExportVal = 'Select ' + this.isType + ' Invoice';
      }
      else {
        this.isExportVal = 'Select Local Invoice'
      }


    });
  }

}
