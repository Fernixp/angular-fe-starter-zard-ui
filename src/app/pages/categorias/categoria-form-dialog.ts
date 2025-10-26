import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ZardInputDirective } from '../../shared/components/input/input.directive';
import { ZardIconComponent } from '../../shared/components/icon/icon.component';
import { Z_MODAL_DATA } from '../../shared/components/dialog/dialog.service';

export interface CategoriaFormData {
  id?: number;
  nombre: string;
  estado?: 'activo' | 'inactivo';
}

@Component({
  selector: 'app-categoria-form-dialog',
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

      <div class="grid gap-3">
        <label 
          for="nombre" 
          class="flex items-center gap-2 text-sm leading-none font-medium select-none"
        >
          Nombre de la categoría <span class="text-destructive">*</span>
        </label>
        <input 
          z-input 
          id="nombre"
          formControlName="nombre" 
          placeholder="Ej: Electrónica, Ropa, Alimentos..."
          class="w-full"
          [class.border-destructive]="form.get('nombre')?.invalid && form.get('nombre')?.touched"
        />
        
        <!-- Errores de validación del cliente -->
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
        
        <!-- Errores del servidor para el campo nombre -->
        @if (fieldErrors()['nombre']) {
          <span class="text-xs text-destructive flex items-center gap-1">
            <z-icon zType="circle-x" zSize="sm" />
            {{ fieldErrors()['nombre'][0] }}
          </span>
        }
      </div>

      <!-- Solo mostrar estado en edición -->
      @if (isEditMode) {
        <div class="grid gap-3">
          <label 
            for="estado" 
            class="flex items-center gap-2 text-sm leading-none font-medium select-none"
          >
            Estado <span class="text-destructive">*</span>
          </label>
          <select 
            z-input 
            id="estado"
            formControlName="estado"
            class="cursor-pointer"
            [class.border-destructive]="form.get('estado')?.invalid && form.get('estado')?.touched"
          >
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </select>
          
          <!-- Errores del servidor para el campo estado -->
          @if (fieldErrors()['estado']) {
            <span class="text-xs text-destructive flex items-center gap-1">
              <z-icon zType="circle-x" zSize="sm" />
              {{ fieldErrors()['estado'][0] }}
            </span>
          }
        </div>
      }
    </form>
  `,
})
export class CategoriaFormDialogComponent {
  private zData: CategoriaFormData | null = inject(Z_MODAL_DATA);

  isEditMode = false;
  serverError = signal<string | null>(null);
  fieldErrors = signal<Record<string, string[]>>({});

  form = new FormGroup({
    nombre: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
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

  getValue(): CategoriaFormData {
    const formValue = this.form.value;
    
    return {
      ...this.zData,
      nombre: formValue.nombre!,
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