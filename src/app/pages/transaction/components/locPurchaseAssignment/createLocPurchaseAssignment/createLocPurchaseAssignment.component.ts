import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';

import { AuthenticationService } from '../../../../../core/authentication/authentication.service';
import { Logger } from '../../../../../core/logger.service';
import { LocPurchaseAssign, LocPurchaseAssignmentService } from '../locPurchaseAssignment.service';

const log = new Logger('LocPurchaseAssign');

@Component({
  selector: 'create-locPurchaseAssignment',
  templateUrl: './createLocPurchaseAssignment.html',
  styleUrls: ['./createLocPurchaseAssignment.scss']
})
export class CreateLocPurchaseAssignment implements OnInit  {
  locPurchaseAssignmentIdParam: string;
  pageTitle = 'Create Import / Local Purchase Assignment To Lot';

  error: string = null;
  isLoading = false;
  locPurchaseAssignmentForm: FormGroup;

  public selectCategory: AbstractControl;
  public selectSupplier: AbstractControl;
  public assignFrom: AbstractControl;
  public assignmentDate: AbstractControl;
  public selectLot: AbstractControl;
  public selectItem: AbstractControl;
  public totalCarats: AbstractControl;
  public avgRate: AbstractControl;
  public availableImportDetails: AbstractControl;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private service: LocPurchaseAssignmentService,
    private authService: AuthenticationService) {
      this.createForm();
  }

  ngOnInit() {

    this.route.params.subscribe((params: Params) => {
      this.locPurchaseAssignmentIdParam = params['locPurchaseAssignmentId'];
      if (this.locPurchaseAssignmentIdParam) {
        this.pageTitle = 'Edit Import / Local Purchase Assignment To Lot';
        let locPurchaseAssignmentData: any = this.service.getLocPurchaseAssignmentById(this.locPurchaseAssignmentIdParam);
        this.locPurchaseAssignmentForm.patchValue(locPurchaseAssignmentData);
      }
    });
  }

  submit() {
    this.isLoading = true;
    const formValue: any = this.locPurchaseAssignmentForm.value;

  if (this.locPurchaseAssignmentIdParam) {
    this.service.updateLocPurchaseAssignment(this.locPurchaseAssignmentForm.value)
    .subscribe( locPurchaseAssignment => {
      // log.debug(`${credentials.selectCategory} successfully logged in`);
      this.handleBack();
      this.finally();
    }, error => {
      log.debug(`Creation error: ${error}`);
      this.error = error;
      this.finally();
    });
  } else {
      this.service.createLocPurchaseAssignment(this.locPurchaseAssignmentForm.value)
      .subscribe(locPurchaseAssignment => {
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
      this.locPurchaseAssignmentForm.markAsPristine();
  }

  handleBack(cancelling: boolean= false) {
    // TODO: if cancelling then ask to confirn

    if (this.locPurchaseAssignmentIdParam) {
      this.router.navigate(['../../locPurchaseAssignment'], {relativeTo: this.route});
    } else {
      this.router.navigate(['../locPurchaseAssignment'], {relativeTo: this.route});
    }
  }

  private createForm() {
    this.locPurchaseAssignmentForm = this.fb.group({
      'id': [''],
      'selectCategory': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'selectSupplier': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'assignFrom': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'assignmentDate': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'selectLot': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'selectItem': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'totalCarats': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'avgRate': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'availableImportDetails': ['', Validators.compose([Validators.required, Validators.minLength(4)])]
    });

    this.selectCategory = this.locPurchaseAssignmentForm.controls['selectCategory'];
    this.selectSupplier = this.locPurchaseAssignmentForm.controls['selectSupplier'];
    this.assignFrom = this.locPurchaseAssignmentForm.controls['assignFrom'];
    this.assignmentDate = this.locPurchaseAssignmentForm.controls['assignmentDate'];
    this.selectLot = this.locPurchaseAssignmentForm.controls['selectLot'];
    this.selectItem = this.locPurchaseAssignmentForm.controls['selectItem'];
    this.totalCarats = this.locPurchaseAssignmentForm.controls['totalCarats'];
    this.avgRate = this.locPurchaseAssignmentForm.controls['avgRate'];
    this.availableImportDetails = this.locPurchaseAssignmentForm.controls['availableImportDetails'];
  }
}
