import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ZardTableBodyComponent,
  ZardTableCellComponent,
  ZardTableComponent,
  ZardTableHeadComponent,
  ZardTableHeaderComponent,
  ZardTableRowComponent,
} from '../../shared/components/table/table.component';
import { ZardButtonComponent } from '../../shared/components/button/button.component';
import { ZardBadgeComponent } from '../../shared/components/badge/badge.component';
import { ZardIconComponent } from '../../shared/components/icon/icon.component';
import { ZardDividerComponent } from '../../shared/components/divider/divider.component';
import { CategoriaService, Categoria } from '../../services/categoria.services';

@Component({
  selector: 'app-categorias',
  imports: [
    CommonModule,
    ZardTableComponent,
    ZardTableHeaderComponent,
    ZardTableBodyComponent,
    ZardTableRowComponent,
    ZardTableHeadComponent,
    ZardTableCellComponent,
    ZardBadgeComponent,
    ZardButtonComponent,
    ZardIconComponent,
    ZardDividerComponent,
  ],
  templateUrl: './categorias.html',
  styleUrl: './categorias.css',
})
export class Categorias implements OnInit {
  categorias = signal<Categoria[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  constructor(private categoriaService: CategoriaService) {}

  ngOnInit(): void {
    this.loadCategorias();
  }

  loadCategorias(): void {
    this.loading.set(true);
    this.error.set(null);
    
    this.categoriaService.getCategorias().subscribe({
      next: (data) => {
        this.categorias.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error al cargar categorías:', err);
        this.error.set('Error al cargar las categorías');
        this.loading.set(false);
      }
    });
  }

  getEstadoVariant(estado: string): 'default' | 'secondary' | 'destructive' | 'outline' {
    return estado === 'activo' ? 'default' : 'outline';
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  }

  editCategoria(categoria: Categoria): void {
    console.log('Editar categoría:', categoria);
    // Aquí implementarás la lógica de edición
  }

  deleteCategoria(categoria: Categoria): void {
    console.log('Eliminar categoría:', categoria);
    // Aquí implementarás la lógica de eliminación
  }
}