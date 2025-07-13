import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ParadaService } from 'src/app/services/paradas.service';

@Component({
  selector: 'app-busqueda-modal',
  templateUrl: './busqueda-modal.component.html',
  styleUrls: ['./busqueda-modal.component.scss']
})
export class BusquedaModalComponent {
  searchTerm = '';
  filteredList: any = [];
  isLoading: boolean = true


  constructor(
    private service: ParadaService,
    private modalCtrl: ModalController
  ) { }

  onSearchChange() {
    this.filteredList = [];
    this.isLoading = true
    const query = this.searchTerm.trim();
    if (query.length < 1) {
      this.filteredList = [];
      return;
    }

    this.service.searchStops(query)
      .subscribe({
        next: (data: any) => {
          this.filteredList = data?.data_send;
          this.isLoading = false
        },
        error: (err) => {
          this.isLoading = false
          this.filteredList = [];
        }
      });
  }

  close(selectedItem?: string) {
    this.modalCtrl.dismiss({
      destino: selectedItem
    });
  }


}
