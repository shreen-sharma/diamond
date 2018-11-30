import { Component, Injectable, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Rx';
import { CategoryService } from 'app/pages/masters/components/categories/';
import { AuthenticationService } from 'app/core/authentication/authentication.service';
import { HierarchyRelationService } from 'app/pages/company/components/hierarchyRelation';
import {LocalSaleService } from 'app/pages/transaction/components/localSaleInvoice/localSaleInvoice.service';
import { PartyDetailsService } from '.../../app/pages/company/components/partyDetails/partyDetails.service';

class listItems {
  si: Number;
  description: String;
  pcs: Number;
  carats: Number;
  rate: Number;
  amount: Number;
 }

@Component({
    selector: 'add-service-modal',
    styleUrls: [('./print-dc.scss')],
    templateUrl: './print-dc.html'
  })

  export class PrintDCComponent implements OnInit{

  showPrint: boolean = true;
  catMasterList: any [] = [];
  brokerList: any[] = [];
  companyName: string;
  companyImage: string;
  add11: string;
  add12: string;
  add13: string;
  add14: string;
  city: string;
  pinCode: string;
  gstNo: string;
  cinNo: string;
  panNo: string;
  stateCode: string;
  refNo: string;
  cusName: string;
  cusAddress: string;
  cusCity: string;
  cusState: string;
  supState: string;
  cusGst: string;
  cusCin: string;
  cusPan: string;
  hsnNo: string;
  printDate: string;
  carryPerson: string;
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
  igstAmt: any = 0;
  gTotal: any = 0;
  totalPcs: any = 0;
  totalCarats: any = 0;
  avgRate: any = 0;
  tAmount: any = 0;
  selectBroker: any;
  amtInWords: any;
  challanNo:any;
  
  th = ['','thousand','million', 'billion','trillion'];
   dg = ['zero','one','two','three','four', 'five','six','seven','eight','nine']; 
   tn = ['ten','eleven','twelve','thirteen', 'fourteen','fifteen','sixteen', 'seventeen','eighteen','nineteen'];
   tw = ['twenty','thirty','forty','fifty', 'sixty','seventy','eighty','ninety']; 


    constructor ( private activeModal: NgbActiveModal,
      private hierService: HierarchyRelationService,
      private authService: AuthenticationService,
      private saleService: LocalSaleService,
      private partyService: PartyDetailsService,
      private catService: CategoryService,) {
        this.catService.getData().subscribe(data =>{
          this.catMasterList = data;       
        })
        this.partyService.getPartyByType('BR').subscribe(res => {
          this.brokerList = res;
          console.log(this.brokerList);
        });
        this.hierService.getHierById(this.authService.credentials.company).subscribe( da => {
          this.hierService.getHierMasterById(da.hierarchyMaster.hierId).subscribe( res => {
            this.saleService.getAddressById(res.addressMaster.addressId).subscribe(resp =>{
              debugger
            this.city = resp.city.name;
            this.stateCode = resp.state.stateCode;
            })
            this.companyName = res.hierName;
            this.add11 = res.addressMaster.add11;
            this.add12 = res.addressMaster.add12;
            this.pinCode = res.addressMaster.pinCode;
            this.gstNo = res.hierarchyDetailRequestDTO.gSTNo;
            this.cinNo = res.hierarchyDetailRequestDTO.cinNo;
            this.panNo = res.hierarchyDetailRequestDTO.panNo;
           // this.stateCode = res.addressMaster.state;
            this.email = res.addressMaster.email;
            this.tel = res.addressMaster.phoneO;
            this.fax = res.addressMaster.phoneR;
            this.qbc = res.addressMaster.mobile;
          })
        })

      }
      // submit(){
      //   this.showPrint = true;
      // }
      cancel(){
        this.activeModal.close('N');
      }
    ngOnInit () {
        let a = Math.floor(this.tAmount);
       this.amtInWords =  this.words(a);
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
            
            @page { size: A5;  margin: none; }  
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
              border: solid .5px #ccc !important;
              font-size: .8em!important;
            }
            //Add a comment to this line
            
            .modal-content {
              color: black;
              background-color: rgb(250, 253, 255);
            }
            .modal-header{
              text-align: center;
              border-bottom: 1px dotted #818181;
            }
            .modal-footer{
              border-top: 1px dotted #818181;
              text-align: center;
            }
            .modal-body .topName{
              text-align: center;
              margin-bottom: -2em!important;
              font-size: .9em!important;
            }
            .modal-body .topName1{
              text-align: center!important;
              margin-bottom: -.6em!important;
              margin-top: 6em!important;
              font-size: 1em!important
            }
            .modal-body .top{
              font-size: .8em;
              font-weight: none;
              margin-bottom: -2em!important;
            }
            .modal-body .sCode{
              font-size: .8em;
              font-weight: none;
              margin-top: 1em!important;
              margin-bottom: -1em!important;
            }
            .modal-body .top1{
              margin-top: 1em!important;
              text-align: center!important;
              margin-bottom: -1em!important;
              font-size: .8em!important;
            }
            .modal-body .top2{
              margin-top: 0em!important;
              text-align: center!important;
              margin-bottom: -1em!important;
            }
            .modal-body .top3{
              margin-top: 0.2em!important;
              font-size: .8em!important;
              font-weight: normal!important;
            }
            .modal-body .top4{
              margin-bottom: -.2em!important;
              font-size: .8em!important;
            }
            .modal-body .top5{
              margin-top: -2.2em!important;
              margin-bottom: -1.2em!important;
              font-weight: bold!important;
              font-size: .8em!important;
            }
            .modal-header .topName2{
              font-size: .7em!important; 
              text-align: center!important;
              margin-bottom: em!important;
              margin-top: 1.5em!important;
            }
            .modal-header .email{
              font-size: .6em!important; 
              text-align: center!important;
              margin-top:-2.2em!important;
              margin-left: .3em!important;
            }
            .modal-header .topName3{
              margin-bottom: -.5em!important;
              font-size: 1em!important;
              margin-top: -.5em!important;
            }
            .modal-header .top6{
              font-size: .7em!important;
              margin-bottom: -1em!important;
              margin-top: -1.2em!important;
              font-weight: normal!important;
              padding: 0 2em 0 2em!important;
            }
            .modal-body .top7{
              margin-top: 0.4em!important;
              margin-bottom: -2.4em!important;
              font-size: .8em!important;
              font-weight: normal!important;
            }
            .modal-body .topName4{
              margin-top: 3em!important; 
              font-size: .8em!important;
              text-align: center!important;
              margin-bottom: 0.2em!important;
            }
            .modal-body .col-md-12 .col-md-6 .right{
              margin-top:-10em!important;
              font-size: .8em!important;
            }
            .bottom{
              margin-top: 0em!important;
              margin-bottom: 0em!important;
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
    onNameChange(event: any){
      console.log(event);
      this.carryPerson = event;
    }
    onBrokerChange(event: any){
      this.selectBroker = event;
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
    // onRefNoChange(event: any){
    //   this.refNo = event;
    // }
    // onCgstChange(event: any){
    //   this.cgst = event;
    //   this.cgstAmt = parseFloat(((this.cgst * this.tAmount)/100).toFixed(2));
    //   this.gTotal = parseFloat((this.tAmount + this.cgstAmt + this.sgstAmt + this.igstAmt).toFixed(2)); 
    // }
    // onSgstChange(event: any){
    //   this.sgst = event;
    //   this.sgstAmt = parseFloat(((this.sgst * this.tAmount)/100).toFixed(2));
    //   this.gTotal = parseFloat((this.tAmount + this.cgstAmt + this.sgstAmt + this.igstAmt).toFixed(2)); 
    // }
    // onIgstChange(event: any){
    //   this.igst = event;
    //   this.igstAmt = parseFloat(((this.igst * this.tAmount)/100).toFixed(2));
    //   this.gTotal = parseFloat((this.tAmount + this.cgstAmt + this.sgstAmt + this.igstAmt).toFixed(2)); 
    // }
  }