import { Routes } from '@angular/router';
import { AuthGuardService } from '@services/index';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/layout.component').then(m => m.LayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
      }
    ],
    canActivate: [AuthGuardService.canActivate]
  },
  {
    path: 'notfound',
    loadComponent: () => import('./pages/notfound/notfound.component').then(m => m.NotfoundComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  { 
    path: '**',
    redirectTo: '/'
   },
];
