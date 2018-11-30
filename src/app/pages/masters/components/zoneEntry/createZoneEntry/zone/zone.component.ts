import { ZoneEntryService } from './../../zoneEntry.service';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { Location } from '@angular/common';
import { AuthenticationService } from '../../../../../../core/authentication/authentication.service';
import { Logger } from '../../../../../../core/logger.service';
import {Subject} from 'rxjs/Subject';
import {debounceTime} from 'rxjs/operator/debounceTime';

const log = new Logger('zone');

@Component({
  selector: 'zoneEntry-zone',
  templateUrl: './zone.html'

})
export class ZoneZE implements OnInit {

   successMessage: string;
   @Output() message: EventEmitter<string> = new EventEmitter<string>();
   @Output() err: EventEmitter<string> = new EventEmitter<string>();

   @Input()
   set data(zone: any) {
     if (zone.geoId) {
       this.isEdit = true;
     }
    this.zoneForm.patchValue(zone);
   }
  isEdit: boolean;
  geoIdParam: String;
  zoneForm: FormGroup;
  error: string = null;

  public name: AbstractControl;
  public code: AbstractControl;

  private _success = new Subject<string>();

  constructor(private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder,
    private service: ZoneEntryService,
    private authService: AuthenticationService) {

    this.createForm();
      // this.geoType.setValue('ZO');

  }

  handleBack(cancelling: boolean) {
    // this.router.navigate(['../zoneEntry'], {relativeTo: this.route});
    this.location.back();
  }
  ngOnInit(): void {
    // setTimeout(() => this.staticAlertClosed = true, 20000);
    // this.zoneForm.reset();
        this._success.subscribe((message) => this.successMessage = message);
        // debounceTime.call(this._success, 5000).subscribe(() => this.successMessage = null);
  }

  submit() {
    if (this.zoneForm.valid) {
    if (this.isEdit) {
      this.service.updateGeo(this.zoneForm.value)
      .subscribe(zone => {
        this._success.next(`Zone Successfully Saved! Go To Next Tab`);
        this.message.emit(this.successMessage);
        // this.zoneForm.reset();
        this.createForm();
        this.location.back();
        // this.zoneForm.markAsPristine();
        // this.zoneForm.markAsUntouched();
      }, error => {
        log.debug(`Creation error: ${error}`);
        this.error = error;
        this._success.next(`Zone Creation Fail!`);
        this.message.emit(this.successMessage);
        this.err.emit(this.error);
      });
    } else {
      this.service.addGeo(this.zoneForm.value)
      .subscribe(zone => {
        this._success.next(`Zone Successfully Saved! Go To Next Tab`);
        this.message.emit(this.successMessage);
        // this.zoneForm.reset();
        this.createForm();
      }, error => {
        log.debug(`Creation error: ${error}`);
        this.error = error;
        this._success.next(`Zone Creation Fail!`);
        this.message.emit(this.successMessage);
        this.err.emit(this.error);
      });
     }
    }
  }

  private createForm() {
    this.zoneForm = this.fb.group({
      'geoId': [''],
      'name': ['', Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(100)])],
      'code': ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(5)])],
      'geoType': ['ZO'],
      // 'currId': [''],
      // 'parent': [''],
      // 'telCode': [''],
      // 'userId': [''],
      // 'entryDate': ['']

    });
    this.name = this.zoneForm.controls['name'];
    this.code = this.zoneForm.controls['code'];
        // this.zoneForm.controls['name'].markAsPristine();
        // this.zoneForm.controls['code'].markAsPristine();
  }
}
