// Estructura de los datos de las películas.
// Se define qué propiedades debe tener una película en la pagina y en MockAPI.

export interface Movie {
  id?: string;         // El signo '?' indica que es opcional. (Cuando creamos una peli nueva, aún no tiene ID)
  name: string;        // Título de la película
  desc: string;        // Descripción o sinopsis
  img: string;         // URL de la imagen de portada
  price: number;       // Precio de alquiler por un solo día
  maxDays: number;     // Límite máximo de días que un cliente puede alquilar esta película
  stock: number;       // Cantidad de copias disponibles en el inventario actual
}

// Estructura de los elementos dentro del carrito de compras.

export interface CartItem {
  movie: Movie;        // El objeto de la película completa
  days: number;        // La cantidad de días que el cliente seleccionó para alquilarla
}