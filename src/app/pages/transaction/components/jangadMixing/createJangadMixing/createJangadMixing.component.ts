import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';

import { AuthenticationService } from '../../../../../core/authentication/authentication.service';
import { Logger } from '../../../../../core/logger.service';
import { JangadMixings, JangadMixingService } from '../jangadMixing.service';

const log = new Logger('JangadMixings');

@Component({
  selector: 'create-jangadMixing',
  templateUrl: './createJangadMixing.html',
  styleUrls: ['./createJangadMixing.scss']
})
export class CreateJangadMixing implements OnInit  {
  jangadMixingIdParam: string;
  pageTitle = 'Create Jangad Mixing ';

  error: string = null;
  isLoading = false;
  jangadMixingForm: FormGroup;

  public selectPartyAccount: AbstractControl;
  public jangadMixingDate: AbstractControl;
  public selectLot: AbstractControl;
  public availableJangad: AbstractControl;
  public utilizedCarats: AbstractControl;
  public processedCarats: AbstractControl;
  public processedPieces: AbstractControl;
  public averageReturn: AbstractControl;
  public adjustedToJangadNo: AbstractControl;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private service: JangadMixingService,
    private authService: AuthenticationService) {
      this.createForm();
  }

  ngOnInit() {

    this.route.params.subscribe((params: Params) => {
      this.jangadMixingIdParam = params['jangadMixingId'];
      if (this.jangadMixingIdParam) {
        this.pageTitle = 'Edit Jangad Mixing';
        const jangadMixingData: any = this.service.getJangadMixingById(this.jangadMixingIdParam);
        this.jangadMixingForm.patchValue(jangadMixingData);
      }
    });
  }

  submit() {
    this.isLoading = true;
    const formValue: any = this.jangadMixingForm.value;

  if (this.jangadMixingIdParam) {
    this.service.updateJangadMixing(this.jangadMixingForm.value)
    .subscribe( jangadMixing => {
      // log.debug(`${credentials.selectCategory} successfully logged in`);
      this.handleBack();
      this.finally();
    }, error => {
      log.debug(`Creation error: ${error}`);
      this.error = error;
      this.finally();
    });
  } else {
      this.service.createJangadMixing(this.jangadMixingForm.value)
      .subscribe(jangadMixing => {
        // log.debug(`${credentials.selectCategory} successfully logged in`);
        this.handleBack();
        this.finally();
      }, error => {
        log.debug(`Creation error: ${error}`);
        this.error = error;
        this.finally();
      });
    }
  }

  finally() {
      this.isLoading = false;
      this.jangadMixingForm.markAsPristine();
  }

  handleBack(cancelling: boolean = false) {
    // TODO: if cancelling then ask to confirn

    if (this.jangadMixingIdParam) {
      this.router.navigate(['../../jangadMixing'], {relativeTo: this.route});
    } else {
      this.router.navigate(['../jangadMixing'], {relativeTo: this.route});
    }
  }

  private createForm() {
    this.jangadMixingForm = this.fb.group({
      'id': [''],
      'selectPartyAccount': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'jangadMixingDate': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'selectLot': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'availableJangad': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'utilizedCarats': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'processedCarats': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'processedPieces': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'averageReturn': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'adjustedToJangadNo': ['', Validators.compose([Validators.required, Validators.minLength(4)])]
    });

    this.selectPartyAccount = this.jangadMixingForm.controls['selectPartyAccount'];
    this.jangadMixingDate = this.jangadMixingForm.controls['jangadMixingDate'];
    this.selectLot = this.jangadMixingForm.controls['selectLot'];
    this.availableJangad = this.jangadMixingForm.controls['availableJangad'];
    this.utilizedCarats = this.jangadMixingForm.controls['utilizedCarats'];
    this.processedCarats = this.jangadMixingForm.controls['processedCarats'];
    this.processedPieces = this.jangadMixingForm.controls['processedPieces'];
    this.averageReturn = this.jangadMixingForm.controls['averageReturn'];
    this.adjustedToJangadNo = this.jangadMixingForm.controls['adjustedToJangadNo'];
  }
}
