import {Component} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { CommonModalComponent } from '../../../../shared/common-modal/common-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { AuthenticationService } from '../../../../core/authentication/authentication.service';
import { Logger } from '../../../../core/logger.service';
import { SalesOrderService } from './salesOrder.service';
import { CategoryService } from '.../../app/pages/masters/components/categories/category.service';
import { PartyDetailsService } from '.../../app/pages/company/components/partyDetails/partyDetails.service';
//import { PrintScreenComponent } from '../../../../shared/print-screen/print-screen.component';
//import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

const log = new Logger('SalesOrder');

@Component({
  selector: 'salesOrder',
  templateUrl: './salesOrder.html',
  styleUrls: ['./salesOrder.scss']
})
export class SalesOrder {

  query = '';
  catList: any [] = [];
  itemList: any[] = [];
  successMessage: String;
  status: boolean;
  action: boolean = true;
  items: any[] = [];
  accessList: any[] = [];
  public isEdit: boolean;
  settings: any;
  // public loading = false;
  loading : boolean = false;
  source: LocalDataSource = new LocalDataSource();

  prepareSettings() {
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
           soNo: {
            title: 'Sales Order No',
            type: 'Number'
          },
          soDate: {
            title: 'Order Date',
            type: 'Number'
          },
          netAmount: {
            title: 'Total Amount',
            type: 'Number'
          },
          party: {
            title: 'Customer',
            type: 'string',
            // valuePrepareFunction: value => value.partyName,
          },
          status: {
            title: 'Status',
            type: 'string'
          },
        }
    }
  };

 constructor(private router: Router,
    private service: SalesOrderService,
    private route: ActivatedRoute,
    private catService: CategoryService,
    private modalService: NgbModal,
    private partyService: PartyDetailsService,
    //private spinnerService: Ng4LoadingSpinnerService,
    private authService: AuthenticationService) {
      this.loading = true;
      this.accessList = this.authService.getUserAccessOfMenu('salesOrder');
      const edit = this.accessList.includes("UPDATE");
      const view = this.accessList.includes("GET");
      debugger
      if (edit == true) {
        this.isEdit = true;
      } else if (view == true) {
        this.isEdit = true;
      } else {
        this.isEdit = false;
      }
      this.service.getOpeningStockStatus().subscribe(res => {
        debugger
       if(res.object == false){
         this.status = res.object;
         this.successMessage = 'OpenStockEntry Incomplete. Please Complete OpenStockEntry.';
        //  setTimeout(() => this.successMessage = null, 5000);
       }
      })
      debugger;
     // this.spinnerService.show();
    this.service.getSalesOrderData().subscribe((data) => {
      debugger
      data.forEach(res => {
        if(res.status == "DELETED"){
        this.action = false;
      } else {
        this.action = true;
      }
      // console.log(this.action);
      res.party = res.party.partyName;
      });
      this.settings = this.prepareSettings();
      this.source.load(data);
      this.loading = false;
      //this.spinnerService.hide();
    });
  }

  handleCreate() {
    if(this.status != false){
    this.router.navigate(['../createSalesOrder'], { relativeTo: this.route });
    }
  }

  handleEdit( row: any ) {
    let view = this.accessList.includes("GET");
    let edit = this.accessList.includes("UPDATE");
    if (view == true && edit == true) {
      view = false;
    } else if (view == false && edit == true) {
      view = false;
    }
    if (row.data.status == "DELETED"){
    const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
        activeModal.componentInstance.showHide = false;
        activeModal.componentInstance.modalHeader = 'Alert';
        activeModal.componentInstance.modalContent = 'Deleted order cannot be modified!';
    this.action = true;
  } else if (row.data.status == "COMPLETED"  || view == true){
    this.service.perchOrderData = row.data;
    this.router.navigate(['../viewSalesOrder/' + view + '/' + this.service.perchOrderData.soId, this.service.perchOrderData.status], { relativeTo: this.route });
  } else if(edit == true && view == false) {
    this.service.perchOrderData = row.data;
    this.router.navigate(['../editSalesOrder/' + view + '/' + this.service.perchOrderData.soId, this.service.perchOrderData.status], { relativeTo: this.route });
  } 
  }

  onDeleteConfirm(event: any): void {
    if (event.data.status == "DELETED"){
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = false;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Cannot delete already deleted item!';
    } else if (event.data.status == "COMPLETED"){
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = false;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Cannot delete completed order!';
    } else {
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = true;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Are you sure you want to delete!';
      activeModal.result.then ((res) => {
        // console.log(res == 'Y');
        if (res == 'Y') {
          this.service.deleteSalesOrder(event.data.soId).subscribe( response => {
            // event.confirm.resolve();
            this.service.getSalesOrderData().subscribe((data) => {
              data.forEach(res => {
                res.party = res.party.partyName;
              });
              this.source.load(data);
            });
          });
        } else if (res == 'N') {
    
        }
      });
    } 
  }

  // print(){
  //   const activeModal = this.modalService.open(PrintScreenComponent, {size: 'lg'});
  //   activeModal.componentInstance.challanNo = 'DC101' // This will be issue no_return no combination
  //   activeModal.componentInstance.cusName = 'Blue Star Diamonds Private Limited';  //Selected party for whom DC is generated
  //   activeModal.componentInstance.cusAddress = 'CE9010-8013/14/16 G Block, 9th Floor, Bandra Kurla Complex'; //Selected party address
  //   activeModal.componentInstance.cusCity = 'Mumbai';  //Selected party city
  //   activeModal.componentInstance.cusState = 'Maharastra';  //Selected party State
  //   activeModal.componentInstance.supState = 'Maharastra';  //Supplier's State
  //   activeModal.componentInstance.cusGst = '27AAHPM1616R1Z9';  //Selected party gst no
  //   activeModal.componentInstance.companyImage = 'assets/img/app/my-app-logo.png';
  //   activeModal.componentInstance.cusCin = 'U36911MH2008PTC188710';  //Selected party cin no
  //   activeModal.componentInstance.cusPan = 'AADCB6475E';  //Selected party pan no
  //  // activeModal.componentInstance.items = this.items;  // item list with columns(si, description, pcs, carats, rate)
 
  // }

}
