import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Catalog } from './pages/catalog/catalog';
import { AdminComponent } from './pages/admin/admin';

const routes: Routes = [
  // La raíz vacía ahora carga directamente el Catálogo
  { path: '', component: Catalog },
  
  // El Administrador se mantiene en su URL
  { path: 'admin', component: AdminComponent },
  
  // Si escriben cualquier cosa que no exista, los devuelve a la raíz limpia
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }