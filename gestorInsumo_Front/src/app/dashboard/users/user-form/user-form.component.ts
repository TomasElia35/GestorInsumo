// src/app/dashboard/users/components/user-form/user-form.component.ts

import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { UserRequest, UserResponse, Rol } from '../../../shared/models/user.models';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit, OnChanges {
  @Input() user: UserResponse | null = null;
  @Input() roles: Rol[] = [];
  @Input() isEditMode = false;
  @Output() userSaved = new EventEmitter<UserResponse>();
  @Output() cancelled = new EventEmitter<void>();

  userForm: FormGroup;
  isSubmitting = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService
  ) {
    this.userForm = this.createForm();
  }

  ngOnInit(): void {
    if (this.isEditMode && this.user) {
      this.populateForm();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['user'] && this.user && this.isEditMode) {
      this.populateForm();
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      apellido: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      mail: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      contrasena: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(50)]],
      confirmarContrasena: ['', [Validators.required]],
      rol: ['', [Validators.required]],
      estado: [true]
    }, { validators: this.passwordMatchValidator });
  }

  private populateForm(): void {
    if (this.user) {
      this.userForm.patchValue({
        nombre: this.user.nombre,
        apellido: this.user.apellido,
        mail: this.user.mail,
        rol: this.user.rol.id,
        estado: this.user.estado
      });

      // En modo edición, la contraseña es opcional
      this.userForm.get('contrasena')?.clearValidators();
      this.userForm.get('contrasena')?.setValidators([Validators.minLength(6), Validators.maxLength(50)]);
      this.userForm.get('confirmarContrasena')?.clearValidators();
      this.userForm.get('contrasena')?.updateValueAndValidity();
      this.userForm.get('confirmarContrasena')?.updateValueAndValidity();
    }
  }

  // Validador personalizado para confirmar contraseña
  private passwordMatchValidator(form: FormGroup) {
    const password = form.get('contrasena');
    const confirmPassword = form.get('confirmarContrasena');
    
    if (password && confirmPassword) {
      if (password.value !== confirmPassword.value) {
        confirmPassword.setErrors({ passwordMismatch: true });
      } else {
        // Limpiar el error de passwordMismatch si las contraseñas coinciden
        const errors = confirmPassword.errors;
        if (errors) {
          delete errors['passwordMismatch'];
          confirmPassword.setErrors(Object.keys(errors).length > 0 ? errors : null);
        }
      }
    }
    return null;
  }

  // Getters para acceder a los campos del formulario
  get nombre() { return this.userForm.get('nombre'); }
  get apellido() { return this.userForm.get('apellido'); }
  get mail() { return this.userForm.get('mail'); }
  get contrasena() { return this.userForm.get('contrasena'); }
  get confirmarContrasena() { return this.userForm.get('confirmarContrasena'); }
  get rol() { return this.userForm.get('rol'); }
  get estado() { return this.userForm.get('estado'); }

  // Verificar si un campo tiene errores
  hasError(field: string, errorType: string): boolean {
    const control = this.userForm.get(field);
    return !!(control && control.errors && control.errors[errorType] && control.touched);
  }

  // Obtener mensaje de error para un campo
  getErrorMessage(field: string): string {
    const control = this.userForm.get(field);
    if (control && control.errors && control.touched) {
      const errors = control.errors;
      
      switch (field) {
        case 'nombre':
        case 'apellido':
          if (errors['required']) return `${field === 'nombre' ? 'El nombre' : 'El apellido'} es requerido`;
          if (errors['minlength']) return `${field === 'nombre' ? 'El nombre' : 'El apellido'} debe tener al menos 2 caracteres`;
          if (errors['maxlength']) return `${field === 'nombre' ? 'El nombre' : 'El apellido'} no puede exceder los 100 caracteres`;
          break;
        case 'mail':
          if (errors['required']) return 'El email es requerido';
          if (errors['email']) return 'El email no tiene un formato válido';
          if (errors['maxlength']) return 'El email no puede exceder los 100 caracteres';
          break;
        case 'contrasena':
          if (errors['required']) return 'La contraseña es requerida';
          if (errors['minlength']) return 'La contraseña debe tener al menos 6 caracteres';
          if (errors['maxlength']) return 'La contraseña no puede exceder los 50 caracteres';
          break;
        case 'confirmarContrasena':
          if (errors['required']) return 'Debes confirmar la contraseña';
          if (errors['passwordMismatch']) return 'Las contraseñas no coinciden';
          break;
        case 'rol':
          if (errors['required']) return 'Debes seleccionar un rol';
          break;
      }
    }
    return '';
  }

  // Enviar formulario
  onSubmit(): void {
    if (this.userForm.valid) {
      this.isSubmitting = true;
      this.error = null;

      const formData = this.userForm.value;
      
      const userRequest: UserRequest = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        mail: formData.mail,
        contrasena: formData.contrasena,
        estado: formData.estado,
        rol: formData.rol
      };

      const operation = this.isEditMode && this.user
        ? this.userService.updateUser(this.user.id, userRequest)
        : this.userService.createUser(userRequest);

      operation.subscribe({
        next: (response) => {
          this.userSaved.emit(response);
          this.isSubmitting = false;
        },
        error: (error) => {
          this.error = error;
          this.isSubmitting = false;
        }
      });
    } else {
      // Marcar todos los campos como tocados para mostrar errores
      this.markAllFieldsAsTouched();
    }
  }

  // Marcar todos los campos como tocados
  private markAllFieldsAsTouched(): void {
    Object.keys(this.userForm.controls).forEach(key => {
      const control = this.userForm.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }

  // Cancelar operación
  onCancel(): void {
    this.cancelled.emit();
  }

  // Resetear formulario
  resetForm(): void {
    this.userForm.reset();
    this.error = null;
    this.isSubmitting = false;
  }

  // Verificar si el formulario es válido
  isFormValid(): boolean {
    return this.userForm.valid;
  }

  // Verificar si hay cambios en el formulario
  hasChanges(): boolean {
    return this.userForm.dirty;
  }
}