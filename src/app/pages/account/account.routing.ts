import { Routes, RouterModule } from '@angular/router';

import { Account } from './account.component';
import { PaymentReceiptEntry } from './components/paymentReceiptEntry/paymentReceiptEntry.component';
import { CreatePaymentReceiptEntry } from './components/paymentReceiptEntry/createPaymentReceiptEntry/createPaymentReceiptEntry.component';



// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '',
    component: Account,
    children: [
      { path: '', redirectTo: 'paymentReceiptEntry', pathMatch: 'full' },
      { path: 'paymentReceiptEntry', component: PaymentReceiptEntry },
      { path: 'createPaymentReceiptEntry', component: CreatePaymentReceiptEntry },
      { path: 'editPaymentReceiptEntry/:paymentReceiptEntryId', component: CreatePaymentReceiptEntry },
      ]
  }
];

export const routing = RouterModule.forChild(routes);
