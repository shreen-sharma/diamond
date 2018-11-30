import { PartyDetailsService } from 'app/pages/company/components/partyDetails/partyDetails.service';
import { ParameterComponent } from './components/itemDetails/createItemDetail/itemParameter/parameter.component';
import { UniqParamPipe } from './components/itemDetails/createItemDetail/itemParameter/uniqParam.pipe';
import { CityZE } from './components/zoneEntry/createZoneEntry/city/city.component';
import { CountryZE } from './components/zoneEntry/createZoneEntry/country/country.component';
import { ZoneZE } from './components/zoneEntry/createZoneEntry/zone/zone.component';
import { ZoneEntryService } from './components/zoneEntry/zoneEntry.service';
import { ZoneEntry } from './components/zoneEntry/zoneEntry.component';
import { CreateZoneEntry } from './components/zoneEntry/createZoneEntry/createZoneEntry.component';
// import { IssueReturnComponent } from './components/processDetails/createProcessDetails/issueReturn/issueReturn.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';
import { CategoryService } from './components/categories/category.service';
import { Categories } from './components/categories/categories.component';
import { Currency } from './components/currency/currency.component';
import { CurrencyService } from './components/currency/currency.service';
import { BankBranch } from './components/bankBranches/branches.component';
import { CreateBranch } from './components/bankBranches/createBranch/createBranch.component';
import { BranchService } from './components/bankBranches/branch.service';
import { Masters } from './masters.component';
import { routing } from './masters.routing';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { TreeviewModule } from 'ngx-treeview';
import { Common } from './components/common/common.component';
import { CommonService } from './components/common/common.service';
import { ExchangeRate } from './components/exchangeRate/exchangeRate.component';
import { ExchangeRateService } from './components/exchangeRate/exchangeRate.service';
 import { HierarchyCreationService } from '../company/components/hierarchyCreation/hierarchyCreation.service';
 import { HierarchyRelationService } from '../company/components/hierarchyRelation/';
import { ContactPersons } from './components/contactPersons/contactPersons.component';
import { CreateContactPerson } from './components/contactPersons/createContactPerson/createContactPerson.component';
import { ContactPersonService } from './components/contactPersons/contactPerson.service';
import { Employees } from './components/employee/employees.component';
import { EmployeeService } from './components/employee/employee.service';
import { CreateEmployees } from './components/employee/createEmployee/createEmployees.component';

import { ParaList } from './components/parameterList/paraList.component';
import { ParaListService } from './components/parameterList/paraList.service';
import { ParaValue } from './components/parameterValue/paraValue.component';
import { ParaValueService } from './components/parameterValue/paraValue.service';
import { ItemDetails } from './components/itemDetails/itemDetails.component';
import { CreateItemDetail } from './components/itemDetails/createItemDetail/createItemDetail.component';
import { ItemDetailsService } from './components/itemDetails/itemDetails.service';
import { ProType } from './components/processType/proType.component';
import { ProTypeService } from './components/processType/proType.service';
import { ProDetails } from './components/processDetails/proDetails.component';
import { CreateProcessDetails } from './components/processDetails/createProcessDetails/createProcessDetails.component';
import { ProDetailService } from './components/processDetails/proDetails.service';
import { StateZE } from './components/zoneEntry/createZoneEntry/state';
import { CommonModalComponent } from '../../shared/common-modal/common-modal.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgaModule,
    SharedModule,
    Ng2SmartTableModule,
    routing,
    TreeviewModule.forRoot(),
    NgbModule.forRoot()
  ],
  declarations: [
    Masters,
    Categories,
    Currency,
    ZoneZE,
    StateZE,
    CountryZE,
    CityZE,
    Common,
    BankBranch,
    CreateBranch,
    ExchangeRate,
    Employees,
    CreateEmployees,
    ParaList,
    ParaValue,
    UniqParamPipe,
    ItemDetails,
    // IssueReturnComponent,
    CreateItemDetail,
    ProType,
    ProDetails,
    CreateProcessDetails,
    ContactPersons,
    CreateContactPerson,
    ZoneEntry,
    CreateZoneEntry,
    ParameterComponent
  ],
  providers: [
    CategoryService,
    CurrencyService,
    CommonService,
    BranchService,
    ExchangeRateService,
    HierarchyCreationService,
    HierarchyRelationService,
    EmployeeService,
    ParaListService,
    ParaValueService,
    ItemDetailsService,
    ProTypeService,
    ProDetailService,
    ContactPersonService,
    PartyDetailsService,
    ZoneEntryService
  ]
})
export class MastersModule {
}
