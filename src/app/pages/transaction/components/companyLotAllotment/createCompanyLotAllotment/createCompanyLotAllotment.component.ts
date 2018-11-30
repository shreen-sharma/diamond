import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';

import { AuthenticationService } from '../../../../../core/authentication/authentication.service';
import { Logger } from '../../../../../core/logger.service';
import { CompanyLotAllot, CompanyLotAllotmentsService } from '../companyLotAllotments.service';

const log = new Logger('CompanyLotAllot');

@Component({
  selector: 'create-companyLotAllotment',
  templateUrl: './createCompanyLotAllotment.html',
  styleUrls: ['./createCompanyLotAllotment.scss']
})
export class CreateCompanyLotAllotment implements OnInit  {
  companyLotAllotmentIdParam: string;
  pageTitle = 'Create Company Lot Allotment';

  error: string = null;
  isLoading = false;
  companyLotAllotmentForm: FormGroup;

  public selectedCompany: AbstractControl;
  public lotAllotmentDate: AbstractControl;
  public availableLot: AbstractControl;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private service: CompanyLotAllotmentsService,
    private authService: AuthenticationService) {
      this.createForm();
  }

  ngOnInit() {

    this.route.params.subscribe((params: Params) => {
      this.companyLotAllotmentIdParam = params['companyLotAllotmentId'];
      if (this.companyLotAllotmentIdParam) {
        this.pageTitle = 'Edit Company Lot Allotment';
        let companyLotAllotmentData: any = this.service.getCompanyLotAllotmentById(this.companyLotAllotmentIdParam);
        this.companyLotAllotmentForm.patchValue(companyLotAllotmentData);
      }
    });
  }

  submit() {
    this.isLoading = true;
    const formValue: any = this.companyLotAllotmentForm.value;

  if (this.companyLotAllotmentIdParam) {
    this.service.updateCompanyLotAllotment(this.companyLotAllotmentForm.value)
    .subscribe( companyLotAllotment => {
      // log.debug(`${credentials.selectedCompany} successfully logged in`);
      this.handleBack();
      this.finally();
    }, error => {
      log.debug(`Creation error: ${error}`);
      this.error = error;
      this.finally();
    });
  } else {
      this.service.createCompanyLotAllotment(this.companyLotAllotmentForm.value)
      .subscribe(companyLotAllotment => {
        // log.debug(`${credentials.selectedCompany} successfully logged in`);
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
      this.companyLotAllotmentForm.markAsPristine();
  }

  handleBack(cancelling: boolean= false) {
    // TODO: if cancelling then ask to confirn

    if (this.companyLotAllotmentIdParam) {
      this.router.navigate(['../../companyLotAllotment'], {relativeTo: this.route});
    } else {
      this.router.navigate(['../companyLotAllotment'], {relativeTo: this.route});
    }
  }

  private createForm() {
    this.companyLotAllotmentForm = this.fb.group({
      'id': [''],
      'selectedCompany': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'lotAllotmentDate': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'availableLot': ['', Validators.compose([Validators.required, Validators.minLength(4)])]
    });

    this.selectedCompany = this.companyLotAllotmentForm.controls['selectedCompany'];
    this.lotAllotmentDate = this.companyLotAllotmentForm.controls['lotAllotmentDate'];
    this.availableLot = this.companyLotAllotmentForm.controls['availableLot'];
  }
}
