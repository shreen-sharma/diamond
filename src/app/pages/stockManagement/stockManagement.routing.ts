import { Routes, RouterModule } from '@angular/router';

import { StockManagement } from './stockManagement.component';

import { ItemRateUpdation } from './components/itemRateUpdation/itemRateUpdation.component';
import { CreateItemRateUpdation } from './components/itemRateUpdation/createItemRateUpdation/createItemRateUpdation.component';
import { ItemAllotment } from './components/itemAllotment/itemAllotment.component';
import { CreateItemAllotment } from './components/itemAllotment/createItemAllotment/createItemAllotment.component';
import { ItemMerging } from './components/itemMerging/itemMerging.component';
import { CreateItemMerging } from './components/itemMerging/createItemMerging/createItemMerging.component';
import { ItemTransfer } from './components/itemTransfer/itemTransfer.component';
import { CreateItemTransfer } from './components/itemTransfer/createItemTransfer/createItemTransfer.component';
import { OpeningStockEntry } from './components/openingStockEntry';
import { CreateOpeningStockEntry } from './components/openingStockEntry/createOpeningStockEntry/createOpeningStockEntry.component';
import { LotItemCreationComponent } from './components/lotItemCreation/lotItemCreation.component';
import { CreateLotItemCreationComponent } from './components/lotItemCreation/createLotItemCreation/createLotItemCreation.component';
import { Lots } from './components/lots/lots.component';
import { PhysicalStockAdjustment, CreatePhysicalStockAdjustment } from './components/physicalStockAdjustment';
import { BalanceSheet } from './components/balance-sheet';


// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '',
    component: StockManagement,
    children: [
        { path: 'balanceSheet', component: BalanceSheet },
        { path: 'itemRateUpdation', component: ItemRateUpdation },
        { path: 'createItemRateUpdation', component: CreateItemRateUpdation },
        { path: 'editItemRateUpdation/:itemRateUpdationId', component: CreateItemRateUpdation },
        { path: 'itemAllotment', component: ItemAllotment },
        { path: 'editItemAllotment/:lotTransId', component: CreateItemAllotment },
        { path: 'createItemAllotment', component: CreateItemAllotment },
        { path: 'itemMerging', component: ItemMerging },
        { path: 'editItemMerging/:lotTransId', component: CreateItemMerging },
        { path: 'createItemMerging', component: CreateItemMerging },
        { path: 'itemTransfer', component: ItemTransfer },
        { path: 'editItemTransfer/:itemTransferId', component: CreateItemTransfer },
        { path: 'createItemTransfer', component: CreateItemTransfer },
        { path: 'openingStockEntry', component: OpeningStockEntry },
        { path: 'createOpeningStockEntry', component: CreateOpeningStockEntry },
        { path: 'editOpeningStockEntry/:osId', component: CreateOpeningStockEntry },
        { path: 'viewOpeningStockEntry/:osId', component: CreateOpeningStockEntry },
        { path: 'lotItemCreation', component: LotItemCreationComponent },
        { path: 'createLotItemCreation', component: CreateLotItemCreationComponent },
        { path: 'editLotItemCreation/:lotItemId', component: CreateLotItemCreationComponent },
        { path: 'lots', component: Lots },
        { path: 'physicalStockAdjustment', component: PhysicalStockAdjustment },
        { path: 'createPhysicalStockAdjustment', component: CreatePhysicalStockAdjustment },
        // { path: 'viewPhysicalStockAdjustment/:lotTransId', component: CreatePhysicalStockAdjustment }
      ]
  }
];

export const routing = RouterModule.forChild(routes);
