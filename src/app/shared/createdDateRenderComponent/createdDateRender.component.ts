import { ViewCell } from 'ng2-smart-table';
import { Component, Input, OnInit } from '@angular/core';


@Component({
  template: `
    {{renderValue}}
  `,
})
export class CreatedDateRenderComponent implements ViewCell, OnInit {

  renderValue: string;

  @Input() value: string | number;
  @Input() rowData: any;

  ngOnInit() {
    if (!this.value) {
        const today = new Date();
        const dd = today.getDate();
        const mm = today.getMonth() + 1; //January is 0!

        const yyyy = today.getFullYear();
        this.renderValue = (dd < 10 ? '0' + dd : dd) + '-' + (mm < 10 ? '0' + mm : mm) + '-' + yyyy;
    }else {
        this.renderValue = '' + this.value;
    }
  }

}
