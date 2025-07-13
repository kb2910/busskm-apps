import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ParadaService {
  private API_URL = environment.API_URL;
  token: any = localStorage.getItem('token');
  constructor(private http: HttpClient) {}


  searchStops(req:any) {
    return this.http.get(`${this.API_URL}/parada/show/${req}`,
      {
        headers: new HttpHeaders({
          "Access-Control-Allow-Origin": "*",
          "Authorization": "Bearer " + this.token

        })
      }
    );
  }


  getParadasByRoute(req:any) {
    return this.http.get(`${this.API_URL}/parada/ruta/show/${req}`,
      {
        headers: new HttpHeaders({
          "Access-Control-Allow-Origin": "*",
          "Authorization": "Bearer " + this.token

        })
      }
    );
  }


  getStopsById(req:any) {
    return this.http.get(`${this.API_URL}/parada/show/${req}`,
      {
        headers: new HttpHeaders({
          "Access-Control-Allow-Origin": "*",
          "Authorization": "Bearer " + this.token

        })
      }
    );
  }


}
