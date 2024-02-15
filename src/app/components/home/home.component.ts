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
    private usersService: UsersServiceService,
  ) {}

  idBoard!: number;
  errorPage: string = '';
  showError: boolean = false;

  loadGame(idBoard: number) {
    if (!this.idBoard) {
      this.showError = true;
      return;
    } else if (!this.usersService.isLogged()) {
      //Enviar a loguear si no ha iniciado sesion con el id de la partida
      this.router.navigate(['/userManagement/mode'], { queryParams: { setmode: 'login', setgame: idBoard } });
    }else{
      //Si esta logueado dejar ir la partida
       this.router.navigate(['/game', `${this.idBoard}`])
    }
    this.showError = false;
  }

  navigateToLogin(idBoard: number) {
    this.router.navigate(['/userManagement/mode'], { queryParams: { setmode: 'login', setgame: idBoard } });
  }
}
