import { Observable } from 'rxjs/Observable';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { CategoryService } from '../../categories/category.service';
import { AuthenticationService } from '../../../../../core/authentication/authentication.service';
import { Logger } from '../../../../../core/logger.service';
import { ItemDetail, ItemDetailsService } from '../itemDetails.service';
import { ParaValueService } from '../../parameterValue';
import { ParaListService } from '../../parameterList';
import { CommonModalComponent } from '../../../../../shared/common-modal/common-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

const log = new Logger('ItemDetail');

@Component({
  selector: 'create-itemDetail',
  templateUrl: './createItemDetail.html',
  styleUrls: ['./createItemDetail.scss']
})
export class CreateItemDetail implements OnInit {
  itemDetailsIdParam: string;
  pageTitle = 'Item Creation';
  catList: Observable<any[]>;
  errorMsg: string = null;
  isLoading = false;
  itemDetailForm: FormGroup;
  paraNameList: any[];
  paraValueList: any[];
  selectedIds: string[];
  itemList: any[] = [];
  accessList: any[] = [];
  upDateAccess:boolean;
  isView: any;

  public itemCategory: AbstractControl;
  public itemName: AbstractControl;
  // public itemCode: AbstractControl;
  public itemDesc: AbstractControl;
  public costPrice: AbstractControl;
  public salePrice: AbstractControl;
  public taxable: AbstractControl;
  public itemParameters: AbstractControl;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private service: ItemDetailsService,
    private modalService: NgbModal,
    private catService: CategoryService,
    private paraNameService: ParaListService,
    private paramValService: ParaValueService,
    private authService: AuthenticationService) {
      this.accessList = this.authService.getUserAccessOfMenu('itemDetail');
      
      this.createForm();
      this.paraNameService.getData().subscribe(res => {
        this.paraNameList = res;
      })
      this.paramValService.getData().subscribe(res => {
        this.paraValueList = res;
      });

      this.service.getData().subscribe( (itemList) => {
        this.itemList = itemList;
      });
  }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.itemDetailsIdParam = params['itemId'];
      this.isView = params['isView'];
      if (this.itemDetailsIdParam) {
        this.pageTitle = 'Edit Item Details';
        this.service.getItemDetailsById(this.itemDetailsIdParam).subscribe(res => {
          const totalParameters = res.parameters.length;
          // start with index 1 because, default is 1 item parameter.
         if(this.isView == 'true'){
          for ( let i = 1; i < totalParameters; i++ ) {
            this.addParameter();
         }
          this.itemDetailForm.patchValue(res);
          this.service.checkItemIdExistInLotItem(this.itemDetailsIdParam).subscribe( respo => {
            if(respo) {
              this.costPrice.disable();
              this.salePrice.disable();
              this.costPrice.markAsUntouched();
              this.salePrice.markAsUntouched();
            }
          });
          this.itemDetailForm.disable();
          this.itemDetailForm.markAsUntouched();
          this.upDateAccess = true;
         } else {
          for ( let i = 1; i < totalParameters; i++ ) {
            this.addParameter();
         }
         this.markAllTouched(this.itemDetailForm);
          this.itemDetailForm.patchValue(res);
          this.service.checkItemIdExistInLotItem(this.itemDetailsIdParam).subscribe( respo => {
            if(respo) {
              this.costPrice.disable();
              this.salePrice.disable();
              this.costPrice.markAsUntouched();
              this.salePrice.markAsUntouched();
            }
          });
         }
        })
      }
    });
    this.catList = this.catService.getData();
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

  submit() {
    if (this.itemDetailForm.valid) {
      this.isLoading = true;
      const formValue: any = this.itemDetailForm.value;
      let flag = 0;
      const itemIndex = this.itemList.findIndex(item => {
        if(this.itemDetailsIdParam) {
          // if (this.itemDetailsIdParam != item.itemId && this.itemCode.value.trim().toUpperCase() == item.itemCode.trim().toUpperCase()) {
          //   flag = 1;
          //   return true;
         if (this.itemDetailsIdParam != item.itemId && this.itemName.value.trim().toUpperCase() == item.itemName.trim().toUpperCase()) {
            flag = 2;
            return true;
          }
        } else {
          // if (this.itemCode.value.trim().toUpperCase() == item.itemCode.trim().toUpperCase()) {
          //   flag = 1;
          //   return true;
           if (this.itemName.value.trim().toUpperCase() == item.itemName.trim().toUpperCase()) {
            flag = 2;
            return true;
          }
        }
      });

      if(itemIndex > -1 && flag == 1) {
        const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
        activeModal.componentInstance.showHide = false;
        activeModal.componentInstance.modalHeader = 'Alert';
        activeModal.componentInstance.modalContent = 'Item Code already Exist!';
      } else if(itemIndex > -1 && flag == 2) {
        const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
        activeModal.componentInstance.showHide = false;
        activeModal.componentInstance.modalHeader = 'Alert';
        activeModal.componentInstance.modalContent = 'Item Name already Exist!';
      } else if(this.costPrice.value < 0 || this.salePrice.value < 0) {
        const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
        activeModal.componentInstance.showHide = false;
        activeModal.componentInstance.modalHeader = 'Alert';
        activeModal.componentInstance.modalContent = 'Cost/Sale Price cannot be less than 0!';
      } else {
        if (this.itemDetailsIdParam) {
          if(this.costPrice.disabled || this.salePrice.disabled) {
            this.costPrice.enable();
            this.salePrice.enable();
            this.costPrice.markAsTouched();
            this.salePrice.markAsTouched();
          }
          this.service.updateItemDetails(this.itemDetailForm.value)
          .subscribe( itemDetail => {
          // log.debug(`${credentials.itemname} successfully logged in`);
          this.handleBack();
          this.finally();
          }, error => {
            log.debug(`Creation error: ${error}`);
            this.errorMsg = error._body;
            this.finally();
          });
        } else {
          this.service.createItemDetails(this.itemDetailForm.value)
          .subscribe(itemDetail => {
            // log.debug(`${credentials.itemname} successfully logged in`);
            this.handleBack();
            this.finally();
          }, error => {
            log.debug(`Creation error: ${error}`);
            debugger;
            if(error._body){
              this.errorMsg = error._body;
            }else {
              this.errorMsg = "Internal Server Error."
            }       
            this.finally();
          });
        }
      }
    }
  }

  finally() {
      this.isLoading = false;
      this.itemDetailForm.markAsPristine();
  }

  handleBack(cancelling: boolean = false) {
    // TODO: if cancelling then ask to confirn

    if (this.itemDetailsIdParam) {
      this.router.navigate(['../../../itemDetail'], {relativeTo: this.route});
    } else {
      this.router.navigate(['../itemDetail'], {relativeTo: this.route});
    }
  }

  initParameter() {
      // initialize parameter
      return this.fb.group({
         paramId: ['', Validators.required],
         paramValId: ['', Validators.required]
      });
  }

  addParameter() {
      // add parameter to the list
      const control = <FormArray>this.itemDetailForm.controls['parameters'];
      control.push(this.initParameter());
     }

  removeParameter(i: number) {
      // remove parameter from the list
      const control = <FormArray>this.itemDetailForm.controls['parameters'];
      control.removeAt(i);
  }

    getParamNameById(paramId: any) {
      const len = this.paraNameList.length;
      for (let i = 0; i < len; i++) {
        if (this.paraNameList[i].paramId == paramId) {
          return this.paraNameList[i].paramName;
        }
      }
    }

    getParamValById(paramValId: any) {
      const len = this.paraValueList.length;
      for (let i = 0; i < len; i++) {
        if (this.paraValueList[i].paramValId == paramValId) {
          return this.paraValueList[i].paramValue;
        }
      }
    }

  private createForm() {
    this.itemDetailForm = this.fb.group({
      'itemId': [''],
      'itemName': ['', Validators.compose([Validators.required, Validators.minLength(1)])],
      'itemCategory': ['', Validators.required],
      // 'itemCode': ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(10)])],
      'itemDesc': ['', Validators.compose([Validators.maxLength(250)])],
      'costPrice': ['', Validators.compose([Validators.required, Validators.minLength(0)])],
      'salePrice': ['', Validators.compose([Validators.required, Validators.minLength(0)])],
      'taxable': [''],
      'parameters': this.fb.array([this.initParameter()])
    });

    this.itemName = this.itemDetailForm.controls['itemName'];
    this.itemCategory = this.itemDetailForm.controls['itemCategory'];
    // this.itemCode = this.itemDetailForm.controls['itemCode'];
    this.itemDesc = this.itemDetailForm.controls['itemDesc'];
    this.costPrice = this.itemDetailForm.controls['costPrice'];
    this.salePrice = this.itemDetailForm.controls['salePrice'];
    this.taxable = this.itemDetailForm.controls['taxable'];
    this.itemParameters = this.itemDetailForm.controls['parameters'];

    this.itemParameters.valueChanges.subscribe(data => {
      let itemName = '';
      this.selectedIds = [];
      data.forEach(parameter => {
        if (parameter.paramId && parameter.paramValId) {
          itemName += ((itemName ? '_' : '')  + this.getParamValById(parameter.paramValId));
        }

        this.selectedIds.push(parameter.paramId);
      });
      this.itemName.setValue(itemName);
    })

  }
}
