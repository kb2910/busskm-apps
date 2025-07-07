import { AfterViewInit, Component, OnInit } from '@angular/core';
import { LoadingController, ModalController, Platform } from '@ionic/angular';
import * as L from 'leaflet';
import { AuthService } from 'src/app/services/auth.service';
import { LocationService } from 'src/app/services/location.service';
import { environment } from 'src/environments/environment';
import { createCustomIcon, generarMarkersDesdeData } from 'src/utils/map.utils';
import { MarkerModalComponent } from '../marker-modal/marker-modal.component';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit{
  private map: any;
  posiction: any
  ubicacionTexto: string = 'Obteniendo ubicación...';
  userData: any;
  api:any;

  constructor(
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private platform: Platform,
    private auth: AuthService,
    private locationService: LocationService,
    private location: Location,
    private router: Router
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }
  

  async ngAfterViewInit(): Promise<void> {

    if (this.map) {
      this.map.remove(); // destruye la instancia anterior
    }

    this.userData = JSON.parse(localStorage.getItem("dataUsers") || '0');
    const loading = await this.loadingCtrl.create({
      message: 'Cargando mapa...',
      spinner: 'crescent',
      cssClass: 'custom-loading'
    });

    await loading.present();
    const position = await this.locationService.getCurrentLocation();
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




  private initMap(lat: number, lng: number): void {
    this.map = L.map('map', {
      center: [lat, lng],
      zoom: 13,
      zoomControl: false
    });
  
    L.control.zoom({
      position: 'bottomright'
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


    // MARKET DEL USUARIO PARA EL MAPA 
    let imagenYo: any = environment.API_URL+'/'+this.userData?.imagen;
    const myLocationIcon = L.divIcon({
      className: '',
      html: `
        <div style="
          width: 50px;
          height: 50px;
          border-radius: 50%;
          overflow: hidden;
          border: 2px solid #1e88e5;
          box-shadow: 0 0 6px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
         <img src="${imagenYo}"
               style="width: 100%; height: 100%; object-fit: cover;">
        </div>
      `,
      iconSize: [50, 50],
      iconAnchor: [25, 50],
      popupAnchor: [0, -50]
    });
    
    
  
    // Obtener marcadores y agregarlos
    const body = {
      lat: this.posiction.coords.latitude,
      lng: this.posiction.coords.longitude,
    };
  
    this.auth.userParadas(body).subscribe((data: any) => {
      const markersData = generarMarkersDesdeData(data?.data);
      markersData.forEach(data => {
        const icon = createCustomIcon(data.color || '#ec1581');
        const marker = L.marker([data.lat, data.lng], { icon }).addTo(this.map);
        marker.on('click', () => {
          this.openMarkerModal({ title: data.title, description: data.description, parada: data.parada });
        });
      });

      const myMarker = L.marker([this.posiction.coords.latitude,this.posiction.coords.longitude], { icon:myLocationIcon }).addTo(this.map);
      myMarker.bindPopup("📍 Estás aquí").openPopup();
    });
  
    // Mostrar nombre de ciudad
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

  
  async openMarkerModal(data: { title: string; description: string, parada: any }) {
    const modal = await this.modalCtrl.create({
      component: MarkerModalComponent,
      componentProps: data
    });
    await modal.present();
  }


  goBack() {
    this.location.back();
  }


  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove(); // Destruye la instancia del mapa
      this.map = null;
    }
  }
  
}
