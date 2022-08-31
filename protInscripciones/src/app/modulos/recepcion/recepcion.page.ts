import { Component, ViewChild, OnInit } from '@angular/core';
import { IonInfiniteScroll } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Anuncios } from './../../controladores/interfaces/anuncios';

interface InfiniteScrollCustomEvent extends CustomEvent {
  target: HTMLIonInfiniteScrollElement;
}

@Component({
  selector: 'app-recepcion',
  templateUrl: './recepcion.page.html',
  styleUrls: ['./recepcion.page.scss'],
})
export class RecepcionPage implements OnInit {
  

  httpHeader = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  
  public data: any[] = [];
  private pagina          : number  = 1;
  private por_pagina      : number  = 3;
  private siguiente_pagina: number  = 1;
  private total_paginas   : number  = 0;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {
    
   }

  ngOnInit() {
    this.loadData();
    //this.recepcion = this.activatedRoute.snapshot.paramMap.get('id');
    
  }

  loadData(event:InfiniteScrollCustomEvent = null) {
    
    this.http
    .post<{ data: any[] }>(environment.url + `anuncios`,{
      pagina: this.siguiente_pagina,
      por_pagina: this.por_pagina
    },
    this.httpHeader)
    .subscribe((resp: { error: boolean, data: any, total_paginas?: number }) => {

      this.pagina           = resp.data.pagina // actual
      this.siguiente_pagina = resp.data.siguiente_pagina
      this.por_pagina       = resp.data.por_pagina
      this.total_paginas    = resp.total_paginas

      if (this.pagina === resp.total_paginas) {
        if (event) event.target.disabled = true;
      }

      this.data = this.data.concat(resp.data.data);
      if (event) event.target.complete();
      
    });
  }

  verAnuncio(_anuncio: Anuncios){
    localStorage.setItem('anuncio', JSON.stringify(_anuncio))
    this.router.navigate(['/anuncios/'+_anuncio.id])
  }

}
