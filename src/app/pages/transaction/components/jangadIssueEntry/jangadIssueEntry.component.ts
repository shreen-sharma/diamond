import {Component} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';

import { AuthenticationService } from '../../../../core/authentication/authentication.service';
import { Logger } from '../../../../core/logger.service';
import { JangadIssueEntryService } from './jangadIssueEntry.service';

const log = new Logger('jangadIssueEntry');

@Component({
  selector: 'jangadIssueEntry',
  templateUrl: './jangadIssueEntry.html',
  styleUrls: ['./jangadIssueEntry.scss']
})
export class JangadIssueEntry {


          query = '';
          pageTitle = 'Jangad Issue Entry';

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
              lot: {
                title: 'Lot',
                type: 'string'
              },
              issueDate: {
                title: 'Issue Date',
                type: 'date'
              },
              jangadNo: {
                title: 'Jangad No.',
                type: 'number'
              },
              jangadFormat: {
                title: 'Jangad Format',
                type: 'string'
              }
            }
          };

          source: LocalDataSource = new LocalDataSource();

          constructor(private router: Router,
            private service: JangadIssueEntryService,
            private route: ActivatedRoute,
            private authService: AuthenticationService) {
            this.service.getData().then((data) => {
              this.source.load(data);
            });
          }

        handleCreate() {
            this.router.navigate(['../createJangadIssueEntry'], { relativeTo: this.route });
          }

          handleEdit( row: any ) {
            const jangadIssueEntry = row.data;
            this.router.navigate(['../editJangadIssueEntry', jangadIssueEntry.id], { relativeTo: this.route });
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
