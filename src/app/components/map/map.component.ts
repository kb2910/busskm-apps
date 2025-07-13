import { Location } from '@angular/common';
import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, ModalController, Platform } from '@ionic/angular';
import * as L from 'leaflet';
import { AuthService } from 'src/app/services/auth.service';
import { LocationService } from 'src/app/services/location.service';
import { ParadaService } from 'src/app/services/paradas.service';
import { environment } from 'src/environments/environment';
import { createCustomIcon, generarMarkersDesdeData, generarMarkersDesdeDataByRoute, getParadaMasCercanaConDistanciaYTiempo } from 'src/utils/map.utils';
import { MarkerModalComponent } from '../marker-modal/marker-modal.component';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit, OnInit, OnDestroy {
  private map: any;
  posiction: any
  ubicacionTexto: string = 'Obteniendo ubicación...';
  userData: any;
  api: any;
  mapInitialized = false;
  @Input() showBackButton: boolean = true;
  idRuta: any = 0
  paradaSelect: any = 0
  nearestInfo: any = 0
  listsServices: any = 0
  busMarkers: L.Marker[] = [];


  constructor(
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private platform: Platform,
    private auth: AuthService,
    private parada: ParadaService,
    private locationService: LocationService,
    private location: Location,
    private router: Router,
    private routr: ActivatedRoute,
    private socketService: SocketService
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }


  ngOnInit() {
    this.routr.paramMap.subscribe(params => {
      const id = params.get('idRuta');
      // Si NO hay idRuta o es '0', no lo usamos
      if (!id || id === '0') {
        this.idRuta = 0;
      } else {
        this.idRuta = id;
      }
    });


    if (this.idRuta != 0) {
      this.paradaSelect = JSON.parse(localStorage.getItem("destino") || '0');
    }
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove(); // Destruye instancia
      this.map = null;
    }

    // Limpieza segura del contenedor
    const existingMap = L.DomUtil.get('map');
    if (existingMap != null) {
      (existingMap as any)._leaflet_id = null;
    }

    this.userData = JSON.parse(localStorage.getItem("dataUsers") || '0');
    this.socketService.off('locationUpdated');
    this.socketService.disconnect();

  }



  async ngAfterViewInit(): Promise<void> {
    // ⚠️ Prevención adicional
    const existingMap = L.DomUtil.get('map');
    if (existingMap && (existingMap as any)._leaflet_id != null) {
      (existingMap as any)._leaflet_id = null;
    }

    if (this.mapInitialized) return;
    this.mapInitialized = true;


    if (this.map) {
      this.map.remove();
      this.map = null;
    }

    this.userData = JSON.parse(localStorage.getItem("dataUsers") || '0');

    const loading = await this.loadingCtrl.create({
      message: 'Cargando mapa...',
      spinner: 'crescent',
      cssClass: 'custom-loading'
    });

    await loading.present();

    const position = await this.locationService.getCurrentLocation();
    this.posiction = position;

    if (position) {
      this.initMap(position.coords.latitude, position.coords.longitude);
      // ⚠️ Esperar un poco para que Ionic haya terminado de animar/transicionar
      setTimeout(() => {
        this.map.invalidateSize(); // Forzar redibujado
        loading.dismiss();
      }, 300); // 
    } else {
      loading.dismiss();
      alert('No se pudo obtener la ubicación actual.');
    }

    this.socketService.connect();
    this.socketService.on('connect', () => {
      this.socketService.emit('unirseAruta', {
        action: 'cliente',
        rutaid: this.idRuta
      });
    });

    this.socketService.on('locationUpdated', (data: any) => {
      // Actualiza buses activos localmente
      const serviciosActives: any = []
      serviciosActives.push(data)
      const actualizados = serviciosActives.map((s: any) => {
        if (s._id === data.servicioid) {
          return { ...s, lat: data.latitud, lng: data.longitud };
        }
        return s;
      });


      this.listsServices = actualizados;
      this.renderBusesMarkers()
    });


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
    let imagenYo: any = environment.API_URL + '/' + this.userData?.imagen;
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


    if (this.idRuta == 0) {

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

        const myMarker = L.marker([this.posiction.coords.latitude, this.posiction.coords.longitude], { icon: myLocationIcon }).addTo(this.map);
        myMarker.bindPopup("📍 Estás aquí").openPopup();
      });

    } else {
      this.parada.getParadasByRoute(this.idRuta).subscribe((data: any) => {
        let markersData = generarMarkersDesdeDataByRoute(data?.data_send?.paradas);

        if (this.paradaSelect != 0) {
          let x: any = []
          for (const data of markersData) {
            if (
              data.parada?._id === this.paradaSelect._id
            ) {
              break;
            } else {
              x.push(data)
            }
          }
          markersData = x

          const resultado = getParadaMasCercanaConDistanciaYTiempo(markersData, this.posiction.coords.latitude, this.posiction.coords.longitude);
          console.log(resultado)
          if (resultado) {
            this.nearestInfo = resultado
          }

        }


        let latlngs: L.LatLngExpression[] = [];

        markersData.forEach(data => {
          const icon = createCustomIcon(data.color || '#ec1581');
          const marker = L.marker([data.lat, data.lng], { icon }).addTo(this.map);

          latlngs.push([data.lat, data.lng]);

          marker.on('click', () => {
            this.openMarkerModal({ title: data.title, description: data.description, parada: data.parada });
          });
        });


        // Dibujar línea entre paradas
        if (latlngs.length > 1) {
          const polyline = L.polyline(latlngs, {
            color: '#000000',
            weight: 8,
            opacity: 0.7
          }).addTo(this.map);

          this.map.fitBounds(polyline.getBounds());
        }

        // Marker del usuario
        const myMarker = L.marker(
          [this.posiction.coords.latitude, this.posiction.coords.longitude],
          { icon: myLocationIcon }
        ).addTo(this.map);

        myMarker.bindPopup("📍 Estás aquí").openPopup();
      });

    }
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
      componentProps: data,
      breakpoints: [0, 0.5, 1],
      initialBreakpoint: 0.5
    });
    await modal.present();
  }


  goBack() {
    this.location.back();
    localStorage.removeItem('destino')
  }




  renderBusesMarkers() {
    // Elimina los marcadores anteriores
    this.busMarkers.forEach(marker => this.map.removeLayer(marker));
    this.busMarkers = [];

    if (!this.listsServices || !Array.isArray(this.listsServices)) return;

    this.listsServices.forEach((bus: any) => {
      let busImage: any = "/assets/icon/buss4.svg";
      const icon = L.divIcon({
        className: '',
        html: `
          <div style="
          width: 30px;
          height: 30px;
          overflow: hidden;
          box-shadow: 0 0 6px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          ">
            <img src="${busImage}"
               style="width: 100%; height: 100%; object-fit: cover;">
          </div>
        `
      });

      const marker = L.marker([bus.latitud, bus.longitud], { icon }).addTo(this.map);
      marker.bindPopup(`Unidad:201`);

      this.busMarkers.push(marker);
    });
  }





}
