import { ItemDetailsService } from './../../../masters/components/itemDetails/itemDetails.service';
import { DefaultNumberComponent } from './../../../../shared/defaultNumberComponent/defaultNumber.components';
import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';

import { AuthenticationService } from '../../../../core/authentication/authentication.service';
import { Logger } from '../../../../core/logger.service';
import { LotItemCreationService } from './lotItemCreation.service';
import { LotService } from '../lots/lot.service';
import { CategoryService } from '.../../app/pages/masters/components/categories/category.service';


const log = new Logger('lotItemCreation');

@Component({
  selector: 'lotItemCreation',
  templateUrl: './lotItemCreation.html',
  styleUrls: ['./lotItemCreation.scss']
})
export class LotItemCreationComponent {

  query = '';
  accessList: any[] = [];
  lotList: any[] = [];
  catList: any[] = [];
  itemList: any[] = [];
  lotTransactionList: any[] = [];
  settings: any;
  errorMessage: string;
  successMessage: string;

  source: LocalDataSource = new LocalDataSource();

  prepareSetting() {
    return {
      actions: {
        position: 'right',
        add: this.accessList.includes("ADD"),
        //   edit: this.accessList.includes("GET"),
        delete: this.accessList.includes("DELETE"),
        edit: false,

      },
      mode: 'external',
      add: {
        addButtonContent: '<i class="ion-ios-plus-outline"></i>',
        createButtonContent: '<i class="ion-checkmark"></i>',
        cancelButtonContent: '<i class="ion-close"></i>',
        confirmCreate: true,
      },
      edit: {
        editButtonContent: '<i class="ion-edit"></i>',
        saveButtonContent: '<i class="ion-checkmark"></i>',
        cancelButtonContent: '<i class="ion-close"></i>',
        confirmSave: true,
      },
      delete: {
        deleteButtonContent: '<i class="ion-trash-a"></i>',
        confirmDelete: true
      },
      columns: {

        lotName: {
          title: 'Lot Name',
          type: 'string'
        },
        itemName: {
          title: 'Item Name',
          type: 'string',
        },
        totalCarets: {
          title: 'Total Carats',
          type: 'string',
          editor: {
            type: 'custom',
            component: DefaultNumberComponent,
          }
        },
        avgRate: {
          title: 'Average Rate',
          type: 'string',
          editor: {
            type: 'custom',
            component: DefaultNumberComponent,
          }
        },
      }
    };
  }


  constructor(private router: Router,
    private service: LotItemCreationService,
    private route: ActivatedRoute,
    private authService: AuthenticationService) {

    this.accessList = this.authService.getUserAccessOfMenu('lotItemCreation');

    this.service.getAllLotItemCreation().subscribe((data) => {
      this.settings = this.prepareSetting();
      this.source.load(data);
    });

  }

  handleCreate() {
    this.router.navigate(['../createLotItemCreation'], { relativeTo: this.route });
  }


  onDeleteConfirm(event: any): void {
    if (window.confirm('Are you sure you want to delete?')) {
      this.service.deleteLotItemCreation(event.data.lotItemId).subscribe(response => {
        console.log(response);
        this.successMessage = response._body;
        setTimeout(() => this.successMessage = null, 5000);
        this.service.getAllLotItemCreation().subscribe((data) => {
          this.source.load(data);
        });
      }, error => {
        this.errorMessage = error._body;
        log.debug(`delete error: ${error}`);
      })
    } else {
      event.confirm.reject();
    }




  }
}
