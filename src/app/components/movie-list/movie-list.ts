import { Component, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { CinemaService } from '../../services/cinema';
import { Movie } from '../../movie';

@Component({
  selector: 'app-movie-list',
  standalone: false,
  templateUrl: './movie-list.html',
  styleUrls: ['./movie-list.scss']
})
export class MovieListComponent {

  // Recibe el arreglo de películas
  @Input() movies: Movie[] = [];
  
  // Define si la tabla se comporta como el "catalogo" de clientes o la lista de "admin"
  @Input() mode: 'catalog' | 'admin' = 'catalog';

  // Outputs exclusivos para el panel de administración
  @Output() onEdit = new EventEmitter<Movie>();   // Envía la película completa elegida para editar
  @Output() onDelete = new EventEmitter<string>(); // Manda el ID de la película que se va a borrar

  // Contador para controlar cuántos días de alquiler selecciona el cliente por película
  rentalDaysMap: { [key: string]: number } = {};

  // Inyectamos el servicio central de datos y el detector de cambios manuales de Angular
  constructor(private cinemaService: CinemaService, private cdr: ChangeDetectorRef) {}


  // Mientras la pagina funciona ngOnChanges sirve para inicializar
  // el contador de días en 1 para cada película nueva que llegue.
  ngOnChanges() {
    this.movies.forEach(m => { 
      // Si la película tiene ID y no ha sido registrada en nuestro mapa de días, le ponemos 1 día inicial
      if (m.id && !this.rentalDaysMap[m.id]) {
        this.rentalDaysMap[m.id] = 1; 
      }
    });
    // Obligamos al HTML a redibujarse para asegurar rendimiento síncrono
    this.cdr.detectChanges();
  }

  // =====================================
  // --- LÓGICA EXCLUSIVA DEL CATÁLOGO ---
  // =====================================

  // Funcion que incrementa o decrementa los días con los botones +/- respetando los límites individuales
  changeDays(movie: Movie, amount: number) {
    const id = movie.id!;
    let currentDays = this.rentalDaysMap[id] || 1;
    let newDays = currentDays + amount;

    // Validaciones cruciales en caliente
    if (newDays < 1) newDays = 1; // No se puede alquilar por menos de un día
    if (newDays > movie.maxDays) newDays = movie.maxDays; // No puede superar el máximo permitido de la peli

    this.rentalDaysMap[id] = newDays;
    this.cdr.detectChanges(); // Refrescar la pantalla
  }

  //Funcion que comprueba el usuario escribe un número a mano dentro del input de días
  onDaysInputChange(event: any, movie: Movie) {
    const id = movie.id!;
    let value = parseInt(event.target.value, 10);

    // Si escribe letras, está vacío o es menor a 1, lo forzamos a valer 1
    if (isNaN(value) || value < 1) value = 1;
    // Si supera el máximo de la película, lo recortamos al límite superior
    if (value > movie.maxDays) value = movie.maxDays;

    event.target.value = value; // Corregimos visualmente el valor en el input del navegador
    this.rentalDaysMap[id] = value; // Guardamos el valor sanado en la memoria
    this.cdr.detectChanges();
  }


  // Funcion que envía la película elegida y los días calculados directos al Carrito a través del Servicio Central
  
  addToCart(movie: Movie) {
    const days = this.rentalDaysMap[movie.id!] || 1;
    this.cinemaService.addToCart(movie, days); // Ejecuta el BehaviorSubject interno
  }

  // ==========================================
  // --- LÓGICA EXCLUSIVA DEL ADMINISTRADOR ---
  // ==========================================

  //Funcion que dispara el evento de edición hacia arriba
  fireEdit(movie: Movie) {
    this.onEdit.emit(movie);
  }

  //Funcion que dispara el evento de eliminación enviando el ID de la película seleccionada
  fireDelete(id: string) {
    this.onDelete.emit(id);
  }
}