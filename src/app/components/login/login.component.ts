import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ShowPopUpServiceService } from '../../services/show-pop-up-service.service';
import { UsersServiceService } from '../../services/users.service.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  @ViewChild('divPopUp') divPopUp: ElementRef | undefined;

  constructor(
    private router: Router,
    private usersService: UsersServiceService,
    private popupService: ShowPopUpServiceService
  ) {}
  mode: string = 'login';

  @Input()
  set setmode(value: string) {
    this.error = '';
    this.mode = value;
    if (value === 'logout') {
      this.usersService.logout();
      localStorage.clear(); //guardo el uid del usuario
      this.router.navigate(['userManagement', 'login']);
    }
  }

  email: string = '';
  password: string = '';
  error: string = '';

  async login() {
    if (!this.email || !this.password) {
      this.error = '❗Los campos no pueden estar vacios.';
      return;
    } else {
      let logged = await this.usersService.login(this.email, this.password);
       if (logged.success) this.router.navigate(['artworks']);
      else this.error = logged.message; 
    }
  }

  async register() {
    if (!this.email || !this.password) {
      this.error = '❗Los campos no pueden estar vacios.';
      return;
    } else {
      let logged = await this.usersService.register(this.email, this.password);
      if (logged.success) this.showPopUp('register', 'userManagement/login');
      else this.error = logged.message;
    }
  }

  showPopUp(type: string, ruta: string) {
    this.divPopUp!.nativeElement.appendChild(this.popupService.popup(type));
    this.popupService.showPopup();
    this.popupService.onClosePopup.subscribe(() => {
      this.router.navigate([ruta]);
    });
  }
}
