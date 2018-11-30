import { Setup } from './components/setup/setup.component';
import { Routes, RouterModule } from '@angular/router';

import { Company } from './company.component';
import { HierarchyCreation } from './components/hierarchyCreation/hierarchyCreation.component';
import { CompanyHierarchy } from './components/companyHierarchy/companyHierarchy.component';
import { HierarchyRelation } from './components/hierarchyRelation/hierarchyRelation.component';
import { CreateHierarchy } from './components/hierarchyCreation/createHierarchy/createHierarchy.component';
import { PartyDetails } from './components/partyDetails/partyDetails.component';
import { CreatePartyDetails } from './components/partyDetails/createPartyDetails/createPartyDetails.component';
import { CompanyEmployee } from './components/companyEmployee/companyEmployee.component';
import { CreateCompanyEmployee } from './components/companyEmployee/createCompanyEmployee/createCompanyEmployee.component';
// import { PaymentReceiptEntry } from './components/paymentReceiptEntry/paymentReceiptEntry.component';
// import { CreatePaymentReceiptEntry } from './components/paymentReceiptEntry/createPaymentReceiptEntry/createPaymentReceiptEntry.component';
import { PartyAccount } from './components/partyAccount/partyAccount.component';
import { CreatePartyAccount } from './components/partyAccount/createPartyAccount/createPartyAccount.component';


// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '',
    component: Company,
    children: [
        { path: 'hierarchyCreation', component: HierarchyCreation },
        { path: 'createHierarchy', component: CreateHierarchy },
        { path: 'editHierarchy/:isView/:hierId', component: CreateHierarchy },
        { path: 'viewHierarchy/:isView/:hierId', component: CreateHierarchy },
        { path: 'hierarchyRelation', component: HierarchyRelation },
        { path: 'companyHierarchy', component: CompanyHierarchy },
        { path: 'partyDetails', component: PartyDetails },
        { path: 'createPartyDetails', component: CreatePartyDetails },
        { path: 'editPartyDetails/:isView/:partyId', component: CreatePartyDetails },
        { path: 'viewPartyDetails/:isView/:partyId', component: CreatePartyDetails },
        { path: 'companyEmployee', component: CompanyEmployee },
        { path: 'createCompanyEmployee', component: CreateCompanyEmployee },
        { path: 'editCompanyEmployee/:empId', component: CreateCompanyEmployee },
        { path: 'setup', component: Setup },
        { path: 'partyAccount', component: PartyAccount },
        { path: 'createPartyAccount', component: CreatePartyAccount },
        { path: 'editPartyAccount/:partyAccId', component: CreatePartyAccount },
    //   { path: '', redirectTo: 'paymentReceiptEntry', pathMatch: 'full' },
    //   { path: 'paymentReceiptEntry', component: PaymentReceiptEntry },
    //   { path: 'createPaymentReceiptEntry', component: CreatePaymentReceiptEntry },
    //   { path: 'editPaymentReceiptEntry/:paymentReceiptEntryId', component: CreatePaymentReceiptEntry },
      ]
  }
];

export const routing = RouterModule.forChild(routes);
