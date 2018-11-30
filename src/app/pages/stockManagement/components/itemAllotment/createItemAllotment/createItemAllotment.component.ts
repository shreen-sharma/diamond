import { CommonModalComponent } from '../../../../../shared/common-modal/common-modal.component';
import { LotItemCreationService } from '../../lotItemCreation/index';
import { FormGroup, FormArray, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { AllotmentModalOpen } from './allotment-modal/allotment-modal.component';
import { AuthenticationService } from '../../../../../core/authentication/authentication.service';
import { Logger } from '../../../../../core/logger.service';
import { ItemAllotmentService } from '../itemAllotment.service';
import { LotService } from '../../lots/lot.service';
import { CategoryService } from '.../../app/pages/masters/components/categories/category.service';
import { ItemDetailsService } from '.../../app/pages/masters/components/itemDetails/itemDetails.service';
import { ParaValueService } from '.../../app/pages/masters/components/parameterValue';
import { ParaListService } from '.../../app/pages/masters/components/parameterList';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';

const log = new Logger('ItemAllot');

class itemAllots {
  sLotId: number;
  sLotName: string;
  sLotItemId: number;
  sItemName: string;
  dLotId: number;
  dLotName: string;
  dLotItemId: number;
  dItemName: string;
  itemCode: string;
  carats: number;
  avgRate: number;
  srcSalePrice: number;
  destSalePrice: number;
}

@Component({
  selector: 'create-itemAllotment',
  templateUrl: './createItemAllotment.html',
  styleUrls: ['./createItemAllotment.scss']
})
export class CreateItemAllotment implements OnInit {
  srcItemDet: any;
  itemAllotmentIdParam: string;
  pageTitle = 'Create Item Allotment';

  error: string = null;
  isLoading = false;
  createItemAllotmentForm: FormGroup;
  source: LocalDataSource = new LocalDataSource();
  successMessage: string;
  // isSelected: boolean;

  addedItemList: itemAllots[] = [];
  itemAllotList: itemAllots[] = [];
  lotList: any[] = [];
  catList: any[] = [];
  itemLotList: any[] = [];
  itemCatList: any[] = [];
  itemSList: any[] = [];
  itemDLotList: any[] = [];
  paraNameList: any[];
  paraValueList: any[];
  items : any[] = []; //for storing the itemName
  settings: any;
  totalTransferCaret: number;
  selectedCat: any;
  todayDate: string;
  selectedLot: any;
  selectedRowData: any;
  accessList: any[] = [];
  upDateAccess: boolean = false;
  isSrcItemSelected: boolean = false;
  public category: AbstractControl;
  public lotMasterByFromLotId: AbstractControl;
  public lotMasterByToLotId: AbstractControl;
  public transDate: AbstractControl;
  public lotItemByFromLotItemId: AbstractControl;
  public lotItemByFromLotItemName: AbstractControl;
  // public lotItemByToLotItemId: AbstractControl;
  public availableCarats: AbstractControl;
  public avgRate: AbstractControl;
  public item: AbstractControl;
  public carats: AbstractControl;
  public orgAvgRate: AbstractControl;
  public remarks: AbstractControl;
  public totalCarets: AbstractControl;
  public itemParameters: AbstractControl;
  public transType: AbstractControl;
  public salePrice: AbstractControl;
  public destItemCtrl: AbstractControl;
  public destCaratsCtrl: AbstractControl;
  public destAvgRateCtrl: AbstractControl;
  public destSalePriceCtrl: AbstractControl;
  public destitemCodeCtrl: AbstractControl;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private service: ItemAllotmentService,
    private modalService: NgbModal,
    private lotService: LotService,
    private catService: CategoryService,
    private itemService: ItemDetailsService,
    private lotItemService: LotItemCreationService,
    private paraNameService: ParaListService,
    private paramValService: ParaValueService,
    private authService: AuthenticationService) {
    // this.accessList = this.authService.getUserAccessOfMenu('itemAllotment');
    // this.upDateAccess = this.accessList.includes("ADD");
    // this.upDateAccess = this.accessList.includes("UPDATE");
    this.todayDate = this.today();
    this.createForm();

    this.settings = this.prepareSetting();
    this.transDate.setValue(this.todayDate);

    this.catService.getData().subscribe((catList) => {
      this.catList = catList;
    });

    // aman-edited

    this.lotMasterByFromLotId.valueChanges.subscribe(val => {
      if(val){
        this.items = [];
      }
    })

    this.lotItemByFromLotItemName.valueChanges.subscribe(val =>{
      if(val){
        this.isSrcItemSelected=false;
        this.itemSList.find(ele =>{
          if(ele.itemMaster.itemName == val){
           this.item.setValue(ele);
            this.onChangeSItem(ele.lotItemId);
            this.isSrcItemSelected=true;
            this.lotItemByFromLotItemId.setValue(ele.lotItemId);
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
      this.itemAllotmentIdParam = params['itemAllotmentId'];
      if (this.itemAllotmentIdParam) {
        this.pageTitle = 'Edit Item Allotment';

        this.service.getItemAllotmentById(this.itemAllotmentIdParam).subscribe(res => {
          // If edit is enabled, set value of --> this.selectedCat=res.catId & this.selectedLot=res.lotId
          this.markAllTouched(this.createItemAllotmentForm);
          this.createItemAllotmentForm.patchValue(res);
          this.source.load(this.itemAllotList);
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
        delete: false,
      },
      delete: {
        deleteButtonContent: '<i class="ion-trash-a"></i>',
        confirmDelete: true
      },
      pager: {
        display: true,
        perPage: 10,
      },
      selectMode: 'single',
      columns: {
        dLotName: {
          title: 'Destination Lot Name',
        },
        itemCode: {
          title: 'Item Code',
        },
        dItemName: {
          title: 'Destination Item Name',
        },
        carats: {
          title: 'Carats',
        },
        avgRate: {
          title: 'Rate',
        },
        destSalePrice: {
          title: 'Sale Price',
        },
      }
    };
  }

  submit() {
    if (this.createItemAllotmentForm.valid) {

      if (this.itemAllotList.length > 0) {
        const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
        activeModal.componentInstance.showHide = true;
        activeModal.componentInstance.modalHeader = 'Alert';
        activeModal.componentInstance.modalContent = 'You will not be able to Edit this Merging again!! Are you sure you want to Submit?';
        activeModal.componentInstance.oKMessage = 'Yes';
        activeModal.componentInstance.cancelMessage = 'No';
        activeModal.result.then((res) => {
          if (res == 'Y') {
            this.isLoading = true;
            this.createItemAllotmentForm.controls['itemAllotList'].setValue(this.itemAllotList);
            const formValue: any = this.createItemAllotmentForm.value;

            this.service.createItemAllotment(this.createItemAllotmentForm.value).subscribe(itemAllotment => {
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
        activeModal.componentInstance.modalContent = 'At least one item is required to be Allot!!!';
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

    if (this.itemAllotList.length > 0) {
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = true;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Your all previous Alloted Item info will be get removed!';
      activeModal.result.then((res) => {
        if (res == 'Y') {
          this.selectedCat = catId;
          this.createItemAllotmentForm.controls['category'].setValue(this.selectedCat);
          this.selectedRowData = '';
          this.forChangeCat(catId);
        } else if (res == 'N') {
          this.createItemAllotmentForm.controls['category'].setValue(this.selectedCat);
          this.transDate.setValue(this.todayDate);
        }
      });
    } else {
      this.selectedCat = this.category.value;
      this.forChangeCat(catId);
    }
    this.createItemAllotmentForm.controls['category'].setValue(this.selectedCat);
  }

  forChangeCat(catId: any) {
    this.lotList = []
    this.lotService.getData().subscribe((lotList) => {
      this.lotList = lotList;
    });

    this.itemService.getAllItemsByCategoryId(catId).subscribe((itemCatList) => {
      this.itemCatList = itemCatList;
    });

    this.createItemAllotmentForm.reset();
    this.createItemAllotmentForm.controls['category'].setValue(catId);
    this.transDate.setValue(this.todayDate);
    this.createItemAllotmentForm.controls['transType'].setValue('SA');
    this.createItemAllotmentForm.controls['invoiceType'].setValue('LA');
    this.itemAllotList = [];
    this.addedItemList = [];
    this.itemSList = [];
  }

  onChangeSLot(lotId: any): void {
    this.reset();

    if (this.lotMasterByToLotId.value == this.lotMasterByFromLotId.value) {
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = false;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Source lot & Destination lot Cannot be same!';
      this.createItemAllotmentForm.controls['lotMasterByFromLotId'].reset();
    } else {
      this.lotItemService.getAllLotItemByLotId(lotId).subscribe(itemLotList => {
        this.itemLotList = itemLotList;
        if (this.itemLotList.length > 0) {
          this.itemSList = [];
          if (this.itemCatList.length > 0) {
            this.itemLotList.forEach(lotItem => {
              if (this.category.value == lotItem.itemMaster.categoryMaster.catId && lotItem.lotMaster.lotId == lotId) {
                this.itemSList.push(lotItem);
                this.items.push(lotItem.itemMaster.itemName);
              }
            });
            if (this.itemSList.length === 0) {
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
  }

  onChangeDLot(lotId: any): void {
    if (this.itemAllotList.length > 0) {
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = true;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Your all previous Alloted Item info will be get removed!';
      activeModal.result.then((res) => {
        if (res == 'Y') {
          this.selectedLot = lotId;
          this.createItemAllotmentForm.controls['lotMasterByToLotId'].setValue(this.selectedLot);
          this.selectedRowData = '';
          this.forChangeDLot(lotId);
        } else if (res == 'N') {
          this.createItemAllotmentForm.controls['lotMasterByToLotId'].setValue(this.selectedLot);
        }
      });
    } else {
      this.selectedLot = this.lotMasterByToLotId.value;
      this.forChangeDLot(lotId);
    }
    this.createItemAllotmentForm.controls['lotMasterByToLotId'].setValue(this.selectedLot);
  }

  forChangeDLot(lotId: any) {
    this.lotItemService.getAllLotItemByLotId(lotId).subscribe(itemDLotList => {
      this.itemDLotList = itemDLotList;
      this.addedItemList = [];
      this.itemAllotList = [];
      this.createItemAllotmentForm.controls['lotMasterByFromLotId'].reset();
      this.createItemAllotmentForm.controls['totalCarets'].reset();
      this.createItemAllotmentForm.controls['remarks'].reset();
      this.reset();

      if (this.itemDLotList.length > 0) {
        this.addedItemList = [];
        if (this.itemCatList.length > 0) {
          this.itemDLotList.forEach(lotItem => {
            if (this.category.value == lotItem.itemMaster.categoryMaster.catId && lotItem.lotMaster.lotId == lotId) {
              const itemDetails = new itemAllots();
              itemDetails.dLotItemId = lotItem.lotItemId;
              itemDetails.dLotName = lotItem.lotMaster.lotName;
              itemDetails.dItemName = lotItem.itemMaster.itemName;
              itemDetails.itemCode = lotItem.itemMaster.itemCode;
              itemDetails.carats = lotItem.totalCarets;
              itemDetails.avgRate = lotItem.avgRate;
              itemDetails.destSalePrice = lotItem.itemMaster.salePrice;
              this.addedItemList.push(itemDetails);
            }
          });
          this.source.load(this.addedItemList);
          if (this.addedItemList.length === 0) {
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

  reset() {
    this.createItemAllotmentForm.controls['lotItemByFromLotItemId'].reset();
    this.itemSList = [];
    this.createItemAllotmentForm.controls['availableCarats'].reset();
    this.createItemAllotmentForm.controls['orgAvgRate'].reset();
    this.createItemAllotmentForm.controls['item'].reset();
    this.createItemAllotmentForm.controls['carats'].reset();
    this.createItemAllotmentForm.controls['avgRate'].reset();
    this.createItemAllotmentForm.controls['salePrice'].reset();
    this.createItemAllotmentForm.controls['destAvgRateCtrl'].reset();
    this.createItemAllotmentForm.controls['destCaratsCtrl'].reset();
    this.createItemAllotmentForm.controls['destItemCtrl'].reset();
    this.createItemAllotmentForm.controls['destSalePriceCtrl'].reset();
  }

  onChangeSItem(itemId: any) {

    // this.createItemAllotmentForm.controls['parameters'].reset();
    // this.initParameter();
    // this.paraNameService.getData().subscribe(res => {
    //   this.paraNameList = res;
    // });
    // this.paramValService.getData().subscribe(res => {
    //   this.paraValueList = res;
    // });

    const itemIndex = this.itemAllotList.findIndex(item => {
      if (this.lotItemByFromLotItemId.value == item.sLotItemId) {
        return true;
      }
    });

    const item = this.itemSList.find(item => {
      if (this.lotItemByFromLotItemName.valid && itemId == item.lotItemId) {
        return true;
      }
    });

    if (itemIndex >= 0) {
      let car = 0;
      let amt = item.totalCarets * item.avgRate;
      this.itemAllotList.forEach(element => {
        if (this.lotItemByFromLotItemId.value == element.sLotItemId) {
          car = car + element.carats;
          amt = amt - (element.carats * element.avgRate);
        }
      });
      if ((item.totalCarets - car) <= 0 || isNaN(amt) || amt <= 0) {
        if ((item.totalCarets - car) <= 0) {
          const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
          activeModal.componentInstance.showHide = false;
          activeModal.componentInstance.modalHeader = 'Alert';
          activeModal.componentInstance.modalContent = 'You have 0 carats! Please change to another Source Item or Submit the Transaction!';
        } else {
          const activeModal = this.modalService.open(CommonModalComponent, { size: 'lg' });
          activeModal.componentInstance.showHide = false;
          activeModal.componentInstance.modalHeader = 'Alert';
          activeModal.componentInstance.modalContent = 'Available Rate has been updated to 0! Please change to another Source Item or Submit the Transaction & then Try to Update the Rate in Item Rate Updation Screen!';
        }
      }
      this.availableCarats.setValue(item.totalCarets - car);
      this.orgAvgRate.setValue(amt / this.availableCarats.value);
    } else {
      this.availableCarats.setValue(item.totalCarets);
      this.orgAvgRate.setValue(item.avgRate);
    }
    this.item.setValue(item.itemMaster.itemName);
    this.salePrice.setValue(item.itemMaster.salePrice);
    this.srcItemDet = item;
    this.createItemAllotmentForm.controls['carats'].reset();
    this.createItemAllotmentForm.controls['avgRate'].reset();
  }

  onUserRowSelect(event: any) {
    // let a ;
    // this.source.getFilteredAndSorted().then( item => {
    //   debugger;
    //     a = item[0];

    //   if(event.isSelected == false && event.data.dLotItemId == a.dLotItemId) {
    //     this.isSelected = true;
    //     this.selectedRowData =  event.data;
    //   } else if(event.isSelected == true && event.data.dLotItemId != a.dLotItemId) {
    //     this.isSelected = true;
    //     this.selectedRowData = event.selected[0];
    //   }  else {
    //     this.isSelected = false;
    //     this.selectedRowData = ''; 
    //   }
    // });
    this.selectedRowData = event.data;
    this.destItemCtrl.setValue(this.selectedRowData.dItemName);
    this.destSalePriceCtrl.setValue(this.selectedRowData.destSalePrice);
    this.destCaratsCtrl.setValue(this.selectedRowData.carats);
    this.destAvgRateCtrl.setValue(this.selectedRowData.avgRate);
    this.destitemCodeCtrl.setValue(this.selectedRowData.itemCode);
  }


  onUpdate() {
    if (this.selectedRowData == '' || this.selectedRowData == null) {
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = false;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Please Select One Destination Item to Allot';
    } else {
      if (this.itemAllotList.length > 0) {
        const itemIndex = this.itemAllotList.findIndex(item => {
          if (this.lotItemByFromLotItemId.value == item.sLotItemId && this.selectedRowData.dLotItemId == item.dLotItemId) {
            return true;
          }
        });

        if (itemIndex >= 0) {
          const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
          activeModal.componentInstance.showHide = false;
          activeModal.componentInstance.modalHeader = 'Alert';
          activeModal.componentInstance.modalContent = 'Duplicate Item Allotment! Please change Source Item Or Destination Item!';
        } else {
          this.validUpdate();
        }
      } else {
        this.validUpdate();
      }
    }
  }

  validUpdate() {
    const itemAllotDetails = new itemAllots();
    itemAllotDetails.sLotId = this.lotMasterByFromLotId.value;
    itemAllotDetails.sLotName = this.srcItemDet.lotMaster.lotName;
    itemAllotDetails.sLotItemId = this.srcItemDet.lotItemId;//this.lotItemByFromLotItemId.value;
    itemAllotDetails.sItemName = this.srcItemDet.itemMaster.itemName;
    itemAllotDetails.dLotId = this.lotMasterByToLotId.value;
    itemAllotDetails.dLotName = this.selectedRowData.dLotName;
    itemAllotDetails.dLotItemId = this.selectedRowData.dLotItemId;
    itemAllotDetails.dItemName = this.selectedRowData.dItemName;
    itemAllotDetails.destSalePrice = this.selectedRowData.destSalePrice;
    itemAllotDetails.srcSalePrice = this.srcItemDet.itemMaster.salePrice;

    if (!this.lotItemByFromLotItemId.valid) {
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = false;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Please Select Source Item!';
    } else if (this.availableCarats.value <= 0) {
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = false;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Available Carats is 0! Please Change Source Item, Cannot Proceed with this Item!';
    } else if (this.orgAvgRate.value <= 0) {
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = false;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Available Rate is 0! Please Update Rate in Item Rate Updation Screen!';
    } else if (this.carats.value == null || this.carats.value <= 0) {
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = false;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Carats should be greater than 0 !';
    } else if (this.avgRate.value == null || this.avgRate.value <= 0) {
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = false;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Rate should be greater than 0 !';
    } else if (this.carats.value > this.availableCarats.value) {
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = false;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Cannot Allot Carats more than ' + this.availableCarats.value + ' Carats!';
    } else if ((this.availableCarats.value * this.orgAvgRate.value) < (this.carats.value * this.avgRate.value)) {
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = false;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Cannot Exceed Rate more than ' + ((this.availableCarats.value * this.orgAvgRate.value) / this.carats.value);
    } else {
      itemAllotDetails.carats = parseFloat(this.carats.value.toFixed(3));
      itemAllotDetails.avgRate = parseFloat(this.avgRate.value.toFixed(3));

      const amt = this.availableCarats.value * this.orgAvgRate.value;
      const newAmt = this.carats.value * this.avgRate.value;
      this.availableCarats.setValue(parseFloat((this.availableCarats.value - this.carats.value).toFixed(3)));
      this.orgAvgRate.setValue(parseFloat(((amt - newAmt) / this.availableCarats.value).toFixed(2)));
      this.itemAllotList.push(itemAllotDetails);
      const b = this.addedItemList.findIndex(a => {
        if (a.dLotItemId == itemAllotDetails.dLotItemId) {
          return true;
        }
      });
      const amt1 = this.addedItemList[b].carats * this.addedItemList[b].avgRate;
      const amtNew1 = itemAllotDetails.carats * itemAllotDetails.avgRate;
      this.addedItemList[b].carats += parseFloat(itemAllotDetails.carats.toFixed(3));
      this.addedItemList[b].avgRate = parseFloat(((amt1 + amtNew1) / this.addedItemList[b].carats).toFixed(2));
      this.destCaratsCtrl.setValue(this.addedItemList[b].carats);
      this.destAvgRateCtrl.setValue(this.addedItemList[b].avgRate);
      this.source.load(this.addedItemList);
      this.createItemAllotmentForm.controls['carats'].reset();
      this.createItemAllotmentForm.controls['avgRate'].reset();
      // this.selectedRowData = '';                       // setting user selected row data to null
      this.calculateTransferedCaretAverageRate();
      this.totalCarets.setValue(this.totalTransferCaret);
      this.successMessage = 'Item Added to Alloted List Successfully!';
      setTimeout(() => this.successMessage = null, 3000);
    }
  }

  calculateTransferedCaretAverageRate() {
    let totalCatats = 0;
    if (this.itemAllotList.length >= 0) {
      this.itemAllotList.forEach(item => {
        item.carats = parseFloat(item.carats.toString());
        totalCatats += item.carats;
      });
      this.totalTransferCaret = parseFloat(totalCatats.toFixed(3));
    } else {
      this.totalTransferCaret = 0;
    }
  }

  onPreviewClick() {
    const activeModal = this.modalService.open(AllotmentModalOpen, { size: 'lg' });
    activeModal.componentInstance.modalHeader = 'Alloted Item Details List';
    activeModal.componentInstance.source.load(this.itemAllotList);
    activeModal.componentInstance.aList = this.itemAllotList;
    activeModal.componentInstance.emitService.subscribe((emmitedValue) => {
      this.onDelStatus(emmitedValue[0], emmitedValue[1], emmitedValue[2]);
    });
  }

  onDelStatus(deleted: boolean = false, newList: any[], deletedData: any) {
    if (deleted) {
      this.itemAllotList = newList;
      this.calculateTransferedCaretAverageRate();
      this.totalCarets.setValue(this.totalTransferCaret);
      const b = this.addedItemList.findIndex(a => {
        if (a.dLotItemId == deletedData.dLotItemId) {
          return true;
        }
      });
      const amt1 = this.addedItemList[b].carats * this.addedItemList[b].avgRate;
      const amtNew1 = deletedData.carats * deletedData.avgRate;
      this.addedItemList[b].carats -= parseFloat(deletedData.carats.toFixed(3));
      if (this.addedItemList[b].carats == 0) {
        this.addedItemList[b].avgRate = 0;
      } else {
        this.addedItemList[b].avgRate = parseFloat(((amt1 - amtNew1) / this.addedItemList[b].carats).toFixed(2));
      }

      this.destItemCtrl.reset();
      this.destSalePriceCtrl.reset();
      this.destCaratsCtrl.reset();
      this.destAvgRateCtrl.reset();
      this.destitemCodeCtrl.reset();

      this.source.load(this.addedItemList);
      this.onChangeSItem(this.lotItemByFromLotItemId.value);
    }
  }

  finally() {
    this.isLoading = false;
    this.createItemAllotmentForm.markAsPristine();
  }

  handleBack(cancelling: boolean = false) {
    // TODO: if cancelling then ask to confirn

    if (this.itemAllotmentIdParam) {
      this.router.navigate(['../../itemAllotment'], { relativeTo: this.route });
    } else {
      this.router.navigate(['../itemAllotment'], { relativeTo: this.route });
    }
  }

  // initParameter() {
  //     // initialize parameter
  //     return this.fb.group({
  //        parameterType: [''],
  //        paramValId: ['']
  //     });
  // }

  //  addParameter() {
  //       // add parameter to the list
  //       const control = <FormArray>this.createItemAllotmentForm.controls['parameters'];
  //       control.push(this.initParameter());
  //   }

  //   removeParameter(i: number) {
  //       // remove parameter from the list
  //       const control = <FormArray>this.createItemAllotmentForm.controls['parameters'];
  //       control.removeAt(i);
  //   }

  private createForm() {
    this.createItemAllotmentForm = this.fb.group({
      'transType': ['SA'],
      'invoiceType': ['LA'],
      'lotTransId': [''],
      'category': ['', Validators.required],
      'lotMasterByFromLotId': ['', Validators.required],
      'lotMasterByToLotId': ['', Validators.required],
      'transDate': [''],
      'lotItemByFromLotItemId': ['', Validators.required],
      'lotItemByFromLotItemName': ['', Validators.required],
      'availableCarats': [''],
      'avgRate': [''],
      'item': [''],
      'carats': [''],
      'orgAvgRate': [''],
      'remarks': ['', Validators.compose([Validators.required, Validators.maxLength(255)])],
      'totalCarets': [''],
      'salePrice': [''],
      // 'parameters': this.fb.array([this.initParameter()]),
      'itemAllotList': [this.itemAllotList],

      'destItemCtrl': [''],
      'destCaratsCtrl': [''],
      'destAvgRateCtrl': [''],
      'destSalePriceCtrl': [''],
      'destitemCodeCtrl': ['']
    });

    this.category = this.createItemAllotmentForm.controls['category'];
    this.lotMasterByFromLotId = this.createItemAllotmentForm.controls['lotMasterByFromLotId'];
    this.lotMasterByToLotId = this.createItemAllotmentForm.controls['lotMasterByToLotId'];
    this.transDate = this.createItemAllotmentForm.controls['transDate'];
    this.lotItemByFromLotItemId = this.createItemAllotmentForm.controls['lotItemByFromLotItemId'];
    this.lotItemByFromLotItemName = this.createItemAllotmentForm.controls['lotItemByFromLotItemName'];
    // this.lotItemByToLotItemId = this.createItemAllotmentForm.controls['lotItemByToLotItemId'];
    this.availableCarats = this.createItemAllotmentForm.controls['availableCarats'];
    this.avgRate = this.createItemAllotmentForm.controls['avgRate'];
    this.item = this.createItemAllotmentForm.controls['item'];
    this.carats = this.createItemAllotmentForm.controls['carats'];
    this.orgAvgRate = this.createItemAllotmentForm.controls['orgAvgRate'];
    this.remarks = this.createItemAllotmentForm.controls['remarks'];
    this.totalCarets = this.createItemAllotmentForm.controls['totalCarets'];
    // this.itemParameters = this.createItemAllotmentForm.controls['parameters'];
    this.salePrice = this.createItemAllotmentForm.controls['salePrice'];

    this.destItemCtrl = this.createItemAllotmentForm.controls['destItemCtrl'];
    this.destCaratsCtrl = this.createItemAllotmentForm.controls['destCaratsCtrl'];
    this.destAvgRateCtrl = this.createItemAllotmentForm.controls['destAvgRateCtrl'];
    this.destSalePriceCtrl = this.createItemAllotmentForm.controls['destSalePriceCtrl'];
    this.destitemCodeCtrl = this.createItemAllotmentForm.controls['destitemCodeCtrl'];
  }
}

