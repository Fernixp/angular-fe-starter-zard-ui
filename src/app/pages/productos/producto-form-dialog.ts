import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ZardInputDirective } from '../../shared/components/input/input.directive';
import { ZardIconComponent } from '../../shared/components/icon/icon.component';
import { Z_MODAL_DATA } from '../../shared/components/dialog/dialog.service';

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
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ZardInputDirective, ZardIconComponent],
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
    
    <!-- Validaciones cliente -->
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

    <!-- Error servidor -->
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
      min="0"
      class="w-full"
      [class.border-destructive]="form.get('precio')?.invalid && form.get('precio')?.touched"
    />

    <!-- Validaciones cliente -->
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

    <!-- Error servidor -->
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
    <select 
      z-input 
      id="categoria_id"
      formControlName="categoria_id"
      class="cursor-pointer"
      [class.border-destructive]="form.get('categoria_id')?.invalid && form.get('categoria_id')?.touched"
    >
      <option value="">Seleccione una categoría</option>
      <option value="1">Electrónica</option>
      <option value="2">Ropa</option>
      <option value="3">Alimentos</option>
      <option value="4">Hogar</option>
    </select>

    <!-- Validaciones cliente -->
    @if (form.get('categoria_id')?.touched && form.get('categoria_id')?.hasError('required')) {
      <span class="text-xs text-destructive flex items-center gap-1">
        <z-icon zType="triangle-alert" zSize="sm" />
        La categoría es requerida
      </span>
    }

    <!-- Error servidor -->
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
export class ProductoFormDialogComponent {
  private zData: ProductoFormData | null = inject(Z_MODAL_DATA);

  isEditMode = false;
  serverError = signal<string | null>(null);
  fieldErrors = signal<Record<string, string[]>>({});

  form = new FormGroup({
    nombre: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    precio: new FormControl<number>(0, [
      Validators.required,
      Validators.min(0),
    ]),
    categoria_id: new FormControl<number>(0, Validators.required),
    estado: new FormControl<'activo' | 'inactivo'>('activo', Validators.required),
  });

  constructor() {
    // Si hay datos (edición), pre-llenar el formulario
    if (this.zData && this.zData.id) {
      this.isEditMode = true;
      this.form.patchValue(this.zData);
    }
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
      categoria_id: formValue.categoria_id!,
      // Solo incluir estado si es modo edición
      ...(this.isEditMode && { estado: formValue.estado! }),
    };
  }

  // Método para setear errores desde el componente padre
  setServerErrors(errors: { message?: string; errors?: Record<string, string[]> }): void {
    if (errors.message) {
      this.serverError.set(errors.message);
    }
    
    if (errors.errors) {
      this.fieldErrors.set(errors.errors);
    }
  }

  // Limpiar errores del servidor
  clearServerErrors(): void {
    this.serverError.set(null);
    this.fieldErrors.set({});
  }
}