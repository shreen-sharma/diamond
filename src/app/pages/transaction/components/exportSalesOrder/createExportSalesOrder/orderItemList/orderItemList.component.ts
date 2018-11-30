import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Rx';
import { Component, Input } from '@angular/core';
import { Logger } from 'app/core/';
import { LocalDataSource } from 'ng2-smart-table';
import { ExportSalesOrderService } from '../../';
import { CommonModalComponent } from '../../../../../../shared/common-modal/common-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DecimalPipe } from '@angular/common';
import { LotItemCreationService } from 'app/pages/stockManagement/components/lotItemCreation/index';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

const log = new Logger('orderItemList');

@Component({
  selector: 'export-order-item-list',
  templateUrl: './orderItemList.html',
  styleUrls: ['./orderItemList.scss']
})

export class ExportOrderItemList {

  lotItems: any [] = [];

  @Input('lotMasterList')
  lots: Observable<any>;

  public itemName: AbstractControl;

    lotItemList: any[] =[];

      search = (text$: Observable<string>) =>
      text$
        .debounceTime(200)
        .distinctUntilChanged()
        .map(term => term.length < 1 ? []
          : this.lotItems.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10));


  orderItemList: any[];
  // catItemList: any[] = [];

  isEdit: boolean;
  orderItems: FormArray;
  orderItem: FormGroup;
  source: LocalDataSource = new LocalDataSource();
  settings: any;

  sellingAmount: number = 0.00;
  stockAmount: number = 0.00;
  notional: number = 0.00;
  baseNotional: number = 0.00;
  totSellingAmt: number = 0.00;

  lotCtrl: AbstractControl;
  item: AbstractControl;
  descCtrl: AbstractControl;
  piecesCtrl: AbstractControl;
  caratsCtrl: AbstractControl;
  rateCtrl: AbstractControl;
  amountCtrl: AbstractControl;
  stockItemSellingPriceCtrl: AbstractControl;
  tAmountCtrl: AbstractControl;

  orderAmountFC: AbstractControl;
  orderAmountSTK: AbstractControl;
  orderAmountBase: AbstractControl;
  profitSTK: AbstractControl;
  profitBase: AbstractControl;

  stockExchangeRate: AbstractControl;
  soExchangeRate: AbstractControl;

  @Input('stockCurrCode')
  stockCurrCode: string;

  @Input('baseCurrCode')
  baseCurrCode: string;

  @Input('soCurrCode')
  soCurrCode: string;

  @Input('isViewMode')
  isViewMode: boolean;


  @Input('data')
  set data(data: any[]) {
    if(!data) {
      return;
    }
    setTimeout(() => {
      if(!this.orderItems.controls.length) {
        data.forEach(element => {
          this.orderItems.push(this.orderItem);
          this.initOrderItem();
        });
        this.orderItems.patchValue(data);
        this.setTimeoutCalcFunc();
        this.initOrderItem();
        setTimeout(() => {
          this.source.load(this.orderItems.value);
        })
      }
      if (this.isViewMode) {
        this.orderItem.disable();
        this.settings = this.prepareSettings();
      }
    });
  }

  private _parentForm: FormGroup;
  @Input('parentForm')
  set parentForm( parentForm: FormGroup) {
    this._parentForm = parentForm;
    this.orderAmountFC = this._parentForm.controls['orderAmountFC'];
    this.orderAmountSTK = this._parentForm.controls['orderAmountSTK'];
    this.orderAmountBase = this._parentForm.controls['orderAmountBase'];
    this.profitSTK = this._parentForm.controls['profitSTK'];
    this.profitBase = this._parentForm.controls['profitBase'];
    this.soExchangeRate = this._parentForm.controls['soExchangeRate'];
    this.stockExchangeRate = this._parentForm.controls['stockExchangeRate'];
    this.soExchangeRate.valueChanges.subscribe( exch => {
      this.setTimeoutCalcFunc();
    });
    this.setTimeoutCalcFunc();
    this.initOderItems();
  }
  
  // private _categoryId: string;
  
  // @Input('categoryId')
  // set category(categoryId: string) {
  //   if(this._categoryId && this._categoryId != categoryId) {
  //     this.initOrderItem();
  //     const len = this.orderItems.value.length
  //     for(let i = 0; i < len; i++) {
  //       this.orderItems.removeAt(0);
  //     }
  //     this.source.load(this.orderItems.value);
  //     this._categoryId = categoryId;
  //    } else {
  //      this._categoryId = categoryId;
  //      this.initOrderItem();
  //   }
  //   if(this._categoryId) {
  //     this.itemService.getAllItemsByCategoryId(this._categoryId).subscribe( data => {
  //       this.catItemList = data;
  //       if(this.catItemList.length == 0) {
  //         const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
  //         activeModal.componentInstance.showHide = false;
  //         activeModal.componentInstance.modalHeader = 'Alert';
  //         activeModal.componentInstance.modalContent = 'No items in Category!';
  //       }
  //     });
  //   } else {
  //     const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
  //     activeModal.componentInstance.showHide = false;
  //     activeModal.componentInstance.modalHeader = 'Alert';
  //     activeModal.componentInstance.modalContent = 'Please Select Category!';
  //   }
    
  // }
  // get category(): string {
  //   return this._categoryId;
  // }
  
  setTimeoutCalcFunc() {
    this.initOderItems();
    this.orderItems.controls.forEach(element => {
      const ac = <any>element;
      ac.controls['tAmount'].setValue((parseFloat(ac.value.carats) * parseFloat(ac.value.rate)).toFixed(2));
    });
    this.source.load(this.orderItems.value);
    this.orderAmountFC.setValue(parseFloat((this.getTAmount).toFixed(2)));
    this.orderAmountSTK.setValue(parseFloat(((this.getTAmount * this.soExchangeRate.value)/this.stockExchangeRate.value).toFixed(2)));      
    setTimeout(() => {
      this.sellingAmount = this.getTotalAmount;
      this.stockAmount = this.getTAmount;
      this.totSellingAmt = parseFloat((this.sellingAmount/this.totalCarats).toFixed(2));
      this.profitSTK.setValue(this.notProfit);
      this.profitBase.setValue(parseFloat((this.notProfit * this.stockExchangeRate.value).toFixed(2)));
      this.notional = this.notProfit;
      this.baseNotional = parseFloat((this.notProfit * this.stockExchangeRate.value).toFixed(2));
      this.orderAmountBase.setValue(parseFloat((this.getTAmount * this.soExchangeRate.value).toFixed(2)));
    });
  }
  
   initOrderItem(): any {
    this.orderItem = this.fb.group({
      'lotId': ['', Validators.compose([Validators.required])],
      'itemId': ['', Validators.compose([Validators.required])],
      'description': ['', Validators.compose([Validators.required])],
      'pieces': [''],
      'carats': ['', Validators.compose([Validators.required])],
      'stockItemSellingPrice': ['', Validators.compose([Validators.required])],
      'rate': ['', Validators.compose([Validators.required])],
      'amount': ['', Validators.compose([Validators.required])],
      'tAmount': [''],
      'lotItemId': [''],

      'lotCtrl': ['', Validators.compose([Validators.required])],
      'item': ['', Validators.compose([Validators.required])],
      'piecesCtrl': [''],
      'caratsCtrl': ['', Validators.compose([Validators.required])],
      'rateCtrl': ['', Validators.compose([Validators.required])],
      'descCtrl': [''],
      'itemName': ['']

    });

    this.lotCtrl = this.orderItem.controls['lotId'];
    this.item = this.orderItem.controls['itemId'];
    this.descCtrl = this.orderItem.controls['description'];
    this.piecesCtrl = this.orderItem.controls['pieces'];
    this.caratsCtrl = this.orderItem.controls['carats'];
    this.rateCtrl = this.orderItem.controls['rate'];
    this.stockItemSellingPriceCtrl = this.orderItem.controls['stockItemSellingPrice'];
    this.amountCtrl = this.orderItem.controls['amount'];
    this.tAmountCtrl = this.orderItem.controls['tAmount'];
    this.itemName = this.orderItem.controls['itemName'];

    this.lotCtrl.valueChanges.subscribe(val =>{
      if(val) {
        this.itemName.reset();
        this.lotItems = [];
        this.lotItemService.getAllLotItemByLotId(val.lotId).subscribe(res =>{
          this.lotItemList = res;
          let i = 0;
          res.forEach(element => {
            this.lotItems[i] = element.itemMaster.itemName;
            i++;
          });
        })
      }        
    });

    this.itemName.valueChanges.subscribe(val =>{
      if(val){
        this.lotItemList.find(ele =>{
          if(ele.itemMaster.itemName == val){
            this.item.setValue(ele);
            return true;
          }
        })
      }
    })


  }

  handleAdd() {
    if (this.rateCtrl.valid && this.caratsCtrl.valid && this.lotCtrl.valid && this.item.valid) {
      if(this.caratsCtrl.value <= 0 || this.rateCtrl.value <= 0) {
        const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
        activeModal.componentInstance.showHide = false;
        activeModal.componentInstance.modalHeader = 'Alert';
        activeModal.componentInstance.modalContent = 'Carats & Rate should be greater than 0!';
      } else if(this.caratsCtrl.value > this.item.value.totalCarets) {
        const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
        activeModal.componentInstance.showHide = false;
        activeModal.componentInstance.modalHeader = 'Alert';
        activeModal.componentInstance.modalContent = 'Carats should not be greater than available carats i.e ' + this.item.value.totalCarets + ' Cts!!';
      } else if(this.orderItems.value.length > 0) {
          let flag = 0;
          this.orderItems.value.forEach(element => {
            if(this.orderItem.value.itemId.lotItemId == element.itemId.lotItemId) {
                flag = 1;
                const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
                activeModal.componentInstance.showHide = false;
                activeModal.componentInstance.modalHeader = 'Alert';
                activeModal.componentInstance.modalContent = 'Item already added!';
            }
          });

        if(flag == 0) {
          if(this.item.value.itemMaster.salePrice > 0) {
            this.stockItemSellingPriceCtrl.setValue(this.item.value.itemMaster.salePrice);
          } else {
            this.stockItemSellingPriceCtrl.setValue(0);
          }
          
          if(!this.piecesCtrl.value){
            this.piecesCtrl.setValue(0);
          }
          this.caratsCtrl.setValue(parseFloat(this.caratsCtrl.value.toFixed(3)));
          this.amountCtrl.setValue(parseFloat((this.orderItem.value.carats * this.orderItem.value.stockItemSellingPrice).toFixed(2)));
          this.tAmountCtrl.setValue(parseFloat((this.orderItem.value.carats * this.orderItem.value.rate).toFixed(2)));
          const lotNamePop = this.lotCtrl.value;   // Populate Previous value of lot on Add
          this.orderItems.push(this.orderItem);
          this.source.load(this.orderItems.value);
          this.initOrderItem();
          this.setTimeoutCalcFunc();
          this.lotCtrl.setValue(lotNamePop);
          this.piecesCtrl.setValue(0);
        }
      } else {
        if(this.item.value.itemMaster.salePrice > 0) {
          this.stockItemSellingPriceCtrl.setValue(this.item.value.itemMaster.salePrice);
        } else {
          this.stockItemSellingPriceCtrl.setValue(0);
        }
        if(!this.piecesCtrl.value){
          this.piecesCtrl.setValue(0);
        }
        this.caratsCtrl.setValue(parseFloat(this.caratsCtrl.value.toFixed(3)));
        this.amountCtrl.setValue(parseFloat((this.orderItem.value.carats * this.orderItem.value.stockItemSellingPrice).toFixed(2)));
        this.tAmountCtrl.setValue(parseFloat((this.orderItem.value.carats * this.orderItem.value.rate).toFixed(2)));
        const lotNamePop = this.lotCtrl.value;   // Populate Previous value of lot on Add       
        this.orderItems.push(this.orderItem);
        this.source.load(this.orderItems.value);
        this.initOrderItem();
        this.setTimeoutCalcFunc();
        this.lotCtrl.setValue(lotNamePop);
        this.piecesCtrl.setValue(0);
        
     }
    }
  }

  getColTotal(colName: string): number {
    let total: number;
    total = 0;
    this.orderItems.value.forEach(row => {
      total += parseFloat(row[colName]);
    });

    return parseFloat(total.toFixed(3));
  }

  onEditConfirm(event: any): void {
    this.lotItemService.getLotItemCreationById(event.data.itemId.lotItemId).subscribe( data => {
      const availCarats = data.totalCarets;
      if(event.newData.carats <= 0 || event.newData.rate <= 0) {
        const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
        activeModal.componentInstance.showHide = false;
        activeModal.componentInstance.modalHeader = 'Alert';
        activeModal.componentInstance.modalContent = 'Carats & Rate should be greater than 0!';
        event.confirm.reject();
      } else if(event.newData.carats > availCarats) {
        const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
        activeModal.componentInstance.showHide = false;
        activeModal.componentInstance.modalHeader = 'Alert';
        activeModal.componentInstance.modalContent = 'Carats should not be greater than available carats i.e ' + availCarats + ' Cts!!';
      } else {
        let index = 0;
        this.orderItems.controls.forEach(element => {
          const avc = <any>element;
          if(avc.value.itemId.lotItemId == event.data.itemId.lotItemId) {
           const ac = <any>this.orderItems.controls[index];
           ac.controls['carats'].setValue((parseFloat(event.newData.carats)).toFixed(2));
           ac.controls['rate'].setValue((parseFloat(event.newData.rate)).toFixed(2));
           ac.controls['amount'].setValue((parseFloat(event.newData.carats) * parseFloat(event.newData.stockItemSellingPrice)).toFixed(2));
           ac.controls['tAmount'].setValue((parseFloat(event.newData.carats) * parseFloat(event.newData.rate)).toFixed(2));
           this.initOrderItem();
          } else {
            index++;
          }
        });
       this.source.load(this.orderItems.value);
       this.setTimeoutCalcFunc();
      }
    });
  }

  onDeleteConfirm(event: any): void {
    const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
    activeModal.componentInstance.showHide = true;
    activeModal.componentInstance.modalHeader = 'Alert';
    activeModal.componentInstance.modalContent = 'Are you sure you want to delete?';
    activeModal.result.then ((res) => {
      if (res == 'Y') {
        let index = 0;
        this.orderItems.value.forEach(element => {
          if (element.itemId.lotItemId == event.data.itemId.lotItemId) {
            this.orderItems.removeAt(index);
            this.source.load(this.orderItems.value);
            event.confirm.resolve();
            this.setTimeoutCalcFunc();
          } else {
            index++;
          }
        });
      } else {
        event.confirm.reject();
      }
    });
  }

  prepareSettings() {
    return {
      hideSubHeader: true,
      actions: {
        position: 'right',
        add: false,
        edit: !this.isViewMode ,
        delete: !this.isViewMode,
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
        perPage: 50,
      },
      columns: {
        lotId: {
          title: 'Lot Name',
          type: 'text',
          editable: false,
          valuePrepareFunction: value => {
            return value.lotName;
          }
        },
        itemId: {
          title: 'Item Name',
          type: 'text',
          editable: false,
          valuePrepareFunction: value => {
           if(value.itemName){
            return value.itemName;
           } else {
             return value.itemMaster.itemName;
           }
          }
        },
        description: {
          title: 'Description',
          type: 'text',
          editable: false,
          valuePrepareFunction: value => {
            if(value) {
              return value;
            } else {
              return '-';
            }
            
          }
        },
        pieces: {
          title: 'Pieces',
          type: 'text',
          editable: false
        },
        carats: {
          title: 'Carats',
          type: 'text',
        },
        stockItemSellingPrice:{
          title: 'Selling Price',
          type: 'number',
          editable: false,
        },
        amount: {
          title: 'Selling Amount',
          type: 'text',
          editable: false,
        },
        rate: {
          title: 'Rate',
          type: 'text',
          editable: false
        },
        tAmount: {
          title: 'Total Amount',
          type: 'text',
          editable: false,
        }
      }
    };
  }

  constructor(private fb: FormBuilder,
     private modalService: NgbModal,
     private lotItemService: LotItemCreationService,
     private saleService: ExportSalesOrderService) {
    this.orderItems = fb.array([]);
    this.initOrderItem();
    this.settings = this.prepareSettings();
    this.source.load(this.orderItems.value);
  };

  private initOderItems() {
    if (this._parentForm.contains('orderItems')) {
      this.orderItems = this._parentForm.controls['orderItems'] as FormArray;
      this.source.load(this.orderItems.value);
    } else {
      this.orderItems = this.fb.array([]);
      this._parentForm.addControl('orderItems', this.orderItems);
    }
    this.initOrderItem();
  }

  get getTotalAmount(): number {
    return this.getColTotal('amount');
  }

  get getTAmount(): number {
    return parseFloat((this.getColTotal('tAmount')).toFixed(2));
  }

  get avgRate(): number {
    return parseFloat((((this.getTAmount/ this.totalCarats) * this.soExchangeRate.value) / this.stockExchangeRate.value).toFixed(2));
  }

  get totalCarats(): number {
    return this.getColTotal('carats');
  }

  get notProfit(): number {
    if(this.getTotalAmount && this.getTAmount) {
      return parseFloat((((this.getTAmount*this.soExchangeRate.value)/this.stockExchangeRate.value) - this.getTotalAmount).toFixed(2));
    }
  }

}
