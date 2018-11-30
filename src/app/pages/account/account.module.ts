import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';
import { Account } from './account.component';
import { routing } from './account.routing';
import { Ng2SmartTableModule } from 'ng2-smart-table';

import { PaymentReceiptEntry } from './components/paymentReceiptEntry/paymentReceiptEntry.component';
import { PaymentReceiptEntryService } from './components/paymentReceiptEntry/paymentReceiptEntry.service';
import { CreatePaymentReceiptEntry } from './components/paymentReceiptEntry/createPaymentReceiptEntry/createPaymentReceiptEntry.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgaModule,
    Ng2SmartTableModule,
    routing,
    NgbModule.forRoot()
  ],
  declarations: [
    Account,
    PaymentReceiptEntry,
    CreatePaymentReceiptEntry
  ],
  providers: [
    PaymentReceiptEntryService
  ]
})
export class AccountModule {
}
