import { CommonModalComponent } from '../../../../shared/common-modal/common-modal.component';
import { FormGroup, FormArray, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { AuthenticationService } from '../../../../core/authentication/authentication.service';
import { Logger } from '../../../../core/logger.service';
import { MovementsReportService } from './movementsReport.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
//import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import * as jsPDF from 'jspdf';
import * as jpt from 'jspdf-autotable';
import { CommonService } from 'app/pages/masters/components/common/index';
import { debug } from 'util';

const log = new Logger('localPurchaseMonthlyInvoiceReport');


class Supplier {
  supplierId: number;
  supplierName: string;
}

@Component({
  selector: 'movementsReport',
  templateUrl: './movementsReport.html',
  styleUrls: ['./movementsReport.scss']

})



export class MovementsReport implements OnInit {




  movementsReportForm: FormGroup;
  source: LocalDataSource = new LocalDataSource();

  currentUser: String;
  reportHeading: String;
  tabList: any[] = [];
  settings: any;
  isAgeingReport: boolean = false;
  isNotionalProfit: boolean = false;
  invoiceTypeList: any[] = [];
  supplierList: Supplier[] = [];
  test: any[] = [];
  public fromDate: AbstractControl;
  public toDate: AbstractControl;
  public supplier: AbstractControl;
  public invoice: AbstractControl;
  loading: boolean = false;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private service: MovementsReportService,
    private modalService: NgbModal,
    private commonService: CommonService,
    //private spinnerService: Ng4LoadingSpinnerService,
    private authService: AuthenticationService) {
    this.loading = true;
    this.createForm();
    this.getSupplier();
    this.currentUser = sessionStorage.getItem("loggedUser");
    this.commonService.getAllCommonMasterByType('IT').subscribe((code) => {
      this.invoiceTypeList = code.filter(
        task => task.code === "IPI" || task.code === "LPI");
    });

  }
  getSupplier() {

    this.service.getAllSupplierByType('SU').subscribe((objList) => {
      objList.forEach(ele => {
        if (ele != null) {
          const supplier = new Supplier();
          supplier.supplierId = ele.partyId;
          supplier.supplierName = ele.partyName;
          this.supplierList.push(supplier);
        }
      });
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

  prepareVolumeSetting() {
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
          title: 'Lot.',
          type: 'text',
        },
        itemName: {
          title: 'Item',
          type: 'text',
        },
        totalCarats: {
          title: 'Total Carats',
          type: 'text',
        }

      }
    };
  }

  prepareVolumeProfitSetting() {
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
        itemName: {
          title: 'Item',
          type: 'text',
        },
        carats: {
          title: 'Total Carats',
          type: 'text',
        },

        costPrice: {
          title: 'Cost Price',
          type: 'number',
        },
        profit: {
          title: 'Profit',
          type: 'number',
        },
      }
    };
  }

  prepareVolumeRevenueSetting() {
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

        itemName: {
          title: 'Item',
          type: 'text',
        },
        carats: {
          title: 'Total Carats',
          type: 'text',
        },

        sellingPrice: {
          title: 'Selling Price',
          type: 'number',
        },
        revenue: {
          title: 'Revenue',
          type: 'number',
          // To show any specific Currency type in Frontend
          // valuePrepareFunction: (value) => {
          //   let valueTransformed = (value == 0) ? value : Intl.NumberFormat(['en-IN'], {
          //     style: 'currency',
          //     currency: 'INR'
          //   }).format(value);
          //   return valueTransformed;
          // },
        },

      }
    };
  }
  dateFormate(date: Date) {
    const dd = date.getDate();
    const mm = date.getMonth() + 1; // January is 0!
    const yyyy = date.getFullYear();
    return yyyy + '-' + (mm < 10 ? '0' + mm : mm) + '-' + (dd < 10 ? '0' + dd : dd);
  }
  prepareNotionalProfitSetting() {
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
        invoiceType: {
          title: 'Inv. Type',
          type: 'text',
        },
        invoiceId: {
          title: 'Inv. ID',
          type: 'text',
        },

        purchaseId: {
          title: 'Purchase ID',
          type: 'number',
        },
        stockExchRate: {
          title: 'Exch. Rate',
          type: 'number',
        },
        invoiceDate: {
          title: 'Inv. Date',
          type: 'text',
        },
        profitBase: {
          title: 'Profit',
          type: 'number',
        },
        netAmount: {
          title: 'Net Amt.',
          type: 'number',
          // To show any specific Currency type in Frontend
          valuePrepareFunction: (value) => {
            let valueTransformed = (value == 0) ? value : Intl.NumberFormat(['en-IN'], {
              style: 'currency',
              currency: 'INR'
            }).format(value);
            return valueTransformed;
          },
        },
        partyName: {
          title: 'Party Name',
          type: 'text',
        },
        npINR: {
          title: 'NP(INR)',
          type: 'number',
        },
        npUSD: {
          title: 'NP(USD)',
          type: 'number',
        },
        npPer: {
          title: 'NP %',
          type: 'text',
        }
      }
    };
  }

  ngOnInit() {


    if (this.router.url.includes('top25Volume')) {
      this.isNotionalProfit = false;
      this.reportHeading = 'Top 25 Items Volume Report';
      this.settings = this.prepareVolumeSetting();
      this.service.getTopSoldItems().subscribe(res => {
        this.tabList = res;
        this.source.load(res);
        this.loading = false;
      })

    } else if (this.router.url.includes('top25Profits')) {
      this.isNotionalProfit = false;
      this.reportHeading = 'Top 25 Items Profits Report';
      this.settings = this.prepareVolumeProfitSetting();
      for (var i = 0; i < this.tabList.length; i++) {
        if (this.tabList.lastIndexOf) {
          // this.cp.transform(this.profit, 'USD': true: '1.0-0');
        }
      }
      this.service.getTopSoldProfitItems().subscribe(res => {
        this.tabList = res.splice(0, 25);
        this.tabList.forEach(ele => {
          ele.costPrice = this.format2(ele.costPrice,'');
          ele.profit = this.format2(ele.profit,'');
          ele.carats = this.format2(ele.carats,'');
        });
        this.source.load(this.tabList);
        this.loading = false;
      })


    } else if (this.router.url.includes('top25Revenue')) {
      this.isNotionalProfit = false;
      this.reportHeading = 'Top 25 Items Revenue Report';
      this.settings = this.prepareVolumeRevenueSetting();

      this.service.getTopSoldRevenueItems().subscribe(res => {
        this.tabList = res.splice(0, 25);
        this.tabList.forEach(ele => {
          ele.revenue = this.format2(ele.revenue,'');
          ele.sellingPrice = this.format2(ele.sellingPrice,'');
          ele.carats = this.format2(ele.carats,'');
        });
        this.source.load(this.tabList);
        this.loading = false;
      })

    }
    else if (this.router.url.includes('notionalProfit')) {
      this.isNotionalProfit = true;
      this.fromDate.setValue(this.dateFormate(new Date()));
      this.toDate.setValue(this.dateFormate(new Date()));
      this.reportHeading = 'Notional Profit Report';
      this.settings = this.prepareNotionalProfitSetting();

      this.service.getCompletedPurchasesNP(-1, -1, -1, -1).subscribe((tabList) => {
        if (tabList.length > 0) {
          this.tabList = tabList;
          this.source.load(tabList);
          this.loading = false;
        }
        //this.spinnerService.hide();
      });
      // this.service.getTopSoldRevenueItems().subscribe(res => {
      //   this.tabList = res.splice(0,25);
      //   this.source.load(this.tabList);
      // })

    }
  }

  format1(n, currency){
    return currency + n.replace(/(\d)(?=(\d{3})+\.)/g, '$1,'); //USD Currency Formatter
  }
  format2(n, currency) {
    return currency + n.replace(/(\d)(?=(\d{2})+\d\.)/g, '$1,'); // INR Currency Formatter
  }

  today(): string {
    const today = new Date();
    const dd = today.getDate();
    const mm = today.getMonth() + 1; //January is 0!

    const yyyy = today.getFullYear();
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
  ConvertToPDF() {
    let doc = new jsPDF('landscape', 'pt'); jpt;
    if (this.router.url.includes('top25Volume')) {
      doc.setFontType('underline');
      doc.text(this.reportHeading, 340, 25);
      doc.setFontSize(10);
      doc.text(this.now(), 720, 20);
      doc.text(this.currentUser, 745, 30);
      var columns = [
        { title: "Item Id", dataKey: "itemId" },
        { title: "Lot Name", dataKey: "lotName" },
        { title: "Item Name", dataKey: "itemName" },
        { title: "Total Carats", dataKey: "totalCarats" }

      ];

      doc.autoTable(columns, this.tabList, {
        styles: {
          overflow: 'linebreak',
          halign: 'left'
        }
      });

      doc.save(this.reportHeading + '.pdf');
    } else if (this.router.url.includes('top25Profits')) {
      doc.setFontType('underline');
      doc.text(this.reportHeading, 340, 25);
      doc.setFontSize(10);
      doc.text(this.now(), 720, 20);
      doc.text(this.currentUser, 745, 30);
      var columns = [
        { title: "Item", dataKey: "itemName" },
        { title: "Total Carats", dataKey: "carats" },
        { title: "Cost Price", dataKey: "costPrice" },
        { title: "Profit", dataKey: "profit" }

      ];

      doc.autoTable(columns, this.tabList, {
        styles: {
          overflow: 'linebreak',
          halign: 'left'
        }
      });

      doc.save(this.reportHeading + '.pdf');

    } else if (this.router.url.includes('top25Revenue')) {
      doc.setFontType('underline');
      doc.text(this.reportHeading, 340, 25);
      doc.setFontSize(10);
      doc.text(this.now(), 720, 20);
      doc.text(this.currentUser, 745, 30);
      var columns = [
        { title: "Item", dataKey: "itemName" },
        { title: "Total Carats", dataKey: "carats" },
        { title: "Selling Price", dataKey: "sellingPrice" },
        { title: "Revenue", dataKey: "revenue" }

      ];

      doc.autoTable(columns, this.tabList, {
        styles: {
          overflow: 'linebreak',
          halign: 'left'
        }
      });

      doc.save(this.reportHeading + '.pdf');
    }
    else if (this.router.url.includes('notionalProfit')) {
      doc.setFontType('underline');
      doc.text(this.reportHeading, 340, 25);
      doc.setFontSize(10);
      doc.text(this.now(), 720, 20);
      doc.text(this.currentUser, 745, 30);
      var columns = [
        { title: "Inv. Type", dataKey: "invoiceType" },
        { title: "Inv. ID", dataKey: "invoiceId" },
        { title: "Purchase ID", dataKey: "purchaseId" },
        { title: "Exch. Rate", dataKey: "stockExchRate" },
        { title: "Inv. Date", dataKey: "invoiceDate" },
        { title: "Profit", dataKey: "profitBase" },
        { title: "Net Amt.", dataKey: "netAmount" },
        { title: "Party Name", dataKey: "partyName" },
        { title: "NP(INR)", dataKey: "npINR" },
        { title: "NP(USD)", dataKey: "npUSD" },
        { title: "NP %", dataKey: "npPer" }

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

    if (this.router.url.includes('top25Volume')) {
      var options = {
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalseparator: '.',
        showLabels: true,
        showTitle: true,
        useBom: true,
        headers: ['Item Code', 'Item Name', 'Lot Name', 'Total Carats'],
        title: 'Top 25 Items Volume Report' + ',' + '\n' + 'Date ' + ',' + this.today() + ',' + '\n' + 'User' + ',' + this.currentUser
      };


      new Angular2Csv(this.tabList, 'Top 25 Items Volume Report', options);
    } else if (this.router.url.includes('top25Profits')) {
      var options = {
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalseparator: '.',
        showLabels: true,
        showTitle: true,
        useBom: true,
        headers: ['Item', 'Total Carats', 'Cost Price', 'Profit'],
        title: 'Top 25 Items Profit Report' + ',' + '\n' + 'Date ' + ',' + this.today() + ',' + '\n' + 'User' + ',' + this.currentUser
      };


      new Angular2Csv(this.tabList, 'Top 25 Items Profit Report', options);
    } else if (this.router.url.includes('top25Revenue')) {
      var options = {
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalseparator: '.',
        showLabels: true,
        showTitle: true,
        useBom: true,
        headers: ['Item ', 'Selling Price', 'Revenue', 'Total Carats'],
        title: 'Top 25 Items Revenue Report' + ',' + '\n' + 'Date ' + ',' + this.today() + ',' + '\n' + 'User' + ',' + this.currentUser
      };


      new Angular2Csv(this.tabList, 'Top 25 Items Revenue Report', options);

    }
    else if (this.router.url.includes('notionalProfit')) {
      var options = {
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalseparator: '.',
        showLabels: true,
        showTitle: true,
        useBom: true,
        headers: ['Profit', 'Net Amt.', 'NP(USD)', 'Purchase ID', 'Party Name', 'Inv. Type', 'NP(INR)', 'NP %', 'Inv. ID', 'Exch. Rate', 'Inv. Date'],
        title: 'Notional Profit Report' + ',' + '\n' + 'Date ' + ',' + this.today() + ',' + '\n' + 'User' + ',' + this.currentUser
      };


      new Angular2Csv(this.tabList, 'Notional Profit Report', options);
    }

  }


  deleteMsg(msg: string) {
    const index: number = this.tabList.indexOf(msg);
    if (index !== -1) {
      this.tabList.splice(index, 1);
    }
  }


  createReport() {
    if (this.router.url.includes('salesVolumeReport')) {


    }
    else if (this.router.url.includes('notionalProfit')) {
      //  this.invoiceTypeList = [];
      this.source.load(this.invoiceTypeList);

      const frmDate = new Date(this.fromDate.value);
      const toDte = new Date(this.toDate.value);
      const val = this.inBetween(frmDate, toDte);
      console.log(val);
      if (val > 365) {
        const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
        activeModal.componentInstance.showHide = false;
        activeModal.componentInstance.modalHeader = 'Alert';
        activeModal.componentInstance.modalContent = "you can't fetch data for more than 365 days..!";

      } else {
        this.service.getCompletedPurchasesNP(this.supplier.value == "" ? -1 : this.supplier.value, this.fromDate.value,
          this.toDate.value.toString(), this.invoice.value == "" ? -1 : this.invoice.value).subscribe((tabList) => {
            if (tabList.length > 0) {
              this.tabList = tabList;
              this.source.load(tabList);
            }
            //this.spinnerService.hide();
          });
      }

    }

  }




  finally() {
    //  this.isLoading = false;
    this.movementsReportForm.markAsPristine();
  }

  private createForm() {
    this.movementsReportForm = this.fb.group({

      'fromDate': ['', Validators.required],
      'toDate': ['', Validators.required],
      'supplier': ['', Validators.required],
      'invoice': ['', Validators.required]
      // 'lotMasterName': ['', Validators.required],
    });


    this.fromDate = this.movementsReportForm.controls['fromDate'];
    this.toDate = this.movementsReportForm.controls['toDate'];
    this.supplier = this.movementsReportForm.controls['supplier'];
    this.invoice = this.movementsReportForm.controls['invoice'];
  }
}
