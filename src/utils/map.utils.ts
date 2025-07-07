  
  import * as L from 'leaflet';

  /**
   * Convierte una lista de rutas con paradas en un arreglo de marcadores para el mapa.
   * @param data Arreglo de rutas con paradas.
   * @returns Arreglo de marcadores con lat, lng, título y descripción.
   */
  export function generarMarkersDesdeData(data: any[]) {
    const markersData: any = [];
  
    data.forEach((ruta : any) => {
      ruta.paradas.forEach((parada : any) => {
        const lat = parseFloat(parada.latitud);
        const lng = parseFloat(parada.longitud);
        if (!isNaN(lat) && !isNaN(lng)) {
          markersData.push({
            lat,
            lng,
            title: parada.nombre.trim(),
            description: `Ruta: ${ruta.ruta.nombre}`,
            color: ruta.ruta.color,
            parada: parada
          });
        }
      });
    });
  
    return markersData;
  }
  



  export function createCustomIcon(color: string) {
    return L?.divIcon({
      className: '',
      html: `
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 370 370" style="color: ${color};">
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
  }
  