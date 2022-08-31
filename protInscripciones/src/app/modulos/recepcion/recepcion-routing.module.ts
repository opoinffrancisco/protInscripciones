import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecepcionPage } from './recepcion.page';

const routes: Routes = [
  {
    path: '',
    component: RecepcionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecepcionPageRoutingModule {}
