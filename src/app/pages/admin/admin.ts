import { Component, OnInit, ChangeDetectorRef, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CinemaService } from '../../services/cinema';
import { Movie } from '../../movie';

@Component({
  selector: 'app-admin',
  standalone: false,
  templateUrl: './admin.html',
  styleUrls: ['./admin.scss']
})
export class AdminComponent implements OnInit {
  // Listado de las películas descargado de MockAPI que lo usan los componentes 
  movies: Movie[] = [];
  
  // Booleando para encender el mensaje verde flotante de éxito en pantalla
  successMessage = false;
  
  // Contenedor temporal de la película elegida para editar y enviarlo al componente del formulario
  peliculaSeleccionada: Movie | null = null; 

  // Inyectamos el servicio, el detector de cambios y el detector de plataforma
  constructor(
    private cinemaService: CinemaService,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object // Token de Angular para saber dónde se ejecuta el código
  ) {}

  // Mientras la pagina funciona ngOnInit sirve se pueda refrescar la pagina
  // y no de errores de carga ya que sucedia al darle al F5 que no cargara la lista
  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadMovies();
    }
  }

  // Funcion que descarga la lista de películas de MockAPI
  loadMovies() {
    this.cinemaService.getMovies().subscribe(data => {
      this.movies = data; // Guardamos el arreglo recibido en la variable local
      this.cdr.detectChanges(); // Forzamos el redibujado instantáneo de la pantalla
    });
  }

  // Funcion que toma una pelicula y se la pasa al formulario
  seleccionarPelicula(movie: Movie) {
    this.peliculaSeleccionada = movie; // Al poblarse, el formulario cambia automáticamente a modo "Editar"
  }

  // Funcion que limpia el formulario devolviendo null
  cancelarEdicion() {
    this.peliculaSeleccionada = null; // El formulario regresa automáticamente a modo "Añadir Nueva"
  }

  // Funcion que guarda una pelicula o actualiza una pelicula segun el formulario que se haya usado
  guardarPelicula(movieData: Movie) {
    if (this.peliculaSeleccionada) {
      // Camino de que se actualiza una pelicula
      this.cinemaService.updateMovie(this.peliculaSeleccionada.id!, movieData).subscribe(() => {
        this.showSuccess();         // Enciende el aviso verde de éxito
        this.cancelarEdicion();     // Cierra el modo edición y limpia el estado
        this.loadMovies();          // Recarga la lista de la derecha con los datos frescos de MockAPI
      });
    } else {
      // Si no el camino de crear una pelicua
      this.cinemaService.createMovie(movieData).subscribe(() => {
        this.showSuccess();        // Enciende el aviso verde de éxito
        this.loadMovies();          // Recarga la lista para que aparezca la nueva película al final
      });
    }
  }

  // Funcion que sirve para eliminar una pelicual
  borrarPelicula(id: string) {
    // Cuadro de confirmación nativo del navegador por seguridad
    if (confirm('¿Estás seguro de que deseas eliminar esta película permanentemente?')) {
      // Elimino la pelicula 
      this.cinemaService.deleteMovie(id).subscribe(() => {
      // Se recarga la lista 
        this.loadMovies();
        // Comprobamos si la pelicula que estamos editando es la misma que acabamos de borrar...
        if (this.peliculaSeleccionada && this.peliculaSeleccionada.id === id) {
            this.cancelarEdicion(); // ... si lo es limpiamos el formulario y lo volvemos a "Modo Creación"
        }
      });
    }
  }

  // Funcion que sirve como un temporizador para apagar el mensaje de exito
  // para que no se quede indefinidamente en la pagina y la ensucie
  showSuccess() {
    this.successMessage = true; // Enciende el mensaje en el HTML
    setTimeout(() => { 
      this.successMessage = false; // Lo apaga automáticamente a los 3 segundos
      this.cdr.detectChanges();    // Le avisa a Angular del cambio en diferido
    }, 3000);
    this.cdr.detectChanges();
  }
}