import { Component, Injectable, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { OpeningStockEntryService } from '.././openingStockEntry.service';
import { LocalDataSource } from 'ng2-smart-table';
@Component({
  selector: 'add-service-modal',
  styleUrls: [('./default-modal.component.scss')],
  templateUrl: './default-modal.component.html'
})

@Injectable()
export class DefaultModalOpen implements OnInit {

  modalHeader: string;
  modalContent: string; //= 'After process, you wouldn\'t be able to add more carats in this category.';
  //settings: any;
  source: LocalDataSource = new LocalDataSource();

  constructor(private activeModal: NgbActiveModal,
    private service: OpeningStockEntryService) {
  }

  ngOnInit() {}

  cancelModal() {
    this.activeModal.close();
  }

  okModal() {
    this.service.processOpenStockEntries().subscribe((list) => {
      // this.source.load(list);
      this.activeModal.close('Y');
    });
   // window.location.reload();
   }
}
