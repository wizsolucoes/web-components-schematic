import { Routes } from "@angular/router";

export const APP_ROUTES: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
         path: 'home',
         loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
    }
];