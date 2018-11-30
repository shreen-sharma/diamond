import {StockItemParameterComponent} from './components/itemAllotment/createItemAllotment/stockItemParameter/stockItemParameter.component';
import { ItemParameterComponent } from '../../shared/itemParameter/itemParameter.component';
import { SharedModule } from '../../shared/shared.module';
import { CommonModalComponent } from '../../shared/common-modal/common-modal.component';
import { DefaultModal } from './components/openingStockEntry/createOpeningStockEntry/default-modal/default-modal.component';
import { DefaultModalOpen } from './components/openingStockEntry/default-modal/default-modal.component';
import { PreviewModalOpen } from './components/openingStockEntry/preview-modal/preview-modal.component';
import { MergingModalOpen } from './components/itemMerging/createItemMerging/merging-modal/merging-modal.component';

import { AllotmentModalOpen } from './components/itemAllotment/createItemAllotment/allotment-modal/allotment-modal.component';
import { ItemRateModalOpen } from './components/itemRateUpdation/createItemRateUpdation/itemRate-modal/itemRate-modal.component';
import { PhysicalStockModalOpen } from './components/physicalStockAdjustment/createPhysicalStockAdjustment/physicalStock-modal/physicalStock-modal.component'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';
import { StockManagement } from './stockManagement.component';
import { routing } from './stockManagement.routing';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { TreeviewModule } from 'ngx-treeview';
import { NgbDropdownModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

import { CommonService } from '../masters/components/common/common.service';
import { ItemRateUpdation } from './components/itemRateUpdation/itemRateUpdation.component';
import { ItemRateUpdationService } from './components/itemRateUpdation/itemRateUpdation.service';
import { CreateItemRateUpdation } from './components/itemRateUpdation/createItemRateUpdation/createItemRateUpdation.component';

import { ItemAllotment } from './components/itemAllotment/itemAllotment.component';
import { ItemAllotmentService } from './components/itemAllotment/itemAllotment.service';
import { CreateItemAllotment } from './components/itemAllotment/createItemAllotment/createItemAllotment.component';

import { ItemMerging } from './components/itemMerging/itemMerging.component';
import { ItemMergingService } from './components/itemMerging/itemMerging.service';
import { CreateItemMerging } from './components/itemMerging/createItemMerging/createItemMerging.component';
import { ParaListService } from '.../../app/pages/masters/components/parameterList';
import { ParaValueService } from '.../../app/pages/masters/components/parameterValue';
import { ItemTransfer } from './components/itemTransfer/itemTransfer.component';
import { ItemTransferService } from './components/itemTransfer/itemTransfer.service';
import { CreateItemTransfer } from './components/itemTransfer/createItemTransfer/createItemTransfer.component';
import { OpeningStockEntry } from './components/openingStockEntry';
import { OpeningStockEntryService } from './components/openingStockEntry/openingStockEntry.service';
import { CreateOpeningStockEntry } from './components/openingStockEntry/createOpeningStockEntry/createOpeningStockEntry.component';
import { LotItemCreationComponent } from './components/lotItemCreation/lotItemCreation.component';
import { LotItemCreationService } from './components/lotItemCreation/lotItemCreation.service';
import { CreateLotItemCreationComponent } from './components/lotItemCreation/createLotItemCreation/createLotItemCreation.component';
import { CategoryService } from '.../../app/pages/masters/components/categories';
import { ItemDetailsService } from '.../../app/pages/masters/components/itemDetails/itemDetails.service';
import { Lots } from './components/lots/lots.component';
import { LotService } from './components/lots/lot.service';
import { PartyDetailsService } from '.../../app/pages/company/components/partyDetails/partyDetails.service';
import { ZoneEntryService } from '.../../app/pages/masters/components/zoneEntry/zoneEntry.service';
import { TransferModal } from 'app/pages/stockManagement/components/itemTransfer/createItemTransfer/transfer-modal/transfer-modal.component';
import { PhysicalStockAdjustment, PhysicalStockAdjustmentService, CreatePhysicalStockAdjustment } from 'app/pages/stockManagement/components/physicalStockAdjustment';
import { BalanceSheet } from '../stockManagement/components/balance-sheet/balanceSheet.component'
import { BalanceSheetService } from '../stockManagement/components/balance-sheet/balanceSheet.service'

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgaModule,
    Ng2SmartTableModule,
    routing,
    SharedModule,
    TreeviewModule.forRoot(),
    NgbModule.forRoot()
  ],
  declarations: [
    StockManagement,
    ItemRateUpdation,
    CreateItemRateUpdation,
    ItemAllotment,
    CreateItemAllotment,
    ItemMerging,
    CreateItemMerging,
    StockItemParameterComponent,
    ItemTransfer,
    CreateItemTransfer,
    OpeningStockEntry,
    CreateOpeningStockEntry,
    LotItemCreationComponent,
    CreateLotItemCreationComponent,
    Lots,
    DefaultModal,
    DefaultModalOpen,
    PreviewModalOpen,
    MergingModalOpen,
    TransferModal,
    AllotmentModalOpen,
    ItemRateModalOpen,
    PhysicalStockAdjustment,
    CreatePhysicalStockAdjustment,
    PhysicalStockModalOpen,
    BalanceSheet
  ],
  providers: [

    CommonService,
    ItemRateUpdationService,
    ItemAllotmentService,
    ItemMergingService,
    ParaListService,
    ParaValueService,
    ItemTransferService,
    LotItemCreationService,
    CategoryService,
    ItemDetailsService,
    PartyDetailsService,
    LotItemCreationService,
    ZoneEntryService,
    LotService,
    OpeningStockEntryService,
    PhysicalStockAdjustmentService,
    BalanceSheetService
  ],
  entryComponents: [
    DefaultModal,
    DefaultModalOpen,
    PreviewModalOpen,
    MergingModalOpen,
    TransferModal,
    AllotmentModalOpen,
    ItemRateModalOpen,
    PhysicalStockModalOpen
  ]
})
export class StockManagementModule {
}
