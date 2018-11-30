import { CommonModalComponent } from '../../../../shared/common-modal/common-modal.component';
import { FormGroup, FormArray, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { AuthenticationService } from '../../../../core/authentication/authentication.service';
import { Logger } from '../../../../core/logger.service';
import { AnalyticsReportService } from './analyticsReport.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
//import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { LotService } from '../../../../pages/stockManagement/components/lots/lot.service';
import { LotItemCreationService } from '../../../stockManagement/components/lotItemCreation/lotItemCreation.service';
import * as jsPDF from 'jspdf';
import * as jpt from 'jspdf-autotable';

const log = new Logger('localPurchaseMonthlyInvoiceReport');



@Component({
  selector: 'analyticsReport',
  templateUrl: './analyticsReport.html',
  styleUrls: ['./analyticsReport.scss'],

})



export class AnalyticsReport implements OnInit {

  analyticsReportForm: FormGroup;
  source: LocalDataSource = new LocalDataSource();

  tabList: any[] = [];
  settings: any;
  lotList: any[] = [];
  itemLotList: any[] = [];
  itemSList: any[] = [];
  partyTypeList: any[] = [];
  supplierList: any[] = [];
  isAgeingReport: boolean = false;
  isAnalyserReport: boolean = false;
  isItemAnalyserReport: boolean = false;
  isItemAnalyserPurReport: boolean = false;
  reportHeading: String;
  currentUser: String;
  loading: boolean = false;
  public fromDate: AbstractControl;
  public toDate: AbstractControl;
  public LotId: AbstractControl;
  public ItemId: AbstractControl;
  public party: AbstractControl;
  public supplier: AbstractControl;

  format1(n, currency) {
    return currency + n.toString().replace(/(\d)(?=(\d{3})+\.)/g, '$1,'); //USD Currency Formatter
  }
  format2(n, currency) {
    return currency + n.toString().replace(/(\d)(?=(\d{2})+\d\.)/g, '$1,'); // INR Currency Formatter
  }

  constructor(private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private service: AnalyticsReportService,
    private modalService: NgbModal,
    private lotService: LotService,
    private lotItemService: LotItemCreationService,
    //private spinnerService: Ng4LoadingSpinnerService,
    private authService: AuthenticationService) {
    this.createForm();
    this.currentUser = sessionStorage.getItem("loggedUser");
    this.lotList = []
    this.lotService.getData().subscribe((lotList) => {
      this.lotList = lotList;
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
  prepareStockAgeingSetting() {
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
        },
        avgRate: {
          title: 'Avg. Rate',
          type: 'number',
        },
        salePrice: {
          title: 'Sale Price',
          type: 'number',
        },
        days: {
          title: 'Days',
          type: 'number',
        },
        updatedDate: {
          title: 'Last Updated Date',
          type: 'date',
        },

      }
    };
  }


  prepareSalesVolumeSetting() {
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


  prepareitemAnalyserBySaleSetting() {
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
        itemName: {
          title: 'Item',
          type: 'text',
        },
        customerName: {
          title: 'Customer',
          type: 'text',
        },
        invoiceId: {
          title: 'Invoice No.',
          type: 'text',
        },
        carats: {
          title: 'Carats',
          type: 'text',
        },
        invoiceDate: {
          title: 'Sales Date.',
          type: 'text',
        },
        sellingPrice: {
          title: 'Selling Price',
          type: 'text',
        },
        invoicePrice: {
          title: 'Invoice Price',
          type: 'text',
        },
        invoiceRate: {
          title: 'Invoice Rate',
          type: 'text',
        },
        brokPer: {
          title: 'Brokerage %',
          type: 'text'
        },
        commPer: {
          title: 'Commission %',
          type: 'text'
        },
        discPer: {
          title: 'Disc %',
          type: 'text'
        },
        odedPer: {
          title: 'Other Deduction %',
          type: 'text'
        },
        invoiceType: {
          title: 'Invoice Type',
          type: 'text',
        }

      }
    };
  }


  prepareitemAnalyserByPurchaseSetting() {
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
        itemName: {
          title: 'Item',
          type: 'text',
        },
        supplierName: {
          title: 'Vendor',
          type: 'text',
        },
        invoiceId: {
          title: 'Invoice No.',
          type: 'text',
        },
        carats: {
          title: 'Carats',
          type: 'text',
        },
        invoiceDate: {
          title: 'Purchase Date.',
          type: 'text',
        },
        sellingPrice: {
          title: 'Selling Price',
          type: 'text',
        },
        invoicePrice: {
          title: 'Invoice Price',
          type: 'text',
        },
        amount: {
          title: 'Invoice Cost',
          type: 'text',
        },
        brokerage: {
          title: 'Brokerage',
          type: 'text'
        },
        discount: {
          title: 'Discount',
          type: 'text'
        },
        commision: {
          title: 'Commission',
          type: 'text'
        },
        otherDed: {
          title: 'Other Deduction',
          type: 'text'
        },
        invoiceType: {
          title: 'Invoice Type',
          type: 'text',
        }

      }
    };
  }


  prepareitemAnalyserBySupplieretting() {
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
        supplierName: {
          title: 'Vendor',
          type: 'text',
        },
        carats: {
          title: 'Total Carats',
          type: 'number',
        },
        averageInvoiceCost: {
          title: 'Avg. Inv Cost',
          type: 'text',
        },
        sellingPrice: {
          title: 'Selling Price',
          type: 'text',
        }

      }
    };
  }

  prepareitemAnalyserByCustomerSetting() {
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
        customerName: {
          title: 'Customer',
          type: 'text',
        },
        carats: {
          title: 'Total Carats',
          type: 'number',
        },
        averageInvoiceCost: {
          title: 'Avg. Inv Cost',
          type: 'text',
        },
        sellingPrice: {
          title: 'Selling Price',
          type: 'text',
        }

      }
    };
  }

  ngOnInit() {
    this.fromDate.setValue(this.dateFormate(new Date()));
    this.toDate.setValue(this.dateFormate(new Date()));

    if (this.router.url.includes('salesVolumeReport')) {
      this.reportHeading = 'Sales Volume Report';
      this.settings = this.prepareSalesVolumeSetting();
      this.SalesVolumeReport();

    } else if (this.router.url.includes('stockAgeingReport')) {
      this.loading = true;
      this.reportHeading = 'Stock Ageing Report';
      this.isAgeingReport = true;
      this.isAnalyserReport = false;
      this.settings = this.prepareStockAgeingSetting();
      this.StockAgeingReport();

    } else if (this.router.url.includes('itemAnalyserBySale')) {
      this.reportHeading = 'Item Analyser Sales Report';
      this.isItemAnalyserReport = true;
      this.isAnalyserReport = true;
      this.isAgeingReport = true;
      this.settings = this.prepareitemAnalyserBySaleSetting();
      this.loading = true;
      this.service.getItemAnalyzerForSales(-1,-1,-1,-1,-1).subscribe((tabList) => {
            if (tabList.length > 0) {
              this.tabList = tabList;
              tabList.forEach(ele=>{
                ele.sellingPrice = this.format2(parseFloat(ele.sellingPrice.toString()).toFixed(2),'');
                ele.invoicePrice = this.format2(parseFloat(ele.invoicePrice.toString()).toFixed(2),'');
                ele.invoiceRate = this.format2(parseFloat(ele.invoiceRate.toString()).toFixed(2),'');
              })
              this.source.load(tabList);
            }
            this.loading = false;
            //this.spinnerService.hide();
          });
    } else if (this.router.url.includes('itemAnalyserByPurchase')) {
      debugger;
      this.reportHeading = 'Item Analyser Purchase Report';
      this.isAnalyserReport = true;
      this.isAgeingReport = true;
      this.isItemAnalyserPurReport = true;
      this.settings = this.prepareitemAnalyserByPurchaseSetting();
      this.loading = true;
      this.service.getItemAnalyzerForPurchase(-1,-1,-1,-1,-1).subscribe(lst => {
      this.tabList = lst;
      // lst.forEach(ele=>{
      //   ele.sellingPrice = this.format2(parseFloat(ele.sellingPrice.toString()).toFixed(2),'');
      //   ele.invoicePrice = this.format2(parseFloat(ele.invoicePrice.toString()).toFixed(2),'');
      // })
      this.source.load(lst);
      this.loading = false;
    });
    } else if (this.router.url.includes('itemAnalyserByCustomer')) {
      this.reportHeading = 'Item Analyser Customer Report';
      this.isAnalyserReport = true;
      this.isAgeingReport = true;
      this.settings = this.prepareitemAnalyserByCustomerSetting();

    } else if (this.router.url.includes('itemAnalyserBySupplier')) {
      this.reportHeading = 'Item Analyser Vendor Report';
      this.isAnalyserReport = true;
      this.isAgeingReport = true;
      this.settings = this.prepareitemAnalyserBySupplieretting();

    }

    this.service.getAllPartyEntityByType('CU').subscribe( (partyTypeList) => {
      partyTypeList.forEach(element => {
        if (element) {
        this.partyTypeList.push(element);
        }
      });
    })

    this.service.getAllPartyEntityByType('SU').subscribe( (supplierList) => {
      supplierList.forEach(ele => {
        if(ele) {
          this.supplierList.push(ele);
        }
      })
    })
  }

    


  onChangeSLot(lotId: any): void {


    this.lotItemService.getAllLotItemByLotId(lotId).subscribe(itemLotList => {
      this.itemLotList = itemLotList;
      if (this.itemLotList.length > 0) {
        this.itemSList = [];

        this.itemLotList.forEach(lotItem => {
          // if (this.category.value == lotItem.itemMaster.categoryMaster.catId && lotItem.lotMaster.lotId == lotId) {
          this.itemSList.push(lotItem);
          // }
        });

      }
    });


  }

  SalesVolumeReport() {
    debugger
    this.service.getSalesVolumeReport(this.fromDate.value, this.toDate.value).subscribe(lst => {
      this.tabList = lst;
      this.source.load(lst);
      this.loading = false;
    });
  }

  ItemAnalyserBySalesReport() {
    this.service.getItemAnalyzerForSales(this.LotId.value == "" ? -1 : this.LotId.value, this.ItemId.value == "" ? -1:this.ItemId.value, 
    this.fromDate.value, this.toDate.value.toString(), this.party.value == "" ? -1 : this.party.value).subscribe(lst =>{
      this.tabList = lst;
      this.source.load(lst);
      this.loading = false;
    })
  }

  StockAgeingReport() {
    this.service.getStockAgeingReport().subscribe(lst => {
      this.tabList = lst;
      lst.forEach(ele=>{
        ele.avgRate = this.format2(parseFloat(ele.avgRate.toString()).toFixed(2),'');
        ele.salePrice = this.format2(parseFloat(ele.salePrice.toString()).toFixed(2),'');
      })
      this.source.load(lst);
      this.loading = false;
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
  today(): string {
    const today = new Date();
    const dd = today.getDate();
    const mm = today.getMonth() + 1; //January is 0!

    const yyyy = today.getFullYear();
    return yyyy + '-' + (mm < 10 ? '0' + mm : mm) + '-' + (dd < 10 ? '0' + dd : dd);
  }

  ConvertToPDF() {

    let doc = new jsPDF('landscape', 'pt'); jpt;
    if (this.router.url.includes('stockAgeingReport')) {
      doc.setFontType('underline');
      doc.text(this.reportHeading, 340, 25);
      doc.setFontSize(10);
      doc.text(this.now(), 720, 20);
      doc.text(this.currentUser,745,30);
      var columns = [
        { title: "Lot Name", dataKey: "lotName" },
        { title: "Item Name", dataKey: "itemName" },
        { title: "Total Carats", dataKey: "totalCarats" },
        { title: "Avg. Rate", dataKey: "avgRate" },
        { title: "Sale Price", dataKey: "salePrice" },
        { title: "Days", dataKey: "days" },
        { title: "Last Updated Date", dataKey: "updatedDate" }

      ];
      doc.autoTable(columns, this.tabList, {
        styles: {
          overflow: 'linebreak',
          halign: 'left'
        }
      });
      doc.save(this.reportHeading + '.pdf');
    }
    else if (this.router.url.includes('itemAnalyserBySale')) {
      doc.setFontType('underline');
      doc.text(this.reportHeading, 340, 25);
      doc.setFontSize(10);
      doc.text(this.now(), 720, 20);
      doc.text(this.currentUser,745,30);
      var columns = [
        { title: "Lot Name", dataKey: "lotName" },
        { title: "Item Name", dataKey: "itemName" },
        { title: "Customer", dataKey: "customerName" },
        { title: "Invoice No.", dataKey: "invoiceId" },
        { title: "Total Carats", dataKey: "carats" },
        { title: "Sales Date", dataKey: "invoiceDate" },
        { title: "Selling Price", dataKey: "sellingPrice" },
        { title: "Invoice Price", dataKey: "invoicePrice" },
        { title: "Invoice Rate", dataKey: "invoiceRate" },
        { title: "Brokerage %", dataKey: "brokPer" },
        { title: "Commission %", dataKey:"commPer" },
        { title: "Disc %", dataKey: "discPer" },
        { title: "Other Deduction %", dataKey: "odedPer" },
        { title: "Invoice Type", dataKey: "invoiceType" }

      ];
      doc.autoTable(columns, this.tabList, {
        styles: {
          overflow: 'linebreak',
          halign: 'left'
        }
      });
      doc.save(this.reportHeading + '.pdf');
    }
    else if (this.router.url.includes('itemAnalyserByPurchase')) {
      doc.setFontType('underline');
      doc.text(this.reportHeading, 340, 25);
      doc.setFontSize(10);
      doc.text(this.now(), 720, 20);
      doc.text(this.currentUser,745,30);
      var columns = [
        { title: "Lot Name", dataKey: "lotName" },
        { title: "Item Name", dataKey: "itemName" },
        { title: "Vendor", dataKey: "supplierName" },
        { title: "Invoice No.", dataKey: "invoiceId" },
        { title: "Total Carats", dataKey: "carats" },
        { title: "Purchase Date", dataKey: "invoiceDate" },
        { title: "Selling Price", dataKey: "sellingPrice" },
        { title: "Invoice Cost", dataKey: "invoicePrice" },
        { title: "Invoice Price", dataKey: "amount" },
        { title: "Brokerage", dataKey: "brokerage" },
        { title: "Commission", dataKey:"commision" },
        { title: "Discount", dataKey: "discount" },
        { title: "Other Deduction %", dataKey: "otherDed" },
        { title: "Invoice Type", dataKey: "invoiceType" }

      ];
      doc.autoTable(columns, this.tabList, {
        styles: {
          overflow: 'linebreak',
          halign: 'left'
        }
      });
      doc.save(this.reportHeading + '.pdf');
    }
    else if (this.router.url.includes('itemAnalyserBySupplier')) {
      doc.setFontType('underline');
      doc.text(this.reportHeading, 330, 25);
      doc.setFontSize(10);
      doc.text(this.now(), 720, 20);
      doc.text(this.currentUser,745,30);
      var columns = [
        { title: "Vendor Name", dataKey: "supplierName" },
        { title: "Total Carats", dataKey: "carats" },
        { title: "Avg. Invoice Cost", dataKey: "averageInvoiceCost" },
        { title: "Selling Price", dataKey: "sellingPrice" }

      ];
      doc.autoTable(columns, this.tabList, {
        styles: {
          overflow: 'linebreak',
          halign: 'left'
        }
      });
      doc.save(this.reportHeading + '.pdf');
    }
    else if (this.router.url.includes('itemAnalyserByCustomer')) {
      doc.setFontType('underline');
      doc.text(this.reportHeading, 330, 25);
      doc.setFontSize(10);
      doc.text(this.now(), 720, 20);
      doc.text(this.currentUser,745,30);
      var columns = [
        { title: "Customer Name", dataKey: "customerName" },
        { title: "Total Carats", dataKey: "carats" },
        { title: "Avg. Invoice Cost", dataKey: "averageInvoiceCost" },
        { title: "Selling Price", dataKey: "sellingPrice" }

      ];
      doc.autoTable(columns, this.tabList, {
        styles: {
          overflow: 'linebreak',
          halign: 'left'
        }
      });
      doc.save(this.reportHeading + '.pdf');
    }
    else {
      doc.setFontType('underline');
      doc.text(this.reportHeading, 330, 25);
      doc.setFontSize(10);
      doc.text(this.now(), 720, 20);
      doc.text(this.currentUser,745,30);
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
    }
  }

  ConvertToCSV() {
    debugger
    // var options = {
    //   fieldSeparator: ',',
    //   quoteStrings: '"',
    //   decimalseparator: '.',
    //   showLabels: false,
    //   showTitle: false,
    //   useBom: false,

    // };

    var heading;
    if (this.router.url.includes('stockAgeingReport')) {
      var options = {
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalseparator: '.',
        showLabels: true,
        showTitle: true,
        useBom: true,
        headers: ['Lot Id', 'Item Id', 'Lot', 'Item', 'Total Carats', 'Avg. Rate', 'Sale Price', 'Days', 'Last Updated Date'],
        title: 'Stock Ageing Report' + ',' + '\n' + 'Date ' + ',' + this.today() + ',' + '\n' + 'User' + ',' + this.currentUser
      };
      heading = 'Stock Ageing Report';
      //  var head = ['Lot', 'Item', 'Total Carats', 'Avg. Rate', 'Sale Price', 'Days', 'Last Updated Date'];
    }
    else if (this.router.url.includes('itemAnalyserBySale')) {
      debugger;
      var options = {
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalseparator: '.',
        showLabels: true,
        showTitle: true,
        useBom: true,
        headers: ['Brokerage %', 'Sales Date','Lot','Customer','Invoice Rate', 'Item','Selling Price','Commission %','Discount %', 'Total Carats','Customer ID', 'Invoice Type','Invoice No.', 'Invoice Price', 'Other Deduction %'],
        title: 'Item Analyzer Sales Report' + ',' + '\n' + 'Date ' + ',' + this.today() + ',' + '\n' + 'User' + ',' + this.currentUser
      };
      heading = 'Item Analyzer Sales Report';
    }
    else if (this.router.url.includes('itemAnalyserByPurchase')) {
      var options = {
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalseparator: '.',
        showLabels: true,
        showTitle: true,
        useBom: true,
        headers: ['Vendor',	'Brokerage'	,'Other Deduction',	'Invoice Cost',	'Discount',	'Purchase Date',	'Commission',	'Lot Name',	
        'Item Name'	,'Selling Price',	'Carats',	'Invoice Type'	,'Supplier ID', 'Invoice Price'
        ],
        title: 'Item Analyzer Purchase Report' + ',' + '\n' + 'Date ' + ',' + this.today() + ',' + '\n' + 'User' + ',' + this.currentUser
      };
      heading = 'Item Analyzer Purchase Report';
    }
    else if (this.router.url.includes('itemAnalyserBySupplier')) {
      var options = {
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalseparator: '.',
        showLabels: true,
        showTitle: true,
        useBom: true,
        headers: ['Vendor', 'Total Carats', 'Avg. Invoice Cost', 'Selling Price'],
        title: 'Item Analyzer Vendor Report' + ',' + '\n' + 'Date ' + ',' + this.today() + ',' + '\n' + 'User' + ',' + this.currentUser
      };
      heading = 'Item Analyzer Vendor Report';
    }
    else if (this.router.url.includes('itemAnalyserByCustomer')) {
      var options = {
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalseparator: '.',
        showLabels: true,
        showTitle: true,
        useBom: true,
        headers: ['Customer', 'Total Carats', 'Avg. Invoice Cost', 'Selling Price'],
        title: 'Item Analyzer Customer Report' + ',' + '\n' + 'Date ' + ',' + this.today() + ',' + '\n' + 'User' + ',' + this.currentUser
      };
      heading = 'Item Analyzer Customer Report';
    }
    else {
      var options = {
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalseparator: '.',
        showLabels: true,
        showTitle: true,
        useBom: true,
        headers: ['Lot Id', 'Lot', 'Item', 'Total Carats'],
        title: 'Sales Volume Report' + ',' + '\n' + 'Date ' + ',' + this.today() + ',' + '\n' + 'User' + ',' + this.currentUser
      };
      heading = 'Sales Volume Report';
    }
    // this.tabList = this.tabList.filter(item => item !== "lotId");
    // this.tabList = this.tabList.filter(item => item !== "lotId");
    // this.deleteMsg('lotId');
    debugger;
    new Angular2Csv(this.tabList, heading, options);


  }


  deleteMsg(msg: string) {
    const index: number = this.tabList.indexOf(msg);
    if (index !== -1) {
      this.tabList.splice(index, 1);
    }
  }


  createReport() {

    // if (this.router.url.includes('salesVolumeReport')) {
    //   this.settings = this.prepareSalesVolumeSetting();
    //   this.SalesVolumeReport();

    // }
    this.loading = true;
    if (this.router.url.includes('salesVolumeReport')) {

      this.settings = this.prepareSalesVolumeSetting();
      this.SalesVolumeReport();

    } else if (this.router.url.includes('stockAgeingReport')) {

      this.isAgeingReport = true;
      this.isAnalyserReport = false;
      this.settings = this.prepareStockAgeingSetting();
      this.StockAgeingReport();

    } else if (this.router.url.includes('itemAnalyserBySale')) {

      this.isAnalyserReport = true;
      this.isAgeingReport = true;
      // this.settings = this.prepareitemAnalyserBySaleSetting();
      this.getItemAnalyzerForSales();

    } else if (this.router.url.includes('itemAnalyserByPurchase')) {

      this.isAnalyserReport = true;
      this.isAgeingReport = true;
      // this.settings = this.prepareitemAnalyserByPurchaseSetting();
      this.getItemAnalyzerForPurchase();

    } else if (this.router.url.includes('itemAnalyserByCustomer')) {

      this.isAnalyserReport = true;
      this.isAgeingReport = true;
      this.getCustomerAnalyzeByItemWise();

    } else if (this.router.url.includes('itemAnalyserBySupplier')) {

      this.isAnalyserReport = true;
      this.isAgeingReport = true;
      this.getSupplierAnalyzeByItemWise();
    }

  }

  getCustomerAnalyzeByItemWise() {
    if(this.LotId.value !="" && this.ItemId.value!=""){
    this.service.getCustomerAnalyzeByItemWise(this.LotId.value, this.ItemId.value).subscribe(lst => {
      this.tabList = lst;
      lst.forEach(ele=>{
        ele.averageInvoiceCost = this.format2(parseFloat(ele.averageInvoiceCost.toString()).toFixed(2),'');
        ele.sellingPrice = this.format2(parseFloat(ele.sellingPrice.toString()).toFixed(2),'');
      })
      this.source.load(lst);
      this.loading = false;
    });
  } else{
    const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
        activeModal.componentInstance.showHide = false;
        activeModal.componentInstance.modalHeader = 'Alert';
        activeModal.componentInstance.modalContent = 'Please Select Lot and Item!';
        this.loading = false;
  }
  }

  getSupplierAnalyzeByItemWise() {
    if(this.LotId.value !="" && this.ItemId.value!=""){
    this.service.getSupplierAnalyzeByItemWise(this.LotId.value, this.ItemId.value).subscribe(lst => {
      this.tabList = lst;
      lst.forEach(ele=>{
        ele.averageInvoiceCost = this.format2(parseFloat(ele.averageInvoiceCost.toString()).toFixed(2),'');
        ele.sellingPrice = this.format2(parseFloat(ele.sellingPrice.toString()).toFixed(2),'');
      })
      this.source.load(lst);
      this.loading = false;
    });
  } else{
    const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
        activeModal.componentInstance.showHide = false;
        activeModal.componentInstance.modalHeader = 'Alert';
        activeModal.componentInstance.modalContent = 'Please Select Lot and Item!';
        this.loading = false;
  }
  }

  getItemAnalyzerForSales() {
    this.service.getItemAnalyzerForSales(this.LotId.value == "" ? -1 : this.LotId.value, this.ItemId.value == "" ? -1:this.ItemId.value, 
    this.fromDate.value, this.toDate.value.toString(), this.party.value == "" ? -1 : this.party.value).subscribe(lst => {
      this.tabList = lst;
      lst.forEach(ele=>{
        ele.sellingPrice = this.format2(parseFloat(ele.sellingPrice.toString()).toFixed(2),'');
        ele.invoicePrice = this.format2(parseFloat(ele.invoicePrice.toString()).toFixed(2),'');
        ele.invoiceRate = this.format2(parseFloat(ele.invoiceRate.toString()).toFixed(2),'');
      })
      this.source.load(lst);
      this.loading = false;
    });

  }

  getItemAnalyzerForPurchase() {
    this.service.getItemAnalyzerForPurchase(this.LotId.value == "" ? -1: this.LotId.value, this.ItemId.value == "" ? -1:this.ItemId.value, 
            this.fromDate.value, this.toDate.value.toString(), this.supplier.value == "" ? -1 : this.supplier.value).subscribe(lst => {
      this.tabList = lst;
      // lst.forEach(ele=>{
      //   ele.sellingPrice = this.format2(parseFloat(ele.sellingPrice.toString()).toFixed(2),'');
      //   ele.invoicePrice = this.format2(parseFloat(ele.invoicePrice.toString()).toFixed(2),'');
      // })
      this.source.load(lst);
      this.loading = false;
    });

  }

  bindData() {

  }



  finally() {
    //  this.isLoading = false;
    this.analyticsReportForm.markAsPristine();
  }

  private createForm() {
    this.analyticsReportForm = this.fb.group({

      'fromDate': ['', Validators.required],
      'toDate': ['', Validators.required],
      'lotId': ['', Validators.required],
      'itemId': ['', Validators.required],
      'party':['',Validators.required],
      'supplier':['',Validators.required]
      // 'lotMasterName': ['', Validators.required],
    });


    this.fromDate = this.analyticsReportForm.controls['fromDate'];
    this.toDate = this.analyticsReportForm.controls['toDate'];
    this.LotId = this.analyticsReportForm.controls['lotId'];
    this.ItemId = this.analyticsReportForm.controls['itemId'];
    this.party = this.analyticsReportForm.controls['party'];
    this.supplier = this.analyticsReportForm.controls['supplier'];
  }
}
