import { Component, inject, signal, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ZardInputDirective } from '../../shared/components/input/input.directive';
import { ZardIconComponent } from '../../shared/components/icon/icon.component';
import { Z_MODAL_DATA } from '../../shared/components/dialog/dialog.service';
import { CategoriaService, Categoria } from '../../services/categoria.services';

export interface ProductoFormData {
  id?: number;
  nombre: string;
  precio: number;
  categoria_id: number;
  estado?: 'activo' | 'inactivo';
}

@Component({
  selector: 'app-producto-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ZardInputDirective,
    ZardIconComponent,
  ],
  template: `
    <form [formGroup]="form" class="grid gap-4">
      <!-- Error general del servidor -->
      @if (serverError()) {
        <div class="flex items-center gap-2 p-3 rounded-md bg-destructive/10 text-destructive text-sm">
          <z-icon zType="circle-x" zSize="sm" />
          <span>{{ serverError() }}</span>
        </div>
      }

      <!-- Nombre -->
      <div class="grid gap-3">
        <label
          for="nombre"
          class="flex items-center gap-2 text-sm leading-none font-medium select-none"
        >
          Nombre del producto <span class="text-destructive">*</span>
        </label>
        <input
          z-input
          id="nombre"
          formControlName="nombre"
          placeholder="Ej: Monitor, Teclado, Mouse..."
          class="w-full"
          [class.border-destructive]="form.get('nombre')?.invalid && form.get('nombre')?.touched"
        />

        @if (form.get('nombre')?.touched && form.get('nombre')?.hasError('required')) {
          <span class="text-xs text-destructive flex items-center gap-1">
            <z-icon zType="triangle-alert" zSize="sm" />
            El nombre es requerido
          </span>
        }
        @if (form.get('nombre')?.touched && form.get('nombre')?.hasError('minlength')) {
          <span class="text-xs text-destructive flex items-center gap-1">
            <z-icon zType="triangle-alert" zSize="sm" />
            El nombre debe tener al menos 3 caracteres
          </span>
        }

        @if (fieldErrors()['nombre']) {
          <span class="text-xs text-destructive flex items-center gap-1">
            <z-icon zType="circle-x" zSize="sm" />
            {{ fieldErrors()['nombre'][0] }}
          </span>
        }
      </div>

      <!-- Precio -->
      <div class="grid gap-3">
        <label
          for="precio"
          class="flex items-center gap-2 text-sm leading-none font-medium select-none"
        >
          Precio <span class="text-destructive">*</span>
        </label>
        <input
          z-input
          id="precio"
          type="number"
          formControlName="precio"
          placeholder="Ej: 150.00"
          step="0.01"
          min="0"
          class="w-full"
          [class.border-destructive]="form.get('precio')?.invalid && form.get('precio')?.touched"
        />

        @if (form.get('precio')?.touched && form.get('precio')?.hasError('required')) {
          <span class="text-xs text-destructive flex items-center gap-1">
            <z-icon zType="triangle-alert" zSize="sm" />
            El precio es requerido
          </span>
        }
        @if (form.get('precio')?.touched && form.get('precio')?.hasError('min')) {
          <span class="text-xs text-destructive flex items-center gap-1">
            <z-icon zType="triangle-alert" zSize="sm" />
            El precio debe ser mayor a 0
          </span>
        }

        @if (fieldErrors()['precio']) {
          <span class="text-xs text-destructive flex items-center gap-1">
            <z-icon zType="circle-x" zSize="sm" />
            {{ fieldErrors()['precio'][0] }}
          </span>
        }
      </div>

      <!-- Categoría -->
      <div class="grid gap-3">
        <label
          for="categoria_id"
          class="flex items-center gap-2 text-sm leading-none font-medium select-none"
        >
          Categoría <span class="text-destructive">*</span>
        </label>
        
        @if (loadingCategorias()) {
          <div class="flex items-center gap-2 text-sm text-muted-foreground">
            <z-icon zType="loader-circle" class="animate-spin" zSize="sm" />
            Cargando categorías...
          </div>
        } @else if (categoriasError()) {
          <div class="text-xs text-destructive flex items-center gap-1">
            <z-icon zType="circle-x" zSize="sm" />
            Error al cargar categorías
          </div>
        } @else {
          <select 
            z-input 
            id="categoria_id"
            formControlName="categoria_id"
            class="cursor-pointer"
            [class.border-destructive]="
              form.get('categoria_id')?.invalid && form.get('categoria_id')?.touched
            "
          >
            <option value="" disabled selected>Seleccione una categoría</option>
            @for (categoria of categorias(); track categoria.id) {
              @if (categoria.estado === 'activo') {
                <option [value]="categoria.id">{{ categoria.nombre }}</option>
              }
            }
          </select>
        }

        @if (form.get('categoria_id')?.touched && form.get('categoria_id')?.hasError('required')) {
          <span class="text-xs text-destructive flex items-center gap-1">
            <z-icon zType="triangle-alert" zSize="sm" />
            La categoría es requerida
          </span>
        }

        @if (fieldErrors()['categoria_id']) {
          <span class="text-xs text-destructive flex items-center gap-1">
            <z-icon zType="circle-x" zSize="sm" />
            {{ fieldErrors()['categoria_id'][0] }}
          </span>
        }
      </div>
    </form>
  `,
})
export class ProductoFormDialogComponent implements OnInit {
  private zData: ProductoFormData | null = inject(Z_MODAL_DATA);
  private categoriaService = inject(CategoriaService);

  isEditMode = false;
  serverError = signal<string | null>(null);
  fieldErrors = signal<Record<string, string[]>>({});
  
  // Signals para manejar las categorías
  categorias = signal<Categoria[]>([]);
  loadingCategorias = signal(true);
  categoriasError = signal(false);

  form = new FormGroup({
    nombre: new FormControl('', [Validators.required, Validators.minLength(3)]),
    precio: new FormControl<number | null>(null, [Validators.required, Validators.min(0.01)]),
    categoria_id: new FormControl<number | string>('', Validators.required),
    estado: new FormControl<'activo' | 'inactivo'>('activo', Validators.required),
  });

  ngOnInit(): void {
    this.loadCategorias();
  }

  constructor() {
    // Si hay datos (edición), pre-llenar el formulario
    if (this.zData && this.zData.id) {
      this.isEditMode = true;
      this.form.patchValue(this.zData);
    }
  }

  loadCategorias(): void {
    this.loadingCategorias.set(true);
    this.categoriasError.set(false);

    this.categoriaService.getCategorias().subscribe({
      next: (data) => {
        this.categorias.set(data);
        this.loadingCategorias.set(false);
      },
      error: (err) => {
        console.error('Error al cargar categorías:', err);
        this.categoriasError.set(true);
        this.loadingCategorias.set(false);
      }
    });
  }

  isValid(): boolean {
    return this.form.valid;
  }

  getValue(): ProductoFormData {
    const formValue = this.form.value;

    return {
      ...this.zData,
      nombre: formValue.nombre!,
      precio: formValue.precio!,
      categoria_id: Number(formValue.categoria_id),
      // Solo incluir estado si es modo edición
      ...(this.isEditMode && { estado: formValue.estado! }),
    };
  }

  setServerErrors(errors: { message?: string; errors?: Record<string, string[]> }): void {
    if (errors.message) {
      this.serverError.set(errors.message);
    }

    if (errors.errors) {
      this.fieldErrors.set(errors.errors);
    }
  }

  clearServerErrors(): void {
    this.serverError.set(null);
    this.fieldErrors.set({});
  }
}