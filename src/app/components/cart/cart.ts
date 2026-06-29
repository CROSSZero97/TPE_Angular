import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; 
import { CinemaService } from '../../services/cinema';
import { CartItem } from '../../movie';

@Component({
  selector: 'app-cart',
  standalone: false,
  templateUrl: './cart.html',
  styleUrls: ['./cart.scss']
})
export class CartComponent implements OnInit {
  // Almacena los elementos que el cliente va sumando para alquilar
  cartItems: CartItem[] = [];

  constructor(private cinemaService: CinemaService, private cdr: ChangeDetectorRef) {} 

  //Al iniciar, el carrito se suscribe al servicio.
  ngOnInit() {
    this.cinemaService.getCart().subscribe(items => {
      this.cartItems = items;
      this.cdr.detectChanges(); // Redibuja el carrito en pantalla para reflejar los nuevos items
    });
  }


  // Getter que se usa para sumar (Precio x Días) de todos los items dentro del carrito.
  get total() {
    return this.cartItems.reduce((acc, item) => acc + (item.movie.price * item.days), 0);
  }


  // Funcion que procesa la compra final
  checkout() {
    // Recorre cada película del carrito para descontarle 1 unidad al stock real
    this.cartItems.forEach(item => {
      const updatedStock = item.movie.stock - 1; // Calcula el nuevo stock localmente
      
      // Llama al método PUT del servicio para guardar el nuevo stock en MockAPI
      this.cinemaService.updateMovie(item.movie.id!, { stock: updatedStock }).subscribe();
    });

    // Retroalimentación visual para el usuario
    alert('¡Alquiler realizado con éxito!');
    
    // Resetea el carrito interno
    this.cinemaService.clearCart();
    
    // Recarga la página completa para refrescar los datos desde cero y mostrar los nuevos stocks
    window.location.reload();
  }

  // Funcion que elimina una pelicula del carrito
  remove(id: string) {
    this.cinemaService.removeFromCart(id);
  }
}