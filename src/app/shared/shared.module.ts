import { CommonModalComponent } from './common-modal/common-modal.component';
import { NgaModule } from '../theme/nga.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ItemParameterComponent } from './itemParameter/itemParameter.component';
import { DefaultNumberComponent } from 'app/shared/defaultNumberComponent/defaultNumber.components';
import { CreatedDateRenderComponent } from './createdDateRenderComponent/createdDateRender.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from './loader/loader.component';
import { PrintDCComponent } from './print-dc/print-dc.component';
import { PrintInvoiceComponent } from './print-invoice/print-invoice.component';
import { PrintExportComponent } from './print-export/print-export.component';
import { PrintConsignmentComponent } from './print-consignment/print-consignment.component';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgaModule
   ],
  declarations: [
    LoaderComponent,
    CreatedDateRenderComponent,
    DefaultNumberComponent,
    ItemParameterComponent,
    CommonModalComponent,
    PrintDCComponent,
    PrintInvoiceComponent,
    PrintExportComponent,
    PrintConsignmentComponent,
  ],
  entryComponents: [
    LoaderComponent,
    CreatedDateRenderComponent,
    DefaultNumberComponent,
    ItemParameterComponent,
    CommonModalComponent,
    PrintDCComponent,
    PrintInvoiceComponent,
    PrintExportComponent,
    PrintConsignmentComponent,
  ],
  exports: [
    LoaderComponent,
    CreatedDateRenderComponent,
    DefaultNumberComponent,
    ItemParameterComponent,
    CommonModalComponent,
    PrintDCComponent,
    PrintInvoiceComponent,
    PrintExportComponent,
    PrintConsignmentComponent,
  ],
})
export class SharedModule { }
