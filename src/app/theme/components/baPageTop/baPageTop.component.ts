import { AuthenticationService } from '../../../core/authentication';
import {Component} from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import { Router } from '@angular/router';
import {GlobalState} from '../../../global.state';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'ba-page-top',
  templateUrl: './baPageTop.html',
  styleUrls: ['./baPageTop.scss']
})
export class BaPageTop {

  public isScrolled:boolean = false;
  public isMenuCollapsed:boolean = false;

  constructor(private _state:GlobalState, private authService: AuthenticationService,
    private router: Router,    private route: ActivatedRoute,
  ) {
    this._state.subscribe('menu.isCollapsed', (isCollapsed) => {
      this.isMenuCollapsed = isCollapsed;
    });
  }

  public toggleMenu() {
    this.isMenuCollapsed = !this.isMenuCollapsed;
    this._state.notifyDataChanged('menu.isCollapsed', this.isMenuCollapsed);
    return false;
  }

  public scrolledChanged(isScrolled) {
    this.isScrolled = isScrolled;
  }

  public signout() {
    sessionStorage.clear();
    this.authService.logout();
  }
  public userProfile() {
    debugger;
    const details = this.authService.credentials;
    this.router.navigate(['pages/userManagement/userProfile/' + details.username]);
    }
}
