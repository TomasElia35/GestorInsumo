// src/app/app-routing.module.ts (agregar estas rutas)
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserListComponent } from './components/user-list/user-list.component';
import { UserFormComponent } from './components/user-form/user-form.component';
// Importar tu guard de autenticación existente
// import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  // Rutas existentes...
  
  // Rutas de usuarios
  {
    path: 'usuarios',
    component: UserListComponent,
    // canActivate: [AuthGuard] // Descomenta si tienes un guard de autenticación
  },
  {
    path: 'usuarios/crear',
    component: UserFormComponent,
    // canActivate: [AuthGuard]
  },
  {
    path: 'usuarios/editar/:id',
    component: UserFormComponent,
    // canActivate: [AuthGuard]
  },
  
  // Redirección por defecto
  {
    path: '',
    redirectTo: '/usuarios',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }


