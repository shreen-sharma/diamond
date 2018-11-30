import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Rx';
import { Component, Input } from '@angular/core';
import { Logger } from 'app/core/';
import { LocalDataSource } from 'ng2-smart-table';
import { PurchaseOrderService } from '../../';
import { CommonModalComponent } from '../../../../../../shared/common-modal/common-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DecimalPipe } from '@angular/common';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { LotItemCreationService } from 'app/pages/stockManagement/components/lotItemCreation/index';

const log = new Logger('stockEffect');

@Component({
  selector: 'stock-effect',
  templateUrl: './stockEffect.html',
  styleUrls: ['./stockEffect.scss']
})

export class StockEffect {

  //@Input('itemMasterList')
  lotItems: any [] = [];

  @Input('lotMasterList')
  lots: Observable<any>;

  /* @Input()
  set data(orderItem: any) {
    if (orderItem.poId) {
      this.isEdit = true;
    }
   this.orderItem.patchValue(orderItem);
  } */
  orderItemList: any[];
  stockItemSalePrice:number=0;
  isEdit: boolean;
  orderItems: FormArray;
  orderItem: FormGroup;
  source: LocalDataSource = new LocalDataSource();

  lotCtrl: AbstractControl;
  item: AbstractControl;
  descCtrl: AbstractControl;
  piecesCtrl: AbstractControl;
  caratsCtrl: AbstractControl;
  rateCtrl: AbstractControl;
  amountCtrl: AbstractControl;
  profit: AbstractControl;
  orderAmount: AbstractControl;
  orderAmountBase: any;
  stockRateCtrl:AbstractControl;
  stockAmount: number = 0.00;
  sellingAmount: number = 0.00;
  notional: number = 0.00;
  baseNotional: number = 0.00;  
  ordAmount: number = 0.00;
  currCode: string = 'USD';
  totCarats: number;
  tAmountCtrl: AbstractControl;
  wtAvgRate: AbstractControl;
  sellingPrice: AbstractControl;
  purchOrderItem: any[] = [];
  purchaseOrderItems: AbstractControl;
  exchangeRate: AbstractControl;      // stock Exchange Rate
  orderCurrency: AbstractControl;
  settings: any;
  totSellingAmt: number = 0.00;
  stockItemSellingPriceCtrl:AbstractControl;
  baseExchangeRate: AbstractControl;
  public itemName: AbstractControl;

  lotItemList: any[] =[];

    search = (text$: Observable<string>) =>
    text$
      .debounceTime(200)
      .distinctUntilChanged()
      .map(term => term.length < 1 ? []
        : this.lotItems.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10));


  @Input('stockCurrencyCode') stockCurrencyCode: string;
  
  @Input('baseCurrencyCode') baseCurrencyCode: string;
  
  @Input('poCurrencyCode') poCurrencyCode: string;
  
  @Input('isViewMode')
  isViewMode: boolean;

  @Input('data')
  set data(data: any[]) {
    if(!data) {
      return;
    }
    debugger;
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
        this.settings = this.prepareTableSettings();
      }
    });
  }

  private _parentForm: FormGroup;
  @Input('parentForm')
  set parentForm( parentForm: FormGroup) {
    debugger
    this._parentForm = parentForm;
    this.orderAmount = this._parentForm.controls['orderAmount'];
    this.wtAvgRate = this._parentForm.controls['wtAvgRate'];
    this.profit = this._parentForm.controls['profit'];
    this.exchangeRate = this._parentForm.controls['exchangeRate']; 
    this.baseExchangeRate = this._parentForm.controls['baseExchangeRate'];  
    this.baseExchangeRate.valueChanges.subscribe(exchangeRate=>{
      this.setTimeoutCalcFunc();
    });
    this.setTimeoutCalcFunc();
    this.ordAmount = this.orderAmount.value;
    this.orderCurrency = this._parentForm.controls['poCurrency'];
    this.purchaseOrderItems = this._parentForm.controls['purchaseOrderItems'];
    this.purchOrderItem = this.purchaseOrderItems.value;
    this.source.load(this.orderItems.value);
  }

  private _categoryId: string;

  @Input('categoryId')
  set category(categoryId: string) {
    if(this._categoryId && this._categoryId != categoryId) {
      this.initOrderItem();
      const len = this.orderItems.value.length
      for(let i = 0; i < len; i++) {
        this.orderItems.removeAt(0);
      }
      this.source.load(this.orderItems.value);
      this._categoryId = categoryId;
     } else {
       this._categoryId = categoryId;
    }
  }
  get category(): string {
    return this._categoryId;
  }

  setTimeoutCalcFunc() {
    this.initOderItems();
    this.orderItems.controls.forEach(element => {
      const ac = <any>element;
      ac.controls['rate'].setValue(this.wtAvgRate.value);
      ac.controls['tAmount'].setValue((parseFloat(ac.value.carats) * parseFloat(ac.value.rate)).toFixed(2));
    });
    this.source.load(this.orderItems.value);
    setTimeout(() => {
      this.totCarats = this.totalCarats;
      this.sellingAmount = this.getTotalAmount;
      this.stockAmount = this.getTAmount;
      this.totSellingAmt = parseFloat((this.sellingAmount/this.totalCarats).toFixed(2));
      this.profit.setValue(this.notProfit);
      this.notional = this.profit.value;
      this.baseNotional = parseFloat((this.notional * this.exchangeRate.value).toFixed(2));
      this.orderAmountBase = parseFloat((this.ordAmount * this.baseExchangeRate.value).toFixed(2));
    });
  }

  initOrderItem(): any {
    this.orderItem = this.fb.group({
      'lot': ['', Validators.compose([Validators.required])] /* this.fb.group({
        'lotId': [''],
        'lotName':['']
      }) */,
      'item': ['', Validators.compose([Validators.required])] /* this.fb.group({
        'itemId': [''],
        'itemName': ['']
      }) */,
      'itemDesc': ['', Validators.compose([Validators.required])],
      'pieces': [''],
      'carats': ['', Validators.compose([Validators.required])],
      'rate': ['', Validators.compose([Validators.required])],
      'stockItemSellingPrice': ['', Validators.compose([Validators.required])],
      'amount': ['', Validators.compose([Validators.required])],
      'tAmount': [''],
      'lotCtrl': ['', Validators.compose([Validators.required])],
      'piecesCtrl': [''],
      'caratsCtrl': ['', Validators.compose([Validators.required, Validators.minLength(0)])],
      'rateCtrl': ['', Validators.compose([Validators.required, Validators.minLength(0)])],
      'sellingPrice': [''],
      'itemName': [''],

    });

    this.lotCtrl = this.orderItem.controls['lot'];
    this.item = this.orderItem.controls['item'];
    this.descCtrl = this.orderItem.controls['itemDesc'];
    this.piecesCtrl = this.orderItem.controls['pieces'];
    this.caratsCtrl = this.orderItem.controls['carats'];
    this.rateCtrl = this.orderItem.controls['rate'];
    this.amountCtrl = this.orderItem.controls['amount'];
    this.tAmountCtrl = this.orderItem.controls['tAmount'];
    this.sellingPrice = this.orderItem.controls['sellingPrice'];
    this.stockItemSellingPriceCtrl = this.orderItem.controls['stockItemSellingPrice'];
    this.itemName = this.orderItem.controls['itemName'];
    // this.lotCtrl.valueChanges.subscribe( data => {
      // this.item.reset();
    // });
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
    if (this.caratsCtrl.valid && this.lotCtrl.valid && this.item.valid) {
        debugger
        if(this.caratsCtrl.value <= 0) {
          const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
          activeModal.componentInstance.showHide = false;
          activeModal.componentInstance.modalHeader = 'Alert';
          activeModal.componentInstance.modalContent = 'Carats should be greater than 0!';
        } else if(this.orderItems.value.length > 0) {
          let flag = 0;
         this.orderItems.value.forEach(element => {
           debugger
           if(this.orderItem.value.item.lotItemId == element.item.lotItemId){
              flag= 1;
              const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
              activeModal.componentInstance.showHide = false;
              activeModal.componentInstance.modalHeader = 'Alert';
              activeModal.componentInstance.modalContent = 'Item already added!';
           }
         });
         if(flag==0){
          this.validAdd();
         }
        } else{
          this.validAdd();
       }
       
    }
  }

  validAdd() {
    
    if(!this.piecesCtrl.value){
     this.piecesCtrl.setValue(0);
    }
    this.stockItemSalePrice = this.item.value.itemMaster.salePrice;
    this.sellingPrice.setValue(this.item.value.itemMaster.salePrice);
    this.stockItemSellingPriceCtrl.setValue(this.item.value.itemMaster.salePrice);

    this.caratsCtrl.setValue(parseFloat(this.caratsCtrl.value.toFixed(3)));
    this.amountCtrl.setValue(parseFloat((this.orderItem.value.carats * this.orderItem.value.sellingPrice).toFixed(2)));
    this.rateCtrl.setValue(this.wtAvgRate.value);
    this.tAmountCtrl.setValue(parseFloat((this.orderItem.value.carats * this.rateCtrl.value).toFixed(2)));
    const lotNamePop = this.lotCtrl.value;
    const descPop = this.descCtrl.value; 
     this.orderItems.push(this.orderItem);
     this.source.load(this.orderItems.value);
     this.initOrderItem();
     this.setTimeoutCalcFunc();
     this.lotCtrl.setValue(lotNamePop);
     this.descCtrl.setValue(descPop);
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
    if(event.newData.carats <= 0) {
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = false;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Carats should be greater than 0!';
      event.confirm.reject();
    } else {
      let index = 0;
      this.orderItems.controls.forEach(element => {
        const avc = <any>element;
        if(avc.value.item.lotItemId == event.newData.item.lotItemId) {
         const ac = <any>this.orderItems.controls[index];
         ac.controls['carats'].setValue((parseFloat(event.newData.carats)).toFixed(2));
         ac.controls['amount'].setValue((parseFloat(event.newData.carats) * parseFloat(event.newData.sellingPrice)).toFixed(2));
         ac.controls['tAmount'].setValue((parseFloat(event.newData.carats) * parseFloat(event.newData.rate)).toFixed(2));
         this.initOrderItem();
        } else {
          index++;
        }
      });
      this.source.load(this.orderItems.value)
      console.log(this.orderItems.value);
      this.setTimeoutCalcFunc();      
    }
  }

  // findIndex(newLotItem:any, list: any[]): number{
  //   if(list && list.length){
  //     let index: number = 0;
  //    for(let listItem of list){
  //      if(listItem.item.lotItemId == newLotItem.item.lotItemId){
  //        return index;
  //      }
  //      index++;
  //    }
  //   }
  //  return;
  // }
 
  onDeleteConfirm(event: any): void {
    const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
    activeModal.componentInstance.showHide = true;
    activeModal.componentInstance.modalHeader = 'Alert';
    activeModal.componentInstance.modalContent = 'Are you sure you want to delete?';
    activeModal.result.then ((res) => {
      if (res == 'Y') {
        let index = 0;
        this.orderItems.value.forEach(element => {
          if (element.item.lotItemId == event.data.item.lotItemId) {
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

  prepareTableSettings() {
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
        lot: {
          title: 'Lot Name',
          type: 'text',
          editable: false,
          valuePrepareFunction: value => {
            return value.lotName;
          }
        },
        item: {
          title: 'Item Name',
          type: 'text',
          editable: false,
          valuePrepareFunction: value => {
            if(value.itemName){
              return value.itemName;
            }else {
              return value.itemMaster.itemName;
            }
            
          }
        },
        itemDesc: {
          title: 'Item Desc',
          type: 'text',
          filter: false,
          editable: false,
        },
        pieces: {
          title: 'Pieces',
          type: 'text',
          editable: false,
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
          valuePrepareFunction: (value, row) => {
            row.amount = parseFloat((row.carats * row.sellingPrice).toFixed(2));
            return row.amount;
          }
        },
        rate: {
          title: 'Cost Price',
          type: 'text',
          editable: false,
          valuePrepareFunction: value => {
            if(this.wtAvgRate.value){
              return this.wtAvgRate.value;
            }else {
              return 0;
            }
          }
        },
        tAmount: {
          title: 'Total Amount',
          type: 'text',
          editable: false,
          valuePrepareFunction: (value, row) => {
            row.tAmount = parseFloat((row.carats * this.wtAvgRate.value).toFixed(2));
            return row.tAmount;
          }
        },
      }
    };
  }

  constructor(private fb: FormBuilder,
    private modalService: NgbModal,
    private purchService: PurchaseOrderService,
    private lotItemService: LotItemCreationService) {
    this.orderItems = fb.array([]);
    this.initOrderItem();
    this.settings = this.prepareTableSettings();
    this.source.load(this.orderItems.value);
  };

  get getTotalAmount(): number {
    return parseFloat((this.getColTotal('amount')).toFixed(2));
  }
  get getTAmount(): number {
    return parseFloat((this.getColTotal('tAmount')).toFixed(2));
  }
  
  private initOderItems() {
    if (this._parentForm.contains('orderItems')) {
      this.orderItems = this._parentForm.controls['orderItems'] as FormArray;
      debugger
      this.source.load(this.orderItems.value);
    } else {
      debugger
      this.orderItems = this.fb.array([]);
      this._parentForm.addControl('orderItems', this.orderItems);
    }

    this.initOrderItem();
  }

  get totalCarats(): number {
    return parseFloat((this.getColTotal('carats')).toFixed(3));
  }

  get notProfit(): number {
    debugger
    if(this.sellingAmount && this.getTAmount) {
      return parseFloat((this.sellingAmount - this.getTAmount).toFixed(2));
    } else if(this.sellingAmount >= 0 && this.getTAmount >= 0) {
      return parseFloat((this.sellingAmount - this.getTAmount).toFixed(2));
    }
  }

}