import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'userManagement/:setmode', component: LoginComponent },
  { path: 'userManagement/:logout', component: LoginComponent },
  { path: '**', component: HomeComponent },
];
