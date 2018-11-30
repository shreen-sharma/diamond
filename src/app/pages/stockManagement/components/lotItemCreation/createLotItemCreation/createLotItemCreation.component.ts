import { TreeviewItem } from 'ngx-treeview/src';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';

import { AuthenticationService } from '../../../../../core/authentication/authentication.service';
import { Logger } from '../../../../../core/logger.service';
import { LotItemCreation, LotItemCreationService } from '../lotItemCreation.service';
import { LotService } from '../../lots/lot.service';
import { CategoryService } from '.../../app/pages/masters/components/categories/category.service';
import { ItemDetailsService } from '.../../app/pages/masters/components/itemDetails/itemDetails.service';


const log = new Logger('LotItemCreation');

@Component({
  selector: 'create-lotItemCreation',
  templateUrl: './createLotItemCreation.html',
  styleUrls: ['./createLotItemCreation.scss']
})
export class CreateLotItemCreationComponent implements OnInit {

  lotItemCreationIdParam: string;
  pageTitle = 'Create Lot Item Creation For Opening Stock';

  errorMsg: string = null;
  isLoading = false;
  lotItemCreationForm: FormGroup;

  lotList: any[] = [];
  catList: any[] = [];
  itemList: any[] = [];
  perchOrderData: any = {};

  lotItemList: any[] = [];
  availablelotitemList: any[] = [];
  itemSelectedList: any[] = [];
  selectedCategory: any;
  categoryWiseLotItem: TreeviewItem[] = [];
  treeConfig: any;
  todayDate: string;
  accessList: any[] = [];
  upDateAccess: boolean = false;

  public lot: AbstractControl;
  public items: AbstractControl;
  public itemCategory: AbstractControl;


  constructor(private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private service: LotItemCreationService,
    private lotService: LotService,
    private catService: CategoryService,
    private itemService: ItemDetailsService,
    private authService: AuthenticationService) {

    // this.accessList = this.authService.getUserAccessOfMenu('lotItemCreation');
    // this.upDateAccess = this.accessList.includes("UPDATE");
    // this.upDateAccess = this.accessList.includes("ADD");

    this.todayDate = this.today();
    this.createForm();

    this.lotService.getData().subscribe((lotList) => {
      this.lotList = lotList;
    });

    this.catService.getData().subscribe((catList) => {
      this.catList = catList;
    });

    this.itemService.getData().subscribe((itemList) => {
      this.itemList = itemList;
      //this.availablelotitemList = itemList;
    });

    this.service.getAllLotItemCreation().subscribe(lotItemList => {
      this.lotItemList = lotItemList;
    });

  }

  onCategoryChange(categoryId: any) {
    debugger
    if (categoryId != -1) {
      this.selectedCategory = categoryId;
      this.categoryWiseLotItem = [];
      if (this.availablelotitemList) {
        this.availablelotitemList.forEach(item => {
          if (item.categoryMaster.catId == this.selectedCategory) {
            this.categoryWiseLotItem.push(new TreeviewItem({ text: item.itemName, value: item.itemId + '', checked: false }));
            // this.categoryWiseLotItem.push(item);
          }
        });
        // this.availablelotitemList = this.categoryWiseLotItem;
      }
    }
  }

  onLotChange(lotId: any) {
    debugger;
    this.service.getAllLotItemByLotId(lotId).subscribe(lotItems => {
      this.lotItemList = lotItems;
      if (this.lotItemList.length > 0) {
        this.populateAvailableItemsForLot(lotId);
        if (this.selectedCategory) {
          this.onCategoryChange(this.selectedCategory);
        } else {
          this.createAvailableListItem(this.availablelotitemList);
        }
      } else {
        this.populateAvailableItemsForLot(lotId);
        this.createAvailableListItem(this.availablelotitemList);
      }
    });
  }

  createAvailableListItem(listArr: any[]) {
    this.categoryWiseLotItem = [];
    listArr.forEach(item => {
      this.categoryWiseLotItem.push(new TreeviewItem({ text: item.itemName, value: item.itemId + '', checked: false }));
    })
  }

  populateAvailableItemsForLot(lotId: any) {
    this.availablelotitemList = [];
    this.itemList.forEach(item => {
      const index = this.lotItemList.findIndex(lotItem => {
        if (lotItem.itemMaster.itemId == item.itemId) {
          return true;
        } else {
          return false;
        }
      });
      if (index < 0) {
        this.availablelotitemList.push(item);
      }
    });
  }


  today(): string {
    const today = new Date();
    const dd = today.getDate();
    const mm = today.getMonth() + 1; //January is 0!

    const yyyy = today.getFullYear();
    return (dd < 10 ? '0' + dd : dd) + '-' + (mm < 10 ? '0' + mm : mm) + '-' + yyyy;
  }
  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.lotItemCreationIdParam = params['lotItemId'];
      if (this.lotItemCreationIdParam) {
        this.pageTitle = 'Edit Lot Item Creation For Opening Stock';

        this.service.getLotItemCreationById(this.lotItemCreationIdParam).subscribe(res => {
          this.lotItemCreationForm.patchValue(res);
          debugger;
          this.perchOrderData = res;
          this.lot.patchValue(res.lotMaster.lotId);
          this.categoryWiseLotItem.push(new TreeviewItem({ text: res.itemMaster.itemName, value: res.itemMaster.itemId + '', checked: true }));
          //this.itemCategory.patchValue(res.itemMaster.categoryMaster.catId);
          //let itemId = res.itemMaster.itemId;
          // this.populateAvailableItemsForLot(res.lotMaster.lotId);
        })
      }
    });
  }

  submit() {
    if (!this.lotItemCreationForm.valid) {
      this.errorMsg = 'Required fields are empty.';
      return;
    }
    this.isLoading = true;
    const formValue: any = this.lotItemCreationForm.value;
    //formValue.items = this.checked;
    //console.log(this.checked.values);
    if (this.lotItemCreationIdParam) {
      debugger;
      this.service.updateLotItemCreation(this.lotItemCreationForm.value)
        .subscribe(lotItemCreation => {
          // log.debug(`${credentials.selectedCompany} successfully logged in`);
          this.handleBack();
          this.finally();
        }, error => {
          log.debug(`Creation error: ${error}`);
          this.errorMsg = error;
          this.finally();
        });
    } else {
      this.service.createLotItemCreation(this.lotItemCreationForm.value)
        .subscribe(lotItemCreation => {
          // log.debug(`${credentials.selectedCompany} successfully logged in`);
          this.handleBack();
          this.finally();
        }, error => {
          log.debug(`Creation error: ${error}`);
          this.errorMsg = error;
          this.finally();
        });
    }
  }

  // ******* Logic for getting id of check item from the list ***** //

  onItemListChange(selected: string[]) {
    this.items.setValue(selected);
  }

  finally() {
    this.isLoading = false;
    this.lotItemCreationForm.markAsPristine();
  }

  handleBack(cancelling: boolean = false) {
    // TODO: if cancelling then ask to confirn

    if (this.lotItemCreationIdParam) {
      this.router.navigate(['../../lotItemCreation'], { relativeTo: this.route });
    } else {
      this.router.navigate(['../lotItemCreation'], { relativeTo: this.route });
    }
  }

  private createForm() {
    this.lotItemCreationForm = this.fb.group({
      'lot': ['', Validators.compose([Validators.required])],
      'items': [[], Validators.compose([Validators.required])]
    });

    this.lot = this.lotItemCreationForm.controls['lot'];
    this.items = this.lotItemCreationForm.controls['items'];

    this.treeConfig = {
      hasAllCheckBox: true,
      hasFilter: true,
      hasCollapseExpand: false,
      maxHeight: 500
    };
  }
}
