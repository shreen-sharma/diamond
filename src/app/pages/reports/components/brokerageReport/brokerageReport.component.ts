import { CommonModalComponent } from '../../../../shared/common-modal/common-modal.component';
import { FormGroup, FormArray, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { PartyDetailsService } from 'app/pages/company/components/partyDetails/partyDetails.service';
import { LocalDataSource } from 'ng2-smart-table';
import { AuthenticationService } from '../../../../core/authentication/authentication.service';
import { Logger } from '../../../../core/logger.service';
import { BrokerageReportService } from './brokerageReport.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
import { CommonService } from 'app/pages/masters/components/common/index';
//import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
//import { PartyDetailsService } from 'app/pages/company/components/partyDetails/partyDetails.service';
import * as jsPDF from 'jspdf';
import * as jpt from 'jspdf-autotable';
import { debug } from 'util';


const log = new Logger('brokerageReport');



@Component({
  selector: 'brokerageReport',
  templateUrl: './brokerageReport.html',
  styleUrls: ['./brokerageReport.scss'],

})



export class BrokerageReport implements OnInit {


  format1(n, currency) {
    return currency + n.toString().replace(/(\d)(?=(\d{3})+\.)/g, '$1,'); //USD Currency Formatter
  }
  format2(n, currency) {
    return currency + n.toString().replace(/(\d)(?=(\d{2})+\d\.)/g, '$1,'); // INR Currency Formatter
  }

  analyticsReportForm: FormGroup;
  source: LocalDataSource = new LocalDataSource();

  tabList: any[] = [];
  settings: any;
  isBroker: boolean = false;
  isBrokerAgeReport: boolean = false;
  public party: AbstractControl;
  public toDate: AbstractControl;
  public level: AbstractControl;
  public fromDate: AbstractControl;
  public invoice: AbstractControl;
  reportHeading: String;
  currentUser: String;
  loading: boolean = false;
  partyTypeList: Observable<any[]>;
  partyTypeList1: Observable<any[]>;
  invoiceTypeList: any[] = [];
  isreceivableCustBrok: boolean = false;
  isreceivableByBrok: boolean = false;
  isKDRegister: boolean = false;
  isPayableCustBrok: boolean = false;
  isPayableByBrok: boolean = false;
  isConDcRegister: boolean = false;
  ispayableDue: boolean = false;
  isreceivableDue: boolean = false;
  constructor(private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private service: BrokerageReportService,
    private modalService: NgbModal,
    private partyService: PartyDetailsService,
    //private spinnerService: Ng4LoadingSpinnerService,
    private authService: AuthenticationService,
    private commonService: CommonService) {
    this.createForm();
    this.currentUser = sessionStorage.getItem("loggedUser");
    this.commonService.getAllCommonMasterByType('IT').subscribe((code) => {
      this.invoiceTypeList = code.filter(
        task => task.code === "IPI" || task.code === "LPI" || task.code === "ESI" || task.code === "LSI");
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

  prepareSalesCustomerBrokerage() {
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
        partyName: {
          title: 'Customer',
          type: 'text',
        },
        invoiceType: {
          title: 'Invoice Type',
          type: 'text',
        },
        brokerageAmount: {
          title: 'Brokerage Amount',
          type: 'number',
        },
        netAmount: {
          title: 'NetAmount',
          type: 'number',
        },
        brokerName: {
          title: 'Broker',
          type: 'text',
        },


      }
    };
  }


  prepareBrokerageByBroker() {
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
        invoiceId: {
          title: 'Invoice Id',
          type: 'text',
        },
        partyName: {
          title: 'Party Name',
          type: 'text',
        },
        invoiceType: {
          title: 'Invoice Type',
          type: 'text',
        },

        brokerageAmount: {
          title: 'BrokerageAmount',
          type: 'text',
        },
        netAmount: {
          title: 'NetAmount',
          type: 'text',
        },
        brokerName: {
          title: 'Broker',
          type: 'text',
        }

      }
    };
  }



  preparePayableDue() {
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
        invoiceNumber: {
          title: 'Invoice Id',
          type: 'text',
        },
        partyName: {
          title: 'Party Name',
          type: 'text',
        },
        invoiceType: {
          title: 'Invoice Type',
          type: 'text',
        },

        purchaseDate: {
          title: 'Invoice Date',
          type: 'text',
        },
        dueDate: {
          title: 'Due Date',
          type: 'text',
        },
        netAmount: {
          title: 'NetAmount',
          type: 'number',
        },
        paidAmount: {
          title: 'Paid Amount',
          type: 'number',
        },
        pendingAmount: {
          title: 'Pending Amount',
          type: 'number',
        }

      }
    };
  }

  prepareSettingKD() {
    return {
      hideSubHeader: 'true',
      actions: {
        position: 'right',
        add: false,
        edit: false,
        delete: false,
      },

      mode: 'external',

      columns: {
        lotName: {
          title: 'Lot Name',
          type: 'string',
        },
        itemName: {
          title: 'Item Name',
          type: 'string',
        },
        stockUpdationDate: {
          title: 'Updation Date',
          type: 'string'
        },
        prevCarats: {
          title: 'Previous Carats',
          type: 'number'
        },
        adjustedCarats: {
          title: 'Adjusted Carats',
          type: 'number'
        },
        prevRate: {
          title: 'Previous Rate',
          type: 'number'
        },
        adjustedRate: {
          title: 'Adjusted Rate',
          type: 'number'
        },
        invoiceType: {
          title: 'Invoice Type',
          type: 'string'
        },
        invoiceNumber: {
          title: 'Invoice No',
          type: 'number'
        },
        remarks: {
          title: 'Remarks',
          type: 'string'
        },
      }
    };
  }

  prepareSettingPI() {
    return {
      hideSubHeader: 'true',
      actions: {
        position: 'right',
        add: false,
        edit: false,
        delete: false,
      },

      mode: 'external',

      columns: {
        invoice_id: {
          title: 'Invoice ID',
          type: 'number'
        },
        // lot_name: {
        //   title: 'Lot Name',
        //   type: 'string'
        // },
        // item_name: {
        //   title: 'Item Name',
        //   type: 'string'
        // },
        supplier_name: {
          title: 'Supplier Name',
          type: 'string'
        },
        order_id: {
          title: 'Order ID',
          type: 'number'
        },
        invoice_date: {
          title: 'Invoice Date',
          type: 'string'
        },
        purchased_carats: {
          title: 'Purchased Carats',
          type: 'string',
        },
        invoiced_carats: {
          title: 'Invoice Carats',
          type: 'string'
        },
        invoice_type: {
          title: 'Invoice Type',
          type: 'string'
        },
        kattiDifference: {
          title: 'Kati Difference',
          type: 'number',
        },
        rate: {
          title: 'Rate',
          type: 'number',
        },
        kattiAmount: {
          title: 'Kati Amount',
          type: 'number',
        }
      }
    };
  }

  prepareSettingConDCReg() {
    return {
      hideSubHeader: 'true',
      actions: {
        position: 'right',
        add: false,
        edit: false,
        delete: false,
      },

      mode: 'external',

      columns: {
        partyName: {
          title: "Party Name",
          type: 'string'
        },
        issueNo: {
          title: "Issue No.",
          type: 'string'
        },
        receiptDate: {
          title: "Receipt Date",
          type: 'string'
        },
        dcCloseDate: {
          title: "Close Date",
          type: 'string'
        },
        returnNo: {
          title: "Return No.",
          type: 'string'
        },
        returnIssueRefNo: {
          title: "Issue Ref. No.",
          type: 'string'
        },
        totalIssuedCarats: {
          title: "Total Issued Carats",
          type: 'string'
        },
        rejectedCts: {
          title: "Rejected Carats",
          type: 'string'
        },
        isConsignment: {
          title: "Consignment",
          type: 'string'
        }
      }
    };
  }

  ngOnInit() {
    this.fromDate.setValue(this.dateFormate(new Date()));
    this.toDate.setValue(this.dateFormate(new Date()));

    if (this.router.url.includes('receivablesByBroker')) {
      this.reportHeading = 'Receivables By Broker Report';
      this.partyTypeList = this.partyService.getPartyByType('BR');
      this.partyTypeList1 = this.partyService.getPartyByType('CU');
      this.settings = this.prepareBrokerageByBroker();
      this.ReceivablesByBroker();
      this.isBroker = true;
      this.isBrokerAgeReport = true;
      this.isreceivableByBrok = true;
    } else if (this.router.url.includes('receivablesCustomerBrokerage')) {
      this.reportHeading = 'Receivables By Customer Brokerage Report';
      this.partyTypeList = this.partyService.getPartyByType('CU');
      this.settings = this.prepareSalesCustomerBrokerage();
      this.ReceivablesCustomerBrokerage();
      this.isBrokerAgeReport = true;
      this.isreceivableCustBrok = true;
    } else if (this.router.url.includes('payableCustomerBrokerage')) {
      this.reportHeading = 'Payable By Customer Brokerage Report';
      this.partyTypeList = this.partyService.getPartyByType('SU');
      this.settings = this.prepareSalesCustomerBrokerage();
      this.PayableCustomerBrokerage();
      this.isBrokerAgeReport = true;
      this.isPayableCustBrok = true;
    } else if (this.router.url.includes('payableByBroker')) {
      this.reportHeading = 'Payable By Broker Report';
      this.isBroker = true;
      this.partyTypeList = this.partyService.getPartyByType('BR');
      this.settings = this.prepareBrokerageByBroker();
      this.PayableByBroker();
      this.isBrokerAgeReport = true;
      this.isPayableByBrok = true;
    } else if (this.router.url.includes('payableDue')) {
      this.reportHeading = 'Payable Due Report'
      this.settings = this.preparePayableDue();
      this.payableDue();
      this.isBrokerAgeReport = false;
      this.loading = true;
      this.ispayableDue = true;
    } else if (this.router.url.includes('receivableDue')) {
      this.reportHeading = 'Receivable Due Report';
      this.settings = this.preparePayableDue();
      this.receivableDue();
      this.isBrokerAgeReport = false;
      this.loading = true;
      this.isreceivableDue = true;
    } else if (this.router.url.includes('kdRegister')) {
      this.reportHeading = 'KD Register Report';
      this.settings = this.prepareSettingKD();
      this.KD();
      this.isBrokerAgeReport = false;
      this.loading = true;
    }
    else if (this.router.url.includes('kdAgainstPI')) {
      this.reportHeading = 'KD Against PI Report';
      this.settings = this.prepareSettingPI();
      // this.KDAgainstPI();
      this.isBrokerAgeReport = false;
      this.isKDRegister = true;
      // this.isreceivableByBrok=true;
      this.commonService.getAllCommonMasterByType('IT').subscribe((code) => {
        this.invoiceTypeList = code.filter(
          task => task.code === "IPI" || task.code === "LPI");
      });
      this.partyService.getPartyByType('SU').subscribe(res => {
        this.partyTypeList = res;
      })
      this.service.getKDagainstPI(-1, -1, -1, -1).subscribe(lst => {
        lst.forEach(res => {
          res.rate = res.rate.toFixed(2);
          res.kattiAmount = res.kattiAmount.toFixed(2);
        });
        this.tabList = lst;
        this.source.load(lst);
        this.loading = false;
      })
      this.loading = true;
    }
    else if (this.router.url.includes('consignmentDcRegister')) {
      this.reportHeading = 'Consignment or DC Register Report';
      this.isConDcRegister = true;
      this.partyService.getPartyByType('CU').subscribe(res => {
        this.partyTypeList = res;
      })

      this.settings = this.prepareSettingConDCReg();
      //  this.service.getIssuedReturnReports(-1,-1,-1,-1).subscribe(res=>{
      //    this.source.load(res);
      //  })

      this.ConDC();
    }

  }

  ConDC() {
    this.service.getIssuedReturnReports(-1, -1, -1, -1).subscribe(lst => {
      this.tabList = lst;
      lst.forEach(ele => {
        if (ele.returnNo == null) {
          ele.returnNo = '-';
        }
        if (ele.dcCloseDate == null) {
          ele.dcCloseDate = '-';
        }
      })
      this.source.load(lst);
      this.loading = false;
    })
  }

  payableDue() {
    this.service.getNonPaidPurchaseDetailsTillToday(this.level.value==""?'N':this.level.value).subscribe(lst => {
      this.tabList = lst;
      lst.forEach(ele => {
        ele.netAmount = this.format2(parseFloat(ele.netAmount.toString()).toFixed(2), '');
        ele.paidAmount = this.format2(parseFloat(ele.paidAmount.toString()).toFixed(2), '');
        ele.pendingAmount = this.format2(parseFloat(ele.pendingAmount.toString()).toFixed(2), '');
      })
      this.source.load(lst);
      this.loading = false;
    });
  }

  receivableDue() {
    this.service.getNonPaidSalesDetailsTillToday(this.level.value==""?'N':this.level.value).subscribe(lst => {
      this.tabList = lst;
      lst.forEach(ele => {
        ele.netAmount = this.format2(parseFloat(ele.netAmount.toString()).toFixed(2), '');
        ele.paidAmount = this.format2(parseFloat(ele.paidAmount.toString()).toFixed(2), '');
        ele.pendingAmount = this.format2(parseFloat(ele.pendingAmount.toString()).toFixed(2), '');
      })
      this.source.load(lst);
      this.loading = false;
    });
  }

  KD() {
    this.service.getAllPhysicalStockAdjust().subscribe(lst => {
      this.tabList = lst;
      lst.forEach(ele => {
        ele.prevRate = this.format2(parseFloat(ele.prevRate.toString()).toFixed(4), '');
        ele.adjustedRate = this.format2(parseFloat(ele.adjustedRate.toString()).toFixed(2), '');
      })
      this.source.load(lst);
      this.loading = false;
    })
  }
  KDAgainstPI() {
    this.service.getKDagainstPI(this.party.value == "" ? -1 : this.party.value,
      this.fromDate.value == "" ? -1 : this.fromDate.value,
      this.toDate.value == "" ? -1 : this.toDate.value,
      this.invoice.value == "" ? -1 : this.invoice.value).subscribe(lst => {
        lst.forEach(res => {
          res.rate = res.rate.toFixed(2);
          res.kattiAmount = res.kattiAmount.toFixed(2);
        });
        this.tabList = lst;
        this.source.load(lst);
        this.loading = false;
      })
    this.commonService.getAllCommonMasterByType('IT').subscribe((code) => {
      this.invoiceTypeList = code.filter(
        task => task.code === "IPI" || task.code === "LPI");
    });
  }
  ReceivablesCustomerBrokerage() {
    this.service.getGroupOfBrokerageByCustomerOnSales(this.party.value.partyId).subscribe(lst => {
      this.tabList = lst;
      lst.forEach(ele => {
        ele.brokerageAmount = this.format2(parseFloat(ele.brokerageAmount.toString()).toFixed(2), '');
        ele.netAmount = this.format2(parseFloat(ele.netAmount.toString()).toFixed(2), '');
      })
      this.source.load(lst);
      this.loading = false;
    });
  }

  ReceivablesByBroker() {
    this.service.getAllBrokerageBySales(this.party.value.partyId).subscribe(lst => {
      this.tabList = lst;
      lst.forEach(ele => {
        ele.brokerageAmount = this.format2(parseFloat(ele.brokerageAmount.toString()).toFixed(2), '');
        ele.netAmount = this.format2(parseFloat(ele.netAmount.toString()).toFixed(2), '');
      })
      this.source.load(lst);
      this.loading = false;
    });
  }

  PayableCustomerBrokerage() {
    debugger;
    this.service.getGroupOfBrokerageBySupplierOnPurchase(this.party.value.partyId).subscribe(lst => {
      this.tabList = lst;
      lst.forEach(ele => {
        ele.brokerageAmount = this.format2(parseFloat(ele.brokerageAmount.toString()).toFixed(2), '');
        ele.netAmount = this.format2(parseFloat(ele.netAmount.toString()).toFixed(2), '');
      })
      this.source.load(lst);
      this.loading = false;
    });
  }

  PayableByBroker() {
    this.service.getAllBrokerageByPurchase(this.party.value.partyId).subscribe(lst => {
      this.tabList = lst;
      lst.forEach(ele => {
        ele.brokerageAmount = this.format2(parseFloat(ele.brokerageAmount.toString()).toFixed(2), '');
        ele.netAmount = this.format2(parseFloat(ele.netAmount.toString()).toFixed(2), '');
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
    if (this.router.url.includes('receivablesByBroker')) {
      doc.setFontType('underline');
      doc.text(this.reportHeading, 320, 25);
      doc.setFontSize(10);
      doc.text(this.now(), 720, 20);
      doc.text(this.currentUser, 745, 30);
      var columns = [
        { title: "Invoice Id", dataKey: "invoiceId" },
        { title: "Party Name", dataKey: "partyName" },
        { title: "Invoice Type", dataKey: "invoiceType" },
        { title: "Brokerage Amount", dataKey: "brokerageAmount" },
        { title: "Net Amount", dataKey: "netAmount" },
        { title: "Broker", dataKey: "brokerName" }

      ];
      doc.autoTable(columns, this.tabList, {
        styles: {
          overflow: 'linebreak',
          halign: 'left'
        }
      });
      doc.save(this.reportHeading + '.pdf');
    }
    else if (this.router.url.includes('consignmentDcRegister')) {
      doc.setFontType('underline');
      doc.text(this.reportHeading, 320, 25);
      doc.setFontSize(10);
      doc.text(this.now(), 720, 20);
      doc.text(this.currentUser, 745, 30);
      var columns = [
        { title: "Party Name", dataKey: "partyName" },
        { title: "Issue No.", dataKey: "issueNo" },
        { title: "Receipt Date", dataKey: "receiptDate" },
        { title: "Close Date", dataKey: "dcCloseDate" },
        { title: "Return No.", dataKey: "returnNo" },
        { title: "Issue Ref. No.", dataKey: "returnIssueRefNo" },
        { title: "Total Issued Carats", dataKey: "totalIssuedCarats" },
        { title: "Rejected Carats", dataKey: "rejectedCts" },
        { title: "Consignment", dataKey: "isConsignment" }

      ];
      doc.autoTable(columns, this.tabList, {
        styles: {
          overflow: 'linebreak',
          halign: 'left'
        }
      });
      doc.save(this.reportHeading + '.pdf');
    }
    else if (this.router.url.includes('receivablesCustomerBrokerage')) {
      doc.setFontType('underline');
      doc.text(this.reportHeading, 320, 25);
      doc.setFontSize(10);
      doc.text(this.now(), 720, 20);
      doc.text(this.currentUser, 745, 30);
      var columns = [
        { title: "Customer Name", dataKey: "partyName" },
        { title: "Invoice Type", dataKey: "invoiceType" },
        { title: "Brokerage Amount", dataKey: "brokerageAmount" },
        { title: "Net Amount", dataKey: "netAmount" },
        { title: "Broker", dataKey: "brokerName" }

      ];
      doc.autoTable(columns, this.tabList, {
        styles: {
          overflow: 'linebreak',
          halign: 'left'
        }
      });
      doc.save(this.reportHeading + '.pdf');
    }
    else if (this.router.url.includes('payableCustomerBrokerage')) {
      doc.setFontType('underline');
      doc.text(this.reportHeading, 320, 25);
      doc.setFontSize(10);
      doc.text(this.now(), 720, 20);
      doc.text(this.currentUser, 745, 30);
      var columns = [
        { title: "Customer Name", dataKey: "partyName" },
        { title: "Invoice Type", dataKey: "invoiceType" },
        { title: "Brokerage Amount", dataKey: "brokerageAmount" },
        { title: "Net Amount", dataKey: "netAmount" },
        { title: "Broker", dataKey: "brokerName" }

      ];
      doc.autoTable(columns, this.tabList, {
        styles: {
          overflow: 'linebreak',
          halign: 'left'
        }
      });
      doc.save(this.reportHeading + '.pdf');
    }
    else if (this.router.url.includes('payableByBroker')) {
      doc.setFontType('underline');
      doc.text(this.reportHeading, 320, 25);
      doc.setFontSize(10);
      doc.text(this.now(), 720, 20);
      doc.text(this.currentUser, 745, 30);
      var columns = [
        { title: "Invoice Id", dataKey: "invoiceId" },
        { title: "Party Name", dataKey: "partyName" },
        { title: "Invoice Type", dataKey: "invoiceType" },
        { title: "Brokerage Amount", dataKey: "brokerageAmount" },
        { title: "Net Amount", dataKey: "netAmount" },
        { title: "Broker", dataKey: "brokerName" }

      ];
      doc.autoTable(columns, this.tabList, {
        styles: {
          overflow: 'linebreak',
          halign: 'left'
        }
      });
      doc.save(this.reportHeading + '.pdf');
    }
    else if (this.router.url.includes('payableDue')) {
      doc.setFontType('underline');
      doc.text(this.reportHeading, 340, 25);
      doc.setFontSize(10);
      doc.text(this.now(), 720, 20);
      doc.text(this.currentUser, 745, 30);
      var columns = [
        { title: "Invoice Id", dataKey: "invoiceNumber" },
        { title: "Party Name", dataKey: "partyName" },
        { title: "Invoice Type", dataKey: "invoiceType" },
        { title: "Purchase Date", dataKey: "purchaseDate" },
        { title: "Due Date", dataKey: "dueDate" },
        { title: "Net Amount", dataKey: "netAmount" },
        { title: "Paid Amount", dataKey: "paidAmount" },
        { title: "Pending Amount", dataKey: "pendingAmount" },

      ];
      doc.autoTable(columns, this.tabList, {
        styles: {
          overflow: 'linebreak',
          halign: 'left'
        }
      });
      doc.save(this.reportHeading + '.pdf');
    }
    else if (this.router.url.includes('receivableDue')) {
      doc.setFontType('underline');
      doc.text(this.reportHeading, 340, 25);
      doc.setFontSize(10);
      doc.text(this.now(), 720, 20);
      doc.text(this.currentUser, 745, 30);
      var columns = [
        { title: "Invoice Id", dataKey: "invoiceNumber" },
        { title: "Party Name", dataKey: "partyName" },
        { title: "Invoice Type", dataKey: "invoiceType" },
        { title: "Purchase Date", dataKey: "purchaseDate" },
        { title: "Due Date", dataKey: "dueDate" },
        { title: "Net Amount", dataKey: "netAmount" },
        { title: "Paid Amount", dataKey: "paidAmount" },
        { title: "Pending Amount", dataKey: "pendingAmount" },

      ];
      doc.autoTable(columns, this.tabList, {
        styles: {
          overflow: 'linebreak',
          halign: 'left'
        }
      });
      doc.save(this.reportHeading + '.pdf');
    }
    else if (this.router.url.includes('kdRegister')) {
      doc.setFontType('underline');
      doc.text(this.reportHeading, 340, 25);
      doc.setFontSize(10);
      doc.text(this.now(), 720, 20);
      doc.text(this.currentUser, 745, 30);

      var columns = [
        { title: "Lot Name", dataKey: "lotName" },
        { title: "Item Name", dataKey: "itemName" },
        { title: "Updation Date", dataKey: "stockUpdationDate" },
        { title: "Previous Carats", dataKey: "prevCarats" },
        { title: "Adjusted Carats", dataKey: "adjustedCarats" },
        { title: "Previous Rate", dataKey: "prevRate" },
        { title: "Adjusted Rate", dataKey: "adjustedRate" },
        { title: "Invoice Type", dataKey: "invoiceType" },
        { title: "Invoice No.", dataKey: "invoiceNumber" },
        { title: "Remarks", dataKey: "remarks" }

      ];
      doc.autoTable(columns, this.tabList, {
        styles: {
          overflow: 'linebreak',
          halign: 'left'
        }
      });
      doc.save(this.reportHeading + '.pdf');
    }
    else if (this.router.url.includes('kdAgainstPI')) {
      doc.setFontType('underline');
      doc.text(this.reportHeading, 340, 25);
      doc.setFontSize(10);
      doc.text(this.now(), 720, 20);
      doc.text(this.currentUser, 745, 30);

      var columns = [
        { title: "Invoice ID", dataKey: "invoice_id" },
        // { title: "Lot Name", dataKey: "lot_name" },
        // { title: "Item Name", dataKey: "item_name" },
        { title: "Supplier Name", dataKey: "supplier_name" },
        { title: "Order ID", dataKey: "order_id" },
        { title: "Invoice Date", dataKey: "invoice_date" },
        { title: "Purchased Carats", dataKey: "purchased_carats" },
        { title: "Invoice Carats", dataKey: "invoiced_carats" },
        { title: "Invoice Type", dataKey: "invoice_type" },
        { title: "Kati Difference", dataKey: "kattiDifference" },
        { title: "Rate", dataKey: "rate" },
        { title: "Kati Amount", dataKey: "kattiAmount" },

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

    if (this.router.url.includes('receivablesByBroker')) {

      var options = {
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalseparator: '.',
        showLabels: true,
        showTitle: true,
        useBom: true,
        headers: ['Invoice Id', 'Party Name', 'Invoice Type', 'BrokerageAmount', 'NetAmount', 'Broker'],
        title: 'RECEIVABLES BY BROKER REPORT' + ',' + '\n' + 'Date ' + ',' + this.today() + ',' + '\n' + 'User' + ',' + this.currentUser
      };

      new Angular2Csv(this.tabList, 'RECEIVABLES BY BROKER REPORT', options);


    } else if (this.router.url.includes('consignmentDcRegister')) {
      var options = {
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalseparator: '.',
        showLabels: true,
        showTitle: true,
        useBom: true,
        headers: ['Invoice Id', 'Party Name', 'Invoice Type', 'BrokerageAmount', 'NetAmount', 'Broker'],
        title: 'Consignment or DC Register Report' + ',' + '\n' + 'Date ' + ',' + this.today() + ',' + '\n' + 'User' + ',' + this.currentUser
      };

      new Angular2Csv(this.tabList, 'Consignment or DC Register Report', options);
    }
    else if (this.router.url.includes('receivablesCustomerBrokerage')) {

      var options = {
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalseparator: '.',
        showLabels: true,
        showTitle: true,
        useBom: true,
        headers: ['Customer Name', 'Invoice Type', 'BrokerageAmount', 'NetAmount', 'Broker'],
        title: 'RECEIVABLES BY CUSTOMER BROKERAGE REPORT' + '\n' + 'Date ' + ',' + this.today() + ',' + '\n' + 'User' + ',' + this.currentUser
      };

      new Angular2Csv(this.tabList, 'RECEIVABLES BY CUSTOMER BROKERAGE REPORT', options);


    } else if (this.router.url.includes('payableCustomerBrokerage')) {

      var options = {
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalseparator: '.',
        showLabels: true,
        showTitle: true,
        useBom: true,
        headers: ['Customer Name', 'Invoice Type', 'BrokerageAmount', 'NetAmount', 'Broker'],
        title: 'Payable Customer Brokerage Report' + ',' + '\n' + 'Date ' + ',' + this.today() + ',' + '\n' + 'User' + ',' + this.currentUser
      };

      new Angular2Csv(this.tabList, 'Payable Customer Brokerage Report', options);


    } else if (this.router.url.includes('payableByBroker')) {
      var options = {
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalseparator: '.',
        showLabels: true,
        showTitle: true,
        useBom: true,
        headers: ['Invoice Id', 'Party Name', 'Invoice Type', 'BrokerageAmount', 'NetAmount', 'Broker'],
        title: 'PAYABLE BY BROKER REPORT' + ',' + '\n' + 'Date ' + ',' + this.today() + ',' + '\n' + 'User' + ',' + this.currentUser
      };

      new Angular2Csv(this.tabList, 'PAYABLE BY BROKER REPORT', options);

    } else if (this.router.url.includes('payableDue')) {

      var options = {
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalseparator: '.',
        showLabels: true,
        showTitle: true,
        useBom: true,
        headers: ['Invoice Id', 'Party Name', 'Invoice Type', 'Purchase Date', 'Due Date', 'NetAmount', 'Paid Amount', 'Pending Amount'],
        title: 'Payable Due Report' + ',' + '\n' + 'Date ' + ',' + this.today() + ',' + '\n' + 'User' + ',' + this.currentUser
      };

      new Angular2Csv(this.tabList, 'Payable Due Report', options);


    } else if (this.router.url.includes('receivableDue')) {

      var options = {
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalseparator: '.',
        showLabels: true,
        showTitle: true,
        useBom: true,
        headers: ['Invoice Id', 'Party Name', 'Invoice Type', 'Purchase Date', 'Due Date', 'NetAmount', 'Paid Amount', 'Pending Amount'],
        title: 'Receivable Due Report' + ',' + '\n' + 'Date ' + ',' + this.today() + ',' + '\n' + 'User' + ',' + this.currentUser
      };

      new Angular2Csv(this.tabList, 'Receivable Due Report', options);


    }
    else if (this.router.url.includes('kdRegister')) {
      var options = {
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalseparator: '.',
        showLabels: true,
        showTitle: true,
        useBom: true,
        headers: ['Item Id', 'Lot Name', 'Item Name', 'Adjusted Rate', 'Adjusted Carats', 'Updation Date', 'Invoice No', 'Invoice Type', 'Remarks', 'Previous Rate', 'Previous Carats'],
        title: 'KD Register Report' + ',' + '\n' + 'Date ' + ',' + this.today() + ',' + '\n' + 'User' + ',' + this.currentUser
      };

      new Angular2Csv(this.tabList, 'KD Register Report', options);
    }
    else if (this.router.url.includes('kdAgainstPI')) {
      var options = {
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalseparator: '.',
        showLabels: true,
        showTitle: true,
        useBom: true,
        headers: ['Kati Difference', 'Purchased Carats','Rate', 'Invoice Carats', 'Invoice Id', 'Kati Amount','Invoice Type', 'Supplier Name', 'Order ID', 'Invoice Date'],
        title: 'KD Against PI Report' + ',' + '\n' + 'Date ' + ',' + this.today() + ',' + '\n' + 'User' + ',' + this.currentUser
      };

      new Angular2Csv(this.tabList, 'KD Against PI Report', options);
    }
  }


  deleteMsg(msg: string) {
    const index: number = this.tabList.indexOf(msg);
    if (index !== -1) {
      this.tabList.splice(index, 1);
    }
  }


  createReport() {
    this.loading = true;
    if (this.router.url.includes('receivablesByBroker')) {
      this.source.load(this.invoiceTypeList);
      this.settings = this.prepareBrokerageByBroker();
      this.ReceivablesByBroker();

    } else if (this.router.url.includes('receivablesCustomerBrokerage')) {

      this.settings = this.prepareSalesCustomerBrokerage();
      this.ReceivablesCustomerBrokerage();

    } else if (this.router.url.includes('payableCustomerBrokerage')) {

      this.settings = this.prepareSalesCustomerBrokerage();
      this.PayableCustomerBrokerage();

    } else if (this.router.url.includes('payableByBroker')) {
      this.settings = this.prepareBrokerageByBroker();
      this.PayableByBroker();
    } else if (this.router.url.includes('consignmentDcRegister')) {

      this.settings = this.prepareSettingConDCReg();
      this.service.getIssuedReturnReports(this.party.value == "" ? -1 : this.party.value,
        this.fromDate.value == "" ? -1 : this.fromDate.value,
        this.toDate.value == "" ? -1 : this.toDate.value, this.level.value == "" ? -1 : this.level.value).subscribe(lst => {
          this.tabList = lst;
          lst.forEach(ele => {
            if (ele.returnNo == null) {
              ele.returnNo = '-';
            }
            if (ele.dcCloseDate == null) {
              ele.dcCloseDate = '-';
            }
          })
          console.log(lst);
          this.source.load(lst);
          this.loading = false;
        })

    } else if (this.router.url.includes('kdAgainstPI')) {
      this.KDAgainstPI();
    } else if (this.router.url.includes('payableDue')) {
      this.reportHeading = 'Payable Due Report'
      this.settings = this.preparePayableDue();
      this.payableDue();
      this.isBrokerAgeReport = false;
      this.loading = true;
      this.ispayableDue = true;
    }  else if (this.router.url.includes('receivableDue')) {
      this.reportHeading = 'Receivable Due Report';
      this.settings = this.preparePayableDue();
      this.receivableDue();
      this.isBrokerAgeReport = false;
      this.loading = true;
      this.isreceivableDue = true;
    }


  }

  bindData() {

  }



  finally() {
    //  this.isLoading = false;
    this.analyticsReportForm.markAsPristine();
  }

  private createForm() {
    this.analyticsReportForm = this.fb.group({

      'party': ['', Validators.required],
      'fromDate': ['', Validators.required],
      'toDate': ['', Validators.required],
      'level': ['', Validators.required],
      'invoice': ['', Validators.required]
    });


    this.party = this.analyticsReportForm.controls['party'];
    this.toDate = this.analyticsReportForm.controls['toDate'];
    this.level = this.analyticsReportForm.controls['level'];
    this.fromDate = this.analyticsReportForm.controls['fromDate'];
    this.invoice = this.analyticsReportForm.controls['invoice'];
  }
}
