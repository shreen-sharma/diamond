import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { routing } from './pages.routing';
import { NgaModule } from '../theme/nga.module';
import { AppTranslationModule } from '../app.translation.module';

import { Pages } from './pages.component';
import { MenuService } from 'app/pages/menu.service';
// import { ChangePasswordComponent } from './change-password/change-password.component';

@NgModule({
  imports: [CommonModule, AppTranslationModule, NgaModule, routing, FormsModule, ReactiveFormsModule],
  declarations: [Pages],
  providers: [MenuService]
})
export class PagesModule {
}
