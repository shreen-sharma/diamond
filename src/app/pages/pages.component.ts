import { Component } from '@angular/core';
import { Routes } from '@angular/router';

import { BaMenuService } from '../theme';
import { PAGES_MENU } from './pages.menu';
import { MenuService } from 'app/pages/menu.service';

@Component({
  selector: 'pages',
  template: `
    <ba-sidebar></ba-sidebar>
    <ba-page-top></ba-page-top>
    <div class="al-main">
      <div class="al-content">
        <ba-content-top></ba-content-top>
        <router-outlet></router-outlet>
      </div>
    </div>
    <footer class="al-footer clearfix">
      <div class="al-footer-main clearfix">
        <div class="al-copy">&copy; <a href="/">Diamond Admin</a> 2017</div>
      </div>
    </footer>
    <ba-back-top position="200"></ba-back-top>
    `
})
export class Pages {

  menuItems: any[] = [];
  errorMessage: string;

  constructor(private _menuService: BaMenuService, private menuService: MenuService) {
    this.menuService.getUserMenus().subscribe(res => {
      delete res[0]["children"][0]["children"];
      this.menuItems = res;
      this._menuService.updateMenuByRoutes(<Routes>this.menuItems);
    }, error => {
      this.errorMessage = error;
      console.log("Server Error :" + error);
    });

    this.menuService.getLoggedInUserPermission().subscribe(res => {
      sessionStorage.setItem('UserPermission', JSON.stringify(res));
    });

  }

  ngOnInit() {
    // debugger

  }
}
