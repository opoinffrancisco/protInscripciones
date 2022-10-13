import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { ProductosComponent } from './productos/productos.component';

const routes:Routes=[
  {path:'dashboard', component:PagesComponent,
  children:[
    {path:'', component:DashboardComponent}, 
    {path:'usuarios', component:UsuariosComponent},
    {path:'productos', component:ProductosComponent}
  ]
}
]


@NgModule({
 
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports:[RouterModule]
})
export class PagesRoutingModule { }
