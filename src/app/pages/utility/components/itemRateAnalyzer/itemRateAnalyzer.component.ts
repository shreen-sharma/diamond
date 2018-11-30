import {Component} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';

import { AuthenticationService } from '../../../../core/authentication/authentication.service';
import { Logger } from '../../../../core/logger.service';
import { ItemRateAnalyzerService } from './itemRateAnalyzer.service';

const log = new Logger('ItemRateAnalyzer');

@Component({
  selector: 'ItemRateAnalyzer',
  templateUrl: './itemRateAnalyzer.html',
  styleUrls: ['./itemRateAnalyzer.scss']
})
export class ItemRateAnalyzer {

  query = '';

  settings = {
    actions: {
      position: 'right'
    },
    mode: 'external',
    add: {
      addButtonContent: '<i class="ion-ios-plus-outline"></i>',
      createButtonContent: '<i class="ion-checkmark"></i>',
      cancelButtonContent: '<i class="ion-close"></i>',
    },
    edit: {
      editButtonContent: '<i class="ion-edit"></i>',
      saveButtonContent: '<i class="ion-checkmark"></i>',
      cancelButtonContent: '<i class="ion-close"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="ion-trash-a"></i>',
      confirmDelete: true
    },
    columns: {
      company: {
        title: 'Company',
        type: 'string'
      },
      partyType: {
        title: 'Party Type',
        type: 'string'
      },
      party: {
        title: 'Party',
        type: 'string'
      },
      category: {
        title: 'category',
         type: 'string'
      },
      item: {
        title: 'Item',
        type: 'string'
      },
    }
  };

  source: LocalDataSource = new LocalDataSource();

  constructor(private router: Router,
    private route: ActivatedRoute,
    private service: ItemRateAnalyzerService,
    private authService: AuthenticationService) {
    this.service.getData().then((data) => {
      this.source.load(data);
    });
  }

  handleCreate() {
    this.router.navigate(['../createItemRateAnalyzer'], { relativeTo: this.route });
  }

  handleEdit( row: any ) {
    const ItemRateAnalyzer = row.data;
    this.router.navigate(['../editItemRateAnalyzer', ItemRateAnalyzer.id], { relativeTo: this.route });
  }

  onDeleteConfirm(event: any): void {
    if (window.confirm('Are you sure you want to delete?')) {
      // event.confirm.resolve();
      this.service.getData().then((data) => {
        this.source.load(data);
      });
    } else {
      // event.confirm.reject();
    }
  }

}
