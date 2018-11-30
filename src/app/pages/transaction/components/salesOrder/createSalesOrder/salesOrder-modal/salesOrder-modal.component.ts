//import { PurchaseInvoiceService } from './../../purchaseInvoice.service';
import { LocalDataSource } from 'ng2-smart-table';
import { Component, OnInit, Output, EventEmitter,ElementRef } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SalesOrderService } from '../../salesOrder.service';

@Component({
  selector: 'sales-order-modal',
  styleUrls: [('./salesOrder-modal.component.scss')],
  templateUrl: './salesOrder-modal.component.html'
})

export class SalesOrderModals implements OnInit {

  private data: any;
  @Output() emitService = new EventEmitter();

  modalContent: string;
  modalHeader: string;
  settings: any;
  totalCarets: number;
  totalAvgAmt: number;
  totalNetAmt: number;
  totalBaseAmt: number;
  estimatedSizeFlag: boolean= false;
  mySettings: any;
  modelList: any[] = [];
  xList: any = [];
  totCarats: number;
  size: string;
  qulty: string;
  public orderNo: AbstractControl;
  orderFormModal: FormGroup;

  prepareSetting() {
    return {
      hideSubHeader: false,
      actions: false,

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
        perPage: 7,
      },
      selectMode: 'single',
      columns: {
        lot: {
          title: 'Lot Name',
          // valuePrepareFunction: value => value.partyName,
        },
        carats: {
          title: 'Total Carats',
        },
        sellingPrice: {
          title: 'Avg. Selling Price',
        },
        amount: {
          title: 'Total Amount',
        },
        exchRate:{
          title: 'Exch Rate'
        },
        baseAmount:{
          title: 'Base Amount'
        },
        ctsPerc:{
          title: 'Carats %'
        }
      }
    };
  }

  prepareSettingSize() {
    return {
      hideSubHeader: true,
      actions: false,
      pager: {
        display: false,
        perPage: 50,
      },
      selectMode: 'single',
      columns: {
        id: {
          title: 'Size',
        }
      }
    }
  }

  constructor(private activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private ele: ElementRef,
    private service: SalesOrderService
  
  ) {

    // this.service.getAllPurchaseOrdersByTypeAndStatus('completed&notdeleted&notdraft', 'N').subscribe((data) => {
    //   data.forEach(res => {
    //     res.party = res.party.partyName;
    //   });
    //   this.source.load(data);   
    // });
  }

  ngOnInit() {
    if(this.estimatedSizeFlag){
      this.ele.nativeElement.style.width = '1000px';
      // this.ele.nativeElement.style.position = 'fixed';
      // this.ele.nativeElement.style.top = '-28px';
      // this.ele.nativeElement.style.right = 0;
      // this.ele.nativeElement.style.bottom = 0;
      // this.ele.nativeElement.style.left = '-12em';
      this.settings = this.prepareSettingSize();
     }else{
      this.settings = this.prepareSetting();
     }
  }

  
  onChangeOrdNo(orderid: any) {
    this.xList=[];
    this.mySettings = this.prepareSettingSize();
    if (!this.estimatedSizeFlag) {
      this.service.getAllLocalSalesOrderStockItemsReportLotwise(orderid).subscribe((reportList: any[]) => {
        reportList.forEach(invoiceItem => {
          invoiceItem.lot = invoiceItem.lot.lotName;
          const tot = parseFloat(this.getColTotal('carats', reportList).toFixed(3));
          invoiceItem.ctsPerc = parseFloat(((invoiceItem.carats / tot) * 100).toFixed(3));
        })
        this.modelList = reportList;
        this.totalCarets = this.ttlCarats;
        this.totalAvgAmt = this.ttlCarats == 0 ? 0 : parseFloat((this.ttlNetAmt / this.ttlCarats).toFixed(2));
        this.totalNetAmt = this.ttlNetAmt;
        this.totalBaseAmt = this.ttlBaseAmt;
        this.source.load(this.modelList);
      });
    }else{
      this.mySettings = this.prepareSettingSize();
      this.service.localSalesOrderEstimateDistinctSizeReport(Number(orderid)).subscribe((reportList: any[]) => {

        for (var i = 0; i <= reportList.length; i++) {
          this.xList[i] = [];
        }
        for (var i = 0; i < reportList.length; i++) {
          this.xList[i]["id"] = reportList[i];
        }
        this.service.localSalesOrderEstimateSizeReport(Number(orderid)).subscribe((reportList: any[]) => {
          var rowTotValue: number = 0;
          for (var i = 0; i < Object.keys(reportList).length; i++) {
            rowTotValue = this.totCarats;
            this.totCarats = 0;
    
    
            this.size = Object.keys(reportList)[i].toString();
    
            this.mySettings.columns[this.size] = { title: '' + this.size };
           this.settings = Object.assign({}, this.mySettings);
            for (var j = 0; j < Object.keys(reportList[Object.keys(reportList)[i]]).length; j++) {
    
              if (Object.keys(reportList[Object.keys(reportList)[i]])[j] != undefined) {
    
    
    
    
                this.qulty = Object.keys(reportList[Object.keys(reportList)[i]])[j];
    
                if (i % 2 == 1) {
                  this.xList[this.lotSizeIndex(this.qulty)][Object.keys(reportList)[i].toString()] = Number(((reportList[this.size][this.qulty]["carats"] / rowTotValue) * 100).toFixed(2));
                  // this.totCarats += Number(((reportList[this.size][this.qulty]["carats"] / rowTotValue) * 100).toFixed(2)) ;
                } else {
                  this.totCarats += reportList[this.size][this.qulty]["carats"];
                  this.xList[this.lotSizeIndex(this.qulty)][Object.keys(reportList)[i].toString()] = reportList[this.size][this.qulty]["carats"];
                }
    
    
              }
    
    
    
            }
            this.xList[this.xList.length - 1]["id"] = "Total";
            this.xList[this.xList.length - 1][Object.keys(reportList)[i].toString()] = this.totCarats.toFixed(2);
          }
    
    
          var s: string;
    
          this.mySettings.columns["Total"] = { title: 'Total' };
          this.settings = Object.assign({}, this.mySettings);
    
          this.mySettings.columns["%"] = { title: '%' };
          this.settings = Object.assign({}, this.mySettings);
    
          for (var i = 0; i < this.xList.length; i++) {
    
            this.totCarats = 0;
            for (var j = 0; j < Object.keys(reportList).length; j++) {
    
              if (this.xList[i][Object.keys(reportList)[j].toString()] != undefined) {
                this.totCarats += Number(this.xList[i][Object.keys(reportList)[j].toString()]);
    
              }
    
            }
            this.xList[i]["Total"] = Number(this.totCarats.toFixed(2));
    
          }
          rowTotValue = this.getCaratColTotal("Total") - this.totCarats;
          this.xList[this.xList.length - 1]["Total"] = rowTotValue;
          for (var i = 0; i < this.xList.length; i++) {
            this.xList[i]["%"] = Number((this.xList[i]["Total"] / rowTotValue) * 100).toFixed(2);
          }
    
          this.source.load(this.xList);
        }
      );
  
      });
  
     
    }
  }
  getCaratColTotal(colName: string) {
    let total: number;
    total = 0;
    this.xList.forEach(row => {
      total += parseFloat((row[colName]));
    });
    return total;
  }
  lotSizeIndex(size: string): number {
    // console.log(size);
    // console.log(this.xList.length);

    for (var i = 0; i < this.xList.length; i++) {
      if (this.xList[i].id === size) {
        // console.log(i);
        return i;
      }
    }
  }
  get ttlCarats(): number {
    return parseFloat(this.getColTotal('carats', this.modelList).toFixed(3));
  }

  get ttlNetAmt(): number {
    return parseFloat(this.getColTotal('amount', this.modelList).toFixed(3));
  }

  get ttlBaseAmt(): number {
    return parseFloat(this.getColTotal('baseAmount', this.modelList).toFixed(3));
  }

  getColTotal(colName: string, list: any) {
    let total: number;
    total = 0;
    list.forEach(row => {
      total += parseFloat(row[colName]);
    });
    return total;
  }
  

   source: LocalDataSource = new LocalDataSource();

  closeModal() {
    this.activeModal.close();
  }
  private initForm() {
    this.orderFormModal = this.fb.group({
      'orderNo': ['']
    });

    // this.poNo = this.orderForm.controls['poNo'];
    this.orderNo = this.orderFormModal.controls['orderNo'];

  }

}
