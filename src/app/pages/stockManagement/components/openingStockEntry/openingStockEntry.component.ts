import { DefaultModal } from './createOpeningStockEntry/default-modal/default-modal.component';
import {Component} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { FormGroup, AbstractControl, FormBuilder, Validators, FormArray} from '@angular/forms';

import { AuthenticationService } from '../../../../core/authentication/authentication.service';
import { Logger } from '../../../../core/logger.service';
import { OpeningStockEntryService } from './openingStockEntry.service';
import { LotService } from '../lots/lot.service';
import { CategoryService } from '.../../app/pages/masters/components/categories/category.service';
import { ItemDetailsService } from '.../../app/pages/masters/components/itemDetails/itemDetails.service';
import { DefaultModalOpen } from './default-modal/default-modal.component';
import { PreviewModalOpen } from './preview-modal/preview-modal.component';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
const log = new Logger('openingStockEntry');

@Component({
  selector: 'openingStockEntry',
  templateUrl: './openingStockEntry.html',
  styleUrls: ['./openingStockEntry.scss']
})
export class OpeningStockEntry {

  query = '';

  lotList: any [] = [];
  catList: any [] = [];
  itemList: any[] = [];
  settings: any;
  entryProcessed: boolean;
  errorMessage: string;
  successMessage: string;
  accessList: any[] = [];

  source: LocalDataSource = new LocalDataSource();

  prepareSetting(readOnly?: boolean) {
    return {
    actions: {
      position: 'right',
      add: !readOnly,
      delete: !readOnly,
      // add: this.accessList.includes("ADD"),
      // edit: this.accessList.includes("GET"),
      // delete: this.accessList.includes("DELETE"),
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
      categoryName: {
        title: 'Category',
        type: 'string',
      },
      totalCarets: {
        title: 'Total Carets',
        type: 'string'
      },
      avgRate: {
        title: 'Average Rate',
        type: 'string'
      },
      amount: {
        title: 'Amount',
        type: 'string'
      },
      completed: {
        title: 'Completed',
        type: 'string'
      },
    }
  };
}

   

  constructor(private router: Router,
    private route: ActivatedRoute,
    private service: OpeningStockEntryService,
    private modalService: NgbModal,
    private authService: AuthenticationService) {
      this.accessList = this.authService.getUserAccessOfMenu('lots');
      this.settings = this.prepareSetting();

      this.service.getAllOpeningStockEntry().subscribe((data) => {
        if(data){
          this.entryProcessed = data.length && data[0].completed == 'Y';
        }
        this.settings = this.prepareSetting(this.entryProcessed);
        this.source.load(data);
                      
        });
   

  }
  handleCreate() {
    this.router.navigate(['../createOpeningStockEntry'], { relativeTo: this.route });
  }

  handleEdit( row: any ) {
    const openingStockEntry = row.data;
    if (this.entryProcessed) {
      this.router.navigate(['../viewOpeningStockEntry', openingStockEntry.osId], { relativeTo: this.route });
    } else {
      this.router.navigate(['../editOpeningStockEntry', openingStockEntry.osId], { relativeTo: this.route });
    }
  }

  onDeleteConfirm(event: any):void{
    if (event.data) {
      this.service.toggle = true;
      const activeModal = this.modalService.open(DefaultModal, { size: 'sm' });
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Are you sure you want to delete?';
      activeModal.result.then ((res) => {

        if (res == 'Y') {
          this.service.deleteOpeningStockEntry(event.data.osId).subscribe( deleteResponse => {
            this.successMessage = deleteResponse._body;
                  setTimeout(()=> this.successMessage = null,5000);
            this.service.getAllOpeningStockEntry().subscribe(data => {
                this.source.load(data);
            });
           
          // event.confirm.resolve();
          },error =>{
            this.errorMessage = error._body;
          });
          // event.confirm.resolve();
        } else {
          // event.confirm.reject();
        }
      });
    } else {
      // event.confirm.reject();
     
    }
  }

  onProcessClick() {

    const activeModal = this.modalService.open(DefaultModalOpen, { size: 'lg' });
    activeModal.componentInstance.modalHeader = 'Alert';
    activeModal.componentInstance.modalContent = `Please note that after this process,
                                                   You will not be able to add any more stock entries!!
                                                   Are you sure you want to complete Opening Stock Entry ? `;

    activeModal.result.then( (res) => {
      if (res == 'Y') {
        this.service.getAllOpeningStockEntry().subscribe((data) => {
          this.entryProcessed = true;
          this.prepareSetting(this.entryProcessed);
          this.source.load(data);
        });
      }
    });
   }
   onPreviewClick(){
    const activeModal = this.modalService.open(PreviewModalOpen, { size: 'lg' });
    activeModal.componentInstance.modalHeader = 'OpenStock entry details info';
   }
}
