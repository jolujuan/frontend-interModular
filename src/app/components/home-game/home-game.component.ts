import { Component, Input, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiServiceService } from '../../services/api-service.service';

@Component({
  selector: 'app-home-game',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, CommonModule],
  templateUrl: './home-game.component.html',
  styleUrl: './home-game.component.css',
})
export class HomeGameComponent implements OnInit {
  idGame!: number;
  @Input()
  set setmode(value: number) {
    this.idGame = value;
  }

  constructor(private router: Router, private apiService: ApiServiceService) {}

  ngOnInit(): void {
    if (this.idGame != null || this.idGame != undefined) {
      const nickname = sessionStorage.getItem('nickname');
      const storedToken = sessionStorage.getItem('idToken');

      if (nickname != null && storedToken != null) {
        const token = JSON.parse(storedToken); //Realizar la conversion a objeto

        this.apiService.createBoard(nickname, token.token).subscribe({
          next: (response)=>{
            console.log("resuesta recivida al front")
          }
        });
      }
    }
    this.loadPlayers();
  }

  playGlobal: boolean = true;
  playPlayer1: boolean = false;
  playPlayer2: boolean = false;
  playPlayer3: boolean = false;
  playPlayer4: boolean = false;

  state: string = 'Esperando';
  stateReady: string = 'Listo';

  player1: string = 'Jugador 1';
  player2: string = 'Jugador 2';
  player3: string = 'Jugador 3';
  player4: string = 'Jugador 4';

  mostrarNotificacion: boolean = false;
  copiarAlPortapapeles(idGame: string) {
    let texto = document.getElementById(idGame)!.innerText;
    navigator.clipboard.writeText(texto).then(() => {
      this.mostrarNotificacion = true;
      setTimeout(() => (this.mostrarNotificacion = false), 2000); // Oculta la notificación después de 2 segundos
    });
  }

  loadPlayers() {
    this.playPlayer1 = this.player1 != 'Jugador 1';
    this.playPlayer2 = this.player2 != 'Jugador 2';
    this.playPlayer3 = this.player3 != 'Jugador 3';
    this.playPlayer4 = this.player4 != 'Jugador 4';

    if (this.player1 != 'Jugador 1' && this.player2 != 'Jugador 2') {
      this.playGlobal = true;
    }
  }

  loadGame() {
    this.router.navigate(['/board']);
  }
}
