import { debug } from 'util';
import { Observable } from 'rxjs/Observable';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { ParaValueService } from '../../../parameterValue';

@Component({
    moduleId: module.id,
    selector: 'item-param',
    styles: [
        `
        .row{
            padding-top: 10px;
            margin: 0;
            background-color:rgba(255,255,255,0.1);
        }
        .row.odd{
            background-color:rgba(0,0,0,0.1);
        }
        `
    ],
    template: `
        <div [formGroup]="itemParameter" class="row" [ngClass]="{odd:odd}">
            <div class="form-group col-sm-6" [ngClass]="{'has-error': (!paramId.valid && paramId.touched),
            'has-success': (paramId.valid && paramId.touched)}">
                <label for="">Parameter Name</label>
                <select class="form-control" formControlName="paramId">
                <option *ngFor="let paraName of _paraNameList | uniqParam: selectedIds : paramId.value" [value]="paraName.paramId">
                    {{paraName.paramName}}
                </option>
                </select>
                <small [hidden]="paramId.valid || !paramId.touched" class="text-danger">
                    Parameter Name is required
                </small>
            </div>
            <div class="form-group col-sm-6" [ngClass]="{'has-error': (!paramValId.valid && paramValId.touched),
            'has-success': (paramValId.valid && paramValId.touched)}">
                <label>Parameter Value</label>
                <a (click)="handleRemove()" style="cursor: pointer" class="pull-right">
                    <span class="text-danger"><i class="fa fa-minus-circle" aria-hidden="true"></i></span> Remove
                </a>
                <select class="form-control" formControlName="paramValId">
                <option *ngFor="let paraValue of _paraValueList | filterData: {property:'parameterType', value: paramId.value}" [value]="paraValue.paramValId">
                    {{paraValue.paramValue}}
                </option>
                </select>
                <small [hidden]="paramValId.valid || !paramValId.touched" class="text-danger">
                    Parameter Value is required
                </small>
            </div>
        </div>
    `,
})
export class ParameterComponent implements OnInit {

    _paraNameList: any[];
    _paraValueList: any[];

    @Input()
    set paraNameList(paraNameList: any[]){
        this._paraNameList = paraNameList ? paraNameList : [];
    }

    @Input()
    set paraValueList(paraValueList: any[]){
        this._paraValueList = paraValueList ? paraValueList : [];
    }

    @Input()
    public selectedIds: string[];

    @Input()
    public itemParameter: FormGroup;

    @Input()
    public selectedParameters: any[];

    @Input()
    public odd: boolean;

    @Output()
    remove: EventEmitter<any> = new EventEmitter();

    public paramId: AbstractControl;
    public paramValId: AbstractControl;

    constructor(private paramValService: ParaValueService) {
    }

    ngOnInit() {
        console.log('Inside ngOnInit of item parameter component ');
        this.paramId = this.itemParameter.controls['paramId'];
        this.paramValId = this.itemParameter.controls['paramValId'];

        /* this.paramId.valueChanges.subscribe(value => {
        this.paraValueList = this.paramValService.getParameterValuesOfParameter(value);
        }); */
    }

    handleRemove() {
        this.remove.emit();
    }
 /* onChange(paramId: number): void {
  this.paraValueList = this.paramValService.getParameterValuesOfParameter(paramId);
  // console.log(this.paraValueList)
 } */
}
