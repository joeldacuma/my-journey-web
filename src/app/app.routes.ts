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
      },
      {
        path: 'events',
        loadComponent: () => import('./pages/events/events.component').then(m => m.EventsComponent)
      },
      { 
        path: 'members',
        loadComponent: () => import('./pages/members/members.component').then(m => m.MembersComponent)
      },
      {
        path: 'categories',
        loadComponent: () => import('./pages/categories/categories.component').then(m => m.CategoriesComponent)
      },
      {
        path: 'locations',
        loadComponent: () => import('./pages/locations/locations.component').then(m => m.LocationsComponent)
      },
      {
        path: 'personal',
        loadComponent: () => import('./pages/personal/personal.component').then(m => m.PersonalComponent)
      },
      {
        path: 'group',
        loadComponent: () => import('./pages/group/group.component').then(m => m.GroupComponent)
      },
      {
        path: 'coaching',
        loadComponent: () => import('./pages/coaching/coaching.component').then(m => m.CoachingComponent)
      },
      {
        path: 'finder',
        loadComponent: () => import('./pages/finder/finder.component').then(m => m.FinderComponent)
      }
    ],
    canActivate: [AuthGuardService.canActivate]
  },
  // {
  //   path: 'notfound',
  //   loadComponent: () => import('./pages/notfound/notfound.component').then(m => m.NotfoundComponent)
  // },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  { 
    path: '**',
    redirectTo: '/'
   },
];
