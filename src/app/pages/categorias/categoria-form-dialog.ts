import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ZardInputDirective } from '../../shared/components/input/input.directive';
import { Z_MODAL_DATA } from '../../shared/components/dialog/dialog.service';

export interface CategoriaFormData {
  id?: number;
  nombre: string;
  estado?: 'activo' | 'inactivo';
}

@Component({
  selector: 'app-categoria-form-dialog',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, ZardInputDirective],
  template: `
    <form [formGroup]="form" class="grid gap-4">
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
        />
        @if (form.get('nombre')?.touched && form.get('nombre')?.hasError('required')) {
          <span class="text-xs text-destructive">El nombre es requerido</span>
        }
        @if (form.get('nombre')?.touched && form.get('nombre')?.hasError('minlength')) {
          <span class="text-xs text-destructive">El nombre debe tener al menos 3 caracteres</span>
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
          >
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </select>
        </div>
      }
    </form>
  `,
})
export class CategoriaFormDialogComponent {
  private zData: CategoriaFormData | null = inject(Z_MODAL_DATA);

  isEditMode = false;

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
}