import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <h1>Dashboard - Gestor de Insumos</h1>
        <div class="user-info">
          <span>Bienvenido, {{ getCurrentUser()?.email || 'Usuario' }}</span>
          <button (click)="logout()" class="btn-logout">Cerrar Sesión</button>
        </div>
      </div>
      
      <div class="dashboard-content">
        <div class="welcome-card">
          <h2>¡Bienvenido al sistema!</h2>
          <p>Has iniciado sesión correctamente. Aquí podrás gestionar todos los insumos del sistema.</p>
          <p><strong>Token guardado:</strong> {{ tokenExists() ? 'Sí' : 'No' }}</p>
        </div>
        
        <div class="features-grid">
          <div class="feature-card">
            <h3>Gestión de Insumos</h3>
            <p>Administra el inventario de insumos</p>
            <button class="btn-feature" disabled>Próximamente</button>
          </div>
          
          <div class="feature-card">
            <h3>Reportes</h3>
            <p>Genera reportes de consumo</p>
            <button class="btn-feature" disabled>Próximamente</button>
          </div>
          
          <div class="feature-card">
            <h3>Configuración</h3>
            <p>Configura el sistema</p>
            <button class="btn-feature" disabled>Próximamente</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      min-height: 100vh;
      background: #f5f5f5;
    }
    
    .dashboard-header {
      background: white;
      padding: 20px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .dashboard-header h1 {
      margin: 0;
      color: #333;
    }
    
    .user-info {
      display: flex;
      align-items: center;
      gap: 15px;
    }
    
    .btn-logout {
      background: #e74c3c;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
    }
    
    .btn-logout:hover {
      background: #c0392b;
    }
    
    .dashboard-content {
      padding: 30px;
    }
    
    .welcome-card {
      background: white;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      margin-bottom: 30px;
    }
    
    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
    }
    
    .feature-card {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      text-align: center;
    }
    
    .btn-feature {
      background: #ccc;
      color: #666;
      border: none;
      padding: 10px 20px;
      border-radius: 4px;
      cursor: not-allowed;
    }
  `]
})
export class DashboardComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Verificar si está logueado
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
    }
  }

  getCurrentUser(): any {
    return this.authService.getCurrentUser();
  }

  tokenExists(): boolean {
    return this.authService.isLoggedIn();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}