import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { Http } from '@angular/http';
import { AuthenticationService } from '../../../../core/authentication/authentication.service';
import { Logger } from '../../../../core/logger.service';
import { IssueDetailService } from './issueDetail.service';

const log = new Logger('Users');

@Component({
  selector: 'issueDetail',
  templateUrl: './issueDetails.html',
  styleUrls: ['./issueDetails.scss']
})
export class IssueDetails {

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
      /* id: {
        title: 'ID',
        type: 'number'
      }, */
      employeeMasterDTO: {
        title: 'Employee',
        type: 'string',
        // valuePrepareFunction: value.empName
      },
      processMasterDTO: {
        title: 'Process Type',
        type: 'string',
        // valuePrepareFunction: value.processName
      },
      issueDate: {
        title: 'Issue Date',
        type: 'string'
      },
      issueNo: {
        title: 'Issue No',
        type: 'string'
      },
      totalPcs: {
        title: 'Total Issued Carats',
        type: 'string'
      },
      totalCarats: {
        title: 'Total Issued Pieces',
        type: 'string'
      }
    }
  };

  source: LocalDataSource = new LocalDataSource();

  constructor(private router: Router,
    private route: ActivatedRoute,
    private service: IssueDetailService,
    private authService: AuthenticationService) {

    this.service.getData().subscribe((data) => {
      this.source.load(data);
    });
  }

  handleCreate() {
    this.router.navigate(['../createIssueDetail'], { relativeTo: this.route });
  }

  handleEdit( row: any ) {
    const issueDetail = row.data;
    this.router.navigate(['../editIssueDetail', issueDetail.empIssId], { relativeTo: this.route });
  }

  onDeleteConfirm(event: any): void {
    if (window.confirm('Are you sure you want to delete?')) {
      this.service.deleteIssueDetails( event.data.empIssId).subscribe( response => {
        // event.confirm.resolve();
        this.service.getData().subscribe((data) => {
          this.source.load(data);
        });
     });
    } else {
      // event.confirm.reject();
    }
  }

}
