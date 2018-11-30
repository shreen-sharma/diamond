import { Subject } from 'rxjs/Subject';
import { ZoneEntryService } from './../../zoneEntry.service';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { Location } from '@angular/common';
import { AuthenticationService } from '../../../../../../core/authentication/authentication.service';
import { Logger } from '../../../../../../core/logger.service';


const log = new Logger('country');

@Component({
  selector: 'zoneEntry-country',
  templateUrl: './country.html',
})
export class CountryZE implements OnInit {

   successMessage: string;
   @Output() message: EventEmitter<string> = new EventEmitter<string>();
   @Output() err: EventEmitter<string> = new EventEmitter<string>();

   @Input()
   set data(country: any) {
    if (country.geoId) {
      this.isEdit = true;
    }
    this.countryForm.patchValue(country);
   }

  isEdit: boolean;
  countryForm: FormGroup;
  error: string = null;

  zoneList = [];
  currencyList = [];

  public name: AbstractControl;
  public code: AbstractControl;
  public currId: AbstractControl;
  public parent: AbstractControl;
  public telCode: AbstractControl;

   private _success = new Subject<string>();

  constructor(private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder,
    private service: ZoneEntryService,
    private authService: AuthenticationService) {
    this.createForm();

    this.service.getAllGeoByType('ZO').subscribe( (zoneList) => {
      this.zoneList = zoneList;
     });

     this.service.getAllCurrencies().subscribe( (currencyList) => {
      this.currencyList = currencyList;
     });

  }

  handleBack(cancelling: boolean) {
    // this.router.navigate(['../zoneEntry'], {relativeTo: this.route});
    this.location.back();
  }
  ngOnInit(): void {
    this._success.subscribe((message) => this.successMessage = message);
  }
//   onZoneChange(zoneId: any)
//   {
//     if(this.geoId){
// debugger;
//       this.parent.setValue(zoneId);
//       console.log(zoneId);
//     }
//   }

  submit() {
   if (this.countryForm.valid) {
    if (this.isEdit) {
      this.service.updateGeo(this.countryForm.value)
      .subscribe(country => {
        console.log(country);
        this._success.next(`Country Successfully Saved! Go To Next Tab`);
        this.message.emit(this.successMessage);
        // this.countryForm.reset();
        this.createForm();
        this.location.back();
      }, error => {
        log.debug(`Creation error: ${error}`);
        this.error = error;
        this._success.next(`Country Creation Fail!`);
        this.message.emit(this.successMessage);
        this.err.emit(this.error);
      });
    } else {
      this.service.addGeo(this.countryForm.value)
      .subscribe(country => {
        this._success.next(`Country Successfully Saved! Go To Next Tab`);
        this.message.emit(this.successMessage);
        console.log(country);
        // this.countryForm.reset();
        this.createForm();
      }, error => {
        log.debug(`Creation error: ${error}`);
        this.error = error;
        this._success.next(`Country Creation Fail!`);
        this.message.emit(this.successMessage);
        this.err.emit(this.error);
      });
     }
   }
  }

  private createForm() {
    this.countryForm = this.fb.group({
      'name': ['', Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(100)])],
      'code': ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(5)])],
      'geoType': ['CM'],

      'geoId': [''],
      'currId': ['', Validators.compose([Validators.required])],
      'parent': ['', Validators.compose([Validators.required])],
      'telCode': ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(10)])],
      // 'userId': [0],
      // 'entryDate': ['2017-10-07T08:39:33.419Z', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(100)])],

    });
    this.name = this.countryForm.controls['name'];
    this.code = this.countryForm.controls['code'];

    this.currId = this.countryForm.controls['currId'];
    this.parent = this.countryForm.controls['parent'];
    this.telCode = this.countryForm.controls['telCode'];


  }

}
