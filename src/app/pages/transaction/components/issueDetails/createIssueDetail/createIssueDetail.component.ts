import { CommonModalComponent } from '../../../../../shared/common-modal/common-modal.component';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { Location } from '@angular/common';
import { AuthenticationService } from '../../../../../core/authentication/authentication.service';
import { Logger } from '../../../../../core/logger.service';
import { IssueDetailService, IssueDetail } from '../issueDetail.service';

import { HierarchyRelationService } from '.../../app/pages/company/components/hierarchyRelation/hierarchyRelation.service'
import { CompanyEmployeeService } from '.../../app/pages/company/components/companyEmployee/companyEmployee.service'
import { ProTypeService } from '.../../app/pages/masters/components/processType/proType.service';
import { LotService } from '.../../app/pages/stockManagement/components/lots/lot.service';
import { ItemDetailsService } from '.../../app/pages/masters/components/itemDetails/itemDetails.service';
import { LotItemCreationService } from '.../../app/pages/stockManagement/components/lotItemCreation/lotItemCreation.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

const log = new Logger('EmpIssueDetails');
class itemIssued {
  lotId: number;
  lotName: string;
  lotItemId: number;
  itemName: string;
  carats: number;
  // avgRate: number;
  totalPieces: number;
  issuedCts: number;
  balancedCarats: number;
  issDate: string;
}

@Component({
  selector: 'create-issueDetail',
  styleUrls: ['./createIssueDetail.scss'],
  templateUrl: './createIssueDetail.html'
})

export class CreateIssueDetail implements OnInit  {

  empIssueDetailIdParam: string;
  pageTitle = 'Create Employee Issue Detail';
  settings: any;

  source: LocalDataSource = new LocalDataSource();
  error: string = null;
  isLoading = false;
  empIssueDetailForm: FormGroup;
  successMessage: string;

  hierRelList: any[] = [];
  divList: any[] = [];
  locList: any[] = [];
  deptList: any[] = [];
  subDeptList: any[] = [];
  empList: any[] = [];
  empHierList: any[] = [];
  issValueList: any[] = [];
  processList: any[] = [];
  lotList: any [] = [];
  itemLotList: any[] = [];
  alreadyIssuedList: itemIssued [] = [];
  itemIssuedList: itemIssued [] = [];
  totalIssuedList: itemIssued [] = [];
  todayDate: string;
  selectedLot: any;
  selectedEmp: any;
  
  // itemId: number;

  public hierarchyRelationByDivIdDTO: AbstractControl;
  public hierarchyRelationByLocIdDTO: AbstractControl;
  public hierarchyRelationByDeptIdDTO: AbstractControl;
  public hierarchyRelationBySdeptIdDTO: AbstractControl;
  public employeeMasterDTO: AbstractControl;
  public processMasterDTO: AbstractControl;
  public lotMasterDTO: AbstractControl;
  public issueDate: AbstractControl;
  public issueNo: AbstractControl;
  public totalPcs: AbstractControl;
  public totalCarats: AbstractControl;
  public remark: AbstractControl;
  public item: AbstractControl;
  public totcarats: AbstractControl;
  // public avgRate: AbstractControl;
  public issuedPcs: AbstractControl;
  public issuedCarats: AbstractControl;


  constructor(private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private location: Location,
    private service: IssueDetailService,
    private modalService: NgbModal,
    private hierarchyRelationService: HierarchyRelationService,
    private companyEmployeeService: CompanyEmployeeService,
    private proTypeService: ProTypeService,
    private lotService: LotService,
    private itemService: ItemDetailsService,
    private lotItemService: LotItemCreationService,
    private authService: AuthenticationService) {
      this.todayDate = this.today();
      this.createForm();

      this.settings = this.prepareSetting();
      this.issueDate.setValue(this.todayDate);
      this.hierarchyRelationService.getData().subscribe( (hierRelList) => {
        this.hierRelList = hierRelList;
      });
      this.hierarchyRelationService.getHierarchyRelationByParentId(authService.credentials.company).subscribe( (divList) => {
        this.divList = divList;
      });
  }

  ngOnInit() {
    this.settings = this.prepareSetting();
    this.route.params.subscribe((params: Params) => {
      this.empIssueDetailIdParam = params['empIssId'];
      if (this.empIssueDetailIdParam) {
        this.pageTitle = 'Edit Employee Issue Detail';
        this.service.getIssueDetailsById(this.empIssueDetailIdParam).subscribe(res => {
          this.selectedEmp = res.employeeMasterDTO;     // check this by changing values of emp & lot
          this.selectedLot = res.lotMasterDTO;
          if (this.empIssueDetailIdParam) {
            this.onDivChange(res.addressMaster.country);            //change addresssMaster & country
            this.onLocChange(res.addressMaster.state);          //change addresssMaster & country
            this.onDeptChange(res.addressMaster.state);         //change addresssMaster & country
          }
          this.markAllTouched(this.empIssueDetailForm);
          this.empIssueDetailForm.patchValue(res);
          this.source.load(this.totalIssuedList);
         })
      }
    });
  }

  markAllTouched(control: AbstractControl) {
    debugger;
    if (control.hasOwnProperty('controls')) {
        const ctrl = <any>control;
        for (const inner in ctrl.controls) {
          if (ctrl.controls) {
            this.markAllTouched(ctrl.controls[inner]);
          }
        }
    } else {
        control.markAsTouched();
      }
  }

  today (): string {
    const today = new Date();
    const dd = today.getDate();
    const mm = today.getMonth() + 1; //January is 0!

    const yyyy = today.getFullYear();
    return yyyy + '-' + (mm < 10 ? '0' + mm : mm) + '-' + (dd < 10 ? '0' + dd : dd);
  }

  onDivChange(value: any) {
    this.locList = [];
    this.deptList = [];
    this.subDeptList = [];
    this.empHierList = [];
    this.empIssueDetailForm.controls['hierarchyRelationByLocIdDTO'].reset();
    this.empIssueDetailForm.controls['hierarchyRelationByDeptIdDTO'].reset();
    this.empIssueDetailForm.controls['hierarchyRelationBySdeptIdDTO'].reset();
    this.empIssueDetailForm.controls['employeeMasterDTO'].reset();
    this.hierarchyRelationService.getHierarchyRelationByParentId(value).subscribe( (locList) => {
      this.locList = locList;
      if (this.locList.length == 0) {
        this.isLoading=false;
        const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
        activeModal.componentInstance.showHide = false;
        activeModal.componentInstance.modalHeader = 'Alert';
        activeModal.componentInstance.modalContent = 'No Location Entries in selected Division!';
      }
    });
  }

  onLocChange(value: any) {
    this.deptList = [];
    this.subDeptList = [];
    this.empHierList = [];
    this.empIssueDetailForm.controls['hierarchyRelationByDeptIdDTO'].reset();
    this.empIssueDetailForm.controls['hierarchyRelationBySdeptIdDTO'].reset();
    this.empIssueDetailForm.controls['employeeMasterDTO'].reset();
    this.hierarchyRelationService.getHierarchyRelationByParentId(value).subscribe( (deptList) => {
      this.deptList = deptList;
      if (this.deptList.length == 0) {
        this.isLoading=false;
        const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
        activeModal.componentInstance.showHide = false;
        activeModal.componentInstance.modalHeader = 'Alert';
        activeModal.componentInstance.modalContent = 'No Departments in selected Location!';
      }
    });
  }

  onDeptChange(value: any) {
    this.subDeptList = [];
    this.empHierList = [];
    this.empIssueDetailForm.controls['hierarchyRelationBySdeptIdDTO'].reset();
    this.empIssueDetailForm.controls['employeeMasterDTO'].reset();
    this.hierarchyRelationService.getHierarchyRelationByParentId(value).subscribe( (subDeptList) => {
      this.subDeptList = subDeptList;
      if (this.subDeptList.length == 0) {
        this.isLoading=false;
        const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
        activeModal.componentInstance.showHide = false;
        activeModal.componentInstance.modalHeader = 'Alert';
        activeModal.componentInstance.modalContent = 'No Sub-Departments in selected Department!';
      }
    });
  }

  onSDeptChange(value: any) {
    this.lotList = [];
    this.processList = [];
    this.empList = [];
    this.empHierList = [];
    this.empIssueDetailForm.controls['employeeMasterDTO'].reset();
    this.companyEmployeeService.getData().subscribe( (empList) => {
      this.empList = empList;
      
      debugger;
      this.empList.forEach( emp => {
        this.hierRelList.forEach( hierRel => {
          if((emp.refId == hierRel.hierRelId || emp.refId.hierRelId == hierRel.hierRelId) && hierRel.hierarchyMaster.hierId == this.hierarchyRelationBySdeptIdDTO.value && 
            hierRel.parent == this.hierarchyRelationByDeptIdDTO.value) {
              this.empHierList.push(emp);
          }
        });
      });
      if (this.empHierList.length == 0) {
        this.isLoading=false;
        const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
        activeModal.componentInstance.showHide = false;
        activeModal.componentInstance.modalHeader = 'Alert';
        activeModal.componentInstance.modalContent = 'No Employees in selected Sub-Department!';
      }
    });

    this.proTypeService.getData().subscribe( (processList) => {
      this.processList = processList;
    });

    this.lotService.getData().subscribe( (lotList) => {
      this.lotList = lotList;
    });
  }

  onResetBtnClick() {
    this.isLoading=false;
    const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
    activeModal.componentInstance.showHide = true;
    activeModal.componentInstance.modalHeader = 'Alert';
    activeModal.componentInstance.modalContent = 'Trying to change employee!!! Your all Entered Info & Issued Item info will be get removed!';
    activeModal.result.then ((res) => {
      // console.log(res == 'Y');
      if (res == 'Y') {
        if(this.hierarchyRelationBySdeptIdDTO.disabled) {
          this.hierarchyRelationByDivIdDTO.enable();
          this.hierarchyRelationByLocIdDTO.enable();
          this.hierarchyRelationByDeptIdDTO.enable();
          this.hierarchyRelationBySdeptIdDTO.enable();
        }
        this.empIssueDetailForm.controls['employeeMasterDTO'].reset();
        this.allReset();
      } 
    });
  }

  onEmpChange(empId: any) {
    if (this.itemIssuedList.length > 0) {
      debugger;
      this.isLoading=false;
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = true;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Your all previous Issued Item info will be get removed!';
      activeModal.result.then ((res) => {
        // console.log(res == 'Y');
        if (res == 'Y') {
          this.selectedEmp = empId;
          this.empIssueDetailForm.controls['employeeMasterDTO'].setValue(this.selectedEmp);
          this.forEmpChange(empId);
        } else if (res == 'N') {
          this.empIssueDetailForm.controls['employeeMasterDTO'].setValue(this.selectedEmp);
        }
      });
    } else {
      this.selectedEmp = this.employeeMasterDTO.value;
      this.forEmpChange(empId);
    }
    this.empIssueDetailForm.controls['employeeMasterDTO'].setValue(this.selectedEmp);
  }

  forEmpChange(empId: any) {
    this.allReset();
    this.empIssueDetailForm.controls['employeeMasterDTO'].setValue(empId);
  }
  
  allReset() {
    this.empIssueDetailForm.controls['processMasterDTO'].reset();
    this.empIssueDetailForm.controls['lotMasterDTO'].reset();
    this.empIssueDetailForm.controls['issueNo'].reset();
    this.reset();
  }

  onChangeLot(lotId: any) {
    if (this.itemIssuedList.length > 0) {
      this.isLoading=false;
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = true;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Your all previous Issued Item Info will be get removed!';
      activeModal.result.then ((res) => {
        if (res == 'Y') {
          this.selectedLot = lotId;
          this.empIssueDetailForm.controls['lotMasterDTO'].setValue(this.selectedLot);
          this.forChangeLot(lotId);
        } else if (res == 'N') {
          this.empIssueDetailForm.controls['lotMasterDTO'].setValue(this.selectedLot);
        }
      });
    } else {
      this.selectedLot = this.lotMasterDTO.value;
      this.forChangeLot(lotId);
    }
    this.empIssueDetailForm.controls['lotMasterDTO'].setValue(this.selectedLot);
  }

  forChangeLot(lotId: any) {
    this.reset();
    this.lotItemService.getAllLotItemByLotId(lotId).subscribe( itemLotList => {
      this.itemLotList = itemLotList;
      if (this.itemLotList.length == 0) {
        this.isLoading=false;
        const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
        activeModal.componentInstance.showHide = false;
        activeModal.componentInstance.modalHeader = 'Alert';
        activeModal.componentInstance.modalContent = 'No items in selected Lot!';
      } else {

        this.issValueList = [];
        this.alreadyIssuedList = [];
        this.service.getData().subscribe( (issValueList) => {
          this.issValueList = issValueList;

          this.issValueList.forEach( ele => {                             // check alreadyIssuedList is getting stored or not
            if (this.employeeMasterDTO.value == ele.employeeMasterDTO && ele.lotMasterDTO == lotId) {
              this.alreadyIssuedList.push(ele.totalIssuedList);
              this.totalIssuedList = this.alreadyIssuedList;
              this.source.load(this.totalIssuedList);              
            }
          });
        });
      }
    });
  }

  reset() {
    this.empIssueDetailForm.controls['totalPcs'].reset();
    this.empIssueDetailForm.controls['totalCarats'].reset();
    this.empIssueDetailForm.controls['remark'].reset();
    this.itemLotList = [];
    this.empIssueDetailForm.controls['item'].reset();
    this.empIssueDetailForm.controls['issuedPcs'].reset();
    this.empIssueDetailForm.controls['issuedCarats'].reset();
    this.empIssueDetailForm.controls['totcarats'].reset();
    this.itemIssuedList = [];
    this.alreadyIssuedList =[];
    this.totalIssuedList = [];
    this.source.load(this.totalIssuedList);
  }

  onChangeItem(itemId: any) {
    debugger;
    const item = this.itemLotList.find(item => {
      if (this.item.value == item.lotItemId) {
        return true;
      }
    });
    this.empIssueDetailForm.controls['totcarats'].setValue(item.totalCarets);
    // this.avgRate.setValue(item.avgRate);
  }

  onAdd() {
      
    if(this.itemIssuedList.length > 0) {
      const itemIndex = this.itemIssuedList.findIndex(item => {
        if (this.item.value == item.lotItemId) {
          return true;
        }
      });
      if (itemIndex >= 0) {
        this.isLoading=false;
        const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
        activeModal.componentInstance.showHide = false;
        activeModal.componentInstance.modalHeader = 'Alert';
        activeModal.componentInstance.modalContent = 'This Item has Already been Issued! If want to issue more Pieces/Carats, Please Delete Issued Item from List!';
      } else {
          if(this.alreadyIssuedList.length > 0) {
            const item = this.alreadyIssuedList.find(item => {
              if (this.item.value == item.lotItemId) {
                return true;
              }
            });
              // Need to handle validation for--> issuedPieces > TotalPieces - alreadyissuedPieces (Total no. of pieces consisting in ItemBag)
            if(item) {            // <--- check this condtn is working or not for carats
              if(this.issuedCarats.value > item.carats - item.issuedCts) {
                this.isLoading=false;
                const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
                activeModal.componentInstance.showHide = false;
                activeModal.componentInstance.modalHeader = 'Alert';
                activeModal.componentInstance.modalContent = 'Issued Carats should not be greater than ' + (item.carats - item.issuedCts) +'Carats';
              } else {
                this.validAdd();
              }
            }
          } else {
            this.validAdd();
        }
      }
    } else {
        this.validAdd();
    }
  }

  validAdd() {
    const itemissueDetails = new itemIssued();
    itemissueDetails.lotId = this.lotMasterDTO.value;
    itemissueDetails.lotName = this.getLotName(itemissueDetails.lotId);
    itemissueDetails.lotItemId = this.item.value;
    itemissueDetails.itemName = this.getItemName(itemissueDetails.lotItemId);
    itemissueDetails.carats = this.totcarats.value;
    // itemissueDetails.avgRate = this.avgRate.value;
    itemissueDetails.totalPieces = Math.round(this.issuedPcs.value);
    itemissueDetails.issuedCts = this.issuedCarats.value;
    itemissueDetails.issDate = this.todayDate;

    if (!this.item.valid) {
      this.isLoading=false;
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = false;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Please Select Item!';
    } else if (this.issuedPcs.value == null || this.issuedPcs.value <= 0) {
      this.isLoading=false;
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = false;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Issued Pieces should be greater than 0 !';
    } else if (this.issuedCarats.value == null || this.issuedCarats.value <= 0) {
      this.isLoading=false;
        const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
        activeModal.componentInstance.showHide = false;
        activeModal.componentInstance.modalHeader = 'Alert';
        activeModal.componentInstance.modalContent = 'Issued Carats should be greater than 0 !';
    } else {        // Need to handle validation for--> issuedPieces > TotalPieces(Total no. of pieces consisting in ItemBag)
      if (this.issuedCarats.value > this.totcarats.value) {
        this.isLoading=false;
          const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
        activeModal.componentInstance.showHide = false;
        activeModal.componentInstance.modalHeader = 'Alert';
        activeModal.componentInstance.modalContent = 'Cannot Issue carats more than ' + this.totcarats.value + ' Carats!';
      } else {
        this.itemIssuedList.push(itemissueDetails);
        console.log(this.itemIssuedList);
        console.log(this.totalIssuedList);
        this.totalIssuedList = this.totalIssuedList.concat(itemissueDetails);
        console.log(this.totalIssuedList);
        this.source.load(this.totalIssuedList);
        this.empIssueDetailForm.controls['issuedPcs'].reset();
        this.empIssueDetailForm.controls['issuedCarats'].reset();
        this.calculateIssuedCaretsPieces();
        this.successMessage = 'Item Issued Succesfully!';
        setTimeout(() => this.successMessage = null, 3000);
      }
    }
  }

  onDeleteConfirm(event: any): void {
    const itemIndex = this.alreadyIssuedList.findIndex(item => {
      if (event.data.lotItemId == item.lotItemId) {
        return true;
      }
    });

    if(itemIndex > -1) {
      this.isLoading=false;
      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = false;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Cannot Delete Entries of Previous Date!';   // check this is working or not
    } else {
        if (window.confirm('Are you sure you want to delete?')) {
          const itemIndex = this.totalIssuedList.findIndex(item => {
            if (event.data.lotItemId == item.lotItemId) {
              return true;
            }
          });
          const itemIssIndex = this.itemIssuedList.findIndex(item => {
            if (event.data.lotItemId == item.lotItemId) {
              return true;
            }
          });
            this.itemIssuedList.splice(itemIssIndex, 1);
            this.totalIssuedList.splice(itemIndex, 1);
            this.source.load(this.totalIssuedList);
            this.calculateIssuedCaretsPieces();
            this.successMessage = 'Issued Item Deleted Succesfully!';
            setTimeout(() => this.successMessage = null, 3000);
            event.confirm.resolve();
        } else {
        event.confirm.reject();
      }
    }
  }


  submit() {
    debugger; 
    if (this.employeeMasterDTO.valid && this.itemIssuedList.length > 0 && this.processMasterDTO.valid && this.lotMasterDTO.valid && this.issueNo.valid && this.remark.valid) {
      this.hierarchyRelationByDivIdDTO.enable();
      this.hierarchyRelationByLocIdDTO.enable();
      this.hierarchyRelationByDeptIdDTO.enable();
      this.hierarchyRelationBySdeptIdDTO.enable();
    } 
    
    if (this.empIssueDetailForm.valid) {

      if (this.totalIssuedList.length > 0) {
        this.isLoading = true;
        this.empIssueDetailForm.controls['totalIssuedList'].setValue(this.totalIssuedList);

        if (this.empIssueDetailIdParam) { 
          this.service.updateIssueDetails(this.empIssueDetailForm.value)
          .subscribe(itemIssued => {
            // log.debug(`${credentials.username} successfully logged in`);
            this.handleBack();
          this.finally();
          }, error => {
            this.isLoading=false;
            log.debug(`Creation error: ${error}`);
            this.error = error;
            this.finally();
          });

        } else {
          this.service.createIssueDetails(this.empIssueDetailForm.value)
          .subscribe( itemIssued => {
            // log.debug(`${credentials.rolename} successfully logged in`);
            this.handleBack();
            this.finally();
          }, error => {
            this.isLoading=false;
            log.debug(`Creation error: ${error}`);
            this.error = error;
            this.finally();
          });
        }
      } else {
        this.isLoading=false;
        const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
        activeModal.componentInstance.showHide = false;
        activeModal.componentInstance.modalHeader = 'Alert';
        activeModal.componentInstance.modalContent = 'Please Add Some Item to Issue to the Employee!!!';
      }
    }
  }

  calculateIssuedCaretsPieces() {
    let totalPietes = 0;
    let totalCatats = 0;
    if (this.totalIssuedList.length >= 0) {
      this.totalIssuedList.forEach(item => {
        item.totalPieces = parseFloat(item.totalPieces.toString());          
        item.issuedCts = parseFloat(item.issuedCts.toString());
     totalPietes += item.totalPieces
     totalCatats += item.issuedCts;
    });
    this.totalPcs.setValue(totalPietes);
    this.totalCarats.setValue(totalCatats);
    } else {
      this.totalPcs.setValue(0);
      this.totalCarats.setValue(0);
    }
  }

  getLotName(lotId: any): string {
    let lotName = "";
    this.lotList.forEach(lot => {
    if ( lot.lotId == lotId) {
    lotName = lot.lotName;
    }
    });
    return lotName;
  }

  getItemName(lotItemId: any): string {
    debugger;

     let name = lotItemId;
    this.itemLotList.forEach(lotItem => {
      if ( lotItem.lotItemId == lotItemId) {
        // this.itemId = lotItem.itemMaster.itemId;
        name = lotItem.itemMaster.itemName;
      }
    });
   return name;
  }

  // for smart table
  prepareSetting() {
    return {
      hideSubHeader: 'true',
      actions: {
        position: 'right',
        add: false,
        edit: false
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
      pager: {
          display: false
      },
      columns: {
        lotName: {
          editable: false,
          title: 'Lot Name',
          type: 'text',
        },
        itemName: {
          title: 'Item Name',
          type: 'text',
        },
        carats: {
          editable: false,
          title: 'Total Carats',
        },
        // avgRate: {
        //   title: 'Avg Rate',
        // },
        totalPieces: {
          title: 'Issued Pieces',
        },
        issuedCts: {
          title: 'Issued Carats',
        },
        issDate: {
          title: 'Issue Date',
          type: 'text',
        }
      }
    };
  }

  onPrintVchrClick() {
                            //-----Have to implement its functionality for Print Voucher Button Click 
  }

  finally() {
      this.isLoading = false;
      this.empIssueDetailForm.markAsPristine();
  }

   handleBack(cancelling: boolean = false) {
    // TODO: if cancelling then ask to confirn

    if (this.empIssueDetailIdParam) {
      this.location.back();
    } else {
      this.location.back();
    }
  }


  private createForm() {
    this.empIssueDetailForm = this.fb.group({
      'empIssId': [''],
      'hierarchyRelationByDivIdDTO': ['', Validators.compose([Validators.required])],
      'hierarchyRelationByLocIdDTO': ['', Validators.compose([Validators.required])],
      'hierarchyRelationByDeptIdDTO': ['', Validators.compose([Validators.required])],
      'hierarchyRelationBySdeptIdDTO': ['', Validators.compose([Validators.required])],
      'employeeMasterDTO': ['', Validators.compose([Validators.required])],
      'processMasterDTO': ['', Validators.compose([Validators.required])],
      'lotMasterDTO': ['', Validators.compose([Validators.required])],
      'issueDate': [''],
      'issueNo': ['', Validators.compose([Validators.required, Validators.maxLength(50)])],
      'totalPcs': [''],
      'totalCarats': [''],
      'remark': ['', Validators.compose([Validators.required, Validators.maxLength(255)])],
      'item': [''],
      'totcarats': [''],
      'issuedPcs': [''],
      'issuedCarats': [''],
      'totalIssuedList': [this.totalIssuedList],
      'hierarchyRelationByHierRelIdDTO': ['89'], //have to send this entity to backend --> maNDATORY FIELD --> delete it
    });

    this.hierarchyRelationByDivIdDTO = this.empIssueDetailForm.controls['hierarchyRelationByDivIdDTO'];
    this.hierarchyRelationByLocIdDTO = this.empIssueDetailForm.controls['hierarchyRelationByLocIdDTO'];
    this.hierarchyRelationByDeptIdDTO = this.empIssueDetailForm.controls['hierarchyRelationByDeptIdDTO'];
    this.hierarchyRelationBySdeptIdDTO = this.empIssueDetailForm.controls['hierarchyRelationBySdeptIdDTO'];
    this.employeeMasterDTO = this.empIssueDetailForm.controls['employeeMasterDTO'];
    this.processMasterDTO = this.empIssueDetailForm.controls['processMasterDTO'];
    this.lotMasterDTO = this.empIssueDetailForm.controls['lotMasterDTO'];
    this.issueDate = this.empIssueDetailForm.controls['issueDate'];
    this.issueNo = this.empIssueDetailForm.controls['issueNo'];
    this.totalPcs = this.empIssueDetailForm.controls['totalPcs'];
    this.totalCarats = this.empIssueDetailForm.controls['totalCarats'];
    this.remark = this.empIssueDetailForm.controls['remark'];
    this.item = this.empIssueDetailForm.controls['item'];
    this.totcarats = this.empIssueDetailForm.controls['totcarats'];
    this.issuedPcs = this.empIssueDetailForm.controls['issuedPcs'];
    this.issuedCarats = this.empIssueDetailForm.controls['issuedCarats'];

    this.employeeMasterDTO.valueChanges.subscribe( data => {
      if(this.empIssueDetailForm.controls['employeeMasterDTO'].valid) {
        this.hierarchyRelationByDivIdDTO.disable();
        this.hierarchyRelationByDivIdDTO.markAsUntouched();
        this.hierarchyRelationByLocIdDTO.disable();
        this.hierarchyRelationByLocIdDTO.markAsUntouched();
        this.hierarchyRelationByDeptIdDTO.disable();
        this.hierarchyRelationByDeptIdDTO.markAsUntouched();
        this.hierarchyRelationBySdeptIdDTO.disable();
        this.hierarchyRelationBySdeptIdDTO.markAsUntouched();
      }
    });
  }
}
