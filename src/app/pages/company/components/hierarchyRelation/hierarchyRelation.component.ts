import { Logger } from '../../../../core';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap/tabset/tabset.module';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AuthenticationService } from '../../../../core/authentication/authentication.service';
import { Location } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';

const log = new Logger('HierarchyRelation');

@Component({
  selector: 'hierarchy-relation',
  templateUrl: './hierarchyRelation.html',
  styleUrls: ['./hierarchyRelation.scss']

})
export class HierarchyRelation {

  @ViewChild(NgbTabset)
  ngbTabset: NgbTabset;

  successMessage: String;
  status = 'success';

  hierRelData: any = {};

  constructor() {
  }

  onMessage(msg: String) {
    this.successMessage = msg;
    setTimeout(() => this.successMessage = null, 2000);
    this.status = 'success';
  }

  onError(error: String) {
    this.status = 'danger'
  }
  onTabChange($event: NgbTabChangeEvent) {
    this.successMessage = null;
  }

  submit() {

  }

}
