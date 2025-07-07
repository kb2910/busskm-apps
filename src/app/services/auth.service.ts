import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private API_URL = environment.API_URL;
  token: any = localStorage.getItem('token');
  constructor(private http: HttpClient) {}

  userLogin(req: any): Observable<any> {
    return this.http.post(`${this.API_URL}/auth/login`, req);
    
  }


  userParadas(req:any) {
    return this.http.post(`${this.API_URL}/operador/stopsByLocation/`, req,
      {
        headers: new HttpHeaders({
          "Access-Control-Allow-Origin": "*",
          "Authorization": "Bearer " + this.token

        })
      }
    );
  }

 

  userRegister(req: any): Observable<any> {
    return this.http.post(`${this.API_URL}/register`, req);
  }
}
