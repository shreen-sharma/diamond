import { CommonModalComponent } from '../../../../shared/common-modal/common-modal.component';
import { FormGroup, FormArray, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { ParaValueService } from 'app/pages/masters/components/parameterValue';
import { AuthenticationService } from '../../../../core/authentication/authentication.service';
import { Logger } from '../../../../core/logger.service';
import { MisService } from './mis.service';
import { CategoryService } from 'app/pages/masters/components/categories/category.service';
import { LotService } from 'app/pages/stockManagement/components/lots/lot.service';
import { ItemDetailsService } from 'app/pages/masters/components/itemDetails/itemDetails.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LotItemCreationService } from 'app/pages/stockManagement/components/lotItemCreation/lotItemCreation.service';
import { ParaListService } from 'app/pages/masters/components/parameterList';
import { Ng2TableModule } from 'ng2-table/ng2-table';
import { AgGridModule } from 'ag-grid-angular/main';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
//import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

import * as jsPDF from 'jspdf';
import * as jpt from 'jspdf-autotable';
import { Column } from '../../../../../../node_modules/ng2-smart-table/lib/data-set/column';


const log = new Logger('mis');

class columns {
  title: any;
  dataKey: any
}
@Component({
  selector: 'mis',
  templateUrl: './mis.html',
  styleUrls: ['./mis.scss']
})

export class Mis implements OnInit {


  flagToCalcTot: number = 1;
  query = '';
  error: string = null;
  isLoading = false;
  misForm: FormGroup;
  source: LocalDataSource = new LocalDataSource();
  lotName: any;
  xList: any = [];
  headList: any = [];
  columnList: columns[] = [];
  yList: any[][] = [];
  yyList: any[] = [];
  xxList: any[] = [];

  size: string;
  qulty: string;
  totCarats: number = 0;
  grandTot: number = 0;
  wtdSR: number = 0;
  wtdSP: number = 0;
  lotList: any[] = [];
  catList: any[] = [];
  tableList: any[] = [];
  sizeList: any[] = [];
  shapeList: any[] = [];
  qualityList: any[] = [];
  selectedCat: any;
  paraNameList: any[] = [];
  paraValueList: any[] = [];
  reportStatus: boolean;
  tabList: any[] = [];
  itemCatList: any[] = [];
  itemLotList: any[] = [];
  itemList: any[] = [];
  len: boolean;
  leng: number;
  spRate: string;
  stockRate: string;
  carets: string;
  settings: any;
  chartSizeFlag: boolean = false;
  chartQualityFlag: boolean = false;
  dcSizeFlag: boolean = false;
  dcQualityFlag: boolean = false;
  consignmentSizeFlag: boolean = false;
  consignmentQualityFlag: boolean = false;
  totalSizeFlag: boolean = false;
  totalQualityFlag: boolean = false;
  isColorBrownLot: boolean = false;
  ItemColorList: any[] = [];
  loading: boolean = false;
  mySettings: any;
  currentUser: String;

  public lotMasterName: AbstractControl;
  public ItemColor: AbstractControl;


  constructor(private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private service: MisService,
    private modalService: NgbModal,
    private paramValService: ParaValueService,
    private lotService: LotService,
    private catService: CategoryService,
    private itemService: ItemDetailsService,
    private paraNameService: ParaListService,
    private lotItemService: LotItemCreationService,
    private authService: AuthenticationService,
    // private spinnerService: Ng4LoadingSpinnerService
  ) {

    this.createForm();
    this.reportStatus = false;
    this.currentUser = sessionStorage.getItem("loggedUser");
    this.lotService.getData().subscribe((lotList) => {
      this.lotList = lotList;
    //  this.lotMasterName.setValue(lotList[0]);
    });

  }

  prepareSetting() {
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

  ngOnInit() {

    if (this.router.url.includes('physicalStockSizeReport')) {
      this.chartSizeFlag = true;
    }

    if (this.router.url.includes('physicalStockQualityReport')) {
      this.chartQualityFlag = true;
    }


    if (this.router.url.includes('dcStockSizeReport')) {
      this.dcSizeFlag = true;
    }

    if (this.router.url.includes('dcStockQualityReport')) {
      this.dcQualityFlag = true;
    }

    if (this.router.url.includes('consignmentStockSizeReport')) {
      this.consignmentSizeFlag = true;
    }

    if (this.router.url.includes('consignmentStockQualityReport')) {
      this.consignmentQualityFlag = true;
    }

    if (this.router.url.includes('totalStockSizeReport')) {
      this.totalSizeFlag = true;
    }

    if (this.router.url.includes('totalStockQualityReport')) {
      this.totalQualityFlag = true;
    }
  }


  sizeChartReport(type) {
    //this.spinnerService.show();
    this.reportStatus = true;
    this.service.getUniqueQualityOrSizeMISReportByLotId(this.lotMasterName.value, 'size').subscribe((lst) => {
      //this.leng = lst.length;
      this.catList = lst;


      this.service.getStockChartSizeReport(this.lotMasterName.value, type, this.ItemColor.value).subscribe((lst) => {
        // this.service.getLotMISReportOfSizeOrQualityByLotId(this.lotMasterName.value, 'size').subscribe((lst) => {
        this.xList = [];
        this.headList = lst;
        this.mySettings = this.prepareSetting();

        if (Object.keys(lst).length > 0) {


          for (var i = 0; i <= this.catList.length; i++) {
            this.xList[i] = [];

          }
          for (var i = 0; i < this.catList.length; i++) {
            this.xList[i]["id"] = "'" + this.catList[i] + "'";
          }

          for (var i = 0; i < Object.keys(lst).length; i++) {

            this.totCarats = 0;
            this.wtdSR = 0;
            this.wtdSP = 0;

            this.size = Object.keys(lst)[i].toString();

            this.mySettings.columns[this.size] = { title: '' + this.size };
            this.settings = Object.assign({}, this.mySettings);
            for (var j = 0; j < this.catList.length; j++) {

              // if (Object.keys(lst[Object.keys(lst)[i]])[j] != undefined) { // && (lst[Object.keys(lst)[i]])[this.xList[j]["id"]] != undefined
              if (lst[Object.keys(lst)[i]][this.catList[j]] != undefined) {
                //  this.qulty = (lst[Object.keys(lst)[j]])[this.xList[j]["id"]][0]["quality"];
                //  this.qulty = Object.keys(lst[Object.keys(lst)[i]])[j];
                this.qulty = this.catList[j];//lst[Object.keys(lst)[i]][this.catList[j]];
                //   if(this.xList[j]["id"]==this.qulty){

                // this.xList[j]["id"] = this.qulty;
                this.xList[this.lotSizeIndex(this.qulty)][Object.keys(lst)[i].toString()] = " " + lst[this.size][this.qulty]["totalCarats"].toFixed(2) + ",\n" +
                  " " + lst[this.size][this.qulty]["avgRateStock"].toFixed(2) + ",\n" +
                  " " + lst[this.size][this.qulty]["avgSalePrice"].toFixed(2);


                this.totCarats += lst[this.size][this.qulty]["totalCarats"];
                this.wtdSR += (lst[this.size][this.qulty]["avgRateStock"] * lst[this.size][this.qulty]["totalCarats"]);
                this.wtdSP += (lst[this.size][this.qulty]["avgSalePrice"] * lst[this.size][this.qulty]["totalCarats"]);
                // }
                this.loading = false;
              }
              //yasar 1
              else {
                this.qulty = "'" + this.catList[j] + "'";
                this.xList[j]["id"] = this.qulty;
                this.xList[j][Object.keys(lst)[i].toString()] = " 0 \n, 0 \n, 0";
                this.loading = false;
              }

            }
            this.xList[this.xList.length - 1]["id"] = "Total";
            this.xList[this.xList.length - 1][Object.keys(lst)[i].toString()] = " " + this.totCarats.toFixed(2) + ",\n" +
              " " + (this.totCarats == 0 ? "0" : (this.wtdSR / this.totCarats).toFixed(2)).toString() + ",\n" +
              " " + (this.totCarats == 0 ? "0" : (this.wtdSP / this.totCarats).toFixed(2)).toString() + "\n";

          }
          var s: string;

          this.mySettings.columns["Total"] = { title: 'Total' };
          this.settings = Object.assign({}, this.mySettings);

          this.mySettings.columns["%"] = { title: 'Carats %' };
          this.settings = Object.assign({}, this.mySettings);

          for (var i = 0; i < this.xList.length; i++) {
            this.wtdSR = 0;
            this.wtdSP = 0;
            this.totCarats = 0;
            this.grandTot = 0;
            for (var j = 0; j < Object.keys(lst).length; j++) {
              //  console.log((this.xList[i][Object.keys(lst)[j].toString()].split(',')));
              if (this.xList[i][Object.keys(lst)[j].toString()] != undefined) {
                this.totCarats += Number(this.xList[i][Object.keys(lst)[j].toString()].split(',')[0]);
                s = this.xList[i][Object.keys(lst)[j].toString()].split(',')[2];
                this.wtdSP += Number(s.replace("", '').replace("", '')) * Number(this.xList[i][Object.keys(lst)[j].toString()].split(',')[0]);
                s = this.xList[i][Object.keys(lst)[j].toString()].split(',')[1];
                this.wtdSR += Number(s.replace("", '')) * Number(this.xList[i][Object.keys(lst)[j].toString()].split(',')[0]);
              }


            }
            //poda

            this.grandTot += this.totCarats;
            this.xList[i]["Total"] = this.totCarats;
            this.xList[i]["Total"] = " " + this.totCarats.toFixed(2) + ",\n" +
              " " + (this.totCarats == 0 ? "0" : (this.wtdSR / this.totCarats).toFixed(2)).toString() + ",\n" +
              " " + (this.totCarats == 0 ? "0" : (this.wtdSP / this.totCarats).toFixed(2)).toString() + "\n";
          }

          //For % Calculation
          for (var i = 0; i < this.xList.length; i++) {
            this.wtdSR = 0;
            this.wtdSP = 0;
            // this.totCarats = 0;
            this.grandTot = 0;
            for (var j = 0; j < Object.keys(lst).length; j++) {
              //  console.log((this.xList[i][Object.keys(lst)[j].toString()].split(',')));
              if (this.xList[i][Object.keys(lst)[j].toString()] != undefined) {
                this.grandTot += Number(this.xList[i][Object.keys(lst)[j].toString()].split(',')[0]);
                // s = this.xList[i][Object.keys(lst)[j].toString()].split(',')[2];
                // this.wtdSP += Number(s.replace("", '').replace("", '')) * Number(this.xList[i][Object.keys(lst)[j].toString()].split(',')[0]);
                // s = this.xList[i][Object.keys(lst)[j].toString()].split(',')[1];
                // this.wtdSR += Number(s.replace("", '')) * Number(this.xList[i][Object.keys(lst)[j].toString()].split(',')[0]);
              }
              this.xList[i]["%"] = ((this.grandTot / this.totCarats)*100).toFixed(2);

            }
          }
          console.log(this.totCarats);
          console.log(this.grandTot);
        } else {
          this.reportStatus = false;
          const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
          activeModal.componentInstance.showHide = false;
          activeModal.componentInstance.modalHeader = 'Alert';
          activeModal.componentInstance.modalContent = 'No items available!';
        }
        this.source.setPaging(2, 50);
        this.source.load(this.xList);
        this.loading = false;
        //  console.log(lst);
      });

      // this.spinnerService.hide();
    });

  }
  lotSizeIndex(size: string): number {
    // console.log(size);
    // console.log(this.xList.length);

    for (var i = 0; i < this.xList.length; i++) {
      var id = this.xList[i].id.replace("'", "").replace("'", "");
      if (id === size) {
        // console.log(i);
        return i;
      }
    }
  }


  createReport() {
    this.loading = true;
    // if (this.chartSizeFlag) {
    //   this.sizeChartReport();
    // } else {
    //   this.QualityChartReport();
    // }

if(this.lotMasterName.value==""){
  const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
  activeModal.componentInstance.showHide = false;
  activeModal.componentInstance.modalHeader = 'Alert';
  activeModal.componentInstance.modalContent = 'Please Select Lot!';
  this.loading = false;
} else{


    if (this.chartSizeFlag) {
      this.sizeChartReport(2);
    }

    if (this.chartQualityFlag) {
      this.QualityChartReport(2);
    }


    if (this.dcSizeFlag) {
      //  this.DCSizeReport();
      this.sizeChartReport(3);
    }

    if (this.dcQualityFlag) {
      // this.DCQualityReport();
      this.QualityChartReport(3);
    }

    if (this.consignmentSizeFlag) {
      // this.ConsignmentSizeReport();
      this.sizeChartReport(4);
    }

    if (this.consignmentQualityFlag) {
      // this.ConsignmentQualityReport();
      this.QualityChartReport(4);
    }

    if (this.totalSizeFlag) {
      //  this.TotalSizeReport();
      this.sizeChartReport(1);
    }

    if (this.totalQualityFlag) {
      // this.TotalQualityReport();
      this.QualityChartReport(1);
    }
  }

  }




  today(): string {
    const today = new Date();
    const dd = today.getDate();
    const mm = today.getMonth() + 1; //January is 0!

    const yyyy = today.getFullYear();
    return yyyy + '-' + (mm < 10 ? '0' + mm : mm) + '-' + (dd < 10 ? '0' + dd : dd);
  }

  now(): string {
    const today = new Date();
    const dd = today.getDate();
    const mm = today.getMonth() + 1; //January is 0!
    const yyyy = today.getFullYear();
    const hr = today.getHours();
    const min = today.getMinutes();
    const sec = today.getSeconds();

    return (dd < 10 ? '0' + dd : dd) + '-' + (mm < 10 ? '0' + mm : mm) + '-' + yyyy + ' | ' + hr + ':' + min + ':' + sec;
  }

  removeDocument(doc) {
    this.xList.forEach((item, index) => {
      if (item === doc) this.xList.splice(index, 1);
    });
  }

  ConvertToPDF() {





    //columns[0] = 'Size';

    let column = new columns();
    this.columnList = [];
    let doc = new jsPDF('landscape', 'pt'); jpt;

    if (this.chartSizeFlag) {
      doc.setFontType('underline');
      doc.text('Stock Chart Size - ' + this.lotName, 320, 25);
      doc.setFontSize(10);
      doc.text(this.now(), 720, 20);
      doc.text(this.currentUser, 745, 30);
      column.title = "Size";
      column.dataKey = "id";
      this.columnList.push(column);
      for (var i = 1; i <= Object.keys(this.headList).length; i++) {
        //columns[i] = Object.keys(this.headList)[i - 1];
        let column = new columns();
        column.title = Object.keys(this.headList)[i - 1];
        column.dataKey = Object.keys(this.headList)[i - 1];
        this.columnList.push(column);
        //    this.yyList[i] = [];
      }
      let column1 = new columns();
      column1.dataKey = "Total";
      column1.title = "Total";
      this.columnList.push(column1);

      let column2 = new columns();
      column2.dataKey = "%";
      column2.title = "Carats %";
      this.columnList.push(column2);
     
      // columns[Object.keys(this.headList).length + 1] = 'Total';
      // for (var i = 0; i < this.xList.length; i++) {
      //   this.yyList[i]["id"] = this.xList[i]["id"];
      //   for (var j = 0; j < Object.keys(this.headList).length; j++) {
      //     this.yyList[i][Object.keys(this.headList)[j]] = this.xList[i][Object.keys(this.headList)[j]];
      //   }
      // }
      //  doc.autoTable(columns, this.xList);
      doc.autoTable(this.columnList, this.xList, {
        styles: {
          overflow: 'linebreak',
          halign: 'left'
        }
      });
      // const elementToPrint = document.getElementById('smtTable'); //The html element to become a pdf
      // const pdf = new jsPDF('p', 'pt', 'a4');
      // pdf.addHTML(elementToPrint, () => {
      //   doc.save('web.pdf');
      // });
      doc.save('Stock Chart Size - ' + this.lotName + '.pdf');

      //   new Angular2Csv(this.xList, 'Stock Chart Quality - ' + this.lotName, options);
    }

    if (this.chartQualityFlag) {
      doc.setFontType('underline');
      doc.text('Stock Chart Quality - ' + this.lotName, 320, 25);
      doc.setFontSize(10);
      doc.text(this.now(), 720, 20);
      doc.text(this.currentUser, 745, 30);
      column.title = "Size";
      column.dataKey = "id";
      this.columnList.push(column);
      for (var i = 1; i <= Object.keys(this.headList).length; i++) {
        let column = new columns();
        column.title = Object.keys(this.headList)[i - 1];
        column.dataKey = Object.keys(this.headList)[i - 1];
        this.columnList.push(column);
      }
      let column1 = new columns();
      column1.dataKey = "Total";
      column1.title = "Total";
      this.columnList.push(column1);

      let column2 = new columns();
      column2.dataKey = "%";
      column2.title = "Carats %";
      this.columnList.push(column2);
      doc.autoTable(this.columnList, this.xList, {
        styles: {
          overflow: 'linebreak',
          halign: 'left'
        }
      });

      doc.save('Stock Chart Quality - ' + this.lotName + '.pdf')
      //    new Angular2Csv(this.xList, 'Stock Chart Size - ' + this.lotName, options);
    }


    if (this.dcSizeFlag) {
      doc.setFontType('underline');
      doc.text('DC Chart Size - ' + this.lotName, 320, 25);
      doc.setFontSize(10);
      doc.text(this.now(), 720, 20);
      doc.text(this.currentUser, 745, 30);
      column.title = "Size";
      column.dataKey = "id";
      this.columnList.push(column);
      for (var i = 1; i <= Object.keys(this.headList).length; i++) {
        let column = new columns();
        column.title = Object.keys(this.headList)[i - 1];
        column.dataKey = Object.keys(this.headList)[i - 1];
        this.columnList.push(column);
      }
      let column1 = new columns();
      column1.dataKey = "Total";
      column1.title = "Total";
      this.columnList.push(column1);

      let column2 = new columns();
      column2.dataKey = "%";
      column2.title = "Carats %";
      this.columnList.push(column2);

      doc.autoTable(this.columnList, this.xList, {
        styles: {
          overflow: 'linebreak',
          halign: 'left'
        }
      });
      doc.save('DC Chart Size - ' + this.lotName + '.pdf');
    }

    if (this.dcQualityFlag) {
      doc.setFontType('underline');
      doc.text('DC Chart Quality - ' + this.lotName, 320, 25);
      doc.setFontSize(10);
      doc.text(this.now(), 720, 20);
      doc.text(this.currentUser, 745, 30);
      column.title = "Size";
      column.dataKey = "id";
      this.columnList.push(column);
      for (var i = 1; i <= Object.keys(this.headList).length; i++) {
        let column = new columns();
        column.title = Object.keys(this.headList)[i - 1];
        column.dataKey = Object.keys(this.headList)[i - 1];
        this.columnList.push(column);
      }
      let column1 = new columns();
      column1.dataKey = "Total";
      column1.title = "Total";
      this.columnList.push(column1);

      let column2 = new columns();
      column2.dataKey = "%";
      column2.title = "Carats %";
      this.columnList.push(column2);

      doc.autoTable(this.columnList, this.xList, {
        styles: {
          overflow: 'linebreak',
          halign: 'left'
        }
      });

      doc.save('DC Chart Quality - ' + this.lotName + '.pdf')


      // new Angular2Csv(this.xList, 'DC Chart Size - ' + this.lotName, options);
    }

    if (this.consignmentSizeFlag) {
      doc.setFontType('underline');
      doc.text('Consignment Chart Size - ' + this.lotName, 320, 25);
      doc.setFontSize(10);
      doc.text(this.now(), 720, 20);
      doc.text(this.currentUser, 745, 30);
      column.title = "Size";
      column.dataKey = "id";
      this.columnList.push(column);
      for (var i = 1; i <= Object.keys(this.headList).length; i++) {
        let column = new columns();
        column.title = Object.keys(this.headList)[i - 1];
        column.dataKey = Object.keys(this.headList)[i - 1];
        this.columnList.push(column);
      }
      let column1 = new columns();
      column1.dataKey = "Total";
      column1.title = "Total";
      this.columnList.push(column1);

      let column2 = new columns();
      column2.dataKey = "%";
      column2.title = "Carats %";
      this.columnList.push(column2);

      doc.autoTable(this.columnList, this.xList, {
        styles: {
          overflow: 'linebreak',
          halign: 'left'
        }
      });
      doc.save('Consignment Chart Size - ' + this.lotName + '.pdf');
    }

    if (this.consignmentQualityFlag) {
      doc.setFontType('underline');
      doc.text('Consignment Chart Quality - ' + this.lotName, 320, 25);
      doc.setFontSize(10);
      doc.text(this.now(), 720, 20);
      doc.text(this.currentUser, 745, 30);
      column.title = "Size";
      column.dataKey = "id";
      this.columnList.push(column);
      for (var i = 1; i <= Object.keys(this.headList).length; i++) {
        let column = new columns();
        column.title = Object.keys(this.headList)[i - 1];
        column.dataKey = Object.keys(this.headList)[i - 1];
        this.columnList.push(column);
      }
      let column1 = new columns();
      column1.dataKey = "Total";
      column1.title = "Total";
      this.columnList.push(column1);
      let column2 = new columns();
      column2.dataKey = "%";
      column2.title = "Carats %";
      this.columnList.push(column2);

      doc.autoTable(this.columnList, this.xList, {
        styles: {
          overflow: 'linebreak',
          halign: 'left'
        }
      });
      doc.save('Consignment Chart Quality - ' + this.lotName + '.pdf');
    }

    if (this.totalSizeFlag) {
      doc.setFontType('underline');
      doc.text('Total Chart Size - ' + this.lotName, 320, 25);
      doc.setFontSize(10);
      doc.text(this.now(), 720, 20);
      doc.text(this.currentUser, 745, 30);
      column.title = "Size";
      column.dataKey = "id";
      this.columnList.push(column);
      for (var i = 1; i <= Object.keys(this.headList).length; i++) {
        let column = new columns();
        column.title = Object.keys(this.headList)[i - 1];
        column.dataKey = Object.keys(this.headList)[i - 1];
        this.columnList.push(column);
      }
      let column1 = new columns();
      column1.dataKey = "Total";
      column1.title = "Total";
      this.columnList.push(column1);
      let column2 = new columns();
      column2.dataKey = "%";
      column2.title = "Carats %";
      this.columnList.push(column2);
      doc.autoTable(this.columnList, this.xList, {
        styles: {
          overflow: 'linebreak',
          halign: 'left'
        }
      });
      doc.save('Total Chart Size - ' + this.lotName + '.pdf');


      //new Angular2Csv(this.xList, 'Total Chart Quality - ' + this.lotName, options);
    }

    if (this.totalQualityFlag) {
      doc.setFontType('underline');
      doc.text('Total Chart quality - ' + this.lotName, 320, 25);
      doc.setFontSize(10);
      doc.text(this.now(), 720, 20);
      doc.text(this.currentUser, 745, 30);
      column.title = "Size";
      column.dataKey = "id";
      this.columnList.push(column);
      for (var i = 1; i <= Object.keys(this.headList).length; i++) {
        let column = new columns();
        column.title = Object.keys(this.headList)[i - 1];
        column.dataKey = Object.keys(this.headList)[i - 1];
        this.columnList.push(column);
      }
      let column1 = new columns();
      column1.dataKey = "Total";
      column1.title = "Total";
      this.columnList.push(column1);

      let column2 = new columns();
      column2.dataKey = "%";
      column2.title = "Carats %";
      this.columnList.push(column2);
      doc.autoTable(this.columnList, this.xList, {
        styles: {
          overflow: 'linebreak',
          halign: 'left'
        }
      });

      doc.save('Total Chart Quality - ' + this.lotName + '.pdf')

      //  new Angular2Csv(this.xList, 'Total Chart Size - ' + this.lotName, options);
    }

  }


  ConvertToCSV() {




    var head = [];
    head[0] = 'Size';
    // if (this.chartSizeFlag) {
    //   // for (var i = 1; i <= this.catList.length; i++) {
    //   //   head[i] = this.catList[i - 1] ;
    //   // }
    //   for (var i = 1; i <= Object.keys(this.headList).length; i++) {
    //     // head[i] = "'" + Object.keys(this.headList)[i - 1] + "'";
    //     head[i] = Object.keys(this.headList)[i - 1];
    //   }
    //   head[Object.keys(this.headList).length + 1] = 'Total';

    //   var options = {
    //     fieldSeparator: ',',
    //     quoteStrings: '"',
    //     decimalseparator: '.',
    //     showLabels: true,
    //     showTitle: true,
    //     useBom: true,
    //     headers: head,
    //     title: 'Lot Name ' + ',' + this.lotName + ',' + 'Date ' + ',' + this.today()
    //   };

    //   new Angular2Csv(this.xList, 'Stock Chart Quality - ' + this.lotName, options);

    // } else {
    //   for (var i = 1; i <= Object.keys(this.headList).length; i++) {
    //     //  head[i] = Object.keys(this.headList)[i - 1];
    //     head[i] = "'" + Object.keys(this.headList)[i - 1] + "'";
    //   }
    //   head[Object.keys(this.headList).length + 1] = 'Total';

    //   var options = {
    //     fieldSeparator: ',',
    //     quoteStrings: '"',
    //     decimalseparator: '.',
    //     showLabels: true,
    //     showTitle: true,
    //     useBom: true,
    //     headers: head,
    //     title: 'Lot Name ' + ',' + this.lotName + ',' + 'Date ' + ',' + this.today()
    //   };

    //   new Angular2Csv(this.xList, 'Stock Chart Size - ' + this.lotName, options);
    // }



    if (this.chartSizeFlag) {
      for (var i = 1; i <= Object.keys(this.headList).length; i++) {
        head[i] = Object.keys(this.headList)[i - 1];
      }
      head[Object.keys(this.headList).length + 1] = 'Total';
      head[Object.keys(this.headList).length + 2] = 'Carats %';
      var options = {
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalseparator: '.',
        showLabels: true,
        showTitle: true,
        useBom: true,
        headers: head,
        title: 'Lot Name ' + ',' + this.lotName + ',' + '\n' + 'Date ' + ',' + this.today() + ',' + '\n' + 'User' + ',' + this.currentUser
      };

      new Angular2Csv(this.xList, 'Stock Chart Size - ' + this.lotName, options);
    }

    if (this.chartQualityFlag) {
      for (var i = 1; i <= Object.keys(this.headList).length; i++) {
        head[i] = "'" + Object.keys(this.headList)[i - 1] + "'";
      }
      head[Object.keys(this.headList).length + 1] = 'Total';
      head[Object.keys(this.headList).length + 2] = 'Carats %';

      var options = {
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalseparator: '.',
        showLabels: true,
        showTitle: true,
        useBom: true,
        headers: head,
        title: 'Lot Name ' + ',' + this.lotName + ',' + '\n' + 'Date ' + ',' + this.today() + ',' + '\n' + 'User' + ',' + this.currentUser
      };

      new Angular2Csv(this.xList, 'Stock Chart Quality - ' + this.lotName, options);
    }


    if (this.dcSizeFlag) {
      for (var i = 1; i <= Object.keys(this.headList).length; i++) {
        head[i] = Object.keys(this.headList)[i - 1];
      }
      head[Object.keys(this.headList).length + 1] = 'Total';
      head[Object.keys(this.headList).length + 2] = 'Carats %';
      var options = {
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalseparator: '.',
        showLabels: true,
        showTitle: true,
        useBom: true,
        headers: head,
        title: 'Lot Name ' + ',' + this.lotName + ',' + '\n' + 'Date ' + ',' + this.today() + ',' + '\n' + 'User' + ',' + this.currentUser
      };

      new Angular2Csv(this.xList, 'DC Chart Size - ' + this.lotName, options);
    }

    if (this.dcQualityFlag) {
      for (var i = 1; i <= Object.keys(this.headList).length; i++) {
        head[i] = "'" + Object.keys(this.headList)[i - 1] + "'";
      }
      head[Object.keys(this.headList).length + 1] = 'Total';
      head[Object.keys(this.headList).length + 2] = 'Carats %';
      var options = {
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalseparator: '.',
        showLabels: true,
        showTitle: true,
        useBom: true,
        headers: head,
        title: 'Lot Name ' + ',' + this.lotName + ',' + '\n' + 'Date ' + ',' + this.today() + ',' + '\n' + 'User' + ',' + this.currentUser
      };

      new Angular2Csv(this.xList, 'DC Chart Quality - ' + this.lotName, options);
    }

    if (this.consignmentSizeFlag) {
      for (var i = 1; i <= Object.keys(this.headList).length; i++) {
        head[i] = Object.keys(this.headList)[i - 1];
      }
      head[Object.keys(this.headList).length + 1] = 'Total';
      head[Object.keys(this.headList).length + 2] = 'Carats %';
      var options = {
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalseparator: '.',
        showLabels: true,
        showTitle: true,
        useBom: true,
        headers: head,
        title: 'Lot Name ' + ',' + this.lotName + ',' + '\n' + 'Date ' + ',' + this.today() + ',' + '\n' + 'User' + ',' + this.currentUser
      };

      new Angular2Csv(this.xList, 'Consignment Chart Size - ' + this.lotName, options);
    }

    if (this.consignmentQualityFlag) {
      for (var i = 1; i <= Object.keys(this.headList).length; i++) {
        head[i] = "'" + Object.keys(this.headList)[i - 1] + "'";
      }
      head[Object.keys(this.headList).length + 1] = 'Total';
      head[Object.keys(this.headList).length + 2] = 'Carats %';
      var options = {
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalseparator: '.',
        showLabels: true,
        showTitle: true,
        useBom: true,
        headers: head,
        title: 'Lot Name ' + ',' + this.lotName + ',' + '\n' + 'Date ' + ',' + this.today() + ',' + '\n' + 'User' + ',' + this.currentUser
      };

      new Angular2Csv(this.xList, 'Consignment Chart Quality - ' + this.lotName, options);
    }

    if (this.totalSizeFlag) {
      for (var i = 1; i <= Object.keys(this.headList).length; i++) {
        head[i] = Object.keys(this.headList)[i - 1];
      }
      head[Object.keys(this.headList).length + 1] = 'Total';
      head[Object.keys(this.headList).length + 2] = 'Carats %';

      var options = {
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalseparator: '.',
        showLabels: true,
        showTitle: true,
        useBom: true,
        headers: head,
        title: 'Lot Name ' + ',' + this.lotName + ',' + '\n' + 'Date ' + ',' + this.today() + ',' + '\n' + 'User' + ',' + this.currentUser
      };

      new Angular2Csv(this.xList, 'Total Chart Size - ' + this.lotName, options);
    }

    if (this.totalQualityFlag) {
      for (var i = 1; i <= Object.keys(this.headList).length; i++) {
        head[i] = "'" + Object.keys(this.headList)[i - 1] + "'";
      }
      head[Object.keys(this.headList).length + 1] = 'Total';
      head[Object.keys(this.headList).length + 2] = 'Carats %';
      var options = {
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalseparator: '.',
        showLabels: true,
        showTitle: true,
        useBom: true,
        headers: head,
        title: 'Lot Name ' + ',' + this.lotName + ',' + '\n' + 'Date ' + ',' + this.today() + ',' + '\n' + 'User' + ',' + this.currentUser
      };

      new Angular2Csv(this.xList, 'Total Chart Quality - ' + this.lotName, options);
    }

  }

  QualityChartReport(type) {
    this.reportStatus = true;

    // this.spinnerService.show();
    this.service.getUniqueQualityOrSizeMISReportByLotId(this.lotMasterName.value, 'quality').subscribe((lst) => {
      this.catList = lst;


      this.service.getLotMISReportByLotId(this.lotMasterName.value, type, this.ItemColor.value).subscribe((lst) => {
        // this.service.getLotMISReportOfSizeOrQualityByLotId(this.lotMasterName.value, 'quality').subscribe((lst) => {
        this.xList = [];
        this.mySettings = this.prepareSetting();
        this.headList = lst;
        if (Object.keys(lst).length > 0) {

          for (var i = 0; i <= this.catList.length; i++) {
            this.xList[i] = [];
          }
          for (var i = 0; i < Object.keys(lst).length; i++) {

            this.totCarats = 0;
            this.wtdSR = 0;
            this.wtdSP = 0;

            this.size = Object.keys(lst)[i].toString();

            this.mySettings.columns[this.size] = { title: '' + this.size };
            this.settings = Object.assign({}, this.mySettings);
            for (var j = 0; j < this.catList.length; j++) {

              if (Object.keys(lst)[i] != undefined) {


                // this.qulty = Object.keys(lst[this.size])[j];
                this.qulty = this.catList[j];
                this.xList[j]["id"] = "'" + this.qulty + "'";
                if (lst[this.size][this.qulty] != undefined) {
                  this.xList[j][Object.keys(lst)[i].toString()] = " " + lst[this.size][this.qulty]["totalCarats"].toFixed(2) + ",\n" +
                    "  " + lst[this.size][this.qulty]["avgRateStock"].toFixed(2) + ",\n" +
                    "  " + lst[this.size][this.qulty]["avgSalePrice"].toFixed(2) + "\n";


                  this.totCarats += lst[this.size][this.qulty]["totalCarats"];
                  this.wtdSR += (lst[this.size][this.qulty]["avgRateStock"] * lst[this.size][this.qulty]["totalCarats"]);
                  this.wtdSP += (lst[this.size][this.qulty]["avgSalePrice"] * lst[this.size][this.qulty]["totalCarats"]);
                  this.loading = false;
                }
                //Yasar
                else {
                  this.qulty = this.catList[j];
                  this.xList[j]["id"] = "'" + this.qulty + "'";
                  //   this.xList[j]["id"] = this.qulty;
                  this.xList[j][Object.keys(lst)[i].toString()] = " 0 \n, 0 \n, 0";
                  this.loading = false;
                }
              }

            }
            this.xList[this.catList.length]["id"] = "Total";
            this.xList[this.catList.length][Object.keys(lst)[i].toString()] = "  " + this.totCarats.toFixed(2) + ",\n" +
              " " + (this.totCarats == 0 ? "0" : (this.wtdSR / this.totCarats).toFixed(2)).toString() + ",\n" +
              " " + (this.totCarats == 0 ? "0" : (this.wtdSP / this.totCarats).toFixed(2)).toString() + "\n";
          }
          var s: string;

          this.mySettings.columns["Total"] = { title: 'Total' };
          this.settings = Object.assign({}, this.mySettings);

          this.mySettings.columns["%"] = { title: 'Carats %' };
          this.settings = Object.assign({}, this.mySettings);

          for (var i = 0; i < this.xList.length; i++) {
            this.wtdSR = 0;
            this.wtdSP = 0;
            this.totCarats = 0;
            for (var j = 0; j < Object.keys(lst).length; j++) {

              if (this.xList[i][Object.keys(lst)[j].toString()] != undefined) {
                console.log(this.xList[i][Object.keys(lst)[j].toString()].split(', '));
                s = this.xList[i][Object.keys(lst)[j].toString()].split(',')[0];
                this.totCarats += Number(s.replace("", ''));
                s = this.xList[i][Object.keys(lst)[j].toString()].split(',')[2];
                this.wtdSP += Number(s) * Number(this.xList[i][Object.keys(lst)[j].toString()].split(',')[0].replace("", ''));
                s = this.xList[i][Object.keys(lst)[j].toString()].split(',')[1];
                this.wtdSR += Number(s.replace("", '')) * Number(this.xList[i][Object.keys(lst)[j].toString()].split(',')[0].replace("", ''));
              }

            }
            this.xList[i]["Total"] = this.totCarats;
            this.xList[i]["Total"] = "  " + this.totCarats.toFixed(2) + ",\n" +
              "  " + (this.totCarats == 0 ? "0" : (this.wtdSR / this.totCarats).toFixed(2)).toString() + ",\n" +
              "  " + (this.totCarats == 0 ? "0" : (this.wtdSP / this.totCarats).toFixed(2)).toString() + "\n" +
              "\n";
          }

          for (var i = 0; i < this.xList.length; i++) {
            this.wtdSR = 0;
            this.wtdSP = 0;
            this.grandTot = 0;
            for (var j = 0; j < Object.keys(lst).length; j++) {

              if (this.xList[i][Object.keys(lst)[j].toString()] != undefined) {
                // console.log(this.xList[i][Object.keys(lst)[j].toString()].split(', '));
                s = this.xList[i][Object.keys(lst)[j].toString()].split(',')[0];
                this.grandTot += Number(s.replace("", ''));
                // s = this.xList[i][Object.keys(lst)[j].toString()].split(',')[2];
                // this.wtdSP += Number(s) * Number(this.xList[i][Object.keys(lst)[j].toString()].split(',')[0].replace("", ''));
                // s = this.xList[i][Object.keys(lst)[j].toString()].split(',')[1];
                // this.wtdSR += Number(s.replace("", '')) * Number(this.xList[i][Object.keys(lst)[j].toString()].split(',')[0].replace("", ''));
              }

            }
            this.xList[i]["%"] = ((this.grandTot / this.totCarats)*100).toFixed(2);
            // this.xList[i]["Total"] = "  " + this.totCarats.toFixed(2) + ",\n" +
            //   "  " + (this.totCarats == 0 ? "0" : (this.wtdSR / this.totCarats).toFixed(2)).toString() + ",\n" +
            //   "  " + (this.totCarats == 0 ? "0" : (this.wtdSP / this.totCarats).toFixed(2)).toString() + "\n" +
            //   "\n";
          }





        } else {
          this.reportStatus = false;
          const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
          activeModal.componentInstance.showHide = false;
          activeModal.componentInstance.modalHeader = 'Alert';
          activeModal.componentInstance.modalContent = 'No items available!';
        }
        this.source.setPaging(2, 50);
        this.source.load(this.xList);
        this.loading = false;
        //  console.log(lst);
      });
      //  this.spinnerService.hide();
    });

  }

  finally() {
    this.isLoading = false;
    this.misForm.markAsPristine();
  }

  private createForm() {
    this.misForm = this.fb.group({

      'lotMasterName': ['', Validators.required],
      'ItemColor': ['', Validators.required],

    });


    this.lotMasterName = this.misForm.controls['lotMasterName'];
    this.ItemColor = this.misForm.controls['ItemColor'];




    this.lotMasterName.valueChanges.subscribe(val => {
      const index = this.lotList.findIndex(item => {
        if (val == item.lotId) {
          this.lotName = item.lotName;
          if (this.lotName == 'COLOUR BROWN MQ PS') {
            this.isColorBrownLot = true;
            this.service.getColorQualityForLot75().subscribe(lst => {
              this.ItemColorList = lst;
              this.ItemColor.setValue(lst[0]);
            });

          }
          else this.isColorBrownLot = false;
          this.ItemColor.setValue(-1);
          return true;
        }
      })
    })
  }
}
