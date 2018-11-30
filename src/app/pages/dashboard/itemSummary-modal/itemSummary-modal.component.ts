import { ItemSummaryService } from './itemSummary-modal.service';
import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LocalDataSource } from 'ng2-smart-table';
import { LotItemCreationService } from '.../../app/pages/stockManagement/components/lotItemCreation/lotItemCreation.service';
import { LotService } from '.../../app/pages/stockManagement/components/lots/lot.service';
import { DefaultNumberComponent } from './../../../shared/defaultNumberComponent/defaultNumber.components';
import { ItemChartService } from 'app/pages/dashboard/itemChart/itemChart.service';
import { IMultiSelectOption, IMultiSelectSettings } from 'angular-2-dropdown-multiselect';

@Component({
  selector: 'itemSummary-modal',
  styleUrls: [('./itemSummary-modal.component.scss')],
  templateUrl: './itemSummary-modal.component.html'
})

export class ItemSummaryModal implements OnInit {

//   mySettings: IMultiSelectSettings = {
   
//     displayAllSelectedText: false
// };
//   optionsModel: number[];
//   myOptions: IMultiSelectOption[];

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
     itemName:{
      title: 'Item Name',
      type: 'string',
     },
     carats: {
        title: 'CTS',
        type: 'string'
      },
      rate: {
        title: 'Rate',
        type: 'string'
      },
      amount: {
        title: 'Amount',
        type: 'string'
      },
      exchangeRate: {
        title: 'Exch Rate',
        type: 'string'
      },
      amountInRs: {
        title: 'Amount Rs',
        type: 'string'
      },
      itemSellingPrice: {
        title: 'Selling Price',
        type: 'string'
      }, totalSellingAmount: {
         title: 'Total Selling Amount',
         type: 'string'
      }
    }
  }
};

prepareLotSetting() {
  return {
  actions: false,
  
  columns: {
    lotName: {
      title: 'LOT Name',
      type: 'string'
   },
   carats: {
      title: 'CTS',
      type: 'string'
    },
    rate: {
      title: 'Rate',
      type: 'string'
    },
    amount: {
      title: 'Amount',
      type: 'string'
    },
    exchangeRate: {
      title: 'Exch Rate',
      type: 'string'
    },
    amountInRs: {
      title: 'Amount Rs',
      type: 'string'
    },
  }
}
};
prepareItemSetting() {
  return {
  actions: false,
  
  columns: {
   itemName:{
    title: 'Item Name',
    type: 'string',
   },
   carats: {
      title: 'CTS',
      type: 'string'
    },
    rate: {
      title: 'Rate',
      type: 'string'
    },
    amount: {
      title: 'Amount',
      type: 'string'
    },
    exchangeRate: {
      title: 'Exch Rate',
      type: 'string'
    },
    amountInRs: {
      title: 'Amount Rs',
      type: 'string'
    },
    
  }
}
};
  constructor(private lotItemService: LotItemCreationService,
    private service: ItemSummaryService,
      private lotService: LotService,
     private activeModal: NgbActiveModal) {

      this.service.getStockSummary(3).subscribe((data) => {
       
        this.settings = this.prepareSetting();
        this.source.load(data);
      });
   
  }


  ngOnInit() {
  //   this.myOptions = [
  //     { id: 1, name: 'Lot' },
  //     { id: 2, name: 'Item' },
  // ];
}
onParamChange(event) {
  this.service.getStockSummary(event).subscribe((data) => {
    debugger
    if(event == 1){
      this.settings = this.prepareLotSetting();
      this.source.load(data);
    } 
    if(event == 2){
      this.settings = this.prepareItemSetting();
      this.source.load(data);
    } 
     if(event == 3) {
     this.settings = this.prepareSetting();
     this.source.load(data);
    }
   });

}

  closeModal() {
    this.activeModal.close();
  }
}
