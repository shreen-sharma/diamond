import { FormGroup, FormArray, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';

import { AuthenticationService } from '../../../../../core/authentication/authentication.service';
import { Logger } from '../../../../../core/logger.service';
import { JangadIssueBulkEntryUpdate, JangadIssueBulkEntryService } from '../jangadIssueBulkEntry.service';


const log = new Logger('JangadIssueBulkEntry');

@Component({
  selector: 'createJangadIssueBulkEntry',
  templateUrl: './createJangadIssueBulkEntry.html',
  styleUrls: ['./createJangadIssueBulkEntry.scss']
})
export class CreateJangadIssueBulkEntry implements OnInit  {
  jangadIssueBulkEntryIdParam: string;
  pageTitle = 'Create Jangad Issue (Bulk) Entry';

  error: string = null;
  isLoading = false;
  jangadIssueBulkEntryForm: FormGroup;

  public selectParty: AbstractControl;
  public process: AbstractControl;
  public lot: AbstractControl;
  public issueDate: AbstractControl;
  public jangadNo: AbstractControl;
  public jangadFormat: AbstractControl;
  public expectedYield: AbstractControl;
  public assorter: AbstractControl;
  public issuedItem: AbstractControl;
  public instruction: AbstractControl;
  public pieces: AbstractControl;
  public carats: AbstractControl;
  public totalPieces: AbstractControl;
  public totalCarats: AbstractControl;
  public itemParameters: AbstractControl;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private service: JangadIssueBulkEntryService,
    private authService: AuthenticationService) {
      this.createForm();
  }

  ngOnInit() {

    this.route.params.subscribe((params: Params) => {
      this.jangadIssueBulkEntryIdParam = params['jangadIssueBulkEntryId'];
      if (this.jangadIssueBulkEntryIdParam) {
        this.pageTitle = 'Edit Jangad Issue (Bulk) Entry';
        const JangadIssueBulkEntryData: any =
        this.service.getJangadIssueBulkEntryDataById(this.jangadIssueBulkEntryIdParam);
        this.jangadIssueBulkEntryForm.patchValue(JangadIssueBulkEntryData);
      }
    });
  }

  submit() {
    this.isLoading = true;
    const formValue: any = this.jangadIssueBulkEntryForm.value;

  if (this.jangadIssueBulkEntryIdParam) {
    this.service.createJangadIssueBulkEntry(this.jangadIssueBulkEntryForm.value)
    .subscribe( jangadIssueBulkEntry => {
      // log.debug(`${credentials.selectedCompany} successfully logged in`);
      this.handleBack();
      this.finally();
    }, error => {
      log.debug(`Creation error: ${error}`);
      this.error = error;
      this.finally();
    });
  } else {
      this.service.updateJangadIssueBulkEntry(this.jangadIssueBulkEntryForm.value)
      .subscribe(jangadIssueBulkEntry => {
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
      this.jangadIssueBulkEntryForm.markAsPristine();
  }

  handleBack(cancelling: boolean = false) {
    // TODO: if cancelling then ask to confirn

    if (this.jangadIssueBulkEntryIdParam) {
      this.router.navigate(['../../jangadIssueBulkEntry'], {relativeTo: this.route});
    } else {
      this.router.navigate(['../jangadIssueBulkEntry'], {relativeTo: this.route});
    }
  }

  initParameter() {
    // initialize parameter
    return this.fb.group({
        parameterName: ['', Validators.required],
        parameterValue: ['', Validators.required]
    });
}

  addParameter() {
      // add parameter to the list
      const control = <FormArray>this.jangadIssueBulkEntryForm.controls['parameters'];
      control.push(this.initParameter());
  }

  removeParameter(i: number) {
      // remove parameter from the list
      const control = <FormArray>this.jangadIssueBulkEntryForm.controls['parameters'];
      control.removeAt(i);
  }

  private createForm() {
    this.jangadIssueBulkEntryForm = this.fb.group({
      'id': [''],
      'selectParty': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'process': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'lot': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'jangadNo': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'jangadFormat': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'issueDate': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'expectedYield': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'assorter': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'instruction': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'issuedItem': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'pieces': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'carats': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'totalPieces': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'totalCarats': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'parameters': this.fb.array([this.initParameter()])
    });

    this.selectParty = this.jangadIssueBulkEntryForm.controls['selectParty'];
    this.process = this.jangadIssueBulkEntryForm.controls['process'];
    this.lot = this.jangadIssueBulkEntryForm.controls['lot'];
    this.jangadNo = this.jangadIssueBulkEntryForm.controls['jangadNo'];
    this.jangadFormat = this.jangadIssueBulkEntryForm.controls['jangadFormat'];
    this.issueDate = this.jangadIssueBulkEntryForm.controls['issueDate'];
    this.expectedYield = this.jangadIssueBulkEntryForm.controls['expectedYield'];
    this.assorter = this.jangadIssueBulkEntryForm.controls['assorter'];
    this.instruction = this.jangadIssueBulkEntryForm.controls['instruction'];
    this.issuedItem = this.jangadIssueBulkEntryForm.controls['issuedItem'];
    this.pieces = this.jangadIssueBulkEntryForm.controls['pieces'];
    this.carats = this.jangadIssueBulkEntryForm.controls['carats'];
    this.totalPieces = this.jangadIssueBulkEntryForm.controls['totalPieces'];
    this.totalCarats = this.jangadIssueBulkEntryForm.controls['totalCarats'];
    this.itemParameters = this.jangadIssueBulkEntryForm.controls['parameters'];
  }
}
