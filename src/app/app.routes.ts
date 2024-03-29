import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { HomeGameComponent } from './components/home-game/home-game.component';
import { AuthGuardGame } from './services/auth/auth-guard-game.service';
import { AuthGuardHome } from './services/auth/auth-guard-home.service';
import { NotFound404Component } from './components/not-found-404/not-found-404.component';
import { BoardComponent } from './components/board/board.component';
import { StatsPlayerComponent } from './components/stats-player/stats-player.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent, canActivate: [AuthGuardHome] }, //NO podras acceder al inicio una vez logueado
  { path: 'userManagement/mode/:setmode', component: LoginComponent },
  { path: 'userManagement/game/:setgame', component: LoginComponent },
  { path: 'userManagement/mode', component: LoginComponent }, // Asegúrate de tener esta ruta para el modo de registro

  { path: 'userManagement/logout', component: LoginComponent },
  { path: 'game', component: HomeGameComponent, canActivate:[AuthGuardGame]}, //NO podras acceder a game sin loguear
  { path: 'game/:setmode', component: HomeGameComponent, canActivate:[AuthGuardGame] }, //NO podras acceder a game sin loguear
  
  { path: 'board/:setgame', component: BoardComponent,canActivate:[AuthGuardGame]},//No acceder al tablero si no tiene sesion
  { path: 'board/:id', redirectTo: 'board/:setgame', pathMatch: 'full'}, // Redirigir a la ruta con parámetro setgame

  { path: 'stats', component: StatsPlayerComponent },

  { path: '', component: HomeComponent },
  { path: '**', component: NotFound404Component }, //Pagina cuando no se han encontrado los datos
];
