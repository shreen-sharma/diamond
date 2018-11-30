import { Observable } from 'rxjs/Observable';
import { FormGroup, AbstractControl, FormArray, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { ProTypeService } from '../../processType/proType.service';
import { AuthenticationService } from '../../../../../core/authentication/authentication.service';
import { CategoryService } from '.../../app/pages/masters/components/categories/category.service';
import { ItemDetailsService } from '.../../app/pages/masters/components/itemDetails/itemDetails.service';
import { Logger } from '../../../../../core/logger.service';
import { ProcessDetails, ProDetailService } from '../proDetails.service';
import { CommonModalComponent } from '../../../../../shared/common-modal/common-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

const log = new Logger('ProcessDetails');
 class issuseDetails {
  // processType: string;
  categoryMasterByIssCatId: number;
  itemMasterByIssItemId: number;
  categoryMasterByRetCatId: number;
  itemMasterByRetItemId: number;
  issCId: string;
  retCId: string;
  issItem: string;
  retItem: string;

}
@Component({
  selector: 'create-processDetails',
  templateUrl: './createProcessDetails.html',
  styleUrls: ['./createProcessDetails.scss']
})
export class CreateProcessDetails implements OnInit  {
  proDetailsIdParam: string;
  pageTitle = 'Create Process Definition';

  proType: Observable<any[]>;
  error: string = null;
  isLoading = false;
  processDetailsForm: FormGroup;
  source: LocalDataSource = new LocalDataSource();
  successMessage: string;
  settings: any;

  issuseDetailsList: issuseDetails [] = [];
  selectedType: any;
  typeList: any [] = [];
  catList: any [] = [];
  itemList: any[] = [];
  itemIList: any [] = [];
  itemRList: any [] = [];
  proList: any [] = [];
  accessList: any[] = [];
  upDateAccess:boolean=false;

  public processType: AbstractControl;
  public name: AbstractControl;
  public code: AbstractControl;
  public chargeRequired: AbstractControl;
  public issueCat: AbstractControl;
  public issueItem: AbstractControl;
  public returnCat: AbstractControl;
  public returnItem: AbstractControl;
  isView: any;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private catService: CategoryService,
    private itemService: ItemDetailsService,
    private proService: ProTypeService,
    private service: ProDetailService,
    private authService: AuthenticationService) {
      this.accessList = this.authService.getUserAccessOfMenu('proDetail');
      this.createForm();
      this.settings = this.prepareSetting();

    this.catService.getData().subscribe( (catList) => {
      this.catList = catList;
     });

     this.service.getData().subscribe( (proList) => {
      this.proList = proList;
     });

    this.proType = this.proService.getData();
  }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.proDetailsIdParam = params['processId'];
      this.isView = params['isView'];
      if (this.proDetailsIdParam) {
        this.pageTitle = 'Edit Process Definition';
        this.settings = this.prepareSetting();
        // let proDetailData: any = this.service.getProDetailsById(this.proDetailsIdParam);
        // this.processDetailsForm.patchValue(proDetailData);

        this.service.getProcessDetailsById(this.proDetailsIdParam).subscribe(res => {
        if(this.isView == 'true'){
          this.processDetailsForm.patchValue(res);
          if(res.chargeRequired == 'N') {
            this.chargeRequired.setValue(false);
          } else {
            this.chargeRequired.setValue(true);
          }
          this.selectedType = res.processType;
          debugger
          this.itemService.getData().subscribe( (itemList) => {
            this.itemList = itemList;
            this.catService.getData().subscribe( catList => {
              this.catList = catList;
            res.processDetailDTO.forEach(element => {
              const itemIssueDetails = new issuseDetails();
              itemIssueDetails.categoryMasterByIssCatId = element.categoryMasterByIssCatId;
              itemIssueDetails.issCId = this.getIssueCat(element.categoryMasterByIssCatId);
              itemIssueDetails.categoryMasterByRetCatId = element.categoryMasterByRetCatId;
              itemIssueDetails.retCId = this.getReturnCat(element.categoryMasterByRetCatId);
              itemIssueDetails.itemMasterByIssItemId = element.itemMasterByIssItemId;
              itemIssueDetails.issItem = this.getItem(element.itemMasterByIssItemId);
              itemIssueDetails.itemMasterByRetItemId = element.itemMasterByRetItemId;
              itemIssueDetails.retItem = this.getItem(element.itemMasterByRetItemId);
              this.issuseDetailsList.push(itemIssueDetails);
            });
            this.source.load(this.issuseDetailsList);
          })
          });
          this.processDetailsForm.disable();
          this.processDetailsForm.markAsUntouched();
          this.upDateAccess = true;
        } else {
          this.processDetailsForm.patchValue(res);
          if(res.chargeRequired == 'N') {
            this.chargeRequired.setValue(false);
          } else {
            this.chargeRequired.setValue(true);
          }
          this.selectedType = res.processType;
          this.markAllTouched(this.processDetailsForm);
          debugger
          this.itemService.getData().subscribe( (itemList) => {
            this.itemList = itemList;
            this.catService.getData().subscribe( catList => {
              this.catList = catList;
            res.processDetailDTO.forEach(element => {
              const itemIssueDetails = new issuseDetails();
              itemIssueDetails.categoryMasterByIssCatId = element.categoryMasterByIssCatId;
              itemIssueDetails.issCId = this.getIssueCat(element.categoryMasterByIssCatId);
              itemIssueDetails.categoryMasterByRetCatId = element.categoryMasterByRetCatId;
              itemIssueDetails.retCId = this.getReturnCat(element.categoryMasterByRetCatId);
              itemIssueDetails.itemMasterByIssItemId = element.itemMasterByIssItemId;
              itemIssueDetails.issItem = this.getItem(element.itemMasterByIssItemId);
              itemIssueDetails.itemMasterByRetItemId = element.itemMasterByRetItemId;
              itemIssueDetails.retItem = this.getItem(element.itemMasterByRetItemId);
              this.issuseDetailsList.push(itemIssueDetails);
            });
            this.source.load(this.issuseDetailsList);
          })
          });
        }
        });
      }
    });
  }

  markAllTouched(control: AbstractControl) {
    if (control.hasOwnProperty('controls')) {
        const ctrl = <any>control;
        for (const inner in ctrl.controls) {
          if (ctrl.controls) {
            this.markAllTouched(ctrl.controls[inner]);
          }
        }
    } else {
        control.markAsTouched();
      }
  }

  getItem(value: any): string {
    let itemName = '';
      this.itemList.forEach( ele => {
        if (ele.itemId == value) {
          itemName = ele.itemName;
        }
    });
    return itemName;
  }

   prepareSetting() {
    return {
      hideSubHeader: 'true',
      actions: {
        position: 'right',
        add: false,
        edit: false
      },
      delete: {
        deleteButtonContent: '<i class="ion-trash-a"></i>',
        confirmDelete: true
      },
      pager: {
          display: false
      },
      columns: {
        // processType: {
        //   editable: false,
        //   title: 'Process Type',
        //   type: 'text',
        // },
        issCId: {
          title: 'Issue Category',
          type: 'text',
        },
         issItem: {
          title: 'Issue Item',
          type: 'text',
        },
        retCId: {
          title: 'Return Category',
          type: 'text',
        },
         retItem: {
          title: 'Return Item',
          type: 'text',
        },
      }
    };
  }


  onChangeType(typeId: any): void {

     if (this.issuseDetailsList.length > 0) {
       debugger;
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = true;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Your all previous Issused Item info will be get removed!';
      activeModal.result.then ((res) => {
        // console.log(res == 'Y');
        if (res == 'Y') {
          this.selectedType = typeId;
          this.processDetailsForm.controls['processType'].setValue(this.selectedType);
          this.forChangeType(typeId);
        } else if (res == 'N') {
          this.processDetailsForm.controls['processType'].setValue(this.selectedType);
        }
      });
    } else {
      this.selectedType = this.processType.value;
      this.forChangeType(typeId);
    }
  this.processDetailsForm.controls['processType'].setValue(this.selectedType);
  }

  forChangeType(typeId: any) {

        this.processDetailsForm.reset();
        this.processDetailsForm.controls['processType'].setValue(typeId)     ;
        this.issuseDetailsList = [];
        this.source.load(this.issuseDetailsList);
  }

    onChangeICat(catId: any): void {
        this.itemIList = [];
        this.issueItem.reset();
        this.itemService.getAllItemsByCategoryId(catId).subscribe( (itemIList) => {
        this.itemIList = itemIList;
        });
    }
    onChangeRCat(catId: any): void {
        this.itemRList = [];
        this.returnItem.reset();
        this.itemService.getAllItemsByCategoryId(catId).subscribe( (itemRList) => {
        this.itemRList = itemRList;
        });
    }

 getIssueCat(catId: any): string {
    let catName = '';
    this.catList.forEach(cat => {
    if ( cat.catId == catId) {
    catName = cat.catName;
    }
    });
    return catName;
  }
 getReturnCat(catId: any): string {
    let catName = '';
    this.catList.forEach(cat => {
    if ( cat.catId == catId) {
    catName = cat.catName;
    }
    });
    return catName;
  }

  getIssueItem(isItem: any): string {
    let itemName = '';
    this.itemIList.forEach(itIt => {
    if ( itIt.itemId == isItem) {
    itemName = itIt.itemName;
    }
    });
    return itemName;
  }

  getReturnItem(isItem: any): string {
    let itemName = '';
    this.itemRList.forEach(itIt => {
    if ( itIt.itemId == isItem) {
    itemName = itIt.itemName;
    }
    });
    return itemName;
  }

    onAdd() {
        debugger;
      if (this.issuseDetailsList.length > 0) {

        const itemIndex = this.issuseDetailsList.findIndex(item => {
          if (this.issueItem.value == item.itemMasterByIssItemId) {
            return true;
          }
        });
        const itemIndex1 = this.issuseDetailsList.findIndex(item => {
          if (this.issueCat.value != item.categoryMasterByIssCatId) {
            return true;
          }
        });

        if (itemIndex >= 0) {
            const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
            activeModal.componentInstance.showHide = false;
            activeModal.componentInstance.modalHeader = 'Alert';
            activeModal.componentInstance.modalContent = 'Duplicate Item cannot be Added!';
        } else if (itemIndex1 >= 0) {
            const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
            activeModal.componentInstance.showHide = false;
            activeModal.componentInstance.modalHeader = 'Alert';
            activeModal.componentInstance.modalContent = ' Item of Different Category cannot be Issued!';
        } else {
          this.validUpdate();
        }
      } else {
        this.validUpdate();
      }
    }

   validUpdate() {
      const itemIssueDetails = new issuseDetails();
    itemIssueDetails.categoryMasterByIssCatId = this.issueCat.value;
    itemIssueDetails.issCId = this.getIssueCat(itemIssueDetails.categoryMasterByIssCatId);

    itemIssueDetails.categoryMasterByRetCatId = this.returnCat.value;
    itemIssueDetails.retCId = this.getReturnCat(itemIssueDetails.categoryMasterByRetCatId);

     itemIssueDetails.itemMasterByIssItemId = this.issueItem.value;
    itemIssueDetails.issItem = this.getIssueItem(itemIssueDetails.itemMasterByIssItemId);

    itemIssueDetails.itemMasterByRetItemId = this.returnItem.value;
    itemIssueDetails.retItem = this.getReturnItem(itemIssueDetails.itemMasterByRetItemId);

      if (this.issueCat.value == null || this.issueItem.value == null
         || this.issueCat.value == '' || this.issueItem.value == '') {
          const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
          activeModal.componentInstance.showHide = false;
          activeModal.componentInstance.modalHeader = 'Alert';
          activeModal.componentInstance.modalContent = 'Add Issue Fields  !';
      } else if (this.returnCat.value == null || this.returnItem.value == null
          || this.returnCat.value == '' || this.returnItem.value == '')  {
              const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
            activeModal.componentInstance.showHide = false;
            activeModal.componentInstance.modalHeader = 'Alert';
            activeModal.componentInstance.modalContent = 'Add Return Fields';
          } else {
                this.issuseDetailsList.push(itemIssueDetails);
        this.source.load(this.issuseDetailsList);
        this.processDetailsForm.controls['issueCat'].reset();
        this.processDetailsForm.controls['issueItem'].reset();
        this.processDetailsForm.controls['returnCat'].reset();
        this.processDetailsForm.controls['returnItem'].reset();
        this.successMessage = 'Item Added Succesfully!';
        setTimeout(() => this.successMessage = null, 3000);
          }
   }

  onDeleteConfirm(event: any): void {       // check whether delete is working
    if (window.confirm('Are you sure you want to delete?')) {
      const itemIndex = this.issuseDetailsList.findIndex(item => {
            if (event.data.itemMasterByIssItemId == item.itemMasterByIssItemId) {
              return true;
            }
          });
          this.issuseDetailsList.splice(itemIndex, 1);
          this.source.load(this.issuseDetailsList);
          this.successMessage = 'Issued Item Deleted Succesfully!';
          setTimeout(() => this.successMessage = null, 3000);
          event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }

 submit() {

  if (this.processDetailsForm.valid) {
      if (this.issuseDetailsList.length > 0) {

    this.isLoading = true;
    this.processDetailsForm.controls['processDetailDTO'].setValue(this.issuseDetailsList);
    if( this.chargeRequired.untouched || (this.chargeRequired.touched && this.chargeRequired.value == false)) {
      this.processDetailsForm.controls['chargeRequired'].setValue('N');
    } else if((this.chargeRequired.touched && this.chargeRequired.value == true)) {
      this.processDetailsForm.controls['chargeRequired'].setValue('Y');
    }
    const formValue: any = this.processDetailsForm.value;

  if (this.proDetailsIdParam) {
    this.service.updateProcessDetails(this.processDetailsForm.value)
    .subscribe( processDetails => {
      // log.debug(`${credentials.processname} successfully logged in`);
      this.handleBack();
      this.finally();
    }, error => {
      log.debug(`Creation error: ${error}`);
      this.error = error;
      this.finally();
    });
  } else {
    const itemIndex = this.proList.findIndex(item => {
          if (this.code.value.trim().toUpperCase() == item.code.trim().toUpperCase()) {
            return true;
          }
        });
        const itemInd = this.proList.findIndex(item => {
          if (this.name.value.trim().toUpperCase() == item.name.trim().toUpperCase()) {
            return true;
          }
        });
        if (itemIndex > -1) {
          const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
          activeModal.componentInstance.showHide = false;
          activeModal.componentInstance.modalHeader = 'Alert';
          activeModal.componentInstance.modalContent = 'Process Code already Exist!';
        } else if (itemInd > -1) {
          const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
          activeModal.componentInstance.showHide = false;
          activeModal.componentInstance.modalHeader = 'Alert';
          activeModal.componentInstance.modalContent = 'Process Name already Exist!';
        } else {
      this.service.createProcessDetails(this.processDetailsForm.value)
      .subscribe(processDetails => {
        // log.debug(`${credentials.procesname} successfully logged in`);
        console.log(processDetails);
        this.handleBack();
        this.finally();
      }, error => {
        log.debug(`Creation error: ${error}`);
        this.error = error;
        this.finally();
      });
  }
    }
   } else {
        const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
        activeModal.componentInstance.showHide = false;
        activeModal.componentInstance.modalHeader = 'Alert';
        activeModal.componentInstance.modalContent = 'Please Select Some Issue Item to Add!!!';
     }
   }
}

  finally() {
      this.isLoading = false;
      this.processDetailsForm.markAsPristine();
  }

  handleBack(cancelling: boolean= false) {
    // TODO: if cancelling then ask to confirn

    if (this.proDetailsIdParam) {
      this.router.navigate(['../../../proDetail'], {relativeTo: this.route});
    } else {
      this.router.navigate(['../proDetail'], {relativeTo: this.route});
    }
  }

  private createForm() {
    this.processDetailsForm = this.fb.group({
      'processId': [''],
      'processDetailDTO': [this.issuseDetailsList],
      'issueCat': [''],
      'issueItem': [''],
      'returnCat': [''],
      'returnItem': [''],

      'name': ['', Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(100)])],
      'code': ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(5)])],

      'processType': ['', Validators.compose([Validators.required])],
      'chargeRequired': [''],

    });

    this.processType = this.processDetailsForm.controls['processType'];
    this.chargeRequired = this.processDetailsForm.controls['chargeRequired'];
    this.name = this.processDetailsForm.controls['name'];
    this.code = this.processDetailsForm.controls['code'];

    this.issueCat = this.processDetailsForm.controls['issueCat'];
    this.issueItem = this.processDetailsForm.controls['issueItem'];
    this.returnCat = this.processDetailsForm.controls['returnCat'];
    this.returnItem = this.processDetailsForm.controls['returnItem'];
  }
}
