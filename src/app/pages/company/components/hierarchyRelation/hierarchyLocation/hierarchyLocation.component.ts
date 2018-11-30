import { TreeviewItem } from 'ngx-treeview/src';
import { FormGroup, AbstractControl, FormBuilder, Validators  } from '@angular/forms';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../../../../../core/authentication/authentication.service';
import { Logger } from '../../../../../core/logger.service';
import { HierarchyRelationService } from '../hierarchyRelation.service';
import { HierarchyCreationService } from '../../hierarchyCreation/hierarchyCreation.service';
import {Subject} from 'rxjs/Subject';
import {debounceTime} from 'rxjs/operator/debounceTime';

const log = new Logger('HierarchyLocation');

@Component({
  selector: 'hierarchy-location',
  templateUrl: './hierarchyLocation.html'
})
export class HierarchyLocation {

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

  divisions: any[] = [];

  chilrenList: TreeviewItem[];
  childrenIds: string[] = [];

  public parent: AbstractControl;
  public childHierIds: AbstractControl;

  private _success = new Subject<string>();
  accessList: any[] = [];
  addAccess:boolean=true;
  
  constructor(private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private service: HierarchyRelationService,
    private hierarchyCreationService:  HierarchyCreationService,
    private authService: AuthenticationService) {
      this.accessList = this.authService.getUserAccessOfMenu('hierarchyRelation');
      this.addAccess = this.accessList.includes("ADD");

    this.createForm();
    this.service.getHierById(authService.credentials.company).subscribe( hier => {
      this.loadChildrenById(hier.hierarchyMaster.hierId, divisions => {
        this.divisions = divisions;
        if (this.divisions.length) {
          let parentId = this.divisions[0].hierId;
          this.parent.patchValue(parentId);
          this.loadChildrenById(parentId, null, 'LO');
        }
      });
    });
  }

  loadChildrenById(parentId, callback, type="") {
    this.service.getHierarchyRelationByParentId(parentId).subscribe(children => {
      if (callback) {
        callback(children);
      } else {
        children.forEach(child => {
          this.childrenIds.push(child.hierId);
        });

        this.hierarchyCreationService.getAllHierachyByType(type).subscribe(hierarchies => {
          this.chilrenList = [];
          hierarchies.forEach(hier => {
            this.chilrenList.push(new TreeviewItem({ text: hier.hierName, value: hier.hierId+'', checked: this.childrenIds.indexOf(hier.hierId) !== -1 }));
          });
        });
      }
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

    this.service.createHier(formValue).subscribe(hier => {
      this._success.next(`Location Successfully Saved! Go To Next Tab`);
      this.message.emit(this.successMessage);
      console.log(hier);
      this.finally();
    }, error => {
      log.debug(`Creation error: ${error}`);
      this._success.next(`Location Creation Fail!`);
      this.message.emit(this.successMessage);
      this.err.emit(this.error);
      this.error = error;
      this.finally();
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
      'parent': ['', Validators.compose([Validators.required])],
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
