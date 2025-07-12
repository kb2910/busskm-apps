import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { MenuController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  userData: any
  imagen: any

  constructor(private router: Router, private menuCtrl: MenuController, private navCtrl: NavController) { }


  ngOnInit() {
    this.userData = JSON.parse(localStorage.getItem("dataUsers") || '0');
    this.imagen = environment.API_URL + '/' + this.userData?.imagen;
  }



  async handleAction(action: string) {
    await this.menuCtrl.close(); // cierra el menú

    if (action === 'logout') {
      this.logout();
    } else {
      this.navCtrl.navigateRoot(action); // navega a la ruta
    }
  }


  logout() {
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(['/']);
  }
}
