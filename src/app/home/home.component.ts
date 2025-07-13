import { Component, OnInit } from '@angular/core';
import { BusquedaModalComponent } from '../components/busqueda-modal/busqueda-modal.component';
import { ModalController } from '@ionic/angular';
import { DetailStartToToursComponent } from '../components/detail-start-to-tours/detail-start-to-tours.component';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { SalidasComponent } from '../components/salidas/salidas.component';

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
  destinoSeleccionado: any = []



  constructor(private modalCtrl: ModalController, private router: Router,
    private navCtrl: NavController) { }

  ngOnInit() {
    this.userData = JSON.parse(localStorage.getItem("dataUsers") || '0');
  }


 
  async openSearchModal() {
    const modal = await this.modalCtrl.create({
      component: BusquedaModalComponent,
      
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data?.destino) {
      console.log('Destino seleccionado:', data.destino);
      this.destinoSeleccionado = data.destino;
      const rutaId = this.destinoSeleccionado?.rutaid?._id;
      localStorage.setItem('destino', JSON.stringify(this.destinoSeleccionado))
      if (rutaId) {
        this.navCtrl.navigateForward(['/map', rutaId]).then(() => {
          window.location.reload(); 
        });
      } else {
        console.warn('rutaid._id no definido');
      }
      
    }

  }

 

  irAOtraPantalla() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.navCtrl.navigateForward(['/map/consultRoute']).then(() => {
        window.location.reload(); 
      });
    });
  }



  async getSalidas() {
    const salidas = [
      {
        chofer: 'Luis Beltrán',
        unidad: 'BUS-21',
        hora: '10:30 AM',
        fecha: '13/07/2025',
        foto: 'assets/choferes/luis.jpg'
      },
      {
        chofer: 'Pedro Acosta',
        unidad: 'BUS-12',
        hora: '11:15 AM',
        fecha: '13/07/2025',
        foto: 'assets/choferes/pedro.jpg'
      },
      {
        chofer: 'María Lugo',
        unidad: 'TAXI-9',
        hora: '12:00 PM',
        fecha: '13/07/2025',
        foto: 'assets/choferes/maria.jpg'
      }
    ];
    
  
    const modal = await this.modalCtrl.create({
      component: SalidasComponent,
      componentProps: {
        salidas
      }
    });
  
    await modal.present();
  }
  
}
