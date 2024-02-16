import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiServiceService } from '../../services/api-service.service';
import { ShowPopUpServiceService } from '../../services/show-pop-up-service.service';

@Component({
  selector: 'app-home-game',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, CommonModule],
  templateUrl: './home-game.component.html',
  styleUrl: './home-game.component.css',
})
export class HomeGameComponent implements OnInit {
  @ViewChild('divPopUp') divPopUp: ElementRef | undefined;
  idBoard!: number;
  interval!: any;
  @Input()
  set setmode(value: number) {
    this.idBoard = value;
  }

  constructor(
    private router: Router,
    private apiService: ApiServiceService,
    private popupService: ShowPopUpServiceService
  ) {}

  ngOnInit(): void {
    this.checkAndCreateBoard();
    this.addPlayersBoard();
  }

  playGlobal: boolean = false;
  playPlayer1: boolean = false;
  playPlayer2: boolean = false;
  playPlayer3: boolean = false;
  playPlayer4: boolean = false;

  state: string = 'Esperando';
  stateReady: string = 'Listo';

  player1: string = 'Jugador-1';
  player2: string = 'Jugador-2';
  player3: string = 'Jugador-3';
  player4: string = 'Jugador-4';

  getStoredUserData(): {
    storedNickname: string | null;
    storedToken: string | null;
  } {
    const storedNickname = sessionStorage.getItem('nickname');
    const storedToken = sessionStorage.getItem('idToken');
    return { storedNickname, storedToken };
  }

  checkAndCreateBoard(): void {
    //Si no existe el id de la partida, crear y guardar el primer jugador
    if (this.idBoard === null || this.idBoard === undefined) {
      const { storedNickname, storedToken } = this.getStoredUserData();
      if (storedNickname && storedToken) {
        const token = JSON.parse(storedToken);
        this.apiService.createBoard(storedNickname, token.token).subscribe({
          next: (response) => {
            this.idBoard = response.idTablero;
            this.getStatusBoard(); //LLamar a guardar los nombres
          },
        });
      }
    } else {
      this.getStatusBoard(); //LLamar a guardar los nombres si existen
    }
  }

  addPlayersBoard() {
    //Si existe id partida guardar nuevos jugadores
    if (this.idBoard != null || this.idBoard != undefined) {
      const { storedNickname, storedToken } = this.getStoredUserData();
      if (storedNickname && storedToken) {
        const token = JSON.parse(storedToken);
        this.apiService
          .addPlayersBoard(storedNickname, this.idBoard, token.token)
          .subscribe({
            next: (response) => {
              if (response['ERROR '] === 'ERROR_ONLY_4_PLAYERS_IN_1_GAME') {
                //Enviarlo al inicio con datos vacios
                this.showPopUp('gameCompleted', '');
              }
            },
            error: (error) => {
              console.log('error guardando nuevo jugador ', error.message);
            },
          });
      }
    }
  }

  getStatusBoard() {
    if (this.idBoard != null || this.idBoard != undefined) {
      const { storedNickname, storedToken } = this.getStoredUserData();
      if (storedNickname && storedToken) {
        const token = JSON.parse(storedToken);

        const getStatus = () => {
          this.apiService.getStatusBoard(this.idBoard, token.token).subscribe({
            next: (response) => {
              console.log(response);

              this.player1 = response.Player_1;
              this.player2 = response.Player_2;
              this.player3 = response.Player_3;
              this.player4 = response.Player_4;
            },
          });
          this.loadPlayers(); //Guardar los nuevos nombres
        };

        getStatus();
        //this.interval = setInterval(getStatus, 2000); //Actualizar los datos para que se reflejen en los usuarios
      }
    }
  }

  loadPlayers() {
    this.playPlayer1 = this.player1 != 'Jugador-1';
    this.playPlayer2 = this.player2 != 'Jugador-2';
    this.playPlayer3 = this.player3 != 'Jugador-3';
    this.playPlayer4 = this.player4 != 'Jugador-4';

    if (this.player1 != 'Jugador-1' && this.player2 != 'Jugador-2') {
      this.playGlobal = true;
    }
  }

  loadGame() {
    if (this.idBoard != null || this.idBoard != undefined) {
      const { storedToken } = this.getStoredUserData();
      if (storedToken) {
        const token = JSON.parse(storedToken);
        this.apiService.startGameBoard(this.idBoard, token.token).subscribe({
          next: (response) => {
            clearInterval(this.interval);//Parar de ejecutar el codigo anterior
             this.router.navigate(['/board', `${this.idBoard}`])
          },
          error: (error) => {
            console.log('error iniciando el juego ', error.message);
          },
        });
      }
    }
  }

  mostrarNotificacion: boolean = false;
  copiarAlPortapapeles(idBoard: string) {
    let texto = document.getElementById(idBoard)!.innerText;
    navigator.clipboard.writeText(texto).then(() => {
      this.mostrarNotificacion = true;
      setTimeout(() => (this.mostrarNotificacion = false), 2000); // Oculta la notificación después de 2 segundos
    });
  }

  showPopUp(type: string, ruta: string) {
    this.divPopUp!.nativeElement.appendChild(this.popupService.popup(type));
    this.popupService.showPopup();
    this.popupService.onClosePopup.subscribe(() => {
      //Ejecutar solamente si no ha pasado id game
      this.router.navigate([ruta]);
    });
  }
}
