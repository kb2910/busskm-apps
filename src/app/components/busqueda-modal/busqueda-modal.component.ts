import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-busqueda-modal',
  templateUrl: './busqueda-modal.component.html',
  styleUrls: ['./busqueda-modal.component.scss']
})
export class BusquedaModalComponent {
  @Input() data: string[] = [];
  searchTerm: string = '';

  constructor(private modalCtrl: ModalController) {}

  get filteredList() {
    return this.data.filter(item =>
      item.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  close(item?: string) {
    this.modalCtrl.dismiss(item);
  }
}
