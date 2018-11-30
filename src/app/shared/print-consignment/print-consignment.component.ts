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
    styleUrls: [('./print-consignment.scss')],
    templateUrl: './print-consignment.html'
  })

  export class PrintConsignmentComponent implements OnInit{


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
  cusBank: any;
  cusAccNo: any;
  cusSwiftNo: any;
  creditBank: any;
  creditBankAddr: any;
  creditBankSwift: any;
  supState: string;
  cusGst: string;
  cusCin: string;
  cusPan: string;
  hsnNo: string;
  printDate: string;
  selectCategory: string;
  items: listItems[] = [];
  email: string;
  tel: number;
  fax: number;
  qbc: string;
  gTotal: any = 0;
  totalPcs: any = 0;
  totalCarats: any = 0;
  tAmount: any = 0;
  state: any;
  mobile: any;
  invoiceNo: any;
  iecNo: any;  
  iecCode: any;
  suppRef: any;
  otherRef: any;
  buyer: any;
  through: any;
  destination: any;
  vesselNo: any;
  placeOfReceipt: any;
  portOfLoad: any;
  portOfDischarge: any;
  term: any;
  amtInWords: any;
  taxAmtInWords: any;
  companyBankName: any;
  companyAccNo: any;
  swiftNo: any;
  companyCountry: any;
  suppCountry: any;

   th = ['','thousand','million', 'billion','trillion'];
   dg = ['zero','one','two','three','four', 'five','six','seven','eight','nine']; 
   tn = ['ten','eleven','twelve','thirteen', 'fourteen','fifteen','sixteen', 'seventeen','eighteen','nineteen'];
   tw = ['twenty','thirty','forty','fifty', 'sixty','seventy','eighty','ninety']; 

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
        let a = Math.floor(this.tAmount);
       this.amtInWords =  this.words(a);
       this.showPrint = true;
      }
      isInteger(x) {
        return x % 1 === 0;
    } 
    words(value: any){
      if (value && this.isInteger(value))
        return  this.toWords(value);
    
      return value;
    }
    toWords(s)
    {  
        s = s.toString(); 
        s = s.replace(/[\, ]/g,''); 
        if (s != parseFloat(s)) return 'not a number'; 
        var x = s.indexOf('.'); 
        if (x == -1) x = s.length; 
        if (x > 15) return 'too big'; 
        var n = s.split(''); 
        var str = ''; 
        var sk = 0; 
        for (var i=0; i < x; i++) 
        {
            if ((x-i)%3==2) 
            {
                if (n[i] == '1') 
                {
                    str += this.tn[Number(n[i+1])] + ' '; 
                    i++; 
                    sk=1;
                }
                else if (n[i]!=0) 
                {
                    str += this.tw[n[i]-2] + ' ';
                    sk=1;
                }
            }
            else if (n[i]!=0) 
            {
                str += this.dg[n[i]] +' '; 
                if ((x-i)%3==0) str += 'hundred ';
                sk=1;
            }
    
    
            if ((x-i)%3==1)
            {
                if (sk) str += this.th[(x-i-1)/3] + ' ';
                sk=0;
            }
        }
        if (x != s.length)
        {
            let y = s.length; 
            str += 'point '; 
            for (let i=x+1; i<y; i++) str += this.dg[n[i]] +' ';
        }
        let amtWords = str.replace(/\s+/g,' ');
        return ('USD ' +amtWords.toUpperCase() + 'ONLY/-');
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
    onCategoryChange(event: any){
      console.log(event);
      this.selectCategory = event;
      console.log(this.catMasterList);
      this.catMasterList.forEach(element =>{
        if(element.catName == event){
          this.hsnNo = element.statisticalCode;
        }
      })
    }
    onInvoiceChange(event: any){
      console.log(event);
      this.invoiceNo = event;
    }
    onDeliveryNoteChange(event: any){
      console.log(event);
      this.iecNo = event;
    }
    onPaymentModeChange(event: any){
      console.log(event);
      this.iecCode = event;
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
      this.buyer = event;
    }
    onDespatchedThroughChange(event: any){
      console.log(event);
      this.through = event;
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
    onBankNameChange(event: any){
      this.companyBankName = event;
    }
    onAccNoChange(event: any){
      this.companyAccNo = event;
    }
    onIfsChange(event: any){
      this.swiftNo = event;
    }
    oncompanyCountryChange(event: any){
      this.companyCountry = event;
    }
    onsuppCountryChange(event: any){
      this.suppCountry = event;
    }
  }