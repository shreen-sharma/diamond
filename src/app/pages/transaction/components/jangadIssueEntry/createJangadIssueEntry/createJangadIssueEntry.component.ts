import { FormGroup, FormArray, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { CommonModalComponent } from '../../../../../shared/common-modal/common-modal.component';

import { AuthenticationService } from '../../../../../core/authentication/authentication.service';
import { Logger } from '../../../../../core/logger.service';
import { JangadIssueEntryUpdate, JangadIssueEntryService } from '../jangadIssueEntry.service';
import { LotService } from 'app/pages/stockManagement/components/lots/lot.service';
import { CategoryService } from '.../../app/pages/masters/components/categories/category.service';
import { ItemDetailsService } from '.../../app/pages/masters/components/itemDetails/itemDetails.service';
import { ParaValueService } from '.../../app/pages/masters/components/parameterValue';
import { ParaListService } from '.../../app/pages/masters/components/parameterList';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LotItemCreationService } from 'app/pages/stockManagement/components/lotItemCreation/index';
import { ProDetailService } from '.../../app/pages/masters/components/processDetails/proDetails.service';
import { PartyDetailsService } from '.../../app/pages/company/components/partyDetails/partyDetails.service';

const log = new Logger('JangadIssueEntry');
 class JangadEntry {
  issuedItem: string;
  pieces: number;
  carats: number;
  totalCarats: number;
  totalPieces: number;
}

@Component({
  selector: 'create-jangadIssueEntry',
  templateUrl: './createJangadIssueEntry.html',
  styleUrls: ['./createJangadIssueEntry.scss']
})
export class CreateJangadIssueEntry implements OnInit  {
  jangadIssueEntryIdParam: string;
  pageTitle = 'Create Jangad Issue Entry';

  error: string = null;
  isLoading = false;
  jangadIssueEntryForm: FormGroup;
  source: LocalDataSource = new LocalDataSource();
  successMessage: string;
  jangadMixIdList: any;
  //yasar added
  expectedYieldList: any;
  todayDate: string;
  lotList: any [] = [];
  processList: any [] = [];
  itemLotList: any[] = [];
  settings: any;
  JangadIssuedList: JangadEntry [] = [];
  partyList: any[] = [];

  public partyName: AbstractControl;
  public process: AbstractControl;
  public lotName: AbstractControl;
  public issueDate: AbstractControl;
  public jangadNumber: AbstractControl;
  public jangadFormat: AbstractControl;
  public expectedYield: AbstractControl;
  public jangadMixId: AbstractControl;
  public size: AbstractControl;
  public assorter: AbstractControl;
  public issuedItem: AbstractControl;
  public instruction: AbstractControl;
  public pieces: AbstractControl;
  public carats: AbstractControl;
  public totalPieces: AbstractControl;
  public totalCarats: AbstractControl;
  // public itemParameters: AbstractControl;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private lotService: LotService,
    private proService: ProDetailService,
    private partyService: PartyDetailsService,
    private itemService: ItemDetailsService,
    private lotItemService: LotItemCreationService,
    private service: JangadIssueEntryService,
    private authService: AuthenticationService) {
       this.todayDate = this.today();
       this.createForm();
       this.settings = this.prepareSetting();
      this.issueDate.setValue(this.todayDate);

      this.lotService.getData().subscribe( (lotList) => {
      this.lotList = lotList;
     });
     this.proService.getData().subscribe( (processList) => {
      this.processList = processList;
     });
     this.partyService.getData().subscribe( (partyList) => {
      this.partyList = partyList;
     });
   }

  ngOnInit() {
    this.settings = this.prepareSetting();
    this.route.params.subscribe((params: Params) => {
      this.jangadIssueEntryIdParam = params['jangadIssueEntryId'];
      if (this.jangadIssueEntryIdParam) {
        this.pageTitle = 'Edit Jangad Issue Entry';
        let JangadIssueEntryData: any = this.service.getJangadIssueEntryDataById(this.jangadIssueEntryIdParam);
        this.jangadIssueEntryForm.patchValue(JangadIssueEntryData);
      }
    });
  }

  today (): string {
    const today = new Date();
    const dd = today.getDate();
    const mm = today.getMonth() + 1; //January is 0!

    const yyyy = today.getFullYear();
    return yyyy + '-' + (mm < 10 ? '0' + mm : mm) + '-' + (dd < 10 ? '0' + dd : dd);
  }

prepareSetting() {
    return {
      hideSubHeader: 'true',
      actions: {
        position: 'right',
        add: false,
        edit: false
      },

      edit: {
        editButtonContent: '<i class="ion-edit"></i>',
        saveButtonContent: '<i class="ion-checkmark"></i>',
        cancelButtonContent: '<i class="ion-close"></i>',
        confirmSave: true,
      },
      delete: {
        deleteButtonContent: '<i class="ion-trash-a"></i>',
        confirmDelete: true
      },
      pager: {
          display: false
      },
      columns: {
        issuedItem: {
          editable: false,
          title: 'Issued Item',
          type: 'text',
        },
        pieces: {
          title: 'Pieces',
          type: 'text',
        },
        carats: {
          editable: false,
          title: 'Carats',
        },
        totalCarats: {
          title: 'Total Carats',
        },
        totalPieces: {
          title: 'Total Pieces',
        }
      }
    };
  }

  submit() {
     if (this.jangadIssueEntryForm.valid) {

      if (this.JangadIssuedList.length > 0) {
    this.isLoading = true;
    const formValue: any = this.jangadIssueEntryForm.value;

  if (this.jangadIssueEntryIdParam) {
    this.service.createJangadIssueEntry(this.jangadIssueEntryForm.value)
    .subscribe( jangadIssueEntry => {
      // log.debug(`${credentials.selectedCompany} successfully logged in`);
      this.handleBack();
      this.finally();
    }, error => {
      log.debug(`Creation error: ${error}`);
      this.error = error;
      this.finally();
    });
  } else {
      this.service.updateJangadIssueEntry(this.jangadIssueEntryForm.value)
      .subscribe(jangadIssueEntry => {
        // log.debug(`${credentials.selectedCompany} successfully logged in`);
        this.handleBack();
        this.finally();
      }, error => {
        log.debug(`Creation error: ${error}`);
        this.error = error;
        this.finally();
      });
    }
  } else {
        const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
        activeModal.componentInstance.showHide = false;
        activeModal.componentInstance.modalHeader = 'Alert';
        activeModal.componentInstance.modalContent = 'Please Select Some Issue Item to Allot!!!';

      }
  }
}

  finally() {
      this.isLoading = false;
      this.jangadIssueEntryForm.markAsPristine();
  }

  handleBack(cancelling: boolean= false) {
    // TODO: if cancelling then ask to confirn

    if (this.jangadIssueEntryIdParam) {
      this.router.navigate(['../../jangadIssueEntry'], {relativeTo: this.route});
    } else {
      this.router.navigate(['../jangadIssueEntry'], {relativeTo: this.route});
    }
  }

  private createForm() {
    this.jangadIssueEntryForm = this.fb.group({
      'id': [''],
      'partyName': ['', Validators.required],
      'process': ['', Validators.required],
      'lotName': ['', Validators.required],
      'jangadNumber': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'jangadFormat': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'issueDate': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'expectedYield': ['', Validators.required],
      'jangadMixId': ['', Validators.required],
      'size': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'assorter': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'instruction': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'issuedItem': ['', Validators.required],
      'pieces': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'carats': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'totalPieces': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'totalCarats': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
       'JangadIssuedItemList': [this.JangadIssuedList],
  // 'parameters': this.fb.array([this.initParameter()])
    });

    this.partyName = this.jangadIssueEntryForm.controls['partyName'];
    this.process = this.jangadIssueEntryForm.controls['process'];
    this.lotName = this.jangadIssueEntryForm.controls['lotName'];
    this.jangadNumber = this.jangadIssueEntryForm.controls['jangadNumber'];
    this.jangadFormat = this.jangadIssueEntryForm.controls['jangadFormat'];
    this.issueDate = this.jangadIssueEntryForm.controls['issueDate'];
    this.expectedYield = this.jangadIssueEntryForm.controls['expectedYield'];
    this.jangadMixId = this.jangadIssueEntryForm.controls['jangadMixId'];
    this.size = this.jangadIssueEntryForm.controls['size'];
    this.assorter = this.jangadIssueEntryForm.controls['assorter'];
    this.instruction = this.jangadIssueEntryForm.controls['instruction'];
    this.issuedItem = this.jangadIssueEntryForm.controls['issuedItem'];
    this.pieces = this.jangadIssueEntryForm.controls['pieces'];
    this.carats = this.jangadIssueEntryForm.controls['carats'];
    this.totalPieces = this.jangadIssueEntryForm.controls['totalPieces'];
    this.totalCarats = this.jangadIssueEntryForm.controls['totalCarats'];
    // this.itemParameters = this.jangadIssueEntryForm.controls['parameters'];
  }
}
