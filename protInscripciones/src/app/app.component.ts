import { Component } from '@angular/core';
import { AuthService } from './controladores/servicios/auth/auth.service';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, ActivatedRoute} from '@angular/router';
import { MenuController } from '@ionic/angular';
import { Usuario } from './controladores/interfaces/usuario';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  
  
  public appPages = [
    { title: 'Recepcion', url: '/recepcion', icon: 'home' }
  ];
  
  routerOutletComponent: any;
  routerOutletComponentClass: string;
  
  public sesionUsuario: Usuario;
  
  constructor(
    public auth: AuthService, 
    private router: Router,
    private menu: MenuController
  ) {
    this.sesionUsuario = JSON.parse(localStorage.getItem("usuario"));


  }
  
  /*
  HTML:(activate)="onActivate($event)"
  FUNCION
  onActivate(event: any): void {

    this.routerOutletComponent = event;
    this.routerOutletComponentClass = event.constructor.name;
    console.log("Activated: ", this.routerOutletComponentClass);
    console.log("data: ", this.routerOutletComponent)

  }*/
  onDesactivate(event: any): void {

    this.routerOutletComponent = event;
    this.routerOutletComponentClass = event.constructor.name;
    console.log("deactivate: ", this.routerOutletComponentClass);
    console.log("data: ", this.routerOutletComponent)

    switch (this.routerOutletComponentClass) {
      case 'IniciarSesionPage':
        this.sesionUsuario = this.routerOutletComponent.sesionUsuario;  
      break;
    
      default:
      break;
    }

  }

  cerrarSesion(){
    this.menu.close('end');
    this.auth.cerrarSesion();
  }

}
