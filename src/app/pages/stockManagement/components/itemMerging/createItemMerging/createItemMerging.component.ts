import { CommonModalComponent } from '../../../../../shared/common-modal/common-modal.component';
import { LotItemCreationService } from '../../lotItemCreation/index';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { MergingModalOpen } from './merging-modal/merging-modal.component';
import { AuthenticationService } from '../../../../../core/authentication/authentication.service';
import { Logger } from '../../../../../core/logger.service';
import { ItemMergingService } from '../itemMerging.service';
import { CategoryService } from '.../../app/pages/masters/components/categories/category.service';
import { LotService } from '../../lots/lot.service';
import { ItemDetailsService } from '.../../app/pages/masters/components/itemDetails/itemDetails.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';

const log = new Logger('ItemMerge');

class AddItemDetails {
  sItemName: string;
  dItemName: string;
  sLotName: string;
  dLotName: string;
  lotItemId: number;
  itemCode: number;
  totalCarets: number;
  avgRate: number;
  srcSalePrice: number;
  destSalePrice: number;
}

@Component({
  selector: 'create-itemMerging',
  templateUrl: './createItemMerging.html',
  styleUrls: ['./createItemMerging.scss']
})
export class CreateItemMerging implements OnInit {
  originalList: any[] = [];
  destItem: any;
  itemMergingIdParam: string;
  pageTitle = 'Create Item Merging';

  source: LocalDataSource = new LocalDataSource();

  error: string = null;
  isLoading = false;
  itemMergingForm: FormGroup;
  errorMessage: string;
  successMessage: string;

  addedItemList: AddItemDetails[] = [];
  mergeItemList: AddItemDetails[] = [];
  lotList: any[] = [];
  catList: any[] = [];
  itemCatList: any[] = [];
  itemDLotList: any[] = [];
  itemLotList: any[] = [];
  itemDList: any[] = [];
  totalTransferCaret: number;
  averageRate: number;
  todayDate: string;
  settings: any;
  selectedLot: any;
  selectedDLot: any;
  selectedItem: any;
  selectedCat: any;
  selectedRowData: any;
  accessList: any[] = [];
  upDateAccess: boolean = false;
  items: any[] = [];
  public selectedCarats: AbstractControl;
  public selectedRate: AbstractControl;
  public item: AbstractControl;
  public transType: AbstractControl;
  public category: AbstractControl;
  public srcLotId: AbstractControl;
  public transDate: AbstractControl;
  public destLotId: AbstractControl;
  public destLotItemId: AbstractControl;
  public destLotItemName: AbstractControl;
  public srcLotItemId: AbstractControl;
  public remarks: AbstractControl;
  public totalCarets: AbstractControl;
  public avgRate: AbstractControl;
  public salePrice: AbstractControl;
  public destSalePrice: AbstractControl;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private service: ItemMergingService,
    private modalService: NgbModal,
    private lotService: LotService,
    private catService: CategoryService,
    private itemService: ItemDetailsService,
    private lotItemService: LotItemCreationService,
    private authService: AuthenticationService) {

    // this.accessList = this.authService.getUserAccessOfMenu('itemMerging');
    // this.upDateAccess = this.accessList.includes("ADD");
    // this.upDateAccess = this.accessList.includes("UPDATE");

    this.todayDate = this.today();
    this.createForm();

    this.transDate.setValue(this.todayDate);

    this.catService.getData().subscribe((catList) => {
      this.catList = catList;
    });

    this.destLotId.valueChanges.subscribe(val => {
      if (val) {
        this.items = [];
      }
    })

    this.destLotItemName.valueChanges.subscribe(val => {
      debugger;
      if (val) {
        this.itemDList.find(ele => {
          debugger;
          if (ele.itemMaster.itemName == val) {
            // this.item.setValue(ele);
            this.destLotItemId.setValue(ele.lotItemId);
            this.onChangeDItem(ele.lotItemId);
            // this.isSrcItemSelected=true;


            return true;
          }
        })
      }
    })
  }
  search = (text$: Observable<string>) =>
    text$
      .debounceTime(200)
      .distinctUntilChanged()
      .map(term => term.length < 1 ? []
        : this.items.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10));

  ngOnInit() {
    this.settings = this.prepareSetting();
    this.route.params.subscribe((params: Params) => {
      this.itemMergingIdParam = params['lotTransId'];
      if (this.itemMergingIdParam) {
        this.pageTitle = 'Edit Item Merging';

        this.service.getItemMergeById(this.itemMergingIdParam).subscribe(res => {
          // If edit is enabled, set value of --> this.selectedCat=res.catId & this.selectedLot=res.lotId
          this.markAllTouched(this.itemMergingForm);
          this.itemMergingForm.patchValue(res);
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

    if (this.itemMergingForm.valid) {

      if (this.mergeItemList.length > 0) {
        const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
        activeModal.componentInstance.showHide = true;
        activeModal.componentInstance.modalHeader = 'Alert';
        activeModal.componentInstance.modalContent = 'You will not be able to Edit this Merging again!! Are you sure you want to Submit?';
        activeModal.componentInstance.oKMessage = 'Yes';
        activeModal.componentInstance.cancelMessage = 'No';
        activeModal.result.then((res) => {
          if (res == 'Y') {
            this.isLoading = true;
            this.itemMergingForm.controls['mergingDetails'].setValue(this.mergeItemList);
            const formValue: any = this.itemMergingForm.value;

            this.service.createItemMerge(this.itemMergingForm.value).subscribe(itemMerging => {
              // log.debug(`${credentials.selectCategory} successfully logged in`);
              this.handleBack();
              this.finally();
            }, error => {
              log.debug(`Creation error: ${error}`);
              this.error = error;
              this.finally();
            });
          }
        })
      } else {
        const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
        activeModal.componentInstance.showHide = false;
        activeModal.componentInstance.modalHeader = 'Alert';
        activeModal.componentInstance.modalContent = 'At least one item is required to be Merge!!!';
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

  onChangeCat(catId: any): void {

    if (this.mergeItemList.length > 0) {
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = true;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Your all previous Merged Item info will be get removed!';
      activeModal.result.then((res) => {
        if (res == 'Y') {
          this.selectedCat = catId;
          this.itemMergingForm.controls['category'].setValue(this.selectedCat);
          this.selectedRowData = '';
          this.forChangeCat(catId);
        } else if (res == 'N') {
          this.itemMergingForm.controls['category'].setValue(this.selectedCat);
          this.transDate.setValue(this.todayDate);
        }
      });
    } else {
      this.selectedCat = this.category.value;
      this.forChangeCat(catId);
    }
    this.itemMergingForm.controls['category'].setValue(this.selectedCat);
  }

  forChangeCat(catId: any) {
    this.lotList = []
    this.lotService.getData().subscribe((lotList) => {
      this.lotList = lotList;
    });

    this.itemService.getAllItemsByCategoryId(catId).subscribe((itemCatList) => {
      this.itemCatList = itemCatList;
    });

    this.itemMergingForm.reset();
    this.itemMergingForm.controls['category'].setValue(catId);
    this.transDate.setValue(this.todayDate);
    this.itemMergingForm.controls['transType'].setValue('SA');
    this.itemMergingForm.controls['invoiceType'].setValue('LM');
    this.addedItemList = [];
    this.mergeItemList = [];
    this.itemDList = [];
  }

  onChangeDLot(lotId: any): void {

    if (this.mergeItemList.length > 0) {
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = true;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Your all previous Merged Item info will be get removed!';
      activeModal.result.then((res) => {
        if (res == 'Y') {
          this.selectedDLot = lotId;
          this.itemMergingForm.controls['destLotId'].setValue(this.selectedDLot);
          this.selectedRowData = '';
          this.forChangeDlot(lotId);
          this.getOriginalList();
        } else if (res == 'N') {
          this.itemMergingForm.controls['destLotId'].setValue(this.selectedDLot);
          this.itemMergingForm.controls['destLotItemId'].setValue(this.selectedItem);
        }
      });
    } else {
      this.selectedDLot = this.destLotId.value;
      this.forChangeDlot(lotId);
    }
    this.itemMergingForm.controls['destLotId'].setValue(this.selectedDLot);
  }

  forChangeDlot(lotId: any) {
    this.lotItemService.getAllLotItemByLotId(lotId).subscribe(itemDLotList => {
      this.itemDLotList = itemDLotList;
      this.itemDList = [];
      this.mergeItemList = [];
      this.itemMergingForm.controls['destLotItemId'].reset();
      this.itemMergingForm.controls['item'].reset();
      this.itemMergingForm.controls['selectedCarats'].reset();
      this.itemMergingForm.controls['selectedRate'].reset();
      this.itemMergingForm.controls['salePrice'].reset();
      this.itemMergingForm.controls['destSalePrice'].reset();
      this.itemMergingForm.controls['totalCarets'].reset();
      this.itemMergingForm.controls['avgRate'].reset();

      if (this.itemDLotList.length > 0) {
        this.itemDList = [];
        if (this.itemCatList.length > 0) {
          this.itemDLotList.forEach(lotItem => {
            if (this.category.value == lotItem.itemMaster.categoryMaster.catId && lotItem.lotMaster.lotId == lotId) {
              this.itemDList.push(lotItem);
              this.items.push(lotItem.itemMaster.itemName);
            }
          });
          if (this.itemDList.length === 0) {
            const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
            activeModal.componentInstance.showHide = false;
            activeModal.componentInstance.modalHeader = 'Alert';
            activeModal.componentInstance.modalContent = 'No items belongs to selected Category & Destination Lot!';
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
        activeModal.componentInstance.modalContent = 'No items in selected Destination Lot!';
      }
    });
  }

  onChangeDItem(lotItemId: any): void {
    if (this.mergeItemList.length > 0) {
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = true;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Your all previous Merged Item info will be get removed!';
      activeModal.result.then((res) => {
        if (res == 'Y') {
          this.selectedItem = lotItemId;
          this.mergeItemList = [];
          this.itemMergingForm.controls['destLotItemId'].setValue(this.selectedItem);
          this.selectedRowData = '';
          this.getOriginalList();
          this.itemMergingForm.controls['totalCarets'].reset();
          this.itemMergingForm.controls['avgRate'].reset();
          this.itemMergingForm.controls['selectedCarats'].reset();
          this.itemMergingForm.controls['selectedRate'].reset();
          this.itemMergingForm.controls['item'].reset();
          this.itemMergingForm.controls['salePrice'].reset();
          this.itemMergingForm.controls['destSalePrice'].reset();
        } else if (res == 'N') {
          this.itemMergingForm.controls['destLotItemId'].setValue(this.selectedItem);
        }
      });
    } else {
      this.selectedItem = this.destLotItemId.value;
    }
    this.itemMergingForm.controls['destLotItemId'].setValue(this.selectedItem);
    this.getDestItemDetail(this.selectedItem);
  }

  getDestItemDetail(lotItemId: any) {
    this.lotItemService.getLotItemCreationById(lotItemId).subscribe(itemDet => {
      this.destItem = itemDet;
      this.destSalePrice.setValue(this.destItem.itemMaster.salePrice);
    });
  }

  onChangeSLot(lotId: any): void {
    if (this.mergeItemList.length > 0) {
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = true;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Your all previous Merged Item info will be get removed!';
      activeModal.result.then((res) => {
        if (res == 'Y') {
          this.selectedLot = lotId;
          this.itemMergingForm.controls['srcLotId'].setValue(this.selectedLot);
          this.selectedRowData = '';
          this.forChangeSLot(lotId);
        } else if (res == 'N') {
          this.itemMergingForm.controls['srcLotId'].setValue(this.selectedLot);
        }
      });
    } else {
      this.selectedLot = this.srcLotId.value;
      this.forChangeSLot(lotId);
    }
    this.itemMergingForm.controls['srcLotId'].setValue(this.selectedLot);
  }

  forChangeSLot(lotId: any) {
    this.lotItemService.getAllLotItemByLotId(lotId).subscribe(itemLotList => {
      this.itemLotList = itemLotList;
      this.addedItemList = [];
      this.mergeItemList = [];
      this.itemMergingForm.controls['totalCarets'].reset();
      this.itemMergingForm.controls['avgRate'].reset();
      this.itemMergingForm.controls['item'].reset();
      this.itemMergingForm.controls['selectedCarats'].reset();
      this.itemMergingForm.controls['selectedRate'].reset();
      this.itemMergingForm.controls['destLotId'].reset();
      this.itemMergingForm.controls['destLotItemId'].reset();
      this.itemMergingForm.controls['salePrice'].reset();
      this.itemMergingForm.controls['destSalePrice'].reset();
      this.itemDList = [];


      if (this.itemLotList.length > 0) {
        this.addedItemList = [];
        if (this.itemCatList.length > 0) {
          this.itemLotList.forEach(lotItem => {
            if (this.category.value == lotItem.itemMaster.categoryMaster.catId && lotItem.lotMaster.lotId == lotId) {
              const itemDetails = new AddItemDetails();
              itemDetails.srcSalePrice = lotItem.itemMaster.salePrice;
              itemDetails.sItemName = lotItem.itemMaster.itemName;
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

  getOriginalList() {
    this.itemLotList.forEach(lotItem => {
      if (this.category.value == lotItem.itemMaster.categoryMaster.catId && lotItem.lotMaster.lotId == this.srcLotId.value) {
        const itemDetails = new AddItemDetails();
        itemDetails.srcSalePrice = lotItem.itemMaster.salePrice;
        itemDetails.sItemName = lotItem.itemMaster.itemName;
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

  onPreviewClick() {
    const activeModal = this.modalService.open(MergingModalOpen, { size: 'lg' });
    activeModal.componentInstance.modalHeader = 'Merged Item Details List';
    activeModal.componentInstance.source.load(this.mergeItemList);
    activeModal.componentInstance.aList = this.mergeItemList;
    activeModal.componentInstance.emitService.subscribe((emmitedValue) => {
      this.onDelStatus(emmitedValue[0], emmitedValue[1], emmitedValue[2]);
    });
  }

  onDelStatus(deleted: boolean = false, newList: any[], deletedData: any) {
    if (deleted) {
      this.mergeItemList = newList;
      this.calculateTransferedCaretAverageRate();
      this.totalCarets.setValue(this.totalTransferCaret);
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
    this.itemMergingForm.controls['selectedCarats'].reset();
    this.itemMergingForm.controls['selectedRate'].reset();
  }

  onUpdate() {
    if (this.selectedRowData == '' || this.selectedRowData == null) {
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = false;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Please Select One Item to Merge';
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
          activeModal.componentInstance.modalContent = 'Duplicate Item Merging! Please change Source Item!';
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
    ItemList.dLotName = this.destItem.lotMaster.lotName;
    ItemList.sItemName = this.selectedRowData.sItemName;
    ItemList.dItemName = this.destItem.itemMaster.itemName;
    ItemList.lotItemId = this.selectedRowData.lotItemId;
    ItemList.srcSalePrice = this.selectedRowData.srcSalePrice;
    ItemList.destSalePrice = this.destItem.itemMaster.salePrice;

    if (this.selectedCarats.value == null || this.selectedCarats.value <= 0) {
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
      activeModal.componentInstance.modalContent = 'Cannot merge Carats more than ' + this.selectedRowData.totalCarets + ' Carats!';
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

      this.mergeItemList.push(ItemList);

      this.source.load(this.addedItemList);
      this.itemMergingForm.controls['selectedCarats'].reset();
      this.itemMergingForm.controls['selectedRate'].reset();
      this.calculateTransferedCaretAverageRate();
      this.totalCarets.setValue(this.totalTransferCaret);
      this.avgRate.setValue(this.averageRate);
      this.successMessage = 'Item Added to Merged List Successfully!';
      setTimeout(() => this.successMessage = null, 3000);
    }
  }

  calculateTransferedCaretAverageRate() {
    let totalAmount = 0;
    let totalCatets = 0;
    if (this.mergeItemList.length > 0) {
      this.mergeItemList.forEach(item => {
        item.totalCarets = parseFloat(item.totalCarets.toString());
        item.avgRate = parseFloat(item.avgRate.toString());
        totalCatets += item.totalCarets;
        totalAmount += item.totalCarets * item.avgRate;
      });
      this.averageRate = parseFloat((totalAmount / totalCatets).toFixed(2));
      this.totalTransferCaret = parseFloat(totalCatets.toFixed(3));
    } else {
      this.averageRate = 0;
      this.totalTransferCaret = 0;
    }
  }

  finally() {
    this.isLoading = false;
    this.itemMergingForm.markAsPristine();
  }

  handleBack(cancelling: boolean = false) {
    // TODO: if cancelling then ask to confirn

    if (this.itemMergingIdParam) {
      this.router.navigate(['../../itemMerging'], { relativeTo: this.route });
    } else {
      this.router.navigate(['../itemMerging'], { relativeTo: this.route });
    }
  }

  private createForm() {
    this.itemMergingForm = this.fb.group({
      'lotTransId': [''],
      'category': ['', Validators.compose([Validators.required])],
      'srcLotId': ['', Validators.compose([Validators.required])],
      'destLotId': ['', Validators.compose([Validators.required])],
      'destLotItemId': ['', Validators.compose([Validators.required])],
      'destLotItemName': ['', Validators.compose([Validators.required])],
      'item': [''],
      'mergingDetails': [this.mergeItemList],
      'transDate': [''],
      'transType': ['SA'],
      'invoiceType': ['LM'],
      'remarks': ['', Validators.compose([Validators.required, Validators.maxLength(255)])],
      'totalCarets': [''],
      'avgRate': [''],
      'selectedCarats': [''],
      'selectedRate': [''],
      'salePrice': [''],
      'destSalePrice': [''],
    });

    this.category = this.itemMergingForm.controls['category'];
    this.srcLotId = this.itemMergingForm.controls['srcLotId'];
    this.transDate = this.itemMergingForm.controls['transDate'];
    this.destLotId = this.itemMergingForm.controls['destLotId'];
    this.destLotItemId = this.itemMergingForm.controls['destLotItemId'];
    this.destLotItemName = this.itemMergingForm.controls['destLotItemName'];
    this.remarks = this.itemMergingForm.controls['remarks'];
    this.totalCarets = this.itemMergingForm.controls['totalCarets'];
    this.avgRate = this.itemMergingForm.controls['avgRate'];
    this.item = this.itemMergingForm.controls['item'];
    this.selectedCarats = this.itemMergingForm.controls['selectedCarats'];
    this.selectedRate = this.itemMergingForm.controls['selectedRate'];
    this.salePrice = this.itemMergingForm.controls['salePrice'];
    this.destSalePrice = this.itemMergingForm.controls['destSalePrice'];
  }
}
