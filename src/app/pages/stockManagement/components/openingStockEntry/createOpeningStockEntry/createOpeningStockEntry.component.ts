import { LotItemCreationService } from '../../lotItemCreation/index';
import { Location } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, AbstractControl, FormBuilder, Validators, FormArray} from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { Observable } from 'rxjs/Observable';
import { AuthenticationService } from '../../../../../core/authentication/authentication.service';
import { Logger } from '../../../../../core/logger.service';
import { OpeningStockEntrys, OpeningStockEntryService } from '../openingStockEntry.service';
import { CategoryService } from '.../../app/pages/masters/components/categories/category.service';
import { LotService } from '../../lots/lot.service';
import { ItemDetailsService } from '.../../app/pages/masters/components/itemDetails/itemDetails.service';
import { DefaultModal } from './default-modal/default-modal.component';

const log = new Logger('createOpeningStockEntry');
class AddLotItemDetails {
  // lot item id
  lotItemId: number;
  itemName: string;
  lotId: number;
  lotName: string;
  carats: number;
  rate: number;
}

class OpenStockItemDetails {
  osId: number;
  amount: number;
  avgRate: number;
  catId: number;
  totalCarats: number;
  completed: string;
  stockEntries: AddLotItemDetails[] = [];
}

@Component({
  selector: 'create-OpeningStockEntry',
  templateUrl: './createOpeningStockEntry.html',
  styleUrls: ['./createOpeningStockEntry.scss']
})

export class CreateOpeningStockEntry implements OnInit {

  openingStockEntryIdParam: string;
  editCatId: number;
  editLotItemId: number;
  pageTitle = 'Create Opening Stock Entry';
  accessList: any[] = [];
  upDateAccess: boolean = false;
  error: string = null;
  isLoading = false;
  createOpeningStockEntryForm: FormGroup = {} as FormGroup;
  //categoryMaster: FormGroup;
  lotTransactionRequestDTO: FormGroup;

  lotList: any[] = [];
  catList: any[] = [];
   itemDList: any[] = [];
  itemCatList: any[] = [];
  itemDLotList: any[] = [];
  checked: any[] = [];
  caratStatus: boolean;
  itemStatus: boolean;
  submitStatus: boolean;
  status: string
  itemId: number;
  itemName: string;
  grossAmount: number = 0;
  avgPriceRate = 0;
  totalAddedCarats = 0;
  selectedCategory: any;
  isFormDisabled: boolean;
  // push data into addedLotItemList
  addedLotItemList: AddLotItemDetails[] = []
  settings: any;
  isViewMode: boolean;
  public transType: AbstractControl;
  public catId: AbstractControl;
  public totalCarats: AbstractControl;
  public avgRate: AbstractControl;
  public amount: AbstractControl;
  public lotMasterByToLotId: AbstractControl;
  public lotItemByToLotItemId: AbstractControl;
  public carats: AbstractControl;
  public rate: AbstractControl;
  // public totalAddedCarats: AbstractControl;
  public lotItemDetail: AbstractControl;
  public completed: AbstractControl;
  


  constructor(private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private service: OpeningStockEntryService,
    private lotService: LotService,
    private catService: CategoryService,
    private itemService: ItemDetailsService,
    private lotItemService: LotItemCreationService,
    private modalService: NgbModal,
    private location: Location,
    private authService: AuthenticationService) {
      this.accessList = this.authService.getUserAccessOfMenu('openingStockEntry');
      this.upDateAccess = this.accessList.includes("UPDATE");
      this.upDateAccess = this.accessList.includes("ADD");

     this.createForm();
      this.submitStatus = false;

      this.catService.getData().subscribe((catList) => {
        debugger
        this.catList = catList;
      });
      this.lotService.getData().subscribe(lotList => {
        debugger
        this.lotList = lotList;
      })
    //}


  }

 
  ngOnInit() {
   
    this.route.params.subscribe((params: Params) => {
      this.openingStockEntryIdParam = params['osId'];
      if (this.openingStockEntryIdParam) {
        this.pageTitle = 'Edit Opening Stock Entry';

        this.service.getOpeningStockEntryById(this.openingStockEntryIdParam).subscribe(openStockData => {
          this.createOpeningStockEntryForm.patchValue(openStockData);
          this.selectedCategory = openStockData.categoryMaster.catId;
          if(openStockData && openStockData.completed == 'Y'){
            this.isViewMode = true;
          }else {
            this.isViewMode = false;
          }
          debugger;
          this.editCatId = openStockData.categoryMaster.catId;
          openStockData.stockEntries.forEach(element => {
            debugger
            this.editLotItemId = element.lotItemId;
          });
          // this.catId.disable();
           if (openStockData.stockEntries) {
             this.addedLotItemList = openStockData.stockEntries;
             this.calculateAddedCaratsAvgRateAndGrossAmount(this.addedLotItemList);
             //this.calculateTotalAddedCarats(this.addedLotItemList);
             if (this.addedLotItemList) {
              this.settings = this.prepareSetting();
             }
             this.source.load(this.addedLotItemList);
          }
          this.markAllTouched(this.createOpeningStockEntryForm);
          this.createOpeningStockEntryForm.get('lotTransactionRequestDTO.lotMasterByToLotId').markAsUntouched();
          this.createOpeningStockEntryForm.get('lotTransactionRequestDTO.lotItemByToLotItemId').markAsUntouched();
          this.createOpeningStockEntryForm.get('lotTransactionRequestDTO.carats').markAsUntouched();
          this.createOpeningStockEntryForm.get('lotTransactionRequestDTO.rate').markAsUntouched();
          this.createOpeningStockEntryForm.patchValue(openStockData);
        })
      }
    });
  }

  // for smart table showing added Lot items
  prepareSetting() {
    return {
      hideSubHeader: 'true',
      actions: {
        position: 'right',
        // edit: !this.isViewMode,
        // delete: !this.isViewMode
        add: this.accessList.includes("ADD"),
        edit: this.accessList.includes("GET"),
        delete: this.accessList.includes("DELETE"),
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
      columns: {
        lotName: {
          editable: false,
          title: 'Lot Name',
        },
        itemName: {
          editable: false,
          title: 'Item Name',
        },
        carats: {
          title: 'Carat',
        },
        rate: {
          title: 'Rate',
        }
      }
    };
  }


  source: LocalDataSource = new LocalDataSource();

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
   debugger;
   
    if (this.createOpeningStockEntryForm.valid) {
    this.isLoading = true;
    const openStockData = new OpenStockItemDetails();
    const formValue: any = this.createOpeningStockEntryForm.value;
    openStockData.amount = formValue.amount;
    openStockData.avgRate = formValue.avgRate;
    openStockData.totalCarats = formValue.totalCarats;
    openStockData.osId = formValue.osId;
    openStockData.catId = formValue.catId;
    openStockData.completed = this.completed.value;
    openStockData.stockEntries = this.addedLotItemList;

    if (this.openingStockEntryIdParam) {
      this.service.updateOpeningStockEntry(openStockData)
        .subscribe(openingStockEntry => {
          this.handleBack();
          this.finally();
        }, error => {
          log.debug(`Creation error: ${error}`);
          this.error = error;
          this.finally();
        });
    } else {
      this.service.createOpeningStockEntry(openStockData)
        .subscribe(openingstockEntry => {
          this.handleBack();
          this.finally();
        }, error => {
          log.debug(`Creation error: ${error}`);
          this.error = error;
          this.finally();
          });
    }
  }
  }

 
  onChangeCat(catId: any): void {
    debugger;
    if (this.addedLotItemList.length > 0) {
      this.service.toggle = true;
      const activeModal = this.modalService.open(DefaultModal, { size: 'sm' });
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Your all previous added item info will be removed from view.';
      activeModal.result.then ((res) => {
        // console.log(res == 'Y');
        if (res == 'Y') {
        // const selcat = catId;
        this.selectedCategory = catId;
        this.createOpeningStockEntryForm.reset();
        this.createOpeningStockEntryForm.get('catId').setValue(this.selectedCategory);
        // this.selectedCategory = selcat;
        this.itemDList = [];
        this.addedLotItemList = [];
        this.totalAddedCarats = 0;
        } else if (res == 'N') {
          this.createOpeningStockEntryForm.get('catId').setValue(this.selectedCategory);
        }
      });
    } else {
      this.selectedCategory = this.catId.value;
      this.itemDList = [];
      this.reset();
    }
    this.createOpeningStockEntryForm.get('catId').setValue(this.selectedCategory);
  }
reset() {
  this.lotMasterByToLotId.reset();
  this.lotItemByToLotItemId.reset();
  this.carats.reset();
  this.rate.reset();
}

  onChangeDLot(lotId: any): void {

    this.lotItemService.getAvailableLotItemsForStockEntryByLotId(lotId).subscribe(itemDLotList => {
      this.itemDLotList = itemDLotList;
      this.itemDList = [];
      itemDLotList.forEach(lotItem => {
        if (lotItem.itemCategoryId == this.selectedCategory) {
          const itemId_lotItemId = lotItem.lotItemId + '_' + lotItem.itemId;
          this.itemDList.push({ value: itemId_lotItemId, title: lotItem.itemName });
        }

      });
      this.carats.setValue('');
      this.rate.setValue('');
    });
  }

  getLotName(lotId: any): string {
    let lotName = "";
    this.lotList.forEach(lot => {
      if (lot.lotId == lotId) {
        lotName = lot.lotName;
      }
    });
    return lotName;
  }

  getItemName(lotItemId: any): string {
    let itemName = lotItemId;
    this.itemDList.forEach(lotItem => {
      if (lotItem.value === lotItemId) {
        itemName = lotItem.title;
      }
    });
    return itemName;
  }

   // give proper name to a function
  addItem() {
    debugger
  if(this.carats.value && this.rate.value && this.lotItemByToLotItemId.value && this.lotMasterByToLotId.value){

      // initialiaze instance of AddLotItemDetails.
      const lotItemDetails = new AddLotItemDetails();
      lotItemDetails.lotId = this.lotMasterByToLotId.value;
      lotItemDetails.lotName = this.getLotName(lotItemDetails.lotId);
      lotItemDetails.lotItemId = this.lotItemByToLotItemId.value;
      lotItemDetails.itemName = this.getItemName(lotItemDetails.lotItemId);
      lotItemDetails.carats = this.carats.value;
      lotItemDetails.rate = this.rate.value;

      // Added check if this item already contains in AddedItemList
      if (this.addedLotItemList.find(lotItem => lotItemDetails.lotItemId === lotItem.lotItemId)) {
        this.service.toggle = false;
        const activeModal = this.modalService.open(DefaultModal, { size: 'sm' });
        activeModal.componentInstance.modalContent = 'You can not add duplicate item into stock with same lot.';
      } else {
        this.addedLotItemList.push(lotItemDetails);
        this.calculateAddedCaratsAvgRateAndGrossAmount(this.addedLotItemList);

        this.source.load(this.addedLotItemList);
        this.settings = this.prepareSetting();
        // reset UI - input box.
        this.resetItemAddView();
      }
    } else {
      this.service.toggle = false;
      const activeModal = this.modalService.open(DefaultModal, { size: 'sm' });
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'All Fields are required.';
    }
 // }
  }



  getModalHeader(): any {
    const activeModal = this.modalService.open(DefaultModal, { size: 'sm' });
    return activeModal;
    // const activeModal2 = this.modalService.open(DefaultModal, {size: 'sm'});
    // return activeModal2;
  }
  getModalContent(): any {
    const activeModal = this.modalService.open(DefaultModal, { size: 'sm' });
    return activeModal;
  }

  calculateTotalAddedCarats(addedLotItemList: any): any {
    this.totalAddedCarats = 0;
    addedLotItemList.forEach(addedItem => {
      this.totalAddedCarats += addedItem.carats;
    });
  }

  // function for calculating average rate, total added carats and gross amount.
  calculateAddedCaratsAvgRateAndGrossAmount(addedLotItemList: any): any {
    // let totalCarats = 0;
    let rates = 0;
    this.totalAddedCarats = 0;
    this.grossAmount = 0;
    addedLotItemList.forEach(lotItem => {
      const carats = parseFloat(lotItem.carats);
      const rates = parseFloat(lotItem.rate);
      let totalAmount = carats * rates;
      this.totalAddedCarats += carats;
      this.grossAmount += totalAmount;
    });
    this.avgPriceRate = this.grossAmount / this.totalAddedCarats;
    this.avgRate.setValue(this.avgPriceRate.toFixed(2));
    this.amount.setValue(this.grossAmount);
     this.totalCarats.setValue(this.totalAddedCarats);
    // if (this.totalAddedCarats === this.totalCarats.value) {
    //   this.submitStatus = true;
    // } else {
    //   this.submitStatus = false;
    // }

  }

  onCreateConfirm(event: any): void {
    debugger

    if(event.newData.carats && event.newData.rate){

      // const caratDiff = event.newData.carats - event.data.carats;
    // if (this.totalAddedCarats +  caratDiff > this.totalCarats.value) {
    //   this.service.toggle = false;
    //   const activeModal = this.modalService.open(DefaultModal, { size: 'sm' });
    //   activeModal.componentInstance.modalHeader = 'Alert';
    //   activeModal.componentInstance.modalContent = 'You can not add more carats than total carats.';
    // }else {
      const data: any = event.newData;
      this.updateItemInAddedItemList(data);

    //}
  }else {
      this.service.toggle = false;
      const activeModal = this.modalService.open(DefaultModal, { size: 'sm' });
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'All Fields are required.';
    }

  }

  onDeleteConfirm(event: any): void {
    if (event.data) {
      this.service.toggle = true;
      const activeModal = this.modalService.open(DefaultModal, { size: 'sm' });
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Are you sure you want to delete?';
      activeModal.result.then ((res) => {

        if (res == 'Y') {
          this.deleteItemFromAddedItemList(event.data);
          event.confirm.resolve();
        } else {
          event.confirm.reject();
        }
      });
    } else {
      event.confirm.reject();
     
    }
  }

  deleteItemFromAddedItemList(itemData: any) {
    debugger;
    const itemIndex = this.addedLotItemList.findIndex(lotItem => {
      if (lotItem.lotItemId == itemData.lotItemId && lotItem.lotId == itemData.lotId) {
        return true;
      }
    })

    if (itemIndex >= 0) {
      this.addedLotItemList.splice(itemIndex, 1);
      this.calculateAddedCaratsAvgRateAndGrossAmount(this.addedLotItemList);
    }
    this.source.load(this.addedLotItemList);
  }

  getItem(itemData: any ) :any {
    let foundItem;
    const itemIndex = this.addedLotItemList.forEach(lotItem => {
      if (lotItem.lotItemId == itemData.lotItemId && lotItem.lotId == itemData.lotId) {
          return lotItem;
      }
    })
  }

  updateItemInAddedItemList(itemData: any) {
    const itemIndex = this.addedLotItemList.findIndex(lotItem => {
      if (lotItem.lotItemId == itemData.lotItemId && lotItem.lotId == itemData.lotId) {
        return true;
      }
    })

    if (itemIndex >= 0) {
      this.addedLotItemList.splice(itemIndex, 1);
      this.addedLotItemList.push(itemData);
      this.calculateAddedCaratsAvgRateAndGrossAmount(this.addedLotItemList);
    }
    this.source.load(this.addedLotItemList);

  }

  // reset ui after adding items in stock
  resetItemAddView() {
    this.carats.setValue('');
    this.rate.setValue('');
    this.lotItemByToLotItemId.reset();
    this.lotMasterByToLotId.reset();
    this.itemDList = [];
  }

 
  finally() {
    this.isLoading = false;
    this.createOpeningStockEntryForm.markAsPristine();
  }


  handleBack(cancelling: boolean = false) {
    // TODO: if cancelling then ask to confirn

     if (this.openingStockEntryIdParam) {
       this.router.navigate(['../../openingStockEntry'], { relativeTo: this.route });
     } else {
       this.router.navigate(['../openingStockEntry'], { relativeTo: this.route });
     }
  }

  private createForm() {
    this.createOpeningStockEntryForm = this.fb.group({
      'osId': [''],
       'catId': ['', Validators.compose([Validators.required])],
       'totalCarats': [''],
      'avgRate': ['', Validators.compose([Validators.required])],
      'amount': ['', Validators.compose([Validators.required])],
      'completed': [''],
      'lotTransactionRequestDTO': this.fb.group({
        'transType': ['OS'],
        'lotMasterByToLotId': [''],
        'lotItemByToLotItemId': [''],
        'carats': [''],
        'rate': [''],
        'lotItemDetail': [''],
      }),
    });

    this.catId = this.createOpeningStockEntryForm.get('catId');
    // this.catId = this.createOpeningStockEntryForm.controls['catId'];
    this.totalCarats = this.createOpeningStockEntryForm.controls['totalCarats'];
    this.avgRate = this.createOpeningStockEntryForm.controls['avgRate'];
    this.amount = this.createOpeningStockEntryForm.controls['amount'];
    this.completed = this.createOpeningStockEntryForm.controls['completed'];

    this.lotMasterByToLotId = this.createOpeningStockEntryForm.get('lotTransactionRequestDTO.lotMasterByToLotId');
    this.lotItemByToLotItemId = this.createOpeningStockEntryForm.get('lotTransactionRequestDTO.lotItemByToLotItemId');
    this.carats = this.createOpeningStockEntryForm.get('lotTransactionRequestDTO.carats');
    this.rate = this.createOpeningStockEntryForm.get('lotTransactionRequestDTO.rate');
    // this.totalAddedCarats = this.createOpeningStockEntryForm.get('lotTransactionRequestDTO.totalAddedCarats');
    this.lotItemDetail = this.createOpeningStockEntryForm.get('lotTransactionRequestDTO.lotItemDetail');


  }

}
