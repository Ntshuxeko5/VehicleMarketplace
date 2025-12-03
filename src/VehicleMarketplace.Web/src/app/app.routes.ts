import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { ListingListComponent } from './features/listings/listing-list/listing-list.component';
import { ListingDetailComponent } from './features/listings/listing-detail/listing-detail.component';
import { ListingFormComponent } from './features/listings/listing-form/listing-form.component';
import { DashboardComponent } from './features/admin/dashboard/dashboard.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'auth/login', component: LoginComponent },
    { path: 'auth/register', component: RegisterComponent },
    { path: 'listings', component: ListingListComponent },
    { path: 'listings/create', component: ListingFormComponent, canActivate: [authGuard] },
    { path: 'listings/:id', component: ListingDetailComponent },
    { path: 'listings/:id/edit', component: ListingFormComponent, canActivate: [authGuard] },
    { path: 'admin', component: DashboardComponent, canActivate: [authGuard] },
    {
        path: 'profile',
        loadComponent: () => import('./features/user/profile/profile.component').then(m => m.ProfileComponent),
        canActivate: [authGuard]
    },
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: '**', redirectTo: '/home' }
];
