import { Component, OnInit } from '@angular/core';
import { BusquedaModalComponent } from '../components/busqueda-modal/busqueda-modal.component';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  transporteSeleccionado: string = '';
  destino: string = '';
  segmentValue: string = 'buss';



  constructor(private modalCtrl: ModalController) { }

  ngOnInit() { }


  siguiente() {
    console.log('Transporte:', this.transporteSeleccionado);
    console.log('Destino:', this.destino);
  }

  async openSearchModal() {
    const modal = await this.modalCtrl.create({
      component: BusquedaModalComponent,
      componentProps: {
        data: [
          'Amsterdam', 'Buenos Aires', 'Cairo', 'Geneva', 'Hong Kong',
          'Istanbul', 'London', 'Madrid', 'New York', 'Panama City'
        ]
      }
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data) {
      console.log('Destino seleccionado:', data);
    }

  }
}
