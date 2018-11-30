import { FormGroup, FormArray, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { AuthenticationService } from '../../../../../core/authentication/authentication.service';
import { Logger } from '../../../../../core/logger.service';
import { Location } from '@angular/common';
import { JangadConsignmentReturnService } from '../jangadConsignmentReturn.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModalComponent } from '../../../../../shared/common-modal/common-modal.component';
import { JangadConsignmentIssueService } from '../../jangadConsignmentIssue/jangadConsignmentIssue.service';
// import { PartyAccountService } from '.../../app/pages/company/components/partyAccount/partyAccount.service';
import { ConsignIssueModal } from './consignIssue-modal/consignIssue-modal.component';
import { CommonService } from 'app/pages/masters/components/common/common.service';
import { PartyDetailsService } from '.../../app/pages/company/components/partyDetails/partyDetails.service';
import { HierarchyCreationService } from 'app/pages/company/components/hierarchyCreation';
import { ReturnPreviewModal } from './returnPreview-modal/returnPreview-modal';
import { PrintDCComponent } from '../../../../../shared/print-dc/print-dc.component';
import { PrintConsignmentComponent } from '../../../../../shared/print-consignment/print-consignment.component';

const log = new Logger('JangadConsignmentReturn');

  class DCEntry {
    retDetId: number;
    issDetId: number;       // Jangad issue Item Detail Id
    issueNo: number;
    returnNo: number;
    lotId: number;
    lotName: string;
    itemId: number;
    itemName: string;
    lotItemId: number;
    totalPcs: number;
    totalCarats: number;
    spRate: number;
    stockRate: number;
    dcRate: number;
    selectedCts: number;
    rejectedCts: number;
    balancedCts: number;
    agreedRate: number;
    negotiationIssue: number;
    negoIssueName: string;
    remarks: string;
    partyCarats: number;
    selectedPcs: number;
    rejectedPcs: number;
    balancedPcs: number;
    issueDescription: string;
  }

  class items{
    si : Number;
    description: String;
    pcs: any;
    carats: any;
    rate: any;
    amount: any;   
  }

@Component({
  selector: 'create-jangadConsignmentReturn',
  templateUrl: './createJangadConsignmentReturn.html',
  styleUrls: ['./createJangadConsignmentReturn.scss']
})

export class CreateJangadConsignmentReturn implements OnInit  {

  editData: any;
  retId: number;

  selectedRowData: any;
  successMessage: string;

  jangadConsignmentReturnIdParam: string;
  pageTitle = 'Create Delivery Challan Return Entry';

  error: string = null;
  isLoading = false;
  jangadCNReturnForm: FormGroup;
  source: LocalDataSource = new LocalDataSource();
  selectBtn: boolean = false;
  showSbmtBtn: boolean = true;
  showCloseBtn: boolean = true;
  showBookBtn: boolean = true;
  isViewMode: boolean = false;

  settings: any;
  negoIssueList: any[] = [];
  issueDetailsList: DCEntry[] = [];
  jangadReturnList: DCEntry[] = [];
  returnDetailsListByIssueNo: any[] = [];
  selectSum: number = 0;
  rejectSum: number = 0;
  fetchName: boolean = false;
  tempBookSaleStatus: boolean = false;
  successSubmitStatus: boolean = false;
  printItems: items[] = [];
  customerPrint: any; //Used For printing Invoice
  loading: boolean = false;

  public returnNo: AbstractControl;
  public returnType: AbstractControl;
  public broker: AbstractControl;
  public brokerName: AbstractControl;
  public partyId: AbstractControl;
  public partyName: AbstractControl;
  public processTypeId: AbstractControl;
  public processName: AbstractControl;
  public issueDate: AbstractControl;
  public issueNo: AbstractControl;
  public department: AbstractControl;
  public deptName: AbstractControl;
  public receiptDate: AbstractControl;
  public isConsignment: AbstractControl;
  public status: AbstractControl;

  public lotCtrl: AbstractControl;
  public itemCtrl: AbstractControl;
  public issCaratsCtrl: AbstractControl;
  public negoIssueCtrl: AbstractControl;      // will come from CommonMaster of type-NI
  public selectedCaratsCtrl: AbstractControl;
  public rejectedCaratsCtrl: AbstractControl;
  public agreedRateCtrl: AbstractControl;
  public remarksCtrl: AbstractControl;
  public selectedPcsCtrl: AbstractControl;
  public rejectedPcsCtrl: AbstractControl;

  public totalIssuedCarats: AbstractControl;
  public totalSelectedCarats: AbstractControl;
  public rejectedCts: AbstractControl;    //total rejected carats
  public rejectionPerc: AbstractControl;
  public instruction: AbstractControl;              // return DC remarks
  public dcCloseDate: AbstractControl;

  public acceptPartRejection: AbstractControl;
	public generateDC: AbstractControl;
	public closeDC: AbstractControl;
  public bookSale: AbstractControl;
  public carryPerson: AbstractControl;
  

  constructor(private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private back: Location,
    // private partAccService: PartyAccountService,
    private commonService: CommonService,
    private service: JangadConsignmentReturnService,
    private conIssService: JangadConsignmentIssueService,
    private partyService: PartyDetailsService,
    private hierMasterService: HierarchyCreationService,
    private authService: AuthenticationService) {
    
    this.createForm();
    this.settings = this.prepareSetting();
    this.commonService.getAllCommonMasterByType('NI').subscribe(res => {
      this.negoIssueList = res;
    });

   }

  ngOnInit() {
    this.settings = this.prepareSetting();
    this.route.params.subscribe((params: Params) => {
      this.jangadConsignmentReturnIdParam = params['returnId'];
      if (this.jangadConsignmentReturnIdParam) {
        this.pageTitle = 'View Delivery Challan Return Entry';
        this.selectBtn = true;
        this.showSbmtBtn = false;
        this.isViewMode = true;
        this.service.getJangadCNReturnById(this.jangadConsignmentReturnIdParam).subscribe( respo => {
          this.editData = respo;
          this.jangadCNReturnForm.patchValue(respo);
          this.forPrint();
          this.jangadCNReturnForm.disable();
          this.jangadReturnList = respo.returnDetails;
          if(respo.closeDC) {
            const date: any[] = respo.dcCloseDate.split('-');
            const newDate = (date[2] + '-' + date[1] +'-' + date[0]);
            this.dcCloseDate.setValue(newDate);
          }
        });
          // no Edit will be there, only viewMode will be there & previewAll, generateDC,closeDc,partrejection & booksale btn will be enabled
      } else {
        this.jangadCNReturnForm.disable();
        this.selectBtn = false;
      }
    });
  }

  forPrint() {
    this.printItems = [];
    this.service.getIssueDetailById(this.issueNo.value).subscribe((data) => {
      this.service.getAllReturnDetailDataByIssueNo(data.issueId).subscribe( res => {
        data.issueDetails.forEach(element => {
  
          let rejectedC = 0, rejectedP = 0, rt = 0, i = 1;
          const newItem = new items;
          res.forEach(ele => {
            if(ele.lotItemId == element.lotItemId) {
                rejectedC = rejectedC + ele.rejectedCts;
                rejectedP = rejectedP + ele.rejectedPcs;
                if(ele.selectedCts > 0) {
                  rt = ele.agreedRate;
                }
            }
          });
  
          newItem.si = i;
          i++;
          newItem.pcs = parseFloat((element.totalPcs - rejectedP).toString());
          newItem.carats = parseFloat((element.totalCarats - rejectedC).toFixed(3));
          newItem.rate = rt;
          newItem.description = element.remark;
          newItem.amount = parseFloat((newItem.rate * newItem.carats).toFixed(2));
          this.printItems.push(newItem);
        });
      })
    });
  }

  print() {
    if(this.jangadConsignmentReturnIdParam) {

      let totalC = 0;
      let totalP = 0;
      let totalA = 0;
      this.printItems.forEach(item=>{
        totalC= totalC + item.carats;
        totalP = totalP + item.pcs;
        totalA = totalA + item.amount;
      });
      let cumuRate = totalA/totalC;
      
      let activeModal: any;
      if(this.isConsignment.value) {
        this.loading = false;

        activeModal = this.modalService.open(PrintConsignmentComponent, {size: 'lg'});
      } else {
        this.loading = false;

        activeModal = this.modalService.open(PrintDCComponent, {size: 'lg'});
      }  
      this.partyService.getPartyById(this.partyId.value).subscribe(data =>{
        console.log(data);
        this.service.getAddressById(data.addressMasterDTO.addressId).subscribe(ele=>{
          activeModal.componentInstance.cusAddress = ele.add11; //Selected party address
          activeModal.componentInstance.cusCity = ele.city.name;  //Selected party city
          activeModal.componentInstance.cusState = ele.state.name;  //Selected party State
          activeModal.componentInstance.supState = ele.state.name;  //Supplier's State
          debugger;
          activeModal.componentInstance.cusStateCode = ele.state.stateCode;
        })
      activeModal.componentInstance.cusName = data.partyName;  //Selected party for whom DC is generated
      activeModal.componentInstance.cusGst = data.gstNo;  //Selected party gst no
      activeModal.componentInstance.cusCin = data.cinNo;  //Selected party cin no
      activeModal.componentInstance.cusPan = data.panNo;  //Selected party pan no
      })
      activeModal.componentInstance.companyImage = 'assets/images/Logo.jpg';
      activeModal.componentInstance.challanNo = this.editData.returnIssueRefNo; // This will be issue no_return no combination
      activeModal.componentInstance.items = this.printItems;  // item list with columns(si, description, pcs, carats, rate)
      activeModal.componentInstance.totalPcs = totalP;
      activeModal.componentInstance.totalCarats =  parseFloat(totalC.toFixed(3));
      activeModal.componentInstance.tAmount = parseFloat(totalA.toFixed(2));
      activeModal.componentInstance.avgRate = parseFloat(cumuRate.toFixed(2));
      activeModal.componentInstance.printDate = this.issueDate.value;
      activeModal.componentInstance.invoiceNo = ('DC' +this.jangadConsignmentReturnIdParam);
      activeModal.componentInstance.selectBroker = this.brokerName.value;
      activeModal.componentInstance.carryPerson = this.carryPerson.value;
    } else {
      this.loading = false;

      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = false;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Please submit the DC first & Edit again to proceed for Print!!';
    }
  }

  markAllTouched(control: AbstractControl) {
    if (control.hasOwnProperty('controls')) {
      const ctrol = <any>control;
      for (const inner in ctrol.controls) {
        if (ctrol.controls) {
          this.markAllTouched(ctrol.controls[inner]);
        }
      }
    } else {
        control.markAsTouched();
    }
  }

  prepareSetting() {
    return {
      actions: {
        position: 'right',
        add: false,
        edit: false,
        delete: false,
      },
      pager: {
        display: true,
        perPage: 10,
      },
      selectMode: 'single',
       columns: {
        lotName: {
          title: 'Lot Name',
          type: 'text',
        },
        itemName: {
          title: 'Item Name',
          type: 'text',
        },
        totalCarats: {
          title: 'Issued Cts',
        },
        totalPcs: {
          title: 'Issued Pcs',
        },
        spRate: {
          title: 'SP Rate',
        },
        stockRate: {
          title: 'Stock Rate',
        },
        dcRate: {
          title: 'DC Rate',
        },
        balancedCts: {
          title: 'Balanced Cts',
        },
        partyCarats: {
          title: 'Cts with Party',
        },
        balancedPcs: {
          title: 'Balanced Pcs',
        },
      }
    };
  }

  today (): string {
    const today = new Date();
    const dd = today.getDate();
    const mm = today.getMonth() + 1;
    const yyyy = today.getFullYear();
    return yyyy + '-' + (mm < 10 ? '0' + mm : mm) + '-' + (dd < 10 ? '0' + dd : dd);
  }

  submit() {
    this.loading = true;
    if (this.jangadCNReturnForm.valid) {

      if (this.jangadReturnList.length > 0) {
        this.loading = false;
        const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
        activeModal.componentInstance.showHide = true;
        activeModal.componentInstance.modalHeader = 'Alert';
        activeModal.componentInstance.modalContent = 'Do you Really Want to Save this DC?? You will not be able to edit this DC Return again in Future!!';
        activeModal.result.then ((res) => {
          if (res == 'Y') {
            this.closeDC.setValue(false);
            this.bookSale.setValue(false);
            this.validSubmit();
          }
        });
      } else {
        this.loading = false;
        const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
        activeModal.componentInstance.showHide = false;
        activeModal.componentInstance.modalHeader = 'Alert';
        activeModal.componentInstance.modalContent = 'Please Select Some Item to Return!!!';
      }
    }
  }

  validSubmit() {

    let formValue: any;
    if (this.jangadConsignmentReturnIdParam) {
      if(this.closeDC.value) {
        this.editData.closeDC = true;
      }
      formValue = this.editData;
    } else {
      this.jangadCNReturnForm.controls['returnDetails'].setValue(this.jangadReturnList);
      this.isConsignment.enable();
      formValue = this.jangadCNReturnForm.value;
    }
    this.showSbmtBtn = false;
    this.showCloseBtn = false;
    // if (this.jangadConsignmentReturnIdParam) {
      this.service.createJangadCNReturn(formValue).subscribe( jangadConsignmentReturn => {
        // log.debug(`${credentials.selectedCompany} successfully logged in`);
        this.successSubmitStatus = true;
        this.handleBack();
        this.finally();
      }, error => {
        this.loading = false;
        this.showSbmtBtn = true;
        this.showCloseBtn = true;
        log.debug(`Creation error: ${error}`);
        this.error = error;
        this.finally();
      });
    // } else {
    //     this.service.createJangadCNReturn(this.jangadCNReturnForm.value).subscribe(jangadConsignmentReturn => {
    //       // log.debug(`${credentials.selectedCompany} successfully logged in`);
    //       this.successSubmitStatus = true;
    //       this.handleBack();
    //       this.finally();
    //     }, error => {
    //       log.debug(`Creation error: ${error}`);
    //       this.error = error;
    //       this.finally();
    //     });
    // }
     
  }

  onUserRowSelect(event: any) {
    this.selectedRowData = event.data;
    this.lotCtrl.setValue(this.selectedRowData.lotName);
    this.itemCtrl.setValue(this.selectedRowData.itemName);
    this.issCaratsCtrl.setValue(this.selectedRowData.totalCarats);
    this.negoIssueCtrl.reset();
    this.selectedCaratsCtrl.reset();
    this.rejectedCaratsCtrl.reset();
    this.selectedPcsCtrl.reset();
    this.rejectedPcsCtrl.reset();
    this.remarksCtrl.reset();
    this.agreedRateCtrl.reset();
  }

  onUpdate() {
    if(this.selectedRowData == '' || this.selectedRowData == null) {
      this.loading = false;

      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = false;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Please Select One Issue Item to Return!';
    } else {
        if(this.jangadReturnList.length > 0) {
          const itemIndex = this.jangadReturnList.findIndex(item => {
            if (this.selectedRowData.lotItemId == item.lotItemId) {
              return true;
            }
          });

          if (itemIndex >= 0) {
            this.loading = false;

            const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
            activeModal.componentInstance.showHide = false;
            activeModal.componentInstance.modalHeader = 'Alert';
            activeModal.componentInstance.modalContent = 'Item Already Added in List! Please Select another Item!';
          } else {
              this.validUpdate();
          }
        } else {
          this.validUpdate();        
      }
    }
  }

  validBlncdCaratsUpdate() {
    const sum = parseFloat((parseFloat(this.selectedCaratsCtrl.value)).toFixed(3)) + parseFloat((parseFloat(this.rejectedCaratsCtrl.value)).toFixed(3));
    const pcsSum = parseInt((parseInt(this.selectedPcsCtrl.value)).toString()) + parseInt((parseInt(this.rejectedPcsCtrl.value)).toString());

    if(sum > ((this.selectedRowData.balancedCts * 1) + 0.2)) {
      this.loading = false;

      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = false;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Sum of Selected & Rejected Carats should not be greater than Balanced Carats + 20 cents';
    } else if (pcsSum > (this.selectedRowData.balancedPcs * 1)) {
      this.loading = false;

      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = false;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'Sum of Selected & Rejected Pieces should not be greater than Balanced Pieces';
    } else {
      this.onValidAfterUpdate();
    }
  }


  validUpdate() {
    if((this.selectedCaratsCtrl.value && this.selectedCaratsCtrl.value > 0) || (this.rejectedCaratsCtrl.value && this.rejectedCaratsCtrl.value > 0)) {
      if(this.selectedCaratsCtrl.value && this.selectedCaratsCtrl.value > 0) {
        if(this.agreedRateCtrl.value && this.agreedRateCtrl.value > 0) {
          if(this.rejectedCaratsCtrl.value == null || !this.rejectedCaratsCtrl.value || this.rejectedCaratsCtrl.value == '' || this.rejectedCaratsCtrl.value <= 0) {
            this.rejectedPcsCtrl.setValue(0);
            this.rejectedCaratsCtrl.setValue(0);
            this.negoIssueCtrl.reset();
            this.validBlncdCaratsUpdate();
          } else {
            // Aman commented it
            //if(this.negoIssueCtrl.value && this.negoIssueCtrl.value != null && this.negoIssueCtrl.value != '') {
              // this.validBlncdCaratsUpdate();
           // } 

            // else {
            //   const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
            //   activeModal.componentInstance.showHide = false;
            //   activeModal.componentInstance.modalHeader = 'Alert';
            //   activeModal.componentInstance.modalContent = 'Please select Negotiation Comment as Rejected Carats is greater than 0 !!';
            // }
          }
        } else {
          if(this.agreedRateCtrl.value == null || !this.agreedRateCtrl.value || this.agreedRateCtrl.value == '') {
            this.loading = false;

            const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
            activeModal.componentInstance.showHide = false;
            activeModal.componentInstance.modalHeader = 'Alert';
            activeModal.componentInstance.modalContent = 'Please Enter Agreed Rate greater than Zero!!';
          } else if(this.agreedRateCtrl.value <= 0) {
            this.loading = false;

            const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
            activeModal.componentInstance.showHide = false;
            activeModal.componentInstance.modalHeader = 'Alert';
            activeModal.componentInstance.modalContent = 'Agreed Rate should be greater than Zero!!';
          }
        }
      }
  
      if(this.rejectedCaratsCtrl.value && this.rejectedCaratsCtrl.value > 0) {
        // if(this.negoIssueCtrl.value && this.negoIssueCtrl.value != null && this.negoIssueCtrl.value != '') {
          if(this.selectedCaratsCtrl.value == null || !this.selectedCaratsCtrl.value || this.selectedCaratsCtrl.value == '' || this.selectedCaratsCtrl.value <= 0) {
            this.selectedCaratsCtrl.setValue(0);
            this.selectedPcsCtrl.setValue(0);
            this.agreedRateCtrl.reset();
            this.validBlncdCaratsUpdate();
          } else {
            if(this.agreedRateCtrl.value && this.agreedRateCtrl.value > 0) {
              this.validBlncdCaratsUpdate();
            } 
            // else {
            //   const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
            //   activeModal.componentInstance.showHide = false;
            //   activeModal.componentInstance.modalHeader = 'Alert';
            //   activeModal.componentInstance.modalContent = 'Please Enter Agreed Rate & it should be greater than SP Rate!!';
            // }
          }
        // } else {
        //   if(this.negoIssueCtrl.value == null || !this.negoIssueCtrl.value || this.negoIssueCtrl.value == '') {
        //     const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
        //     activeModal.componentInstance.showHide = false;
        //     activeModal.componentInstance.modalHeader = 'Alert';
        //     activeModal.componentInstance.modalContent = 'Please select Negotiation Comment!!';
        //   }
        // }
      }
    } else {
      if((this.selectedCaratsCtrl.value == null || !this.selectedCaratsCtrl.value || this.selectedCaratsCtrl.value == '' || this.selectedCaratsCtrl.value <= 0) 
      && (this.rejectedCaratsCtrl.value == null || !this.rejectedCaratsCtrl.value || this.rejectedCaratsCtrl.value == '' || this.rejectedCaratsCtrl.value <= 0)) {
        this.loading = false;

        const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
        activeModal.componentInstance.showHide = false;
        activeModal.componentInstance.modalHeader = 'Alert';
        activeModal.componentInstance.modalContent = 'Please Enter Selected Carats or Rejected Carats!! Value should be greater than 0!!';
      }
    }
  }

  onValidAfterUpdate() {

    const retList = new DCEntry();
    retList.issDetId = this.selectedRowData.issDetId;
    retList.issueNo = this.selectedRowData.issueNo;
    retList.lotId = this.selectedRowData.lotId;
    retList.lotName = this.selectedRowData.lotName;
    retList.itemId = this.selectedRowData.itemId;
    retList.itemName = this.selectedRowData.itemName;
    retList.lotItemId = this.selectedRowData.lotItemId;
    retList.totalCarats = this.selectedRowData.totalCarats;
    retList.totalPcs = this.selectedRowData.totalPcs;
    retList.spRate = this.selectedRowData.spRate;
    retList.stockRate = this.selectedRowData.stockRate;
    retList.dcRate = this.selectedRowData.dcRate;
    retList.issueDescription = this.selectedRowData.issueDescription;

    if(this.selectedCaratsCtrl.value) {
      retList.selectedCts = parseFloat(this.selectedCaratsCtrl.value.toFixed(3));
    } else {
      retList.selectedCts = 0;
    }
    if(this.rejectedCaratsCtrl.value) {
      retList.rejectedCts = parseFloat(this.rejectedCaratsCtrl.value.toFixed(3));
    } else {
      retList.rejectedCts = 0;
    }
    if(this.agreedRateCtrl.value) {
      retList.agreedRate = parseFloat(this.agreedRateCtrl.value.toFixed(2));
    } else {
      retList.agreedRate = 0;
    }
    if(this.negoIssueCtrl.value) {
      retList.negotiationIssue = this.negoIssueCtrl.value.id;
      retList.negoIssueName = this.negoIssueCtrl.value.name;
    }
    if(this.selectedPcsCtrl.value > 0) {
      retList.selectedPcs = parseInt(this.selectedPcsCtrl.value.toString());
    } else {
      retList.selectedPcs = 0;
    }
    if(this.rejectedPcsCtrl.value > 0) {
      retList.rejectedPcs = parseInt(this.rejectedPcsCtrl.value.toString());
    } else {
      retList.rejectedPcs = 0;
    }
    
    retList.remarks = this.remarksCtrl.value;

    const index = this.issueDetailsList.findIndex( a => {
      if(a.lotItemId == retList.lotItemId) {
        return true;
      }
    });
    const sum = parseFloat((parseFloat(this.selectedCaratsCtrl.value)).toFixed(3)) + parseFloat((parseFloat(this.rejectedCaratsCtrl.value)).toFixed(3));    
    let cts = this.issueDetailsList[index].balancedCts;
    cts -= parseFloat(sum.toFixed(3));
    this.issueDetailsList[index].balancedCts = parseFloat(cts.toFixed(3));

    let pCts = this.issueDetailsList[index].partyCarats;
    pCts -= parseFloat((parseFloat(this.rejectedCaratsCtrl.value)).toFixed(3))
    this.issueDetailsList[index].partyCarats =  parseFloat(pCts.toFixed(3));

    const pcsSum = parseInt((parseInt(this.selectedPcsCtrl.value)).toString()) + parseInt((parseInt(this.rejectedPcsCtrl.value)).toString());
    let pcs = this.issueDetailsList[index].balancedPcs;
    if(pcsSum > 0) {
      pcs -= parseInt(pcsSum.toString());
    } else {
      pcs -= 0;
    }
    this.issueDetailsList[index].balancedPcs = parseInt(pcs.toString());
    
    this.jangadReturnList.push(retList);

    this.source.load(this.issueDetailsList);
    this.setTotalCalculatedValues();
    this.successMessage = 'Item Added to Return List Successfully! Click Preview All!!';
    setTimeout(() => this.successMessage = null, 3000);

    this.lotCtrl.reset();
    this.itemCtrl.reset();
    this.issCaratsCtrl.reset();
    this.negoIssueCtrl.reset();
    this.selectedCaratsCtrl.reset();
    this.rejectedCaratsCtrl.reset();
    this.selectedPcsCtrl.reset();
    this.rejectedPcsCtrl.reset();
    this.remarksCtrl.reset();
    this.agreedRateCtrl.reset();
    this.selectedRowData = '';
  }

  onPreviewHistory() {
    this.loading = false;

    const activeModal = this.modalService.open(ReturnPreviewModal, { size: 'lg' });
      activeModal.componentInstance.modalHeader = this.itemCtrl.value + ' - DC Return History for Issue No. ' + this.issueNo.value + ' !';
      activeModal.componentInstance.history = true;
    this.service.getAllReturnDetailsByIssueNoAndLotItemId(this.issueNo.value, this.selectedRowData.lotItemId).subscribe( data => {
      if(data) {
        activeModal.componentInstance.source.load(data);
      }
    })
  }

  onPreviewAll() {
    this.loading = false;

    const activeModal = this.modalService.open(ReturnPreviewModal, { size: 'lg' });
    activeModal.componentInstance.modalHeader = 'Delivery Challan Return List';
    activeModal.componentInstance.history = false;
    activeModal.componentInstance.viewMode = this.isViewMode;
      const date: any[] = this.receiptDate.value.split('-');
      const newDate = (date[2] + '-' + date[1] +'-' + date[0]);
    activeModal.componentInstance.receiptDate = newDate;
    activeModal.componentInstance.source.load(this.jangadReturnList);
    activeModal.componentInstance.showList = this.jangadReturnList;
    activeModal.componentInstance.emitService.subscribe((emmitedValue) => {
      this.onDelStatus(emmitedValue[0], emmitedValue[1], emmitedValue[2]);
    });
  }

  onDelStatus(deleted: boolean = false, newList: any[], deletedData: any) {
    if(deleted) {
      this.jangadReturnList = newList;
      this.setTotalCalculatedValues();
      const index = this.issueDetailsList.findIndex( ite => {
        if(ite.lotItemId == deletedData.lotItemId) {
          return true;
        }
      });
      const sum = parseFloat((parseFloat(deletedData.selectedCts)).toFixed(3)) + parseFloat((parseFloat(deletedData.rejectedCts)).toFixed(3));
      let cts = this.issueDetailsList[index].balancedCts;
      cts += parseFloat(sum.toFixed(3));
      this.issueDetailsList[index].balancedCts = parseFloat(cts.toFixed(3));

      let pCts = this.issueDetailsList[index].partyCarats;
      pCts += parseFloat((parseFloat(deletedData.rejectedCts)).toFixed(3))
      this.issueDetailsList[index].partyCarats =  parseFloat(pCts.toFixed(3));

      const pcsSum = parseInt((parseInt(deletedData.selectedPcs)).toString()) + parseInt((parseInt(deletedData.rejectedPcs)).toString());
      let pcs = this.issueDetailsList[index].balancedPcs;
      if(pcsSum > 0) {
        pcs += parseInt(pcsSum.toString());
      } else {
        pcs += 0;
      }
      this.issueDetailsList[index].balancedPcs = parseInt(pcs.toString());

      this.source.load(this.issueDetailsList);
    }
  }

  onAcceptPartRejection() {
    // prompt a pop up for confirmation
    // check for jangadReturnList.length != 0
    // check for issued carats != & <= total selected + rejected carats
    // part rejection button will not be there
    // no backened api will be there for part Rejection
  }

  onReturnMemo() {

  }

  onGenerateDC() {
    // prompt a pop up for confirmation
    // check for jangadReturnList.length != 0

  }

  onCloseDC() {

    if(this.jangadReturnList.length > 0) {
      if(this.closeDC.value) {
        this.loading = false;

        const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
        activeModal.componentInstance.showHide = false;
        activeModal.componentInstance.modalHeader = 'Alert';
        activeModal.componentInstance.modalContent = 'This DC has already been Closed on ' + this.dcCloseDate.value;
      } else {
        let diffCarats: number;
        diffCarats = Math.abs(this.totalIssuedCarats.value - (this.totalSelectedCarats.value + this.rejectedCts.value));
        diffCarats = parseFloat(diffCarats.toFixed(3));
        if(diffCarats >= 0 && diffCarats <= 0.2) {
          if(diffCarats != 0) {
            this.loading = false;

            const activeModal = this.modalService.open(CommonModalComponent, { size: 'lg' });
            activeModal.componentInstance.showHide = true;
            activeModal.componentInstance.modalHeader = 'Alert';
            activeModal.componentInstance.modalContent = 'Difference between Total Issued Cts & Sum of Selected & Rejected Cts is ' + (diffCarats) + ' ! Press OK to Close DC or Cancel to review your Allocation!';
            activeModal.result.then ((res) => {
              if (res == 'Y') {
                this.closeDC.setValue(true);
                this.validSubmit();
              }
            });
          } else {
            this.loading = false;

            const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
            activeModal.componentInstance.showHide = true;
            activeModal.componentInstance.modalHeader = 'Alert';
            activeModal.componentInstance.modalContent = 'Do you really Want to Close the DC?? Press OK to Close DC or Cancel to review your Allocation!!';
            activeModal.result.then ((res) => {
              if (res == 'Y') {
                this.closeDC.setValue(true);
                this.validSubmit();
              }
            });
          }
        } else if(diffCarats > 0.2) {
          this.loading = false;

            const activeModal = this.modalService.open(CommonModalComponent, { size: 'lg' });
            activeModal.componentInstance.showHide = false;
            activeModal.componentInstance.modalHeader = 'Alert';
            activeModal.componentInstance.modalContent = 'Difference between Total Issued Cts & Sum of Selected & Rejected Cts is more than 20 cents. So, You cannot close the DC!';
        }
      }
    } else {
      this.loading = false;

      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = false;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'You Cannot Close the DC as No Items were added to Return List!! Click Preview All';
    }
  }
    
  onBookSale() {
    const sum = parseFloat(this.getColTotal('selectedCts', this.jangadReturnList).toFixed(3));

    if(this.jangadReturnList.length > 0 && ((this.isConsignment.value && sum > 0) || (!this.isConsignment.value && this.totalSelectedCarats.value > 0))) {
      if(this.bookSale.value) {
        this.loading = false;

        const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
        activeModal.componentInstance.showHide = false;
        activeModal.componentInstance.modalHeader = 'Alert';
        activeModal.componentInstance.modalContent = 'You cannot Book Sale as Sales Invoice for this DC has already been Generated!!';
      } else {
        let diffCarats: number;
        diffCarats = Math.abs(this.totalIssuedCarats.value - (this.totalSelectedCarats.value + this.rejectedCts.value));
        diffCarats = parseFloat(diffCarats.toFixed(3));
        this.loading = false;

        const activeModal = this.modalService.open(CommonModalComponent, { size: 'lg' });
        activeModal.componentInstance.showHide = true;
        activeModal.componentInstance.modalHeader = 'Alert';
        if(diffCarats > 0 && diffCarats <= 0.2) {
          
          activeModal.componentInstance.modalContent = 'Do you really Want to Book Sale for this Item(s) with Kathi Difference as ' + diffCarats + ' ?? It will also Close DC !! Press OK to Proceed or Cancel to review your Allocation!!';          
        } else if(diffCarats == 0) {
          activeModal.componentInstance.modalContent = 'Do you really Want to Close DC & Book Sale for this Item(s)?? Press OK to Proceed or Cancel to review your Allocation!!';          
        } else {
          activeModal.componentInstance.modalContent = 'Do you really Want to Book Sale for this Item(s)?? Press OK to Book Sale or Cancel to review your Allocation!!';          
        }
        activeModal.result.then ((res) => {
          if (res == 'Y') {
            
            if(this.isConsignment.value) {

              if(diffCarats >= 0 && diffCarats <= 0.2) {
                this.closeDC.setValue(true);
              } else if(diffCarats > 0.2) {
                this.closeDC.setValue(false);
              }
              this.submitForBookSale();
            } else {
              if(diffCarats >= 0 && diffCarats <= 0.2) {
                this.closeDC.setValue(true);
                this.submitForBookSale();
              } else if(diffCarats > 0.2) {
                this.loading = false;

                const activeModal = this.modalService.open(CommonModalComponent, { size: 'lg' });
                activeModal.componentInstance.showHide = false;
                activeModal.componentInstance.modalHeader = 'Alert';
                activeModal.componentInstance.modalContent = 'Difference between Total Issued Cts & Sum of Selected & Rejected Cts is more than 20 cents. So, You cannot Book Sale for this DC!';
              }
            }
          }
        });
      }
    } else {
      this.loading = false;

      const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
      activeModal.componentInstance.showHide = false;
      activeModal.componentInstance.modalHeader = 'Alert';
      activeModal.componentInstance.modalContent = 'You Cannot Book Sale as No Selected Carats Item were added to Return List!! Click Preview All';
    }
  }

  submitForBookSale() {
    this.tempBookSaleStatus = true;
    let formValue: any;

    if (this.jangadConsignmentReturnIdParam) {
      if(this.closeDC.value) {
        this.editData.closeDC = true;
      }
      formValue = this.editData;
    } else {
      this.jangadCNReturnForm.controls['returnDetails'].setValue(this.jangadReturnList);
      this.isConsignment.enable();
      formValue = this.jangadCNReturnForm.value;
    }
    this.showBookBtn = false;
    this.service.createJangadCNReturn(formValue).subscribe( jangadConsignmentReturn => {
      this.successSubmitStatus = true;
      this.retId = jangadConsignmentReturn.returnId;
      this.routeToInvoice();
      this.finally();
    }, error => {
      this.showBookBtn = true;
      log.debug(`Creation error: ${error}`);
      this.error = error;
      this.finally();
    });


    // if(this.successSubmitStatus) {
    //   this.routeToInvoice();
    // } else {
    //   const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
    //   activeModal.componentInstance.showHide = false;
    //   activeModal.componentInstance.modalHeader = 'Alert';
    //   activeModal.componentInstance.modalContent = 'Server Error! DC Return has not Submitted & hence cannot redirect to invoice';
    // }
  }

  routeToInvoice() {
    this.loading = false;

    const activeModal = this.modalService.open(CommonModalComponent, { size: 'sm' });
    activeModal.componentInstance.showHide = false;
    activeModal.componentInstance.modalHeader = 'Alert';
    if(this.isConsignment.value) {
      if(this.jangadConsignmentReturnIdParam) {
        activeModal.componentInstance.modalContent = 'You have been Redirected to Export Sales Invoice to Book Sale!!';   
        this.router.navigate(['../../createExportInvoiceFromDCReturn', this.retId], { relativeTo: this.route });     
      } else {
        activeModal.componentInstance.modalContent = 'DC Return has successfully Submitted & You have been Redirected to Export Sales Invoice to Book Sale!!';        
        this.router.navigate(['../createExportInvoiceFromDCReturn', this.retId], { relativeTo: this.route });
      }
    } else {
      if(this.jangadConsignmentReturnIdParam) {
        activeModal.componentInstance.modalContent = 'You have been Redirected to Sales Invoice to Book Sale!!';
        this.router.navigate(['../../createSalesInvoiceFromDCReturn', this.retId], { relativeTo: this.route });     
      } else {
        activeModal.componentInstance.modalContent = 'DC Return has successfully Submitted & You have been Redirected to Sales Invoice to Book Sale!!';
        this.router.navigate(['../createSalesInvoiceFromDCReturn', this.retId], { relativeTo: this.route });
      }
    }
  }
  
  finally() {
    this.isLoading = false;
    this.jangadCNReturnForm.markAsPristine();
  }

  handleBack(cancelling: boolean= false) {
    // TODO: if cancelling then ask to confirn
    this.back.back();
  }

  lgModalShow() {
    this.loading = false;

    const activeModal = this.modalService.open(ConsignIssueModal, {size: 'lg'});
    activeModal.componentInstance.modalHeader = 'Delivery Challan Issue Details';
    activeModal.componentInstance.emitService.subscribe((emmitedValue) => {
      if(emmitedValue) {
        
        this.jangadCNReturnForm.enable();
        this.service.getIssueDetailById(emmitedValue.issueId).subscribe((data) => {
          this.fetchName = true;
          this.broker.setValue(data.broker);
          this.partyId.setValue(data.partyId.partyId);
          const name: string = data.partyId.partyName;
          this.partyName.setValue(name);
          this.processTypeId.setValue(data.processTypeId.processTypeId);
          this.processName.setValue(data.processTypeId.processName);
          this.issueDate.setValue(data.issueDate);
          this.issueNo.setValue(data.issueId);
          this.department.setValue(data.department);
          this.receiptDate.setValue(this.today());
          this.isConsignment.disable();
          this.isConsignment.setValue(data.isConsignment);
          this.status.setValue(false);

          this.service.getAllReturnDetailDataByIssueNo(data.issueId).subscribe( res => {
            data.issueDetails.forEach(element => {
              const issueList = new DCEntry();
              issueList.issDetId = element.issDetId;
              issueList.issueNo = this.issueNo.value;
              issueList.lotId = element.lotId;
              issueList.lotName = element.lotName;
              issueList.itemId = element.itemId;
              issueList.itemName = element.itemName;
              issueList.lotItemId = element.lotItemId;
              issueList.totalPcs = element.totalPcs;
              issueList.totalCarats = element.totalCarats;
              issueList.spRate = element.spRate;
              issueList.stockRate = element.stockRate;
              issueList.dcRate = element.dcRate;
              issueList.issueDescription = element.remark;

                let sum = 0;
                let pcsSum = 0;
                let rejected = 0;
                this.returnDetailsListByIssueNo = res;
                this.selectSum = parseFloat(this.getColTotal('selectedCts', this.returnDetailsListByIssueNo).toFixed(3));
                this.rejectSum = parseFloat(this.getColTotal('rejectedCts', this.returnDetailsListByIssueNo).toFixed(3));
                res.forEach(ele => {
                  if(ele.lotItemId == element.lotItemId) {
                     sum = sum + ele.selectedCts + ele.rejectedCts;
                     pcsSum = pcsSum + ele.selectedPcs + ele.rejectedPcs;
                     rejected = rejected + ele.rejectedCts;
                  }
                });
              issueList.balancedCts =  parseFloat((issueList.totalCarats - sum).toFixed(3));
              issueList.balancedPcs =  parseInt((issueList.totalPcs - pcsSum).toString());
              issueList.partyCarats =  parseFloat((issueList.totalCarats - rejected).toFixed(3));
              this.issueDetailsList.push(issueList);
            });
            this.settings = this.prepareSetting();
            this.source.load(this.issueDetailsList);
            this.setTotalCalculatedValues();
          })

          this.acceptPartRejection.setValue(false);
          this.generateDC.setValue(false);
          this.closeDC.setValue(false);
          this.bookSale.setValue(false);

          this.selectBtn = true;
          this.fetchName = false;
        });
      } else {
        this.jangadCNReturnForm.disable();
      }
      
    }); 
  }

  setTotalCalculatedValues() {
    this.totalIssuedCarats.setValue(this.getTotIssuedCarats);
    this.totalSelectedCarats.setValue(this.getTotSelectedCarats);
    this.rejectedCts.setValue(this.getRejectedCarats);
    this.rejectionPerc.setValue(this.getRejectionPerc);
  }

  getColTotal(colName: string, value: any[]): number {
    let total: number;
    total = 0;
    value.forEach(row => {
      total += parseFloat(row[colName]);
    });
    return total;
  }

  get getTotIssuedCarats(): number {
    return parseFloat(this.getColTotal('totalCarats', this.issueDetailsList).toFixed(3));
  }

  get getTotSelectedCarats(): number {
    const sum = parseFloat(this.getColTotal('selectedCts', this.jangadReturnList).toFixed(3));
    return parseFloat((this.selectSum + sum).toFixed(3));
  }

  get getRejectedCarats(): number {
    const sum = parseFloat(this.getColTotal('rejectedCts', this.jangadReturnList).toFixed(3));
    return parseFloat((this.rejectSum + sum).toFixed(3));
  }

  get getRejectionPerc(): number {
    if(this.getRejectedCarats == 0 || this.getTotIssuedCarats == 0) {
      return 0;
    } else {
      return parseFloat(((this.getRejectedCarats/this.getTotIssuedCarats) * 100).toFixed(2));
    }
  }

  private createForm() {
    this.jangadCNReturnForm = this.fb.group({
      'returnId': [''],
      'returnNo': [''],
      'returnType': [''],
      'broker': [''],
      'brokerName': [''],
      'partyId': [''],
      'partyName': [''],
      'processTypeId': [''],
      'processName': [''],
      'issueDate': [''],
      'issueNo': [''],
      'department': [''],
      'deptName': [''],
      'receiptDate': [''],
      'isConsignment': [''],
      'status': [''],

      'lotCtrl': [''],
      'itemCtrl': [''],
      'issCaratsCtrl': [''],
      'negoIssueCtrl': [''],
      'selectedCaratsCtrl': [''],
      'rejectedCaratsCtrl': [''],
      'agreedRateCtrl': [''],
      'remarksCtrl': [''],
      'selectedPcsCtrl': [''],
      'rejectedPcsCtrl': [''],

      'totalIssuedCarats': [''],
      'totalSelectedCarats': [''],
      'rejectedCts': [''],
      'rejectionPerc': [''],
      'instruction': [''],
      'dcCloseDate': [''], 
      'acceptPartRejection': [''],
      'generateDC': [''],
      'closeDC': [''],
      'bookSale': [''],

      'returnDetails': [this.jangadReturnList],
      'carryPerson': [''],
    });

    this.returnNo = this.jangadCNReturnForm.controls['returnNo'];
    this.returnType = this.jangadCNReturnForm.controls['returnType'];
    this.broker = this.jangadCNReturnForm.controls['broker'];
    this.brokerName = this.jangadCNReturnForm.controls['brokerName'];
    this.partyId = this.jangadCNReturnForm.controls['partyId'];
    this.partyName = this.jangadCNReturnForm.controls['partyName'];
    this.processTypeId = this.jangadCNReturnForm.controls['processTypeId'];
    this.processName = this.jangadCNReturnForm.controls['processName'];
    this.issueDate = this.jangadCNReturnForm.controls['issueDate'];
    this.issueNo = this.jangadCNReturnForm.controls['issueNo'];
    this.department = this.jangadCNReturnForm.controls['department'];
    this.deptName = this.jangadCNReturnForm.controls['deptName'];
    this.receiptDate = this.jangadCNReturnForm.controls['receiptDate'];
    this.isConsignment = this.jangadCNReturnForm.controls['isConsignment'];
    this.status = this.jangadCNReturnForm.controls['status'];
    this.lotCtrl = this.jangadCNReturnForm.controls['lotCtrl'];   
    this.itemCtrl = this.jangadCNReturnForm.controls['itemCtrl'];
    this.issCaratsCtrl = this.jangadCNReturnForm.controls['issCaratsCtrl'];
    this.negoIssueCtrl = this.jangadCNReturnForm.controls['negoIssueCtrl'];
    this.selectedCaratsCtrl = this.jangadCNReturnForm.controls['selectedCaratsCtrl'];
    this.rejectedCaratsCtrl = this.jangadCNReturnForm.controls['rejectedCaratsCtrl'];
    this.agreedRateCtrl = this.jangadCNReturnForm.controls['agreedRateCtrl'];
    this.remarksCtrl = this.jangadCNReturnForm.controls['remarksCtrl'];
    this.selectedPcsCtrl = this.jangadCNReturnForm.controls['selectedPcsCtrl'];
    this.rejectedPcsCtrl = this.jangadCNReturnForm.controls['rejectedPcsCtrl'];
    
    this.totalIssuedCarats = this.jangadCNReturnForm.controls['totalIssuedCarats'];
    this.totalSelectedCarats = this.jangadCNReturnForm.controls['totalSelectedCarats'];
    this.rejectedCts = this.jangadCNReturnForm.controls['rejectedCts'];
    this.rejectionPerc = this.jangadCNReturnForm.controls['rejectionPerc'];
    this.instruction = this.jangadCNReturnForm.controls['instruction'];
    this.dcCloseDate = this.jangadCNReturnForm.controls['dcCloseDate'];
    this.acceptPartRejection = this.jangadCNReturnForm.controls['acceptPartRejection'];
    this.generateDC = this.jangadCNReturnForm.controls['generateDC'];
    this.closeDC = this.jangadCNReturnForm.controls['closeDC'];
    this.bookSale = this.jangadCNReturnForm.controls['bookSale'];
    this.carryPerson = this.jangadCNReturnForm.controls['carryPerson'];

    this.broker.valueChanges.subscribe( res => {
      if(res && this.fetchName) {
        this.partyService.getPartyById(res).subscribe( data => {
          this.brokerName.setValue(data.partyName);
        });
      }
    })

    this.department.valueChanges.subscribe( res => {
      if(res && this.fetchName) {
        this.hierMasterService.getHierById(res).subscribe( data => {
          this.deptName.setValue(data.hierName);
        });
      }
      
    })
  }
}
