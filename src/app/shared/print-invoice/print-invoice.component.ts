import { Component, Injectable, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Rx';
import { CategoryService } from 'app/pages/masters/components/categories/';
import { AuthenticationService } from 'app/core/authentication/authentication.service';
import { HierarchyRelationService } from 'app/pages/company/components/hierarchyRelation';
import {LocalSaleService } from 'app/pages/transaction/components/localSaleInvoice/localSaleInvoice.service';

class listItems {
  si: Number;
  description: String;
  hsn: any;
  carats: Number;
  rate: Number;
  amount: Number;
 }

@Component({
    selector: 'add-service-modal',
    styleUrls: [('./print-invoice.scss')],
    templateUrl: './print-invoice.html'
  })

  export class PrintInvoiceComponent implements OnInit{


    showPrint: boolean = false;

    catMasterList: any [] = [];
  companyName: string;
  add11: string;
  add12: string;
  city: string;
  pinCode: string;
  gstNo: string;
  cinNo: string;
  panNo: string;
  stateCode: string;
  cusName: string;
  cusAddress: string;
  cusCity: string;
  cusState: string;
  cusStateCode: string;
  supState: string;
  cusGst: string;
  cusCin: string;
  cusPan: string;
  hsnNo: string;
  printDate: string;
  selectCategory: string;
  items: listItems[] = [];
  totalAmount: number;
  cgst: number;
  igst: number;
  sgst: number;
  email: string;
  tel: number;
  fax: number;
  qbc: string;
  cgstAmt: any = 0;
  sgstAmt: any = 0;
  gTotal: any = 0;
  totalPcs: any = 0;
  totalCarats: any = 0;
  avgRate: any = 0;
  tAmount: any = 0;
  state: any;
  mobile: any;
  invoiceNo: any;
  deliveryNote: any;  
  paymentMode: any;
  suppRef: any;
  otherRef: any;
  buyOrdNo: any;
  dateBuy: any;
  despatchDocNo: any;
  deliveryNoteDate: any;
  despatchedThrough: any;
  destination: any;
  vesselNo: any;
  placeOfReceipt: any;
  portOfLoad: any;
  portOfDischarge: any;
  term: any;
  roundOff: any;
  roundOffAmt: any = 0;
  amtInWords: any;
  taxAmtInWords: any;
  companyBankName: any;
  companyAccNo: any;
  bankIfscCode: any;
    a = ['','one ','two ','three ','four ', 'five ','six ','seven ','eight ','nine ','ten ','eleven ','twelve ','thirteen ','fourteen ','fifteen ','sixteen ','seventeen ','eighteen ','nineteen '];
    b = ['', '', 'twenty','thirty','forty','fifty', 'sixty','seventy','eighty','ninety'];

    constructor ( private activeModal: NgbActiveModal,
      private hierService: HierarchyRelationService,
      private authService: AuthenticationService,
      private saleService: LocalSaleService,
      private catService: CategoryService,) {
        this.catService.getData().subscribe(data =>{
          this.catMasterList = data;       
        })
        this.hierService.getHierById(this.authService.credentials.company).subscribe( da => {
          this.hierService.getHierMasterById(da.hierarchyMaster.hierId).subscribe( res => {
            this.saleService.getAddressById(res.addressMaster.addressId).subscribe(resp =>{
            this.city = resp.city.name;
            this.state = resp.state.name;
            this.stateCode = resp.state.stateCode;
            })
            this.companyName = res.hierName;
            this.add11 = res.addressMaster.add11;
            this.add12 = res.addressMaster.add12;
            this.pinCode = res.addressMaster.pinCode;
            this.gstNo = res.hierarchyDetailRequestDTO.gSTNo;
            this.cinNo = res.hierarchyDetailRequestDTO.cinNo;
            this.panNo = res.hierarchyDetailRequestDTO.panNo;
            //this.stateCode = res.addressMaster.state;
            this.email = res.addressMaster.email;
            this.tel = res.addressMaster.phoneO;
            this.fax = res.addressMaster.phoneR;
            this.qbc = res.addressMaster.mobile;
            this.mobile = res.addressMaster.mobile;
          })
        })

      }
    ngOnInit () { }
    
      submit(){
        let a = Math.floor(this.gTotal);
        let b = Math.floor(this.cgstAmt + this.sgstAmt);
       this.amtInWords =  this.inWords(a);
       this.taxAmtInWords = this.inWords(b);
       this.showPrint = true;
      }
      inWords (num) {
        if ((num = num.toString()).length > 9) return 'overflow';
       let n:any = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
        if (!n) return; var str = '';
        str += (n[1] != 0) ? (this.a[Number(n[1])] || this.b[n[1][0]] + ' ' + this.a[n[1][1]]) + 'crore ' : '';
        str += (n[2] != 0) ? (this.a[Number(n[2])] || this.b[n[2][0]] + ' ' + this.a[n[2][1]]) + 'lakh ' : '';
        str += (n[3] != 0) ? (this.a[Number(n[3])] || this.b[n[3][0]] + ' ' + this.a[n[3][1]]) + 'thousand ' : '';
        str += (n[4] != 0) ? (this.a[Number(n[4])] || this.b[n[4][0]] + ' ' + this.a[n[4][1]]) + 'hundred ' : '';
        str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (this.a[Number(n[5])] || this.b[n[5][0]] + ' ' + this.a[n[5][1]]) + 'only ' : '';
        return ('INR ' +str.toUpperCase());
    }
    
    cancel(){
      this.activeModal.close('N');
    }
   
    print(): void {
      let printContents, popupWin;
      printContents = document.getElementById('modal-content').innerHTML;
      popupWin = window.open('', 'top=0,left=0,height=100%,width=100%');
      popupWin.document.open();
      popupWin.document.write(`
        <html>
          <head>
            <title></title>
            <style>
            //........Customized style.......
            
            @page { size: A4;  margin: 0mm; }   
            .body{
              margin: 2em!important;
            }         
            .table{
              text-align: center; 
              width: 100%;float:center!important;
              margin-bottom: 1em;
              border-collapse: collapse;
            }
            table td, table th {
              border: solid 1px black !important;
            }
            //Add a comment to this line
            
            .modal-content {
              color: black;
              background-color: rgb(250, 253, 255);
            }
            .modal-header{
              text-align: center;
            }
            .modal-footer{
              border-top: 1px dotted #818181;
              text-align: center;
            }
            </style>
          </head>
      <body onload="window.print();window.close()">${printContents}</body>
        </html>`
      );
      popupWin.document.close();
    }
    onPrintDateChange(event: any){
      console.log(event);
      this.printDate = event;
    }
    
    onCgstChange(event: any){
      this.cgst = event;
      this.cgstAmt = parseFloat(((this.cgst * this.tAmount)/100).toFixed(2));
      this.gTotal = parseFloat((this.tAmount + this.cgstAmt + this.sgstAmt - this.roundOffAmt).toFixed(2)); 
    }
    onSgstChange(event: any){
      this.sgst = event;
      this.sgstAmt = parseFloat(((this.sgst * this.tAmount)/100).toFixed(2));
      this.gTotal = parseFloat((this.tAmount + this.cgstAmt + this.sgstAmt - this.roundOffAmt).toFixed(2)); 
    }
    onInvoiceChange(event: any){
      console.log(event);
      this.invoiceNo = event;
    }
    onDeliveryNoteChange(event: any){
      console.log(event);
      this.deliveryNote = event;
    }
    onPaymentModeChange(event: any){
      console.log(event);
      this.paymentMode = event;
    }
    onSuppRefChange(event: any){
      console.log(event);
      this.suppRef = event;
    }
    onOtherRefChange(event: any){
      console.log(event);
      this.otherRef = event;
    }
    onBuyOrdNoChange(event: any){
      console.log(event);
      this.buyOrdNo = event;
    }
    onDateBuyChange(event: any){
      console.log(event);
      this.dateBuy = event;
    }
    onDespatchDocNoChange(event: any){
      console.log(event);
      this.despatchDocNo = event;
    }
    onDeliveryNoteDateChange(event: any){
      console.log(event);
      this.deliveryNoteDate = event;
    }
    onDespatchedThroughChange(event: any){
      console.log(event);
      this.despatchedThrough = event;
    }
    onDestinationChange(event: any){
      console.log(event);
      this.destination = event;
    }
    onVesselNoChange(event: any){
      console.log(event);
      this.vesselNo = event;
    }
    onPlaceOfReceiptChange(event: any){
      console.log(event);
      this.placeOfReceipt = event;
    }
    onPortOfLoadChange(event: any){
      console.log(event);
      this.portOfLoad = event;
    }
    onPortOfDischargeChange(event: any){
      console.log(event);
      this.portOfDischarge = event;
    }
    onTermChange(event: any){
      console.log(event);
      this.term = event;
    }
    onRoundOffChange(event: any){
      this.roundOff = event;
      this.roundOffAmt = parseFloat(((this.roundOff * this.tAmount)/100).toFixed(2));
      this.gTotal = parseFloat((this.tAmount + this.cgstAmt + this.sgstAmt - this.roundOffAmt).toFixed(2)); 
    }
    // onAmtInWordsChange(event: any){
    //   // this.amtInWords = event;
    //   this.words(event)
    // }
    // onTaxAmtInWordsChange(event: any){
    //   this.taxAmtInWords = event;
    // }
    onBankNameChange(event: any){
      this.companyBankName = event;
    }
    onAccNoChange(event: any){
      this.companyAccNo = event;
    }
    onIfsChange(event: any){
      this.bankIfscCode = event;
    }
  }