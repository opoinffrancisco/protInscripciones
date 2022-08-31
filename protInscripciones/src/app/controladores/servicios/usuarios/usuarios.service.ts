import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Axios, AxiosError, AxiosResponse  } from 'axios';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HTTP, HTTPResponse } from '@awesome-cordova-plugins/http/ngx';
import { environment } from '../../../../environments/environment';
import { Usuario } from '../../interfaces/usuario';




@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  httpHeader = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  /*
  {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",        
        //Authorization: `Bearer ${token}`,
      },
    }
  */  

  constructor(
    //private axios: Axios,
    //private http: HTTP,
    private httpC: HttpClient
  ){ }  

  registrar(datos: Usuario): Promise<HTTPResponse>{
    const promise = new Promise<HTTPResponse>((resolve, reject) => {

      const URL = environment.url + 'usuarios/registrar';
      this.httpC
        .post<HTTPResponse>(URL, datos, this.httpHeader)
        .toPromise()
        .then((res: HTTPResponse) => {

          resolve(res);
        },
          err => {
            reject(err);
          }
        );
    });

    return promise;
  }

  iniciarSesion(datos: Usuario): Promise<HTTPResponse>{
    const promise = new Promise<HTTPResponse>((resolve, reject) => {

      const URL = environment.url + 'usuarios/iniciar-sesion';
      this.httpC
        .post<HTTPResponse>(URL, datos, this.httpHeader)
        .toPromise()
        .then((res: HTTPResponse) => {

          resolve(res);
        },
          err => {
            reject(err);
          }
        );
    });

    return promise;
  }
 
  recuperarContrasena(datos: Usuario): Promise<HTTPResponse>{
    const promise = new Promise<HTTPResponse>((resolve, reject) => {

      const URL = environment.url + 'usuarios/recuperar-contrasena';
      this.httpC
        .post<HTTPResponse>(URL, datos, this.httpHeader)
        .toPromise()
        .then((res: HTTPResponse) => {

          resolve(res);
        },
          err => {
            reject(err);
          }
        );
    });

    return promise;
  }


}
