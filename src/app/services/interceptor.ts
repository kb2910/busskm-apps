import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Injectable()
export class HttpStatusInterceptor implements HttpInterceptor {

  constructor(private toastr: ToastrService,
    private _router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Puedes agregar headers o modificar la solicitud aquí si es necesario
    const modifiedReq = req.clone({
      headers: req.headers.set('Access-Control-Allow-Origin', '*')
    });

    return next.handle(modifiedReq).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          // Aquí puedes capturar el estatus cuando la respuesta es exitosa

        }
        return event;
      }),
      catchError((error: HttpErrorResponse) => {
        // Validar error por falta de conexión a Internet
        if (error.status === 0) {
          this.toastr.error('No hay conexión a Internet');
        }
        // Validar error 500
        else if (error.status === 500) {
          this.toastr.error('Contacta a nuestro equipo de soporte.', 'Algo salió mal');
        }

        // Aquí capturas cualquier error en la solicitud
        if (error.error.num_status == 401) {
          localStorage.clear();
          sessionStorage.clear();
          localStorage.setItem("language", 'es');
          this.toastr.error(error.error.msg_status);
          this._router.navigate(['/']).then(() => {
            window.location.reload();
          });

        }
        // Aquí capturas cualquier error en la solicitud
        if (error.error.num_status == 409) {
          this.toastr.error(error.error.msg_status);
        }
        return throwError(error);
      })
    );
  }
}
