import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './controladores/guards/auth/auth.guard';
import { NoAuthGuard } from './controladores/guards/no-auth/no-auth.guard';

const routes: Routes = [
  {
    path: '', 
    redirectTo: 'iniciar-sesion',
    pathMatch: 'full'
  },
  {
    path: 'iniciar-sesion',
    loadChildren: () => import('./modulos/gestion-acceso/iniciar-sesion/iniciar-sesion.module').then( m => m.IniciarSesionPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'crear-cuenta',
    loadChildren: () => import('./modulos/gestion-acceso/registrar/registrar.module').then( m => m.RegistrarPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'recuperar-contrasena',
    loadChildren: () => import('./modulos/gestion-acceso/recuperar-contrasena/recuperar-contrasena.module').then( m => m.RecuperarContrasenaPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'recepcion',
    loadChildren: () => import('./modulos/recepcion/recepcion.module').then( m => m.RecepcionPageModule),
    canActivate: [NoAuthGuard],
  },
  {
    path: 'anuncios/:id',
    loadChildren: () => import('./modulos/anuncios/anuncios.module').then( m => m.AnunciosPageModule),
    canActivate: [NoAuthGuard],
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
