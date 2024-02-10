import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { HomeGameComponent } from './components/home-game/home-game.component';
import {  AuthGuardGame } from './services/auth/auth-guard-game.service';
import { AuthGuardHome } from './services/auth/auth-guard-home.service';
import { NotFound404Component } from './components/not-found-404/not-found-404.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent, canActivate:[AuthGuardHome]},//NO podras acceder al inicio una vez logueado
  { path: 'userManagement/:setmode', component: LoginComponent },
  { path: 'userManagement/logout', component: LoginComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'game', component: HomeGameComponent , canActivate:[AuthGuardGame] },//NO podras acceder a game sin loguear
  { path: '', component: HomeComponent},
  { path: '**', component: NotFound404Component }, //Pagina cuando no se han encontrado los datos
];
