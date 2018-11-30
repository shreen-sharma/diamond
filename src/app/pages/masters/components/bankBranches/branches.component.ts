import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { Http } from '@angular/http';
import { AuthenticationService } from '../../../../core/authentication/authentication.service';
import { Logger } from '../../../../core/logger.service';
import { BranchService } from './branch.service';
import { CommonService } from '../common/common.service';

const log = new Logger('branches');

@Component({
  selector: 'branches',
  templateUrl: './branches.html',
  styleUrls: ['./branches.scss']
})
export class BankBranch {

  query = '';
  bankList: any[];
  settings: any;
  accessList: any[] = [];
  source: LocalDataSource = new LocalDataSource();
  public isEdit: boolean;


  prepareSetting() {
    return {
      actions: {
        position: 'right',
        add: this.accessList.includes("ADD"),
        edit: this.isEdit,
        delete: this.accessList.includes("DELETE"),
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
        bankId: {
          title: 'Bank Name',
          editor: {
            type: 'list',
            config: {
              selectText: 'select',
              list: this.bankList,
            },
          },
          filter: {
            type: 'list',
            config: {
              selectText: 'All',
              list: this.bankList,
            },
          },
          valuePrepareFunction: value => this.getBankById(value)
        },
        bankBrName: {
          title: 'Branch Name',
          type: 'string'
        },
        bankBrCode: {
          title: 'Branch Code',
          type: 'string'
        }
      }
    };
  }

  getBankById(bankId: any) {
    const len: number = this.bankList.length;
    for (let i = 0; i < len; i++) {
      if (this.bankList[i].value === bankId) {
        return this.bankList[i].title;
      }
    }
    return bankId;

  }

  constructor(private router: Router,
    private service: BranchService,
    private commonService: CommonService,
    private route: ActivatedRoute,
    private authService: AuthenticationService) {
    this.accessList = this.authService.getUserAccessOfMenu('bankBranch');
    const edit = this.accessList.includes("UPDATE");
    const view = this.accessList.includes("GET");
    if (edit == true) {
      this.isEdit = true;
    } else if (view == true) {
      this.isEdit = true;
    } else {
      this.isEdit = false;
    }
    this.commonService.getAllCommonMasterByType('BK').subscribe((bankList) => {
      this.bankList = [];
      bankList.forEach(bank => {
        this.bankList.push({ value: bank.id, title: bank.name })
      });
      if (this.bankList) {
        this.settings = this.prepareSetting();
      }
    });
    this.service.getData().subscribe((data) => {
      this.source.load(data);
    });
  }

  handleCreate() {
    this.router.navigate(['../createBranch'], { relativeTo: this.route });
  }

  handleEdit(row: any) {
    let view = this.accessList.includes("GET");
    let edit = this.accessList.includes("UPDATE");
    if (view == true && edit == true) {
      view = false;
    } else if (view == false && edit == true) {
      view = false;
    }
    const branch = row.data;
    this.router.navigate(['../editBranch/' + view + '/' + branch.bankBrId], { relativeTo: this.route });
  }

  onDeleteConfirm(event: any): void {
    if (window.confirm('Are you sure you want to delete?')) {
      this.service.deleteBranch(event.data.bankBrId).subscribe(response => {
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
