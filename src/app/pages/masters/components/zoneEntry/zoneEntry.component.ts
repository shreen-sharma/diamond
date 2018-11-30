import { ZoneEntryService } from './zoneEntry.service';
import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { Http } from '@angular/http';
import { AuthenticationService } from '../../../../core/authentication/authentication.service';
import { Logger } from '../../../../core/logger.service';
import { CommonService } from '../common/common.service';

const log = new Logger('ZoneEntry');

@Component({
  selector: 'ZoneEntry',
  templateUrl: './ZoneEntry.html',
  styleUrls: ['./ZoneEntry.scss']
})
export class ZoneEntry {

  query = '';
  zoneList = [];
  countryList = [];
  stateList = [];
  cityList = [];
  settings: any;
  allGeoInfoList: any[] = [];
  allCurrencyList: any[] = [];
  parentList: any[] = [];
  currList: any[] = [];
  accessList: any[] = [];
  // updateRecord: boolean = false;
  source: LocalDataSource = new LocalDataSource();



  prepareSetting() {
    return {
      actions: {
        position: 'right',
        add: this.accessList.includes("ADD"),
        edit: this.accessList.includes("UPDATE"),
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
        name: {
          title: 'Name',
          type: String
        },
        geoType: {
          title: 'Type',
          type: String
        },
        parent: {
          title: 'Parent',
          filter: {
            type: 'list',
            config: {
              selectText: 'All',
              list: this.parentList,
            },
          },
          valuePrepareFunction: value => this.getParentNameById(value)
        },
        currId: {
          title: 'Currency',
          filter: {
            type: 'list',
            config: {
              selectText: 'All',
              list: this.currList,
            },
          },
          valuePrepareFunction: value => this.getCurrencyNameById(value)
        }
      }
    };
  }

  getParentNameById(parentId: any): any {
    let geoName = parentId;
    if (parentId) {
      this.parentList.forEach(geoInfo => {
        if (geoInfo.value == parentId) {
          geoName = geoInfo.title;
        }
      });
    }
    return geoName;
  }

  getCurrencyNameById(currId: any): any {
    let currencyName = currId;
    if (currId) {

      this.currList.forEach(currency => {
        if (currency.value == currId) {
          currencyName = currency.title;
        }
      });
    }
    return currencyName;
  }

  constructor(private router: Router,
    private commonService: CommonService,
    private route: ActivatedRoute,
    private service: ZoneEntryService,
    private authService: AuthenticationService) {

    this.accessList = this.authService.getUserAccessOfMenu('zoneEntry');
    this.service.getAllGeo().subscribe(geoList => {
      this.allGeoInfoList = geoList;
      geoList.forEach(val => {
        this.parentList.push({ value: val.geoId, title: val.name });
      });
      this.settings = this.prepareSetting();
      this.source.load(this.allGeoInfoList);
    });

    this.service.getAllCurrencies().subscribe(currencyList => {
      this.allCurrencyList = currencyList;
      currencyList.forEach(val => {
        this.currList.push({ value: val.currId, title: val.currName });
      });
      this.settings = this.prepareSetting();
    });


  }

  handleCreate() {
    this.router.navigate(['../createZoneEntry'], { relativeTo: this.route });
  }

  handleEdit(row: any) {
    this.service.geoEditData = row.data;
    this.router.navigate(['../editZoneEntry', this.service.geoEditData.geoId], { relativeTo: this.route });
  }

  onDeleteConfirm(event: any): void {
    if (window.confirm('Are you sure you want to delete?')) {
      this.service.deleteGeoById(event.data.geoId).subscribe(data => {
        // event.confirm.resolve();
        this.service.getAllGeo().subscribe(geoList => {
          this.allGeoInfoList = geoList;
          this.source.load(this.allGeoInfoList);
        });
      })
    } else {
      // event.confirm.reject();
    }
  }

}
