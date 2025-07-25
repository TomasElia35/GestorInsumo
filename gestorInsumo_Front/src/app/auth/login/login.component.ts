import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    // Si ya está logueado, redirigir al dashboard
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }

  // Getters para acceso fácil a los campos del formulario
  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const credentials = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password
      };

      console.log('Enviando credenciales:', credentials);

      this.authService.login(credentials).subscribe({
        next: (response) => {
          this.isLoading = false;
          console.log('Respuesta del login:', response);
          
          if (response.success) {
            console.log('Login exitoso, redirigiendo...');
            this.router.navigate(['/dashboard']);
          } else {
            this.errorMessage = response.message || 'Error en el login';
          }
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error en login:', error);
          
          if (error.success === false) {
            this.errorMessage = error.message || 'Error en el login';
          } else {
            this.errorMessage = 'Ha ocurrido un error inesperado';
          }
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  // Marcar todos los campos como tocados para mostrar errores
  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }

  // Métodos para mostrar errores específicos
  getEmailError(): string {
    const emailControl = this.email;
    if (emailControl?.hasError('required') && emailControl?.touched) {
      return 'El email es requerido';
    }
    if (emailControl?.hasError('email') && emailControl?.touched) {
      return 'Ingresa un email válido';
    }
    return '';
  }

  getPasswordError(): string {
    const passwordControl = this.password;
    if (passwordControl?.hasError('required') && passwordControl?.touched) {
      return 'La contraseña es requerida';
    }
    if (passwordControl?.hasError('minlength') && passwordControl?.touched) {
      return 'La contraseña debe tener al menos 6 caracteres';
    }
    return '';
  }
}