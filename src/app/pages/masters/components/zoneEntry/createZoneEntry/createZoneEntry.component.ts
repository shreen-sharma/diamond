import { NgbTabset } from '@ng-bootstrap/ng-bootstrap/tabset/tabset.module';
import { ZoneEntryService } from '../zoneEntry.service';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { Location } from '@angular/common';
import { AuthenticationService } from '../../../../../core/authentication/authentication.service';
import { Logger } from '../../../../../core/logger.service';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';


const log = new Logger('CreateZoneEntry');

@Component({
  selector: 'create-ZoneEntry',
  templateUrl: './createZoneEntry.html',
  styleUrls: ['./createZoneEntry.scss']
})
export class CreateZoneEntry implements OnInit {
  @ViewChild(NgbTabset)
  ngbTabset: NgbTabset;

  zoneEntryIdParam: String;
  pageTitle = 'Zone Entry'
  successMessage: String;
  status = 'success';
  editStatus: boolean = false;
  accessList: any[] = [];
  upDateAccess: boolean=false;
  geoEditData: any = {};

  constructor(private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder,
    private zoneEntryService: ZoneEntryService,
    private authService: AuthenticationService) {
      this.accessList = this.authService.getUserAccessOfMenu('zoneEntry');
      this.upDateAccess = this.accessList.includes("UPDATE");
      this.upDateAccess = this.accessList.includes("ADD");
     

  }

  ngOnInit() {
    if (this.zoneEntryService.geoEditData) {
      this.geoEditData = JSON.parse(JSON.stringify(this.zoneEntryService.geoEditData));
      switch (this.geoEditData.geoType) {
        case 'ZO':
          
          setTimeout(() => { 
            this.ngbTabset.select('zone');
            this.editStatus = true;
          });
          break;
        case 'CM':
          setTimeout(() => {
            this.ngbTabset.select('country');
            this.editStatus = true;
          });
          break;
        case 'ST':
          setTimeout(() => {
            this.ngbTabset.select('state');
            this.editStatus = true;
          });
          break;
        case 'CT':
          setTimeout(() => {
            this.ngbTabset.select('city');
            this.editStatus = true;
          });
          break;
      }
      this.zoneEntryService.geoEditData = null;
    }
  }

  onMessage(msg: String) {
    this.successMessage = msg;
    setTimeout(() => this.successMessage = null, 2000);
    this.status = 'success';
  }

  onTabChange($event: NgbTabChangeEvent) {
    this.successMessage = null;
  }

  onError(error: String) {
    this.status = 'danger'
  }

  submit() {

  }


  handleBack(cancelling: boolean) {
    // TODO: if cancelling then ask to confirn

    if (this.zoneEntryIdParam) {
      // this.router.navigate(['../../bankBranch'], {relativeTo: this.route});
      this.location.back();
    } else {
      this.location.back();
      // this.router.navigate(['../bankBranch'], {relativeTo: this.route});
    }
  }

}
