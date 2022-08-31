import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuariosService } from './../../../controladores/servicios/usuarios/usuarios.service';
import { Usuario } from './../../../controladores/interfaces/usuario';

@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.page.html',
  styleUrls: ['./registrar.page.scss'],
})
export class RegistrarPage implements OnInit {


  public usuario: Usuario;
  public form: FormGroup;

  constructor(
    private activatedRoute: ActivatedRoute,
    private userS: UsuariosService,
    private fb: FormBuilder
    ) {
    this.form = this.fb.group({
      username: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      contrasena: [null, Validators.required],
      contrasenaConfirmacion: [null, Validators.required]
    });

  }

  ngOnInit(): void {
    //  this.activatedRoute.snapshot.paramMap.get('id');
  }

  registrar(){
    this.usuario = {
      username: this.form.value.username,
      email: this.form.value.email,
      contrasena: this.form.value.contrasena,
    };
    this.userS.registrar(this.usuario)
    .then((response: any) => {
      // Handle success.
      console.log('Data: ', response);

    })
    .catch((error) => {
      // Handle error.
      console.log('An error occurred:', error);
    });
  }

}