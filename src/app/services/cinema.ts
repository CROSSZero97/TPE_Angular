import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Movie, CartItem } from '../movie';

@Injectable({
  providedIn: 'root'
})
export class CinemaService {

  // Endpoint de nuestra base de datos de MockAPI
  private apiUrl = 'https://6a3d7a71d8e212699e23ee91.mockapi.io/Movies';

  // --- VARIABLES DE ESTADO DEL CARRITO ---
  private cart: CartItem[] = []; // Arreglo interno privado que guarda físicamente los datos del carrito
  // BehaviorSubject es una herramienta reactiva. Permite que cualquier componente que se "suscriba" 
  // se entere automáticamente cuando el carrito cambia de estado.
  private cartSubject = new BehaviorSubject<CartItem[]>([]); 

  // Inyectamos HttpClient para poder hacer peticiones a internet
  constructor(private http: HttpClient) {}

  // ==================================
  // --- PETICIONES HTTP A MOCKAPI  ---
  // ==================================

  // GET: Trae todas las películas de la base de datos
  getMovies(): Observable<Movie[]> {
    return this.http.get<Movie[]>(this.apiUrl);
  }

  // POST: Envía una película nueva para guardarla en la base de datos
  createMovie(movie: Movie): Observable<Movie> {
    return this.http.post<Movie>(this.apiUrl, movie);
  }

  // PUT: Modifica un dato específico de una película existente (ej. actualizar el stock o precio)
  updateMovie(id: string, movie: Partial<Movie>): Observable<Movie> {
    return this.http.put<Movie>(`${this.apiUrl}/${id}`, movie);
  }

  // DELETE: Borra permanentemente una película de la base de datos usando su ID
  deleteMovie(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // ==================================
  // --- LÓGICA INTERNA DEL CARRITO ---
  // ==================================

  // Devuelve el carrito como un "Observable" para que los componentes puedan escucharlo
  getCart(): Observable<CartItem[]> {
    return this.cartSubject.asObservable();
  }

  // Agrega una película al carrito o actualiza sus días si ya estaba adentro
  addToCart(movie: Movie, days: number) {
    // Busca si la película ya existe en el carrito
    const existingIndex = this.cart.findIndex(item => item.movie.id === movie.id);
    
    if (existingIndex > -1) {
      // Si ya existe, simplemente le actualiza la cantidad de días
      this.cart[existingIndex].days = days;
    } else {
      // Si es nueva, la empuja al final del arreglo
      this.cart.push({ movie, days });
    }
    // Emite el nuevo arreglo clonado para que la interfaz se actualice inmediatamente
    this.cartSubject.next([...this.cart]);
  }

  // Filtra el carrito para quitar la película que coincida con el ID y avisa del cambio
  removeFromCart(movieId: string) {
    this.cart = this.cart.filter(item => item.movie.id !== movieId);
    this.cartSubject.next([...this.cart]);
  }

  // Vacía el carrito por completo
  clearCart() {
    this.cart = [];
    this.cartSubject.next([]);
  }
}