import { CommonModalComponent } from '../../../../shared/common-modal/common-modal.component';
import { FormGroup, FormArray, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { AuthenticationService } from '../../../../core/authentication/authentication.service';
import { Logger } from '../../../../core/logger.service';
import { ImportPurchaseSupplierInvoiceReportService } from './importPurchaseSupplierInvoiceReport.service';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
//import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import * as jsPDF from 'jspdf';
import * as jpt from 'jspdf-autotable';

const log = new Logger('localPurchaseSupplierInvoiceReport');

class InvoiceDetails {
  partyName: string;
  partyId: number;
  carets: number;
  netAmountBase: number;
  grossAmtBase: number;
  grossAmtStock: number;
  npPer: number;
  profitBase: number;
  // profitBaseByCaret: number;
}


class Supplier {
  supplierId: number;
  supplierName: string;
}

@Component({
  selector: 'importPurchaseSupplierInvoiceReport',
  templateUrl: './importPurchaseSupplierInvoiceReport.html',
  styleUrls: ['./importPurchaseSupplierInvoiceReport.scss'],

})
export class ImportPurchaseSupplierInvoiceReport implements OnInit {

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
  importPurchaseSupplierInvoiceReportForm: FormGroup;
  source: LocalDataSource = new LocalDataSource();

  yearList: any[] = [];
  selectedCat: any;
  name: string;
  tabList: any[] = [];
  params: any[] = [];

  invoiceList: InvoiceDetails[] = [];
  supplierList: Supplier[] = [];
  settings: any;
  reportStatus: boolean;
  totalCarets: number;
  totalNetAmount: number;
  totalOrdAmtBase: number;
  totalOrdAmtStock: number;
  totalNP: number;
  reportHeading: String;
  currentUser: String;
  loading: boolean = false;

  public month: AbstractControl;
  public year: AbstractControl;
  public supplier: AbstractControl;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private service: ImportPurchaseSupplierInvoiceReportService,
    //private spinnerService: Ng4LoadingSpinnerService,
    private authService: AuthenticationService) {
    this.loading = true;
    this.createForm();
    this.getYearList();
    debugger
    this.service.getAllSupplierByType('SU').subscribe((objList) => {
      objList.forEach(ele => {
        const supplier = new Supplier();
        supplier.supplierId = ele.partyId;
        supplier.supplierName = ele.partyName;
        this.supplierList.push(supplier);
      });
    });
    this.currentUser = sessionStorage.getItem("loggedUser");
    this.reportStatus = true;
    this.settings = this.prepareSetting();

    this.invoiceList = [];
    this.source.load(this.invoiceList);
    this.loading = false;
    this.resetTotalCount();
    //this.spinnerService.show();
    this.service.getConsolidatedImportPurchaseOrderInvoiceReport(-1, -1, -1).subscribe((tabList) => {

      this.tabList = tabList;
      this.tabList.forEach(invoiceItem => {
        const invoiceDetails = new InvoiceDetails();
        invoiceDetails.partyName = invoiceItem.partyName;
        invoiceDetails.carets = invoiceItem.carats;
        invoiceDetails.grossAmtBase = invoiceItem.grossAmountBase;
        invoiceDetails.grossAmtStock = invoiceItem.grossAmountStock;
        invoiceDetails.netAmountBase = invoiceItem.netAmount;
        invoiceDetails.profitBase = invoiceItem.profitBase;
        // invoiceDetails.profitBaseByCaret = invoiceItem.profitBaseByCarat.toFixed(2);
        invoiceDetails.partyId = invoiceItem.partyId;

        this.invoiceList.push(invoiceDetails);
        this.source.load(this.invoiceList);
        this.loading = false;
        this.reportStatus = false;
        this.totalCarets = this.ttlCarats;
        this.totalOrdAmtBase = this.ttlOrdAmtBase;
        this.totalOrdAmtStock = this.ttlOrdAmtStock;
        this.totalNP = this.ttlNP;
        this.totalNetAmount = this.ttlNetAmout;
      });

      //this.spinnerService.hide();
    });


  }

  ngOnInit() {
    this.settings = this.prepareSetting();
    this.reportHeading = 'Import Purchase Supplier Report';

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

        partyName: {
          title: 'Party Name ',
          type: 'text',
        },
        carets: {
          title: 'Carats',
        },
        grossAmtBase: {
          title: 'Order Amt. Base',
        },
        grossAmtStock: {
          title: 'Order Amt. Stock',
        },
        netAmountBase: {
          title: 'Net Amount'
        },
        profitBase: {
          title: 'NP'
        }
        // profitBaseByCaret: {
        //   title: 'NP Per Carats'
        // }
      }
    };
  }

  onUserRowSelect(event: any) {
    console.log(event);
    this.router.navigate(['../IPPartyInvoiceReport', event.data.partyId], { relativeTo: this.route });

  }

  resetTotalCount() {
    this.totalCarets = 0;
    this.totalOrdAmtBase = 0;
    this.totalOrdAmtStock = 0;
    this.totalNP = 0;
    this.totalNetAmount = 0;
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
  ConvertToPDF(){
    let doc = new jsPDF('landscape', 'pt'); jpt;
    doc.setFontType('underline');
    doc.text(this.reportHeading, 320, 14);
    doc.setFontSize(10);
    doc.text(this.now(), 720, 10);
    doc.text(this.currentUser, 745, 17);
    doc.setLineWidth(0.5);
    doc.line(40, 20, 800, 20);
    doc.text(40, 30, 'Total Carats: ');
    doc.text(this.totalCarets.toString(), 95, 30);
    doc.text(165, 30, 'Total Ord Amt Base: ');
    doc.text(this.totalOrdAmtBase.toFixed(2).toString(), 250, 30);
    doc.text(345, 30, 'Total Ord Amt Stock: ');
    doc.text(this.totalOrdAmtStock.toFixed(2).toString(), 435, 30);
    doc.text(510, 30, 'Total Net Amount: ');
    doc.text(this.totalNetAmount.toFixed(2).toString(), 590, 30);
    doc.text(675, 30, 'Total NP: ');
    doc.text(this.totalNP.toString(), 720, 30);
    doc.setLineWidth(0.5);
    doc.line(40, 35, 800, 35);
    var columns = [
      { title: "Party Name", dataKey: "partyName" },
      // { title: "Party ID", dataKey: "partyId"},
      { title: "Total Carats", dataKey: "carets" },
      { title: "Order Amount Base", dataKey: "grossAmtBase" },
      { title: "Order Amount Stock", dataKey: "grossAmtStock" },
      { title: "Net Amount", dataKey: "netAmountBase" },
      { title: "NP", dataKey: "profitBase" },

      // { title: "NP per Carats", dataKey: "profitBaseByCaret" }
    ];
    debugger
    doc.autoTable(columns, this.invoiceList,{
      styles: {
        overflow: 'linebreak',
        halign: 'left'
      }
    });
    debugger
    doc.save(this.reportHeading + '.pdf');
  }
  ConvertToCSV() {
  
    var options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      showTitle: true,
      useBom: true,
      headers: ['Party Name', 'Carets', 'Order Amt. Base', 'Order Amt. Stock',
      'Net Amount', 'NP',  'PartyID'],
      title: 'Import Purchase - Supplier Report' + ',' + '\n' + 'Date ' + ',' + this.now() + ',' + '\n' + 'User' + ',' + this.currentUser
    };

    new Angular2Csv(this.invoiceList, 'Import Purchase - Supplier', options );


  }

  createReport() {
    //this.spinnerService.show();
    this.invoiceList = [];
    this.source.load(this.invoiceList);
    this.loading = false;
    this.resetTotalCount();
    this.loading = true;
    this.service.getConsolidatedImportPurchaseOrderInvoiceReport(this.supplier.value == "" ? -1 : this.supplier.value,
      this.month.value == "" ? -1 : this.month.value,
      this.year.value == "" ? -1 : this.year.value).subscribe((tabList) => {
        //if(tabList.length > 0) {
        this.tabList = tabList;
        this.tabList.forEach(invoiceItem => {
          const invoiceDetails = new InvoiceDetails();
          invoiceDetails.partyName = invoiceItem.partyName;
          invoiceDetails.carets = invoiceItem.carats;
          invoiceDetails.grossAmtBase = invoiceItem.grossAmountBase;
          invoiceDetails.grossAmtStock = invoiceItem.grossAmountStock;
          invoiceDetails.netAmountBase = invoiceItem.netAmount;
          invoiceDetails.profitBase = invoiceItem.profitBase;
          // invoiceDetails.profitBaseByCaret = invoiceItem.profitBaseByCarat.toFixed(2);
          invoiceDetails.partyId = invoiceItem.partyId;
  
          this.invoiceList.push(invoiceDetails);
          this.source.load(this.invoiceList);
          this.reportStatus = false;
          this.totalCarets = this.ttlCarats;
          this.totalOrdAmtBase = this.ttlOrdAmtBase;
          this.totalOrdAmtStock = this.ttlOrdAmtStock;
          this.totalNP = this.ttlNP;
          this.totalNetAmount = this.ttlNetAmout;

        });
        //this.spinnerService.hide();
        this.loading = false;
      });
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
    this.importPurchaseSupplierInvoiceReportForm.markAsPristine();
  }

  private createForm() {
    this.importPurchaseSupplierInvoiceReportForm = this.fb.group({
      'month': ['', Validators.required],
      'year': ['', Validators.required],
      'supplier': ['', '']
      // 'lotMasterName': ['', Validators.required],
    });

    this.month = this.importPurchaseSupplierInvoiceReportForm.controls['month'];
    this.year = this.importPurchaseSupplierInvoiceReportForm.controls['year'];
    this.supplier = this.importPurchaseSupplierInvoiceReportForm.controls['supplier'];

  }
}
