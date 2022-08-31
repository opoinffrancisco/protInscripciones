import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private toast: ToastController) { }
   
  /**
   * VERDE
   * @param mensaje 
   * @param titulo 
   */
  async mostrarExito(mensaje: string, titulo?: string){
    const toast = await this.toast.create({
      header: (titulo)? titulo: '¡ Muy bien !',
      message: mensaje,
      duration: 3000,
      position: 'top',

    });
    toast.present();
  }
   
  /**
   * ROJO
   * @param mensaje 
   * @param titulo 
   */  
  async mostrarError(mensaje: string, titulo?: string){
    const toast = await this.toast.create({
      header: (titulo)? titulo: '¡ Ha ocurrido un error !',
      message: mensaje,
      duration: 3000,
      position: 'top',

    });
    toast.present();
  }
   
  /**
   * AZUL
   * @param mensaje 
   * @param titulo 
   */  
  async mostrarInformacion(mensaje: string, titulo?: string){
    const toast = await this.toast.create({
      header: (titulo)? titulo: '¡ Atención !',
      message: mensaje,
      duration: 3000,
      position: 'top',

    });
    toast.present();
  }
   
  /**
   * AMARILLO
   * @param mensaje 
   * @param titulo 
   */
  async mostrarAdvertencia(mensaje: string, titulo?: string){
    const toast = await this.toast.create({
      header: (titulo)? titulo: '¡ Advertencia !',
      message: mensaje,
      duration: 3000,
      position: 'top',

    });
    toast.present();
  }

}
