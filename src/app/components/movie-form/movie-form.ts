import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Movie } from '../../movie';

@Component({
  selector: 'app-movie-form',
  standalone: false,
  templateUrl: './movie-form.html',
  styleUrls: ['./movie-form.scss']
})
export class MovieFormComponent implements OnChanges {

  //Input por si viene una película, el formulario entra en "Modo Edición". Si es null, está en "Modo Creación".
  @Input() movieToEdit: Movie | null = null;
  
  @Output() onSave = new EventEmitter<Movie>(); // Avisa que el usuario guardó y manda los datos validados
  @Output() onCancel = new EventEmitter<void>(); // Avisa que el usuario canceló la edición actual

  // Instancia que controla el estado, valores y errores de los inputs de la pantalla
  movieForm: FormGroup;

  // El FormBuilder se usa para construir de forma limpia la estructura del formulario
  constructor(private fb: FormBuilder) {
    // Definición del formulario
    this.movieForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]], // Título obligatorio, mínimo 3 letras
      desc: [''],                                                 // Sinopsis opcional (Le quitamos la restricción)
      img: ['', [Validators.required]],                           // URL de portada obligatoria
      price: [1000, [Validators.required, Validators.min(1)]],    // Precio obligatorio, mínimo $1
      maxDays: [1, [Validators.required, Validators.min(1)]],     // Máximo de días obligatorio, mínimo 1
      stock: [1, [Validators.required, Validators.min(0)]]        // Inventario obligatorio, no puede ser negativo
    });
  }

  // Mientras la pagina funciona ngOnChanges sirve para comprobar si
  // algun input requere que actuialice el formulario de edicional
  ngOnChanges(changes: SimpleChanges) {
    // Verificamos si el cambio específico ocurrió en la variable 'movieToEdit'
    if (changes['movieToEdit']) {
      if (this.movieToEdit) {
        // Modo Edición: Rellenamos automáticamente los inputs del HTML con los datos de la película
        this.movieForm.patchValue(this.movieToEdit);
      } else {
        // Modo Creación: Si vuelve a ser null, reseteamos el formulario a los valores iniciales por defecto
        this.movieForm.reset({ price: 1000, maxDays: 1, stock: 1 });
      }
    }
  }

  // Funcion para enviar el formulario para crear o actualizar una pelicula
  submitForm() {
    // Protección: Si el formulario tiene errores visuales, no hace nada
    if (this.movieForm.invalid) return;

    // Emitimos los datos recolectados hacia el componente Administrador padre
    this.onSave.emit(this.movieForm.value);
    
    // Si estábamos creando una película nueva (no editando), limpiamos los inputs para una nueva carga
    if (!this.movieToEdit) {
      this.movieForm.reset({ price: 1000, maxDays: 1, stock: 1 });
    }
  }

  // Funcion simple para limpiar el formulario y cerrarlo
  cancel() {
    this.movieForm.reset({ price: 1000, maxDays: 1, stock: 1 });
    this.onCancel.emit(); // Le avisa al Administrador que cerramos el panel de edición
  }
}