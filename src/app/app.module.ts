import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthComponentComponent } from './auth-component/auth-component.component';
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './home/home.component';
import { MapComponent } from './components/map/map.component';
import { MarkerModalComponent } from './components/marker-modal/marker-modal.component';
import { BusquedaModalComponent } from './components/busqueda-modal/busqueda-modal.component';
import { RegisterModalComponent } from './registrer-modal/registrer-modal.component';
import { HttpStatusInterceptor } from './services/interceptor';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [AppComponent, AuthComponentComponent, HeaderComponent, HomeComponent, MapComponent, MarkerModalComponent, BusquedaModalComponent, RegisterModalComponent],
  imports: [BrowserAnimationsModule,
    ToastrModule.forRoot(), BrowserModule, IonicModule.forRoot(), AppRoutingModule, ReactiveFormsModule, HttpClientModule, FormsModule],
  providers: [CommonModule, { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    ToastrService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpStatusInterceptor,
      multi: true
    },
    { provide: LOCALE_ID, useValue: 'es' }
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
