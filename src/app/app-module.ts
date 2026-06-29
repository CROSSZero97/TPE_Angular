import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';

// Páginas
import { Catalog } from './pages/catalog/catalog';
import { AdminComponent } from './pages/admin/admin';

// Componentes
import { Header } from './components/header/header';
import { MovieListComponent } from './components/movie-list/movie-list';
import { CartComponent } from './components/cart/cart';
import { MovieFormComponent } from './components/movie-form/movie-form';

@NgModule({
  declarations: [
    App,
    Catalog,
    AdminComponent,
    Header,
    MovieListComponent,
    CartComponent,
    MovieFormComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, ReactiveFormsModule],
  providers: [provideHttpClient()],
  bootstrap: [App],
})
export class AppModule {}
