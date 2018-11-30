
import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { OpeningStockEntryService } from 'app/pages/stockManagement/components/openingStockEntry';

@Component({
  selector: 'add-service-modal',
  styleUrls: [('./default-modal.component.scss')],
  templateUrl: './default-modal.component.html'
})

export class DefaultModal implements OnInit {

  modalHeader: string;

  showHide: boolean;

  modalContent: string; //= 'After process, you wouldn\'t be able to add more carats in this category.';


  constructor(private activeModal: NgbActiveModal, private service: OpeningStockEntryService) {
    debugger
    this.showHide = this.service.toggle;
   
   
  }

  ngOnInit() {
   
  }

  cancelModal() {
    this.activeModal.close('N');
  }

  okModal() {
    this.activeModal.close('Y');
  }
}
