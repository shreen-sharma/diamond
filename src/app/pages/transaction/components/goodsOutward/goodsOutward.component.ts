import {Component} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';

import { AuthenticationService } from '../../../../core/authentication/authentication.service';
import { Logger } from '../../../../core/logger.service';
import { GoodsOutwardService } from './goodsOutward.service';

const log = new Logger('goodsOutward');

@Component({
  selector: 'goodsOutward',
  templateUrl: './goodsOutward.html',
  styleUrls: ['./goodsOutward.scss']
})
export class GoodsOutward {


          query = '';
          pageTitle = 'Goods Outward For Manufacturing';

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
              outwardNo: {
                title: 'Outward No.',
                type: 'number'
              },
              processedCts: {
                title: 'Processed Cts',
                type: 'number'
              },
              processLoss: {
                title: 'Process Loss',
                type: 'number'
              },
              unprocessedCts: {
                title: 'Unprocessed Cts',
                type: 'number'
              },
              totalReturnCts: {
                title: 'Total Return Cts',
                type: 'number'
              },
            }
          };

          source: LocalDataSource = new LocalDataSource();

          constructor(private router: Router,
            private service: GoodsOutwardService,
            private route: ActivatedRoute,
            private authService: AuthenticationService) {
            this.service.getData().then((data) => {
              this.source.load(data);
            });
          }

        handleCreate() {
            this.router.navigate(['../createGoodsOutward'], { relativeTo: this.route });
          }

          handleEdit( row: any ) {
            const goodsOutward = row.data;
            this.router.navigate(['../editGoodsOutward', goodsOutward.id], { relativeTo: this.route });
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
