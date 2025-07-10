// src/app/components/user-form/user-form.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { UserRequest, UserResponse, Rol } from '../../models/user.model';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {
  userForm: FormGroup;
  roles: Rol[] = [];
  isEditMode = false;
  userId: number | null = null;
  loading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.userForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadRoles();
    this.checkEditMode();
  }

  createForm(): FormGroup {
    return this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      mail: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.minLength(6)]],
      rol: ['', [Validators.required]],
      estado: [true]
    });
  }

  checkEditMode(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.userId = +params['id'];
        this.loadUserData();
        // En modo edición, la contraseña no es requerida
        this.userForm.get('contrasena')?.clearValidators();
        this.userForm.get('contrasena')?.updateValueAndValidity();
      }
    });
  }

  loadRoles(): void {
    this.userService.getAllRoles().subscribe({
      next: (roles) => {
        this.roles = roles;
      },
      error: (error) => {
        console.error('Error al cargar roles:', error);
      }
    });
  }

  loadUserData(): void {
    if (this.userId) {
      this.loading = true;
      this.userService.getUserById(this.userId).subscribe({
        next: (user) => {
          this.userForm.patchValue({
            nombre: user.nombre,
            apellido: user.apellido,
            mail: user.mail,
            rol: user.rol.id,
            estado: user.estado
          });
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Error al cargar datos del usuario';
          this.loading = false;
          console.error('Error:', error);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      this.loading = true;
      this.error = null;

      const formData = this.userForm.value;
      const userRequest: UserRequest = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        mail: formData.mail,
        contrasena: formData.contrasena,
        rol: formData.rol,
        estado: formData.estado
      };

      // Si es modo edición y no se proporcionó contraseña, no la enviamos
      if (this.isEditMode && !formData.contrasena) {
        delete userRequest.contrasena;
      }

      const operation = this.isEditMode 
        ? this.userService.updateUser(this.userId!, userRequest)
        : this.userService.createUser(userRequest);

      operation.subscribe({
        next: (response) => {
          this.loading = false;
          this.router.navigate(['/usuarios']);
        },
        error: (error) => {
          this.loading = false;
          this.error = error.error?.error || 'Error al guardar usuario';
          console.error('Error:', error);
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  markFormGroupTouched(): void {
    Object.keys(this.userForm.controls).forEach(key => {
      const control = this.userForm.get(key);
      control?.markAsTouched();
    });
  }

  cancel(): void {
    this.router.navigate(['/usuarios']);
  }

  // Getters para validación
  get nombre() { return this.userForm.get('nombre'); }
  get apellido() { return this.userForm.get('apellido'); }
  get mail() { return this.userForm.get('mail'); }
  get contrasena() { return this.userForm.get('contrasena'); }
  get rol() { return this.userForm.get('rol'); }
  get estado() { return this.userForm.get('estado'); }

  getFieldError(fieldName: string): string {
    const field = this.userForm.get(fieldName);
    if (field && field.errors && field.touched) {
      if (field.errors['required']) {
        return `El campo ${fieldName} es requerido`;
      }
      if (field.errors['email']) {
        return 'El formato del email no es válido';
      }
      if (field.errors['minlength']) {
        return `El campo ${fieldName} debe tener al menos ${field.errors['minlength'].requiredLength} caracteres`;
      }
    }
    return '';
  }
}