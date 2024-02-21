import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { UsersServiceService } from '../../services/users.service.service';

@Component({
  selector: 'app-stats-player',
  standalone: true,
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './stats-player.component.html',
  styleUrl: './stats-player.component.css',
})
export class StatsPlayerComponent {
  constructor(private userService: UsersServiceService) {
    this.getStatsPlayer();
  }

  getStoredUserData(): {
    storedNickname: string | null;
    storedToken: string | null;
  } {
    const storedNickname = localStorage.getItem('nickname');
    const storedToken = localStorage.getItem('idToken');
    return { storedNickname, storedToken };
  }

  id?: string;
  acertadas?: string;
  falladas?: string;
  totales?: string;
  nickname?: string;


  getStatsPlayer() {
    const { storedNickname, storedToken } = this.getStoredUserData();
    if (storedNickname && storedToken) {
      const token = JSON.parse(storedToken);

      this.userService.getStatsPlayer(storedNickname, token.token).subscribe({
        next: (response) => {
          console.log(response);
          (this.nickname=storedNickname),
          (this.id = response.ID),
            (this.acertadas = response.PreguntasAcertadas),
            (this.falladas = response.PreguntasFalladas),
            (this.totales = response.PreguntasTotales);
        },
      });
    }
  }
}
