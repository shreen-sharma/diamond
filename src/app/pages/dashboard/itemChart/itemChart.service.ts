import { HttpService } from '../../../core/http';
import { Observable } from 'rxjs/Rx';
import {Injectable} from '@angular/core';
import {BaThemeConfigProvider, colorHelper} from '../../../theme';

@Injectable()
export class ItemChartService {

  paramValueId: String;

  constructor(private _baConfig: BaThemeConfigProvider, private http: HttpService) {
  }


  getAllItemsByParameterId(parameterId: any): Observable<any> {
    return this.http.get('/lot/getAllItemsByParameterId/' + parameterId).map(req => req.json());
  }

  getPieChartData(parameterTypeId: number): Observable<any> {
      return this.http.get('/getTotalItemsByParameterMaster/' + parameterTypeId).map(res => {
      let data = res.json(), labels: string[]=[], param:string[]=[], totals: number[]=[];
      data.forEach(item => {
        labels.push(item.paramValue);
        totals.push(item.totalItem);
        param.push(item.parameterValueId);
      });

      return this.prepareChartData(labels, param, totals);
    }); 
  }

  prepareChartData(labels, param, totals): any {
    const chartClrs = this._baConfig.get().colors.dashboard;

    return {
      type: 'doughnut',
      options: {
        animation: {animateRotate: true, animateScale: false},
        legend: {
          display: true,
          position: 'bottom',
          labels: {
              fontColor: '#fff'
          }
        }
      },
      data: {
        labels: labels,
        param: param,
        datasets: [{
          data: totals,
          backgroundColor: [
            chartClrs.white,
            chartClrs.gossip,
            chartClrs.silverTree,
            chartClrs.surfieGreen,
            chartClrs.blueStone
          ],
          hoverBackgroundColor: [
            colorHelper.shade(chartClrs.white, 15),
            colorHelper.shade(chartClrs.gossip, 15),
            colorHelper.shade(chartClrs.silverTree, 15),
            colorHelper.shade(chartClrs.surfieGreen, 15),
            colorHelper.shade(chartClrs.blueStone, 15),
          ]
        }]
      }
    };
  }
}
