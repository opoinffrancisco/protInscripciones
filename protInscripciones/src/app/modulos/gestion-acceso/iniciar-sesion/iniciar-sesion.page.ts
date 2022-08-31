import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuariosService } from './../../../controladores/servicios/usuarios/usuarios.service';
import { Usuario } from './../../../controladores/interfaces/usuario';

@Component({
  selector: 'app-iniciar-sesion',
  templateUrl: './iniciar-sesion.page.html',
  styleUrls: ['./iniciar-sesion.page.scss'],
})
export class IniciarSesionPage implements OnInit {

  public usuario: Usuario;
  public form: FormGroup;
  
  public sesionUsuario: Usuario;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private userS: UsuariosService,
    private fb: FormBuilder
    ) {
    this.form = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      contrasena: [null, Validators.required],
    });

  }

  ngOnInit(): void {
    //  this.activatedRoute.snapshot.paramMap.get('id');
  }

  iniciarSesion(){
    this.usuario = {
      email: this.form.value.email,
      contrasena: this.form.value.contrasena,
    };
    this.userS.iniciarSesion(this.usuario)
    .then((response: any) => {
      // Handle success.
      console.log('Data: ', response);
      if (response.error==false) {

        localStorage.setItem("token", response.data.token)
        localStorage.setItem("usuario", JSON.stringify(response.data.usuario))
        this.sesionUsuario = response.data.usuario;

        //this.router.navigate(['/recepcion'], {queryParams: {sesionUsuario: this.sesionUsuario}})
        this.router.navigate(['/recepcion']);
      } else {
       
        

      }
    })
    .catch((error) => {
      // Handle error.
      console.log('An error occurred:', error);
    });
  }

}
