import { ViewCell } from 'ng2-smart-table';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  template: `
    {{renderValue}}
  `,
})
export class DefaultNumberComponent implements ViewCell, OnInit {

  renderValue: string;

  @Input() value: string | number;
  @Input() rowData: any;

  ngOnInit() {
    if (!this.value) {

      this.renderValue = '0';
    }
      // else {
    //     this.renderValue = '' + this.value;
    // }
  }

}
