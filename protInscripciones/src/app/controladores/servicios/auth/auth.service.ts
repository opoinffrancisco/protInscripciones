import { Injectable } from '@angular/core';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private router: Router
  ) { }

  esAutenticado(){
    return (!localStorage.getItem("token"))? false : true;
  }

  getUsuario(){
    return localStorage.getItem("usuario");
  }

  getToken(){
    return localStorage.getItem("token");
  }  

  cerrarSesion(){
    localStorage.clear();
    this.router.navigate(['/iniciar-sesion'])
  }

}
