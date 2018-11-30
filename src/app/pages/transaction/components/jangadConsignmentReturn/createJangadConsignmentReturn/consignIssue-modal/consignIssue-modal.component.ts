import { JangadConsignmentReturnService } from '../../jangadConsignmentReturn.service';
import { LocalDataSource } from 'ng2-smart-table';
import { Component, OnInit, Output, EventEmitter, ElementRef } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'consignIssue-modal',
  styleUrls: [('./consignIssue-modal.component.scss')],
  templateUrl: './consignIssue-modal.component.html'
})

export class ConsignIssueModal implements OnInit {

  private data: any;
  @Output() emitService = new EventEmitter();

  modalContent: string;
  settings: any;
  modalHeader: string;
  // modalContent: string = `Lorem ipsum dolor sit amet,

  constructor(private activeModal: NgbActiveModal,
    private service: JangadConsignmentReturnService,
    private ele: ElementRef) {

    this.ele.nativeElement.style.width = '900px';
    this.service.getAllIssueMastersByStatus().subscribe((data) => {
      data.forEach(res => {
        res.partyId = res.partyId.partyName;
        res.processTypeId = res.processTypeId.processName;
      });
      this.source.load(data);
    });
  }


  ngOnInit() {
    this.settings = this.prepareSetting();
  }

  prepareSetting() {
    return {
      actions: false,
      selectMode: 'single',
      pager: {
        display: true,
        perPage: 8
      },
      columns: {
        issueId: {
          title: 'Issue No.',
          type: 'text',
        },
        issueDate: {
          title: 'Issue Date',
          type: 'text',
        },
        partyId: {
          title: 'Party',
          // valuePrepareFunction: value => value.partyName,
        },
        processTypeId: {
          title: 'Process Name',
          // valuePrepareFunction: value => value.processName,
        },
        totalCarets: {
          title: 'Issued Carats',
        },
        isConsignment: {
          title: 'Consignment',
          valuePrepareFunction: value => {
            if(value) {
              return 'Yes';
            } else {
              return 'No';
            }
          },
        },
        status: {
          title: 'Status',
        }
      }
    };
  }
  source: LocalDataSource = new LocalDataSource();

  closeModal() {
    this.activeModal.close();
  }

  onUserRowSelect(event: any) {
   this.data = event.data;
    this.emitService.next(this.data);
   // window.alert("Your Choose: " +event.data.party.partyName);
    this.activeModal.close();
  }
 
}
