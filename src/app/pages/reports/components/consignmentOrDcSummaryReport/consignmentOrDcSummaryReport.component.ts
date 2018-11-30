import { CommonModalComponent } from '../../../../shared/common-modal/common-modal.component';
import { FormGroup, FormArray, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { AuthenticationService } from '../../../../core/authentication/authentication.service';
import { Logger } from '../../../../core/logger.service';
import { ConsignmentOrDcSummaryReportService } from './consignmentOrDcSummaryReport.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
//import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import * as jsPDF from 'jspdf';
import * as jpt from 'jspdf-autotable';

const log = new Logger('localPurchaseMonthlyInvoiceReport');



@Component({
  selector: 'consignmentOrDcSummaryReport',
  templateUrl: './consignmentOrDcSummaryReport.html',
  styleUrls: ['./consignmentOrDcSummaryReport.scss'],

})



export class ConsignmentOrDcSummaryReport implements OnInit {


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

  movementsReportForm: FormGroup;
  source: LocalDataSource = new LocalDataSource();



  tabList: any[] = [];
  settings: any;
  totalCarets: number = 0;
  avgStockRate: number = 0;
  avgSalesPrice: number = 0;
  stockAmtUSD: number = 0;
  stockAmtINR: number = 0;
  salesPriceUSD: number = 0;
  salesPriceINR: number = 0;
  reportHeading: String;
  currentUser: String;
  loading: boolean = false;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private service: ConsignmentOrDcSummaryReportService,
    private modalService: NgbModal,
    //private spinnerService: Ng4LoadingSpinnerService,
    private authService: AuthenticationService) {
    this.loading = true;
    this.createForm();
    this.currentUser = sessionStorage.getItem("loggedUser");


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
        perPage: 10,
      },
      selectMode: 'single',
      columns: {
        lotName: {
          title: 'Lot',
          type: 'text',
        },

        totalCarats: {
          title: 'Total Carats',
          type: 'number',
        },
        salePrice: {
          title: 'Avg. Selling Price',
          type: 'number',
        },
        stockRate: {
          title: 'Avg. Stock Rate',
          type: 'number',
        },
        exchRate: {
          title: 'Exchange Rate',
          type: 'number',
        },

        amountSpUSD: {
          title: 'Selling Price (USD)',
          type: 'number',
        },
        amountSpINR: {
          title: 'Selling Price (INR)',
          type: 'number',
        },
        amountSrUSD: {
          title: 'Stock Rate (USD)',
          type: 'number',
        },
        amountSrINR: {
          title: 'Stock Rate (INR)',
          type: 'number',
        }

      }
    };
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


  ngOnInit() {


    if (this.router.url.includes('dcSummaryReport')) {
      this.reportHeading = "DC SUMMARY REPORT";
      this.settings = this.prepareSetting();
      this.service.getConsignmentOrDcSummayByConsignmentStatus('N').subscribe(res => {
        this.tabList = res;
        this.totalCarets = this.ttlCarates;
        this.avgStockRate = this.avgSRStockRate;
        this.stockAmtUSD = this.ttlstockAmtUSD;
        this.stockAmtINR = this.ttlstockAmtINR;
        this.salesPriceUSD = this.ttlsalesPriceUSD;
        this.salesPriceINR = this.ttlsalesPriceINR;
        res.forEach(ele => {
          ele.amountSpINR = this.format2(parseFloat(ele.amountSpINR.toString()).toFixed(2), '');
          ele.amountSpUSD = this.format1(parseFloat(ele.amountSpUSD.toString()).toFixed(2), '');
          ele.amountSrINR = this.format2(parseFloat(ele.amountSrINR.toString()).toFixed(2), '');
          ele.amountSrUSD = this.format1(parseFloat(ele.amountSrUSD.toString()).toFixed(2), '');
        })
        this.source.load(res);
        this.loading = false;
      })

    } else if (this.router.url.includes('consignmentSummayReport')) {
      this.reportHeading = "CONSIGNMENT SUMMARY REPORT"
      this.settings = this.prepareSetting();
      this.service.getConsignmentOrDcSummayByConsignmentStatus('Y').subscribe(res => {
        this.tabList = res;
        this.totalCarets = this.ttlCarates;
        this.avgStockRate = this.avgSRStockRate;
        this.stockAmtUSD = this.ttlstockAmtUSD;
        this.stockAmtINR = this.ttlstockAmtINR;
        this.salesPriceUSD = this.ttlsalesPriceUSD;
        this.salesPriceINR = this.ttlsalesPriceINR;
        res.forEach(ele => {
          ele.salePrice = this.format1(parseFloat(ele.salePrice.toString()).toFixed(2), '');
          ele.stockRate = this.format1(parseFloat(ele.stockRate.toString()).toFixed(2), '');
          ele.amountSpINR = this.format2(parseFloat(ele.amountSpINR.toString()).toFixed(2), '');
          ele.amountSpUSD = this.format1(parseFloat(ele.amountSpUSD.toString()).toFixed(2), '');
          ele.amountSrINR = this.format2(parseFloat(ele.amountSrINR.toString()).toFixed(2), '');
          ele.amountSrUSD = this.format1(parseFloat(ele.amountSrUSD.toString()).toFixed(2), '');
        })
        this.source.load(res);
        this.loading = false;
      })

    } else if (this.router.url.includes('ReceivablesExportInvoice')) {


    } else if (this.router.url.includes('ReceivablesLocalInvoice')) {

    }
  }

  get ttlCarates(): number {
    return parseFloat(this.getColTotal('totalCarats').toFixed(3));
  }

  get ttlsaleAmountUSD(): number {
    return parseFloat(this.getColTotal('amountSpUSD').toFixed(3));
  }

  get ttlstockAmtINR(): number {
    return parseFloat(this.getColTotal('amountSrINR').toFixed(3));
  }

  get ttlsalesPriceUSD(): number {
    return parseFloat(this.getColTotal('amountSpUSD').toFixed(3));
  }

  get ttlsalesPriceINR(): number {
    return parseFloat(this.getColTotal('amountSpINR').toFixed(3));
  }

  get ttlstockAmtUSD(): number {
    return parseFloat(this.getColTotal('amountSrUSD').toFixed(3));
  }

  get ttlSRAmout(): number {
    return parseFloat(this.getColTotal('amountSrUSD').toFixed(3));
  }

  get avgSRStockRate(): number {
    return parseFloat((this.ttlSRAmout / this.ttlCarates).toFixed(2));//((this.ttlAmout/this.ttlCarats));
  }

  getColTotal(colName: string) {
    let total: number;
    total = 0;
    this.tabList.forEach(row => {
      total += parseFloat(row[colName]);
    });
    return total;
  }


  today(): string {
    const today = new Date();
    const dd = today.getDate();
    const mm = today.getMonth() + 1; //January is 0!

    const yyyy = today.getFullYear();
    return yyyy + '-' + (mm < 10 ? '0' + mm : mm) + '-' + (dd < 10 ? '0' + dd : dd);
  }

  ConvertToPDF() {

    let doc = new jsPDF('landscape', 'pt'); jpt;
    if (this.router.url.includes('dcSummaryReport')) {
      doc.setFontType('underline');
      doc.text(this.reportHeading, 340, 14);
      doc.setFontSize(10);
      doc.text(this.now(), 720, 10);
      doc.text(this.currentUser, 745, 17);
      doc.setLineWidth(0.5);
      doc.line(40, 20, 800, 20);
      doc.text(40, 30, 'Total Carats: ');
      doc.text(this.totalCarets.toString(), 95, 30);
      doc.text(150, 30, 'Avg. Stock Rate: ');
      doc.text(this.avgStockRate.toFixed(1).toString(), 220, 30);
      doc.text(280, 30, 'Stock Amt($): ');
      doc.text(this.stockAmtUSD.toFixed(3).toString(), 340, 30);
      doc.text(410, 30, 'Stock Amt(INR): ');
      doc.text(this.stockAmtINR.toFixed(3).toString(), 480, 30);
      doc.text(565, 30, 'Sale Amt($): ');
      doc.text(this.salesPriceUSD.toString(), 620, 30);
      doc.text(680, 30, 'Sale Amt(INR): ');
      doc.text(this.salesPriceINR.toString(), 745, 30);
      doc.setLineWidth(0.5);
      doc.line(40, 35, 800, 35);
      var columns = [
        { title: "Lot Name", dataKey: "lotName" },
        { title: "Total Carats", dataKey: "totalCarats" },
        { title: "Avg. Selling Price", dataKey: "salePrice" },
        { title: "Avg. Stock Report", dataKey: "stockRate" },
        { title: "Exchange Rate", dataKey: "exchRate" },
        { title: "Selling Price(USD)", dataKey: "amountSpUSD" },

        { title: "Selling Price(INR)", dataKey: "amountSpINR" },
        { title: "Stock Rate(USD)", dataKey: "amountSrUSD" },
        { title: "Stock Rate(INR)", dataKey: "amountSrINR" }
      ];
      doc.autoTable(columns, this.tabList, {
        styles: {
          overflow: 'linebreak',
          halign: 'left'
        }
      });
      doc.save(this.reportHeading + '.pdf');
    }
    else if (this.router.url.includes('consignmentSummayReport')) {
      doc.setFontType('underline');
      doc.text(this.reportHeading, 320, 14);
      doc.setFontSize(10);
      doc.text(this.now(), 720, 10);
      doc.text(this.currentUser, 745, 17);
      doc.setLineWidth(0.5);
      doc.line(40, 20, 800, 20);
      doc.text(40, 30, 'Total Carats: ');
      doc.text(this.totalCarets.toString(), 95, 30);
      doc.text(150, 30, 'Avg. Stock Rate: ');
      doc.text(this.avgStockRate.toFixed(1).toString(), 220, 30);
      doc.text(280, 30, 'Stock Amt($): ');
      doc.text(this.stockAmtUSD.toFixed(3).toString(), 340, 30);
      doc.text(410, 30, 'Stock Amt(INR): ');
      doc.text(this.stockAmtINR.toFixed(3).toString(), 480, 30);
      doc.text(565, 30, 'Sale Amt($): ');
      doc.text(this.salesPriceUSD.toString(), 620, 30);
      doc.text(680, 30, 'Sale Amt(INR): ');
      doc.text(this.salesPriceINR.toString(), 745, 30);
      doc.setLineWidth(0.5);
      doc.line(40, 35, 800, 35);
      var columns = [
        { title: "Lot Name", dataKey: "lotName" },
        { title: "Total Carats", dataKey: "totalCarats" },
        { title: "Avg. Selling Price", dataKey: "salePrice" },
        { title: "Avg. Stock Report", dataKey: "stockRate" },
        { title: "Exchange Rate", dataKey: "exchRate" },
        { title: "Selling Price(USD)", dataKey: "amountSpUSD" },

        { title: "Selling Price(INR)", dataKey: "amountSpINR" },
        { title: "Stock Rate(USD)", dataKey: "amountSrUSD" },
        { title: "Stock Rate(INR)", dataKey: "amountSrINR" }
      ];
      doc.autoTable(columns, this.tabList, {
        styles: {
          overflow: 'linebreak',
          halign: 'left'
        }
      });
      doc.save(this.reportHeading + '.pdf');
    }
  }

  ConvertToCSV() {
    debugger
    if (this.router.url.includes('dcSummaryReport')) {

      var options = {
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalseparator: '.',
        showLabels: true,
        showTitle: true,
        useBom: true,
        headers: ['Lot Name', 'Lot Id', 'Total Carats', 'Avg. Selling Price', 'Avg. Stock Rate', 'Exchange Rate',
          'Selling Price (USD)', 'Selling Price (INR)', 'Stock Rate (USD)', 'Stock Rate (INR)'],
        title: 'DC Summary Report' + ',' + '\n' + 'Date ' + ',' + this.today() + ',' + '\n' + 'User' + ',' + this.currentUser
      };


      new Angular2Csv(this.tabList, 'DC Summary Report', options);

    } else if (this.router.url.includes('consignmentSummayReport')) {

      var options = {
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalseparator: '.',
        showLabels: true,
        showTitle: true,
        useBom: true,
        headers: ['Lot Name', 'Lot Id', 'Total Carats', 'Avg. Selling Price', 'Avg. Stock Rate', 'Exchange Rate',
          'Selling Price (USD)', 'Selling Price (INR)', 'Stock Rate (USD)', 'Stock Rate (INR)'],
        title: 'Consignment Summary Report' + ',' + '\n' + 'Date ' + ',' + this.today() + ',' + '\n' + 'User' + ',' + this.currentUser
      };


      new Angular2Csv(this.tabList, 'Consignment Summary Report', options);
    }

  }


  finally() {
    //  this.isLoading = false;
    this.movementsReportForm.markAsPristine();
  }

  private createForm() {
    this.movementsReportForm = this.fb.group({


    });



  }
}
