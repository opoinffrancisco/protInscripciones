import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecepcionPageRoutingModule } from './recepcion-routing.module';

import { RecepcionPage } from './recepcion.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecepcionPageRoutingModule
  ],
  declarations: [RecepcionPage]
})
export class RecepcionPageModule {}
