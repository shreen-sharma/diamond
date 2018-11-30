import { TreeviewItem } from 'ngx-treeview/src';
import { FormGroup, AbstractControl, FormBuilder, Validators  } from '@angular/forms';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../../../../../core/authentication/authentication.service';
import { Logger } from '../../../../../core/logger.service';
import { HierarchyRelationService } from '../hierarchyRelation.service';
import { HierarchyCreationService } from '../../hierarchyCreation/hierarchyCreation.service';
import {debounceTime} from 'rxjs/operator/debounceTime';
import {Subject} from 'rxjs/Subject';

const log = new Logger('HierarchyDivision');

@Component({
  selector: 'hierarchy-division',
  templateUrl: './hierarchyDivision.html'

})
export class HierarchyDivision implements OnInit {

  successMessage: string;
   @Output() message: EventEmitter<string> = new EventEmitter<string>();
   @Output() err: EventEmitter<string> = new EventEmitter<string>();

     @Input()
   set data(division: any) {
    this.hierRelForm.patchValue(division);
   }

  error: string = null;
  isLoading = false;

  treeConfig: any;
  hierRelForm: FormGroup;

  chilrenList: TreeviewItem[];
  childrenIds: string[] = [];
  companyName: string;
  companyId: number;

  public parent: AbstractControl;
  public childHierIds: AbstractControl;
  public company: AbstractControl;
  accessList: any[] = [];
  addAccess:boolean=true;
  private _success = new Subject<string>();

  constructor(private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private service: HierarchyRelationService,
    private hierarchyCreationService:  HierarchyCreationService,
    private authService: AuthenticationService) {
      this.accessList = this.authService.getUserAccessOfMenu('hierarchyRelation');
      this.addAccess = this.accessList.includes("ADD");
    

   this.createForm();
    this.service.getHierById(authService.credentials.company).subscribe( hierMaster => {
      debugger;
     if (hierMaster) {
        this.companyName = hierMaster.hierarchyMaster.hierName;
        this.companyId = hierMaster.hierarchyMaster.hierId;
        this.parent.setValue(this.companyId);
     }
      this.service.getHierarchyRelationByParentId(this.parent.value).subscribe(children => {
        children.forEach(child => {
          this.childrenIds.push(child.hierId);
        });

        this.hierarchyCreationService.getAllHierachyByType('DV').subscribe(hierarchies => {
          this.chilrenList = [];
          hierarchies.forEach(hier => {
            this.chilrenList.push(new TreeviewItem({ text: hier.hierName, value: hier.hierId+'', checked: this.childrenIds.indexOf(hier.hierId) !== -1 }));
          });
        });
      });
    });
  }

  ngOnInit() {
     this._success.subscribe((message) => this.successMessage = message);
  }

   submit() {
    if (this.hierRelForm.valid) {
    this.isLoading = true;
    const formValue: any = this.hierRelForm.value;
    formValue.childHierIds = this.childrenIds;

    this.service.createHier(formValue)
      .subscribe(hier => {
         this._success.next(`Division Successfully Saved! Go To Next Tab`);
        this.message.emit(this.successMessage);
        this.finally();
       console.log(hier);

      }, error => {
        log.debug(`Creation error: ${error}`);
        this.error = error;
        this._success.next(`Division Creation Fail!`);
        this.message.emit(this.successMessage);
        this.err.emit(this.error);

      });
    }
   }

  finally() {
    this.isLoading = false;
    this.hierRelForm.markAsPristine();
  }

  onChildrenChange(selected: string[]) {
    this.childrenIds = selected;
  }

  private createForm() {
    this.hierRelForm = this.fb.group({
      'hierRelId': [''],
      'parent': [this.authService.credentials.company],
      'childHierIds': this.fb.array([this.childrenIds], Validators.compose([Validators.required]))
    });
    this.parent = this.hierRelForm.controls['parent'];
    this.childHierIds = this.hierRelForm.controls['childHierIds'];

    this.treeConfig = {
      hasAllCheckBox: false,
      hasFilter: false,
      hasCollapseExpand: false,
      maxHeight: 500
    };
  }
}
