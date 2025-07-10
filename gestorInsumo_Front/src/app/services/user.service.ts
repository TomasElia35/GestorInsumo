// src/app/services/user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { UserResponse, UserRequest, Rol, ApiResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8080/insumomanager-app';
  private usersSubject = new BehaviorSubject<UserResponse[]>([]);
  public users$ = this.usersSubject.asObservable();

  constructor(private http: HttpClient) { }

  // Headers con token JWT
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // Obtener todos los usuarios
  getAllUsers(): Observable<UserResponse[]> {
    return this.http.get<UserResponse[]>(`${this.apiUrl}/usuarios`, {
      headers: this.getHeaders()
    }).pipe(
      map(users => {
        this.usersSubject.next(users);
        return users;
      }),
      catchError(error => {
        console.error('Error al obtener usuarios:', error);
        throw error;
      })
    );
  }

  // Obtener usuario por ID
  getUserById(id: number): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.apiUrl}/usuarios/${id}`, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => {
        console.error('Error al obtener usuario:', error);
        throw error;
      })
    );
  }

  // Crear nuevo usuario
  createUser(user: UserRequest): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${this.apiUrl}/usuarios`, user, {
      headers: this.getHeaders()
    }).pipe(
      map(newUser => {
        // Actualizar la lista local
        const currentUsers = this.usersSubject.value;
        this.usersSubject.next([...currentUsers, newUser]);
        return newUser;
      }),
      catchError(error => {
        console.error('Error al crear usuario:', error);
        throw error;
      })
    );
  }

  // Actualizar usuario
  updateUser(id: number, user: UserRequest): Observable<UserResponse> {
    return this.http.put<UserResponse>(`${this.apiUrl}/usuarios/${id}`, user, {
      headers: this.getHeaders()
    }).pipe(
      map(updatedUser => {
        // Actualizar la lista local
        const currentUsers = this.usersSubject.value;
        const index = currentUsers.findIndex(u => u.id === id);
        if (index !== -1) {
          currentUsers[index] = updatedUser;
          this.usersSubject.next([...currentUsers]);
        }
        return updatedUser;
      }),
      catchError(error => {
        console.error('Error al actualizar usuario:', error);
        throw error;
      })
    );
  }

  // Eliminar usuario
  deleteUser(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/usuarios/${id}`, {
      headers: this.getHeaders()
    }).pipe(
      map(response => {
        if (response.eliminado) {
          // Actualizar la lista local
          const currentUsers = this.usersSubject.value;
          this.usersSubject.next(currentUsers.filter(u => u.id !== id));
        }
        return response;
      }),
      catchError(error => {
        console.error('Error al eliminar usuario:', error);
        throw error;
      })
    );
  }

  // Cambiar estado del usuario
  changeUserStatus(id: number, estado: boolean): Observable<UserResponse> {
    return this.http.patch<UserResponse>(`${this.apiUrl}/usuarios/${id}/estado`, 
      { estado }, 
      { headers: this.getHeaders() }
    ).pipe(
      map(updatedUser => {
        // Actualizar la lista local
        const currentUsers = this.usersSubject.value;
        const index = currentUsers.findIndex(u => u.id === id);
        if (index !== -1) {
          currentUsers[index] = updatedUser;
          this.usersSubject.next([...currentUsers]);
        }
        return updatedUser;
      }),
      catchError(error => {
        console.error('Error al cambiar estado del usuario:', error);
        throw error;
      })
    );
  }

  // Obtener todos los roles
  getAllRoles(): Observable<Rol[]> {
    return this.http.get<Rol[]>(`${this.apiUrl}/roles`, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => {
        console.error('Error al obtener roles:', error);
        throw error;
      })
    );
  }

  // Refrescar lista de usuarios
  refreshUsers(): void {
    this.getAllUsers().subscribe();
  }
}