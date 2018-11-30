import { SharedModule } from '../../shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';
import { Utility } from './utility.component';
import { routing } from './utility.routing';
import { Ng2SmartTableModule } from 'ng2-smart-table';

import { StockAnalyzer } from './components/stockAnalyzer/stockAnalyzer.component';
import { CreateStockAnalyzer } from './components/stockAnalyzer/createStockAnalyzer/createStockAnalyzer.component';
import { StockAnalyzerService } from './components/stockAnalyzer/stockAnalyzer.service';
import { ItemAverageRateAnalyzer } from './components/itemAverageRateAnalyzer/itemAverageRateAnalyzer.component';
import { ItemAverageRateAnalyzerService } from './components/itemAverageRateAnalyzer/itemAverageRateAnalyzer.service';
import { ParaListService } from '.../../app/pages/masters/components/parameterList';
import { ParaValueService } from '.../../app/pages/masters/components/parameterValue';
import { CreateItemAverageRateAnalyzer } from './components/itemAverageRateAnalyzer/createItemAverageRateAnalyzer/createItemAverageRateAnalyzer.component';
import { ItemMovementAnalyzer } from './components/itemMovementAnalyzer/itemMovementAnalyzer.component';
import { ItemMovementAnalyzerService } from './components/itemMovementAnalyzer/itemMovementAnalyzer.service';
import { CreateItemMovementAnalyzer } from './components/itemMovementAnalyzer/createItemMovementAnalyzer/createItemMovementAnalyzer.component';
import { PurchaseAnalyzer } from './components/purchaseAnalyzer/purchaseAnalyzer.component';
import { PurchaseAnalyzerService } from './components/purchaseAnalyzer/purchaseAnalyzer.service';
import { CreatePurchaseAnalyzer } from './components/purchaseAnalyzer/createPurchaseAnalyzer/createPurchaseAnalyzer.component';

import { ItemRateAnalyzer } from './components/itemRateAnalyzer/itemRateAnalyzer.component';
import { ItemRateAnalyzerService } from './components/itemRateAnalyzer/itemRateAnalyzer.service';
import { CreateItemRateAnalyzer } from './components/itemRateAnalyzer/createItemRateAnalyzer/createItemRateAnalyzer.component';
//import { ItemParameterComponent } from 'app/shared/itemParameter/itemParameter.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgaModule,
    Ng2SmartTableModule,
    routing,
    SharedModule,
    NgbModule.forRoot()
  ],
  declarations: [
    StockAnalyzer,
    CreateStockAnalyzer,
    ItemAverageRateAnalyzer,
  //  ItemParameterComponent,
    Utility,
    CreateItemAverageRateAnalyzer,
    ItemMovementAnalyzer,
    CreateItemMovementAnalyzer,
    ItemRateAnalyzer,
    CreateItemRateAnalyzer,
    PurchaseAnalyzer,
    CreatePurchaseAnalyzer
  ],
  providers: [
    StockAnalyzerService,
    ItemAverageRateAnalyzerService,
    ParaListService,
    ParaValueService,
    ItemMovementAnalyzerService,
    ItemRateAnalyzerService,
    PurchaseAnalyzerService
  ]
})
export class UtilityModule {
}
