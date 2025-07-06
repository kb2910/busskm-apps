import * as L from 'leaflet';
import { LoadingController, ModalController, Platform } from '@ionic/angular';
import { MarkerModalComponent } from '../marker-modal/marker-modal.component';
import { AfterViewInit, Component } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit {
  private map: any;
  posiction: any
  ubicacionTexto: string = 'Obteniendo ubicación...';

  constructor(
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private platform: Platform,
    private auth: AuthService,
  ) { }

  async ngAfterViewInit(): Promise<void> {
    const loading = await this.loadingCtrl.create({
      message: 'Cargando mapa...',
      spinner: 'crescent',
      cssClass: 'custom-loading'
    });

    await loading.present();

    const position = await this.getCurrentLocation();
    console.log(position)
    this.posiction = position

    if (position) {
      this.initMap(position.coords.latitude, position.coords.longitude);
      setTimeout(() => {
        this.map.invalidateSize();
        loading.dismiss();
      }, 400);
    } else {
      loading.dismiss();
      alert('No se pudo obtener la ubicación actual.');
    }
  }

  async getCurrentLocation(): Promise<GeolocationPosition | null> {
    try {
      if (this.platform.is('capacitor')) {
        const coords = await Geolocation.getCurrentPosition();
        return coords;
      } else {
        return await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 5000
          });
        });
      }
    } catch (error) {
      console.error('Error al obtener ubicación:', error);
      return null;
    }
  }



  private initMap(lat: number, lng: number): void {
    this.map = L.map('map', {
      center: [lat, lng],
      zoom: 13,
      zoomControl: false  // Desactivar control por defecto
    });

    L.control.zoom({
      position: 'bottomright' // 'topleft', 'topright', 'bottomleft', 'bottomright'
    }).addTo(this.map);


    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    const icon = L.divIcon({
      className: '',
      html: `
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 370 370" style="color: #ec1581;">
          <g>
            <path fill="currentColor" d="M185,320V160c-22.091,0-40-17.91-40-40c0-22.092,17.909-40,40-40V0
              C118.727,0,65,53.727,65,120c0,53.037,38.748,110.371,72.208,150C162.629,300.107,185,320,185,320z"/>
            <path fill="currentColor" d="M225,120c0,22.09-17.909,40-40,40v160c0,0,22.371-19.893,47.792-50
              C266.252,230.371,305,173.037,305,120C305,53.727,251.273,0,185,0v80C207.091,80,225,97.908,225,120z"/>
            <circle fill="#ffffff" cx="185" cy="120" r="40"/>
          </g>
        </svg>
      `
    });


    let markersData: any = [
      {
        lat: lat + 0.003,
        lng: lng + 0.003,
        title: 'Ubicación 1',
        description: 'Este es el primer marcador'
      },
      {
        lat: lat + 0.005,
        lng: lng - 0.002,
        title: 'Ubicación 2',
        description: 'Este es el segundo marcador'
      }
    ];
    const body = {
      lat: this.posiction.coords.latitude,
      lng: this.posiction.coords.longitude,
    }
    this.auth.userParadas(body).subscribe((data: any) => {

      console.log(data)
      markersData = [
        {
          lat: lat + 0.003,
          lng: lng + 0.003,
          title: 'Ubicación 1',
          description: 'Este es el primer marcador'
        },
        {
          lat: lat + 0.005,
          lng: lng - 0.002,
          title: 'Ubicación 2',
          description: 'Este es el segundo marcador'
        }
      ];

    });

    markersData.forEach(data => {
      const marker = L.marker([data.lat, data.lng], { icon }).addTo(this.map);
      marker.on('click', () => {
        this.openMarkerModal({ title: data.title, description: data.description });
      });
    });

    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
      .then(res => res.json())
      .then(data => {
        const ciudad = data.address?.city || data.address?.town || data.address?.village || 'Ubicación desconocida';
        const pais = data.address?.country || '';
        this.ubicacionTexto = `${ciudad}, ${pais}`;
      })
      .catch(err => {
        this.ubicacionTexto = 'Ubicación desconocida';
      });

  }

  async openMarkerModal(data: { title: string; description: string }) {
    const modal = await this.modalCtrl.create({
      component: MarkerModalComponent,
      componentProps: data
    });
    await modal.present();
  }


}
