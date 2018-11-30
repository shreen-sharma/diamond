import { CommonModalComponent } from '../../../../shared/common-modal/common-modal.component';
import { FormGroup, FormArray, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { AuthenticationService } from '../../../../core/authentication/authentication.service';
import { Logger } from '../../../../core/logger.service';
import { StockSummaryService } from './stockSummary.service';
import { CategoryService } from '.../../app/pages/masters/components/categories/category.service';
import { LotService } from '.../../app/pages/stockManagement/components/lots/lot.service';
import { ItemDetailsService } from 'app/pages/masters/components/itemDetails/itemDetails.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LotItemCreationService } from 'app/pages/stockManagement/components/lotItemCreation/lotItemCreation.service';
import { Ng2TableModule } from 'ng2-table/ng2-table';
import { NG_TABLE_DIRECTIVES } from 'ng2-table/ng2-table';
import { GridOptions } from 'ag-grid/main';

import { IFilter, IFilterParams } from 'ag-grid/main';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
import * as jsPDF from 'jspdf';
import * as jpt from 'jspdf-autotable';
import { Title } from '@angular/platform-browser';
import { debug } from 'util';
import { parse } from 'querystring';
// import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';



const log = new Logger('stockSummary');
class StockDetails {
  lotId: number;
  lotName: string;
  totalCarats: string;
  averageSPRate: number;
  averageStockRate: number;
  amount: number;
  exchangeRate: number;
  amountInRs: string;
  ctsPerc: string;
  amtPerc: string;
  amt: any;
}

class LotItemList {
  itemName: string;
  totalCarats: number;
  avgRage: number;
  stockAmountUSD: number;
  customExchRate: number;
  stockAmountINR: number;
  salePrice: number;
  saleAmountUSD: number;
  saleAmountINR: number;
  ctsPerc: string;
  stockAmtPer: string;
  saleAmtPer: string;
}

class StockDetailsSummary {
  lotId: number;
  lotName: string;
  totalCarats: string;
  averageSPRate: number;
  amountSP: string;
  amountSPInRs: string;
  averageStockRate: number;
  amountSR: string;
  amountSRInRs: string;
  exchangeRate: number;
  ctsPerc: string;
  amtSPPerc: string;
  amtSRPerc: string;
}

@Component({
  selector: 'stockSummary',
  templateUrl: './stockSummary.html',
  styleUrls: ['./stockSummary.scss'],

})
export class StockSummary implements OnInit {
  avgStockRate: number;
  query = '';
  error: string = null;
  isLoading = false;
  stockSummaryForm: FormGroup;
  source: LocalDataSource = new LocalDataSource();
  lotName: any;
  catName: any;

  lotList: any[] = [];
  catList: any[] = [];
  selectedCat: any;
  name: string;
  tabList: any[] = [];
  itemCatList: any[] = [];
  itemLotList: any[] = [];
  itemList: any[] = [];
  params: any[] = [];
  rowData: any[];
  stockList: StockDetails[] = [];
  stockListSummary: StockDetailsSummary[] = [];
  lotItemList: LotItemList[] = [];
  settings: any;
  reportStatus: boolean;
  totalCarets: number;
  totalAmount: number;
  totalAmountRs: number;
  avgBidPrice: number;
  bidAmt: number;
  spRate: number;
  avgSPStockRates: number;
  avgStkRate: number;
  amnt: number;
  amntInRs: number;
  ctsPercent: number;
  amntPercent: number;
  stockSummarySRFlage: boolean = false;
  stockSummaryFlag: boolean = false;
  isLotItemReport: boolean = false;
  iscombinedSummary: boolean = false;
  totalAmountSP: number = 0;
  totalAmountSPRs: number = 0;
  saleAmtUSD: number = 0;
  saleAmtINR: number = 0;
  reportHeading: String;
  currentUser: String;
  loading: boolean = false;
  isSummaryReport: boolean = false;

  public category: AbstractControl;
  public lot: AbstractControl;
  public level: AbstractControl;
  public lotItem: AbstractControl;
  public stockType: AbstractControl;
  // public lotMasterName: AbstractControl;
  public tableParameters: AbstractControl;
  public gridOptions: GridOptions;
  public rowCount: string;
  public showGrid: boolean;
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

  constructor(private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private service: StockSummaryService,
    private modalService: NgbModal,
    private lotService: LotService,
    private catService: CategoryService,
    private itemService: ItemDetailsService,
    private lotItemService: LotItemCreationService,
    // private spinnerService: Ng4LoadingSpinnerService,
    private authService: AuthenticationService) {

    this.createForm();
    this.reportStatus = true;
    //  this.settings = this.prepareSetting();
    this.currentUser = sessionStorage.getItem("loggedUser");
    this.catService.getData().subscribe((catList) => {
      this.catList = catList;
    });
    //  this.gridOptions = <GridOptions>{};
    //   this.showGrid = true;

    //     this.gridOptions.defaultColDef = {
    //       headerComponentFramework: <{ new(): HeaderComponent }>HeaderComponent,
    //       headerComponentParams: {
    //           menuIcon: 'fa-bars'
    //       }
    //   }
  }

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
    return currency + n.replace(/(\d)(?=(\d{3})+\.)/g, '$1,'); //USD Currency Formatter
  }
  // resetTotalCalc(){
  //   this.
  // }
  ngOnInit() {


    if (this.router.url.includes('stockSummaryStockRateReport')) {
      debugger;
      this.stockSummarySRFlage = true;
      this.iscombinedSummary = false;
      this.settings = this.prepareSetting();
      this.source.load(this.stockList);
      this.loading = false;
      this.reportHeading = 'WT. STOCK RATE REPORT';
    } else if (this.router.url.includes('stockSummarySellingPriceReport')) {
      this.stockSummarySRFlage = false;
      this.iscombinedSummary = false;
      this.settings = this.prepareSetting();
      this.source.load(this.stockList);
      this.loading = false;
      this.reportHeading = 'WT. SELLING PRICE REPORT';
    } else if (this.router.url.includes('stockSummaryReport')) {
      this.stockSummaryFlag = true;
      this.iscombinedSummary = false;
      this.settings = this.prepareSettingSummary();
      this.source.load(this.stockListSummary);
      this.loading = false;
      this.reportHeading = 'WT. SUMMARY REPORT';
    } else if (this.router.url.includes('lotItemReport')) {
      this.isLotItemReport = true;
      this.iscombinedSummary = false;
      this.lotService.getData().subscribe(lst => {

        this.lotList = lst;
        this.reportHeading = 'LOT ITEM REPORT';
      });
      this.settings = this.prepareSettingLotItem();
      this.source.load(this.lotItemList);
      this.loading = false;
    }
    else if (this.router.url.includes('combinedSummary')) {
      this.iscombinedSummary = true;
      this.isSummaryReport = true;
      this.isLotItemReport = true;
      this.reportHeading = "Combined Item Summary Report";
      this.settings = this.prepareSettingCombinedItem();
      this.loading = true;
      this.service.getSummaryLotReportByStockType('ALL').subscribe(res => {
        this.tabList = res;
        this.totalCarets = this.ttlCarats;
        this.avgStockRate = this.ttlstockAmount / this.ttlCarats;
        this.totalAmount = this.ttlstockAmount;
        this.saleAmtINR = this.ttlsaleAmount; //Sale Amount (USD):
        this.saleAmtUSD = this.ttlsaleAmount / this.ttlCarats;  //Avg. Sale Price:

        // this.avgBidPrice = this.ttlbidAmt / this.ttlCarats;
        // this.bidAmt = this.ttlbidAmt;
        // res.forEach(ele => {
        //   ele.saleAmount = this.format1(parseFloat(ele.saleAmount.toString()).toFixed(2), '');
        //   ele.avgSaleRate = this.format1(parseFloat(ele.avgSaleRate.toString()).toFixed(2), '');
        //   ele.stockAmount = this.format1(parseFloat(ele.stockAmount.toString()).toFixed(2), '');
        //   ele.avgStockRate = this.format1(parseFloat(ele.avgStockRate.toString()).toFixed(2), '');
        //   ele.totalCarats = this.format2(parseFloat(ele.totalCarats.toString()).toFixed(2), '');
        // })
        this.source.load(res);
        this.loading = false;
      })
    }
    else if (this.router.url.includes('summaryReport')) {
      this.reportHeading = "Summary Report";
      this.isLotItemReport = true;
      this.isSummaryReport = true;
      this.iscombinedSummary = false;
      this.lotService.getData().subscribe(lst => {
        this.lotList = lst;
      });
      this.loading = true;
      this.settings = this.prepareSettingSummaryLevel();
      this.service.getStockSummaryReportByStockType('ALL', -1, -1).subscribe(res => {
        this.tabList = res;
        debugger;
        this.totalCarets = this.ttlCarats;
        this.avgStockRate = this.ttlstockAmount / this.ttlCarats;
        this.totalAmount = this.ttlstockAmount;
        this.saleAmtINR = this.ttlsaleAmount; //Sale Amount (USD):
        this.saleAmtUSD = this.ttlsaleAmount / this.ttlCarats;  //Avg. Sale Price:

        this.avgBidPrice = this.ttlbidAmt / this.ttlCarats;
        this.bidAmt = this.ttlbidAmt;
        res.forEach(ele => {
          // ele.avgStockRate = this.format2(parseFloat(ele.avgStockRate.toString()).toFixed(2), '');
          ele.stockAmount = this.format1(parseFloat(ele.stockAmount.toString()).toFixed(2), '');
          // ele.avgSalePrice = this.format2(parseFloat(ele.avgSalePrice).toFixed(2), '');
          ele.salePrice = this.format2(parseFloat(ele.salePrice.toString()).toFixed(2), '');
          ele.saleAmount = this.format1(parseFloat(ele.saleAmount.toString()).toFixed(2), '');
          ele.bidPrice = this.format2(parseFloat(ele.bidPrice.toString()).toFixed(2), '');
          ele.bidAmount = this.format2(parseFloat(ele.bidAmount.toString()).toFixed(2), '');
        })
        this.source.load(res);
        this.loading = false;
      })
    }


  }

  prepareSettingCombinedItem() {
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
        stockType: {
          title: 'Level',
          type: 'text',
        },
        lotName: {
          title: 'Lot Name',
          type: 'text',
        },
        totalCarats: {
          title: 'Total Carats',
          type: 'number',
        },
        saleAmount: {
          title: 'Selling Price',
          type: 'text',
        },
        avgSaleRate: {
          title: 'Avg. Selling Price',
          type: 'text',
        },
        stockAmount: {
          title: 'Stock Amount',
          type: 'text',
        },
        avgStockRate: {
          title: 'Avg. Stock Rate ',
          type: 'number',
        }

      }
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
        perPage: 10,
      },
      selectMode: 'single',
      columns: {
        lotName: {
          title: 'Lot Name',
          type: 'text',
        },
        totalCarats: {
          title: 'Total Carats',
          type: 'text',
        },
        averageSPRate: {
          title: 'Avg. SP Rate ',
          type: 'text',
        },
        averageStockRate: {
          title: 'Avg. StockRate',
        },
        amount: {
          title: 'Amount (USD)',
        },
        exchangeRate: {
          title: 'Exchange Rate',
        },
        amountInRs: {
          title: 'In Rs. Amount',
        },
        ctsPerc: {
          title: 'CTS %',
        },
        amtPerc: {
          title: 'AMT %',
        }
      }
    };
  }




  prepareSettingSummary() {
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
          title: 'Lot Name',
          type: 'text',
        },
        totalCarats: {
          title: 'Total Carats',
          type: 'text',
        },
        averageSPRate: {
          title: 'Avg. SP Rate ',
          type: 'text',
        },
        amountSP: {
          title: 'Amount SP (USD)',
        },
        amountSPInRs: {
          title: 'In Rs. Amount(SP)',
        },
        averageStockRate: {
          title: 'Avg. StockRate',
        },
        amountSR: {
          title: 'Amount SR (USD)',
        },
        amountSRInRs: {
          title: 'In Rs. Amount(SR)',
        },
        exchangeRate: {
          title: 'Exchange Rate',
        },
        ctsPerc: {
          title: 'CTS %',
        },
        amtSPPerc: {
          title: 'AMT SP%',
        },
        amtSRPerc: {
          title: 'AMT SR%',
        }
      }
    };
  }



  prepareSettingLotItem() {
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
          title: 'Item Name',
          type: 'text',
        },
        totalCarats: {
          title: 'Total Carats',
          type: 'number',
        },
        avgRage: {
          title: 'Avg Rate ',
          type: 'number',
        },
        stockAmountUSD: {
          title: 'Stock Amount (USD)',
          type: 'number',
        },
        customExchRate: {
          title: 'Custom Exch Rate',
          type: 'number',
        },
        stockAmountINR: {
          title: 'Stock Amount (INR)',
          type: 'number',
        },
        salePrice: {
          title: 'Sale Price',
          type: 'number',
        },
        saleAmountUSD: {
          title: 'Sale Amount (USD)',
          type: 'number',
        },
        saleAmountINR: {
          title: 'Sale Amount (INR)',
          type: 'number',
        },
        ctsPerc: {
          title: 'CTS %',
        },
        stockAmtPer: {
          title: 'Stock AMT %',
        },
        saleAmtPer: {
          title: 'Sale AMT %',
        }
      }
    };
  }


  prepareSettingSummaryLevel() {
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
        stockType: {
          title: 'Level',
          type: 'text',
        },
        lotName: {
          title: 'Lot Name',
          type: 'text',
        },
        itemName: {
          title: 'Item Name',
          type: 'text',
        },
        totalCarats: {
          title: 'Total Carats',
          type: 'number',
        },
        // paramValue: {
        //   title: 'Size',
        //   type: 'text',
        // },
        // diaQuality: {
        //   title: 'Quality',
        //   type: 'text',
        // },
        // avgStockRate: {
        //   title: 'Avg Stock Rate ',
        //   type: 'number',
        // },
        salePrice: {
          title: 'Sales Price',
          type: 'number',
        },
        saleAmount: {
          title: 'Sale Amount (USD)',
          type: 'number',
        },
        stockAmount: {
          title: 'Stock Amount (USD)',
          type: 'number',
        },

        bidPrice: {
          title: 'Bid Price',
          type: 'number',
        },
        bidAmount: {
          title: 'Bid Amount (USD)',
          type: 'number',
        },

      }
    };
  }

  onChangeCat(catId: any): void {

    if (this.stockList.length > 0) {
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = true;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Entered data will be get removed!';
      activeModal.result.then((res) => {
        // console.log(res == 'Y');
        if (res == 'Y') {
          this.selectedCat = catId;
          this.stockSummaryForm.controls['category'].setValue(this.selectedCat);
          this.forChangeCat(catId);
        } else if (res == 'N') {
          this.stockSummaryForm.controls['category'].setValue(this.selectedCat);
        }
      });
    } else {
      this.selectedCat = this.category.value;
      this.forChangeCat(catId);
    }
    this.stockSummaryForm.controls['category'].setValue(this.selectedCat);
  }

  forChangeCat(catId: any) {
    this.lotList = []
    this.lotService.getData().subscribe((lotList) => {
      this.lotList = lotList;
    });
    this.itemService.getAllItemsByCategoryId(catId).subscribe((itemCatList) => {
      this.itemCatList = itemCatList;
    });
    this.stockSummaryForm.reset();
    this.stockList = [];
    this.source.load(this.stockList);
    this.reportStatus = true;
    this.stockSummaryForm.controls['category'].setValue(catId);
    this.totalCarets = 0;
    this.spRate = 0;
    this.amnt = 0;
    this.amntInRs = 0;
    this.ctsPercent = 0;
    this.amntPercent = 0;
    this.totalAmountSP = 0;
    this.totalAmountSPRs = 0;
    this.totalAmount = 0;
    this.avgStockRate = 0;
    this.avgSPStockRates = 0;
    this.totalAmountRs = 0;
  }

  onChangeLot(lotId: any): void {
    this.lotItemService.getAllLotItemByLotId(lotId).subscribe(list => {
      this.itemLotList = list;
      if (this.itemLotList.length > 0) {
        this.itemList = [];
        // if (this.itemCatList.length > 0) {
        // this.itemCatList.forEach(catItem => {
        this.itemLotList.forEach(lotItem => {
          if (lotItem.lotMaster.lotId == lotId) {
            this.itemList.push(lotItem);
          }
        });
        // });
        if (this.itemList.length === 0) {
          const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
          activeModal.componentInstance.showHide = false;
          activeModal.componentInstance.modalHeader = 'Alert';
          activeModal.componentInstance.modalContent = 'No items belongs to selected Category & Lot!';
        }
        // } else {
        //   const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
        //   activeModal.componentInstance.showHide = false;
        //   activeModal.componentInstance.modalHeader = 'Alert';
        //   activeModal.componentInstance.modalContent = 'No items in selected Category!';
        // }
      } else {
        const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
        activeModal.componentInstance.showHide = false;
        activeModal.componentInstance.modalHeader = 'Alert';
        activeModal.componentInstance.modalContent = 'No items in selected Lot!';
      }
    });
  }



  ConvertToPDF() {

    let doc = new jsPDF('landscape', 'pt'); jpt;
    if (this.router.url.includes('combinedSummary')) {
      doc.setFontType('underline');
      doc.text(this.reportHeading, 340, 14);
      doc.setFontSize(10);
      doc.text(this.now(), 720, 10);
      doc.text(this.currentUser, 745, 17);
      doc.setLineWidth(0.5);
      doc.line(40, 20, 800, 20);
      doc.text(40, 30, 'Total Carats: ');
      doc.text(this.totalCarets.toString(), 95, 30);
      doc.text(185, 30, 'Avg. Stock Rate: ');
      doc.text(this.avgStockRate.toFixed(3).toString(), 255, 30);
      doc.text(335, 30, 'Stock Amount($): ');
      doc.text(this.totalAmount.toFixed(3).toString(), 410, 30);
      doc.text(510, 30, 'Avg. Sale Price: ');
      doc.text(this.saleAmtUSD.toFixed(3).toString(), 575, 30);
      doc.text(655, 30, 'Sale Amount ($): ');
      doc.text(this.saleAmtINR.toFixed(3).toString(), 725, 30);
      doc.setLineWidth(0.5);
      doc.line(40, 35, 800, 35);
      var columns = [
        { title: "Stock Type", dataKey: "stockType" },
        { title: "Lot Name", dataKey: "lotName" },
        { title: "Selling Price", dataKey: "saleAmount" },
        { title: "Avg. Selling Price", dataKey: "avgSaleRate" },
        { title: "Stock Amount", dataKey: "stockAmount" },
        { title: "Avg. Stock Rate", dataKey: "avgStockRate" },

        { title: "Total Carats", dataKey: "totalCarats" },
      ];

      doc.autoTable(columns, this.tabList, {
        styles: {
          overflow: 'linebreak',
          halign: 'left'
        }
      });

      doc.save(this.reportHeading + '.pdf');
    }
    else if (this.isLotItemReport) {
      if (this.isSummaryReport) {
        doc.setFontType('underline');
        doc.text(this.reportHeading, 340, 14);
        doc.setFontSize(10);
        doc.text(this.now(), 720, 10);
        doc.text(this.currentUser, 745, 17);
        doc.setLineWidth(0.5);
        doc.line(40, 20, 800, 20);
        doc.setFontSize(9);
        doc.text(40, 30, 'Total Carats: ');
        doc.text(this.totalCarets.toString(), 90, 30);
        doc.text(135, 30, 'Avg. Stock Rate: ');
        doc.text(this.avgStockRate.toFixed(3).toString(), 200, 30);
        doc.text(240, 30, 'Stock Amt($): ');
        doc.text(this.totalAmount.toFixed(3).toString(), 295, 30);
        doc.text(360, 30, 'Avg. Sale Price: ');
        doc.text(this.saleAmtUSD.toFixed(3).toString(), 420, 30);
        doc.text(480, 30, 'Sale Amt($): ');
        doc.text(this.saleAmtINR.toFixed(3).toString(), 530, 30);
        doc.text(605, 30, 'Avg. Bid Price: ');
        doc.text(this.avgBidPrice.toFixed(2).toString(), 665, 30);
        doc.text(710, 30, 'Bid Amt($): ');
        doc.text(this.bidAmt.toFixed(1).toString(), 755, 30);
        doc.setLineWidth(0.5);
        doc.line(40, 35, 800, 35);
        var columns = [
          { title: "Stock Type", dataKey: "stockType" },
          { title: "Lot Name", dataKey: "lotName" },
          { title: "Item Name", dataKey: "itemName" },
          { title: "Total Carats", dataKey: "totalCarats" },
          { title: "Sales Price", dataKey: "salePrice" },
          { title: "Sale Amt(USD)", dataKey: "saleAmount" },
          { title: "Stock Amt(USD)", dataKey: "stockAmount" },
          { title: "Bid Price", dataKey: "bidPrice" },
          { title: "Bid Amt (USD)", dataKey: "bidAmount" },

        ];
        doc.autoTable(columns, this.tabList, {
          styles: {
            overflow: 'linebreak',
            halign: 'left'
          }
        });

        doc.save(this.reportHeading + '.pdf');
      } else {
        doc.setFontType('underline');
        doc.text(this.reportHeading + ' : ' + this.lotName, 320, 14);
        doc.setFontSize(10);
        doc.text(this.now(), 720, 10);
        doc.text(this.currentUser, 745, 17);
        doc.setLineWidth(0.5);
        doc.line(40, 20, 800, 20);
        doc.text(40, 30, 'Total Carats: ');
        doc.text(this.totalCarets.toString(), 95, 30);
        doc.text(145, 30, 'Avg. Stock Rate: ');
        doc.text(this.avgStockRate.toFixed(3).toString(), 215, 30);
        doc.text(265, 30, 'Stock Amt($): ');
        doc.text(this.ttlStockAmtUSD.toFixed(2).toString(), 325, 30);
        doc.text(405, 30, 'Stock Amt(INR): ');
        doc.text(this.ttlStockAmtINR.toFixed(2).toString(), 475, 30);
        doc.text(560, 30, 'Sale Amt($): ');
        doc.text(this.saleAmtUSD.toFixed(2).toString(), 615, 30);
        doc.text(680, 30, 'Sale Amt(INR): ');
        doc.text(this.saleAmtINR.toFixed(2).toString(), 745, 30);
        doc.setLineWidth(0.5);
        doc.line(40, 35, 800, 35);
        var columns = [
          { title: "Item Name", dataKey: "itemName" },
          { title: "Total Carats", dataKey: "totalCarats" },
          { title: "Avg. Rate", dataKey: "avgRage" },
          { title: "Stock Amount(USD)", dataKey: "stockAmountUSD" },
          { title: "Exch* Rate", dataKey: "customExchRate" },
          { title: "Stock Amount(INR)", dataKey: "stockAmountINR" },

          { title: "Sale Price", dataKey: "salePrice" },
          { title: "Sale Amount(USD)", dataKey: "saleAmountINR" },
          { title: "Sale Amount(INR)", dataKey: "saleAmountUSD" },

          { title: "CTS%", dataKey: "ctsPerc" },
          { title: "Stock Amt.%", dataKey: "stockAmtPer" },
          { title: "Sale Amt.%", dataKey: "saleAmtPer" },
        ];
        var head = ['lotName', 'Total Carats', 'Avg. SP Rate', 'Avg. StockRate',
          'Amount SP (USD)', 'In Rs. Amount', 'AMT SP%', 'Amount (USD)', 'Amount', 'AMT SR%',
          'Exchange Rate', 'CTS %']
        debugger;
        doc.autoTable(columns, this.lotItemList, {
          styles: {
            overflow: 'linebreak',
            halign: 'left'
          }
        });

        doc.save(this.reportHeading + ' : ' + this.lotName + '.pdf');
      }
    } else {
      if (this.stockSummaryFlag) {
        // var text = this.reportHeading,
        // xOffset = (doc.internal.pageSize.getWidth / 2); 

        doc.setFontType('underline');
        doc.text(this.reportHeading, 340, 14);
        doc.setFontSize(10);
        doc.text(this.now(), 720, 10);
        doc.text(this.currentUser, 745, 17);
        doc.setLineWidth(0.5);
        doc.line(40, 20, 800, 20);
        doc.setFontSize(9);
        doc.text(40, 30, 'Total Carats: ');
        doc.text(this.totalCarets.toString(), 90, 30);
        doc.text(135, 30, 'Avg. SP Rate: ');
        doc.text(this.avgSPStockRate.toString(), 190, 30);
        doc.text(220, 30, 'Total Amt SP($):');
        doc.text(this.ttlSPAmout.toString(), 285, 30);
        doc.text(340, 30, 'SP AMT(INR): ');
        doc.text(this.totalAmountSPRs.toString(), 400, 30);
        doc.text(470, 30, 'Avg. Stock Rate: ');
        doc.text(this.avgStockRate.toString(), 535, 30);
        doc.text(580, 30, 'Total Amt SR($):');
        doc.text(this.totalAmount.toString(), 645, 30);
        doc.text(695, 30, 'SR Amt(INR): ');
        doc.text(this.totalAmountRs.toString(), 750, 30);
        doc.setLineWidth(0.5);
        doc.line(40, 35, 800, 35);
        var columns = [
          { title: "Lot Name", dataKey: "lotName" },
          { title: "Total Carats", dataKey: "totalCarats" },
          { title: "Avg. SP Rate", dataKey: "averageSPRate" },
          { title: "Amount SP (USD)", dataKey: "amountSP" },
          { title: "In Rs. Amount(SP)", dataKey: "amountSPInRs" },
          { title: "Avg. StockRate", dataKey: "averageStockRate" },

          { title: "Amount SR (USD)", dataKey: "amountSR" },
          { title: "In Rs. Amount(SR)", dataKey: "amountSRInRs" },
          { title: "Exch* Rate", dataKey: "exchangeRate" },

          { title: "CTS%", dataKey: "ctsPerc" },
          { title: "AMT SP%", dataKey: "amtSPPerc" },
          { title: "AMT SR%", dataKey: "amtSRPerc" },
        ];
        var head = ['lotName', 'Total Carats', 'Avg. SP Rate', 'Avg. StockRate',
          'Amount SP (USD)', 'In Rs. Amount', 'AMT SP%', 'Amount (USD)', 'Amount', 'AMT SR%',
          'Exchange Rate', 'CTS %']
        doc.autoTable(columns, this.stockListSummary, {
          styles: {
            overflow: 'linebreak',
            halign: 'left'
          }
        });
        doc.save(this.reportHeading + '.pdf');
      }

      else if (this.stockSummarySRFlage) {
        doc.setFontType('underline');
        doc.text(this.reportHeading, 340, 14);
        doc.setFontSize(10);
        doc.text(this.now(), 720, 10);
        doc.text(this.currentUser, 745, 17);
        doc.setLineWidth(0.5);
        doc.line(40, 20, 800, 20);
        doc.text(40, 30, 'Total Carats: ');
        doc.text(this.totalCarets.toString(), 95, 30);
        doc.text(160, 30, 'Avg. Stock Rate: ');
        doc.text(this.avgStockRate.toFixed(3).toString(), 230, 30);
        doc.text(290, 30, 'Total Amount($): ');
        doc.text(this.totalAmount.toFixed(2).toString(), 360, 30);
        doc.text(430, 30, 'AMT in Rs: ');
        doc.text(this.totalAmountRs.toFixed(2).toString(), 485, 30);
        doc.text(580, 30, 'CARATS % : ');
        doc.text('100%', 640, 30);
        doc.text(695, 30, 'AMOUNT % : ');
        doc.text('100%', 760, 30);
        doc.setLineWidth(0.5);
        doc.line(40, 35, 800, 35);
        var columns = [
          { title: "Lot Name", dataKey: "lotName" },
          { title: "Total Carats", dataKey: "totalCarats" },
          { title: "Avg. SP Rate", dataKey: "averageSPRate" },
          // { title: "Amount SP (USD)", dataKey: "amountSP" },
          // { title: "In Rs. Amount(SP)", dataKey: "amountSPInRs" },
          { title: "Avg. StockRate", dataKey: "averageStockRate" },

          { title: "Amount (USD)", dataKey: "amount" },
          { title: "Exch* Rate", dataKey: "exchangeRate" },
          { title: "In Rs. Amount", dataKey: "amountInRs" },


          { title: "CTS%", dataKey: "ctsPerc" },
          { title: "AMT SP%", dataKey: "amtPerc" },
          // { title: "AMT SR%", dataKey: "amtSRPerc" },
        ];

        var head = ['Lot Name', 'Total Carats', 'Avg. SP Rate', 'Avg. StockRate',
          'Amount SP (USD)', 'In Rs. Amount', 'Amount', 'AMT %', 'Exchange Rate', 'CTS %']

        doc.autoTable(columns, this.stockList, {
          styles: {
            overflow: 'linebreak',
            halign: 'left'
          }
        });

        doc.save(this.reportHeading + '.pdf');
      }

      else {
        doc.setFontType('underline');
        doc.text(this.reportHeading, 340, 14);
        doc.setFontSize(10);
        doc.text(this.now(), 720, 10);
        doc.text(this.currentUser, 745, 17);
        doc.setLineWidth(0.5);
        doc.line(40, 20, 800, 20);
        doc.text(40, 30, 'Total Carats: ');
        doc.text(this.totalCarets.toString(), 95, 30);
        doc.text(160, 30, 'Avg. Stock Rate: ');
        doc.text(this.avgStockRate.toFixed(3).toString(), 230, 30);
        doc.text(290, 30, 'Total Amount($): ');
        doc.text(this.totalAmount.toFixed(2).toString(), 365, 30);
        doc.text(435, 30, 'AMT in Rs: ');
        doc.text(this.totalAmountRs.toFixed(2).toString(), 485, 30);
        doc.text(580, 30, 'CARATS % : ');
        doc.text('100%', 640, 30);
        doc.text(695, 30, 'AMOUNT % : ');
        doc.text('100%', 760, 30);
        doc.setLineWidth(0.5);
        doc.line(40, 35, 800, 35);
        var columns = [
          { title: "Lot Name", dataKey: "lotName" },
          { title: "Total Carats", dataKey: "totalCarats" },
          { title: "Avg. SP Rate", dataKey: "averageSPRate" },
          // { title: "Amount SP (USD)", dataKey: "amountSP" },
          // { title: "In Rs. Amount(SP)", dataKey: "amountSPInRs" },
          { title: "Avg. StockRate", dataKey: "averageStockRate" },

          { title: "Amount (USD)", dataKey: "amount" },
          { title: "Exch* Rate", dataKey: "exchangeRate" },
          { title: "In Rs. Amount", dataKey: "amountInRs" },
          { title: "CTS %", dataKey: "ctsPerc" },
          { title: "AMT %", dataKey: "amtPerc" }
          // { title: "AMT SR%", dataKey: "amtSRPerc" },
        ];

        // var head = ['Lot Name', 'Total Carats', 'Avg. SP Rate', 'Avg. StockRate',
        //   'Amount SP (USD)', 'In Rs. Amount', 'Amount', 'AMT %', 'Exchange Rate', 'CTS %']
        doc.autoTable(columns, this.stockList, {
          styles: {
            overflow: 'linebreak',
            halign: 'left'
          }
        });

        doc.save(this.reportHeading + '.pdf');

      }

    }

  }

  today(): string {
    const today = new Date();
    const dd = today.getDate();
    const mm = today.getMonth() + 1; //January is 0!

    const yyyy = today.getFullYear();
    return yyyy + '-' + (mm < 10 ? '0' + mm : mm) + '-' + (dd < 10 ? '0' + dd : dd);
  }
  ConvertToCSV() {
    var heading;
    // var options = {
    //   fieldSeparator: ',',
    //   quoteStrings: '"',
    //   decimalseparator: '.',
    //   showLabels: true,
    //   showTitle: true,
    //   useBom: true,
    //   headers: ['Item Name', 'Total Carats', 'Avg Rate', 'Stock Amount (USD)', 'Custom Exch Rate', 'Stock Amount (INR)', 'Sale Price', 'Sale Amount (USD)', 'Sale Amount (INR)'],
    //   title: 'Lot Name ' + ',' + this.lotName + ',' + '\n' + 'Date ' + ',' + this.today() + ',' + '\n' + 'User' + ',' + this.currentUser
    // };
    if (this.router.url.includes('combinedSummary')) {
      var options = {
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalseparator: '.',
        showLabels: true,
        showTitle: true,
        useBom: true,
        headers: ['Selling Price', 'Avg. Selling Price', 'Stock Amount', 'Level', 'Avg. Stock Rate', 'Lot ID'
          , 'Item Name', 'Total Carats'],
        title: this.reportHeading + '\n' + 'Date ' + ',' + this.today() + ',' + '\n' + 'User' + ',' + this.currentUser
      };

      // var head = ['Lot Name', 'Total Carats', 'Avg. SP Rate', 'Avg. StockRate',
      //   'Amount SP (USD)', 'In Rs. Amount', 'Amount', 'AMT %', 'Exchange Rate', 'CTS %']
      new Angular2Csv(this.tabList, 'Combined Item Summary Report', options);
    }
    else if (this.isLotItemReport) {
      if (this.isSummaryReport) {
        var options = {
          fieldSeparator: ',',
          quoteStrings: '"',
          decimalseparator: '.',
          showLabels: true,
          showTitle: true,
          useBom: true,
          headers: ['Sale Amount (USD)', 'Stock Amount (USD)', 'Item ID', 'Item Name', 'Level', 'Sales Price', 'Bid Price', 'Custom Exch Rate', 'Stock Price', 'Lot Name', 'Bid Amount (USD)', 'Total Carats'
          ],
          title: 'Stock Summary' + '\n' + 'Date ' + ',' + this.today() + ',' + '\n' + 'User' + ',' + this.currentUser
        };

        // var head = ['Lot Name', 'Total Carats', 'Avg. SP Rate', 'Avg. StockRate',
        //   'Amount SP (USD)', 'In Rs. Amount', 'Amount', 'AMT %', 'Exchange Rate', 'CTS %']
        new Angular2Csv(this.tabList, 'Stock Summary', options);

      }
      else {
        new Angular2Csv(this.tabList, 'Lot Item of lot- ' + this.lotName, options);
      }

    } else {
      if (this.stockSummaryFlag) {

        var options = {
          fieldSeparator: ',',
          quoteStrings: '"',
          decimalseparator: '.',
          showLabels: true,
          showTitle: true,
          useBom: true,
          headers: ['Lot Name', 'Total Carats', 'Avg. SP Rate', 'Avg. StockRate',
            'Amount SP (USD)', 'In Rs. Amount', 'AMT SP%', 'Amount (USD)', 'Amount', 'AMT SR%',
            'Exchange Rate', 'CTS %'],
          title: 'Category ' + ',' + this.catName + ',' + '\n' + 'Date ' + ',' + this.today() + ',' + '\n' + 'User' + ',' + this.currentUser
        };
        // var head = ['Lot Name', 'Total Carats', 'Avg. SP Rate', 'Avg. StockRate',
        //   'Amount SP (USD)', 'In Rs. Amount', 'AMT SP%', 'Amount (USD)', 'Amount', 'AMT SR%',
        //   'Exchange Rate', 'CTS %']
        new Angular2Csv(this.stockListSummary, 'Stock Summary - ' + this.catName, options);
      }

      else if (this.stockSummarySRFlage) {
        var options = {
          fieldSeparator: ',',
          quoteStrings: '"',
          decimalseparator: '.',
          showLabels: true,
          showTitle: true,
          useBom: true,
          headers: ['Lot Name', 'Total Carats', 'Avg. SP Rate', 'Avg. StockRate',
            'Amount SP (USD)', 'In Rs. Amount', 'Amount', 'AMT %', 'Exchange Rate', 'CTS %'],
          title: 'Category ' + ',' + this.catName + ',' + '\n' + 'Date ' + ',' + this.today() + ',' + '\n' + 'User' + ',' + this.currentUser
        };

        // var head = ['Lot Name', 'Total Carats', 'Avg. SP Rate', 'Avg. StockRate',
        //   'Amount SP (USD)', 'In Rs. Amount', 'Amount', 'AMT %', 'Exchange Rate', 'CTS %']
        new Angular2Csv(this.stockList, 'Stock Summary - Stock Rate - ' + this.catName, options);
      }
      else {
        var options = {
          fieldSeparator: ',',
          quoteStrings: '"',
          decimalseparator: '.',
          showLabels: true,
          showTitle: true,
          useBom: true,
          headers: ['Lot Name', 'Total Carats', 'Avg. SP Rate', 'Avg. StockRate',
            'Amount SP (USD)', 'In Rs. Amount', 'Amount', 'AMT %', 'Exchange Rate', 'CTS %'],
          title: 'Category ' + ',' + this.catName + ',' + '\n' + 'Date ' + ',' + this.today() + ',' + '\n' + 'User' + ',' + this.currentUser
        };
        var head = ['Lot Name', 'Total Carats', 'Avg. SP Rate', 'Avg. StockRate',
          'Amount SP (USD)', 'In Rs. Amount', 'Amount', 'AMT %', 'Exchange Rate', 'CTS %']
        new Angular2Csv(this.stockList, 'Stock Summary - Selling Price- ' + this.catName, options);

      }
    }
  }

  createReport() {
    this.loading = true;
    debugger;
    // this.spinnerService.show();
    if (this.iscombinedSummary) {
      debugger;
      this.service.getSummaryLotReportByStockType(this.stockType.value == "" ? "ALL" : this.stockType.value).subscribe(res => {
        this.tabList = res;
        this.totalCarets = this.ttlCarats;
        this.avgStockRate = this.ttlstockAmount / this.ttlCarats;
        this.totalAmount = this.ttlstockAmount;
        this.saleAmtINR = this.ttlsaleAmount; //Sale Amount (USD):
        this.saleAmtUSD = this.ttlsaleAmount / this.ttlCarats;  //Avg. Sale Price:

        // this.avgBidPrice = this.ttlbidAmt / this.ttlCarats;
        // this.bidAmt = this.ttlbidAmt;
        // res.forEach(ele => {
        //   ele.saleAmount = this.format1(parseFloat(ele.saleAmount.toString()).toFixed(2), '');
        //   ele.avgSaleRate = this.format1(parseFloat(ele.avgSaleRate.toString()).toFixed(2), '');
        //   ele.stockAmount = this.format1(parseFloat(ele.stockAmount.toString()).toFixed(2), '');
        //   ele.avgStockRate = this.format1(parseFloat(ele.avgStockRate.toString()).toFixed(2), '');
        //   ele.totalCarats = this.format2(parseFloat(ele.totalCarats.toString()).toFixed(2), '');
        // })
        this.source.load(res);
        this.loading = false;
      })
    }
    else
      if (this.isLotItemReport) {
        if (this.isSummaryReport) {
          this.service.getStockSummaryReportByStockType(this.level.value == "" ? "ALL" : this.level.value,
            this.lot.value == "" ? -1 : this.lot.value,
            this.lotItem.value == "" ? -1 : this.lotItem.value).subscribe(res => {
              this.tabList = res;
              this.loading = false;
              this.totalCarets = this.ttlCarats;
              this.avgStockRate = this.ttlstockAmount / this.ttlCarats;
              this.totalAmount = this.ttlstockAmount;
              this.saleAmtINR = this.ttlsaleAmount; //Sale Amount (USD):
              this.saleAmtUSD = this.ttlsaleAmount / this.ttlCarats;  //Avg. Sale Price:

              this.avgBidPrice = this.ttlbidAmt / this.ttlCarats;
              this.bidAmt = this.ttlbidAmt;
              this.source.load(res);
              this.loading = false;
            })

        } else {
          this.lotItemList = [];
          if (this.lot.value != "") {
            this.service.getAllLotItemReportByLotItemLotId(this.lot.value).subscribe(lst => {
              this.tabList = lst;
              this.tabList.forEach(lotItem => {



                const itemDetails = new LotItemList();

                itemDetails.itemName = lotItem.itemName;
                itemDetails.totalCarats = lotItem.totalCarats;
                itemDetails.avgRage = lotItem.avgRage;
                itemDetails.customExchRate = lotItem.customExchRate;
                itemDetails.saleAmountINR = lotItem.saleAmountINR;
                itemDetails.saleAmountUSD = lotItem.saleAmountUSD;
                // itemDetails.saleAmountUSD = this.format1(itemDetails.saleAmountUSD, ''); //$
                // itemDetails.saleAmountINR = this.format2(itemDetails.saleAmountINR, ''); //₹
                itemDetails.salePrice = lotItem.salePrice;
                itemDetails.stockAmountINR = lotItem.stockAmountINR;

                itemDetails.stockAmountUSD = lotItem.stockAmountUSD;
                itemDetails.ctsPerc = ((lotItem.totalCarats / this.ttlCarats) * 100).toFixed(2).toString();
                itemDetails.stockAmtPer = ((lotItem.stockAmountINR / this.ttlStockAmtINR) * 100).toFixed(2).toString();
                itemDetails.saleAmtPer = ((lotItem.saleAmountINR / this.ttlsaleAmountINR) * 100).toFixed(2).toString();
                //yasar

                // itemDetails.stockAmountINR = this.format4(itemDetails.stockAmountINR,'');
                // itemDetails.stockAmountUSD = this.format3(itemDetails.stockAmountUSD,'');
                // this.tabList.forEach(ele => {
                //   ele.saleAmountINR = this.format2(ele.saleAmountINR,'');
                //   ele.saleAmountUSD = this.format1(ele.saleAmountUSD,'');
                // })
                this.lotItemList.push(itemDetails);

              })

              this.totalCarets = this.ttlCarats;
              this.avgStockRate = this.ttlStockAmtUSD / this.ttlCarats;
              this.totalAmount = this.ttlStockAmtUSD;
              this.totalAmountRs = this.ttlStockAmtINR;
              this.saleAmtUSD = this.ttlsaleAmountUSD;
              this.saleAmtINR = this.ttlsaleAmountINR;
              //   this.ctsPerc
              this.lotItemList.forEach(ele => {
                ele.saleAmountINR = this.format2(parseFloat(ele.saleAmountINR.toString()).toFixed(2), '');
                ele.saleAmountUSD = this.format1(parseFloat(ele.saleAmountUSD.toString()).toFixed(2), '');
                ele.avgRage = this.format2(parseFloat(ele.avgRage.toString()).toFixed(2), '');
                ele.stockAmountINR = this.format2(parseFloat(ele.stockAmountINR.toString()).toFixed(2), '');
                ele.stockAmountUSD = this.format2(parseFloat(ele.stockAmountUSD.toString()).toFixed(2), '');
                ele.salePrice = this.format2(parseFloat(ele.salePrice.toString()).toFixed(2), '');
              })
              this.source.load(this.lotItemList);
              this.loading = false;
            });
          } else {
            const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
            activeModal.componentInstance.showHide = false;
            activeModal.componentInstance.modalHeader = 'Alert';
            activeModal.componentInstance.modalContent = 'Please Select Lot!';
            this.loading = false;
          }
        }

      } else {
        if (this.category.value != "") {
          this.service.getAllStockSummary().subscribe((tabList) => {
            this.tabList = tabList;
            this.tabList.forEach(lotItem => {

              if (!this.stockSummaryFlag) {

                const itemDetails = new StockDetails();
                itemDetails.lotName = lotItem.lotName;
                itemDetails.totalCarats = lotItem.totalCarats;
                itemDetails.averageSPRate = lotItem.averageSPRate;
                itemDetails.averageStockRate = lotItem.averageStockRate;
                if (!this.stockSummarySRFlage) {
                  itemDetails.amount = lotItem.amountSp;
                  itemDetails.amountInRs = lotItem.amountSpInRs;
                  itemDetails.amt = this.getAmtPer(lotItem.amountSpInRs, 'Rs.');
                  itemDetails.amtPerc = ((itemDetails.amt / this.ttlSPAmoutRs) * 100).toFixed(2).toString();
                  this.totalAmount = this.ttlSPAmout;
                  this.totalAmountRs = this.ttlSPAmoutRs;
                  this.avgStockRate = this.avgSPStockRate;
                  this.avgSPStockRates = this.avgSPStockRate;

                } else {
                  itemDetails.amount = lotItem.amount;
                  itemDetails.amountInRs = lotItem.amountInRs;
                  itemDetails.amt = this.getAmtPer(lotItem.amountInRs, 'Rs.');
                  itemDetails.amtPerc = ((itemDetails.amt / this.ttlSRAmoutRs) * 100).toFixed(2).toString();
                  this.totalAmount = this.ttlSRAmout;
                  this.totalAmountRs = this.ttlSRAmoutRs;
                  this.avgStockRate = this.avgSRStockRate;

                }
                itemDetails.exchangeRate = lotItem.exchangeRate;
                itemDetails.ctsPerc = ((lotItem.totalCarats / this.ttlCarats) * 100).toFixed(2).toString();

                itemDetails.amount = this.format1(itemDetails.amount, ''); //$
                itemDetails.amountInRs = this.format2(itemDetails.amountInRs, ''); //₹
                itemDetails.averageSPRate = this.format2(itemDetails.averageSPRate, '');
                itemDetails.averageStockRate = this.format2(itemDetails.averageStockRate, '');
                this.stockList.push(itemDetails);
                // this.stockList.forEach(ele =>{
                //   // ele.amount = this.format1(ele.amount, '$'); //₹
                //   // ele.amountInRs = this.format2(ele.amountInRs, '₹');
                // })
                this.source.load(this.stockList);
                this.loading = false;
                this.reportStatus = false;
                this.totalCarets = this.ttlCarats;
                this.spRate = this.avgSPRate;
                this.amnt = this.amt;
                this.amntInRs = this.amtRs;
                this.ctsPercent = this.ctsPer;
                this.amntPercent = this.amtPer;
              } else {
                const itemDetails = new StockDetailsSummary();
                itemDetails.lotName = lotItem.lotName;
                itemDetails.totalCarats = lotItem.totalCarats;
                itemDetails.averageSPRate = lotItem.averageSPRate;
                itemDetails.averageStockRate = lotItem.averageStockRate;

                itemDetails.amountSP = lotItem.amountSp;
                itemDetails.amountSPInRs = lotItem.amountSpInRs;
                // itemDetails.amt = this.getAmtPer(lotItem.amountSpInRs, 'Rs.');
                itemDetails.amtSPPerc = ((this.getAmtPer(lotItem.amountSpInRs, 'Rs.') / this.ttlSPAmoutRs) * 100).toFixed(2).toString();
                this.totalAmount = this.ttlSPAmout;
                this.totalAmountRs = this.ttlSPAmoutRs;
                this.avgStockRate = this.avgSPStockRate;
                this.avgSPStockRates = this.avgSPStockRate;

                itemDetails.amountSR = lotItem.amount;
                itemDetails.amountSRInRs = lotItem.amountInRs;
                // itemDetails.amt = this.getAmtPer(lotItem.amountInRs, 'Rs.');
                itemDetails.amtSRPerc = ((this.getAmtPer(lotItem.amountInRs, 'Rs.') / this.ttlSRAmoutRs) * 100).toFixed(2).toString();
                this.totalAmount = this.ttlSRAmout;
                this.totalAmountRs = this.ttlSRAmoutRs;
                this.avgStockRate = this.avgSRStockRate;
                this.totalAmountSP = this.ttlSPAmout;
                this.totalAmountSPRs = this.ttlSPAmoutRs;
                itemDetails.exchangeRate = lotItem.exchangeRate;
                itemDetails.ctsPerc = ((lotItem.totalCarats / this.ttlCarats) * 100).toFixed(2).toString();

                itemDetails.averageSPRate = this.format1(parseFloat(itemDetails.averageSPRate.toString()).toFixed(2), '');
                itemDetails.amountSP = this.format1(parseFloat(itemDetails.amountSP.toString()).toFixed(2), '');
                itemDetails.amountSPInRs = this.format2(parseFloat(itemDetails.amountSPInRs.toString()).toFixed(2), '');
                itemDetails.averageStockRate = this.format1(parseFloat(itemDetails.averageStockRate.toString()).toFixed(2), '');
                itemDetails.amountSR = this.format1(parseFloat(itemDetails.amountSR.toString()).toFixed(2), '');
                itemDetails.amountSRInRs = this.format2(parseFloat(itemDetails.amountSRInRs.toString()).toFixed(2), '');

                this.stockListSummary.push(itemDetails);
                this.source.load(this.stockListSummary);
                this.loading = false;
                this.reportStatus = false;
                this.totalCarets = this.ttlCarats;
                this.spRate = this.avgSPRate;
                this.amnt = this.amt;
                this.amntInRs = this.amtRs;
                this.ctsPercent = this.ctsPer;
                this.amntPercent = this.amtPer;

              }


            });
            // this.spinnerService.hide();
          });
        }
        else {
          const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
          activeModal.componentInstance.showHide = false;
          activeModal.componentInstance.modalHeader = 'Alert';
          activeModal.componentInstance.modalContent = 'Please Select Category!';
          this.loading = false;
        }
      }
  }



  get ttlStockAmtUSD(): number {
    return parseFloat(this.getColTotal('stockAmountUSD').toFixed(3));
  }

  get ttlStockAmtINR(): number {
    return parseFloat(this.getColTotal('stockAmountINR').toFixed(3));
  }

  get ttlsaleAmount(): number {
    return parseFloat(this.getColTotal('saleAmount').toFixed(3));
  }
  get ttlsaleAmountUSD(): number {
    return parseFloat(this.getColTotal('saleAmountUSD').toFixed(3));
  }
  get ttlSaleAmountUSD(): number {
    return parseFloat(this.getColTotal('saleAmtINR').toFixed(3));
  }
  get ttlavgBidPrice(): number {
    return parseFloat(this.getColTotal('avgBidPrice').toFixed(3));
  }
  get ttlsaleAmountINR(): number {
    return parseFloat(this.getColTotal('saleAmountINR').toFixed(3));
  }
  get ttlbidAmt(): number {
    return parseFloat(this.getColTotal('bidAmount').toFixed(3));
  }
  get ttlavgSalePrice(): number {
    return parseFloat(this.getColTotal('avgSalePrice').toFixed(3));
  }
  get ttlCarats(): number {
    return parseFloat(this.getColTotal('totalCarats').toFixed(3));
  }
  get ttlstockAmount(): number {
    return parseFloat(this.getColTotal('stockAmount').toFixed(3));
  }
  get ttlSRAmout(): number {
    return parseFloat(this.getColTotal('amount').toFixed(2));
  }
  get ttlSPAmout(): number {
    return parseFloat(this.getColTotal('amountSp').toFixed(2));
  }
  get ttlSRAmoutRs(): number {
    return parseFloat(this.getColTotal('amountInRs').toFixed(2));
  }
  get ttlSPAmoutRs(): number {
    return parseFloat(this.getColTotal('amountSpInRs').toFixed(2));
  }

  get avgSPStockRate(): number {
    return parseFloat((this.ttlSPAmout / this.ttlCarats).toFixed(2));//((this.ttlAmout/this.ttlCarats));
  }

  get avgSRStockRate(): number {
    return parseFloat((this.ttlSRAmout / this.ttlCarats).toFixed(2));//((this.ttlAmout/this.ttlCarats));
  }
  getStringColTotal(colName: string, sign: any) {
    let total: number;
    total = 0;
    this.tabList.forEach(row => {
      const a = row[colName].replace(/\,/g, '').split(sign)[1];
      // const b = parseFloat(a);
      // const d = parseFloat(a).toFixed();
      // const c = parseFloat(a.toFixed());
      total += parseFloat(a);
    });
    return total;
  }

  getAmtPer(colName: any, sign: any) {
    // const a = colName.replace(/\,/g, '').split(sign)[1];
    const a = colName;
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
  //  get avgStockRate(): number {
  //  // return parseFloat(this.getColTotal('averageStockRate').toFixed(3));
  //  return parseFloat((this.ttlAmout/this.ttlCarats).toFixed(2));//((this.ttlAmout/this.ttlCarats));
  // }
  get amt(): number {
    return parseFloat(this.getColTotal('amount').toFixed(3));
  }

  get ttlavgStockRate(): number {
    return parseFloat(this.getColTotal('avgStockRate').toFixed(3));
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
    this.stockSummaryForm.markAsPristine();
  }

  private createForm() {
    this.stockSummaryForm = this.fb.group({
      'category': ['', Validators.required],
      'lot': ['', Validators.required],
      'level': ['', Validators.required],
      'lotItem': ['', Validators.required],
      'stockType': ['', Validators.required]
      // 'lotMasterName': ['', Validators.required],
    });

    this.category = this.stockSummaryForm.controls['category'];
    this.lot = this.stockSummaryForm.controls['lot'];
    this.level = this.stockSummaryForm.controls['level'];
    this.lotItem = this.stockSummaryForm.controls['lotItem'];
    this.stockType = this.stockSummaryForm.controls['stockType'];
    this.lot.valueChanges.subscribe(val => {
      const index = this.lotList.findIndex(item => {
        if (val == item.lotId) {
          this.lotName = item.lotName;
          return true;
        }
      })
    })

    this.category.valueChanges.subscribe(val => {
      const index = this.catList.findIndex(item => {
        if (val == item.catId) {
          this.catName = item.catName;
          return true;
        }
      })
    })
    this.level.valueChanges.subscribe(val => {

    })

    this.lotItem.valueChanges.subscribe(val => {

    })
    // this.lotMasterName = this.stockSummaryForm.controls['lotMasterName'];
    this.tableParameters = this.stockSummaryForm.controls['tables'];
  }
}
