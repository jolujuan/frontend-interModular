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
    this.errorPage = '';
    this.mode = value;
    if (value === 'logout') {
      /* this.usersService.logout(); */
      sessionStorage.clear(); 

      this.router.navigate(['home']);
    }
  }

  name: string = '';
  nickname: string = '';
  email: string = '';
  password: string = '';
  errorPage: string = '';

  async register() {
    if (!this.nickname || !this.password) {
      this.errorPage = '❗Los campos no pueden estar vacios.';
      return;
    } else {      
      this.usersService
        .register(this.name, this.nickname, this.email, this.password)
        .subscribe({
          next: (response) => {
            this.showPopUp('register', 'userManagement/login');
          },
          error: (error) => {
            this.errorPage = error.message;
          },
        });
    }
  }

  async login() {
    if (!this.nickname || !this.password) {
      this.errorPage = '❗Los campos no pueden estar vacios.';
      return;
    } else {
      this.usersService.login(this.nickname, this.password).subscribe({
        next: (response) => {
          this.router.navigate(['artworks']);
        },
        error: (error) => {
          this.errorPage = error.message;
        },
      });
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
