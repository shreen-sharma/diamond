import * as jquery from 'jquery';
import { ParaListService } from '../../masters/components/parameterList/index';
import { Observable } from 'rxjs/Rx';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ItemChartDetailsModal } from './itemChartDetails-modal/itemChartDetails-modal.component';
import * as events from 'events';
import {Component} from '@angular/core';

import {ItemChartService} from './itemChart.service';
import * as Chart from 'chart.js';

@Component({
  selector: 'item-chart',
  templateUrl: './itemChart.html',
  styleUrls: ['./itemChart.scss']
})

// TODO: move chart.js to it's own component
export class ItemChart {


  public doughnutData: any;
  public parameters: any[];
  public parameter: any;
  public chart: any;
  public el:any;
  constructor(private itemChartService: ItemChartService,
    private modalService: NgbModal,
    private paramService: ParaListService) {
    paramService.getData().subscribe(params => {
        this.parameters = params;
        this.parameter = params[0];
        if(params.length) {
          this.loadChartDataByParameter(params[0].paramId);
        }
      })
  }

  onParamChange() {
    
    this.loadChartDataByParameter(this.parameter.paramId);
  }

  loadChartDataByParameter(paramId: number) {
    debugger
    this.itemChartService.getPieChartData(paramId).subscribe(data => {
      this.doughnutData = data;
      this._loadDoughnutCharts();
    });
  }

  ngAfterViewInit() {
    //this._loadDoughnutCharts();
  }

  private _loadDoughnutCharts() {
   this.el = jQuery('.chart-area').get(0) as HTMLCanvasElement;
   if(this.chart){
     //reset chart
      this.chart.destroy();
   } 
    this.chart = new Chart(this.el, this.doughnutData);
     
    this.el.onclick =  evt => {
      const activePoints = this.chart.getElementsAtEvent(evt);
      const firstPoint = activePoints[0];
      const label = this.chart.data.labels[firstPoint._index];
      const value = this.chart.data.datasets[firstPoint._datasetIndex].data[firstPoint._index];
      this.itemChartService.paramValueId = this.chart.data.param[firstPoint._index];
      //alert(label + ': ' + value);
      debugger;
      this.showItemChartDetails(label);
    };
  }

  private showItemChartDetails(modalTitle) {
    const activeModal = this.modalService.open(ItemChartDetailsModal, {size: 'lg'});
    activeModal.componentInstance.modalHeader = modalTitle;
  }
}
