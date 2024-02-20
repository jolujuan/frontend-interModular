import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { UsersServiceService } from '../../services/users.service.service';

@Component({
  selector: 'app-header',
  standalone: true,
  /* asi aniran les routes
  routerLink y routerlinkactive */
  imports: [RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  filter: string = '';
  isLoggedUser: boolean = false;

  constructor(private usersService: UsersServiceService) {
    this.isLoggedUser = this.usersService.isLogged();

    console.log("Sesión activa? ",this.isLoggedUser);
  }

  
}
