import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiServiceService } from '../../services/api-service.service';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css',
  encapsulation: ViewEncapsulation.None, // Desactiva el encapsulamiento de estilos
})
export class BoardComponent implements OnInit {
  idBoard!: number;
  interval!: any;

  players: string[] = [];
  playerStyles: { bottom: string; right: string; backgroundColor: string }[] = [
    { bottom: '55px', right: '80px', backgroundColor: 'blue' },
    { bottom: '15px', right: '25px', backgroundColor: 'green' },
    { bottom: '15px', right: '80px', backgroundColor: 'red' },
    { bottom: '55px', right: '25px', backgroundColor: 'yellow' },
  ];

  player1!: string;
  player2!: string;
  player3!: string;
  player4!: string;

  classPlayer1!: string;
  classPlayer2!: string;
  classPlayer3!: string;
  classPlayer4!: string;

  answer1!: string;
  answer2!: string;
  answer3!: string;
  answer4!: string;
  question!: string;
  idQuestion!: number;

  categoyQuestion!: string;
  showQuestion: boolean = false;
  isButtonDisabled: boolean = false;

  @Input()
  set setgame(value: number) {
    this.idBoard = value;
  }
  constructor(
    private apiService: ApiServiceService,
    private route: ActivatedRoute,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.idBoard = +params['setgame'];
    });
    //Empezar a leer los jugadores de la base
    this.getStatusBoard();
  }

  getStoredUserData(): {
    storedNickname: string | null;
    storedToken: string | null;
  } {
    const storedNickname = sessionStorage.getItem('nickname');
    const storedToken = sessionStorage.getItem('idToken');
    return { storedNickname, storedToken };
  }

  getStatusBoard() {
    if (this.idBoard != null || this.idBoard != undefined) {
      /* const { storedNickname, storedToken } = this.getStoredUserData();
      if (storedNickname && storedToken) {
         const token = JSON.parse(storedToken); */

      const token =
        'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJqb3NlbHUiLCJpYXQiOjE3MDgxMjI1MzEsImV4cCI6MTcwODE1ODUzMX0.aL2kHGrJ_ZjvCCNpPX8yWEdy6zYdCZ-28JWhnuCJyM0';
      this.apiService.getStatusBoard(this.idBoard, token).subscribe({
        next: (response) => {
          //Evitar guardar en el array si no hay jugador
          this.players = [];

          if (response.Player_1 !== 'Jugador-1') {
            this.players.push(response.Player_1);
          }
          if (response.Player_2 !== 'Jugador-2') {
            this.players.push(response.Player_2);
          }

          if (response.Player_3 !== 'Jugador-3') {
            this.players.push(response.Player_3);
          }

          if (response.Player_4 !== 'Jugador-4') {
            this.players.push(response.Player_4);
          }
          //Inicializar el tablero una vez generados los jugadores
          this.createBoard();
        },
      });
      /* } */
    }
  }

  getQuestions(category: string) {
    if (this.idBoard != null || this.idBoard != undefined) {
      /* const { storedNickname, storedToken } = this.getStoredUserData();
      if (storedNickname && storedToken) {
         const token = JSON.parse(storedToken); */

      const token =
        'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJqb3NlbHUiLCJpYXQiOjE3MDgxMjI1MzEsImV4cCI6MTcwODE1ODUzMX0.aL2kHGrJ_ZjvCCNpPX8yWEdy6zYdCZ-28JWhnuCJyM0';
      this.apiService.getQuestion(category, this.idBoard, token).subscribe({
        next: (response) => {
          this.question = response.question;
          this.idQuestion = response.idQuestion;
          this.answer1 = response.answer1;
          this.answer2 = response.answer2;
          this.answer3 = response.answer3;
          this.answer4 = response.answer4;
        },
      });
      (document.querySelector('.tablero') as HTMLElement)!.style.opacity =
        '0.5';
      this.categoyQuestion = category;
      this.showQuestion = true;
      this.isButtonDisabled = true;
      /* } */
    }
  }

  selectedAnswer: string | null = null;

  selectAnswer(answer: string) {
    this.selectedAnswer = answer;
  }
  correctAnswer: boolean = false;
  showCorrectAnswer: boolean = false;
  sendAnswer() {
    if (this.selectedAnswer) {
      console.log('Respuesta enviada:', this.selectedAnswer);

      if (this.idBoard != null || this.idBoard != undefined) {
        // const { storedNickname, storedToken } = this.getStoredUserData();
        //if (storedNickname && storedToken) {
        // const token = JSON.parse(storedToken);

        const token =
          'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJqb3NlbHUiLCJpYXQiOjE3MDgxMjAzNTksImV4cCI6MTcwODE1NjM1OX0.BPqjQbHrvffQeaLX_nsdsvGPYox0KvnMOfAz649_oRU';
        console.log(
          this.selectedAnswer,
          this.idQuestion,
          this.idBoard,
          this.players[this.currentPlayerIndex],
          token
        );

        this.apiService
          .checkQuestion(
            this.selectedAnswer,
            this.idQuestion,
            this.idBoard,
            this.players[this.currentPlayerIndex],
            token
          )
          .subscribe({
            next: (response) => {
              //Convertilo a boleano
              this.correctAnswer = response.Result === 'true';

              if (this.correctAnswer) {
                this.showQuestion = false; //Cerrar las preguntas si es correcta
              }else {
                this.correctAnswer = false;
                this.showCorrectAnswer = true;
                setTimeout(() => {
                  //Esperar 6 segundos antes de quitar el aviso de que ha introducido una respuesta incorrecta
                  this.showQuestion = false;
                }, 4000);
              }
            },
          });
          this.isButtonDisabled = false; //Activar de nuevo los botones
          //Restablecer la opacidad del tablero
          (document.querySelector(
            '.tablero'
          ) as HTMLElement)!.style.opacity = '1';

        // }
      }
    }
  }

  currentPlayerIndex: number = 0;
  contador1: number = 1;
  contador2: number = 1;
  contador3: number = 1;
  contador4: number = 1;

  createBoard() {
    const board = document.getElementById('board');
    const numbers = [
      '¡Qué Burro Soy!',
      null,
      'Coz del Burro Retrocede 3 Casillas',
      null,
      'Burro Sabelotodo',
      null,
      null,
      null,
      null,
      null,
      'Burro Sabelotodo',
      null,
      null,
      null,
      '¡Qué Burro Soy!',
      null,
      null,
      null,
      null,
      null,
      'Salida',
      null,
      'Qué Burro Soy',
      null,
      'Coz del Burro Retrocede 3 Casillas',
    ];

    for (let i = 0; i < numbers.length; i++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.textContent = numbers[i] !== null ? numbers[i] : '';
      if (i === 12) {
        const img = document.createElement('img');
        img.src = 'https://i.postimg.cc/85P0jK5M/burro-Culote.png';
        cell.appendChild(img);
      }
      if (i === 20) {
        console.log(this.players);

        for (let j = 0; j < this.players.length; j++) {
          // Crear fichas para cada jugador
          const playerToken = document.createElement('div');
          playerToken.classList.add('player-token', `${this.players[j]}-token`);
          cell.appendChild(playerToken);

          //Guardar para cada casilla las propiedades del objeto
          const style = this.playerStyles[j % this.playerStyles.length];
          playerToken.style.bottom = style.bottom;
          playerToken.style.right = style.right;
          playerToken.style.backgroundColor = style.backgroundColor;

          //Guardar las clases de los jugadores para realizar los movimientos
          this.classPlayer1 = `${this.players[0]}-token`;
          this.classPlayer2 = `${this.players[1]}-token`;
          this.classPlayer3 = `${this.players[2]}-token`;
          this.classPlayer4 = `${this.players[3]}-token`;
        }
      }
      board!.appendChild(cell);
    }
  }

  rollNum() {
    const resultElement = document.getElementById('diceResult');
    const diceResult = Math.ceil(Math.random() * 4);
    resultElement!.textContent = `Resultado del dado: ${diceResult}`;
    const currentPlayerToken = document.querySelector(
      `.${this.players[this.currentPlayerIndex]}-token`
    );

    let contadorTurno = 0;
    //Solo realizar el movimiento si la pregunta es correcta    
    if (this.correctAnswer)
      this.moveTokenRecursively(currentPlayerToken, diceResult, contadorTurno);

    this.currentPlayerIndex =
      (this.currentPlayerIndex + 1) % this.players.length;

    this.correctAnswer = false;
  }

  rollColor() {
    const resultElement = document.getElementById('diceResultColor');
    const colors = ['green', 'blue', 'orange', 'red'];
    const diceResult = Math.ceil(Math.random() * 4);
    const colorAleatorio = colors[diceResult - 1];
    resultElement!.textContent = `Resultado del color: ${colorAleatorio}`;

    let category = '';
    switch (colorAleatorio) {
      case 'green':
        category = 'geography';
        break;
      case 'orange':
        category = 'celebrity';
        break;
      case 'blue':
        category = 'animals';
        break;
      case 'red':
        category = 'history';
        break;
      default:
        break;
    }

    this.correctAnswer = false; //Reiniciar
    this.showCorrectAnswer = false; //Ocultar respuesta incorrecta
    this.getQuestions(category); //Empezar a obtener las preguntas
  }

  moveTokenRecursively(token: any, diceResult: number, contadorTurno: number) {
    const currentPositionBottom = parseInt(
      window
        .getComputedStyle(token)
        .getPropertyValue('bottom')
        .replace('px', '')
    );
    const currentPositionRight = parseInt(
      window.getComputedStyle(token).getPropertyValue('right').replace('px', '')
    );
    const stepsY = 100 + 10;
    const stepsX = 125 + 10;

    let destinationYUp = currentPositionBottom + stepsY;
    let destinationXRight = currentPositionRight - stepsX;
    let destinationYDown = currentPositionBottom - stepsY;
    let destinationXLeft = currentPositionRight + stepsX;

    if (token.classList.contains(this.classPlayer1)) {
      if (this.contador1 + (diceResult - contadorTurno) < 18) {
        if (this.contador1 >= 5 && this.contador1 < 9) {
          // Derecha
          token.style.right = `${destinationXRight}px`;
        } else if (this.contador1 >= 9 && this.contador1 < 13) {
          // Abajo
          token.style.bottom = `${destinationYDown}px`;
        } else if (this.contador1 >= 13 && this.contador1 < 15) {
          // Izquierda
          token.style.right = `${destinationXLeft}px`;
        } else if (this.contador1 >= 15 && this.contador1 < 18) {
          console.log('Final: ' + this.contador1);
          // Arriba (final)
          token.style.bottom = `${destinationYUp}px`;
        } else if (this.contador1 < 5) {
          // Arriba (inicio)
          token.style.bottom = `${destinationYUp}px`;
        }
        this.contador1++;
      } else {
        alert('Te has Pasado');
        contadorTurno = diceResult;
      }
    } else if (token.classList.contains(this.classPlayer2)) {
      if (this.contador2 + (diceResult - contadorTurno) < 18) {
        if (this.contador2 >= 5 && this.contador2 < 9) {
          // Derecha
          token.style.right = `${destinationXRight}px`;
        } else if (this.contador2 >= 9 && this.contador2 < 13) {
          // Abajo
          token.style.bottom = `${destinationYDown}px`;
        } else if (this.contador2 >= 13 && this.contador2 < 15) {
          // Izquierda
          token.style.right = `${destinationXLeft}px`;
        } else if (this.contador2 >= 15 && this.contador2 < 18) {
          console.log('Final: ' + this.contador2);
          // Arriba (final)
          token.style.bottom = `${destinationYUp}px`;
        } else if (this.contador2 < 5) {
          // Arriba (inicio)
          token.style.bottom = `${destinationYUp}px`;
        }
        this.contador2++;
      } else {
        alert('Te has Pasado');
        contadorTurno = diceResult;
      }
    } else if (token.classList.contains(this.classPlayer3)) {
      if (this.contador3 + (diceResult - contadorTurno) < 18) {
        if (this.contador3 >= 5 && this.contador3 < 9) {
          // Derecha
          token.style.right = `${destinationXRight}px`;
        } else if (this.contador3 >= 9 && this.contador3 < 13) {
          // Abajo
          token.style.bottom = `${destinationYDown}px`;
        } else if (this.contador3 >= 13 && this.contador3 < 15) {
          // Izquierda
          token.style.right = `${destinationXLeft}px`;
        } else if (this.contador3 >= 15 && this.contador3 < 18) {
          console.log('Final: ' + this.contador3);
          // Arriba (final)
          token.style.bottom = `${destinationYUp}px`;
        } else if (this.contador3 < 5) {
          // Arriba (inicio)
          token.style.bottom = `${destinationYUp}px`;
        }
        this.contador3++;
      } else {
        alert('Te has Pasado');
        contadorTurno = diceResult;
      }
    } else if (token.classList.contains(this.classPlayer4)) {
      if (this.contador4 + (diceResult - contadorTurno) < 18) {
        if (this.contador4 >= 5 && this.contador4 < 9) {
          // Derecha
          token.style.right = `${destinationXRight}px`;
        } else if (this.contador4 >= 9 && this.contador4 < 13) {
          // Abajo
          token.style.bottom = `${destinationYDown}px`;
        } else if (this.contador4 >= 13 && this.contador4 < 15) {
          // Izquierda
          token.style.right = `${destinationXLeft}px`;
        } else if (this.contador4 >= 15 && this.contador4 < 18) {
          console.log('Final: ' + this.contador4);
          // Arriba (final)
          token.style.bottom = `${destinationYUp}px`;
        } else if (this.contador4 < 5) {
          // Arriba (inicio)
          token.style.bottom = `${destinationYUp}px`;
        }
        this.contador4++;
      } else {
        alert('Te has Pasado');
        contadorTurno = diceResult;
      }
    }
    contadorTurno++;

    //Casilla Retroceder 3 Casillas
    if (contadorTurno == diceResult) {
      let contadorBack = 0;
      if (this.contador1 === 7) {
        this.back7TokenRecursively(token, 3, contadorBack);
        contadorTurno = diceResult;
      } else if (this.contador2 === 7) {
        this.back7TokenRecursively(token, 3, contadorBack);
        contadorTurno = diceResult;
      } else if (this.contador3 === 7) {
        this.back7TokenRecursively(token, 3, contadorBack);
        contadorTurno = diceResult;
      } else if (this.contador4 === 7) {
        this.back7TokenRecursively(token, 3, contadorBack);
        contadorTurno = diceResult;
      }
      if (this.contador1 === 13) {
        this.back13TokenRecursively(token, 2, contadorBack);
        contadorTurno = diceResult;
      } else if (this.contador2 === 13) {
        this.back13TokenRecursively(token, 2, contadorBack);
        contadorTurno = diceResult;
      } else if (this.contador3 === 13) {
        this.back13TokenRecursively(token, 2, contadorBack);
        contadorTurno = diceResult;
      } else if (this.contador4 === 13) {
        this.back13TokenRecursively(token, 2, contadorBack);
        contadorTurno = diceResult;
      }
    }

    if (
      contadorTurno < diceResult &&
      this.contador1 != 18 &&
      this.contador2 != 18 &&
      this.contador3 != 18 &&
      this.contador4 != 18
    ) {
      setTimeout(() => {
        this.moveTokenRecursively(token, diceResult, contadorTurno);
      }, 500);
    }
    if (
      this.contador1 == 17 ||
      this.contador2 == 17 ||
      this.contador3 == 17 ||
      this.contador4 == 17
    ) {
      this.checkWinner();
    }
  }

  back7TokenRecursively(token: any, diceResult: number, contadorBack: number) {
    const currentPositionBottom = parseInt(
      window
        .getComputedStyle(token)
        .getPropertyValue('bottom')
        .replace('px', '')
    );
    const currentPositionRight = parseInt(
      window.getComputedStyle(token).getPropertyValue('right').replace('px', '')
    );
    const stepsY = 100 + 10;
    const stepsX = 125 + 10;

    let destinationYDown = currentPositionBottom - stepsY;
    let destinationXLeft = currentPositionRight + stepsX;

    if (token.classList.contains(this.classPlayer1)) {
      if (this.contador1 > 6 && this.contador1 < 9) {
        token.style.right = `${destinationXLeft}px`;
      } else if (this.contador1 <= 5) {
        token.style.bottom = `${destinationYDown}px`;
      }
      this.contador1--;
    } else if (token.classList.contains(this.classPlayer2)) {
      if (this.contador2 > 6 && this.contador2 < 9) {
        token.style.right = `${destinationXLeft}px`;
      } else if (this.contador2 <= 5) {
        token.style.bottom = `${destinationYDown}px`;
      }
      this.contador2--;
    } else if (token.classList.contains(this.classPlayer3)) {
      if (this.contador3 > 6 && this.contador3 < 9) {
        token.style.right = `${destinationXLeft}px`;
      } else if (this.contador3 <= 5) {
        token.style.bottom = `${destinationYDown}px`;
      }
      this.contador3--;
    } else if (token.classList.contains(this.classPlayer4)) {
      if (this.contador4 > 6 && this.contador4 < 9) {
        token.style.right = `${destinationXLeft}px`;
      } else if (this.contador4 <= 5) {
        token.style.bottom = `${destinationYDown}px`;
      }
      this.contador4--;
    }
    contadorBack++;
    if (
      contadorBack < diceResult &&
      this.contador1 != 18 &&
      this.contador2 != 18 &&
      this.contador3 != 18 &&
      this.contador4 != 18
    ) {
      setTimeout(() => {
        this.back7TokenRecursively(token, diceResult, contadorBack);
      }, 500);
    }
  }

  back13TokenRecursively(token: any, diceResult: number, contadorBack: number) {
    const currentPositionBottom = parseInt(
      window
        .getComputedStyle(token)
        .getPropertyValue('bottom')
        .replace('px', '')
    );
    const currentPositionRight = parseInt(
      window.getComputedStyle(token).getPropertyValue('right').replace('px', '')
    );
    const stepsY = 80 + 10;

    let destinationYUp = currentPositionBottom + stepsY;

    if (token.classList.contains(this.classPlayer1)) {
      token.style.bottom = `${destinationYUp}px`;
      this.contador1--;
    } else if (token.classList.contains(this.classPlayer2)) {
      token.style.bottom = `${destinationYUp}px`;
      this.contador2--;
    } else if (token.classList.contains(this.classPlayer3)) {
      token.style.bottom = `${destinationYUp}px`;
      this.contador3--;
    } else if (token.classList.contains(this.classPlayer4)) {
      token.style.bottom = `${destinationYUp}px`;
      this.contador4--;
    }
    contadorBack++;
    if (contadorBack == diceResult) {
      if (token.classList.contains(this.classPlayer1)) {
        this.contador1--;
      } else if (token.classList.contains(this.classPlayer2)) {
        this.contador2--;
      } else if (token.classList.contains(this.classPlayer3)) {
        this.contador3--;
      } else if (token.classList.contains(this.classPlayer4)) {
        this.contador4--;
      }
    }
    if (
      contadorBack < diceResult &&
      this.contador1 != 18 &&
      this.contador2 != 18 &&
      this.contador3 != 18 &&
      this.contador4 != 18
    ) {
      setTimeout(() => {
        this.back13TokenRecursively(token, diceResult, contadorBack);
      }, 500);
    }
  }

  disableRollDiceButton() {
    const rollDiceButton = document.querySelector('button');
    rollDiceButton!.disabled = true;
  }

  checkWinner() {
    if (this.contador2 >= 17) {
      alert('¡El Jugador 2 ha ganado!');
      this.disableRollDiceButton();
      return;
    }
    if (this.contador1 >= 17) {
      alert('¡El Jugador 1 ha ganado!');
      this.disableRollDiceButton();
      return;
    }
    if (this.contador3 >= 17) {
      alert('¡El Jugador 1 ha ganado!');
      this.disableRollDiceButton();
      return;
    }
    if (this.contador4 >= 17) {
      alert('¡El Jugador 1 ha ganado!');
      this.disableRollDiceButton();
      return;
    }
  }
}
