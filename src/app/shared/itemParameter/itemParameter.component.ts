import { Observable } from 'rxjs/Rx';
import { ParaValueService } from '.../../app/pages/masters/components/parameterValue';
import { ParaListService } from '.../../app/pages/masters/components/parameterList';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import {FilterDataPipe} from '.../../app/theme/pipes/filterData.pipe'

@Component({
    moduleId: module.id,
    selector: 'item-parameter',
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
    template:  `
    <div [formGroup]="itemParameter" class="row" [ngClass]="{odd:odd}">
        <div class="form-group col-sm-6">
            <label for="">Parameter Name</label>
            <select class="form-control" formControlName="parameterName">
                <option *ngFor="let paraName of paraListData | async" [value]="paraName.parameterName">
                    {{paraName.parameterName}}
                </option>
            </select>
            <small [hidden]="parameterName.valid || !parameterName.touched" class="text-danger">
                Parameter Name is required
            </small>
        </div>
        <div class="form-group col-sm-6">
            <label>Parameter Value</label>
            <a (click)="handleRemove()" style="cursor: pointer" class="pull-right">
                <span class="text-danger"><i class="fa fa-minus-circle" aria-hidden="true"></i></span> Remove
            </a>
            <select class="form-control" formControlName="parameterValue">
                <option *ngFor="let paraValue of paraValueData | async | filterData:{property:'parameterName', value: parameterName.value}"
                [value]="paraValue.parameterValue">
                    {{paraValue.parameterValue}}
                </option>
            </select>
            <small [hidden]="parameterValue.valid || !parameterValue.touched" class="text-danger">
                Parameter Value is required
            </small>
        </div>
    </div>
`,
})
export class ItemParameterComponent implements OnInit {
    @Input()
    public itemParameter: FormGroup;

    @Input()
    public odd: boolean;

    @Output()
    remove: EventEmitter<any> = new EventEmitter();

    public parameterName: AbstractControl;
    public parameterValue: AbstractControl;

    paraListData: Observable<any[]>;
    paraValueData: Observable<any[]>;

    constructor(public paraNameService: ParaListService, public paramValService: ParaValueService) {
        this.paraListData = paraNameService.getData();
        this.paraValueData = paramValService.getData();
    }

    
    ngOnInit() {
        this.parameterName = this.itemParameter.controls['parameterName'];
        this.parameterValue = this.itemParameter.controls['parameterValue'];
    }

    handleRemove() {
        this.remove.emit();
    }
}


