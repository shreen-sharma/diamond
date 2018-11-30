import { Subject } from 'rxjs/Subject';
import { ZoneEntryService } from './../../zoneEntry.service';
import { AbstractControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { Location } from '@angular/common';
import { AuthenticationService } from '../../../../../../core/authentication/authentication.service';
import { Logger } from '../../../../../../core/logger.service';


const log = new Logger('state');

@Component({
  selector: 'zoneEntry-state',
  templateUrl: './state.html'
})
export class StateZE implements OnInit {

   successMessage: string;
   @Output() message: EventEmitter<string> = new EventEmitter<string>();
   @Output() err: EventEmitter<string> = new EventEmitter<string>();

   @Input()
   set data(state: any) {
    if (state.geoId) {
      this.isEdit = true;
    }
    this.stateForm.patchValue(state);
   }

  isEdit: boolean;
  stateForm: FormGroup;
  error: string = null;

  countryList= [];

  public name: AbstractControl;
  public code: AbstractControl;
  public parent: AbstractControl;

  private _success = new Subject<string>();

  constructor(private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder,
    private service: ZoneEntryService,
    private authService: AuthenticationService) {
    this.createForm();

    this.service.getAllGeoByType('CM').subscribe( (countryList) => {
      this.countryList = countryList;
      console.log(countryList);
     });
  }

  handleBack(cancelling: boolean) {
    // this.router.navigate(['../zoneEntry'], {relativeTo: this.route});
    this.location.back();
  }
  ngOnInit(): void {
    this._success.subscribe((message) => this.successMessage = message);
  }
  // onCountryChange(zoneId: any){
  //   if(this.geoId){
  //           this.parent.setValue(zoneId);
  //           console.log(zoneId);
  //         }
  // }

  submit() {
    if (this.stateForm.valid) {
     if (this.isEdit) {
       this.service.updateGeo(this.stateForm.value)
       .subscribe(state => {
         console.log(state);
         this._success.next(`State Successfully Saved! Go To Next Tab`);
         this.message.emit(this.successMessage);
        //  this.stateForm.reset();
        this.createForm();
        this.location.back();

       }, error => {
         log.debug(`Creation error: ${error}`);
         this.error = error;
         this._success.next(`State Creation Fail!`);
         this.message.emit(this.successMessage);
         this.err.emit(this.error);
       });
     } else {
       this.service.addGeo(this.stateForm.value)
       .subscribe(state => {
         console.log(state);
         this._success.next(`State Successfully Saved! Go To Next Tab`);
         this.message.emit(this.successMessage);
        //  this.stateForm.reset();
        this.createForm();

       }, error => {
         log.debug(`Creation error: ${error}`);
         this.error = error;
         this._success.next(`State Creation Fail!`);
         this.message.emit(this.successMessage);
         this.err.emit(this.error);
       });
      }
    }
   }

   private createForm() {
     this.stateForm = this.fb.group({
      'name': ['', Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(100)])],
      'code': ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(5)])],
      'geoType': ['ST'],

      'geoId': [''],
      // 'currId': [''],
      'parent': ['', Validators.compose([Validators.required])],
      // 'telCode': [''],

      // 'userId': [0, Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(100)])],
      // 'entryDate': ['2017-10-07T08:39:33.419Z', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(100)])],
    });
    this.name = this.stateForm.controls['name'];
    this.code = this.stateForm.controls['code'];
    this.parent = this.stateForm.controls['parent'];
   }
}
