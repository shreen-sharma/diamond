import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Rx';
import { Component, Input } from '@angular/core';
import { Logger } from 'app/core/';
import { LocalDataSource } from 'ng2-smart-table';
import { SalesOrderService } from '../../salesOrder.service';
import { CommonModalComponent } from '../../../../../../shared/common-modal/common-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DecimalPipe } from '@angular/common';
import { CurrencyService } from 'app/pages/masters/components/currency/';
import { LotItemCreationService } from 'app/pages/stockManagement/components/lotItemCreation/index';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

const log = new Logger('stockEffectSales');

@Component({
  selector: 'stock-effect-sales',
  templateUrl: './stockEffectSales.html',
  styleUrls: ['./stockEffectSales.scss']
})

export class StockEffectSales {

  //@Input('itemMasterList')
  lotItems: any [] = [];
  
    @Input('lotMasterList')
    lots: Observable<any>;

    orderItemList: any[];
    salePrice: number;
    stockItemSalePrice:number=0;
    isEdit: boolean;
    orderItems: FormArray;
    orderItem: FormGroup;
    source: LocalDataSource = new LocalDataSource();
    lotCtrl: AbstractControl;
    item: AbstractControl;
    itemDesc: AbstractControl;
    piecesCtrl: AbstractControl;
    caratsCtrl: AbstractControl;
    totSellingAmt: number = 0.00;
    rateCtrl: AbstractControl;
    amountCtrl: AbstractControl;
    profit: AbstractControl;
    orderAmount: AbstractControl;
    stockRateCtrl:AbstractControl;
    stockAmount: number = 0.00;
    currList: any[] = [];
    tAmountCtrl: AbstractControl;
    sellingAmount: number = 0.00;
    notional: number = 0.00;
    baseNotional: number = 0.00;  
    ordAmount: number = 0.00;
    currCode: string = 'USD';
    sellingPrice: AbstractControl;
    exchangeRate: AbstractControl;      // stock Exchange Rate
    orderCurrency: AbstractControl;
    settings: any;
    orderCurrencyVsStockCurrencyRate: number = 1;
    stockItemSellingPriceCtrl:AbstractControl;
    baseExchangeRate: AbstractControl;
    orderAmountBase: AbstractControl;
    public itemName: AbstractControl;

    lotItemList: any[] =[];

      search = (text$: Observable<string>) =>
      text$
        .debounceTime(200)
        .distinctUntilChanged()
        .map(term => term.length < 1 ? []
          : this.lotItems.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10));


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
  @Input() stockCurrCode;
  @Input() baseCurrCode; 
    private _parentForm: FormGroup;
    @Input('parentForm')
    set parentForm( parentForm: FormGroup) {
      debugger
      this._parentForm = parentForm;
      this.orderAmount = this._parentForm.controls['orderAmount'];
      this.profit = this._parentForm.controls['profit'];
      this.exchangeRate = this._parentForm.controls['exchangeRate']; 
      this.baseExchangeRate = this._parentForm.controls['baseExchangeRate'];
      this.orderAmountBase = this._parentForm.controls['orderAmountBase'];   
      this.baseExchangeRate.valueChanges.subscribe(exchangeRate=>{
        this.setTimeoutCalcFunc();
      });
      this.setTimeoutCalcFunc();
      this.ordAmount = this.orderAmount.value;
      this.orderCurrency = this._parentForm.controls['soCurrency'];
      this.initOderItems();
      this.exchangeRate.valueChanges.subscribe(exchangeRate=>{
        debugger
      this.orderCurrencyVsStockCurrencyRate = 1/exchangeRate;
      this.source.load(this.orderItems.value);
       
      });
      this.initOderItems();
      this.orderCurrencyVsStockCurrencyRate = 1/this.exchangeRate.value;
      this.exchangeRate.valueChanges.subscribe(exchangeRate =>{
        this.source.load(this.orderItems.value);
       
      });
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
        ac.controls['tAmount'].setValue((parseFloat(ac.value.carats) * parseFloat(ac.value.rate)).toFixed(2));
      });
      this.source.load(this.orderItems.value);
      this.orderAmount.setValue(parseFloat(((this.getTAmount * this.baseExchangeRate.value)/this.exchangeRate.value).toFixed(2)));      
      setTimeout(() => {
        this.sellingAmount = this.getTotalAmount;
        this.stockAmount = this.getTAmount;
        this.profit.setValue(this.notProfit);
        this.totSellingAmt =parseFloat((this.sellingAmount/this.totalCarats).toFixed(2));
        this.notional = this.profit.value;
        this.baseNotional = parseFloat((this.notional * this.exchangeRate.value).toFixed(2));
        this.orderAmountBase.setValue(parseFloat((this.orderAmount.value * this.exchangeRate.value).toFixed(2)));
      });
    }
  
    initOrderItem(): any {
      this.orderItem = this.fb.group({
        'lot': ['', Validators.compose([Validators.required])],
        'item': ['', Validators.compose([Validators.required])],
        'pieces': [''],
        'carats': ['', Validators.compose([Validators.required])],
        'rate': ['', Validators.compose([Validators.required])],
        'stockItemSellingPrice': ['', Validators.compose([Validators.required])],
        'amount': ['', Validators.compose([Validators.required])],
        'tAmount': [''],
        'lotCtrl': ['', Validators.compose([Validators.required])],
        'piecesCtrl': [''],
        'caratsCtrl': ['', Validators.compose([Validators.required])],
        'rateCtrl': ['', Validators.compose([Validators.required])],
        'sellingPrice': [''],
        'itemDesc': [''],
        'itemName': ['']
  
      });
  
      this.lotCtrl = this.orderItem.controls['lot'];
      this.item = this.orderItem.controls['item'];
      this.piecesCtrl = this.orderItem.controls['pieces'];
      this.caratsCtrl = this.orderItem.controls['carats'];
      this.rateCtrl = this.orderItem.controls['rate'];
      this.amountCtrl = this.orderItem.controls['amount'];
      this.sellingPrice = this.orderItem.controls['sellingPrice'];
      this.stockItemSellingPriceCtrl = this.orderItem.controls['stockItemSellingPrice'];
      this.tAmountCtrl = this.orderItem.controls['tAmount'];
      this.itemDesc = this.orderItem.controls['itemDesc'];
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
  
      this.item.valueChanges.subscribe( data => {
        if(this.itemName.value) {
            if (data) {
              if(data.itemMaster.salePrice) {
                this.salePrice = data.itemMaster.salePrice;
                this.stockItemSalePrice = data.itemMaster.salePrice;
                this.stockItemSellingPriceCtrl.setValue(data.itemMaster.salePrice);
              } else {
                this.salePrice = 0;
                this.stockItemSalePrice = 0;
                this.stockItemSellingPriceCtrl.setValue(0);
              }
            }
        }
      });


    }
  
    handleAdd() {
      debugger;
      if (this.caratsCtrl.valid && this.lotCtrl.valid && this.item.valid && this.rateCtrl.valid) {
          debugger
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
              debugger
              if(this.orderItem.value.item.lotItemId == element.item.lotItemId) {
                  flag = 1;
                  const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
                  activeModal.componentInstance.showHide = false;
                  activeModal.componentInstance.modalHeader = 'Alert';
                  activeModal.componentInstance.modalContent = 'Item already added!';
              }
              });

            if(flag == 0) {
              this.sellingPrice.setValue(this.salePrice);
              if(!this.piecesCtrl.value){
                debugger;
                this.piecesCtrl.setValue(0);
              }
              this.caratsCtrl.setValue(parseFloat(this.caratsCtrl.value.toFixed(3)));
              this.amountCtrl.setValue(parseFloat((this.orderItem.value.carats * this.orderItem.value.sellingPrice).toFixed(2)));
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
            this.sellingPrice.setValue(this.salePrice);
            if(!this.piecesCtrl.value){
              this.piecesCtrl.setValue(0);
            }
            this.caratsCtrl.setValue(parseFloat(this.caratsCtrl.value.toFixed(3)));   
            this.amountCtrl.setValue(parseFloat((this.orderItem.value.carats * this.orderItem.value.sellingPrice).toFixed(2)));
            this.tAmountCtrl.setValue(parseFloat((this.orderItem.value.carats * this.orderItem.value.rate).toFixed(2))); 
            const lotNamePop = this.lotCtrl.value;   // Populate Previous value of lot on Add       
            this.orderItems.push(this.orderItem);
            this.initOrderItem();            
            this.source.load(this.orderItems.value);
            this.lotCtrl.setValue(lotNamePop);
            this.piecesCtrl.setValue(0);
            this.setTimeoutCalcFunc();
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
      this.lotItemService.getLotItemCreationById(event.data.item.lotItemId).subscribe( data => {
        const availCarats = data.totalCarets;
        if(event.newData.carats <= 0 || event.newData.rate <= 0) {
          const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
          activeModal.componentInstance.showHide = false;
          activeModal.componentInstance.modalHeader = 'Alert';
          activeModal.componentInstance.modalContent = 'Carats and Rate should be greater than 0!';
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
            debugger;
            if(avc.value.item.lotItemId == event.data.item.lotItemId) {
             const ac = <any>this.orderItems.controls[index];
             ac.controls['carats'].setValue((parseFloat(event.newData.carats)).toFixed(2));
             ac.controls['rate'].setValue((parseFloat(event.newData.rate)).toFixed(2));
             ac.controls['amount'].setValue((parseFloat(event.newData.carats) * parseFloat(event.newData.sellingPrice)).toFixed(2));
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
  
    updateItemInOrderItems(newData: any){
  
      //this.orderItem = newData;
      this.orderItems.value.push(newData);
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
          perPage: 5,
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
              } else {
                return value.itemMaster.itemName;
              }              
            }
          },
          itemDesc: {
            title: 'Description',
            type: 'text',
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
            type: 'text',
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
            editable: true,
          },
          tAmount: {
            title: 'Total Amount',
            type: 'text',
            editable: false,
          },
        }
      };
    }
  
    constructor(private fb: FormBuilder,
      private modalService: NgbModal,
      private currencyService: CurrencyService,
      private lotItemService: LotItemCreationService,
       private saleService: SalesOrderService) {
      this.orderItems = fb.array([]);
      this.initOrderItem();
      this.settings = this.prepareTableSettings();
      this.source.load(this.orderItems.value);
      // this.saleService.getAllLotItems().subscribe(data =>{
      //   this.lotItems = data;
      // });
      this.currencyService.getAllCurrencies().subscribe((currList) => {
        this.currList = currList;
      });
    };
  
    get getTotalAmount(): number {
      return parseFloat((this.getColTotal('amount')).toFixed(2));
    }
    get getTAmount(): number {
      return parseFloat((this.getColTotal('tAmount')).toFixed(2));
    }
    get avgRate(): number {
    const totRate =  parseFloat((this.getColTotal('tAmount')).toFixed(2));
    return parseFloat((((totRate/ this.totalCarats)*this.baseExchangeRate.value)/this.exchangeRate.value).toFixed(2));
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
        return parseFloat((((this.getTAmount*this.baseExchangeRate.value)/this.exchangeRate.value) - this.sellingAmount).toFixed(2));
      }
    }
  
  }