import { CreateZoneEntry } from './components/zoneEntry/createZoneEntry/createZoneEntry.component';
import { ZoneEntry } from './components/zoneEntry/zoneEntry.component';
import { Routes, RouterModule } from '@angular/router';
import { Categories } from './components/categories/categories.component';
import { Masters } from './masters.component';
import { Currency } from './components/currency/currency.component';
import { BankBranch } from './components/bankBranches/branches.component';
import { CreateBranch } from './components/bankBranches/createBranch/createBranch.component';
import { Common } from './components/common/common.component';
import { ExchangeRate } from './components/exchangeRate/exchangeRate.component';
import { ContactPersons } from './components/contactPersons/contactPersons.component';
import { CreateContactPerson } from './components/contactPersons/createContactPerson/createContactPerson.component';
import { Employees } from './components/employee/employees.component';
import { ParaList } from './components/parameterList/paraList.component';
import { ParaValue } from './components/parameterValue/paraValue.component';
import { ItemDetails } from './components/itemDetails/itemDetails.component';
import { CreateItemDetail } from './components/itemDetails/createItemDetail/createItemDetail.component';
import { ProType } from './components/processType/proType.component';
import { ProDetails } from './components/processDetails/proDetails.component';
import { CreateProcessDetails } from './components/processDetails/createProcessDetails/createProcessDetails.component';
import { CreateEmployees } from './components/employee/createEmployee/createEmployees.component';

// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '',
    component: Masters,
    children: [
      { path: '', redirectTo: 'categories', pathMatch: 'full' },
      { path: 'categories', component: Categories },
      { path: 'exchangeRate', component: ExchangeRate },
      { path: 'employee', component: Employees },
      { path: 'createEmployee', component: CreateEmployees },
      { path: 'editEmployee/:id', component: CreateEmployees },
      { path: 'currency', component: Currency },
      { path: 'common', component: Common },
      { path: 'bankBranch', component: BankBranch },
      { path: 'createBranch', component: CreateBranch },
      { path: 'editBranch/:isView/:bankBrId', component: CreateBranch },
      { path: 'paraList', component: ParaList },
      { path: 'paraValue', component: ParaValue },
      { path: 'itemDetail', component: ItemDetails },
      { path: 'createItemDetail', component: CreateItemDetail },
      { path: 'editItemDetail/:isView/:itemId', component: CreateItemDetail },
      { path: 'proType', component: ProType },
      { path: 'proDetail', component: ProDetails },
      { path: 'createProcessDetails', component: CreateProcessDetails },
      { path: 'editProcessDetails/:isView/:processId', component: CreateProcessDetails },
      { path: 'contactPersons', component: ContactPersons },
      { path: 'createContactPerson', component: CreateContactPerson },
      { path: 'editContactPerson/:isView/:personId', component: CreateContactPerson },
      { path: 'zoneEntry', component: ZoneEntry },
      { path: 'createZoneEntry', component: CreateZoneEntry },
      { path: 'editZoneEntry/:geoId', component: CreateZoneEntry },
    ]
  }
];

export const routing = RouterModule.forChild(routes);
