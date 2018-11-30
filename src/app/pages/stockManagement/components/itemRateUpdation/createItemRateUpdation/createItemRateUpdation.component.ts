import { CommonModalComponent } from '../../../../../shared/common-modal/common-modal.component';
import { LotItemCreationService } from '../../lotItemCreation/index';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';

import { AuthenticationService } from '../../../../../core/authentication/authentication.service';
import { Logger } from '../../../../../core/logger.service';
import { ItemRateUpdationService } from '../itemRateUpdation.service';
import { CategoryService } from '.../../app/pages/masters/components/categories/category.service';
import { LotService } from '../../lots/lot.service';
import { ItemDetailsService } from '.../../app/pages/masters/components/itemDetails/itemDetails.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ItemRateModalOpen } from './itemRate-modal/itemRate-modal.component';

const log = new Logger('ItemRateUpdation');

class AddItemDetails {
  lotItemId: number;
  itemId: number;
  itemName: string;
  availableCts: number;
  costPrice: number;
  availableRate: number;
  sellingPrice: number;
  revisedRate: number;
  revisedCP: number;
  revisedSP: number;
}

@Component({
  selector: 'create-itemRateUpdation',
  templateUrl: './createItemRateUpdation.html',
  styleUrls: ['./createItemRateUpdation.scss']
})
export class CreateItemRateUpdation implements OnInit  {
  itemRateUpdationIdParam: string;
  pageTitle = 'Item Rate Updation';

  error: string = null;
  isLoading = false;
  itemRateUpdationForm: FormGroup;
  source: LocalDataSource = new LocalDataSource();

  addedItemList: AddItemDetails[] = [];
  updateItemList: AddItemDetails[] = [];

  lotList: any [] = [];
  catList: any [] = [];
  itemCatList: any[] = [];
  todayDate: string;
  itemLotList: any[] = [];
  settings: any;
  successMessage: string;
  selectedCat: any;
  selectedLot: any;
  selectedRowData: any;
  accessList: any[] = [];
  upDateAccess: boolean = false;


  public category: AbstractControl;
  public lotMaster: AbstractControl;
  public revDate: AbstractControl;
  public revRate: AbstractControl;
  public selectedItem: AbstractControl;
  public costP: AbstractControl;
  public sellP: AbstractControl;
  public remarks: AbstractControl;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private service: ItemRateUpdationService,
    private modalService: NgbModal,
    private lotService: LotService,
    private catService: CategoryService,
    private itemService: ItemDetailsService,
    private lotItemService: LotItemCreationService,
    private authService: AuthenticationService) {
      
    // this.accessList = this.authService.getUserAccessOfMenu('itemRateUpdation');
    
    // this.upDateAccess = this.accessList.includes("ADD");
    // this.upDateAccess = this.accessList.includes("UPDATE");

      this.todayDate = this.today();
      this.createForm();
      this.settings = this.prepareSetting();
      this.revDate.setValue(this.todayDate);
      this.catService.getData().subscribe( (catList) => {
        this.catList = catList;
      });
  }

  ngOnInit() {
    this.settings = this.prepareSetting();
    this.route.params.subscribe((params: Params) => {
      this.itemRateUpdationIdParam = params['itemRateUpdationId'];
      if (this.itemRateUpdationIdParam) {
        this.pageTitle = 'Edit Item Rate Updation';
        // If edit is enabled, set value of --> this.selectedCat=res.catId & this.selectedLot=res.lotId
        // this.itemRateUpdationForm.patchValue(res);
      }
    });
  }

  prepareSetting() {
    return {
      actions: {
        position: 'right',
        add: false,
        edit: false,
        delete: false,
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
        display: true,
        perPage: 10,
      },
      selectMode: 'single',
      columns: {
        itemName: {
          title: 'Item Name',
        },
        availableCts: {
          title: 'Carats',
        },
        costPrice: {
          title: 'Cost Price',
        },
        sellingPrice: {
          title: 'Selling Price',
        },
        availableRate: {
          title: 'Available Avg. Rate',
        },
      }
    };
  }

  onUserRowSelect(event: any) {
    this.selectedRowData = event.data;
    this.selectedItem.setValue(this.selectedRowData.itemName);
    this.itemRateUpdationForm.controls['costP'].reset();
    this.itemRateUpdationForm.controls['sellP'].reset();
    this.itemRateUpdationForm.controls['revRate'].reset();
    this.costP.setValue(this.selectedRowData.costPrice);
    this.sellP.setValue(this.selectedRowData.sellingPrice);
  }

  onUpdate() {
    if (this.selectedRowData == '' || this.selectedRowData == null) {
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = false;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Please Select One Item to Update Rate';
    } else {
      if (this.updateItemList.length > 0) {
        const itemIndex = this.updateItemList.findIndex(item => {
          if (this.selectedRowData.lotItemId == item.lotItemId) {
            return true;
          }
        });

        if (itemIndex >= 0) {
          const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
          activeModal.componentInstance.showHide = false;
          activeModal.componentInstance.modalHeader = 'Alert';
          activeModal.componentInstance.modalContent = 'Duplicate Item Rate Updation! Please change Item!';
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
    ItemList.itemName = this.selectedRowData.itemName;
    ItemList.lotItemId = this.selectedRowData.lotItemId;
    ItemList.availableCts = this.selectedRowData.availableCts;
    ItemList.availableRate = this.selectedRowData.availableRate;
    ItemList.costPrice = this.selectedRowData.costPrice;
    ItemList.sellingPrice = this.selectedRowData.sellingPrice;

    if (this.revRate.value == null || this.revRate.value <= 0) {
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = false;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Revised Rate should be greater than 0 !';
    } else if (this.costP.value == null || this.costP.value <= 0) {
        const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
        activeModal.componentInstance.showHide = false;
        activeModal.componentInstance.modalHeader = 'Alert';
        activeModal.componentInstance.modalContent = 'Cost Price should be greater than 0 !';
    } else if (this.sellP.value == null || this.sellP.value <= 0) {
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
        activeModal.componentInstance.showHide = false;
        activeModal.componentInstance.modalHeader = 'Alert';
        activeModal.componentInstance.modalContent = 'Selling Price should be greater than 0 !';
    } else if (this.revRate.value == this.selectedRowData.availableRate && this.costP.value == this.selectedRowData.costPrice
     && this.sellP.value == this.selectedRowData.sellingPrice) {
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
        activeModal.componentInstance.showHide = false;
        activeModal.componentInstance.modalHeader = 'Alert';
        activeModal.componentInstance.modalContent = 'Please change/update some Rate/Cost Price/Selling Price!';
    } else {
      ItemList.revisedRate = parseFloat(this.revRate.value.toFixed(2));
      ItemList.revisedCP = parseFloat(this.costP.value.toFixed(2));
      ItemList.revisedSP = parseFloat(this.sellP.value.toFixed(2));

      if(this.selectedRowData.costPrice != this.costP.value || this.selectedRowData.sellingPrice != this.sellP.value) {
        const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
        activeModal.componentInstance.showHide = true;
        activeModal.componentInstance.modalHeader = 'Alert';
        activeModal.componentInstance.modalContent = 'You are about to change Cost / Selling Price of an Item that will affect the Stock!! Do you want to Proceed!!';
        activeModal.componentInstance.oKMessage = 'Yes';
        activeModal.componentInstance.cancelMessage = 'No';
        activeModal.result.then ((res) => {
          if (res == 'Y') {
            this.updateItemList.push(ItemList);
            this.itemRateUpdationForm.controls['revRate'].reset();
            this.itemRateUpdationForm.controls['costP'].reset();
            this.itemRateUpdationForm.controls['sellP'].reset();
            this.successMessage = 'Item Rate/Cost Price/ Selling Price Revised Succesfully!';
            setTimeout(() => this.successMessage = null, 3000);
          }
        });
      } else {
        this.updateItemList.push(ItemList);
        this.itemRateUpdationForm.controls['revRate'].reset();
        this.itemRateUpdationForm.controls['costP'].reset();
        this.itemRateUpdationForm.controls['sellP'].reset();
        this.successMessage = 'Item Rate/Cost Price/ Selling Price Revised Succesfully!';
        setTimeout(() => this.successMessage = null, 3000);
      }
    }
 }

  onPreviewClick() {
    const activeModal = this.modalService.open(ItemRateModalOpen, { size: 'lg' });
    activeModal.componentInstance.modalHeader = 'Revised Rate Item List';
    activeModal.componentInstance.source.load(this.updateItemList);
    activeModal.componentInstance.aList = this.updateItemList;
    activeModal.componentInstance.emitService.subscribe((emmitedValue) => {
    this.onDelStatus(emmitedValue[0], emmitedValue[1], emmitedValue[2]);
    });
  }

  onDelStatus(deleted: boolean = false, newList: any[], deletedData: any) {
    if (deleted) {
      this.updateItemList = newList;
    }
  }

  submit() {
    if (this.itemRateUpdationForm.valid) {

      if (this.updateItemList.length > 0) {
        const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
        activeModal.componentInstance.showHide = true;
        activeModal.componentInstance.modalHeader = 'Alert';
        activeModal.componentInstance.modalContent = 'You will not be able to Edit this Updation again!! Are you sure you want to Submit?';
        activeModal.componentInstance.oKMessage = 'Yes';
        activeModal.componentInstance.cancelMessage = 'No';
        activeModal.result.then ((res) => {
          if (res == 'Y') {
            this.isLoading = true;
            this.itemRateUpdationForm.controls['revisedDetails'].setValue(this.updateItemList);
            const formValue: any = this.itemRateUpdationForm.value;

            this.service.createItemRateUpdation(this.itemRateUpdationForm.value)
            .subscribe(itemRateUpdation => {
              // log.debug(`${credentials.selectedCompany} successfully logged in`);
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
      activeModal.componentInstance.modalContent = 'Please Select Some Item to Update values!';
      }
    }
  }

  today (): string {
    const today = new Date();
    const dd = today.getDate();
    const mm = today.getMonth() + 1; //January is 0!

    const yyyy = today.getFullYear();
    return (dd < 10 ? '0' + dd : dd) + '-' + (mm < 10 ? '0' + mm : mm) + '-' + yyyy;
  }

  onChangeCat(catId: any): void {
      if (this.updateItemList.length > 0) {
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = true;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Your all previous Updates on Item info will be get removed!';
      activeModal.result.then ((res) => {
        if (res == 'Y') {
          this.selectedCat = catId;
          this.itemRateUpdationForm.controls['category'].setValue(this.selectedCat);
          this.selectedRowData = '';
          this.forChangeCat(catId);
        } else if (res == 'N') {
          this.itemRateUpdationForm.controls['category'].setValue(this.selectedCat);
          this.revDate.setValue(this.todayDate);
        }
      });
    } else {
      this.selectedCat = this.category.value;
      this.forChangeCat(catId);
    }
    this.itemRateUpdationForm.controls['category'].setValue(this.selectedCat);
  }

  forChangeCat(catId: any) {
    this.lotList = []
    this.lotService.getData().subscribe( (lotList) => {
      this.lotList = lotList;
    });

    this.itemService.getAllItemsByCategoryId(catId).subscribe( (itemCatList) => {
      this.itemCatList = itemCatList;
    });

      this.itemRateUpdationForm.reset();
      this.itemRateUpdationForm.controls['category'].setValue(catId);
      this.revDate.setValue(this.todayDate);
      this.addedItemList = [];
      this.updateItemList = [];
  }

  onChangeSLot(lotId: any): void {
    if (this.updateItemList.length > 0) {
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = true;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Your all previous Updates on Items info will be get removed!';
      activeModal.result.then ((res) => {
        if (res == 'Y') {
          this.selectedLot = lotId;
          this.itemRateUpdationForm.controls['lotMaster'].setValue(this.selectedLot);
          this.selectedRowData = '';
          this.forChangeSLot(lotId);
        } else if (res == 'N') {
          this.itemRateUpdationForm.controls['lotMaster'].setValue(this.selectedLot);
        }
      });
    } else {
      this.selectedLot = this.lotMaster.value;
      this.forChangeSLot(lotId);
    }
    this.itemRateUpdationForm.controls['lotMaster'].setValue(this.selectedLot);
  }

  forChangeSLot(lotId: any): void {
    this.lotItemService.getAllLotItemByLotId(lotId).subscribe( itemLotList => {
      this.itemLotList = itemLotList;
      this.addedItemList = [];
        this.updateItemList = [];

      if (this.itemLotList.length > 0) {
        this.addedItemList = [];
        if (this.itemCatList.length > 0) {
          this.itemLotList.forEach( lotItem => {
            if (this.category.value == lotItem.itemMaster.categoryMaster.catId && lotItem.lotMaster.lotId == lotId) {
              const itemDetails = new AddItemDetails();
              itemDetails.lotItemId = lotItem.lotItemId;
              itemDetails.itemId = lotItem.itemMaster.itemId;
              itemDetails.availableRate = lotItem.avgRate;
              itemDetails.availableCts = lotItem.totalCarets;
              itemDetails.costPrice = lotItem.itemMaster.costPrice;
              itemDetails.sellingPrice = lotItem.itemMaster.salePrice;
              itemDetails.itemName = lotItem.itemMaster.itemName;
              this.addedItemList.push(itemDetails);
              this.source.load(this.addedItemList);
              this.settings = this.prepareSetting();
            }
          });
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
        activeModal.componentInstance.modalContent = 'No items in selected Lot!';
      }
    });
  }

  finally() {
      this.isLoading = false;
      this.itemRateUpdationForm.markAsPristine();
  }

  handleBack(cancelling: boolean= false) {
    // TODO: if cancelling then ask to confirn

    if (this.itemRateUpdationIdParam) {
      this.router.navigate(['../../itemRateUpdation'], {relativeTo: this.route});
    } else {
      this.router.navigate(['../itemRateUpdation'], {relativeTo: this.route});
    }
  }

  private createForm() {
    this.itemRateUpdationForm = this.fb.group({
      'revRateHisId' : [''],
      'category': ['', Validators.required],
      'revDate': [''],
      'lotMaster': ['', Validators.required],
      'remarks': ['', Validators.compose([Validators.required, Validators.maxLength(255)])],
      'revisedDetails': [this.updateItemList],

      'selectedItem': [''],
      'revRate': [''],
      'costP': [''],
      'sellP': [''],
    });

    this.category = this.itemRateUpdationForm.controls['category'];
    this.revDate = this.itemRateUpdationForm.controls['revDate'];
    this.lotMaster = this.itemRateUpdationForm.controls['lotMaster'];
    this.revRate = this.itemRateUpdationForm.controls['revRate'];
    this.selectedItem = this.itemRateUpdationForm.controls['selectedItem'];
    this.costP = this.itemRateUpdationForm.controls['costP'];
    this.sellP = this.itemRateUpdationForm.controls['sellP'];
    this.remarks = this.itemRateUpdationForm.controls['remarks'];
  }
}
