import { Component, OnInit } from '@angular/core';
import {BalanceSheetService } from './balanceSheet.service'

@Component({
  selector: 'balanceSheet',
  templateUrl: './balanceSheet.html',
  styleUrls: ['./balanceSheet.scss']
})
export class BalanceSheet implements OnInit {

  npUSD:number;
  npINR:number;
  brokUSD: number;
  brokINR : number;
  payINR: number;
  payUSD: number;
  payExc: number;
  recINR:number;
  recUSD:number;
  recExc:number;
stkINR: number;
stkUSD:number;
stkCarats:number;
tpINR:number;
tpUSD:number;
wlINR:number;
wlUSD:number;
wlCarats:number;

  constructor(
    private service:BalanceSheetService) {
      this.service.getBalanceSheetDetails().subscribe(res=>{
        debugger;
        this.npUSD = res[0].NP.USD;
        this.npINR = res[0].NP.INR;
        this.brokINR=res[0].Brokerage.INR;
        this.brokUSD=res[0].Brokerage.USD;
        this.payINR=res[0].Payable.INR;
        this.payUSD=res[0].Payable.USD;
        this.payExc=res[0].Payable.exch_rate;
        this.recExc=res[0].Recievable.exch_rate;
        this.recINR=res[0].Recievable.INR;
        this.recUSD=res[0].Recievable.USD;
        this.stkINR=res[0].Stock.INR;
        this.stkUSD=res[0].Stock.USD;
        this.stkCarats=res[0].Stock.carats;
        this.tpINR=res[0].TP.INR;
        this.tpUSD=res[0].TP.USD;
        this.wlINR=res[0].WL.INR;
        this.wlUSD=res[0].WL.USD;
        this.wlCarats=res[0].WL.carats;
      })
     }

  ngOnInit() {
  }

}
