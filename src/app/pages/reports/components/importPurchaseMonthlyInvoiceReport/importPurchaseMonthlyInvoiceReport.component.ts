import { CommonModalComponent } from '../../../../shared/common-modal/common-modal.component';
import { FormGroup, FormArray, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { AuthenticationService } from '../../../../core/authentication/authentication.service';
import { Logger } from '../../../../core/logger.service';
import { ImportPurchaseMonthlyInvoiceReportService } from './importPurchaseMonthlyInvoiceReport.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
//import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import * as jsPDF from 'jspdf';
import * as jpt from 'jspdf-autotable';

const log = new Logger('localPurchaseMonthlyInvoiceReport');


class InvoiceDetails {
  invId: number;
  purDate: string;
  netAmountBase: number;
  ordNo: number;
  partyName: string;
  disc1: number;
  disc2: number;
  disc3: number;
  brokAmt: number;
  npPer: number;
  grossAmtBase: number;
  grossAmtStock: number;
  invCurrency: string;
  carets: number;
  invExchRate: number;
  profitBase: number;
  // profitBaseByCaret: number;

}

class Supplier {
  supplierId: number;
  supplierName: string;
}

@Component({
  selector: 'importPurchaseMonthlyInvoiceReport',
  templateUrl: './importPurchaseMonthlyInvoiceReport.html',
  styleUrls: ['./importPurchaseMonthlyInvoiceReport.scss'],

})



export class ImportPurchaseMonthlyInvoiceReport implements OnInit {


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
  importPurchaseMonthlyInvoiceReportForm: FormGroup;
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

  invoiceList: InvoiceDetails[] = [];
  settings: any;
  reportStatus: boolean;

  totalCarets: number;
  totalNetAmount: number;
  totalOrdAmtBase: number;
  totalOrdAmtStock: number;
  totalNP: number;
  totalNPPer: number;
  isDateWise: boolean = false;
  reportHeading: String;
  currentUser: String;
  loading: boolean = false;

  public month: AbstractControl;
  public year: AbstractControl;
  public supplier: AbstractControl;
  public fromDate: AbstractControl;
  public toDate: AbstractControl;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private service: ImportPurchaseMonthlyInvoiceReportService,
    private modalService: NgbModal,
    //private spinnerService: Ng4LoadingSpinnerService,
    private authService: AuthenticationService) {
    this.createForm();
    this.getYearList();
    this.reportStatus = true;
    this.settings = this.prepareSetting();
    this.getSupplier();
    this.currentUser = sessionStorage.getItem("loggedUser");

  }
  now(): string {
    const today = new Date();
    const dd = today.getDate();
    const mm = today.getMonth() + 1; //January is 0!
    const yyyy = today.getFullYear();
    const hr = today.getHours();
    const min = today.getMinutes();
    const sec = today.getSeconds();

    return (dd < 10 ? '0' + dd : dd) + '-' + (mm < 10 ? '0' + mm : mm) + '-' + yyyy +' | ' + hr + ':' + min + ':' + sec;
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

  dateFormate(date: Date) {
    const dd = date.getDate();
    const mm = date.getMonth() + 1; // January is 0!
    const yyyy = date.getFullYear();
    return yyyy + '-' + (mm < 10 ? '0' + mm : mm) + '-' + (dd < 10 ? '0' + dd : dd);
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

  bindData() {
    this.tabList.forEach(invoiceItem => {
      const invoiceDetails = new InvoiceDetails();
      invoiceDetails.invId = invoiceItem.invoiceId;
      invoiceDetails.ordNo = invoiceItem.orderId;
      invoiceDetails.carets = invoiceItem.carats;
      invoiceDetails.invCurrency = invoiceItem.currCode;
      invoiceDetails.invExchRate = invoiceItem.invoiceExchRate;
      invoiceDetails.grossAmtBase = invoiceItem.grossAmountBase;
      invoiceDetails.grossAmtStock = invoiceItem.grossAmountStock;
      invoiceDetails.purDate = invoiceItem.invoiceDate;
      invoiceDetails.netAmountBase = invoiceItem.netAmount;
      invoiceDetails.partyName = invoiceItem.partyName;
      invoiceDetails.profitBase = invoiceItem.profitBase;
      // invoiceDetails.profitBaseByCaret = invoiceItem.profitBaseByCarat.toFixed(2);
      invoiceDetails.disc1 = invoiceItem.disc1.toFixed(2);
      invoiceDetails.disc2 = invoiceItem.disc2.toFixed(2);
      invoiceDetails.disc3 = invoiceItem.disc3.toFixed(2);
      invoiceDetails.brokAmt = invoiceItem.brokerage.toFixed(2);
      invoiceDetails.npPer = invoiceItem.npPer.toFixed(2);
      this.invoiceList.push(invoiceDetails);
      this.source.load(this.invoiceList);
      this.loading = false;
      this.reportStatus = false;
      this.totalCarets = this.ttlCarats;
      this.totalOrdAmtBase = this.ttlOrdAmtBase;
      this.totalOrdAmtStock = this.ttlOrdAmtStock;
      this.totalNP = this.ttlNP;
      this.totalNetAmount = this.ttlNetAmout;
      this.totalNPPer = this.ttlNPPer;


    });

  }

  ngOnInit() {
    if (this.router.url.includes('importPurchaseYearlyReport')) {
      this.reportHeading = "Import Purchase Yearly Report";
      this.yearlyStatus = true;
      this.suppStatus = false;
      this.month.setValue(-1);
    } else if (this.router.url.includes('IPPartyInvoiceReport')) {
      this.reportHeading = "Import Purchase Party Invoice Report";
      this.partyId = Number(this.route.snapshot.paramMap.get('partyId'));
      this.yearlyStatus = false;
      this.suppStatus = true;
      this.month.setValue(-1);
      this.year.setValue(-1);
      this.supplier.setValue(this.partyId);
      this.resetTotalCount();
      //this.spinnerService.show();
      this.service.getAllImportPurchaseOrderInvoiceReport(this.partyId, this.month.value, this.year.value).subscribe((tabList) => {
        if (tabList.length > 0) {
          this.tabList = tabList;
          this.bindData();
        }
        //this.spinnerService.hide();
      });

      //set supplier value
    } else if (this.router.url.includes('importPurchaseDateWiseReport')) {
      this.reportHeading = "Import Purchase Date Wise Report";
      this.yearlyStatus = true;
      this.suppStatus = false;
      this.isDateWise = true;

      this.fromDate.setValue(this.dateFormate(new Date()));
      this.toDate.setValue(this.dateFormate(new Date()));

    }

    this.settings = this.prepareSetting();
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
        perPage: 50,
      },
      selectMode: 'single',
      columns: {
        invId: {
          title: 'Inv. No.',
          type: 'number',
        },
        ordNo: {
          title: 'Ord. No.',
          type: 'number',
        },
        purDate: {
          title: 'Inv. Date',
          type: 'text',
        },
        partyName: {
          title: 'Party Name ',
          type: 'text',
        },
        carets: {
          title: 'Total Carats',
        },
        grossAmtBase: {
          title: 'Order Amt. Base',
        },
        grossAmtStock: {
          title: 'Order Amt. Stock',
        },
        disc1: {
          title: 'Discount 1'
        },
        disc2: {
          title: 'Discount 2'
        },
        disc3: {
          title: 'Discount 3'
        },
        brokAmt: {
          title: 'Broak Amt.'
        },
        invCurrency: {
          title: 'Inv. Currency',
        },
        invExchRate: {
          title: 'Exch Rate',
        },
        netAmountBase: {
          title: 'Net Amount'
        },
        profitBase: {
          title: 'NP'
        },
        npPer: {
          title: 'NP %'
        },
        // profitBaseByCaret: {
        //   title: 'NP Per Carats'
        // }
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
  ConvertToPDF() {

    let doc = new jsPDF('landscape', 'pt'); jpt;
    if (this.yearlyStatus) {
      doc.setFontType('underline');
      doc.text(this.reportHeading, 320, 14);
      doc.setFontSize(10);
      doc.text(this.now(), 720, 10);
      doc.text(this.currentUser, 745, 17);
      doc.setLineWidth(0.5);
      doc.line(40, 20, 800, 20);
      doc.text(40, 30, 'Total Carats: ');
      doc.text(this.totalCarets.toString(), 95, 30);
      doc.text(135, 30, 'Total Ord Amt Base: ');
      doc.text(this.totalOrdAmtBase.toFixed(2).toString(), 220, 30);
      doc.text(290, 30, 'Total Ord Amt Stock: ');
      doc.text(this.totalOrdAmtStock.toFixed(2).toString(), 380, 30);
      doc.text(445, 30, 'Total Net Amount: ');
      doc.text(this.totalNetAmount.toFixed(2).toString(), 525, 30);
      doc.text(600, 30, 'Total NP: ');
      doc.text(this.totalNP.toString(), 640, 30);
      doc.text(705, 30, 'Total NP %: ');
      doc.text(this.totalNPPer.toString(), 760, 30);
      doc.setLineWidth(0.5);
      doc.line(40, 35, 800, 35);
      var columns = [
        { title: "Inv. No.", dataKey: "invId" },
        { title: "Ord.", dataKey: "ordNo" },
        { title: "Inv. Date", dataKey: "purDate" },
        { title: "Party Name", dataKey: "partyName" },
        { title: "Total Carat", dataKey: "carets" },
        { title: "Ord. Amt. Base", dataKey: "grossAmtBase" },
        { title: "Ord. Amt. Stock", dataKey: "grossAmtStock" },
        { title: "Dis. 1", dataKey: "disc1" },
        { title: "Dis. 2", dataKey: "disc2" },
        { title: "Disc. 3", dataKey: "disc3" },
        { title: "Bro. Amt.", dataKey: "brokAmt" },
        { title: "Inv. Cur.", dataKey: "invCurrency" },
        { title: "Exc. Rate", dataKey: "invExchRate" },
        { title: "Net Amt.", dataKey: "netAmountBase" },
        { title: "NP", dataKey: "profitBase" },
        { title: "NP %", dataKey: "npPer" },
        // { title: "NP per Carat", dataKey: "profitBaseByCaret" }

      ];
      doc.autoTable(columns, this.invoiceList,{
        styles: {
          overflow: 'linebreak',
          halign: 'left'
        }
      });
      doc.save(this.reportHeading + '.pdf');
    } else if (this.suppStatus) {
      doc.setFontType('underline');
      doc.text(this.reportHeading, 320, 14);
      doc.setFontSize(10);
      doc.text(this.now(), 720, 10);
      doc.text(this.currentUser, 745, 17);
      doc.setLineWidth(0.5);
      doc.line(40, 20, 800, 20);
      doc.text(40, 30, 'Total Carats: ');
      doc.text(this.totalCarets.toString(), 95, 30);
      doc.text(135, 30, 'Total Ord Amt Base: ');
      doc.text(this.totalOrdAmtBase.toFixed(2).toString(), 220, 30);
      doc.text(290, 30, 'Total Ord Amt Stock: ');
      doc.text(this.totalOrdAmtStock.toFixed(2).toString(), 380, 30);
      doc.text(445, 30, 'Total Net Amount: ');
      doc.text(this.totalNetAmount.toFixed(2).toString(), 525, 30);
      doc.text(600, 30, 'Total NP: ');
      doc.text(this.totalNP.toString(), 640, 30);
      doc.text(705, 30, 'Total NP %: ');
      doc.text(this.totalNPPer.toString(), 760, 30);
      doc.setLineWidth(0.5);
      doc.line(40, 35, 800, 35);
      var columns = [
        { title: "Inv. No.", dataKey: "invId" },
        { title: "Ord.", dataKey: "ordNo" },
        { title: "Inv. Date", dataKey: "purDate" },
        { title: "Party Name", dataKey: "partyName" },
        { title: "Total Carat", dataKey: "carets" },
        { title: "Ord. Amt. Base", dataKey: "grossAmtBase" },
        { title: "Ord. Amt. Stock", dataKey: "grossAmtStock" },
        { title: "Dis. 1", dataKey: "disc1" },
        { title: "Dis. 2", dataKey: "disc2" },
        { title: "Disc. 3", dataKey: "disc3" },
        { title: "Bro. Amt.", dataKey: "brokAmt" },
        { title: "Inv. Cur.", dataKey: "invCurrency" },
        { title: "Exc. Rate", dataKey: "invExchRate" },
        { title: "Net Amt.", dataKey: "netAmountBase" },
        { title: "NP", dataKey: "profitBase" },
        { title: "NP %", dataKey: "npPer" },
        // { title: "NP per Carat", dataKey: "profitBaseByCaret" }

      ];
      doc.autoTable(columns, this.invoiceList,{
        styles: {
          overflow: 'linebreak',
          halign: 'left'
        }
      });
      doc.save(this.reportHeading + '.pdf');
    } else {
      this.reportHeading= 'Import Purchase Monthly Invoice Report';
      doc.setFontType('underline');
      doc.text(this.reportHeading, 320, 14);
      doc.setFontSize(10);
      doc.text(this.now(), 720, 10);
      doc.text(this.currentUser, 745, 17);
      doc.setLineWidth(0.5);
      doc.line(40, 20, 800, 20);
      doc.text(40, 30, 'Total Carats: ');
      doc.text(this.totalCarets.toString(), 95, 30);
      doc.text(135, 30, 'Total Ord Amt Base: ');
      doc.text(this.totalOrdAmtBase.toFixed(2).toString(), 220, 30);
      doc.text(290, 30, 'Total Ord Amt Stock: ');
      doc.text(this.totalOrdAmtStock.toFixed(2).toString(), 380, 30);
      doc.text(445, 30, 'Total Net Amount: ');
      doc.text(this.totalNetAmount.toFixed(2).toString(), 525, 30);
      doc.text(600, 30, 'Total NP: ');
      doc.text(this.totalNP.toString(), 640, 30);
      doc.text(705, 30, 'Total NP %: ');
      doc.text(this.totalNPPer.toString(), 760, 30);
      doc.setLineWidth(0.5);
      doc.line(40, 35, 800, 35);
      var columns = [
        { title: "Inv. No.", dataKey: "invId" },
        { title: "Ord.", dataKey: "ordNo" },
        { title: "Inv. Date", dataKey: "purDate" },
        { title: "Party Name", dataKey: "partyName" },
        { title: "Total Carat", dataKey: "carets" },
        { title: "Ord. Amt. Base", dataKey: "grossAmtBase" },
        { title: "Ord. Amt. Stock", dataKey: "grossAmtStock" },
        { title: "Dis. 1", dataKey: "disc1" },
        { title: "Dis. 2", dataKey: "disc2" },
        { title: "Disc. 3", dataKey: "disc3" },
        { title: "Bro. Amt.", dataKey: "brokAmt" },
        { title: "Inv. Cur.", dataKey: "invCurrency" },
        { title: "Exc. Rate", dataKey: "invExchRate" },
        { title: "Net Amt.", dataKey: "netAmountBase" },
        { title: "NP", dataKey: "profitBase" },
        { title: "NP %", dataKey: "npPer" },
        // { title: "NP per Carat", dataKey: "profitBaseByCaret" }

      ];
      doc.autoTable(columns, this.invoiceList,{
        styles: {
          overflow: 'linebreak',
          halign: 'left'
        }
      });
      doc.save(this.reportHeading + '.pdf');
    }
  }
  ConvertToCSV() {

    var heading;
    if (this.router.url.includes('importPurchaseDateWiseReport')) {
      var options = {
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalseparator: '.',
        showLabels: true,
        showTitle: true,
        useBom: true,
        headers: ['Inv. No.', 'Ord. No.', 'Total Carats', 'Inv. Currency',
        'Exch Rate', 'Order Amt. Base', 'Order Amt. Stock', 'Inv. Date', 'Net Amount',
        'Party Name', 'NP',  'Discount 1', 'Discount 2', 'Discount 3',
        'Broak Amt.', 'NP %'],
        title: 'Import Purchase - DateWise Report' + ',' + '\n' + 'Date ' + ',' + this.now() + ',' + '\n' + 'User' + ',' + this.currentUser
      };
      heading = 'Import Purchase - DateWise' + ',' + this.currentUser;
    }
    else if (this.yearlyStatus) {
      var options = {
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalseparator: '.',
        showLabels: true,
        showTitle: true,
        useBom: true,
        headers: ['Inv. No.', 'Ord. No.', 'Total Carats', 'Inv. Currency',
        'Exch Rate', 'Order Amt. Base', 'Order Amt. Stock', 'Inv. Date', 'Net Amount',
        'Party Name', 'NP',  'Discount 1', 'Discount 2', 'Discount 3',
        'Broak Amt.', 'NP %'],
        title: 'Import Purchase - Yearly Report' + ',' + '\n' + 'Date ' + ',' + this.now() + ',' + '\n' + 'User' + ',' + this.currentUser
      };
      heading = 'Import Purchase - Yearly' + ',' + this.currentUser;
    } else if (this.suppStatus) {
      var options = {
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalseparator: '.',
        showLabels: true,
        showTitle: true,
        useBom: true,
        headers: ['Inv. No.', 'Ord. No.', 'Total Carats', 'Inv. Currency',
        'Exch Rate', 'Order Amt. Base', 'Order Amt. Stock', 'Inv. Date', 'Net Amount',
        'Party Name', 'NP',  'Discount 1', 'Discount 2', 'Discount 3',
        'Broak Amt.', 'NP %'],
        title: 'Import Purchase - Supplier Report' + ',' + '\n' + 'Date ' + ',' + this.now() + ',' + '\n' + 'User' + ',' + this.currentUser
      };
      heading = 'Import Purchase - Supplier' + ',' + this.currentUser;
    } else {
      var options = {
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalseparator: '.',
        showLabels: true,
        showTitle: true,
        useBom: true,
        headers: ['Inv. No.', 'Ord. No.', 'Total Carats', 'Inv. Currency',
        'Exch Rate', 'Order Amt. Base', 'Order Amt. Stock', 'Inv. Date', 'Net Amount',
        'Party Name', 'NP',  'Discount 1', 'Discount 2', 'Discount 3',
        'Broak Amt.', 'NP %'],
        title: 'Import Purchase - Monthly Report' + ',' + '\n' + 'Date ' + ',' + this.now() + ',' + '\n' + 'User' + ',' + this.currentUser
      };
      heading = 'Import Purchase - Monthly' + ',' + this.currentUser;
    }

    
    new Angular2Csv(this.invoiceList, heading, options);


  }
  createReport() {
    this.loading = true;
    //this.spinnerService.show();
    this.invoiceList = [];
    this.source.load(this.invoiceList);
    this.loading = false;
    this.resetTotalCount();
    this.loading = true;
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
        this.service.getExportSalesInvoiceReportBySupplierIdAndBetweenDates(this.supplier.value == "" ? -1 : this.supplier.value,
          this.fromDate.value.toString(), this.toDate.value.toString()).subscribe((tabList) => {
            if (tabList.length > 0) {
              this.tabList = tabList;
              this.bindData();
            }
            //this.spinnerService.hide();
            this.loading = false;
          });
      }
      // this.bindData();
    } else {
      this.service.getAllImportPurchaseOrderInvoiceReport(this.supplier.value == "" ? -1 : this.supplier.value, this.month.value, this.year.value).subscribe((tabList) => {
        if (tabList.length > 0) {
          this.tabList = tabList;
          this.bindData();
          // this.tabList.forEach(invoiceItem => {
          //   const invoiceDetails = new InvoiceDetails();
          //   invoiceDetails.invId = invoiceItem.invoiceId;
          //   invoiceDetails.ordNo = invoiceItem.orderId;
          //   invoiceDetails.carets = invoiceItem.carats;
          //   invoiceDetails.invCurrency = invoiceItem.currCode;
          //   invoiceDetails.invExchRate = invoiceItem.invoiceExchRate;
          //   invoiceDetails.grossAmtBase = invoiceItem.grossAmountBase;
          //   invoiceDetails.grossAmtStock = invoiceItem.grossAmountStock;
          //   invoiceDetails.purDate = invoiceItem.invoiceDate;
          //   invoiceDetails.netAmountBase = invoiceItem.netAmount;
          //   invoiceDetails.partyName = invoiceItem.partyName;
          //   invoiceDetails.profitBase = invoiceItem.profitBase;
          //   invoiceDetails.profitBaseByCaret = invoiceItem.profitBaseByCarat.toFixed(2);
          //   invoiceDetails.disc1 = invoiceItem.disc1.toFixed(2);
          //   invoiceDetails.disc2 = invoiceItem.disc2.toFixed(2);
          //   invoiceDetails.disc3 = invoiceItem.disc3.toFixed(2);
          //   invoiceDetails.brokAmt = invoiceItem.brokerage.toFixed(2);
          //   invoiceDetails.npPer = invoiceItem.npPer.toFixed(2);//Number((invoiceItem.netAmount/invoiceItem.profitBase).toFixed(2));
          //   this.invoiceList.push(invoiceDetails);
          //   this.source.load(this.invoiceList);
          //   this.reportStatus = false;
          //   this.totalCarets = this.ttlCarats;
          //   this.totalOrdAmtBase = this.ttlOrdAmtBase;
          //   this.totalOrdAmtStock = this.ttlOrdAmtStock;
          //   this.totalNP = this.ttlNP;
          //   this.totalNetAmount = this.ttlNetAmout;
          //   this.totalNPPer = this.ttlNPPer;


          // });
        }
        this.loading = false;
        //this.spinnerService.hide();
      });
    }
  }
  get ttlNPPer(): number {
    return parseFloat(this.getColTotal('npPer').toFixed(2));
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
    this.importPurchaseMonthlyInvoiceReportForm.markAsPristine();
  }

  private createForm() {
    this.importPurchaseMonthlyInvoiceReportForm = this.fb.group({
      'month': ['', Validators.required],
      'year': ['', Validators.required],
      'supplier': ['', ''],
      'fromDate': ['', Validators.required],
      'toDate': ['', Validators.required],
      // 'lotMasterName': ['', Validators.required],
    });

    this.month = this.importPurchaseMonthlyInvoiceReportForm.controls['month'];
    this.year = this.importPurchaseMonthlyInvoiceReportForm.controls['year'];
    this.supplier = this.importPurchaseMonthlyInvoiceReportForm.controls['supplier'];
    this.fromDate = this.importPurchaseMonthlyInvoiceReportForm.controls['fromDate'];
    this.toDate = this.importPurchaseMonthlyInvoiceReportForm.controls['toDate'];
  }
}
