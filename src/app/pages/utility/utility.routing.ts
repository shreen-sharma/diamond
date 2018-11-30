import { Routes, RouterModule } from '@angular/router';

import { Utility } from './utility.component';
import { StockAnalyzer } from './components/stockAnalyzer/stockAnalyzer.component';
import { ItemAverageRateAnalyzer } from './components/itemAverageRateAnalyzer/itemAverageRateAnalyzer.component';
import { ItemMovementAnalyzer } from './components/itemMovementAnalyzer/itemMovementAnalyzer.component';
import { PurchaseAnalyzer } from './components/purchaseAnalyzer/purchaseAnalyzer.component';
import { ItemRateAnalyzer } from './components/itemRateAnalyzer/itemRateAnalyzer.component';
import { CreateItemRateAnalyzer } from './components/itemRateAnalyzer/createItemRateAnalyzer/createItemRateAnalyzer.component';
import { CreateStockAnalyzer } from './components/stockAnalyzer/createStockAnalyzer/createStockAnalyzer.component';
import { CreatePurchaseAnalyzer } from './components/purchaseAnalyzer/createPurchaseAnalyzer/createPurchaseAnalyzer.component';
import { CreateItemAverageRateAnalyzer } from './components/itemAverageRateAnalyzer/createItemAverageRateAnalyzer/createItemAverageRateAnalyzer.component';
import { CreateItemMovementAnalyzer } from './components/itemMovementAnalyzer/createItemMovementAnalyzer/createItemMovementAnalyzer.component';

const routes: Routes = [
  {
    path: '',
    component: Utility,
    children: [
      { path: '', redirectTo: 'stockAnalyzer', pathMatch: 'full' },
      { path: 'stockAnalyzer', component: StockAnalyzer },
      { path: 'createStockAnalyzer', component: CreateStockAnalyzer },
      { path: 'editStockAnalyzer/:stockAnalyzerId', component: CreateStockAnalyzer },
      { path: 'itemAverageRateAnalyzer', component: ItemAverageRateAnalyzer },
      { path: 'createItemAverageRateAnalyzer', component: CreateItemAverageRateAnalyzer },
      { path: 'editItemAverageRateAnalyzer/:itemAverageRateAnalyzerId', component: CreateItemAverageRateAnalyzer },
      { path: 'itemMovementAnalyzer', component: ItemMovementAnalyzer },
      { path: 'createItemMovementAnalyzer', component: CreateItemMovementAnalyzer },
      { path: 'editItemMovementAnalyzer/:itemMovementAnalyzerId', component: CreateItemMovementAnalyzer },
      { path: 'purchaseAnalyzer', component: PurchaseAnalyzer },
      { path: 'createPurchaseAnalyzer', component: CreatePurchaseAnalyzer },
      { path: 'editPurchaseAnalyzer/:purchaseAnalyzerId', component: CreatePurchaseAnalyzer },
      { path: 'itemRateAnalyzer', component: ItemRateAnalyzer },
      { path: 'createItemRateAnalyzer', component: CreateItemRateAnalyzer },
      { path: 'editItemRateAnalyzer/:itemRateAnalyzerId', component: CreateItemRateAnalyzer },
    ]
  }
];

export const routing = RouterModule.forChild(routes);
