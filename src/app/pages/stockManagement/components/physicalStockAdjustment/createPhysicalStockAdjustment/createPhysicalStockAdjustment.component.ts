import { CommonModalComponent } from '../../../../../shared/common-modal/common-modal.component';
import { LotItemCreationService } from '../../lotItemCreation/index';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { PhysicalStockModalOpen } from './physicalStock-modal/physicalStock-modal.component';
import { AuthenticationService } from '../../../../../core/authentication/authentication.service';
import { Logger } from '../../../../../core/logger.service';
import { LotService } from '../../lots/lot.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PhysicalStockAdjustmentService } from 'app/pages/stockManagement/components/physicalStockAdjustment';
import { CommonService } from 'app/pages/masters/components/common/index';
import { Location } from '@angular/common';

const log = new Logger('Physical Adjustment');

class AddItemDetails {
  lotId: number;
  lotName: string;
  lotItemId: number;
  itemId: number;
  itemName: string;
  itemCode: number;
  adjustedCarats: number;
  adjustedRate: number;
  remarks: string;
  salePrice: number;
}

@Component({
  selector: 'create-physicalStockAdjustment',
  templateUrl: './createPhysicalStockAdjustment.html',
  styleUrls: ['./createPhysicalStockAdjustment.scss']
})
export class CreatePhysicalStockAdjustment implements OnInit {
  physicalStockAdjustmentIdParam: string;
  pageTitle = 'Create Physical Stock Adjustment';

  source: LocalDataSource = new LocalDataSource();

  error: string = null;
  isLoading = false;
  physicalStockForm: FormGroup;
  errorMessage: string;
  successMessage: string;

  addedItemList: AddItemDetails[] = [];
  mergeItemList: AddItemDetails[] = [];
  lotList: any[] = [];

  todayDate: string;
  settings: any;
  selectedRowData: any;
  invoiceStatus: boolean = false;
  invoiceTypeList: any[] = [];

  public selectedCarats: AbstractControl;
  public selectedRate: AbstractControl;
  public item: AbstractControl;
  public transType: AbstractControl;
  public lotMaster: AbstractControl;
  public stockUpdationDate: AbstractControl;
  public remarks: AbstractControl;
  public invoiceType: AbstractControl;
  public invoiceNo: AbstractControl;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private service: PhysicalStockAdjustmentService,
    private modalService: NgbModal,
    private lotService: LotService,
    private lotItemService: LotItemCreationService,
    private authService: AuthenticationService,
    private commonService: CommonService,
    private back: Location) {

    this.todayDate = this.today();
    this.createForm();

    this.stockUpdationDate.setValue(this.todayDate);

    this.lotService.getData().subscribe((lotList) => {
      this.lotList = lotList;
    });

    this.commonService.getAllCommonMasterByType('IT').subscribe((invoieType) => {
      this.invoiceTypeList = invoieType.sort((n1, n2) => {
        if (n1.code > n2.code) {
          return 1;
        }

        if (n1.code < n2.code) {
          return -1;
        }

        return 0;
      });
    });
  }

  ngOnInit() {
    this.settings = this.prepareSetting();
  }

  markAllTouched(control: AbstractControl) {
    debugger;
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

  prepareSetting() {
    return {
      actions: {
        position: 'right',
        add: false,
        edit: false,
        delete: false
      },
      delete: {
        deleteButtonContent: '<i class="ion-trash-a"></i>',
        confirmDelete: true
      },
      selectMode: 'single',
      columns: {
        itemName: {
          title: 'Item Name',
        },
        adjustedCarats: {
          title: 'Carats',
        },
        adjustedRate: {
          title: 'Stock Price',
        },
        salePrice: {
          title: 'Selling Price',
        },
        remarks: {
          title: 'Remarks'
        }
      }
    };
  }

  submit() {
    // this.errorMessage = '';

    if (this.physicalStockForm.valid) {

      if (this.mergeItemList.length > 0) {

        const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
        activeModal.componentInstance.showHide = true;
        activeModal.componentInstance.modalHeader = 'Alert';
        activeModal.componentInstance.modalContent = 'You will not be able to Edit this Adjustment again!! Are you sure you want to Submit?';
        activeModal.componentInstance.oKMessage = 'Yes';
        activeModal.componentInstance.cancelMessage = 'No';
        activeModal.result.then((res) => {
          if (res == 'Y') {
            this.isLoading = true;
            this.physicalStockForm.controls['stockAdjustDetails'].setValue(this.mergeItemList);
            const formValue: any = this.physicalStockForm.value;

            this.service.createStockAdjustment(this.physicalStockForm.value).subscribe(stockAdjustment => {
              // log.debug(`successfully logged in`);
              this.handleBack();
              this.finally();
            }, error => {
              log.debug(`Creation error: ${error}`);
              this.error = error;
              this.finally();
            });
          }
        });
      } else {
        const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
        activeModal.componentInstance.showHide = false;
        activeModal.componentInstance.modalHeader = 'Alert';
        activeModal.componentInstance.modalContent = 'Please Select Some Item to Adjust the stock!';
      }
    }
  }

  today(): string {
    const today = new Date();
    const dd = today.getDate();
    const mm = today.getMonth() + 1; //January is 0!

    const yyyy = today.getFullYear();
    return yyyy + '-' + (mm < 10 ? '0' + mm : mm) + '-' + (dd < 10 ? '0' + dd : dd);
  }

  onChangeSLot(lotId: any): void {
    debugger;
    this.addedItemList = [];
    this.lotItemService.getAllLotItemByLotId(lotId).subscribe(data => {
      data.forEach(ele => {
        const newItem = new AddItemDetails();
        newItem.itemCode = ele.itemMaster.itemCode;
        newItem.itemName = ele.itemMaster.itemName;
        newItem.adjustedRate = ele.avgRate;
        newItem.adjustedCarats = ele.totalCarets;
        newItem.lotItemId = ele.lotItemId;
        newItem.lotId = ele.lotMaster.lotId;
        newItem.itemId = ele.itemMaster.itemId;
        newItem.lotName = ele.lotMaster.lotName;
        newItem.salePrice = ele.itemMaster.salePrice;
        this.addedItemList.push(newItem);
      })
      this.source.load(this.addedItemList);
      console.log(this.addedItemList);
    })

  }

  onPreviewClick() {
    const activeModal = this.modalService.open(PhysicalStockModalOpen, { size: 'lg' });
    activeModal.componentInstance.modalHeader = 'Adjusted Items Detail';
    activeModal.componentInstance.source.load(this.mergeItemList);
    activeModal.componentInstance.aList = this.mergeItemList;
    activeModal.componentInstance.emitService.subscribe((emmitedValue) => {
      debugger;
      if (emmitedValue) {
        this.onDelStatus(emmitedValue[0], emmitedValue[1], emmitedValue[2]);
      }
    });
  }

  onDelStatus(deleted: boolean = false, newList: any[], deletedData: any) {
    if (deleted) {
      this.mergeItemList = newList;

      const b = this.addedItemList.findIndex(a => {
        if (a.lotItemId == deletedData.lotItemId) {
          return true;
        }
      });

      const amt1 = this.addedItemList[b].adjustedCarats * this.addedItemList[b].adjustedRate;
      const amtNew1 = deletedData.adjustedCarats * deletedData.adjustedRate;
      this.addedItemList[b].adjustedCarats -= parseFloat(deletedData.adjustedCarats.toFixed(3));
      this.addedItemList[b].adjustedRate = parseFloat(((amt1 - amtNew1) / this.addedItemList[b].adjustedCarats).toFixed(2));
      this.addedItemList[b].remarks = '';
      this.source.load(this.addedItemList);
    }
  }

  getLotName(lotId: any): string {
    debugger;
    let lotName = "";
    this.lotList.forEach(lot => {
      if (lot.lotId == lotId) {
        lotName = lot.lotName;
      }
    });
    return lotName;
  }

  onUserRowSelect(event: any) {
    this.selectedRowData = event.data;
    this.item.setValue(this.selectedRowData.itemName);
    this.physicalStockForm.controls['selectedCarats'].reset();
    this.physicalStockForm.controls['selectedRate'].reset();
    this.selectedRate.setValue(this.selectedRowData.adjustedRate);
  }

  onUpdate() {
    if (this.selectedRowData == '' || this.selectedRowData == null) {
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = false;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Please Select One Item to Stock Adjust';
    } else {
      if (this.mergeItemList.length > 0) {
        const itemIndex = this.mergeItemList.findIndex(item => {
          if (this.selectedRowData.lotItemId == item.lotItemId) {
            return true;
          }
        });

        if (itemIndex >= 0) {
          const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
          activeModal.componentInstance.showHide = false;
          activeModal.componentInstance.modalHeader = 'Alert';
          activeModal.componentInstance.modalContent = 'Duplicate Item! Please change the Item!';
        } else {
          this.validUpdate();
        }
      } else {
        this.validUpdate();
      }
    }
  }


  validUpdate() {
    const ItemList = new AddItemDetails();

    ItemList.lotItemId = this.selectedRowData.lotItemId;
    ItemList.lotName = this.selectedRowData.lotName;
    ItemList.itemName = this.selectedRowData.itemName;
    ItemList.remarks = this.remarks.value;

    if (this.selectedCarats.value == null || this.selectedCarats.value == 0) {
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = false;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Carats should not be 0 !';
    } else if (this.selectedRate.value == null || this.selectedRate.value <= 0) {
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = false;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Rate should be greater than 0 !';
    } else if (this.remarks.value == null || this.remarks.value == '') {
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = false;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Remarks should not be empty!';
    } else if (this.selectedCarats.value > this.selectedRowData.adjustedCarats) {
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = false;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Cannot Adjust Carats more than ' + this.selectedRowData.adjustedCarats + ' Carats!';
    }
    //  else if ((this.selectedRowData.adjustedCarats * this.selectedRowData.adjustedRate) < (this.selectedCarats.value * this.selectedRate.value)) {
    //   const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
    //   activeModal.componentInstance.showHide = false;
    //   activeModal.componentInstance.modalHeader = 'Alert';
    //   activeModal.componentInstance.modalContent = 'Cannot Exceed Rate more than ' + ((this.selectedRowData.adjustedCarats * this.selectedRowData.adjustedRate)/this.selectedCarats.value);
    //} 
    else if ((this.selectedRowData.adjustedCarats == 0)) {
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = false;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'The Updated Stock should not be less than 0!';
    } else if ((this.selectedRowData.adjustedCarats + this.selectedCarats.value) < 0) {
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = false;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'The Stock Carats should not be less than the Adjusted Carats';
    } else {
      ItemList.adjustedRate = parseFloat(this.selectedRate.value.toFixed(2));
      ItemList.adjustedCarats = parseFloat(this.selectedCarats.value.toFixed(3));

      const amt = this.selectedRowData.adjustedCarats * this.selectedRowData.adjustedRate;
      const newAmt = this.selectedCarats.value * this.selectedRate.value;
      const b = this.addedItemList.findIndex(a => {
        if (a.lotItemId == ItemList.lotItemId) {
          return true;
        }
      });
      this.addedItemList[b].remarks = ItemList.remarks;
      this.addedItemList[b].adjustedCarats += ItemList.adjustedCarats;
      if (this.addedItemList[b].adjustedCarats == 0) {
        this.addedItemList[b].adjustedRate = 0;
      } else {
        this.addedItemList[b].adjustedRate = parseFloat(((amt + newAmt) / this.addedItemList[b].adjustedCarats).toFixed(2));
      }
      if (this.addedItemList[b].adjustedRate < 0) {
        const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
        activeModal.componentInstance.showHide = false;
        activeModal.componentInstance.modalHeader = 'Alert';
        activeModal.componentInstance.modalContent = 'Adjusted Stock Price Should not be Zero!';
      } else {
        this.mergeItemList.push(ItemList);

        this.source.load(this.addedItemList);
        this.physicalStockForm.controls['selectedCarats'].reset();
        this.physicalStockForm.controls['selectedRate'].reset();
        this.physicalStockForm.controls['remarks'].reset();
        this.successMessage = 'Item Added to Stock Adjusted List Successfully!';
        setTimeout(() => this.successMessage = null, 3000);
      }


    }
  }

  finally() {
    this.isLoading = false;
    this.physicalStockForm.markAsPristine();
  }


  checkInvoiceExist() {
    this.service.getCheckInvoiceTypeExist(this.invoiceType.value, this.invoiceNo.value).subscribe(status => {
      if (status.flag) {
        this.invoiceStatus = true;
      } else {
        const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
        activeModal.componentInstance.showHide = false;
        activeModal.componentInstance.modalHeader = 'Alert';
        activeModal.componentInstance.modalContent = 'Invoice No. Doesn\'t Exist!! Please check Invoice No. or Invoice Type!!';
        this.invoiceStatus = false;
      }
    })
  }

  handleBack(cancelling: boolean = false) {
    // TODO: if cancelling then ask to confirn

    this.back.back();
    // if (this.itemMergingIdParam) {
    //   this.router.navigate(['../../itemMerging'], {relativeTo: this.route});
    // } else {
    //   this.router.navigate(['../itemMerging'], {relativeTo: this.route});
    // }
  }

  private createForm() {
    this.physicalStockForm = this.fb.group({
      'lotMaster': ['', Validators.compose([Validators.required])],
      'invoiceType': ['', Validators.compose([Validators.required])],
      'invoiceNo': [''],
      'item': [''],
      'stockAdjustDetails': [this.mergeItemList],
      'stockUpdationDate': [''],
      'transType': ['SA'],
      'remarks': [''],
      'selectedCarats': [''],
      'selectedRate': [''],
    });

    this.lotMaster = this.physicalStockForm.controls['lotMaster'];
    this.stockUpdationDate = this.physicalStockForm.controls['stockUpdationDate'];
    this.invoiceType = this.physicalStockForm.controls['invoiceType'];
    this.invoiceNo = this.physicalStockForm.controls['invoiceNo'];
    this.remarks = this.physicalStockForm.controls['remarks'];
    this.item = this.physicalStockForm.controls['item'];
    this.selectedCarats = this.physicalStockForm.controls['selectedCarats'];
    this.selectedRate = this.physicalStockForm.controls['selectedRate'];


    this.invoiceType.valueChanges.subscribe(val => {
      if (val == 'OT') {
        this.invoiceStatus = true;
      }
      else {
        this.invoiceStatus = false;
      }


    })
  }
}
