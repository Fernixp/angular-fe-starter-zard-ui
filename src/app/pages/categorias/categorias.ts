import { Component, OnInit, signal, inject } from '@angular/core';
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
import { ZardDialogModule } from '../../shared/components/dialog/dialog.component';
import { ZardDialogService } from '../../shared/components/dialog/dialog.service';
import { CategoriaService, Categoria } from '../../services/categoria.services';
import { CategoriaFormDialogComponent, CategoriaFormData } from './categoria-form-dialog';

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
    ZardDialogModule,
  ],
  templateUrl: './categorias.html',
  styleUrl: './categorias.css',
})
export class Categorias implements OnInit {
  private categoriaService = inject(CategoriaService);
  private dialogService = inject(ZardDialogService);

  categorias = signal<Categoria[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

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
      },
    });
  }

  openCreateDialog(): void {
    const dialogRef = this.dialogService.create({
      zTitle: 'Nueva Categoría',
      zDescription: 'Ingrese el nombre de la nueva categoría.',
      zContent: CategoriaFormDialogComponent,
      zOkText: 'Crear',
      zCancelText: 'Cancelar',
      zOnOk: (instance: CategoriaFormDialogComponent) => {
        if (!instance.isValid()) {
          console.error('Formulario inválido');
          return false;
        }
  
        instance.clearServerErrors();
  
        const formData = instance.getValue();
  
        this.categoriaService.createCategoria({
          nombre: formData.nombre,
          estado: 'activo',
        }).subscribe({
          next: () => {
            console.log('Categoría creada exitosamente');
            this.loadCategorias();
            dialogRef.close(); // ✅ Cerrar manualmente cuando sea exitoso
          },
          error: (err) => {
            console.error('Error al crear categoría:', err);
            
            if (err.status === 422 && err.error) {
              instance.setServerErrors({
                message: err.error.message || 'Error de validación',
                errors: err.error.errors || {}
              });
            } else {
              instance.setServerErrors({
                message: 'Error al crear la categoría. Intente nuevamente.'
              });
            }
            
            this.loading.set(false);
          }
        });
  
        return false; // ✅ Evita el cierre automático
      },
      zWidth: '450px',
    });
  }

  openEditDialog(categoria: Categoria): void {
    const dialogRef = this.dialogService.create({
      zTitle: 'Editar Categoría',
      zDescription: `Editando categoría: ${categoria.nombre}`,
      zContent: CategoriaFormDialogComponent,
      zData: {
        id: categoria.id,
        nombre: categoria.nombre,
        estado: categoria.estado,
      } as CategoriaFormData,
      zOkText: 'Actualizar',
      zCancelText: 'Cancelar',
      zOnOk: (instance: CategoriaFormDialogComponent) => {
        if (!instance.isValid()) {
          console.error('Formulario inválido');
          return false;
        }
  
        instance.clearServerErrors();
  
        const formData = instance.getValue();
  
        this.categoriaService.updateCategoria(categoria.id, {
          nombre: formData.nombre,
          estado: formData.estado!,
        }).subscribe({
          next: () => {
            console.log('Categoría actualizada exitosamente');
            this.loadCategorias();
            dialogRef.close(); // ✅ Cerrar manualmente cuando sea exitoso
          },
          error: (err) => {
            console.error('Error al actualizar categoría:', err);
            
            if (err.status === 422 && err.error) {
              instance.setServerErrors({
                message: err.error.message || 'Error de validación',
                errors: err.error.errors || {}
              });
            } else {
              instance.setServerErrors({
                message: 'Error al actualizar la categoría. Intente nuevamente.'
              });
            }
            
            this.loading.set(false);
          }
        });
  
        return false; // ✅ Evita el cierre automático
      },
      zWidth: '450px',
    });
  }

  deleteCategoria(categoria: Categoria): void {
    // Por ahora solo console.log, luego implementaremos confirmación
    console.log('Eliminar categoría:', categoria);
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
}
