import {Component} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';

import { AuthenticationService } from '../../../../core/authentication/authentication.service';
import { Logger } from '../../../../core/logger.service';
import { GoodsInwardService } from './goodsInward.service';

const log = new Logger('goodsInward');

@Component({
  selector: 'goodsInward',
  templateUrl: './goodsInward.html',
  styleUrls: ['./goodsInward.scss']
})
export class GoodsInward {


          query = '';
          pageTitle = 'Goods Inward For Manufacturing';

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
              selectParty: {
                title: 'Select Party',
                type: 'string'
              },
              process: {
                title: 'Process',
                type: 'string'
              },
              inwardNo: {
                title: 'Inward No.',
                type: 'number'
              },
              jangadNo: {
                title: 'Jangad No.',
                type: 'number'
              },
              lot: {
                title: 'Lot',
                type: 'string'
              },
            }
          };

          source: LocalDataSource = new LocalDataSource();

          constructor(private router: Router,
            private service: GoodsInwardService,
            private route: ActivatedRoute,
            private authService: AuthenticationService) {
            this.service.getData().then((data) => {
              this.source.load(data);
            });
          }

        handleCreate() {
            this.router.navigate(['../createGoodsInward'], { relativeTo: this.route });
          }

          handleEdit( row: any ) {
            const goodsInward = row.data;
            this.router.navigate(['../editGoodsInward', goodsInward.id], { relativeTo: this.route });
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
