import { CreatePurchaseInvoiceComponent } from './components/purchaseInvoice/createPurchaseInvoice/createPurchaseInvoice.component';
import { Routes, RouterModule } from '@angular/router';
import { Transaction } from './transaction.component';
import { IssueDetails } from './components/issueDetails/issueDetails.component';
import { CreateIssueDetail } from './components/issueDetails/createIssueDetail/createIssueDetail.component';
import { ReturnEntrys } from './components/returnEntry';
import { CreateReturnEntry } from './components/returnEntry/createReturnEntry/createReturnEntry.component';
import { CompanyStockComponent } from './components/companyStock(Item)/companyStock.component';
import { PartyStockComponent } from './components/partyStock/partyStock.component';
import { PurchaseOrder } from './components/purchaseOrder/purchaseOrder.component';
import { CreatePurchaseOrder } from './components/purchaseOrder/createPurchaseOrder/createPurchaseOrder.component';
import { ImportPurchaseOrder } from './components/importPurchaseOrder/importPurchaseOrder.component';
import { CreateImportPurchaseOrder } from './components/importPurchaseOrder/createImportPurchaseOrder/createImportPurchaseOrder.component';
import { PurchaseInvoiceComponent } from './components/purchaseInvoice/purchaseInvoice.component';
import { ExportInvoice } from './components/exportInvoice/exportInvoice.component';
import { CreateExportInvoice } from './components/exportInvoice/createExportInvoice/createExportInvoice.component';
import { ImportInvoice } from './components/importInvoice/importInvoice.component';
import { CreateImportInvoice } from './components/importInvoice/createImportInvoice/createImportInvoice.component';
import { CompanyLotAllotment } from './components/companyLotAllotment/companyLotAllotment.component';
import { CreateCompanyLotAllotment } from './components/companyLotAllotment/createCompanyLotAllotment/createCompanyLotAllotment.component';
import { LocalSaleInvoiceComponent } from './components/localSaleInvoice/localSaleInvoice.component';
import { CreateSaleInvoiceComponent } from './components/localSaleInvoice/createSaleInvoice/createSaleInvoice.component';
import { LocPurchaseAssignment } from './components/locPurchaseAssignment/locPurchaseAssignment.component';
import { CreateLocPurchaseAssignment } from './components/locPurchaseAssignment/createLocPurchaseAssignment/createLocPurchaseAssignment.component';
import { GoodsInward } from './components/goodsInward/goodsInward.component';
import { CreateGoodsInward } from './components/goodsInward/createGoodsInward/createGoodsInward.component';
import { GoodsOutward } from './components/goodsOutward/goodsOutward.component';
import { CreateGoodsOutward } from './components/goodsOutward/createGoodsOutward/createGoodsOutward.component';
import { JangadIssueEntry } from './components/jangadIssueEntry/jangadIssueEntry.component';
import { CreateJangadIssueEntry } from './components/jangadIssueEntry/createJangadIssueEntry/createJangadIssueEntry.component';
import { JangadIssueBulkEntry } from './components/jangadIssue(Bulk)Entry/jangadIssueBulkEntry.component';
import { CreateJangadIssueBulkEntry } from './components/jangadIssue(Bulk)Entry/createJangadIssueBulkEntry/createJangadIssueBulkEntry.component';
import { JangadMixing } from './components/jangadMixing/jangadMixing.component';
import { CreateJangadMixing } from './components/jangadMixing/createJangadMixing/createJangadMixing.component';
import { SalesOrder } from './components/salesOrder/salesOrder.component';
import { CreateSalesOrder } from './components/salesOrder/createSalesOrder/createSalesOrder.component';
import { ExportSalesOrder } from './components/exportSalesOrder/exportSalesOrder.component';
import { CreateExportSalesOrder } from './components/exportSalesOrder/createExportSalesOrder/createExportSalesOrder.component';
import { JangadConsignmentIssue } from './components/jangadConsignmentIssue/jangadConsignmentIssue.component';
import { CreateJangadConsignmentIssue } from './components/jangadConsignmentIssue/createJangadConsignmentIssue/createJangadConsignmentIssue.component';
import { JangadConsignmentReturn } from './components/jangadConsignmentReturn/jangadConsignmentReturn.component';
import { CreateJangadConsignmentReturn } from './components/jangadConsignmentReturn/createJangadConsignmentReturn/createJangadConsignmentReturn.component';
import { CreatePaymentEntryComponent } from './components/paymentReceiptPurchase/createPaymentEntry/createPaymentEntry.component';
import { PaymentEntryComponent } from './components/paymentReceiptPurchase/paymentEntry.component';

import { CreateReceiptEntryComponent } from './components/paymentReceiptSales/createReceiptEntry/createReceiptEntry.component';
import { ReceiptEntryComponent } from './components/paymentReceiptSales/receiptEntry.component';

import { ImportRemittance } from './components/importRemittance/importRemittance.component';
import { CreateImportRemittance } from './components/importRemittance/createImportRemittance/createImportRemittance.component';

import { ExportRealisation } from './components/exportRealisation/exportRealisation.component';
import { CreateExportRealisation } from './components/exportRealisation/createExportRealisation/createExportRealisation.component';
import { BrokerPaymentEntryComponent, CreateBrokerPaymentEntryComponent } from './components/paymentBrokerEntry';
import { AgGridComponent } from './components/ag-grid/ag-grid.component';
const routes: Routes = [
  {
    path: '',
    component: Transaction,
    children: [
      { path: '', redirectTo: 'issueDetails', pathMatch: 'full' },
      { path: 'issueDetails', component: IssueDetails },
      { path: 'createIssueDetail', component: CreateIssueDetail },
      { path: 'editIssueDetail/:empIssId', component: CreateIssueDetail },
      { path: 'returnEntry', component: ReturnEntrys },
      { path: 'createReturnEntry', component: CreateReturnEntry },
      { path: 'editReturnEntry/:empRetId', component: CreateReturnEntry },
      { path: 'importInvoice', component: ImportInvoice },
      { path: 'createImportInvoice', component: CreateImportInvoice },
      { path: 'editImportInvoice/:isView/:id/:status', component: CreateImportInvoice },
      { path: 'viewImportInvoice/:isView/:id/:status', component: CreateImportInvoice },
      { path: 'companyStockComponent', component: CompanyStockComponent },
      { path: 'partyStockComponent', component: PartyStockComponent },
      { path: 'purchaseInvoiceComponent', component: PurchaseInvoiceComponent },
      { path: 'createPurchaseInvoice', component: CreatePurchaseInvoiceComponent },
      { path: 'editPurchaseInvoice/:isView/:id/:status', component: CreatePurchaseInvoiceComponent },
      { path: 'viewPurchaseInvoice/:isView/:id/:status', component: CreatePurchaseInvoiceComponent },
      { path: 'importRemittance', component: ImportRemittance },
      { path: 'createImportRemittance', component: CreateImportRemittance },
      { path: 'editImportRemittance/:id/:status', component: CreateImportRemittance },
      { path: 'exportRealisation', component: ExportRealisation },
      { path: 'createExportRealisation', component: CreateExportRealisation },
      { path: 'editExportRealisation/:id/:status', component: CreateExportRealisation },

      { path: 'purchaseOrder', component: PurchaseOrder },
      { path: 'createPurchaseOrder', component: CreatePurchaseOrder },
      { path: 'editPurchaseOrder/:isView/:poId/:status', component: CreatePurchaseOrder },
      { path: 'viewPurchaseOrder/:isView/:poId/:status', component: CreatePurchaseOrder },

      { path: 'exportInvoice', component: ExportInvoice },
      { path: 'createExportInvoice', component: CreateExportInvoice },
      { path: 'editExportInvoice/:isView/:expId', component: CreateExportInvoice },
      { path: 'viewExportInvoice/:isView/:expId/:status', component: CreateExportInvoice },
      { path: 'companyLotAllotment', component: CompanyLotAllotment },
      { path: 'createCompanyLotAllotment', component: CreateCompanyLotAllotment },
      { path: 'editCompanyLotAllotment/:companyLotAllotmentId', component: CreateCompanyLotAllotment },
      { path: 'localSaleInvoiceComponent', component: LocalSaleInvoiceComponent },
      { path: 'createSaleInvoice', component: CreateSaleInvoiceComponent },
      { path: 'editSaleInvoice/:isView/:locSaleId/:status', component: CreateSaleInvoiceComponent },
      { path: 'viewSaleInvoice/:isView/:locSaleId/:status', component: CreateSaleInvoiceComponent },
      { path: 'locPurchaseAssignment', component: LocPurchaseAssignment },
      { path: 'createLocPurchaseAssignment', component: CreateLocPurchaseAssignment },
      { path: 'editLocPurchaseAssignment/:locPurchaseAssignmentId', component: CreateLocPurchaseAssignment },
      { path: 'goodsInward', component: GoodsInward },
      { path: 'editGoodsInward/:goodsInwardId', component: CreateGoodsInward },
      { path: 'createGoodsInward', component: CreateGoodsInward },
      { path: 'goodsOutward', component: GoodsOutward },
      { path: 'editGoodsOutward/:goodsOutwardId', component: CreateGoodsOutward },
      { path: 'createGoodsOutward', component: CreateGoodsOutward },
      // { path: 'jangadIssueEntry', component: JangadIssueEntry },
      // { path: 'editJangadIssueEntry/:jangadIssueEntryId', component: CreateJangadIssueEntry },
      // { path: 'createJangadIssueEntry', component: CreateJangadIssueEntry },
      { path: 'jangadIssueBulkEntry', component: JangadIssueBulkEntry },
      { path: 'editJangadIssueBulkEntry/:jangadIssueBulkEntryId', component: CreateJangadIssueBulkEntry },
      { path: 'createJangadIssueBulkEntry', component: CreateJangadIssueBulkEntry },
      { path: 'jangadMixing', component: JangadMixing },
      { path: 'createJangadMixing', component: CreateJangadMixing },
      { path: 'editJangadMixing/:jangadMixingId', component: CreateJangadMixing },
      { path: 'salesOrder', component: SalesOrder },
      { path: 'createSalesOrder', component: CreateSalesOrder },
      { path: 'editSalesOrder/:isView/:soId/:status', component: CreateSalesOrder },
      { path: 'viewSalesOrder/:isView/:soId/:status', component: CreateSalesOrder },
      { path: 'importPurchaseOrder', component: ImportPurchaseOrder },
      { path: 'createImportPurchaseOrder', component: CreateImportPurchaseOrder },
      { path: 'editImportPurchaseOrder/:isView/:poId/:status', component: CreateImportPurchaseOrder },
      { path: 'viewImportPurchaseOrder/:isView/:poId/:status', component: CreateImportPurchaseOrder },
      { path: 'exportSalesOrder', component: ExportSalesOrder },
      { path: 'createExportSalesOrder', component: CreateExportSalesOrder },
      { path: 'editExportSalesOrder/:isView/:soId/:status', component: CreateExportSalesOrder },
      { path: 'viewExportSalesOrder/:isView/:soId/:status', component: CreateExportSalesOrder },

      { path: 'deliveryChallanIssue', component: JangadConsignmentIssue },
      { path: 'editDeliveryChallanIssue/:isView/:issueId', component: CreateJangadConsignmentIssue },
      { path: 'viewDeliveryChallanIssue/:isView/:issueId/:status', component: CreateJangadConsignmentIssue },
      { path: 'createDeliveryChallanIssue', component: CreateJangadConsignmentIssue },
      
      { path: 'deliveryChallanReturn', component: JangadConsignmentReturn },
      { path: 'editDeliveryChallanReturn/:returnId', component: CreateJangadConsignmentReturn },
      { path: 'createDeliveryChallanReturn', component: CreateJangadConsignmentReturn },
      { path: 'createSalesInvoiceFromDCReturn/:retId', component: CreateSaleInvoiceComponent },
      { path: 'createExportInvoiceFromDCReturn/:retId', component: CreateExportInvoice },

      { path: 'brokerPayment', component: BrokerPaymentEntryComponent },
      { path: 'createBrokerPaymentEntry', component: CreateBrokerPaymentEntryComponent },
      { path: 'viewBrokerPaymentEntry/:id', component: CreateBrokerPaymentEntryComponent },

      { path: 'paymentEntry', component: PaymentEntryComponent },
      { path: 'createPaymentEntry', component: CreatePaymentEntryComponent },
      { path: 'viewPaymentEntry/:id', component: CreatePaymentEntryComponent },

      { path: 'receiptEntry', component: ReceiptEntryComponent },
      { path: 'createReceiptEntry', component: CreateReceiptEntryComponent },
      { path: 'viewReceiptEntry/:id', component: CreateReceiptEntryComponent },

      { path: 'locPurInvoice', component: PurchaseInvoiceComponent },
      { path: 'openingPurchaseInvoice', component: CreatePurchaseInvoiceComponent },
      { path: 'viewlocPurInvoice/:locSaleId/:status', component: CreatePurchaseInvoiceComponent },

      { path: 'locSalInvoice', component: LocalSaleInvoiceComponent },
      { path: 'openingSalesInvoice', component: CreateSaleInvoiceComponent },
      { path: 'editOpeningSalesInvoice/:locSaleId/:status', component: CreateSaleInvoiceComponent },
      { path: 'viewOpeningSalesInvoice/:locSaleId/:status', component: CreateSaleInvoiceComponent },



      { path: 'ImpPurInvoice', component: ImportInvoice },
      { path: 'openingImportnvoice', component: CreateImportInvoice },
      { path: 'editOpeningSalesInvoice/:locSaleId/:status', component: CreateSaleInvoiceComponent },
      { path: 'viewImpPurInvoice/:locSaleId/:status', component: CreateImportInvoice },


      
      { path: 'ExpSalesInvoice', component: ExportInvoice },
      { path: 'openingExpSalesInvoice', component: CreateExportInvoice },
      { path: 'editOpeningSalesInvoice/:locSaleId/:status', component: CreateExportInvoice },
      { path: 'viewExpSalesInvoice/:expId/:status', component: CreateExportInvoice },


      { path: 'openingDCIssue', component: JangadConsignmentIssue },
      { path: 'createOpeningDCIssue', component: CreateJangadConsignmentIssue },
      { path: 'viewOpeningDCIssue/:issueId/:status', component: CreateJangadConsignmentIssue },

      { path: 'agGrid', component: AgGridComponent}

      
       
    ]
  }
];

export const routing = RouterModule.forChild(routes);
