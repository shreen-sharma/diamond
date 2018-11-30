import { CurrencyService } from 'app/pages/masters/components/currency/';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { Component, Pipe, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from '../../../../../core/authentication/authentication.service';
import { Logger } from '../../../../../core/logger.service';
import { BrokerPaymentEntryService } from '../brokerPaymentEntry.service';
import { BranchService } from 'app/pages/masters/components/bankBranches/branch.service';
import { CommonService } from 'app/pages/masters/components/common/common.service';
import { BrokerPaymentEntryModal } from './brokerPaymentEntry-modal/brokerPaymentEntry-modal.component';
import { CommonModalComponent } from '../../../../../shared/common-modal/common-modal.component';
import { BrokerPaymentPreviewModal } from './brokerPaymentPreview-modal/brokerPaymentPreview-modal.component';

const log = new Logger('paymentEntry');

class AddDetails {
  id: number;
  accountNo: number;
  paidAmount: number;
  paymentMode: number;
  paymentModeName: string;
  bankBranchId: string;
  bankBranchName: string;
  chequeDate: string;
  chequeNo: string;
  narration: string;
}

@Component({
  selector: 'createBrokerPaymentEntry',
  templateUrl: './createBrokerPaymentEntry.html',
  styleUrls: ['./createBrokerPaymentEntry.scss']
})
export class CreateBrokerPaymentEntryComponent implements OnInit {

  pageTitle = "Broker Payment Entry";
  invoiceSelected = false;
  showSubmitButton = true;
  paymentDetailIdCounter = 1;
  previousPaidAmountSum = 0;
  showPreviewHistory = false;

  source: LocalDataSource = new LocalDataSource();
  settings: any;

  paymentDetailList: AddDetails[] = [];  // for new payment details
  previousPaymentDetList: any[] = [];  // already exist payment details

  currencyList: any[] = [];
  brokers: any[] = [];
  paymentModeList: any[] = [];
  bankBranchList: any[] = [];

  bankCtrlStatus = false;
  chequeCtrlStatus = false;

  public brokerPaymentForm: FormGroup;
  public invoiceType: AbstractControl;
  public broker: AbstractControl;
  public paymentDate: AbstractControl;
  public partyName: AbstractControl;
  public currencyId: AbstractControl;
  public invoiceId: AbstractControl;
  public invoiceDate: AbstractControl;
  public orderNo: AbstractControl;
  public remarks: AbstractControl;
  public provisional: AbstractControl;

  public accountNo: AbstractControl;
  public paidAmount: AbstractControl;
  public paymentMode: AbstractControl;
  public bankBranch: AbstractControl;
  public chequeNo: AbstractControl;
  public chequeDate: AbstractControl;
  public narration: AbstractControl;

  public totalAmount: AbstractControl;
  public totalPaidAmount: AbstractControl;
  public currentPaidAmount: AbstractControl;
  public outStandingAmount: AbstractControl;

  private createBrokerPaymentForm() {
    this.brokerPaymentForm = this.fb.group({
      'invoiceType': [''],
      'broker': [''],
      'paymentDate': [''],
      'partyId': [''],
      'partyName': [''],
      'currencyId': [''],
      'invoiceId': [''],
      'invoiceDate': [''],
      'orderNo': [''],
      'remarks': [''],
      'provisional': [''],
      'accountNo': [''],
      'paidAmount': [''],
      'paymentMode': [''],
      'bankBranch': [''],
      'chequeNo': [''],
      'chequeDate': ['',],
      'narration': [''],
      'totalAmount': [''],
      'totalPaidAmount': [''],
      'currentPaidAmount': [''],
      'outStandingAmount': [''],
      'brokerPaymentDetailsList': ['']
    });

    this.invoiceType = this.brokerPaymentForm.controls['invoiceType'];
    this.broker = this.brokerPaymentForm.controls['broker'];
    this.paymentDate = this.brokerPaymentForm.controls['paymentDate'];
    this.partyName = this.brokerPaymentForm.controls['partyName'];
    this.currencyId = this.brokerPaymentForm.controls['currencyId'];
    this.invoiceId = this.brokerPaymentForm.controls['invoiceId'];
    this.invoiceDate = this.brokerPaymentForm.controls['invoiceDate'];
    this.orderNo = this.brokerPaymentForm.controls['orderNo'];
    this.remarks = this.brokerPaymentForm.controls['remarks'];
    this.provisional = this.brokerPaymentForm.controls['provisional'];
    this.accountNo = this.brokerPaymentForm.controls['accountNo'];
    this.paidAmount = this.brokerPaymentForm.controls['paidAmount'];
    this.paymentMode = this.brokerPaymentForm.controls['paymentMode'];
    this.bankBranch = this.brokerPaymentForm.controls['bankBranch'];
    this.chequeNo = this.brokerPaymentForm.controls['chequeNo'];
    this.chequeDate = this.brokerPaymentForm.controls['chequeDate'];
    this.narration = this.brokerPaymentForm.controls['narration'];
    this.totalAmount = this.brokerPaymentForm.controls['totalAmount'];
    this.totalPaidAmount = this.brokerPaymentForm.controls['totalPaidAmount'];
    this.currentPaidAmount = this.brokerPaymentForm.controls['currentPaidAmount'];
    this.outStandingAmount = this.brokerPaymentForm.controls['outStandingAmount'];

  }

  invoiceTypeChanges() {
    this.broker.setValue('');
    const invType = this.invoiceType.value;

    if (invType === 'LPI') {
      this.service.getLocalPurchaseInvoiceBrokersByBrokerPayment('N').subscribe(data => {
        this.brokers = data;
      });
    } else if (invType === 'IPI') {
      this.service.getImportPurchaseInvoiceBrokersByBrokerPayment('N').subscribe((data) => {
        this.brokers = data;
      });
    } else if (invType === 'LSI') {
      this.service.getLocalSalesInvoiceBrokersByBrokerPayment('N').subscribe((data) => {
        this.brokers = data;
      });
    } else if (invType === 'ESI') {
      this.service.getExportSalesInvoiceBrokersByBrokerPayment('N').subscribe((data) => {
        this.brokers = data;
      });
    }
  }

  constructor(private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private back: Location,
    private service: BrokerPaymentEntryService,
    private modalService: NgbModal,
    private bankBranchService: BranchService,
    private commonService: CommonService,
    private currencyService: CurrencyService,
    private authService: AuthenticationService) {

    this.currencyService.getAllCurrencies().subscribe((currencyList) => {
      this.currencyList = currencyList;
    });

    this.commonService.getAllCommonMasterByType('PM').subscribe(list => {
      this.paymentModeList = list;
    });

    this.bankBranchService.getData().subscribe(list => {
      this.bankBranchList = list;
    });

    this.createBrokerPaymentForm();
    this.settings = this.prepareSettings();
  }

  ngOnInit() {
    if (this.router.url.includes('viewBrokerPaymentEntry')) {
      this.route.params.subscribe((params: Params) => {
        let brokerPaymentId = params['id'];
        if (brokerPaymentId) {
          this.pageTitle = 'View Broker Payment Entry Details';
          this.invoiceSelected = true;
          this.showSubmitButton = false;

          this.service.getBrokerPaymentById(brokerPaymentId).subscribe(response => {
            this.brokerPaymentForm.disable();

            this.brokerPaymentForm.patchValue(response);
            setTimeout(() => {
              this.service.getAllPartiesByType('BR').subscribe(list => {
                this.brokers = list;
              });
            }, 0);
            this.broker.setValue(response.broker);

            this.paymentDetailList = response.brokerPaymentDetailsList;
            this.source.load(this.paymentDetailList);
          });
          
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
        edit: false,
        delete: true,
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
        accountNo: {
          title: 'Account No'
        },
        paymentModeName: {
          title: 'Payment Mode'
        },
        bankBranchName: {
          title: 'Bank Branch Name',
          valuePrepareFunction: value => {
            return value ? value : '-';
          }
        },
        paidAmount: {
          title: 'Paid Amount',
        },
        narration: {
          title: 'Narration',
          valuePrepareFunction: value => {
            return value ? value : '-';
          }
        },
        chequeNo: {
          title: 'Cheque No',
          valuePrepareFunction: value => {
            return value ? value : '-';
          }
        },
        chequeDate: {
          title: 'Cheque Date',
          valuePrepareFunction: value => {
            if (value) {
              const chqDate = value.split('-');
              return chqDate[2] + '-' + chqDate[1] + '-' + chqDate[0];
            } else
              return '-';
          }
        }
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
    if (this.paymentDetailList.length > 0) {
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = true;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Do you Really Want to Submit?? You will not be able to edit this Payment Entry again in Future!!';
      activeModal.result.then((res) => {
        if (res == 'Y') {
          this.brokerPaymentForm.controls['brokerPaymentDetailsList'].setValue(this.paymentDetailList);
          const formValue: any = this.brokerPaymentForm.value;

          this.service.addBrokerPayment(this.brokerPaymentForm.value).subscribe(resp => {
            this.handleBack();
            this.finally();
          }, error => {
            log.debug(`Creation error: ${error}`);
            this.finally();
          });
        }
      });
    } else {
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = false;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Please Add Some Payment Entries!!!';
    }
  }

  selectModal() {

    const invoiceType: string = this.invoiceType.value;
    const brokerId: number = this.broker.value;

    if (invoiceType === 'LPI') {
      const activeModal = this.modalService.open(BrokerPaymentEntryModal, { size: 'lg' });
      activeModal.componentInstance.modalHeader = 'Local Purchase Invoice';
      activeModal.componentInstance.invoiceGeneration(invoiceType, brokerId);
      activeModal.componentInstance.emitService.subscribe((emmitedInvoice) => {

        this.paymentDate.setValue(this.today());
        this.brokerPaymentForm.controls['partyId'].setValue(emmitedInvoice.party.partyId);
        this.partyName.setValue(emmitedInvoice.party ? emmitedInvoice.party.partyName : '-');
        this.invoiceId.setValue(emmitedInvoice.locPurId);
        this.currencyId.setValue(emmitedInvoice.invCurrId);
        this.invoiceDate.setValue(emmitedInvoice.locPurDate);
        this.orderNo.setValue(emmitedInvoice.locPurNo);
        this.remarks.setValue(emmitedInvoice.remark ? emmitedInvoice.remark : '-');
        this.provisional.setValue(emmitedInvoice.provisional == 'Y' ? true : false);

        this.totalAmount.setValue(emmitedInvoice.brokerAmount);

        this.service.getBrokerPaymentDetailsByInvoiceIdAndType(this.invoiceId.value, 'LPI').subscribe(res => {
          if (res.length > 0) {
            this.showPreviewHistory = true;
            this.previousPaymentDetList = res;
            this.previousPaidAmountSum = parseFloat(this.getColTotal('paidAmount', this.previousPaymentDetList).toFixed(2));
            this.setTotalCalculatedValues();
          } else {
            this.setTotalCalculatedValues();
          }
        });

        
        this.invoiceSelected = true;
      });

    } else if (invoiceType === 'IPI') {
      const activeModal = this.modalService.open(BrokerPaymentEntryModal, { size: 'lg', backdrop: 'static' });
      activeModal.componentInstance.modalHeader = 'Import Purchase Invoice';
      activeModal.componentInstance.invoiceGeneration(invoiceType, brokerId);
      activeModal.componentInstance.emitService.subscribe((emmitedInvoice) => {

        this.paymentDate.setValue(this.today());
        this.brokerPaymentForm.controls['partyId'].setValue(emmitedInvoice.supplierId);
        this.partyName.setValue(emmitedInvoice.supplier);
        this.invoiceId.setValue(emmitedInvoice.invoiceId);
        this.currencyId.setValue(emmitedInvoice.currencyId);
        this.invoiceDate.setValue(emmitedInvoice.invoiceDate);
        this.orderNo.setValue(emmitedInvoice.poId);
        this.remarks.setValue(emmitedInvoice.remark ? emmitedInvoice.remark : '-');
        this.provisional.setValue(emmitedInvoice.provitionalStatus);

        this.totalAmount.setValue(emmitedInvoice.brok);

        this.service.getBrokerPaymentDetailsByInvoiceIdAndType(this.invoiceId.value, 'IPI').subscribe(res => {
          if (res.length > 0) {
            this.showPreviewHistory = true;
            this.previousPaymentDetList = res;
            this.previousPaidAmountSum = parseFloat(this.getColTotal('paidAmount', this.previousPaymentDetList).toFixed(2));
            this.setTotalCalculatedValues();
          } else {
            this.setTotalCalculatedValues();
          }
        });
        this.invoiceSelected = true;
      });

    } else if (invoiceType === 'LSI') {
      const activeModal = this.modalService.open(BrokerPaymentEntryModal, { size: 'lg' });
      activeModal.componentInstance.modalHeader = 'Local Sales Invoice';
      activeModal.componentInstance.invoiceGeneration(invoiceType, brokerId);
      activeModal.componentInstance.emitService.subscribe((emmitedInvoice) => {

        this.paymentDate.setValue(this.today());
        this.brokerPaymentForm.controls['partyId'].setValue(emmitedInvoice.customer);
        this.partyName.setValue(emmitedInvoice.customerName);
        this.invoiceId.setValue(emmitedInvoice.locsaleId);
        this.currencyId.setValue(emmitedInvoice.currencyId);
        this.invoiceDate.setValue(emmitedInvoice.invoiceDate);
        this.orderNo.setValue(emmitedInvoice.soId ? emmitedInvoice.soId : '-');
        this.remarks.setValue(emmitedInvoice.remark ? emmitedInvoice.remark : '-');
        this.provisional.setValue(emmitedInvoice.provisional);

        this.totalAmount.setValue(emmitedInvoice.brokerageAmt);

        this.service.getBrokerPaymentDetailsByInvoiceIdAndType(this.invoiceId.value, 'LSI').subscribe(res => {
          if (res.length > 0) {
            this.showPreviewHistory = true;
            this.previousPaymentDetList = res;
            this.previousPaidAmountSum = parseFloat(this.getColTotal('paidAmount', this.previousPaymentDetList).toFixed(2));
            this.setTotalCalculatedValues();
          } else {
            this.setTotalCalculatedValues();
          }
        });

        this.invoiceSelected = true;
      });

    } else if (invoiceType === 'ESI') {
      const activeModal = this.modalService.open(BrokerPaymentEntryModal, { size: 'lg' });
      activeModal.componentInstance.modalHeader = 'Export Sales Invoice';
      activeModal.componentInstance.invoiceGeneration(invoiceType, brokerId);
      activeModal.componentInstance.emitService.subscribe((emmitedInvoice) => {
        this.paymentDate.setValue(this.today());
        this.brokerPaymentForm.controls['partyId'].setValue(emmitedInvoice.partyMasterByPartyId);
        this.partyName.setValue(emmitedInvoice.customerName);
        this.invoiceId.setValue(emmitedInvoice.expId);
        this.currencyId.setValue(emmitedInvoice.currencyMaster);
        this.invoiceDate.setValue(emmitedInvoice.expDate);
        this.orderNo.setValue(emmitedInvoice.ordNo);
        this.remarks.setValue(emmitedInvoice.remark ? emmitedInvoice.remark : '-');
        this.provisional.setValue(emmitedInvoice.provisional);

        this.totalAmount.setValue(emmitedInvoice.brokerageRs);

        this.service.getBrokerPaymentDetailsByInvoiceIdAndType(this.invoiceId.value, 'ESI').subscribe(res => {
          if (res.length > 0) {
            this.showPreviewHistory = true;
            this.previousPaymentDetList = res;
            this.previousPaidAmountSum = parseFloat(this.getColTotal('paidAmount', this.previousPaymentDetList).toFixed(2));
            this.setTotalCalculatedValues();
          } else {
            this.setTotalCalculatedValues();
          }
        });

        this.invoiceSelected = true;
      });
    }
  }

  onPreviewHistory() {
    const invoiceType = this.invoiceType.value;
    let invoiceName: string;
    if (invoiceType === 'ESI')
      invoiceName = "Export Sales Invoice";
    else if (invoiceType === 'LSI')
      invoiceName = "Local Sales Invoice";
    else if (invoiceType === 'IPI')
      invoiceName = "Import Purchase Invoice";
    else if (invoiceType === 'LPI')
      invoiceName = "Local Purchase Invoice";

    const activeModal = this.modalService.open(BrokerPaymentPreviewModal, { size: 'lg' });
    activeModal.componentInstance.InvoiceType = 'Invoice Type : ' + invoiceName;
    activeModal.componentInstance.invoiceNo = 'Broker Payment Detail History for Invoice No : ' + this.invoiceId.value;
    activeModal.componentInstance.source.load(this.previousPaymentDetList);
  }

  handleAdd() {
    debugger;
    if (this.paymentMode.valid) {
      if (this.outStandingAmount.value > 0) {
        if (this.paymentMode.value.code == 'BNK') {
          if (!this.bankBranch.value) {
            const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
            activeModal.componentInstance.showHide = false;
            activeModal.componentInstance.modalHeader = 'Alert';
            activeModal.componentInstance.modalContent = 'Please add Bank Details!';
            return;
          }
        } else if (this.paymentMode.value.code == 'CHQ') {
          if (!this.chequeNo.value || !this.chequeDate.value || this.chequeNo.value <= 0) {
            const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
            activeModal.componentInstance.showHide = false;
            activeModal.componentInstance.modalHeader = 'Alert';
            activeModal.componentInstance.modalContent = 'Please add Cheque Details!';
            return;
          }
        }

        if (this.paidAmount.value > this.outStandingAmount.value) {
          const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
          activeModal.componentInstance.showHide = false;
          activeModal.componentInstance.modalHeader = 'Alert';
          activeModal.componentInstance.modalContent = 'Amount cannot be greater than Outstanding Amount!';
          return;
        }

        const paymentDetails = new AddDetails();
        paymentDetails.id = this.paymentDetailIdCounter;
        this.paymentDetailIdCounter++;
        paymentDetails.accountNo = parseInt(this.accountNo.value.toString());
        paymentDetails.paidAmount = this.paidAmount.value;
        paymentDetails.paymentMode = this.paymentMode.value.id;
        paymentDetails.paymentModeName = this.paymentMode.value.name;
        if (this.bankBranch.value) {
          paymentDetails.bankBranchId = this.bankBranch.value.bankBrId;
          paymentDetails.bankBranchName = this.bankBranch.value.bankName + ' -- ' + this.bankBranch.value.bankBrName;
        } else {
          paymentDetails.bankBranchId = '';
          paymentDetails.bankBranchName = '';
        }
        if (this.chequeNo.value)
          paymentDetails.chequeNo = (parseInt(this.chequeNo.value.toString())).toString();

        paymentDetails.chequeDate = this.chequeDate.value;
        paymentDetails.narration = this.narration.value;
        this.paymentDetailList.push(paymentDetails);
        this.source.load(this.paymentDetailList);
        this.setTotalCalculatedValues();

        this.accountNo.reset();
        this.paidAmount.reset();
        this.paymentMode.reset();
        this.bankBranch.reset();
        this.chequeNo.reset();
        this.chequeDate.reset();
        this.narration.reset();
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
        this.paymentDetailList.forEach(ele => {
          if (ele.id == event.data.id) {
            this.paymentDetailList.splice(index, 1);
            this.source.load(this.paymentDetailList);
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
    debugger;
    this.totalPaidAmount.setValue(this.totalPaidAmt);
    this.currentPaidAmount.setValue(this.payingAmt);
    this.outStandingAmount.setValue(this.outstandingAmt);
  }

  get totalPaidAmt(): number {
    if (this.paymentDetailList) {
      const sum = parseFloat(this.getColTotal('paidAmount', this.paymentDetailList).toFixed(2));
      return parseFloat((this.previousPaidAmountSum + sum).toFixed(2));
    }
    return 0;
  }

  get payingAmt(): number {
    if (this.paymentDetailList) {
      return parseFloat(this.getColTotal('paidAmount', this.paymentDetailList).toFixed(2));
    }
    return 0;
  }

  get outstandingAmt(): number {
    return parseFloat((parseFloat(this.totalAmount.value.toFixed(2)) - this.totalPaidAmt).toFixed(2));
  }

  getColTotal(colName: string, value: any[]): number {
    let total = 0;
    value.forEach(row => {
      total += parseFloat(row[colName]);
    });
    return total;
  }

  onChangePaymentMode(paymentMode: any) {
    if (this.paymentMode.valid) {
      if (this.paymentMode.value.code == 'BNK') {
        this.bankCtrlStatus = true;
        this.chequeCtrlStatus = false;
        this.chequeNo.reset();
        this.chequeDate.reset();
      } else if (this.paymentMode.value.code == 'CHQ') {
        this.chequeCtrlStatus = true;
        this.bankCtrlStatus = false;
        this.bankBranch.reset();
      } else {
        this.chequeCtrlStatus = false;
        this.bankCtrlStatus = false;
        this.chequeNo.reset();
        this.chequeDate.reset();
        this.bankBranch.reset();
      }
    }
  }

  finally() {
    this.brokerPaymentForm.markAsPristine();
  }

  handleBack() {
    this.back.back();
  }

}
