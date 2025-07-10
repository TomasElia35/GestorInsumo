// src/app/guards/admin.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  
  constructor(private router: Router) {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    // Verificar si el usuario está autenticado y tiene rol de ADMIN
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole'); // Asumiendo que guardas el rol del usuario
    
    if (token && userRole === 'ADMIN') {
      return true;
    }
    
    // Si no es admin, redirigir al login
    this.router.navigate(['/login']);
    return false;
  }
}