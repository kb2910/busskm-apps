import { Component, OnInit } from '@angular/core';
import { BusquedaModalComponent } from '../components/busqueda-modal/busqueda-modal.component';
import { ModalController } from '@ionic/angular';
import { DetailStartToToursComponent } from '../components/detail-start-to-tours/detail-start-to-tours.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  transporteSeleccionado: string = '';
  destino: string = '';
  segmentValue: string = 'buss';
  userData: any



  constructor(private modalCtrl: ModalController,private router: Router) { }

  ngOnInit() {
    this.userData = JSON.parse(localStorage.getItem("dataUsers") || '0');
   }


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

  async abrirModal() {
    const modal = await this.modalCtrl.create({
      component: DetailStartToToursComponent,
    });
    return await modal.present();
  }

  irAOtraPantalla() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/map']);
    });
  }

}
