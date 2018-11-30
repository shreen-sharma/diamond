import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LocalDataSource } from 'ng2-smart-table';
import { LotItemCreationService } from '.../../app/pages/stockManagement/components/lotItemCreation/lotItemCreation.service';
import { LotService } from '.../../app/pages/stockManagement/components/lots/lot.service';
import { DefaultNumberComponent } from './../../../../shared/defaultNumberComponent/defaultNumber.components';
import { ItemChartService } from 'app/pages/dashboard/itemChart/itemChart.service';

@Component({
  selector: 'itemChartDetails-modal',
  styleUrls: [('./itemChartDetails-modal.component.scss')],
  templateUrl: './itemChartDetails-modal.component.html'
})

export class ItemChartDetailsModal implements OnInit {

  lotList: any [] = [];
  lotCodeList: any [] = [];
  settings: any;
  modalHeader: string;

  source: LocalDataSource = new LocalDataSource();

  prepareSetting() {
    return {
    actions: false,
    
    columns: {
      lotName: {
        title: 'LOT Name',
        type: 'string'
     },
      itemCategoryName: {
        title: 'Category',
        type: 'string'
      },
      itemName: {
        title: 'Item Name',
        type: 'string'
      },
      avgRate: {
        title: 'Rate',
        type: 'string'
      },
      totalCarets: {
        title: 'Total Carats',
        type: 'string',
        editor: {
          type: 'custom',
          component: DefaultNumberComponent,
        }
      },
    }
  }
};

  constructor(private lotItemService: LotItemCreationService,
      private service: ItemChartService,
      private lotService: LotService,
     private activeModal: NgbActiveModal) {
      const paramId = this.service.paramValueId
    this.service.getAllItemsByParameterId(paramId).subscribe((data) => {
      debugger
      this.settings = this.prepareSetting();
       this.source.load(data);
    });


    // this.lotService.getData().subscribe( (lotList) => {
    //   this.source.load(lotList);
    //   lotList.forEach(lot => {
    //     this.lotList.push({'value': lot.lotId, 'title': lot.lotName})
           
    //   });
    // });
  }

  getTitleValue(list: any[], value: string) {
  // debugger;
  const len: number = list.length;
  for (let i = 0; i < len; i++) {
    if (list[i]['value'] === value) {
      return list[i]['title'];
    }
  }
  return value;
}

  ngOnInit() {}

  closeModal() {
    this.activeModal.close();
  }
}
