import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { UsersServiceService } from '../../services/users.service.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
    FormsModule,
    CommonModule,
    RouterLink,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  constructor(
    private router: Router,
    private usersService: UsersServiceService
  ) {}

  idGame!: string;
  errorPage: string = '';
  showError: boolean = false;

  loadGame(idGame: string) {
    if (!this.idGame) {
      this.showError = true;
      return;
    } else if (!this.usersService.isLogged()) {
      //Enviar a loguear si no ha iniciado sesion con el id de la partida
      this.router.navigate(['/userManagement/mode'], { queryParams: { setmode: 'login', setgame: idGame } });
    }
    this.showError = false;
  }

  navigateToLogin(idGame: string) {
    this.router.navigate(['/userManagement/mode'], { queryParams: { setmode: 'login', setgame: idGame } });
  }
}
