import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';
import { HttpClientModule } from '@angular/common/http';
import { Axios } from 'axios';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';


import { AuthService } from './controladores/servicios/auth/auth.service';
import { UsuariosService } from './controladores/servicios/usuarios/usuarios.service';

@NgModule({
  declarations: [AppComponent],
  imports: [
    HttpClientModule,
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    //HTTP,
    //Axios
  ],
  providers: [
    
    { 
      provide: [RouteReuseStrategy],
    
      useClass: IonicRouteStrategy 
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
