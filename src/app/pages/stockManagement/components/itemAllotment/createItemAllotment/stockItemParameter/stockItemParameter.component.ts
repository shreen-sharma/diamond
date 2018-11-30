import { debug } from 'util';
import { Observable } from 'rxjs/Observable';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { ParaValueService } from '.../../app/pages/masters/components/parameterValue';

@Component({
    moduleId: module.id,
    selector: 'stock-item-parameter',
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
            <div class="form-group col-sm-6">
                <label for="">Parameter Name</label>
                <select class="form-control" formControlName="parameterType" (change)="onChange($event.target.value)">
                <option *ngFor="let paraName of _paraNameList" [value]="paraName.paramId">
                    {{paraName.paramName}}
                </option>
                </select>
                <small [hidden]="parameterType.valid || !parameterType.touched" class="text-danger">
                    Parameter Name is required
                </small>
            </div>
            <div class="form-group col-sm-6">
                <label>Parameter Value</label>
                <a (click)="handleRemove()" style="cursor: pointer" class="pull-right">
                    <span class="text-danger"><i class="fa fa-minus-circle" aria-hidden="true"></i></span> Remove
                </a>
                <select class="form-control" formControlName="paramValId">
                <option *ngFor="let paraValue of paraValueList | async" [value]="paraValue.paramValId">
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
export class StockItemParameterComponent implements OnInit {

    paraValueList: Observable<any[]>;
    _paraNameList: any[];

    @Input()
    set paraNameList(paraNameList: any[]){
        debugger;
        this._paraNameList = paraNameList ? paraNameList : [];
    }

    @Input()
    public itemParameter: FormGroup;

    @Input()
    public odd: boolean;

    @Output()
    remove: EventEmitter<any> = new EventEmitter();

    public parameterType: AbstractControl;
    public paramValId: AbstractControl;

    constructor(private paramValService: ParaValueService) {
    }

    ngOnInit() {
        this.parameterType = this.itemParameter.controls['parameterType'];
        this.paramValId = this.itemParameter.controls['paramValId'];
    }

    handleRemove() {
        this.remove.emit();
    }
 onChange(parameterTypeId: number): void {
     debugger;
  this.paraValueList = this.paramValService.getParameterValuesOfParameter(parameterTypeId);
  console.log(this.paraValueList)
 }
}
