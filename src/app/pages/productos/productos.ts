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
import { ZardAlertDialogService } from '../../shared/components/alert-dialog/alert-dialog.service';
import { ProductoService, Producto } from '../../services/producto.services';
import { ProductoFormDialogComponent, ProductoFormData } from './producto-form-dialog';
import { toast } from 'ngx-sonner';
@Component({
  selector: 'app-productos',
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
  templateUrl: './productos.html',
  styleUrl: './productos.css',
})
export class Productos implements OnInit {
  private productoService = inject(ProductoService);
  private dialogService = inject(ZardDialogService);
  private alertDialogService = inject(ZardAlertDialogService);

  productos = signal<Producto[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadProductos();
  }

  loadProductos(): void {
    this.loading.set(true);
    this.error.set(null);

    this.productoService.getProductos().subscribe({
      next: (data) => {
        this.productos.set(data);
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
      zTitle: 'Nuevo Producto',
      zDescription: 'Ingrese el nombre del nuevo producto.',
      zContent: ProductoFormDialogComponent,
      zOkText: 'Crear',
      zCancelText: 'Cancelar',
      zOnOk: (instance: ProductoFormDialogComponent) => {
        if (!instance.isValid()) {
          console.error('Formulario inválido');
          return false;
        }

        instance.clearServerErrors();

        const formData = instance.getValue();

        this.productoService
          .createProducto({
            nombre: formData.nombre,
            precio: formData.precio,
            categoria_id: formData.categoria_id,
            estado: 'activo',
          })
          .subscribe({
            next: () => {
              this.showToast('Producto creado exitosamente', 'El producto se creó correctamente.');
              this.loadProductos();
              dialogRef.close();
            },
            error: (err) => {
              console.error('Error al crear categoría:', err);

              if (err.status === 422 && err.error) {
                instance.setServerErrors({
                  message: err.error.message || 'Error de validación',
                  errors: err.error.errors || {},
                });
              } else {
                instance.setServerErrors({
                  message: 'Error al crear la categoría. Intente nuevamente.',
                });
              }

              this.loading.set(false);
            },
          });

        return false;
      },
      zWidth: '450px',
    });
  }

  openEditDialog(producto: Producto): void {
    const dialogRef = this.dialogService.create({
      zTitle: 'Editar Producto',
      zDescription: `Editando producto: ${producto.nombre}`,
      zContent: ProductoFormDialogComponent,
      zData: {
        id: producto.id,
        nombre: producto.nombre,
        estado: producto.estado,
        precio: producto.precio,
        categoria_id: producto.categoria_id,
      } as ProductoFormData,
      zOkText: 'Actualizar',
      zCancelText: 'Cancelar',
      zOnOk: (instance: ProductoFormDialogComponent) => {
        if (!instance.isValid()) {
          this.showToast(
            'Formulario inválido',
            'Por favor, complete todos los campos correctamente.'
          );
          return false;
        }

        instance.clearServerErrors();

        const formData = instance.getValue();

        this.productoService
          .updateProducto(producto.id, {
            id: producto.id,
            nombre: formData.nombre,
            precio: formData.precio,
            categoria_id: formData.categoria_id,
            estado: formData.estado!,
          })
          .subscribe({
            next: () => {
              this.showToast(
                'Producto actualizado exitosamente',
                'El producto se actualizó correctamente.'
              );
              this.loadProductos();
              dialogRef.close();
            },
            error: (err) => {
              this.showToast('Error al actualizar producto', 'Intente nuevamente.');

              if (err.status === 422 && err.error) {
                instance.setServerErrors({
                  message: err.error.message || 'Error de validación',
                  errors: err.error.errors || {},
                });
              } else {
                instance.setServerErrors({
                  message: 'Error al actualizar el producto. Intente nuevamente.',
                });
              }

              this.loading.set(false);
            },
          });

        return false;
      },
      zWidth: '450px',
    });
  }

  deleteProducto(producto: Producto): void {
    this.alertDialogService.confirm({
      zTitle: '¿Estás seguro?',
      zDescription: `Esta acción eliminará permanentemente el producto "${producto.nombre}". Esta acción no se puede deshacer.`,
      zOkText: 'Eliminar',
      zCancelText: 'Cancelar',
      zOnOk: () => {
        this.loading.set(true);

        this.productoService.deleteProducto(producto.id).subscribe({
          next: () => {
            this.showToast(
              'Producto eliminado exitosamente',
              'El producto se eliminó correctamente.'
            );
            this.loadProductos();
          },
          error: (err) => {
            this.showToast('Error al eliminar producto', 'Intente nuevamente.');
            this.loading.set(false);

            // Opcional: Mostrar otro alert con el error
            this.alertDialogService.confirm({
              zTitle: 'Error',
              zDescription: 'No se pudo eliminar la categoría. Por favor, intente nuevamente.',
              zOkText: 'Aceptar',
              zCancelText: '',
            });
          },
        });
      },
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

  showToast(message: string, description: string) {
    toast.error(message, {
      description: description,
      position: 'top-right',
    });
  }
}
