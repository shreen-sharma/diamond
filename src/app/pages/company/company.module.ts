import { SetupService } from './components/setup/setup.service';
import { Setup } from './components/setup/setup.component';
import { ZoneEntryService } from '../masters/components/zoneEntry/zoneEntry.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';
import { Company } from './company.component';
import { routing } from './company.routing';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { TreeviewModule } from 'ngx-treeview';
import { CommonModalComponent } from '../../shared/common-modal/common-modal.component';
import { SharedModule } from '../../shared/shared.module';
// import { PaymentReceiptEntry } from './components/paymentReceiptEntry/paymentReceiptEntry.component';
// import { PaymentReceiptEntryService } from './components/paymentReceiptEntry/paymentReceiptEntry.service';
// import { CreatePaymentReceiptEntry } from './components/paymentReceiptEntry/createPaymentReceiptEntry/createPaymentReceiptEntry.component';
import { HierarchyCreation } from './components/hierarchyCreation/hierarchyCreation.component';
import { HierarchyCreationService } from './components/hierarchyCreation/hierarchyCreation.service';
import { HierarchyRelation } from './components/hierarchyRelation/';
import { HierarchyDepartment } from './components/hierarchyRelation/hierarchyDepartment/';
import { HierarchyDivision } from './components/hierarchyRelation/hierarchyDivision/';
import { HierarchyLocation } from './components/hierarchyRelation/hierarchyLocation/';
import { HierarchySubDepartment } from './components/hierarchyRelation/hierarchySubDepartment/';
import { HierarchyRelationService } from './components/hierarchyRelation/';
import { CreateHierarchy } from './components/hierarchyCreation/createHierarchy/createHierarchy.component';
import { PartyDetails } from './components/partyDetails/partyDetails.component';
import { CreatePartyDetails } from './components/partyDetails/createPartyDetails/createPartyDetails.component';
import { PartyDetailsService } from './components/partyDetails/partyDetails.service';
import { CompanyHierarchy } from './components/companyHierarchy/companyHierarchy.component';
import { CompanyHierarchyService } from './components/companyHierarchy/companyHierarchy.service';
import { CompanyEmployee } from './components/companyEmployee/companyEmployee.component';
import { CreateCompanyEmployee } from './components/companyEmployee/createCompanyEmployee/createCompanyEmployee.component';
import { CompanyEmployeeService } from './components/companyEmployee/companyEmployee.service';
import { CommonService } from '../masters/components/common/common.service';
import { BranchService } from '../masters/components/bankBranches/branch.service';
import { PartyAccount } from './components/partyAccount/partyAccount.component';
import { CreatePartyAccount } from './components/partyAccount/createPartyAccount/createPartyAccount.component';
import { PartyAccountService } from './components/partyAccount/partyAccount.service';
import { ProDetailService } from '.../../app/pages/masters/components/processDetails/proDetails.service';
import { ProTypeService } from '.../../app/pages/masters/components/processType/proType.service';

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
    Company,
    // PaymentReceiptEntry,
    // CreatePaymentReceiptEntry
    HierarchyCreation,
    CreateHierarchy,
    HierarchyRelation,
    HierarchyDepartment,
    HierarchyDivision,
    HierarchyLocation,
    HierarchySubDepartment,
    CompanyHierarchy,
    PartyDetails,
    CreatePartyDetails,
    CompanyEmployee,
    CreateCompanyEmployee,
    Setup,
    PartyAccount,
    CreatePartyAccount,
  ],
  providers: [
    HierarchyCreationService,
    HierarchyRelationService,
    CompanyHierarchyService,
    PartyDetailsService,
    CompanyEmployeeService,
    CommonService,
    ZoneEntryService,
    SetupService,
    BranchService,
    PartyAccountService,
    ProDetailService,
    ProTypeService
    // PaymentReceiptEntryService
  ]
})
export class CompanyModule {
}
