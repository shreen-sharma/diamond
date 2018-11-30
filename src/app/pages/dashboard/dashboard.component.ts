import { debounceTime } from 'rxjs/operator/debounceTime';
import { ItemSummaryService } from './itemSummary-modal/itemSummary-modal.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit } from '@angular/core';
import { ItemSummaryModal } from 'app/pages/dashboard/itemSummary-modal/itemSummary-modal.component';
import { MovementsReportService } from '.../../app/pages/reports/components/movementsReport/movementsReport.service';
import { LocalDataSource } from 'ng2-smart-table';
import * as Chartist from 'chartist';
import { AuthenticationService } from '../../core/authentication/authentication.service';
import { Router } from "@angular/router";

@Component({
  selector: 'dashboard',
  styleUrls: ['./dashboard.scss', './glyphicons.scss'],
  templateUrl: './dashboard.html'
})
export class Dashboard {

  totalCarats: number;
  totalAmount: number;
  exchangeRate: number;
  totalSalesCarats: number;
  totalSalesAmount: number;
  comCarats: number;
  comSaleAmtUSD: number;
  comSaleAmtINR: number;

  phyCarats: number;
  phySaleAmtUSD: number;
  phySaleAmtINR: number;

  dcCarats: number;
  dcSaleAmtUSD: number;
  dcSaleAmtINR: number;

  conCarats: number;
  conSaleAmtUSD: number;
  conSaleAmtINR: number;

  totalPurchaseCarats: number;
  totalPurchaseAmount: number;
  settings: any;
  source: LocalDataSource = new LocalDataSource();
  top10SoldItem: any[];
  top10Supplier: any[];
  top10Customer: any[];
  balanceSheet: any[];
  balanceSheetSettings: any;
  balanceSource: LocalDataSource = new LocalDataSource();

  supplierSettings: any;
  supplierSource: LocalDataSource = new LocalDataSource();

  customerSettings: any;
  customerSource: LocalDataSource = new LocalDataSource();

  totalPayUSD: number;
  totalRecUSD: number;
  totalPayINR: number;
  totalRecINR: number;
  totalBrokerageAmtUSD: number;
  totalBrokerageAmtINR: number;
  totalNPUSD: number;
  totalNPINR: number;
  totalSales: any = [];
  totalPurchase: any = [];
  permission: any;
  dcCount: number;
  consignmentCount: number;
  receiptCount: number;
  accessList: any[] = [];
  isDashboad1: boolean = true;
  totalPayable: any = [];
  totalReceivables: any = [];

  totalDC: any = [];
  totalCon: any = [];
  flag: boolean = false;

  format1(n, currency) {
    return currency + n.toString().replace(/(\d)(?=(\d{3})+\.)/g, '$1,'); //USD Currency Formatter
  }
  format2(n, currency) {
    return currency + n.toString().replace(/(\d)(?=(\d{2})+\d\.)/g, '$1,'); // INR Currency Formatter
  }

  format3(n, currency) {
    return currency + n.replace(/(\d)(?=(\d{2})+\d\.)/g, '$1,'); // INR Currency Formatter
  }

  constructor(private modalService: NgbModal,
    private service: ItemSummaryService,
    private reportService: MovementsReportService,
    private authService: AuthenticationService,
    private router: Router) {



    // this.service.getLoggedInUserPermission().subscribe(res => {
    //   debugger;
    //   sessionStorage.setItem('UserPermission', JSON.stringify(res));

    // });



    //  this.permission = sessionStorage.getItem('UserPermission');
    // this.service.getStockTotal().subscribe((data) => {

    //   this.totalCarats = data.carats;
    //   this.totalAmount = data.totalSellingAmount;
    //   this.exchangeRate = data.exchangeRate;
    // });

    this.service.getCompletedStockTotal().subscribe(res => {
      debugger;
      this.comCarats= res.ALL.totalCarats;
      this.comSaleAmtUSD = res.ALL.saleAmountUSD;
      this.comSaleAmtINR = res.ALL.saleAmountINR;
      this.exchangeRate = res.PHYSTK.exchRate;
      this.phyCarats = res.PHYSTK.totalCarats;
      this.phySaleAmtUSD = res.PHYSTK.saleAmountUSD;
      this.phySaleAmtINR = res.PHYSTK.saleAmountINR;
      this.dcCarats = res.DCSTK.totalCarats;
      this.dcSaleAmtUSD = res.DCSTK.saleAmountUSD;
      this.dcSaleAmtINR = res.DCSTK.saleAmountINR;
      this.conCarats = res.CONSTK.totalCarats;
      this.conSaleAmtUSD = res.CONSTK.saleAmountUSD;
      this.conSaleAmtINR = res.CONSTK.saleAmountINR;
      console.log(res);
    });



    this.service.getNonClosedDcConsignmentReceiptCounts().subscribe((data) => {

      this.dcCount = data.DC;
      this.consignmentCount = data.consignment;
      this.exchangeRate = data.exchRate;
      this.receiptCount = data.receiptMaster;
    });


    this.service.getFinancialYearOfPayable().subscribe((data) => {
      debugger;
      this.totalPayUSD = data.USD;
      this.totalPayINR = data.INR;

    });

    this.service.getFinancialYearOfReceivable().subscribe((data) => {
      debugger;
      this.totalRecUSD = data.USD;
      this.totalRecINR = data.INR;

    });

    this.service.getFinancialYearTotalPurchase().subscribe((data) => {

      this.totalPurchaseCarats = data.carats;
      this.totalPurchaseAmount = data.amount;

    });

    this.service.getNotCompletedPayableAndReceivable().subscribe((data) => {

      this.totalPayable = data.payable;
      this.totalReceivables = data.receivable;

    });

    this.service.getNotClosedOfConsignmentAndDCForDeliveryChallan().subscribe((data) => {
      debugger;
      this.totalDC = data.DC;
      this.totalCon = data.consignment;

    });

    this.service.getFinancialYearTotalSales().subscribe((data) => {

      this.totalSalesCarats = data.carats;
      this.totalSalesAmount = data.amount;

    });

    this.service.getFinancialYearOfBrokerageAmount().subscribe((data) => {

      this.totalBrokerageAmtUSD = data.USD;
      this.totalBrokerageAmtINR = data.INR;

    });

    this.service.getFinancialYearOfNotionalProfitAmount().subscribe((data) => {

      this.totalNPUSD = data.USD;
      this.totalNPINR = data.INR;

    });

    this.service.getPurchaseAmountForEachMonth().subscribe((data) => {

      setTimeout(() => {
        for (var i = 0; i < Object.keys(data).length; i++) {
          this.totalPurchase[i] = Math.round(data[Object.keys(data)[i]]);
        }

        //  console.log(Math.max.apply(null, this.totalSales));
        /* ----------==========     Completed Tasks Chart initialization    ==========---------- */

        const dataCompletedTasksChart: any = {
          labels: Object.keys(data),//['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct','Nov','Dec','Jan','Feb','Mar'],
          series: [{ meta: 'description', value: this.totalPurchase }]// this.totalSales//[          [120, 170, 700]      ]
        };

        const optionsCompletedTasksChart: any = {
          lineSmooth: Chartist.Interpolation.cardinal({
            tension: 0
          }),
          low: 0,
          high: Math.round(Math.max.apply(null, this.totalPurchase)), // creative tim: we recommend you to set the high sa the biggest value + something for a better look
          chartPadding: { top: 0, right: 0, bottom: 0, left: 0 }
        }

        var completedTasksChart = new Chartist.Line('#completedTasksChart', dataCompletedTasksChart, optionsCompletedTasksChart);

        // start animation for the Completed Tasks Chart - Line Chart
        this.startAnimationForLineChart(completedTasksChart);

      }, 1500);


    })

    this.service.getSalesAmountForEachMonth().subscribe((data) => {

      setTimeout(() => {
        for (var i = 0; i < Object.keys(data).length; i++) {
          this.totalSales[i] = Math.round(data[Object.keys(data)[i]]);
        }

        //  console.log(Math.max.apply(null, this.totalSales));
        const dataDailySalesChart: any = {
          labels: Object.keys(data),//['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct','Nov','Dec','Jan','Feb','Mar'],
          series: [this.totalSales]
        };

        const optionsDailySalesChart: any = {
          lineSmooth: Chartist.Interpolation.cardinal({
            tension: 0
          }),
          low: 0,
          high: Math.round(Math.max.apply(null, this.totalSales)), // creative tim: we recommend you to set the high sa the biggest value + something for a better look
          chartPadding: { top: 0, right: 0, bottom: 0, left: 0 },
        }

        var dailySalesChart = new Chartist.Line('#dailySalesChart', dataDailySalesChart, optionsDailySalesChart);

        this.startAnimationForLineChart(dailySalesChart);


      }, 1500);



      /* ----------==========     Emails Subscription Chart initialization    ==========---------- */

      // var datawebsiteViewsChart = {
      //   labels: Object.keys(data),//['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct','Nov','Dec','Jan','Feb','Mar'],
      //   series: [this.totalSales]// this.totalSales //[          [1200, 1700, 7000]      ]
      // };
      // var optionswebsiteViewsChart = {
      //   axisX: {
      //     showGrid: false
      //   },
      //   low: 0,
      //   high: Math.round(Math.max.apply(null, this.totalSales)),
      //   chartPadding: { top: 0, right: 5, bottom: 0, left: 0 }
      // };
      // var responsiveOptions: any[] = [
      //   ['screen and (max-width: 640px)', {
      //     seriesBarDistance: 5,
      //     axisX: {
      //       labelInterpolationFnc: function (value) {
      //         return value[0];
      //       }
      //     }
      //   }]
      // ];
      // var websiteViewsChart = new Chartist.Bar('#websiteViewsChart', datawebsiteViewsChart, optionswebsiteViewsChart, responsiveOptions);

      // //start animation for the Emails Subscription Chart
      // this.startAnimationForBarChart(websiteViewsChart);
    })


    this.settings = this.prepareVolumeSetting();
    this.reportService.getTopSoldItems().subscribe(res => {
      this.top10SoldItem = res.slice(0, 10);
      this.source.load(res.slice(0, 10));
    });

    this.customerSettings = this.prepareCustomerSetting();
    this.service.getFinancialYearTopCustomer().subscribe(res => {
      this.top10Customer = res;
      res.forEach(ele => {
        ele.USD = this.format1(parseFloat(ele.USD.toString()).toFixed(2), '$');
        ele.INR = this.format2(parseFloat(ele.INR.toString()).toFixed(2), '₹');
      })
      // this.customerSource.load(res);
    });

    this.balanceSheetSettings = this.prepareBalanceSetting();
    this.service.getItemsforBalancesheet().subscribe(res => {
      this.balanceSheet = res;
      //res.forEach(ele => {
      res.IPI_Balance = this.format2(res.IPI_Balance == null ? 0 : res.IPI_Balance, '₹ ');
      res.ESI_Balance = this.format2(res.ESI_Balance == null ? 0 : res.ESI_Balance, '₹ ');
      res.LSI_Balance = this.format2(res.LSI_Balance == null ? 0 : res.LSI_Balance, '₹ ');//this.format2(res.LSI_Balance,'₹');
      res.LPI_Balance = this.format2(res.LPI_Balance == null ? 0 : res.LPI_Balance, '₹ ');// this.format2(res.LPI_Balance,'₹');
      res.KD_Balance = this.format1(res.KD_Balance == null ? 0 : res.KD_Balance, '$ ');//this.format1(res.KD_Balance,'$');
      // })
      // this.balanceSource.load(res);
    })

    this.supplierSettings = this.prepareSupplierSetting();
    this.service.getFinancialYearTopSupplier().subscribe(res => {
      this.top10Supplier = res;
      res.forEach(ele => {
        ele.USD = this.format1(parseFloat(ele.USD.toString()).toFixed(2), '$');
        ele.INR = this.format2(parseFloat(ele.INR.toString()).toFixed(2), '₹');
      })
      this.supplierSource.load(res);
    });
  }

  prepareCustomerSetting() {
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
        USD: {
          title: 'Amount($)',
          type: 'number',
        },
        INR: {
          title: 'Amount(₹)',
          type: 'text',
        }

      }
    };
  }
  public Summary() {
    this.router.navigate(['pages/reports/combinedSummary']);
  }
  public SSummaryRepo() {
    this.router.navigate(['pages/reports/stockSummaryReport']);
  }
  public ODCRepo() {
    this.router.navigate(['pages/reports/dcSummaryReport']);
  }
  public OCRepo() {
    this.router.navigate(['pages/reports/consignmentSummayReport'])
  }
  public SIRepo() {
    this.router.navigate(['pages/reports/localSalesDateWiseReport'])
  }
  public PIRepo() {
    this.router.navigate(['pages/reports/payableImportInvoiceReport'])
  }
  public Top25Rev() {
    this.router.navigate(['pages/reports/top25Revenue'])
  }
  public Top25Profit() {
    this.router.navigate(['pages/reports/top25Profits'])
  }
  public Top25Volume() {
    this.router.navigate(['pages/reports/top25Volume'])
  }
  public LocPurYear() {
    this.router.navigate(['pages/reports/localPurchaseYearlyReport'])
  }
  public StockSize() {
    this.router.navigate(['pages/reports/totalStockSizeReport'])
  }
  public LotItemRepo() {
    this.router.navigate(['pages/reports/lotItemReport'])
  }
  prepareSupplierSetting() {
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
          title: 'Supplier',
          type: 'text',
        },
        USD: {
          title: 'Amount($)',
          type: 'number',
        },
        INR: {
          title: 'Amount(₹)',
          type: 'text',
        }

      }
    };
  }
  prepareBalanceSetting() {
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
        IPI_Balance: {
          title: 'Import Purchase Notional Profit',
          type: 'text',
        },
        ESI_Balance: {
          title: 'Export Sales Profit',
          type: 'number',
        },
        LSI_Balance: {
          title: 'Local Sales Profit',
          type: 'text',
        },
        LPI_Balance: {
          title: 'Local Purchase Notional Profit',
          type: 'text',
        },
        KD_Balance: {
          title: 'Kati Difference Adjustment',
          type: 'text',
        },
      }
    };
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

  private onStockClick() {
    const activeModal = this.modalService.open(ItemSummaryModal, { size: 'lg' });
    activeModal.componentInstance.modalHeader = "STOCK SUMMARY";
  }


  //Yasar Added
  startAnimationForLineChart(chart) {
    let seq: any, delays: any, durations: any;
    seq = 0;
    delays = 80;
    durations = 500;

    chart.on('draw', function (data) {
      if (data.type === 'line' || data.type === 'area') {
        data.element.animate({
          d: {
            begin: 600,
            dur: 700,
            from: data.path.clone().scale(1, 0).translate(0, data.chartRect.height()).stringify(),
            to: data.path.clone().stringify(),
            easing: Chartist.Svg.Easing.easeOutQuint
          }
        });
      } else if (data.type === 'point') {
        seq++;
        data.element.animate({
          opacity: {
            begin: seq * delays,
            dur: durations,
            from: 0,
            to: 1,
            easing: 'ease'
          }
        });
      }
    });

    seq = 0;
  };
  startAnimationForBarChart(chart) {
    let seq2: any, delays2: any, durations2: any;

    seq2 = 0;
    delays2 = 80;
    durations2 = 500;
    chart.on('draw', function (data) {
      if (data.type === 'bar') {
        seq2++;
        data.element.animate({
          opacity: {
            begin: seq2 * delays2,
            dur: durations2,
            from: 0,
            to: 1,
            easing: 'ease'
          }
        });
      }
    });

    seq2 = 0;
  };
  ngOnInit() {
    /* ----------==========     Daily Sales Chart initialization For Documentation    ==========---------- */
    debugger;
    setTimeout(() => {
      this.accessList = this.authService.getUserAccessOfMenu('Dashboard1');
      console.log(this.accessList.length);
      this.isDashboad1 = this.accessList.length > 0 ? false : true;
      this.flag = true;
    }, 1500);


  }
  LSI() {
    this.router.navigate(['/pages/reports/localSalesDateWiseReport']);
  }
  ESI() {
    this.router.navigate(['/pages/reports/exportDateWiseReport']);
  }

  LPI() {
    this.router.navigate(['/pages/reports/localPurchaseDateWiseReport']);
  }
  IPI() {
    this.router.navigate(['/pages/reports/importPurchaseDateWiseReport']);
  }
  IPIC() {
    this.router.navigate(['/pages/reports/importPurchaseSupplierReport']);
  }
  ESIC() {
    this.router.navigate(['/pages/reports/exportCustomerReport']);
  }
  LSIC() {
    this.router.navigate(['/pages/reports/localSalesCustomerReport']);
  }
  LPIC() {
    this.router.navigate(['/pages/reports/localPurchaseSupplierReport']);
  }
  KDC() {
    this.router.navigate(['/pages/reports/kdRegister']);
  }
}
