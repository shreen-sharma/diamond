import { ItemChartDetailsModal } from './itemChart/itemChartDetails-modal/itemChartDetails-modal.component';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppTranslationModule } from '../../app.translation.module';
import { NgaModule } from '../../theme/nga.module';

import { Dashboard } from './dashboard.component';
import { routing }       from './dashboard.routing';

import { PopularApp } from './popularApp';
import { PieChart } from './pieChart';
import { ItemChart } from './itemChart';
import { UsersMap } from './usersMap';
import { LineChart } from './lineChart';
import { Feed } from './feed';
import { Todo } from './todo';
import { Calendar } from './calendar';
import { CalendarService } from './calendar/calendar.service';
import { FeedService } from './feed/feed.service';
import { LineChartService } from './lineChart/lineChart.service';
import { PieChartService } from './pieChart/pieChart.service';
import { TodoService } from './todo/todo.service';
import { ItemChartService } from './itemChart/itemChart.service';
import { UsersMapService } from './usersMap/usersMap.service';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { LotItemCreationService } from '.../../app/pages/stockManagement/components/lotItemCreation/lotItemCreation.service';
import { LotService } from '.../../app/pages/stockManagement/components/lots/lot.service';
import { ItemSummaryModal } from 'app/pages/dashboard/itemSummary-modal/itemSummary-modal.component';
import { ItemSummaryService } from 'app/pages/dashboard/itemSummary-modal/itemSummary-modal.service';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import { MovementsReportService } from '.../../app/pages/reports/components/movementsReport/movementsReport.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AppTranslationModule,
    NgbModalModule,
    NgaModule,
    Ng2SmartTableModule,
    routing,
    MultiselectDropdownModule
  ],
  declarations: [
    PopularApp,
    PieChart,
    ItemChart,
    UsersMap,
    LineChart,
    Feed,
    Todo,
    Calendar,
    Dashboard,
    ItemChartDetailsModal,
    ItemSummaryModal,
  ],
  entryComponents: [
    ItemChartDetailsModal,
    ItemSummaryModal
  ],
  providers: [
    CalendarService,
    FeedService,
    LineChartService,
    PieChartService,
    TodoService,
    ItemChartService,
    UsersMapService,
    LotItemCreationService,
    LotService,
    ItemSummaryService,
    MovementsReportService
  ]
})
export class DashboardModule {}
