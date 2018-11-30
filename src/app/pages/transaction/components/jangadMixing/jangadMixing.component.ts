import {Component} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';

import { AuthenticationService } from '../../../../core/authentication/authentication.service';
import { Logger } from '../../../../core/logger.service';
import { JangadMixingService } from './jangadMixing.service';

const log = new Logger('JangadMixing');

@Component({
  selector: 'jangadMixing',
  templateUrl: './jangadMixing.html',
  styleUrls: ['./jangadMixing.scss']
})
export class JangadMixing {

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
      /* id: {
        title: 'ID',
        type: 'number'
      }, */
      selectPartyAccount: {
        title : 'Select Party Account',
        type: 'string'
      },
      jangadMixingDate: {
        title: 'Jangad Mixing Date',
        type: 'string'
      },
      selectLot: {
        title: 'Select Lot',
        type: 'string'
      }
    }
  };

  source: LocalDataSource = new LocalDataSource();

  constructor(private router: Router,
    private service: JangadMixingService,
    private route: ActivatedRoute,
    private authService: AuthenticationService) {
    this.service.getData().then((data) => {
      this.source.load(data);
    });
  }

  handleCreate() {
    this.router.navigate(['../createJangadMixing'], { relativeTo: this.route });
  }

  handleEdit( row: any ) {
    const jangadMixing = row.data;
    this.router.navigate(['../editJangadMixing', jangadMixing.id], { relativeTo: this.route });
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
