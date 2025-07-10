// src/app/components/user-list/user-list.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { UserResponse } from '../../models/user.model';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users: UserResponse[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.error = null;
    
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error al cargar los usuarios';
        this.loading = false;
        console.error('Error:', error);
      }
    });
  }

  createUser(): void {
    this.router.navigate(['/usuarios/crear']);
  }

  editUser(userId: number): void {
    this.router.navigate(['/usuarios/editar', userId]);
  }

  deleteUser(user: UserResponse): void {
    if (confirm(`¿Está seguro de que desea eliminar al usuario ${user.nombre} ${user.apellido}?`)) {
      this.userService.deleteUser(user.id).subscribe({
        next: (response) => {
          if (response.eliminado) {
            this.loadUsers(); // Recargar lista
          }
        },
        error: (error) => {
          console.error('Error al eliminar usuario:', error);
          alert('Error al eliminar usuario');
        }
      });
    }
  }

  toggleUserStatus(user: UserResponse): void {
    const newStatus = !user.estado;
    const action = newStatus ? 'activar' : 'desactivar';
    
    if (confirm(`¿Está seguro de que desea ${action} al usuario ${user.nombre} ${user.apellido}?`)) {
      this.userService.changeUserStatus(user.id, newStatus).subscribe({
        next: (updatedUser) => {
          // El usuario se actualiza automáticamente por el servicio
          console.log('Estado actualizado:', updatedUser);
        },
        error: (error) => {
          console.error('Error al cambiar estado:', error);
          alert('Error al cambiar estado del usuario');
        }
      });
    }
  }

  getStatusClass(estado: boolean): string {
    return estado ? 'badge-success' : 'badge-danger';
  }

  getStatusText(estado: boolean): string {
    return estado ? 'Activo' : 'Inactivo';
  }
}