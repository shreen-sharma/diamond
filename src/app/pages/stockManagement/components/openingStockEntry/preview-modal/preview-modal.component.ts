import { Component, Injectable, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { OpeningStockEntryService } from '.././openingStockEntry.service';
import { DefaultNumberComponent } from '../../../../../shared/defaultNumberComponent/defaultNumber.components';

import { LocalDataSource } from 'ng2-smart-table';
import { LotItemCreationService } from '../../lotItemCreation/lotItemCreation.service';
import { LotService } from '../../lots/lot.service';
import { CategoryService } from '.../../app/pages/masters/components/categories/category.service';
import { ItemDetailsService } from '../../../../masters/components/itemDetails/itemDetails.service';

class ItemDetails {
  catName: string;
  lotName: string;
  itemName: string;
  totalCarets: number;
  avgRate: number;
 }

@Component({
  selector: 'add-service-modal',
  styleUrls: [('./preview-modal.component.scss')],
  templateUrl: './preview-modal.component.html'
})

export class PreviewModalOpen implements OnInit {

  itemOSList: ItemDetails[] = [];
  //aList: any[] = [];
  modalHeader: string;
  settings: any;
  id: number = 0;

  ngOnInit() {
    this.settings = this.prepareSetting();
  }
  prepareSetting() {
    return {
      hideSubHeader: 'true',
      actions: false,

      edit: {
        editButtonContent: '<i class="ion-edit"></i>',
        saveButtonContent: '<i class="ion-checkmark"></i>',
        cancelButtonContent: '<i class="ion-close"></i>',
      },
      delete: {
        deleteButtonContent: '<i class="ion-trash-a"></i>',
      },
      pager: {
        display: true,
        perPage: 5
      },
      columns: {
        catName: {
          title: 'Category Name',
          type: 'string',
        },
        lotName: {
          title: 'Lot Name',
          type: 'string',
        },
        itemName: {
          title: 'Item Name',
          type: 'string',
        },
        totalCarets: {
          title: 'Total Carats',
          type: 'string',
        },
        avgRate: {
          title: 'Average Rate',
          type: 'string',
        },
      }
    };
  }
  source: LocalDataSource = new LocalDataSource();
  constructor(private activeModal: NgbActiveModal,
      private service: OpeningStockEntryService) {
      this.service.getAllLotTransactionByTransType('OS').subscribe((data) =>{
        data.forEach(item => {
          const itemList = new ItemDetails();
          itemList.itemName = item.lotItemByToLotItemId.itemName;
          itemList.catName = item.lotItemByToLotItemId.itemCategoryName;
          itemList.lotName = item.lotItemByToLotItemId.lotName;                  
          itemList.avgRate = item.avgRate;
          itemList.totalCarets = item.totalCarets;
          this.itemOSList.push(itemList);
        }); 
      this.source.load(this.itemOSList);
      });
  }

  closeModal() {
    this.activeModal.close();
  }
  okModal() {
    this.activeModal.close();
  }
}
