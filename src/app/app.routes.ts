import { Routes } from '@angular/router';
import { Layout } from './layout/layout';
import { Dashboard } from './pages/dashboard/dashboard';
import { Categorias } from './pages/categorias/categorias';
import { Productos } from './pages/productos/productos';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      { path: '', component: Dashboard },
      { path: 'dashboard', component: Dashboard },
      { path: 'categorias', component: Categorias },
      { path: 'productos', component: Productos },
    ],
  },
  { path: '**', redirectTo: '' },
];
