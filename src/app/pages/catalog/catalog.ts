import { Component, OnInit, ChangeDetectorRef, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common'; // Detector para evitar errores de renderizado en el servidor
import { CinemaService } from '../../services/cinema';
import { Movie } from '../../movie';

@Component({
  selector: 'app-catalog',
  standalone: false,
  templateUrl: './catalog.html',
  styleUrls: ['./catalog.scss']
})
export class Catalog implements OnInit {
  // Arreglo central que almacenará las películas para pasárselas a los componentes
  movies: Movie[] = [];

  constructor(
    private cinemaService: CinemaService, 
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object // Token de Angular para saber dónde se ejecuta el código
  ) {}

  // Mientras la pagina funciona ngOnInit sirve se pueda refrescar la pagina
  // y no de errores de carga ya que sucedia al darle al F5 que no cargara la lista
  // y de paso almacena las peliculas que vienen de MockAPI
  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.cinemaService.getMovies().subscribe(data => {
        this.movies = data; // Almacena las películas descargadas
        this.cdr.detectChanges(); // Fuerza el redibujado para que el átomo muestre las tarjetas
      });
    }
  }
}