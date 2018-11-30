import { Subject } from 'rxjs/Subject';
import { ZoneEntryService } from './../../zoneEntry.service';
import { Validators, FormBuilder, AbstractControl, FormGroup } from '@angular/forms';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { Location } from '@angular/common';
import { AuthenticationService } from '../../../../../../core/authentication/authentication.service';
import { Logger } from '../../../../../../core/logger.service';

const log = new Logger('city');

@Component({
  selector: 'zoneEntry-city',
  templateUrl: './city.html'
})
export class CityZE implements OnInit {


   successMessage: string;
   @Output() message: EventEmitter<string> = new EventEmitter<string>();
   @Output() err: EventEmitter<string> = new EventEmitter<string>();

   @Input()
   set data(city: any) {
    if (city.geoId) {
      this.isEdit = true;
      let val: number;
      val = 0;
      this.service.getAllGeo().subscribe( (country) => {
        country.forEach(element => {
          if (city.parent === element.geoId) {
            val = element.parent
            this.cityForm.controls['country'].setValue(val);
            this.onCountryChange(val);
            this.cityForm.patchValue(city);
          }
        });
      });
    }
   }

  isEdit: boolean;
  cityForm: FormGroup;
  error: string = null;

  countryList: any[] = [];
  stateList: any[] = [];


  public name: AbstractControl;
  public code: AbstractControl;
  public parent: AbstractControl;
  public telCode: AbstractControl;
  public country: AbstractControl;


   private _success = new Subject<string>();

  constructor(private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private location: Location,
    private service: ZoneEntryService,
    private authService: AuthenticationService) {
    this.createForm();

    this.service.getAllGeoByType('CM').subscribe( (countryList) => {
      this.countryList = countryList;
      console.log(countryList);
     });

    //  this.service.getAllGeoByType('ST').subscribe( (stateList) => {
    //   this.stateList = stateList;
    //  });
  }

  onCountryChange(value: number) {
    this.cityForm.controls['parent'].setValue('');
    this.service.getAllStatesOfCountry(value).subscribe((stateList) => {
      this.stateList = stateList;
    });
   }

  handleBack(cancelling: boolean) {
    // this.router.navigate(['../zoneEntry'], {relativeTo: this.route});
    this.location.back();
  }

  ngOnInit(): void {
    this._success.subscribe((message) => this.successMessage = message);
  }

  submit() {
   if (this.cityForm.valid) {
    if (this.isEdit) {
      this.service.updateGeo(this.cityForm.value)
      .subscribe(city => {
        console.log(city);
        // this._success.next(`City Successfully Saved!`);
        // this.message.emit(this.successMessage);
        this.location.back();
      }, error => {
        log.debug(`Creation error: ${error}`);
        this.error = error;
        this._success.next(`City Creation Fail!`);
        this.message.emit(this.successMessage);
        this.err.emit(this.error);
      });
    } else {
      this.service.addGeo(this.cityForm.value)
      .subscribe(city => {
        console.log(city);
        // this._success.next(`City Successfully Saved!`);
        // this.message.emit(this.successMessage);
        this.location.back();
      }, error => {
        log.debug(`Creation error: ${error}`);
        this.error = error;
        this._success.next(`City Creation Fail!`);
        this.message.emit(this.successMessage);
        this.err.emit(this.error);
      });
     }
   }
  }

  private createForm() {
    this.cityForm = this.fb.group({
      'name': ['', Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(100)])],
      'code': ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(5)])],
      'geoType': ['CT'],
      'geoId': [''],
      // 'currId': [''],
      'country': [''],
      'parent': ['', Validators.compose([Validators.required])],
      'telCode': ['',  Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(10)])],
      // 'userId': [0],
      // 'entryDate': ['2017-10-07T08:39:33.419Z', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(100)])],
    });

    this.name = this.cityForm.controls['name'];
    this.code = this.cityForm.controls['code'];

    this.parent = this.cityForm.controls['parent'];
    this.telCode = this.cityForm.controls['telCode'];
    this.country = this.cityForm.controls['country'];

  }
}
