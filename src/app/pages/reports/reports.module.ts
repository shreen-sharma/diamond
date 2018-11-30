import { ItemParameterComponent } from '../../shared/itemParameter/itemParameter.component';
import { SharedModule } from '../../shared/shared.module';
import { CommonModalComponent } from '../../shared/common-modal/common-modal.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';
import { Reports } from './reports.component';
import { routing } from './reports.routing';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { TreeviewModule } from 'ngx-treeview';
import { NgbDropdownModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

import { CommonService } from '../masters/components/common/common.service';
import { CategoryService } from '.../../app/pages/masters/components/categories';
import { LotItemCreationService } from '../stockManagement/components/lotItemCreation/index';
import { LotService } from './../stockManagement/components/lots/lot.service';

import { Mis } from './components/mis/mis.component';
import { MisService } from './components/mis/mis.service';
import { ParaValueService } from 'app/pages/masters/components/parameterValue/paraValue.service';
import { ParaListService } from 'app/pages/masters/components/parameterList';
import { Ng2TableModule } from 'ng2-table/ng2-table';
// import { CORE_DIRECTIVES } from '@angular/common';
import { ItemDetailsService } from '.../../app/pages/masters/components/itemDetails/itemDetails.service';
import { StockSummary } from './components/stockSummary/stockSummary.component';
import { StockSummaryService } from './components/stockSummary/stockSummary.service';
import {AgGridModule} from 'ag-grid-angular/main';
import { NgGridModule } from 'angular2-grid/main';
import {IHeaderAngularComp} from 'ag-grid-angular/main';
import { LocalPurchaseMonthlyInvoiceReport } from './components/localPurchaseMonthlyInvoiceReport/localPurchaseMonthlyInvoiceReport.component';
import { LocalPurchaseMonthlyInvoiceReportService } from './components/localPurchaseMonthlyInvoiceReport/localPurchaseMonthlyInvoiceReport.service';
import { LocalPurchaseSupplierInvoiceReport } from './components/localPurchaseSupplierInvoiceReport/localPurchaseSupplierInvoiceReport.component';
import { LocalPurchaseSupplierInvoiceReportService } from './components/localPurchaseSupplierInvoiceReport/localPurchaseSupplierInvoiceReport.service';
import { LocalSalesmonthlyInvoiceReport } from './components/localSalesmonthlyInvoiceReport/localSalesmonthlyInvoiceReport.component';
import { LocalSalesmonthlyInvoiceReportService } from './components/localSalesmonthlyInvoiceReport/localSalesmonthlyInvoiceReport.service';
import { LocalSalesSupplierInvoiceReport } from './components/localSalesSupplierInvoiceReport/localSalesSupplierInvoiceReport.component';
import { LocalSalesSupplierInvoiceReportService } from './components/localSalesSupplierInvoiceReport/localSalesSupplierInvoiceReport.service';
import { ExportSalesMonthlyInvoiceReport } from './components/exportSalesMonthlyInvoiceReport/exportSalesMonthlyInvoiceReport.component';
import { ExportSalesMonthlyInvoiceReportService } from './components/exportSalesMonthlyInvoiceReport/exportSalesMonthlyInvoiceReport.service';
import { ExportSalesSupplierInvoiceReport } from './components/exportSalesSupplierInvoiceReport/exportSalesSupplierInvoiceReport.component';
import { ExportSalesSupplierInvoiceReportService } from './components/exportSalesSupplierInvoiceReport/exportSalesSupplierInvoiceReport.service';

import { ImportPurchaseMonthlyInvoiceReport } from './components/importPurchaseMonthlyInvoiceReport/importPurchaseMonthlyInvoiceReport.component';
import { ImportPurchaseMonthlyInvoiceReportService } from './components/importPurchaseMonthlyInvoiceReport/importPurchaseMonthlyInvoiceReport.service';
import { ImportPurchaseSupplierInvoiceReport } from './components/importPurchaseSupplierInvoiceReport/importPurchaseSupplierInvoiceReport.component';
import { ImportPurchaseSupplierInvoiceReportService } from './components/importPurchaseSupplierInvoiceReport/importPurchaseSupplierInvoiceReport.service';


import { PayableAndReceivablesReport } from './components/payableAndReceivablesReport/payableAndReceivablesReport.component';
import { PayableAndReceivablesReportService } from './components/payableAndReceivablesReport/payableAndReceivablesReport.service';

import { AnalyticsReport } from './components/analyticsReport/analyticsReport.component';
import { AnalyticsReportService } from './components/analyticsReport/analyticsReport.service';

import { MovementsReport } from './components/movementsReport/movementsReport.component';
import { MovementsReportService } from './components/movementsReport/movementsReport.service';

import { ConsignmentOrDcSummaryReport } from './components/consignmentOrDcSummaryReport/consignmentOrDcSummaryReport.component';
import { ConsignmentOrDcSummaryReportService } from './components/consignmentOrDcSummaryReport/consignmentOrDcSummaryReport.service';

import { BrokerageReport } from './components/brokerageReport/brokerageReport.component';
import { BrokerageReportService } from './components/brokerageReport/brokerageReport.service';
import { PartyDetailsService } from 'app/pages/company/components/partyDetails/partyDetails.service';
//import { LotService } from '../../../../pages/stockManagement/components/lots/lot.service';
import { LoadingModule } from 'ngx-loading';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgaModule,
    Ng2SmartTableModule,
    Ng2TableModule,
    routing,
    SharedModule,
    TreeviewModule.forRoot(),
    NgbModule.forRoot(),
    NgGridModule,
    LoadingModule
    // Ng4LoadingSpinnerModule
  ],
  declarations: [
    Reports,
    Mis,
    StockSummary,
    LocalPurchaseMonthlyInvoiceReport,
    LocalPurchaseSupplierInvoiceReport,
    LocalSalesmonthlyInvoiceReport,
    LocalSalesSupplierInvoiceReport,
    ExportSalesMonthlyInvoiceReport,
    ExportSalesSupplierInvoiceReport,
    ImportPurchaseMonthlyInvoiceReport,
    ImportPurchaseSupplierInvoiceReport,
    PayableAndReceivablesReport,
    AnalyticsReport,
    MovementsReport,
    ConsignmentOrDcSummaryReport,
    BrokerageReport
  ],
  providers: [
    LotItemCreationService,
    ParaValueService,
    CommonService,
    MisService,
    LotService,
    ItemDetailsService,
    CategoryService,
    ParaListService,
    StockSummaryService,
    AgGridModule,
    LocalPurchaseMonthlyInvoiceReportService,
    LocalPurchaseSupplierInvoiceReportService,
    LocalSalesmonthlyInvoiceReportService,
    LocalSalesSupplierInvoiceReportService,
    ExportSalesMonthlyInvoiceReportService,
    ExportSalesSupplierInvoiceReportService,
    ImportPurchaseMonthlyInvoiceReportService,
    ImportPurchaseSupplierInvoiceReportService,
    PayableAndReceivablesReportService,
    AnalyticsReportService,
    MovementsReportService,
    ConsignmentOrDcSummaryReportService,
    BrokerageReportService,
    PartyDetailsService
  ],
  entryComponents: [
  ]
})
export class ReportsModule {
}
