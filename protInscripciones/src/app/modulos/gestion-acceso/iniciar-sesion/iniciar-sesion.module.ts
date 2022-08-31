import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IniciarSesionPageRoutingModule } from './iniciar-sesion-routing.module';

import { IniciarSesionPage } from './iniciar-sesion.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule, 
    ReactiveFormsModule,
    IonicModule,
    IniciarSesionPageRoutingModule
  ],
  declarations: [IniciarSesionPage]
})
export class IniciarSesionPageModule {}
