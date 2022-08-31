import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-anuncios',
  templateUrl: './anuncios.page.html',
  styleUrls: ['./anuncios.page.scss'],
})
export class AnunciosPage implements OnInit {
  public anuncios: string;

  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    console.log("Observando anuncio:", JSON.parse(localStorage.getItem('anuncio')))
    this.anuncios = this.activatedRoute.snapshot.paramMap.get('id');
  }

}
