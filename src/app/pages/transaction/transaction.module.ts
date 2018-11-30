import { CommonModalComponent } from '../../shared/common-modal/common-modal.component';
import { PrintInvoiceComponent } from '../../shared/print-invoice/print-invoice.component';
import { PrintDCComponent } from '../../shared/print-dc/print-dc.component';
import { PrintConsignmentComponent } from '../../shared/print-consignment/print-consignment.component';
import { PrintExportComponent } from '../../shared/print-export/print-export.component';

import { SharedModule } from '../../shared/shared.module';
import { LotItemCreationService } from '../stockManagement/components/lotItemCreation/index';
import { CreatePurchaseInvoiceComponent } from './components/purchaseInvoice/createPurchaseInvoice/createPurchaseInvoice.component';
import { PurchaseInvoiceModal } from './components/purchaseInvoice/createPurchaseInvoice/purchaseInvoice-modal/purchaseInvoice-modal.component';
import { LocalSaleModal } from './components/localSaleInvoice/createSaleInvoice/localSale-modal/localSale-modal.component';
import { ConsignIssueModal } from './components/jangadConsignmentReturn/createJangadConsignmentReturn/consignIssue-modal/consignIssue-modal.component';
import { ZoneEntryService } from '../masters/components/zoneEntry/zoneEntry.service';
import { CommonService } from '../masters/components/common/common.service';
import { OrderGeneralDetails } from './components/purchaseOrder/createPurchaseOrder/orderGeneralDetails/orderGeneralDetails.component';
import {
  SalesOrderGeneralDetails,
} from './components/salesOrder/createSalesOrder/salesOrderGeneralDetails/salesOrderGeneralDetails.component';
import { OrderItemList } from './components/purchaseOrder/createPurchaseOrder/orderItemList/orderItemList.component';
import { StockEffect } from './components/purchaseOrder/createPurchaseOrder/stockEffect/stockEffect.component';
import { StockEffectSales } from './components/salesOrder/createSalesOrder/stockEffectSales/stockEffectSales.component';


import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';
import { Transaction } from './transaction.component';
import { routing } from './transaction.routing';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { CreateIssueDetail } from './components/issueDetails/createIssueDetail/createIssueDetail.component';
import { IssueDetails } from './components/issueDetails/issueDetails.component';
import { IssueDetailService } from './components/issueDetails/issueDetail.service';
import { ReturnEntrys } from './components/returnEntry';
import { ReturnEntryService } from './components/returnEntry/returnEntry.service';
import { CreateReturnEntry } from './components/returnEntry/createReturnEntry/createReturnEntry.component';

import { CompanyStockComponent } from './components/companyStock(Item)/companyStock.component';
import { CompanyStockService } from './components/companyStock(Item)/companyStock.service';
import { PartyStockComponent } from './components/partyStock/partyStock.component';
import { PartyStockService } from './components/partyStock/partyStock.service';

import { ExportInvoice } from './components/exportInvoice/exportInvoice.component';
import { ExportInvoiceService } from './components/exportInvoice/exportInvoice.service';
import { CreateExportInvoice } from './components/exportInvoice/createExportInvoice/createExportInvoice.component';
import { ExportSaleModal } from './components/exportInvoice/createExportInvoice/exportSale-modal/exportSale-modal.component';

import { ImportInvoice } from './components/importInvoice/importInvoice.component';
import { ImportInvoiceService } from './components/importInvoice/importInvoice.service';
import { CreateImportInvoice } from './components/importInvoice/createImportInvoice/createImportInvoice.component';
import { ImportInvoiceModal } from './components/importInvoice/createImportInvoice/importInvoice-modal/importInvoice-modal.component';

import { ImportRemittance } from './components/importRemittance/importRemittance.component';
import { ImportRemittanceService } from './components/importRemittance/importRemittance.service';
import { CreateImportRemittance } from './components/importRemittance/createImportRemittance/createImportRemittance.component';
import { ImportRemittanceModal } from './components/importRemittance/createImportRemittance/importRemittance-modal/importRemittance-modal.component';

import { PurchaseOrder } from './components/purchaseOrder/purchaseOrder.component';
import { CreatePurchaseOrder } from './components/purchaseOrder/createPurchaseOrder/createPurchaseOrder.component';
import { PurchaseOrderService } from './components/purchaseOrder/purchaseOrder.service';
import { PartyDetailsService } from '.../../app/pages/company/components/partyDetails/partyDetails.service';

import { PurchaseInvoiceComponent } from './components/purchaseInvoice/purchaseInvoice.component';
import { PurchaseInvoiceService } from './components/purchaseInvoice/purchaseInvoice.service';

import { CompanyLotAllotment } from './components/companyLotAllotment/companyLotAllotment.component';
import { CompanyLotAllotmentsService } from './components/companyLotAllotment/companyLotAllotments.service';
import { CreateCompanyLotAllotment } from './components/companyLotAllotment/createCompanyLotAllotment/createCompanyLotAllotment.component';

import { LocalSaleInvoiceComponent } from './components/localSaleInvoice/localSaleInvoice.component';
import { LocalSaleService } from './components/localSaleInvoice/localSaleInvoice.service';
import { CreateSaleInvoiceComponent } from './components/localSaleInvoice/createSaleInvoice/createSaleInvoice.component';


import { LocPurchaseAssignment } from './components/locPurchaseAssignment/locPurchaseAssignment.component';
import { LocPurchaseAssignmentService } from './components/locPurchaseAssignment/locPurchaseAssignment.service';
import { CreateLocPurchaseAssignment } from './components/locPurchaseAssignment/createLocPurchaseAssignment/createLocPurchaseAssignment.component';
import { ParaListService } from '.../../app/pages/masters/components/parameterList';
import { ParaValueService } from '.../../app/pages/masters/components/parameterValue';

import { GoodsInward } from './components/goodsInward/goodsInward.component';
import { GoodsInwardService } from './components/goodsInward/goodsInward.service';
import { CreateGoodsInward } from './components/goodsInward/createGoodsInward/createGoodsInward.component';

import { GoodsOutward } from './components/goodsOutward/goodsOutward.component';
import { GoodsOutwardService } from './components/goodsOutward/goodsOutward.service';
import { CreateGoodsOutward } from './components/goodsOutward/createGoodsOutward/createGoodsOutward.component';
import { JangadIssueEntry } from './components/jangadIssueEntry/jangadIssueEntry.component';
import { JangadIssueEntryService } from './components/jangadIssueEntry/jangadIssueEntry.service';
import { CreateJangadIssueEntry } from './components/jangadIssueEntry/createJangadIssueEntry/createJangadIssueEntry.component';
import { JangadIssueBulkEntry } from './components/jangadIssue(Bulk)Entry/jangadIssueBulkEntry.component';
import { JangadIssueBulkEntryService } from './components/jangadIssue(Bulk)Entry/jangadIssueBulkEntry.service';
import { CreateJangadIssueBulkEntry } from './components/jangadIssue(Bulk)Entry/createJangadIssueBulkEntry/createJangadIssueBulkEntry.component';

import { JangadConsignmentIssue } from './components/jangadConsignmentIssue/jangadConsignmentIssue.component';
import { JangadConsignmentIssueService } from './components/jangadConsignmentIssue/jangadConsignmentIssue.service';
import { CreateJangadConsignmentIssue } from './components/jangadConsignmentIssue/createJangadConsignmentIssue/createJangadConsignmentIssue.component';

import { JangadMixing } from './components/jangadMixing/jangadMixing.component';
import { JangadMixingService } from './components/jangadMixing/jangadMixing.service';
import { CreateJangadMixing } from './components/jangadMixing/createJangadMixing/createJangadMixing.component';

import { JangadConsignmentReturn } from './components/jangadConsignmentReturn/jangadConsignmentReturn.component';
import { JangadConsignmentReturnService } from './components/jangadConsignmentReturn/jangadConsignmentReturn.service';
import { CreateJangadConsignmentReturn } from './components/jangadConsignmentReturn/createJangadConsignmentReturn/createJangadConsignmentReturn.component';
import { ReturnPreviewModal } from './components/jangadConsignmentReturn/createJangadConsignmentReturn/returnPreview-modal/returnPreview-modal';

import { CategoryService } from '.../../app/pages/masters/components/categories';
import { ItemDetailsService } from '.../../app/pages/masters/components/itemDetails/itemDetails.service';
import { SalesOrder } from './components/salesOrder/salesOrder.component';
import { CreateSalesOrder } from './components/salesOrder/createSalesOrder/createSalesOrder.component';
import { SalesOrderService } from './components/salesOrder/salesOrder.service';

import { ExportSalesOrder } from './components/exportSalesOrder/exportSalesOrder.component';
import { CreateExportSalesOrder } from './components/exportSalesOrder/createExportSalesOrder/createExportSalesOrder.component';
import { ExportSalesOrderService } from './components/exportSalesOrder/exportSalesOrder.service';
import { ExportOrderGeneralDetails } from './components/exportSalesOrder/createExportSalesOrder/orderGeneralDetails/orderGeneralDetails.component';
import { ExportOrderCustomerDetails } from './components/exportSalesOrder/createExportSalesOrder/orderCustomerDetails/orderCustomerDetails.component';
import { ExportOrderItemList } from './components/exportSalesOrder/createExportSalesOrder/orderItemList/orderItemList.component';


import { NgbDropdownModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

import { ImportPurchaseOrder } from './components/importPurchaseOrder/importPurchaseOrder.component';
import { CreateImportPurchaseOrder } from './components/importPurchaseOrder/createImportPurchaseOrder/createImportPurchaseOrder.component';
import { ImportPurchaseOrderService } from './components/importPurchaseOrder/importPurchaseOrder.service';
import { ImportGeneralDetails } from './components/importPurchaseOrder/createImportPurchaseOrder/orderGeneralDetails/orderGeneralDetails.component';
// import { PurchaseOrderSupplierDetails } from './components/importPurchaseOrder/createImportPurchaseOrder/orderSupplierDetails/orderSupplierDetails.component';
import { ImportOrderItemList } from './components/importPurchaseOrder/createImportPurchaseOrder/orderItemList/orderItemList.component';
import { ImportOrderStockEffect } from './components/importPurchaseOrder/createImportPurchaseOrder/stockEffect/stockEffect.component';


// import { Lots } from './../stockManagement/components/lots/lots.component';
import { LotService } from './../stockManagement/components/lots/lot.service';
import { HierarchyCreationService } from '.../../app/pages/company/components/hierarchyCreation/hierarchyCreation.service'
import { HierarchyRelationService } from '.../../app/pages/company/components/hierarchyRelation/hierarchyRelation.service'
import { CompanyEmployeeService } from '.../../app/pages/company/components/companyEmployee/companyEmployee.service'
import { ProTypeService } from '.../../app/pages/masters/components/processType/proType.service';
import { ProDetailService } from '.../../app/pages/masters/components/processDetails/proDetails.service';
import { ExchangeRateService } from 'app/pages/masters/components/exchangeRate/exchangeRate.service';
import { PartyAccountService } from '.../../app/pages/company/components/partyAccount/partyAccount.service';

import { CreatePaymentEntryComponent, PaymentEntryService } from 'app/pages/transaction/components/paymentReceiptPurchase';
import { PaymentEntryComponent } from 'app/pages/transaction/components/paymentReceiptPurchase';

import { CreateReceiptEntryComponent, ReceiptEntryService } from 'app/pages/transaction/components/paymentReceiptSales';
import { ReceiptEntryComponent } from 'app/pages/transaction/components/paymentReceiptSales';

import { PaymentEntryModal } from './components/paymentReceiptPurchase/createPaymentEntry/paymentEntry-modal/paymentEntry-modal.component';
import { ReceiptEntryModal } from './components/paymentReceiptSales/createReceiptEntry/receiptEntry-modal/receiptEntry-modal.component';

import { PaymentPreviewModal } from './components/paymentReceiptPurchase/createPaymentEntry/paymentPreview-modal/paymentPreview-modal';

import { ExportRealisation } from './components/exportRealisation/exportRealisation.component';
import { ExportRealisationService } from './components/exportRealisation/exportRealisation.service';
import { CreateExportRealisation } from './components/exportRealisation/createExportRealisation/createExportRealisation.component';
import { ExportRealisationModal } from './components/exportRealisation/createExportRealisation/exportRealisation-modal/exportRealisation-modal.component';
import { PurchaseOrderModal } from './components/purchaseOrder/createPurchaseOrder/purchaseOrder-modal/purchaseOrder-modal.component';
import { SalesOrderModals } from './components/salesOrder/createSalesOrder/salesOrder-modal/salesOrder-modal.component';
import { BranchService } from 'app/pages/masters/components/bankBranches/branch.service';
//import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { LoadingModule } from 'ngx-loading';
import { BrokerPaymentEntryService, BrokerPaymentEntryComponent, CreateBrokerPaymentEntryComponent } from './components/paymentBrokerEntry';
import { BrokerPaymentEntryModal } from './components/paymentBrokerEntry/createBrokerPaymentEntry/brokerPaymentEntry-modal/brokerPaymentEntry-modal.component';
import { BrokerPaymentPreviewModal } from './components/paymentBrokerEntry/createBrokerPaymentEntry/brokerPaymentPreview-modal/brokerPaymentPreview-modal.component';
import { AgGridComponent } from './components/ag-grid/ag-grid.component';
import { AgGridModule } from 'ag-grid-angular';



@NgModule({
  imports: [
    AgGridModule.withComponents([]),
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgaModule,
    Ng2SmartTableModule,
    routing,
    NgbDropdownModule,
    NgbModalModule,
    SharedModule,
    NgbModule.forRoot(),
    LoadingModule
    //Ng4LoadingSpinnerModule.forRoot()
  ],
  declarations: [
    Transaction,
    IssueDetails,
    CreateIssueDetail,
    ReturnEntrys,
    CreateReturnEntry,
    CompanyStockComponent,
    PartyStockComponent,
    PurchaseOrder,
    CreatePurchaseOrder,
    ExportInvoice,
    CreateExportInvoice,
    ExportSaleModal,
    ImportInvoice,
    PurchaseInvoiceComponent,
    CreatePurchaseInvoiceComponent,
    CreateImportInvoice,
    CompanyLotAllotment,
    CreateCompanyLotAllotment,
    LocalSaleInvoiceComponent,
    CreateSaleInvoiceComponent,
    LocPurchaseAssignment,
    CreateLocPurchaseAssignment,
    GoodsInward,
    CreateGoodsInward,
    GoodsOutward,
    CreateGoodsOutward,
    JangadIssueEntry,
    CreateJangadIssueEntry,
    JangadIssueBulkEntry,
    CreateJangadIssueBulkEntry,
    JangadMixing,
    CreateJangadMixing,
    SalesOrder,
    CreateSalesOrder,
    StockEffectSales,
    ImportPurchaseOrder,
    CreateImportPurchaseOrder,
    OrderItemList,
    StockEffect,
    OrderGeneralDetails,
    SalesOrderGeneralDetails,
    ExportSalesOrder,
    CreateExportSalesOrder,
    PurchaseInvoiceModal,
    LocalSaleModal,
    ImportGeneralDetails,
    // PurchaseOrderSupplierDetails,
    ImportOrderItemList,
    ImportOrderStockEffect,
    JangadConsignmentIssue,
    CreateJangadConsignmentIssue,
    ExportOrderGeneralDetails,
    ExportOrderCustomerDetails,
    ExportOrderItemList,
    // Lots,
    JangadConsignmentReturn,
    CreateJangadConsignmentReturn,
    ConsignIssueModal,
    ReturnPreviewModal,
    PaymentPreviewModal,
    ImportInvoiceModal,
    CreatePaymentEntryComponent,
    PaymentEntryComponent,
    CreateReceiptEntryComponent,
    ReceiptEntryComponent,
    PaymentEntryModal,
    ReceiptEntryModal,
    ImportRemittance,
    CreateImportRemittance,
    ImportRemittanceModal,
    ExportRealisation,
    CreateExportRealisation,
    ExportRealisationModal,
    PurchaseOrderModal,
    SalesOrderModals,
    BrokerPaymentEntryComponent,
    CreateBrokerPaymentEntryComponent,
    BrokerPaymentEntryModal,
    BrokerPaymentPreviewModal,
    AgGridComponent
  ],
  providers: [
    ExchangeRateService,
    IssueDetailService,
    ReturnEntryService,
    CompanyStockService,
    PartyStockService,
    ImportInvoiceService,
    PurchaseOrderService,
    PurchaseInvoiceService,
    ExportInvoiceService,
    ImportInvoiceService,
    CompanyLotAllotmentsService,
    LocalSaleService,
    LocPurchaseAssignmentService,
    ParaListService,
    ParaValueService,
    GoodsInwardService,
    GoodsOutwardService,
    JangadIssueEntryService,
    JangadIssueBulkEntryService,
    JangadMixingService,
    LotService,
    CategoryService,
    ItemDetailsService,
    PartyDetailsService,
    LotItemCreationService,
    SalesOrderService,
    ImportPurchaseOrderService,
    ExportSalesOrderService,
    ZoneEntryService,
    CommonService,
    CompanyEmployeeService,
    HierarchyCreationService,
    HierarchyRelationService,
    ProTypeService,
    ProDetailService,
    JangadConsignmentIssueService,
    JangadConsignmentReturnService,
    PartyAccountService,
    PaymentEntryService,
    ReceiptEntryService,
    ImportRemittanceService,
    ExportRealisationService,
    BranchService,
    BrokerPaymentEntryService
  ],
  entryComponents: [
    PurchaseInvoiceModal,
    LocalSaleModal,
    ConsignIssueModal,
    ExportSaleModal,
    ReturnPreviewModal,
    PaymentPreviewModal,
    ImportInvoiceModal,
    PaymentEntryModal,
    ReceiptEntryModal,
    ImportRemittanceModal,
    ExportRealisationModal,
    PurchaseOrderModal,
    SalesOrderModals,
    BrokerPaymentEntryModal,
    BrokerPaymentPreviewModal
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],

})
export class TransactionModule {
}
