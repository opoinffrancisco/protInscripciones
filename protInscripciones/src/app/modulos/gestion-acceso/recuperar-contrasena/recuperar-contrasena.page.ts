import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuariosService } from './../../../controladores/servicios/usuarios/usuarios.service';
import { Usuario } from './../../../controladores/interfaces/usuario';

@Component({
  selector: 'app-recuperar-contrasena',
  templateUrl: './recuperar-contrasena.page.html',
  styleUrls: ['./recuperar-contrasena.page.scss'],
})
export class RecuperarContrasenaPage implements OnInit {

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
    });
  }

  ngOnInit() {
    //this.activatedRoute.snapshot.paramMap.get('id');
  }

  recuperarContrasena(){
    this.usuario = {
      email: this.form.value.email,
    };
    this.userS.recuperarContrasena(this.usuario)
    .then((response: any) => {
      // Handle success.
      console.log('Data: ', response);
      if (response.error==false) {

        console.log(response)

        //this.router.navigate(['/recepcion'], {queryParams: {sesionUsuario: this.sesionUsuario}})
        this.router.navigate(['/iniciar-sesion']);
      } else {
       
        
        
      }
    })
    .catch((error) => {
      // Handle error.
      console.log('An error occurred:', error);
    });
  }

}
