import { CommonModalComponent } from '../../../../shared/common-modal/common-modal.component';
import { FormGroup, FormArray, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { AuthenticationService } from '../../../../core/authentication/authentication.service';
import { Logger } from '../../../../core/logger.service';
import { PayableAndReceivablesReportService } from './payableAndReceivablesReport.service';
import { CurrencyService } from 'app/pages/masters/components/currency/currency.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
//import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import * as jsPDF from 'jspdf';
import * as jpt from 'jspdf-autotable';

const log = new Logger('localPurchaseMonthlyInvoiceReport');


class InvoiceDetails {

  invoiceNo: string;
  invoiceDate: string;
  partyName: string;
  partyDueDate: string;
  remainingDays: number;
  netAmountINR: number;
  netAmountUSD: number;
  paymentStatus: string;
  invExchRate: number;
  exchRate: number;
  invCurrCode: string;
  netAmntByInvExchRate: number;
}

class Supplier {
  supplierId: number;
  supplierName: string;
}

@Component({
  selector: 'payableAndReceivablesReport',
  templateUrl: './payableAndReceivablesReport.html',
  styleUrls: ['./payableAndReceivablesReport.scss'],

})



export class PayableAndReceivablesReport implements OnInit {

  format1(n, currency) {
    return currency + n.toString().replace(/(\d)(?=(\d{3})+\.)/g, '$1,'); //USD Currency Formatter
  }
  format2(n, currency) {
    return currency + n.toString().replace(/(\d)(?=(\d{2})+\d\.)/g, '$1,'); // INR Currency Formatter
  }
  format3(n, currency) {
    return currency + n.replace(/(\d)(?=(\d{3})+\.)/g, '$1,'); //USD Currency Formatter
  }
  format4(n, currency) {
    return currency + n.replace(/(\d)(?=(\d{2})+\d\.)/g, '$1,'); //INR Currency Formatter
  }

  monthList: any[] = [
    { value: '01', title: 'January' },
    { value: '02', title: 'February' },
    { value: '03', title: 'March' },
    { value: '04', title: 'April' },
    { value: '05', title: 'May' },
    { value: '06', title: 'June' },
    { value: '07', title: 'July' },
    { value: '08', title: 'August' },
    { value: '09', title: 'September' },
    { value: '10', title: 'October' },
    { value: '11', title: 'November' },
    { value: '12', title: 'December ' },
  ]

  query = '';
  error: string = null;
  isLoading = false;
  localPurchaseMonthlyInvoiceReportForm: FormGroup;
  source: LocalDataSource = new LocalDataSource();

  yearList: any[] = [];
  supplierList: Supplier[] = [];
  selectedCat: any;
  name: string;
  partyId: number;
  tabList: any[] = [];

  params: any[] = [];

  yearlyStatus: boolean = false;
  suppStatus: boolean = false;
  isDateWise: boolean = false;

  invoiceList: InvoiceDetails[] = [];
  settings: any;
  reportStatus: boolean;

  totalCarets: number;
  totalNetAmount: number;
  totalOrdAmtBase: number;
  totalOrdAmtStock: number;
  totalNP: number;
  totalNPPer: number;
  reportHeading: String;
  currentUser: String;
  loading: boolean = false;
  currList: any[] = [];

  public month: AbstractControl;
  public year: AbstractControl;
  public supplier: AbstractControl;
  public fromDate: AbstractControl;
  public toDate: AbstractControl;
  public currency: AbstractControl;
  public paymentProcess: AbstractControl;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private service: PayableAndReceivablesReportService,
    private modalService: NgbModal,
    private currencyService: CurrencyService,
    //private spinnerService: Ng4LoadingSpinnerService,
    private authService: AuthenticationService) {
    this.createForm();
    this.getYearList();
    this.reportStatus = true;
    this.settings = this.prepareSetting();
    this.getSupplier();
    this.currentUser = sessionStorage.getItem("loggedUser");
    this.currencyService.getAllCurrencies().subscribe((currList) => {
      this.currList = currList;
    });

  }

  now(): string {
    const today = new Date();
    const dd = today.getDate();
    const mm = today.getMonth() + 1; //January is 0!
    const yyyy = today.getFullYear();
    const hr = today.getHours();
    const min = today.getMinutes();
    const sec = today.getSeconds();

    return (dd < 10 ? '0' + dd : dd) + '-' + (mm < 10 ? '0' + mm : mm) + '-' + yyyy + ' | ' + hr + ':' + min + ':' + sec;
  }

  getSupplier() {

    this.service.getAllSupplierByType('SU').subscribe((objList) => {
      objList.forEach(ele => {
        const supplier = new Supplier();
        supplier.supplierId = ele.partyId;
        supplier.supplierName = ele.partyName;
        this.supplierList.push(supplier);
      });
    });
  }


  getSCustomer() {

    this.service.getAllSupplierByType('CU').subscribe((objList) => {
      objList.forEach(ele => {
        const supplier = new Supplier();
        supplier.supplierId = ele.partyId;
        supplier.supplierName = ele.partyName;
        this.supplierList.push(supplier);
      });
    });
  }

  ngOnInit() {
    this.fromDate.setValue(this.dateFormate(new Date()));
    this.toDate.setValue(this.dateFormate(new Date()));

    if (this.router.url.includes('payableImportInvoiceReport')) {
      this.reportHeading = 'Payable Import Invoice Report';
      this.getSupplier();
      this.service.getImportPurchasePayableReport(-1, -1, -1, -1, -1).subscribe((tabList) => {
        if (tabList.length > 0) {
          this.settings = this.prepareSettingPay();
          this.tabList = tabList;
          this.invoiceList = [];
          this.tabList.forEach(invoiceItem => {
            const invoiceDetails = new InvoiceDetails();

            invoiceDetails.exchRate = invoiceItem.exchRate;
            invoiceDetails.invCurrCode = invoiceItem.invCurrCode;
            invoiceDetails.invExchRate = invoiceItem.invExchRate;
            invoiceDetails.invoiceDate = invoiceItem.invoiceDate;
            invoiceDetails.invoiceNo = invoiceItem.invoiceId;
            invoiceDetails.netAmountINR = invoiceItem.netAmountINR;
            invoiceDetails.netAmountUSD = invoiceItem.netAmountUSD;
            invoiceDetails.netAmntByInvExchRate = invoiceItem.netAmntByInvExchRate;
            invoiceDetails.partyDueDate = invoiceItem.partyDueDate;
            invoiceDetails.partyName = invoiceItem.supplierName;
            invoiceDetails.paymentStatus = (invoiceItem.paymentStatus == 'N' ? 'Not Completed' : 'Completed');
            invoiceDetails.remainingDays = invoiceItem.remainingDays;
            // invoiceDetails.locPurId = invoiceItem.expId;
            // invoiceDetails.invoiceNo = invoiceItem.expId;
            // invoiceDetails.locPurDate = invoiceItem.expDate;
            // invoiceDetails.locPurNo = invoiceItem.expNo;
            // invoiceDetails.netAmount = invoiceItem.orderAmountBase;
            // invoiceDetails.paymentProcessStatus = invoiceItem.paymentProcessStatus;
            // invoiceDetails.partyDueDate = invoiceItem.partyDueDate;
            // invoiceDetails.bankDueDate = invoiceItem.cbbDueDate;
            // invoiceDetails.remainingDays = invoiceItem.remainingDays;
            // invoiceDetails.invCurrCode = invoiceItem.invCurrCode;
            // invoiceDetails.partyName = invoiceItem.customerName;
            // invoiceDetails.stockCurrCode = invoiceItem.stockCurrCode;
            // if(invoiceDetails.invCurrCode == 'USD'){
            //   invoiceDetails.netAmount = this.format1(parseFloat(invoiceDetails.netAmount.toString()).toFixed(2),'');
            // }else{
            //   invoiceDetails.netAmount = this.format2(parseFloat(invoiceDetails.netAmount.toString()).toFixed(2),'');
            // }
            this.invoiceList.push(invoiceDetails);
            this.source.load(this.invoiceList);
            //    this.invoiceList=[];
          });
        }
        this.loading = false;
      });
      this.isDateWise = true;
    } else if (this.router.url.includes('payableLocalInvoiceReport')) {
      this.reportHeading = 'Payable Local Invoice Report';
      this.getSupplier();
      this.loading = true;
      this.service.getLocalPurchasePayableReport(-1, -1, -1, -1, -1).subscribe((tabList) => {
        if (tabList.length > 0) {
          this.settings = this.prepareSettingPay();
          this.tabList = tabList;
          this.invoiceList = [];
          this.tabList.forEach(invoiceItem => {
            const invoiceDetails = new InvoiceDetails();

            invoiceDetails.exchRate = invoiceItem.exchRate;
            invoiceDetails.invCurrCode = invoiceItem.invCurrCode;
            invoiceDetails.invExchRate = invoiceItem.invExchRate;
            invoiceDetails.invoiceDate = invoiceItem.invoiceDate;
            invoiceDetails.invoiceNo = invoiceItem.invoiceId;
            invoiceDetails.netAmountINR = invoiceItem.netAmountINR;
            invoiceDetails.netAmountUSD = invoiceItem.netAmountUSD;
            invoiceDetails.netAmntByInvExchRate = invoiceItem.netAmntByInvExchRate;
            invoiceDetails.partyDueDate = invoiceItem.partyDueDate;
            invoiceDetails.partyName = invoiceItem.supplierName;
            invoiceDetails.paymentStatus = (invoiceItem.paymentStatus == 'N' ? 'Not Completed' : 'Completed');
            invoiceDetails.remainingDays = invoiceItem.remainingDays;
            // invoiceDetails.locPurId = invoiceItem.expId;
            // invoiceDetails.invoiceNo = invoiceItem.expId;
            // invoiceDetails.locPurDate = invoiceItem.expDate;
            // invoiceDetails.locPurNo = invoiceItem.expNo;
            // invoiceDetails.netAmount = invoiceItem.orderAmountBase;
            // invoiceDetails.paymentProcessStatus = invoiceItem.paymentProcessStatus;
            // invoiceDetails.partyDueDate = invoiceItem.partyDueDate;
            // invoiceDetails.bankDueDate = invoiceItem.cbbDueDate;
            // invoiceDetails.remainingDays = invoiceItem.remainingDays;
            // invoiceDetails.invCurrCode = invoiceItem.invCurrCode;
            // invoiceDetails.partyName = invoiceItem.customerName;
            // invoiceDetails.stockCurrCode = invoiceItem.stockCurrCode;
            // if(invoiceDetails.invCurrCode == 'USD'){
            //   invoiceDetails.netAmount = this.format1(parseFloat(invoiceDetails.netAmount.toString()).toFixed(2),'');
            // }else{
            //   invoiceDetails.netAmount = this.format2(parseFloat(invoiceDetails.netAmount.toString()).toFixed(2),'');
            // }
            this.invoiceList.push(invoiceDetails);
            this.source.load(this.invoiceList);
            //    this.invoiceList=[];
          });
        }
        this.loading = false;
      });
      this.isDateWise = true;
    } else if (this.router.url.includes('receivablesExportInvoiceReport')) {
      this.loading = true;
      this.reportHeading = 'Receivables Export Invoice Report';
      this.getSCustomer();
      this.service.getExportSalesReceivableReport(-1, -1, -1, -1, -1).subscribe((tabList) => {
        if (tabList.length > 0) {
          this.settings = this.prepareSetting();
          this.tabList = tabList;
          this.invoiceList = [];
          this.tabList.forEach(invoiceItem => {
            const invoiceDetails = new InvoiceDetails();

            invoiceDetails.exchRate = invoiceItem.exchRate;
            invoiceDetails.invCurrCode = invoiceItem.invCurrCode;
            invoiceDetails.invExchRate = invoiceItem.invExchRate;
            invoiceDetails.invoiceDate = invoiceItem.invoiceDate;
            invoiceDetails.invoiceNo = invoiceItem.invoiceId;
            invoiceDetails.netAmountINR = invoiceItem.netAmountINR;
            invoiceDetails.netAmountUSD = (invoiceItem.invCurrCode == "INR" ? '-' : invoiceItem.netAmountUSD);//invoiceItem.netAmountUSD;;
            invoiceDetails.partyDueDate = invoiceItem.partyDueDate;
            invoiceDetails.partyName = invoiceItem.customerName;
            invoiceDetails.paymentStatus = (invoiceItem.paymentStatus == 'N' ? 'Not Completed' : 'Completed');
            invoiceDetails.remainingDays = invoiceItem.remainingDays;
            // invoiceDetails.locPurId = invoiceItem.expId;
            // invoiceDetails.invoiceNo = invoiceItem.expId;
            // invoiceDetails.locPurDate = invoiceItem.expDate;
            // invoiceDetails.locPurNo = invoiceItem.expNo;
            // invoiceDetails.netAmount = invoiceItem.orderAmountBase;
            // invoiceDetails.paymentProcessStatus = invoiceItem.paymentProcessStatus;
            // invoiceDetails.partyDueDate = invoiceItem.partyDueDate;
            // invoiceDetails.bankDueDate = invoiceItem.cbbDueDate;
            // invoiceDetails.remainingDays = invoiceItem.remainingDays;
            // invoiceDetails.invCurrCode = invoiceItem.invCurrCode;
            // invoiceDetails.partyName = invoiceItem.customerName;
            // invoiceDetails.stockCurrCode = invoiceItem.stockCurrCode;
            // if(invoiceDetails.invCurrCode == 'USD'){
            //   invoiceDetails.netAmount = this.format1(parseFloat(invoiceDetails.netAmount.toString()).toFixed(2),'');
            // }else{
            //   invoiceDetails.netAmount = this.format2(parseFloat(invoiceDetails.netAmount.toString()).toFixed(2),'');
            // }
            this.invoiceList.push(invoiceDetails);
            this.source.load(this.invoiceList);
            //    this.invoiceList=[];
          });
        }
        this.loading = false;
      });
      this.isDateWise = true;

    } else if (this.router.url.includes('receivablesLocalInvoiceReport')) {
      this.loading = true;
      this.reportHeading = 'Receivables Local Invoice Report';
      this.getSCustomer();
      this.isDateWise = true;
      this.service.getLocalSalesReceivableReport(-1, -1, -1, -1, -1).subscribe((tabList) => {
        if (tabList.length > 0) {
          this.settings = this.prepareSetting();
          this.tabList = tabList;
          this.invoiceList = [];
          this.tabList.forEach(invoiceItem => {
            const invoiceDetails = new InvoiceDetails();
            invoiceDetails.exchRate = invoiceItem.exchRate;
            invoiceDetails.invCurrCode = invoiceItem.invCurrCode;
            invoiceDetails.invExchRate = invoiceItem.invExchRate;
            invoiceDetails.invoiceDate = invoiceItem.invoiceDate;
            invoiceDetails.invoiceNo = invoiceItem.invoiceId;
            invoiceDetails.netAmountINR = invoiceItem.netAmountINR;
            invoiceDetails.netAmountUSD = (invoiceItem.invCurrCode == "INR" ? '-' : invoiceItem.netAmountUSD);
            invoiceDetails.partyDueDate = invoiceItem.partyDueDate;
            invoiceDetails.partyName = invoiceItem.customerName;
            invoiceDetails.paymentStatus = (invoiceItem.paymentStatus == 'N' ? 'Not Completed' : 'Completed');
            invoiceDetails.remainingDays = invoiceItem.remainingDays;

            this.invoiceList.push(invoiceDetails);
            this.source.load(this.invoiceList);
            //this.invoiceList=[];
          });
        }
        this.loading = false;
      });

    }
  }

  dateFormate(date: Date) {
    const dd = date.getDate();
    const mm = date.getMonth() + 1; // January is 0!
    const yyyy = date.getFullYear();
    return yyyy + '-' + (mm < 10 ? '0' + mm : mm) + '-' + (dd < 10 ? '0' + dd : dd);
  }

  getYearList() {
    const date = new Date();
    let yyyy = date.getFullYear();
    for (let i = 0; i < 10; i++) {
      this.yearList.push(yyyy);
      yyyy--;
    }
  }

  prepareSetting() {
    return {
      hideSubHeader: 'true',
      actions: {
        position: 'right',
        add: false,
        edit: false,
        delete: false,
      },
      pager: {
        display: true,
        perPage: 20,
      },
      selectMode: 'single',
      columns: {
        invoiceNo: {
          title: 'Inv. No.',
          type: 'number',
        },
        // locPurNo: {
        //   title: 'Ord. No.',
        //   type: 'number',
        // },
        invoiceDate: {
          title: 'Inv. Date',
          type: 'text',
        },
        partyName: {
          title: 'Party Name ',
          type: 'text',
        },
        partyDueDate: {
          title: 'Party Due Date',
        },
        // bankDueDate: {
        //   title: 'Bank Due Date',
        // },
        remainingDays: {
          title: 'Remaining Days',
        },
        netAmountINR: {
          title: 'Net Amount(INR)',
          type: 'number'
        },
        netAmountUSD: {
          title: "Net Amount(USD)",
          type: 'number'
        },
        exchRate: {
          title: "Exch Rate",
          type: "number"
        },
        invExchRate: {
          title: "Inv.Exch Rate",
          type: "number"
        },
        paymentStatus: {
          title: 'Payment Status',
          // valuePrepareFunction: (value) => { return value === 'Y' ? 'Completed' : 'Not Completed' }
          // valuePrepareFunction: value => this.getpaymentStatusById(value)
        },
        // stockCurrCode: {
        //   title: 'Stock Currency'
        // },
        invCurrCode: {
          title: 'Invoice Currency'
        }
      }
    };
  }

  prepareSettingPay() {
    return {
      hideSubHeader: 'true',
      actions: {
        position: 'right',
        add: false,
        edit: false,
        delete: false,
      },
      pager: {
        display: true,
        perPage: 20,
      },
      selectMode: 'single',
      columns: {
        invoiceNo: {
          title: 'Inv. No.',
          type: 'number',
        },
        // locPurNo: {
        //   title: 'Ord. No.',
        //   type: 'number',
        // },
        invoiceDate: {
          title: 'Inv. Date',
          type: 'text',
        },
        partyName: {
          title: 'Party Name ',
          type: 'text',
        },
        partyDueDate: {
          title: 'Party Due Date',
        },
        // bankDueDate: {
        //   title: 'Bank Due Date',
        // },
        remainingDays: {
          title: 'Remaining Days',
        },
        netAmountINR: {
          title: 'Net Amount(INR)',
          type: 'number'
        },
        netAmountUSD: {
          title: "Net Amount(USD)",
          type: 'number'
        },
        netAmntByInvExchRate: {
          title: "Net Amt. By Inv. Exch. Rate",
          // type: 'number'
        },
        exchRate: {
          title: "Exch Rate",
          type: "number"
        },
        invExchRate: {
          title: "Inv.Exch Rate",
          type: "number"
        },
        paymentStatus: {
          title: 'Payment Status',
          // valuePrepareFunction: (value) => { return value === 'Y' ? 'Completed' : 'Not Completed' }
          // valuePrepareFunction: value => this.getpaymentStatusById(value)
        },
        // stockCurrCode: {
        //   title: 'Stock Currency'
        // },
        invCurrCode: {
          title: 'Invoice Currency'
        }
      }
    };
  }

  resetTotalCount() {
    this.totalCarets = 0;
    this.totalOrdAmtBase = 0;
    this.totalOrdAmtStock = 0;
    this.totalNP = 0;
    this.totalNetAmount = 0;
  }


  public inBetween(date1, date2) {
    //Get 1 day in milliseconds
    var one_day = 1000 * 60 * 60 * 24;

    // Convert both dates to milliseconds
    var date1_ms = date1.getTime();
    var date2_ms = date2.getTime();

    // Calculate the difference in milliseconds
    var difference_ms = date2_ms - date1_ms;

    // Convert back to days and return
    return Math.round(difference_ms / one_day);
  }

  ConvertToPDF() {
    let doc = new jsPDF('landscape', 'pt'); jpt;
    if (this.router.url.includes('payableImportInvoiceReport')) {
      doc.setFontType('underline');
      doc.text(this.reportHeading, 340, 25);
      doc.setFontSize(10);
      doc.text(this.now(), 720, 20);
      doc.text(this.currentUser, 745, 30);
      var columns = [
        { title: "Inv. No.", dataKey: "invoiceNo" },
        { title: "Ord. No.", dataKey: "locPurNo" },
        { title: "Inv. Date", dataKey: "locPurDate" },
        { title: "Party Name", dataKey: "partyName" },
        { title: "Party Due Date", dataKey: "partyDueDate" },
        { title: "Bank Due Date", dataKey: "bankDueDate" },
        { title: "Remaining Days", dataKey: "remainingDays" },
        { title: "Net Amt.", dataKey: "netAmount" },
        { title: "Payment Status", dataKey: "paymentProcessStatus" },
        { title: "Stock Currency", dataKey: "stockCurrCode" },
        { title: "Invoice Currency", dataKey: "invCurrCode" }
      ];
      doc.autoTable(columns, this.invoiceList, {
        styles: {
          overflow: 'linebreak',
          halign: 'left'
        }
      });
      doc.save(this.reportHeading + '.pdf');
    }
    else if (this.router.url.includes('payableLocalInvoiceReport')) {
      doc.setFontType('underline');
      doc.text(this.reportHeading, 320, 25);
      doc.setFontSize(10);
      doc.text(this.now(), 720, 20);
      doc.text(this.currentUser, 745, 30);
      var columns = [
        { title: "Inv. No.", dataKey: "invoiceNo" },
        { title: "Inv. Date", dataKey: "invoiceDate" },
        { title: "Party Name", dataKey: "partyName" },
        { title: "Party Due Date", dataKey: "partyDueDate" },
        { title: "Remaining Days", dataKey: "remainingDays" },
        { title: "Net Amount(INR)", dataKey: "netAmountINR" },
        { title: "Net Amt. By Inv. Exch. Rate", dataKey: "netAmntByInvExchRate" },
        { title: "Net Amount($)", dataKey: "netAmountUSD" },
        { title: "Exch Rate", dataKey: "exchRate" },
        { title: "Inv.Exch Rate", dataKey: "invExchRate" },
        { title: "Payment Status", dataKey: "paymentStatus" },
        { title: "Invoice Currency", dataKey: "invCurrCode" }
      ];
      doc.autoTable(columns, this.invoiceList, {
        styles: {
          overflow: 'linebreak',
          halign: 'left'
        }
      });
      doc.save(this.reportHeading + '.pdf');
    }
    else if (this.router.url.includes('receivablesExportInvoiceReport')) {
      doc.setFontType('underline');
      doc.text(this.reportHeading, 320, 25);
      doc.setFontSize(10);
      doc.text(this.now(), 720, 20);
      doc.text(this.currentUser, 745, 30);
      var columns = [
        { title: "Inv. No.", dataKey: "invoiceNo" },
        { title: "Inv. Date", dataKey: "invoiceDate" },
        { title: "Party Name", dataKey: "partyName" },
        { title: "Party Due Date", dataKey: "partyDueDate" },
        { title: "Remaining Days", dataKey: "remainingDays" },
        { title: "Net Amount(INR)", dataKey: "netAmountINR" },
        { title: "Net Amount($)", dataKey: "netAmountUSD" },
        { title: "Exch Rate", dataKey: "exchRate" },
        { title: "Inv.Exch Rate", dataKey: "invExchRate" },
        { title: "Payment Status", dataKey: "paymentStatus" },
        { title: "Invoice Currency", dataKey: "invCurrCode" }
      ];
      doc.autoTable(columns, this.invoiceList, {
        styles: {
          overflow: 'linebreak',
          halign: 'left'
        }
      });
      doc.save(this.reportHeading + '.pdf');
    }
    else if (this.router.url.includes('receivablesLocalInvoiceReport')) {
      doc.setFontType('underline');
      doc.text(this.reportHeading, 320, 25);
      doc.setFontSize(10);
      doc.text(this.now(), 720, 20);
      doc.text(this.currentUser, 745, 30);
      var columns = [
        { title: "Inv. No.", dataKey: "invoiceNo" },
        { title: "Inv. Date", dataKey: "invoiceDate" },
        { title: "Party Name", dataKey: "partyName" },
        { title: "Party Due Date", dataKey: "partyDueDate" },
        { title: "Remaining Days", dataKey: "remainingDays" },
        { title: "Net Amount(INR)", dataKey: "netAmountINR" },
        { title: "Net Amount($)", dataKey: "netAmountUSD" },
        { title: "Exch Rate", dataKey: "exchRate" },
        { title: "Inv.Exch Rate", dataKey: "invExchRate" },
        { title: "Payment Status", dataKey: "paymentStatus" },
        { title: "Invoice Currency", dataKey: "invCurrCode" }
      ];
      doc.autoTable(columns, this.invoiceList, {
        styles: {
          overflow: 'linebreak',
          halign: 'left'
        }
      });
      doc.save(this.reportHeading + '.pdf');
    }
  }

  ConvertToCSV() {
    if (this.router.url.includes('receivablesExportInvoiceReport') || this.router.url.includes('receivablesLocalInvoiceReport')) {
      var options = {
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalseparator: '.',
        showLabels: true,
        showTitle: true,
        useBom: true,
        headers: ['Exchange Rate', 'Invoice Currency', 'Invoice Exchange Rate', 'Invoice Date', 'Invoice No.', 'Net Amount(INR)',
          'Net Amount(USD)', 'Bank Due Date', 'Party Name', 'Payment Status', 'Remaining Days'],
        title: this.reportHeading + ',' + '\n' + 'Date ' + ',' + this.now() + ',' + '\n' + 'User' + ',' + this.currentUser
      };
    } else {
      var options = {
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalseparator: '.',
        showLabels: true,
        showTitle: true,
        useBom: true,
        headers: ['Exchange Rate', 'Invoice Currency', 'Invoice Exchange Rate', 'Invoice Date', 'Invoice No.', 'Net Amount(INR)',
          'Net Amount(USD)', '	Net Amt. By Inv. Exch. Rate', 'Bank Due Date', 'Party Name', 'Payment Status', 'Remaining Days'],
        title: this.reportHeading + ',' + '\n' + 'Date ' + ',' + this.now() + ',' + '\n' + 'User' + ',' + this.currentUser
      };
    }
    var heading;
    if (this.router.url.includes('payableImportInvoiceReport')) {
      heading = this.reportHeading;
    } else if (this.router.url.includes('payableLocalInvoiceReport')) {
      heading = this.reportHeading;
    } else if (this.router.url.includes('receivablesExportInvoiceReport')) {
      heading = this.reportHeading;
    } else if (this.router.url.includes('receivablesLocalInvoiceReport')) {
      heading = this.reportHeading;
    }

    // var head = ['Invoice Number', 'Order Number', 'Invoice Date', 'Party Name',
    //   'Party Due Date', 'Bank Due Date', 'Remaining Days', 'Net Amount', 'Payment Status']
    new Angular2Csv(this.invoiceList, heading, options);


  }
  payableLocalInvoice() {
    if (this.isDateWise) {
      const frmDate = new Date(this.fromDate.value);
      const toDte = new Date(this.toDate.value);
      const val = this.inBetween(frmDate, toDte);
      console.log(val);
      if (val > 365) {
        const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
        activeModal.componentInstance.showHide = false;
        activeModal.componentInstance.modalHeader = 'Alert';
        activeModal.componentInstance.modalContent = "you can't fetch data for more than 365 days..!";
        this.loading = false;
      } else {
        this.loading = true;
        this.service.getLocalPurchasePayableReport(this.supplier.value == "" ? -1 : this.supplier.value,
          this.fromDate.value.toString(), this.toDate.value.toString(),
          this.currency.value == "" ? -1 : this.currency.value,
          this.paymentProcess.value == "" ? -1 : this.paymentProcess.value).subscribe((tabList) => {
            if (tabList.length > 0) {
              this.settings = this.prepareSettingPay();
              this.tabList = tabList;
              this.invoiceList = [];
              this.tabList.forEach(invoiceItem => {
                const invoiceDetails = new InvoiceDetails();

                invoiceDetails.exchRate = invoiceItem.exchRate;
                invoiceDetails.invCurrCode = invoiceItem.invCurrCode;
                invoiceDetails.invExchRate = invoiceItem.invExchRate;
                invoiceDetails.invoiceDate = invoiceItem.invoiceDate;
                invoiceDetails.invoiceNo = invoiceItem.invoiceId;
                invoiceDetails.netAmountINR = invoiceItem.netAmountINR;
                invoiceDetails.netAmountUSD = invoiceItem.netAmountUSD;
                invoiceDetails.netAmntByInvExchRate = invoiceItem.netAmntByInvExchRate;
                invoiceDetails.partyDueDate = invoiceItem.partyDueDate;
                invoiceDetails.partyName = invoiceItem.supplierName;
                invoiceDetails.paymentStatus = (invoiceItem.paymentStatus == 'N' ? 'Not Completed' : 'Completed');
                invoiceDetails.remainingDays = invoiceItem.remainingDays;
                // invoiceDetails.locPurId = invoiceItem.expId;
                // invoiceDetails.invoiceNo = invoiceItem.expId;
                // invoiceDetails.locPurDate = invoiceItem.expDate;
                // invoiceDetails.locPurNo = invoiceItem.expNo;
                // invoiceDetails.netAmount = invoiceItem.orderAmountBase;
                // invoiceDetails.paymentProcessStatus = invoiceItem.paymentProcessStatus;
                // invoiceDetails.partyDueDate = invoiceItem.partyDueDate;
                // invoiceDetails.bankDueDate = invoiceItem.cbbDueDate;
                // invoiceDetails.remainingDays = invoiceItem.remainingDays;
                // invoiceDetails.invCurrCode = invoiceItem.invCurrCode;
                // invoiceDetails.partyName = invoiceItem.customerName;
                // invoiceDetails.stockCurrCode = invoiceItem.stockCurrCode;
                // if(invoiceDetails.invCurrCode == 'USD'){
                //   invoiceDetails.netAmount = this.format1(parseFloat(invoiceDetails.netAmount.toString()).toFixed(2),'');
                // }else{
                //   invoiceDetails.netAmount = this.format2(parseFloat(invoiceDetails.netAmount.toString()).toFixed(2),'');
                // }
                this.invoiceList.push(invoiceDetails);
                this.source.load(this.invoiceList);
                //    this.invoiceList=[];
              });
              this.loading = false;
            } else {
              this.invoiceList = [];
              this.source.load(this.invoiceList);
              this.loading = false;
            }
          });
      }

    }
  }


  payableImportInvoice() {
    if (this.isDateWise) {
      const frmDate = new Date(this.fromDate.value);
      const toDte = new Date(this.toDate.value);
      const val = this.inBetween(frmDate, toDte);
      console.log(val);
      if (val > 365) {
        const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
        activeModal.componentInstance.showHide = false;
        activeModal.componentInstance.modalHeader = 'Alert';
        activeModal.componentInstance.modalContent = "you can't fetch data for more than 365 days..!";
        this.loading = false;
      } else {
        this.loading = true;
        this.service.getImportPurchasePayableReport(this.supplier.value == "" ? -1 : this.supplier.value,
          this.fromDate.value.toString(), this.toDate.value.toString(),
          this.currency.value == "" ? -1 : this.currency.value,
          this.paymentProcess.value == "" ? -1 : this.paymentProcess.value).subscribe((tabList) => {
            if (tabList.length > 0) {
              this.settings = this.prepareSettingPay();
              this.tabList = tabList;
              this.invoiceList = [];
              this.tabList.forEach(invoiceItem => {
                const invoiceDetails = new InvoiceDetails();

                invoiceDetails.exchRate = invoiceItem.exchRate;
                invoiceDetails.invCurrCode = invoiceItem.invCurrCode;
                invoiceDetails.invExchRate = invoiceItem.invExchRate;
                invoiceDetails.invoiceDate = invoiceItem.invoiceDate;
                invoiceDetails.invoiceNo = invoiceItem.invoiceId;
                invoiceDetails.netAmountINR = invoiceItem.netAmountINR;
                invoiceDetails.netAmountUSD = invoiceItem.netAmountUSD;
                invoiceDetails.netAmntByInvExchRate = invoiceItem.netAmntByInvExchRate;
                invoiceDetails.partyDueDate = invoiceItem.partyDueDate;
                invoiceDetails.partyName = invoiceItem.supplierName;
                invoiceDetails.paymentStatus = (invoiceItem.paymentStatus == 'N' ? 'Not Completed' : 'Completed');
                invoiceDetails.remainingDays = invoiceItem.remainingDays;
                // invoiceDetails.locPurId = invoiceItem.expId;
                // invoiceDetails.invoiceNo = invoiceItem.expId;
                // invoiceDetails.locPurDate = invoiceItem.expDate;
                // invoiceDetails.locPurNo = invoiceItem.expNo;
                // invoiceDetails.netAmount = invoiceItem.orderAmountBase;
                // invoiceDetails.paymentProcessStatus = invoiceItem.paymentProcessStatus;
                // invoiceDetails.partyDueDate = invoiceItem.partyDueDate;
                // invoiceDetails.bankDueDate = invoiceItem.cbbDueDate;
                // invoiceDetails.remainingDays = invoiceItem.remainingDays;
                // invoiceDetails.invCurrCode = invoiceItem.invCurrCode;
                // invoiceDetails.partyName = invoiceItem.customerName;
                // invoiceDetails.stockCurrCode = invoiceItem.stockCurrCode;
                // if(invoiceDetails.invCurrCode == 'USD'){
                //   invoiceDetails.netAmount = this.format1(parseFloat(invoiceDetails.netAmount.toString()).toFixed(2),'');
                // }else{
                //   invoiceDetails.netAmount = this.format2(parseFloat(invoiceDetails.netAmount.toString()).toFixed(2),'');
                // }
                this.invoiceList.push(invoiceDetails);
                this.source.load(this.invoiceList);
                //    this.invoiceList=[];
              });
              this.loading = false;
            } else {
              this.invoiceList = [];
              this.source.load(this.invoiceList);
              this.loading = false;
            }
          });
      }

    }
  }




  ReceivablesLocalInvoice() {
    if (this.isDateWise) {
      const frmDate = new Date(this.fromDate.value);
      const toDte = new Date(this.toDate.value);
      const val = this.inBetween(frmDate, toDte);
      console.log(val);
      if (val > 365) {
        const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
        activeModal.componentInstance.showHide = false;
        activeModal.componentInstance.modalHeader = 'Alert';
        activeModal.componentInstance.modalContent = "you can't fetch data for more than 365 days..!";
        this.loading = false;
      } else {
        debugger;
        this.service.getLocalSalesReceivableReport(this.supplier.value == "" ? -1 : this.supplier.value,
          this.fromDate.value.toString(), this.toDate.value.toString(),
          this.currency.value == "" ? -1 : this.currency.value,
          this.paymentProcess.value == "" ? -1 : this.paymentProcess.value).subscribe((tabList) => {
            this.invoiceList = [];
            if (tabList.length > 0) {
              this.settings = this.prepareSetting();
              this.tabList = tabList;

              this.tabList.forEach(invoiceItem => {
                const invoiceDetails = new InvoiceDetails();
                invoiceDetails.exchRate = invoiceItem.exchRate;
                invoiceDetails.invCurrCode = invoiceItem.invCurrCode;
                invoiceDetails.invExchRate = invoiceItem.invExchRate;
                invoiceDetails.invoiceDate = invoiceItem.invoiceDate;
                invoiceDetails.invoiceNo = invoiceItem.invoiceId;
                invoiceDetails.netAmountINR = invoiceItem.netAmountINR;
                invoiceDetails.netAmountUSD = (invoiceItem.invCurrCode == "INR" ? '-' : invoiceItem.netAmountUSD);//invoiceItem.netAmountUSD;
                invoiceDetails.partyDueDate = invoiceItem.partyDueDate;
                invoiceDetails.partyName = invoiceItem.customerName;
                invoiceDetails.paymentStatus = (invoiceItem.paymentStatus == 'N' ? 'Not Completed' : 'Completed');
                invoiceDetails.remainingDays = invoiceItem.remainingDays;
                //     invoiceDetails.locPurId = invoiceItem.invoiceId;
                //     invoiceDetails.invoiceNo = invoiceItem.invoiceId;
                //     invoiceDetails.locPurDate = invoiceItem.invoiceDate;
                // //    invoiceDetails.locPurNo = invoiceItem.soNo;
                //     invoiceDetails.netAmount = invoiceItem.payableAmountBase;
                //     invoiceDetails.paymentProcessStatus = invoiceItem.status;
                //     invoiceDetails.partyDueDate = invoiceItem.partyDueDate;
                //     invoiceDetails.bankDueDate = invoiceItem.bankDueDate;
                //     invoiceDetails.remainingDays = invoiceItem.remainingDays;
                //     invoiceDetails.invCurrCode = invoiceItem.invCurrCode;
                //     invoiceDetails.partyName = invoiceItem.customer;
                //     invoiceDetails.stockCurrCode = invoiceItem.stockCurrCode;
                //     if(invoiceDetails.stockCurrCode == 'USD'){
                //       invoiceDetails.netAmount = this.format1(parseFloat(invoiceDetails.netAmount.toString()).toFixed(2),'');
                //     } else{
                //       invoiceDetails.netAmount = this.format2(parseFloat(invoiceDetails.netAmount.toString()).toFixed(2),'');
                //     }
                this.invoiceList.push(invoiceDetails);
                this.source.load(this.invoiceList);
                //   this.invoiceList = [];

              });
              this.loading = false;
            } else {
              this.invoiceList = [];
              this.source.load(this.invoiceList);
              this.loading = false;
            }
          });
      }

    }
  }

  ReceivablesExportInvoice() {
    if (this.isDateWise) {
      const frmDate = new Date(this.fromDate.value);
      const toDte = new Date(this.toDate.value);
      const val = this.inBetween(frmDate, toDte);
      console.log(val);
      if (val > 365) {
        const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
        activeModal.componentInstance.showHide = false;
        activeModal.componentInstance.modalHeader = 'Alert';
        activeModal.componentInstance.modalContent = "you can't fetch data for more than 365 days..!";
        this.loading = false;
      } else {
        this.service.getExportSalesReceivableReport(this.supplier.value == "" ? -1 : this.supplier.value,
          this.fromDate.value.toString(), this.toDate.value.toString(),
          this.currency.value == "" ? -1 : this.currency.value,
          this.paymentProcess.value == "" ? -1 : this.paymentProcess.value).subscribe((tabList) => {
            this.invoiceList = [];
            if (tabList.length > 0) {
              this.settings = this.prepareSetting();
              this.tabList = tabList;

              this.tabList.forEach(invoiceItem => {
                const invoiceDetails = new InvoiceDetails();

                invoiceDetails.exchRate = invoiceItem.exchRate;
                invoiceDetails.invCurrCode = invoiceItem.invCurrCode;
                invoiceDetails.invExchRate = invoiceItem.invExchRate;
                invoiceDetails.invoiceDate = invoiceItem.invoiceDate;
                invoiceDetails.invoiceNo = invoiceItem.invoiceId;
                invoiceDetails.netAmountINR = invoiceItem.netAmountINR;
                invoiceDetails.netAmountUSD =(invoiceItem.invCurrCode == "INR" ? '-' : invoiceItem.netAmountUSD);//invoiceItem.netAmountUSD; invoiceItem.netAmountUSD;
                invoiceDetails.partyDueDate = invoiceItem.partyDueDate;
                invoiceDetails.partyName = invoiceItem.customerName;
                invoiceDetails.paymentStatus = (invoiceItem.paymentStatus == 'N' ? 'Not Completed' : 'Completed');
                invoiceDetails.remainingDays = invoiceItem.remainingDays;
                // invoiceDetails.locPurId = invoiceItem.expId;
                // invoiceDetails.invoiceNo = invoiceItem.expId;
                // invoiceDetails.locPurDate = invoiceItem.expDate;
                // invoiceDetails.locPurNo = invoiceItem.expNo;
                // invoiceDetails.netAmount = invoiceItem.orderAmountBase;
                // invoiceDetails.paymentProcessStatus = invoiceItem.paymentProcessStatus;
                // invoiceDetails.partyDueDate = invoiceItem.partyDueDate;
                // invoiceDetails.bankDueDate = invoiceItem.cbbDueDate;
                // invoiceDetails.remainingDays = invoiceItem.remainingDays;
                // invoiceDetails.invCurrCode = invoiceItem.invCurrCode;
                // invoiceDetails.partyName = invoiceItem.customerName;
                // invoiceDetails.stockCurrCode = invoiceItem.stockCurrCode;
                // if(invoiceDetails.invCurrCode == 'USD'){
                //   invoiceDetails.netAmount = this.format1(parseFloat(invoiceDetails.netAmount.toString()).toFixed(2),'');
                // }else{
                //   invoiceDetails.netAmount = this.format2(parseFloat(invoiceDetails.netAmount.toString()).toFixed(2),'');
                // }
                this.invoiceList.push(invoiceDetails);
                this.source.load(this.invoiceList);
                //  this.invoiceList=[];
              });
              this.loading = false;
            }
            else {
              this.invoiceList = [];
              this.source.load(this.invoiceList);
              this.loading = false;
            }
          });
      }

    }
  }

  createReport() {
    debugger;
    //this.spinnerService.show();
    // this.invoiceList = [];
    // this.source.load(this.invoiceList);
    // this.resetTotalCount();
    this.loading = true;
    if (this.router.url.includes('payableImportInvoiceReport')) {
      //  this.getSupplier();
      this.payableImportInvoice();

    } else if (this.router.url.includes('payableLocalInvoiceReport')) {
      // this.getSupplier();
      this.payableLocalInvoice();
    } else if (this.router.url.includes('receivablesExportInvoiceReport')) {
      this.ReceivablesExportInvoice();
    } else if (this.router.url.includes('receivablesLocalInvoiceReport')) {
      this.ReceivablesLocalInvoice();
    }


  }

  bindData() {

  }

  get ttlCarats(): number {
    return parseFloat(this.getColTotal('carats').toFixed(3));
  }

  get ttlOrdAmtBase(): number {
    return parseFloat(this.getColTotal('grossAmountBase').toFixed(2));
  }
  get ttlOrdAmtStock(): number {
    return parseFloat(this.getColTotal('grossAmountStock').toFixed(2));
  }
  get ttlNP(): number {
    return parseFloat(this.getColTotal('profitBase').toFixed(2));
  }
  get ttlNetAmout(): number {
    return parseFloat(this.getColTotal('netAmount').toFixed(2));
  }
  get ttlNPPer(): number {
    return parseFloat(this.getColTotal('npPer').toFixed(2));
  }
  get ttlAmoutRs(): number {
    return parseFloat(this.getStringColTotal('amountInRs', 'Rs.').toFixed(2));
  }
  getStringColTotal(colName: string, sign: any) {
    let total: number;
    total = 0;
    this.tabList.forEach(row => {
      const a = row[colName].replace(/\,/g, '').split(sign)[1];
      total += parseFloat(a);
    });
    return total;
  }

  getAmtPer(colName: any, sign: any) {
    const a = colName.replace(/\,/g, '').split(sign)[1];
    const per = parseFloat(a);
    return a;
  }
  getColTotal(colName: string) {
    let total: number;
    total = 0;
    this.tabList.forEach(row => {
      total += parseFloat(row[colName]);
    });
    return total;
  }
  get avgSPRate(): number {
    return parseFloat(this.getColTotal('averageSPRate').toFixed(3));
  }
  get avgStockRate(): number {
    // return parseFloat(this.getColTotal('averageStockRate').toFixed(3));
    return parseFloat((this.ttlNetAmout / this.ttlCarats).toFixed(2));//((this.ttlAmout/this.ttlCarats));
  }
  get amt(): number {
    return parseFloat(this.getColTotal('amount').toFixed(3));
  }
  get amtRs(): number {
    return parseFloat(this.getColTotal('amountInRs').toFixed(3));
  }
  get ctsPer(): number {
    return parseFloat(this.getColTotal('ctsPerc').toFixed(3));
  }
  get amtPer(): number {
    return parseFloat(this.getColTotal('amtPerc').toFixed(3));
  }

  finally() {
    this.isLoading = false;
    this.localPurchaseMonthlyInvoiceReportForm.markAsPristine();
  }

  private createForm() {
    this.localPurchaseMonthlyInvoiceReportForm = this.fb.group({
      'month': ['', Validators.required],
      'year': ['', Validators.required],
      'supplier': ['', Validators.required],
      'fromDate': ['', Validators.required],
      'toDate': ['', Validators.required],
      'currency': ['', Validators.required],
      'paymentProcess': ['', Validators.required]
      // 'lotMasterName': ['', Validators.required],
    });

    this.month = this.localPurchaseMonthlyInvoiceReportForm.controls['month'];
    this.year = this.localPurchaseMonthlyInvoiceReportForm.controls['year'];
    this.supplier = this.localPurchaseMonthlyInvoiceReportForm.controls['supplier'];
    this.fromDate = this.localPurchaseMonthlyInvoiceReportForm.controls['fromDate'];
    this.toDate = this.localPurchaseMonthlyInvoiceReportForm.controls['toDate'];
    this.currency = this.localPurchaseMonthlyInvoiceReportForm.controls['currency'];
    this.paymentProcess = this.localPurchaseMonthlyInvoiceReportForm.controls['paymentProcess'];
  }
}
