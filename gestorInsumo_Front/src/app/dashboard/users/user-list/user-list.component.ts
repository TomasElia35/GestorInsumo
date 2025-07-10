// src/app/dashboard/users/components/user-list/user-list.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// Update the import path below to the correct relative path where user.service.ts exists.
// For example, if the correct path is '../services/user.service', update as follows:
import { UserService } from '../services/user.service';
// Update the path below to the correct location of user.models.ts
// Example: If user.models.ts is in src/app/shared/models, use the following:
import { UserResponse, Rol } from '../../../models/user.models';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users: UserResponse[] = [];
  roles: Rol[] = [];
  loading = false;
  error: string | null = null;
  
  // Variables para el modal
  showCreateModal = false;
  showEditModal = false;
  showDeleteModal = false;
  selectedUser: UserResponse | null = null;
  
  // Variables para filtros
  searchTerm = '';
  statusFilter = 'all'; // 'all', 'active', 'inactive'
  roleFilter = 'all';

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadRoles();
  }

  // Cargar usuarios
  loadUsers(): void {
    this.loading = true;
    this.error = null;
    
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.loading = false;
      },
      error: (error) => {
        this.error = error;
        this.loading = false;
        console.error('Error loading users:', error);
      }
    });
  }

  // Cargar roles
  loadRoles(): void {
    this.userService.getRoles().subscribe({
      next: (roles) => {
        this.roles = roles;
      },
      error: (error) => {
        console.error('Error loading roles:', error);
      }
    });
  }

  // Usuarios filtrados
  get filteredUsers(): UserResponse[] {
    return this.users.filter(user => {
      const matchesSearch = user.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           user.apellido.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           user.mail.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesStatus = this.statusFilter === 'all' || 
                           (this.statusFilter === 'active' && user.estado) ||
                           (this.statusFilter === 'inactive' && !user.estado);
      
      const matchesRole = this.roleFilter === 'all' || user.rol.id.toString() === this.roleFilter;
      
      return matchesSearch && matchesStatus && matchesRole;
    });
  }

  // Abrir modal de crear usuario
  openCreateModal(): void {
    this.showCreateModal = true;
  }

  // Abrir modal de editar usuario
  openEditModal(user: UserResponse): void {
    this.selectedUser = user;
    this.showEditModal = true;
  }

  // Abrir modal de eliminar usuario
  openDeleteModal(user: UserResponse): void {
    this.selectedUser = user;
    this.showDeleteModal = true;
  }

  // Cambiar estado del usuario
  toggleUserStatus(user: UserResponse): void {
    this.userService.changeUserStatus(user.id, !user.estado).subscribe({
      next: (updatedUser) => {
        const index = this.users.findIndex(u => u.id === user.id);
        if (index !== -1) {
          this.users[index] = updatedUser;
        }
      },
      error: (error) => {
        console.error('Error changing user status:', error);
        this.error = error;
      }
    });
  }

  // Eliminar usuario
  deleteUser(): void {
    if (!this.selectedUser) return;

    this.userService.deleteUser(this.selectedUser.id).subscribe({
      next: (response) => {
        if (response.eliminado) {
          this.users = this.users.filter(u => u.id !== this.selectedUser!.id);
          this.closeDeleteModal();
        }
      },
      error: (error) => {
        console.error('Error deleting user:', error);
        this.error = error;
      }
    });
  }

  // Cerrar modales
  closeCreateModal(): void {
    this.showCreateModal = false;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.selectedUser = null;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.selectedUser = null;
  }

  // Callback cuando se crea un usuario
  onUserCreated(user: UserResponse): void {
    this.users.push(user);
    this.closeCreateModal();
  }

  // Callback cuando se actualiza un usuario
  onUserUpdated(user: UserResponse): void {
    const index = this.users.findIndex(u => u.id === user.id);
    if (index !== -1) {
      this.users[index] = user;
    }
    this.closeEditModal();
  }

  // Limpiar filtros
  clearFilters(): void {
    this.searchTerm = '';
    this.statusFilter = 'all';
    this.roleFilter = 'all';
  }

  // Obtener nombre del rol
  getRoleName(roleId: number): string {
    const role = this.roles.find(r => r.id === roleId);
    return role ? role.nombre : 'Sin rol';
  }

  // Formatear fecha
  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('es-ES');
  }
}