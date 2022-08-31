import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegistrarPageRoutingModule } from './registrar-routing.module';

import { RegistrarPage } from './registrar.page';

import { AuthService } from './../../../controladores/servicios/auth/auth.service';
import { UsuariosService } from './../../../controladores/servicios/usuarios/usuarios.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RegistrarPageRoutingModule
  ],
  declarations: [RegistrarPage],
})
export class RegistrarPageModule {}
