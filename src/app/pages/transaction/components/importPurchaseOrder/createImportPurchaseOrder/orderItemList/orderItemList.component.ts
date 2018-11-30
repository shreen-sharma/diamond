import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Rx';
import { Component, Input } from '@angular/core';
import { Logger } from 'app/core/';
import { ItemDetailsService } from 'app/pages/masters/components/itemDetails/';
import { LocalDataSource } from 'ng2-smart-table';
import { ImportPurchaseOrderService } from '../../';
import { CommonModalComponent } from '../../../../../../shared/common-modal/common-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DecimalPipe } from '@angular/common';

const log = new Logger('ImportOrderItemList');

@Component({
  selector: 'import-order-item-list',
  templateUrl: './orderItemList.html',
  styleUrls: ['./orderItemList.scss']
})

export class ImportOrderItemList {

  orderItemList: any[];
  isEdit: boolean;
  purchaseOrderItems: FormArray;
  importOrderItemForm: FormGroup;
  source: LocalDataSource = new LocalDataSource();
  view: boolean;

  descCtrl: AbstractControl;
  caratsCtrl: AbstractControl;
  rateCtrl: AbstractControl;
  amountCtrl: AbstractControl;
  // stockRateCtrl: AbstractControl;

  orderAmount: AbstractControl;
  orderAmountBase: AbstractControl;
  stockExchangeRate: AbstractControl;
  wtAvgRate: AbstractControl;
  baseExchangeRate: AbstractControl;
  exchangeRate: AbstractControl;
  exchangeCurrency: AbstractControl;
  orderCurrencyVsBaseCurrencyRate = 1;
  settings: any;
  cumulitveAmount: string;
  cumulitveAmountBase: any;

  @Input('stockCurrencyCode') stockCurrencyCode: string;

  @Input('baseCurrencyCode') baseCurrencyCode: string;

  @Input('poCurrencyCode') poCurrencyCode: string;

  @Input('isViewMode')
  isViewMode: boolean;

  @Input('data')
  set data(data: any[]) {
    if (!data) {
      return;
    }
    setTimeout(() => {
      if (!this.purchaseOrderItems.controls.length) {
        data.forEach(element => {
          this.purchaseOrderItems.push(this.importOrderItemForm);
          this.initOrderItem();
        });
        this.purchaseOrderItems.patchValue(data);
        this.initOrderItem();
        setTimeout(() => {
          this.source.load(this.purchaseOrderItems.value);
          this.calculatWeightedAvgRateAndCumulativeAmount();
        })
      }
      if (this.isViewMode) {
        this.importOrderItemForm.disable();
        this.settings = this.prepareTableSettings();
      }
    });
  }

  private _parentForm: FormGroup;
  @Input('parentForm')
  set parentForm( parentForm: FormGroup) {
    this._parentForm = parentForm;
    this.orderAmount = this._parentForm.controls['orderAmount'];
    this.orderAmountBase = this._parentForm.controls['orderAmountBase'];
    this.wtAvgRate = this._parentForm.controls['wtAvgRate'];
    this.baseExchangeRate = this._parentForm.controls['baseExchangeRate'];
    this.stockExchangeRate = this._parentForm.controls['stockExchangeRate'];
    this.exchangeRate = this._parentForm.controls['exchangeRate'];
    this.exchangeCurrency = this._parentForm.controls['poCurrency'];
    this.baseExchangeRate.valueChanges.subscribe(exchangeRate => {
      this.orderCurrencyVsBaseCurrencyRate = 1 / exchangeRate;
      this.source.load(this.purchaseOrderItems.value);
      this.calculatWeightedAvgRateAndCumulativeAmount();
    });
    this.initOderItems();
    this.orderCurrencyVsBaseCurrencyRate = 1 / this.baseExchangeRate.value;
  }

   initOrderItem(): any {
    this.importOrderItemForm = this.fb.group({
      'description': ['', Validators.compose([Validators.required])],
      'carats': ['', Validators.compose([Validators.required])],
      'rate': ['', Validators.compose([Validators.required])],
      // 'stockRate': ['', Validators.compose([Validators.required])],
      'amount': [''],
      'caratsCtrl': ['', Validators.compose([Validators.required, Validators.minLength(0)])],
       'rateCtrl': [''],
      // 'stockRateCtrl': ['', Validators.compose([Validators.required, Validators.minLength(0)])],
    });

    this.descCtrl = this.importOrderItemForm.controls['description'];
    this.caratsCtrl = this.importOrderItemForm.controls['carats'];
    this.rateCtrl = this.importOrderItemForm.controls['rate'];
    this.amountCtrl = this.importOrderItemForm.controls['amount'];
    // this.stockRateCtrl = this.importOrderItemForm.controls['stockRate'];
  }

  handleAdd() {
      if (this.descCtrl.valid && this.rateCtrl.valid && this.caratsCtrl.valid) {
        if (this.caratsCtrl.value <= 0 || this.rateCtrl.value <= 0) {
          const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
          activeModal.componentInstance.showHide = false;
          activeModal.componentInstance.modalHeader = 'Alert';
          activeModal.componentInstance.modalContent = 'Carats & Rate should be greater than 0!';
        } else if (this.purchaseOrderItems.value.length > 0) {
          let flag = 0;
         this.purchaseOrderItems.value.forEach(element => {
           const a = element.description;
           if (this.descCtrl.value.trim().toUpperCase() == a.trim().toUpperCase()){
              flag = 1;
              const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
              activeModal.componentInstance.showHide = false;
              activeModal.componentInstance.modalHeader = 'Alert';
              activeModal.componentInstance.modalContent = 'Item already added!';
           }
         });
         if (flag == 0) {
          this.validAdd();
         }
        } else {
          this.validAdd();
       }
    }
  }

  validAdd() {
    this.caratsCtrl.setValue(parseFloat(this.caratsCtrl.value.toFixed(3)));
    this.rateCtrl.setValue(parseFloat(this.rateCtrl.value.toFixed(2)));
     this.amountCtrl.setValue(parseFloat((this.caratsCtrl.value * this.rateCtrl.value).toFixed(2)));
     this.purchaseOrderItems.push(this.importOrderItemForm);
     this.source.load(this.purchaseOrderItems.value);
     this.initOrderItem();
     this.calculatWeightedAvgRateAndCumulativeAmount();
  }

   calculatWeightedAvgRateAndCumulativeAmount() {
    if (this.purchaseOrderItems.value && this.purchaseOrderItems.value.length > 0) {
      let amount:number = 0;
      let totalCarats = 0;
        this.purchaseOrderItems.value.forEach(item => {
        amount += (item.carats * item.rate);
        totalCarats += item.carats;
      });
      this.cumulitveAmount = amount.toFixed(2);
      this.cumulitveAmountBase = (amount * this.baseExchangeRate.value).toFixed(2);
      this.orderAmount.setValue(amount.toFixed(2));
      this.orderAmountBase.setValue(this.cumulitveAmountBase);
      this.wtAvgRate.setValue(((this.cumulitveAmountBase / totalCarats) / this.exchangeRate.value).toFixed(2));
    } else {
      this.cumulitveAmount = '0';
      this.cumulitveAmountBase = 0;
      this.orderAmount.setValue(0);
      this.orderAmountBase.setValue(0);
      this.wtAvgRate.setValue(0);
    }
  }

  getColTotal(colName: string): number {
    let total: number;
    total = 0;
    this.purchaseOrderItems.value.forEach(row => {
      total += parseFloat(row[colName]);
    });

    return parseFloat(total.toFixed(3));
  }

  onEditConfirm(event: any): void {
    if (event.newData.carats <= 0 || event.newData.rate <= 0) {
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = false;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Carats & Rate should be greater than 0!';
      event.confirm.reject();
    } else if (event.newData.description.trim().length == 0) {
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = false;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Description is required!';
      event.confirm.reject();
    } else {
       let index = 0;
       this.purchaseOrderItems.controls.forEach(element => {
         const avc = <any>element;
         if (avc.value.description.trim().toUpperCase() == event.data.description.trim().toUpperCase()) {
          const ac = <any>this.purchaseOrderItems.controls[index];
          ac.controls['description'].setValue(event.newData.description);
          ac.controls['carats'].setValue((parseFloat(event.newData.carats)).toFixed(2));
          ac.controls['rate'].setValue((parseFloat(event.newData.rate)).toFixed(2));
          ac.controls['amount'].setValue((parseFloat(event.newData.carats) * parseFloat(event.newData.rate)).toFixed(2));
          this.initOrderItem();
         } else {
           index++;
         }
       });
      this.source.load(this.purchaseOrderItems.value);
      this.calculatWeightedAvgRateAndCumulativeAmount();
    }
  }

  onDeleteConfirm(event: any): void {
    const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
    activeModal.componentInstance.showHide = true;
    activeModal.componentInstance.modalHeader = 'Alert';
    activeModal.componentInstance.modalContent = 'Are you sure you want to delete?';
    activeModal.result.then ((res) => {
      if (res == 'Y') {
        let index = 0;
        this.purchaseOrderItems.value.forEach(element => {
          if (element.description.trim().toUpperCase() == event.data.description.trim().toUpperCase()) {
            this.purchaseOrderItems.removeAt(index);
            this.source.load(this.purchaseOrderItems.value);
            this.calculatWeightedAvgRateAndCumulativeAmount();
           if (this._parentForm.controls.hasOwnProperty('orderItems')) {
              const zyx = <any>this._parentForm.controls['orderItems'];
              const itemIndex = zyx.value.findIndex(elem => {
                if (elem.itemDesc == event.data.description) {
                  return true;
                }
              });
              if (itemIndex != -1) {
                const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
                activeModal.componentInstance.showHide = true;
                activeModal.componentInstance.modalHeader = 'Alert';
                activeModal.componentInstance.modalContent = 'Item Deleted!! Do you want to delete ' + element.description.toUpperCase() + ' based Description Entries From Stock Effects Also?';
                activeModal.result.then ((res) => {
                  if (res == 'Y') {
                    let newArray: FormArray;
                    newArray = this.fb.array([]);
                    const xyz = <any>this._parentForm.controls['orderItems'];
                    xyz.controls.forEach(ele => {
                      if (ele.value.itemDesc != event.data.description) {
                        newArray.push(ele);
                      }
                    });
                    this._parentForm.controls['orderItems'] = newArray;
                  }
                });
              }
           }
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
        edit: !this.isViewMode,
        delete: !this.isViewMode
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
          description: {
          title: 'Item Description',
          type: 'text',
        },
        carats: {
          title: 'Carats',
          type: 'text',
        },
        rate: {
          title: 'Rate Per Carat',
          type: 'text',
        },
        amount: {
          title: 'Total Amount',
          type: 'text',
          editable: false,
          valuePrepareFunction: (value, row) => {
            return (row.carats * row.rate).toFixed(2);
          }
        }
      }
    };
  }

  constructor(private fb: FormBuilder,
     private modalService: NgbModal,
     private purchService: ImportPurchaseOrderService) {
    this.purchaseOrderItems = fb.array([]);
    this.initOrderItem();
    this.settings = this.prepareTableSettings();
  };

  getTotalAmount(): number {
    return parseFloat(this.getColTotal('amount').toFixed(2));
  }


  private initOderItems() {
    if (this._parentForm.contains('purchaseOrderItems')) {
      this.purchaseOrderItems = this._parentForm.controls['purchaseOrderItems'] as FormArray;
       this.source.load(this.purchaseOrderItems.value);
      setTimeout(() => {
       this.calculatWeightedAvgRateAndCumulativeAmount();
      });
    } else {
      this.purchaseOrderItems = this.fb.array([]);
      this._parentForm.addControl('purchaseOrderItems', this.purchaseOrderItems);
    }
    this.initOrderItem();
  }

  get totalCarats(): number {
    return parseFloat((this.getColTotal('carats')).toFixed(3));
  }

}
