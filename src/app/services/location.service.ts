import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Geolocation } from '@capacitor/geolocation';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  constructor(private platform: Platform) {}

  async getCurrentLocation(): Promise<GeolocationPosition | null> {
    try {
      await this.platform.ready();

      if (this.platform.is('capacitor')) {
        // Geolocation.requestPermissions() es parte del propio plugin de Geolocation
        const perm = await Geolocation.requestPermissions();

        if (perm.location !== 'granted') {
          console.warn('Permiso de geolocalización denegado.');
          return null;
        }

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
}
