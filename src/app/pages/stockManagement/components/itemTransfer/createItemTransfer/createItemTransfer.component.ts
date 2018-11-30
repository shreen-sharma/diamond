import { TransferModal } from './transfer-modal/transfer-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LotItemCreationService } from '../../lotItemCreation/index';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { CommonModalComponent } from '../../../../../shared/common-modal/common-modal.component';
import { AuthenticationService } from '../../../../../core/authentication/authentication.service';
import { Logger } from '../../../../../core/logger.service';
import { ItemTransferService } from '../itemTransfer.service';
import { CategoryService } from '.../../app/pages/masters/components/categories/category.service';
import { LotService } from '../../lots/lot.service';
import { ItemDetailsService } from '.../../app/pages/masters/components/itemDetails/itemDetails.service';

const log = new Logger('ItemTrans');

class AddItemDetails {
  sItemName: string;
  sLotName: string;
  dLotName: string;
  lotItemId: number;
  sItemId: number;
  itemCode: number;
  totalCarets: number;
  avgRate: number;
  srcSalePrice: number;
}

@Component({
  selector: 'create-itemTransfer',
  templateUrl: './createItemTransfer.html',
  styleUrls: ['./createItemTransfer.scss']
})
export class CreateItemTransfer implements OnInit {
  destLotName: any;
  itemTransferIdParam: string;
  pageTitle = 'Create Item Transfer';
  settings: any;

  source: LocalDataSource = new LocalDataSource();

  error: string = null;
  isLoading = false;
  itemTransferForm: FormGroup;
  errorMessage: string;
  successMessage: string;

  transferLotItemList: AddItemDetails[] = [];
  addedItemList: AddItemDetails[] = [];
  accessList: any[] = [];

  lotList: any[] = [];
  catList: any[] = [];
  itemCatList: any[] = [];
  itemLotList: any[] = [];
  itemDLotList: any[] = [];
  originalList: any[] = [];
  totalTransferCarats: number = 0;
  averageRate: number = 0;
  todayDate: string;
  selectedLot: any;
  selectedDLot: any;
  selectedRowData: any;
  selectedCat: any;

  public selectedCarats: AbstractControl;
  public selectedRate: AbstractControl;
  public item: AbstractControl;
  public transType: AbstractControl;
  public category: AbstractControl;
  public lotMasterByFromLotId: AbstractControl;
  public transDate: AbstractControl;
  public lotMasterByToLotId: AbstractControl;
  public remarks: AbstractControl;
  public totalCarets: AbstractControl;
  public avgRate: AbstractControl;
  public salePrice: AbstractControl;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private service: ItemTransferService,
    private modalService: NgbModal,
    private lotService: LotService,
    private catService: CategoryService,
    private itemService: ItemDetailsService,
    private lotItemService: LotItemCreationService,
    private authService: AuthenticationService) {
    this.accessList = this.authService.getUserAccessOfMenu('itemTransfer');

    this.todayDate = this.today();
    this.createForm();

    this.transDate.setValue(this.todayDate);

    this.catService.getData().subscribe((catList) => {
      this.catList = catList;
    });
  }

  ngOnInit() {
    this.settings = this.prepareSetting();
    this.route.params.subscribe((params: Params) => {
      this.itemTransferIdParam = params['itemTransferId'];
      if (this.itemTransferIdParam) {
        this.pageTitle = 'Edit Item Transfer';

        this.service.getItemTransferById(this.itemTransferIdParam).subscribe(res => {
          this.markAllTouched(this.itemTransferForm);
          this.itemTransferForm.patchValue(res);
        })
      }
    });
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

  today(): string {
    const today = new Date();
    const dd = today.getDate();
    const mm = today.getMonth() + 1; //January is 0!
    const yyyy = today.getFullYear();
    return yyyy + '-' + (mm < 10 ? '0' + mm : mm) + '-' + (dd < 10 ? '0' + dd : dd);
  }

  prepareSetting() {
    return {
      actions: false,
      delete: {
        deleteButtonContent: '<i class="ion-trash-a"></i>',
        confirmDelete: true
      },
      selectMode: 'single',
      columns: {
        itemCode: {
          title: 'Item Code',
        },
        sItemName: {
          title: 'Source Item Name',
        },
        totalCarets: {
          title: 'Carats',
        },
        avgRate: {
          title: 'Rate',
        },
        srcSalePrice: {
          title: 'Selling Price',
        }
      }
    };
  }

  submit() {

    if (this.itemTransferForm.valid) {

      if (this.transferLotItemList.length > 0) {
        const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
        activeModal.componentInstance.showHide = true;
        activeModal.componentInstance.modalHeader = 'Alert';
        activeModal.componentInstance.modalContent = 'You will not be able to Edit this Transfer again!! Are you sure you want to Submit?';
        activeModal.componentInstance.oKMessage = 'Yes';
        activeModal.componentInstance.cancelMessage = 'No';
        activeModal.result.then((res) => {

          if (res == 'Y') {
            this.isLoading = true;
            this.itemTransferForm.controls['transferItems'].setValue(this.transferLotItemList);
            const formValue: any = this.itemTransferForm.value;

            this.service.createItemTransfer(this.itemTransferForm.value).subscribe(itemTransfer => {
              this.handleBack();
              this.finally();
            }, error => {
              log.debug(`Creation error: ${error}`);
              this.error = error;
              if (error._body) {
                this.errorMessage = error._body;
              } else {
                this.errorMessage = "Internal Server error!"
              }
              this.finally();
            });
          }
        });
      } else {
        const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
        activeModal.componentInstance.showHide = false;
        activeModal.componentInstance.modalHeader = 'Alert';
        activeModal.componentInstance.modalContent = 'At least one item is required to be Transfer!!!';
      }
    }
  }


  onChangeCat(catId: any): void {

    if (this.transferLotItemList.length > 0) {
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = true;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Your all previous Transferred Item info will be get removed!';
      activeModal.result.then((res) => {
        if (res == 'Y') {
          this.selectedCat = catId;
          this.itemTransferForm.controls['category'].setValue(this.selectedCat);
          this.selectedRowData = '';
          this.forChangeCat(catId);
        } else if (res == 'N') {
          this.itemTransferForm.controls['category'].setValue(this.selectedCat);
          this.transDate.setValue(this.todayDate);
        }
      });
    } else {
      this.selectedCat = this.category.value;
      this.forChangeCat(catId);
    }
    this.itemTransferForm.controls['category'].setValue(this.selectedCat);
  }

  forChangeCat(catId: any) {
    this.lotList = []
    this.lotService.getData().subscribe((lotList) => {
      this.lotList = lotList;
    });

    this.itemService.getAllItemsByCategoryId(catId).subscribe((itemCatList) => {
      this.itemCatList = itemCatList;
    });

    this.itemTransferForm.reset();
    this.itemTransferForm.controls['category'].setValue(catId);
    this.transDate.setValue(this.todayDate);
    this.itemTransferForm.controls['transType'].setValue('SA');
    this.itemTransferForm.controls['invoiceType'].setValue('LT');
    this.addedItemList = [];
    this.transferLotItemList = [];
  }

  onChangeSLot(lotId: any): void {
    if (this.transferLotItemList.length > 0) {
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = true;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Your all previous Transferred Item info will be get removed!';
      activeModal.result.then((res) => {
        if (res == 'Y') {
          this.selectedLot = lotId;
          this.itemTransferForm.controls['lotMasterByFromLotId'].setValue(this.selectedLot);
          this.selectedRowData = '';
          this.forChangeSLot(lotId);
        } else if (res == 'N') {
          this.itemTransferForm.controls['lotMasterByFromLotId'].setValue(this.selectedLot);
        }
      });
    } else {
      this.selectedLot = this.lotMasterByFromLotId.value;
      this.forChangeSLot(lotId);
    }
    this.itemTransferForm.controls['lotMasterByFromLotId'].setValue(this.selectedLot);
  }

  forChangeSLot(lotId: any) {
    this.lotItemService.getAllLotItemByLotId(lotId).subscribe(itemLotList => {
      this.itemLotList = itemLotList;
      this.addedItemList = [];
      this.transferLotItemList = [];
      this.itemTransferForm.controls['totalCarets'].reset();
      this.itemTransferForm.controls['avgRate'].reset();
      this.itemTransferForm.controls['item'].reset();
      this.itemTransferForm.controls['selectedCarats'].reset();
      this.itemTransferForm.controls['selectedRate'].reset();
      this.itemTransferForm.controls['lotMasterByToLotId'].reset();
      this.itemTransferForm.controls['salePrice'].reset();

      if (this.itemLotList.length > 0) {
        this.addedItemList = [];
        if (this.itemCatList.length > 0) {
          this.itemLotList.forEach(lotItem => {
            if (this.category.value == lotItem.itemMaster.categoryMaster.catId && lotItem.lotMaster.lotId == lotId) {
              const itemDetails = new AddItemDetails();
              itemDetails.srcSalePrice = lotItem.itemMaster.salePrice;
              itemDetails.sItemName = lotItem.itemMaster.itemName;
              itemDetails.sItemId = lotItem.itemMaster.itemId;
              itemDetails.sLotName = lotItem.lotMaster.lotName;
              itemDetails.lotItemId = lotItem.lotItemId;
              itemDetails.totalCarets = lotItem.totalCarets;
              itemDetails.avgRate = lotItem.avgRate;
              itemDetails.itemCode = lotItem.itemMaster.itemCode;
              this.addedItemList.push(itemDetails);
            }
          });
          this.source.load(this.addedItemList);
          this.settings = this.prepareSetting();

          if (this.addedItemList.length === 0) {
            const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
            activeModal.componentInstance.showHide = false;
            activeModal.componentInstance.modalHeader = 'Alert';
            activeModal.componentInstance.modalContent = 'No items belongs to selected Category & Source Lot!';
          }
        } else {
          const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
          activeModal.componentInstance.showHide = false;
          activeModal.componentInstance.modalHeader = 'Alert';
          activeModal.componentInstance.modalContent = 'No items in selected Category!';
        }
      } else {
        const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
        activeModal.componentInstance.showHide = false;
        activeModal.componentInstance.modalHeader = 'Alert';
        activeModal.componentInstance.modalContent = 'No items in selected Source Lot!';
      }
    });
  }

  onChangeDLot(lotId: any): void {

    if (this.transferLotItemList.length > 0) {
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = true;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Your all previous Transferred Item info will be get removed!';
      activeModal.result.then((res) => {
        if (res == 'Y') {
          this.selectedDLot = lotId;
          this.itemTransferForm.controls['lotMasterByToLotId'].setValue(this.selectedDLot);
          this.selectedRowData = '';
          this.forChangeDlot(lotId);
          this.getOriginalList();
        } else if (res == 'N') {
          this.itemTransferForm.controls['lotMasterByToLotId'].setValue(this.selectedDLot);
        }
      });
    } else {
      this.selectedDLot = this.lotMasterByToLotId.value;
      this.forChangeDlot(lotId);
    }
    this.itemTransferForm.controls['lotMasterByToLotId'].setValue(this.selectedDLot);
    this.getDestLotDetail(this.selectedDLot);
  }

  getOriginalList() {
    this.itemLotList.forEach(lotItem => {
      if (this.category.value == lotItem.itemMaster.categoryMaster.catId && lotItem.lotMaster.lotId == this.lotMasterByFromLotId.value) {
        const itemDetails = new AddItemDetails();
        itemDetails.srcSalePrice = lotItem.itemMaster.salePrice;
        itemDetails.sItemName = lotItem.itemMaster.itemName;
        itemDetails.sItemId = lotItem.itemMaster.itemId;
        itemDetails.sLotName = lotItem.lotMaster.lotName;
        itemDetails.lotItemId = lotItem.lotItemId;
        itemDetails.totalCarets = lotItem.totalCarets;
        itemDetails.avgRate = lotItem.avgRate;
        itemDetails.itemCode = lotItem.itemMaster.itemCode;
        this.originalList.push(itemDetails);
        this.source.load(this.originalList);
      }
    });
  }

  getDestLotDetail(lotId: any) {
    const lot = this.lotList.find(item => {
      if (item.lotId == lotId) {
        this.destLotName = item.lotName;
        return true;
      }
    })
  }

  forChangeDlot(lotId: any) {
    if (this.lotMasterByToLotId.value == this.lotMasterByFromLotId.value) {
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = false;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Source lot & Destination lot Cannot be same!';
      this.forChangeSLot(this.lotMasterByFromLotId.value);
    } else {
      this.lotItemService.getAllLotItemByLotId(lotId).subscribe(itemDLotList => {
        this.itemDLotList = itemDLotList;
        this.transferLotItemList = [];
        this.itemTransferForm.controls['totalCarets'].reset();
        this.itemTransferForm.controls['avgRate'].reset();
        this.itemTransferForm.controls['item'].reset();
        this.itemTransferForm.controls['selectedCarats'].reset();
        this.itemTransferForm.controls['selectedRate'].reset();
        this.itemTransferForm.controls['salePrice'].reset();
      });
    }
  }

  onPreviewClick() {
    const activeModal = this.modalService.open(TransferModal, { size: 'lg' });
    activeModal.componentInstance.modalHeader = 'Transferred Item Details List';
    activeModal.componentInstance.source.load(this.transferLotItemList);
    activeModal.componentInstance.aList = this.transferLotItemList;
    activeModal.componentInstance.emitService.subscribe((emmitedValue) => {
      this.onDelStatus(emmitedValue[0], emmitedValue[1], emmitedValue[2]);
    });
  }

  onDelStatus(deleted: boolean = false, newList: any[], deletedData: any) {
    if (deleted) {
      this.transferLotItemList = newList;
      this.calculateTransferedCaretAverageRate();
      this.totalCarets.setValue(this.totalTransferCarats);
      this.avgRate.setValue(this.averageRate);

      const b = this.addedItemList.findIndex(a => {
        if (a.lotItemId == deletedData.lotItemId) {
          return true;
        }
      });

      const amt1 = this.addedItemList[b].totalCarets * this.addedItemList[b].avgRate;
      const amtNew1 = deletedData.totalCarets * deletedData.avgRate;
      this.addedItemList[b].totalCarets += parseFloat(deletedData.totalCarets.toFixed(3));
      this.addedItemList[b].avgRate = parseFloat(((amt1 + amtNew1) / this.addedItemList[b].totalCarets).toFixed(2));
      this.source.load(this.addedItemList);
    }
  }

  onUserRowSelect(event: any) {
    this.selectedRowData = event.data;
    this.item.setValue(this.selectedRowData.sItemName);
    this.salePrice.setValue(this.selectedRowData.srcSalePrice);
    this.itemTransferForm.controls['selectedCarats'].reset();
    this.itemTransferForm.controls['selectedRate'].reset();
  }

  onUpdate() {
    if (this.selectedRowData == '' || this.selectedRowData == null) {
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = false;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Please Select One Item to Transfer';
    } else {
      if (this.transferLotItemList.length > 0) {
        const itemIndex = this.transferLotItemList.findIndex(item => {
          if (this.selectedRowData.lotItemId == item.lotItemId) {
            return true;
          }
        });

        if (itemIndex >= 0) {
          const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
          activeModal.componentInstance.showHide = false;
          activeModal.componentInstance.modalHeader = 'Alert';
          activeModal.componentInstance.modalContent = 'Duplicate Item Transfer! Please change Source Item!';
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
    ItemList.sLotName = this.selectedRowData.sLotName;
    ItemList.dLotName = this.destLotName;
    ItemList.sItemName = this.selectedRowData.sItemName;
    ItemList.lotItemId = this.selectedRowData.lotItemId;
    ItemList.srcSalePrice = this.selectedRowData.srcSalePrice;

    const checkItemExist = this.itemDLotList.findIndex(it => {
      if (it.itemMaster.itemId == this.selectedRowData.sItemId) {
        return true;
      }
    })

    if (checkItemExist == -1) {
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = false;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Source Item is not available in Destination Lot!';
    } else if (this.selectedCarats.value == null || this.selectedCarats.value <= 0) {
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = false;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Carats should be greater than 0 !';
    } else if (this.selectedRate.value == null || this.selectedRate.value <= 0) {
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = false;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Rate should be greater than 0 !';
    } else if (this.selectedCarats.value > this.selectedRowData.totalCarets) {
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = false;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Cannot transfer Carats more than ' + this.selectedRowData.totalCarets + ' Carats!';
    } else if ((this.selectedRowData.totalCarets * this.selectedRowData.avgRate) < (this.selectedCarats.value * this.selectedRate.value)) {
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = false;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Cannot Exceed Rate more than ' + ((this.selectedRowData.totalCarets * this.selectedRowData.avgRate) / this.selectedCarats.value);
    } else {
      ItemList.avgRate = parseFloat(this.selectedRate.value.toFixed(2));
      ItemList.totalCarets = parseFloat(this.selectedCarats.value.toFixed(3));

      const amt = this.selectedRowData.totalCarets * this.selectedRowData.avgRate;
      const newAmt = this.selectedCarats.value * this.selectedRate.value;
      const b = this.addedItemList.findIndex(a => {
        if (a.lotItemId == ItemList.lotItemId) {
          return true;
        }
      });
      this.addedItemList[b].totalCarets -= parseFloat(ItemList.totalCarets.toFixed(3));
      if (this.addedItemList[b].totalCarets == 0) {
        this.addedItemList[b].avgRate = 0;
      } else {
        this.addedItemList[b].avgRate = parseFloat(((amt - newAmt) / this.addedItemList[b].totalCarets).toFixed(2));
      }

      this.transferLotItemList.push(ItemList);

      this.source.load(this.addedItemList);
      this.itemTransferForm.controls['selectedCarats'].reset();
      this.itemTransferForm.controls['selectedRate'].reset();
      this.calculateTransferedCaretAverageRate();
      this.totalCarets.setValue(this.totalTransferCarats);
      this.avgRate.setValue(this.averageRate);
      this.successMessage = 'Item Added to Transfer List Successfully!';
      setTimeout(() => this.successMessage = null, 3000);
    }
  }

  calculateTransferedCaretAverageRate() {
    let totalAmount = 0;
    let totalCatets = 0;
    if (this.transferLotItemList.length > 0) {
      this.transferLotItemList.forEach(item => {
        item.totalCarets = parseFloat(item.totalCarets.toString());
        item.avgRate = parseFloat(item.avgRate.toString());
        totalCatets += item.totalCarets;
        totalAmount += item.totalCarets * item.avgRate;
      });
      this.averageRate = parseFloat((totalAmount / totalCatets).toFixed(2));
      this.totalTransferCarats = parseFloat(totalCatets.toFixed(3));
    } else {
      this.averageRate = 0;
      this.totalTransferCarats = 0;
    }
  }

  finally() {
    this.isLoading = false;
    this.itemTransferForm.markAsPristine();
  }

  handleBack(cancelling: boolean = false) {
    // TODO: if cancelling then ask to confirn

    if (this.itemTransferIdParam) {
      this.router.navigate(['../../itemTransfer'], { relativeTo: this.route });
    } else {
      this.router.navigate(['../itemTransfer'], { relativeTo: this.route });
    }
  }

  private createForm() {
    this.itemTransferForm = this.fb.group({
      'lotTransId': [''],
      'transType': ['SA'],
      'invoiceType': ['LT'],
      'category': ['', Validators.compose([Validators.required])],
      'lotMasterByFromLotId': ['', Validators.compose([Validators.required])],
      'lotMasterByToLotId': ['', Validators.compose([Validators.required])],
      'transferItems': [this.transferLotItemList],
      'transDate': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'item': [''],
      'remarks': ['', Validators.compose([Validators.required, Validators.maxLength(255)])],
      'totalCarets': [''],
      'avgRate': [''],
      'selectedCarats': [''],
      'selectedRate': [''],
      'salePrice': [''],
    });

    this.category = this.itemTransferForm.controls['category'];
    this.lotMasterByFromLotId = this.itemTransferForm.controls['lotMasterByFromLotId'];
    this.transDate = this.itemTransferForm.controls['transDate'];
    this.lotMasterByToLotId = this.itemTransferForm.controls['lotMasterByToLotId'];
    this.selectedCarats = this.itemTransferForm.controls['selectedCarats'];
    this.selectedRate = this.itemTransferForm.controls['selectedRate'];
    this.item = this.itemTransferForm.controls['item'];
    this.remarks = this.itemTransferForm.controls['remarks'];
    this.totalCarets = this.itemTransferForm.controls['totalCarets'];
    this.avgRate = this.itemTransferForm.controls['avgRate'];
    this.salePrice = this.itemTransferForm.controls['salePrice'];
  }
}
