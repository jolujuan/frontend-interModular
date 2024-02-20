import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UsersServiceService } from '../../services/users.service.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent {
  currentYear: number = new Date().getFullYear();
  isLoggedUser: boolean = false;

  constructor(private usersService: UsersServiceService) {
    this.isLoggedUser = this.usersService.isLogged();

  }
}
