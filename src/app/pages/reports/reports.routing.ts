import { Routes, RouterModule } from '@angular/router';
import { Reports } from './reports.component';
import { Mis } from './components/mis/mis.component';
import { StockSummary } from './components/stockSummary/stockSummary.component';
import { LocalPurchaseMonthlyInvoiceReport } from './components/localPurchaseMonthlyInvoiceReport/localPurchaseMonthlyInvoiceReport.component';
//import { localPurchaseSupplierInvoiceReportService } from './components/localPurchaseSupplierInvoiceReport/localPurchaseSupplierInvoiceReport.service';
import { LocalPurchaseSupplierInvoiceReport } from 'app/pages/reports/components/localPurchaseSupplierInvoiceReport/localPurchaseSupplierInvoiceReport.component';
import { LocalSalesmonthlyInvoiceReport } from './components/localSalesmonthlyInvoiceReport';
import { LocalSalesSupplierInvoiceReport } from './components/localSalesSupplierInvoiceReport';

import { ExportSalesSupplierInvoiceReport } from './components/exportSalesSupplierInvoiceReport';
import { ExportSalesMonthlyInvoiceReport } from './components/exportSalesMonthlyInvoiceReport';

import { ImportPurchaseMonthlyInvoiceReport } from './components/importPurchaseMonthlyInvoiceReport';
import { ImportPurchaseSupplierInvoiceReport } from './components/importPurchaseSupplierInvoiceReport';
import { PayableAndReceivablesReport } from './components/payableAndReceivablesReport';
import { AnalyticsReport } from './components/analyticsReport/analyticsReport.component';
import { MovementsReport } from './components/movementsReport/movementsReport.component';
import { ConsignmentOrDcSummaryReport } from './components/consignmentOrDcSummaryReport/consignmentOrDcSummaryReport.component';

import { BrokerageReport } from './components/brokerageReport/brokerageReport.component';



// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '',
    component: Reports,
    children: [
      { path: 'physicalStockQualityReport', component: Mis },
      { path: 'stockSummaryStockRateReport', component: StockSummary },
      { path: 'stockSummarySellingPriceReport', component: StockSummary },
      { path: 'stockSummaryReport', component: StockSummary },
      { path: 'localPurchaseMonthlyReport', component: LocalPurchaseMonthlyInvoiceReport },
      { path: 'localPurchaseYearlyReport', component: LocalPurchaseMonthlyInvoiceReport },
      { path: 'LPPartyInvoiceReport/:partyId', component: LocalPurchaseMonthlyInvoiceReport },
      { path: 'localPurchaseSupplierReport', component: LocalPurchaseSupplierInvoiceReport },
      { path: 'localSalesMonthlyReport', component: LocalSalesmonthlyInvoiceReport },
      { path: 'localSalesYearlyReport', component: LocalSalesmonthlyInvoiceReport },
      { path: 'LSPartyInvoiceReport/:partyId', component: LocalSalesmonthlyInvoiceReport },
      { path: 'localSalesCustomerReport', component: LocalSalesSupplierInvoiceReport },
      { path: 'exportMonthlyReport', component: ExportSalesMonthlyInvoiceReport },
      { path: 'exportYearlyReport', component: ExportSalesMonthlyInvoiceReport },
      { path: 'ESPartyInvoiceReport/:partyId', component: ExportSalesMonthlyInvoiceReport },
      { path: 'exportCustomerReport', component: ExportSalesSupplierInvoiceReport },
      { path: 'importPurchaseMonthlyReport', component: ImportPurchaseMonthlyInvoiceReport },
      { path: 'importPurchaseYearlyReport', component: ImportPurchaseMonthlyInvoiceReport },
      { path: 'IPPartyInvoiceReport/:partyId', component: ImportPurchaseMonthlyInvoiceReport },
      { path: 'importPurchaseSupplierReport', component: ImportPurchaseSupplierInvoiceReport },
      { path: 'physicalStockSizeReport', component: Mis },
      { path: 'dcStockSizeReport', component: Mis },
      { path: 'dcStockQualityReport', component: Mis },
      { path: 'consignmentStockSizeReport', component: Mis },
      { path: 'consignmentStockQualityReport', component: Mis },
      { path: 'totalStockSizeReport', component: Mis },
      { path: 'totalStockQualityReport', component: Mis },

      { path: 'localPurchaseDateWiseReport', component: LocalPurchaseMonthlyInvoiceReport },
      { path: 'localSalesDateWiseReport', component: LocalSalesmonthlyInvoiceReport },
      { path: 'importPurchaseDateWiseReport', component: ImportPurchaseMonthlyInvoiceReport },
      { path: 'exportDateWiseReport', component: ExportSalesMonthlyInvoiceReport },
      { path: 'lotItemReport', component: StockSummary },
      { path: 'summaryReport', component: StockSummary },
      { path: 'combinedSummary', component: StockSummary },

      { path: 'payableImportInvoiceReport', component: PayableAndReceivablesReport },
      { path: 'payableLocalInvoiceReport', component: PayableAndReceivablesReport },
      { path: 'receivablesExportInvoiceReport', component: PayableAndReceivablesReport },
      { path: 'receivablesLocalInvoiceReport', component: PayableAndReceivablesReport },
      { path: 'salesVolumeReport', component: AnalyticsReport },
      { path: 'stockAgeingReport', component: AnalyticsReport },
      { path: 'top25Volume', component: MovementsReport },
      { path: 'top25Profits', component: MovementsReport },
      { path: 'top25Revenue', component: MovementsReport },

      { path: 'dcSummaryReport', component: ConsignmentOrDcSummaryReport },
      { path: 'consignmentSummayReport', component: ConsignmentOrDcSummaryReport },
      { path: 'receivablesCustomerBrokerage', component: BrokerageReport },
      { path: 'receivablesByBroker', component: BrokerageReport },
      { path: 'consignmentDcRegister', component: BrokerageReport },
      { path: 'payableCustomerBrokerage', component: BrokerageReport },
      { path: 'payableByBroker', component: BrokerageReport },

      { path: 'payableDue', component: BrokerageReport },
      { path: 'receivableDue', component: BrokerageReport },
      { path: 'itemAnalyserBySale', component: AnalyticsReport },
      { path: 'itemAnalyserByPurchase', component: AnalyticsReport },
      { path: 'itemAnalyserByCustomer', component: AnalyticsReport },
      { path: 'itemAnalyserBySupplier', component: AnalyticsReport },
      { path: 'kdRegister', component: BrokerageReport },
      { path: 'kdAgainstPI', component: BrokerageReport },
      { path: 'notionalProfit', component: MovementsReport}
    ]
  }
];

export const routing = RouterModule.forChild(routes);
