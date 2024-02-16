import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css',
  encapsulation: ViewEncapsulation.None, // Desactiva el encapsulamiento de estilos
})
export class BoardComponent {
  idBoard!: number;
  interval!: any;
  @Input()
  set setgame(value: number) {
    this.idBoard = value;
  }
  ngAfterViewInit(): void {
    this.createBoard();
  }

   players = ['player1', 'player2','player3','player4'];
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
        for (let j = 0; j < this.players.length; j++) {
          // Crear fichas para cada jugador
          const playerToken = document.createElement('div');
          playerToken.classList.add('player-token', `${this.players[j]}-token`);
          cell.appendChild(playerToken);
        }
      }
      board!.appendChild(cell);
    }
  }

  rollNum() {
    console.log("entra");
    
    const resultElement = document.getElementById('diceResult');
    const diceResult = Math.ceil(Math.random() * 4);
    resultElement!.textContent = `Resultado del dado: ${diceResult}`;
    const currentPlayerToken = document.querySelector(
      `.${this.players[this.currentPlayerIndex]}-token`
    );
    let contadorTurno = 0;
    this.moveTokenRecursively(currentPlayerToken, diceResult, contadorTurno);

    this.currentPlayerIndex =
      (this.currentPlayerIndex + 1) % this.players.length;
  }

  rollColor() {
    const resultElement = document.getElementById('diceResult');
    const colors=[];
    const diceResult = Math.ceil(Math.random() * 4);
    resultElement!.textContent = `Resultado del color: ${diceResult}`;
    
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

    if (
      this.contador1 + (diceResult - contadorTurno) < 18 ||
      this.contador2 + (diceResult - contadorTurno) < 18 ||
      this.contador3 + (diceResult - contadorTurno) < 18 ||
      this.contador4 + (diceResult - contadorTurno) < 18
    ) {
      if (token.classList.contains('player1-token')) {
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
      } else if (token.classList.contains('player2-token')) {
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
      } else if (token.classList.contains('player3-token')) {
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
      } else if (token.classList.contains('player4-token')) {
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
      }
    } else {
      contadorTurno = diceResult;
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

    if (token.classList.contains('player1-token')) {
      if (this.contador1 > 6 && this.contador1 < 9) {
        token.style.right = `${destinationXLeft}px`;
      } else if (this.contador1 <= 5) {
        token.style.bottom = `${destinationYDown}px`;
      }
      this.contador1--;
    } else if (token.classList.contains('player2-token')) {
      if (this.contador2 > 6 && this.contador2 < 9) {
        token.style.right = `${destinationXLeft}px`;
      } else if (this.contador2 <= 5) {
        token.style.bottom = `${destinationYDown}px`;
      }
      this.contador2--;
    } else if (token.classList.contains('player3-token')) {
      if (this.contador3 > 6 && this.contador3 < 9) {
        token.style.right = `${destinationXLeft}px`;
      } else if (this.contador3 <= 5) {
        token.style.bottom = `${destinationYDown}px`;
      }
      this.contador3--;
    } else if (token.classList.contains('player4-token')) {
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

    if (token.classList.contains('player1-token')) {
      token.style.bottom = `${destinationYUp}px`;
      this.contador1--;
    } else if (token.classList.contains('player2-token')) {
      token.style.bottom = `${destinationYUp}px`;
      this.contador2--;
    } else if (token.classList.contains('player3-token')) {
      token.style.bottom = `${destinationYUp}px`;
      this.contador3--;
    } else if (token.classList.contains('player4-token')) {
      token.style.bottom = `${destinationYUp}px`;
      this.contador4--;
    }
    contadorBack++;
    if (contadorBack == diceResult) {
      if (token.classList.contains('player1-token')) {
        this.contador1--;
      } else if (token.classList.contains('player2-token')) {
        this.contador2--;
      } else if (token.classList.contains('player3-token')) {
        this.contador3--;
      } else if (token.classList.contains('player4-token')) {
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
