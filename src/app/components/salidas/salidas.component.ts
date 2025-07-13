import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-salidas',
  templateUrl: './salidas.component.html',
  styleUrls: ['./salidas.component.scss']
})
export class SalidasComponent {
  @Input() salidas: any = [];

  constructor(private modalCtrl: ModalController) {}

  cerrar() {
    this.modalCtrl.dismiss();
  }



  calcularTiempoRestante(fecha: string, hora: string): string {
    try {
      const ahora = new Date();
      const [horaStr, meridiano] = hora.split(' ');
      let [horas, minutos] = horaStr.split(':').map(Number);
  
      // Convertir a 24h
      if (meridiano === 'PM' && horas < 12) horas += 12;
      if (meridiano === 'AM' && horas === 12) horas = 0;
  
      const [dia, mes, anio] = fecha.split('/').map(Number); // dd/mm/yyyy
      const salida = new Date(anio, mes - 1, dia, horas, minutos);
  
      const diffMs = salida.getTime() - ahora.getTime();
      const diffMin = Math.round(diffMs / 60000);
  
      if (diffMin < -1) return 'Ya salió';
      if (diffMin <= 1) return 'Sale ahora';
      return `En ${diffMin} min`;
    } catch (e) {
      return '';
    }
  }
  
}
