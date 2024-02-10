import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { MainComponent } from '../main/main.component';
import { FooterComponent } from '../footer/footer.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, FormsModule, CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {

  constructor(private router: Router){}

  idGame!: string;
  errorPage: string = '';
  showError: boolean = false;

  loadGame(idGame: string) {
    if (!this.idGame) {
      console.log('entra');
      this.showError = true;

      return;
    } else {
    }
    this.showError = false;
  }

  navigateToLogin() {
    this.router.navigate(['/userManagement', 'login']);

  }
}
