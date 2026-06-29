# Cinemabuster

#Integrantes
Facundo Figueroa - DNI:44.118.603 - facu.agus.figueroa@gmail.com - Sede Tandil

#StackBlitz
https://stackblitz.com/~/github.com/CROSSZero97/TPE_Angular


#Tematica

Es una página como las viejas tiendas para alquilar películas, pero como si tuviera una página, no creo realmente que alguna tenga en realidad una página y más hecha en angular pero me pareció buena la idea y quise hacer algo por el estilo
Contiene la pestaña principal que es el catálogo de películas junto a un carrito y un header que te sirve para intercambiar entre la pagina del catalogo y la de administrador donde se puede crear, eliminar y editar películas en la base de datos de MockAPI

#Algunos ejemplos de cada punto indicado en el Trabajo Práctico:

### 1. Ruteo
Se implementa el enrutamiento de la página separando el catálogo que es la url base del apartado del admin
* **Archivo:** `src/app/app-routing-module.ts`
* **Líneas 7-16:** Se define la constante `routes: Routes` configurando la ruta raíz vacía `''`  asociada al componente `Catalog` (Vista Cliente) y la ruta `'admin'` asociada al componente `AdminComponent` (Panel de Gestión). También incluye la ruta adicional `'**'` para gestionar redirecciones ante errores de navegación.

### 2. Componentes 
Se atomizo la página por ejemplo en admin haciendo que esta pagina está compuesta por componente 
* **Archivo:** `src/app/pages/admin/admin.html`
* **Líneas 3 y 27 (Aprox.):** La página del Administrador (`AdminComponent`) actúa como contenedor principal, que incluye en su plantilla dos componentes distintos: `<app-movie-form>` (Formulario reactivo para modificar y crear películas) y `<app-movie-list>` (Listado reutilizable de las películas).

### 3. Interfaces
Toda la página se encuentra tipada bajo contratos de TypeScript como por ejemplo:
* **Archivo:** `src/app/movie.ts`
* **Líneas 5-20:** Se crearon y utilizaron dos interfaces: `interface Movie` (que define las variables a utilizar para una película como `name`, `price`, `maxDays`, `stock`, etc.) e `interface CartItem` (que estructura los elementos del carrito combinando el modelo `Movie` con la cantidad de días que se alquila una película).

### 4. Directivas o Control de Flujo Moderno
Se empleó control de flujo en las plantillas HTML.
* **Archivo:** `src/app/components/movie-list/movie-list.html`
* **El `@for`:** Implementada en la línea 12 para listar cada película que viene de MockAPI(`@for (movie of movies; track movie.id)`). Incluye además un`@empty` en la línea 60 para controlar la vista en caso de listas vacías.
* **El `@if`:** Implementada en la línea 30 (`@if (mode === 'catalog')`) para separar la interfaz entre la vista de alquiler para el cliente y el panel de acciones con botones para el administrador.

### 5. Comunicación entre Componentes
Se implementaron ambas vías de comunicación:
* **Flujo `@Input` / `@Output` (Eventos):** En `src/app/components/movie-form/movie-form.ts` (Líneas 9-14) se utiliza `@Input() movieToEdit` para recibir datos desde la página admin, y `@Output() onSave` junto a `@Output() onCancel` para emitir eventos guardado y cancelación del formulario de vuelta a la página de admin.

### 6. Solicitud GET 
La aplicación utiliza los datos de la aplicación MockAPI.
* **Archivo:** `src/app/pages/admin/admin.ts` (y también en `catalog.ts`).
* **Líneas 31-43:** Dentro del método `ngOnInit()`, se utiliza `isPlatformBrowser(this.platformId)` para resolver la página ante errores en recargas (F5). Seguidamente, se realiza la suscripción al método `this.cinemaService.getMovies()` encargada de realizar la petición GET hacía la API.

### 7 Métodos POST, PUT y  DELETE
Se implementaron los métodos POST, PUT y  DELETE para la base de datos en MockAPI.
* **Archivo:** `src/app/services/cinema.ts` (Líneas 33-45)
* **POST (`createMovie`):** Envía una película creada a MockAPI para que esta se cargue en la base de datos.
* **PUT (`updateMovie`):** Modifica valores de una película en la base de datos de MockAPI. Se usa tanto como para actualizar una película luego de hacerse el checkout en el carrito como para las acciones del admin
* **DELETE (`deleteMovie`):** Elimina una película en la base de datos de MockAPI.

### 8 Formulario Reactivo
Se encapsuló la lógica de ingreso de datos en un formulario reactivo.
* **Archivo:** `src/app/components/movie-form/movie-form.ts`
* **Líneas 20-33:** Se inyecta `FormBuilder` para inicializar la propiedad `movieForm: FormGroup` asignando valores por defecto y configurando restricciones `Validators.required` (campos obligatorios como nombre, precio o URL de imagen) y `Validators.min()` / `Validators.minLength()` para sanitizar los rangos numéricos y de texto permitidos. El botón de envío se encuentra vinculado a la propiedad `[disabled]="movieForm.invalid"` en la página de admin
