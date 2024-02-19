import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, catchError, tap, throwError } from 'rxjs';
import { StatusBoard } from '../../interfaces/statusBoard';
import { QuestionBoard } from '../../interfaces/questionBoard';

@Injectable({
  providedIn: 'root',
})
export class ApiServiceService {
  constructor(private http: HttpClient) {}

  boardSubject = new Subject<string>();
  createBoard(nickname: string, token: string): Observable<any> {
    let datos = { returnSecureToken: true };

    return this.http
      .post<any>(
        `http://localhost:8090/api/v1/createBoard/${nickname}`,
        datos,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .pipe(
        tap((response) => {
          const boardInfo = response.idTablero;
          this.boardSubject.next(boardInfo);
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => new Error('Datos incorrectos'));
        })
      );
  }

  addPlayersBoard(
    nickname: string,
    idTablero: number,
    token: string
  ): Observable<any> {
    let datos = { returnSecureToken: true };

    return this.http
      .post<any>(
        `http://localhost:8090/api/v1/addPlayer/name/${nickname}/table/${idTablero}`,
        datos,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => new Error('Datos incorrectos'));
        })
      );
  }

  statusBoardSubject = new Subject<StatusBoard>();
  getStatusBoard(idTablero: number, token: string): Observable<any> {
    return this.http
      .get<any>(`http://localhost:8090/api/v1/getStatusBoard/${idTablero}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .pipe(
        tap((response) => {
          const statusInfo = {
            player1: response.Player_1,
            player2: response.Player_2,
            player3: response.Player_3,
            player4: response.Player_4,
          };
          this.statusBoardSubject.next(statusInfo);
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => new Error('Datos incorrectos'));
        })
      );
  }

  startGameBoard(idTablero: number, token: string): Observable<any> {
    let datos = { returnSecureToken: true };

    return this.http
      .post<any>(`http://localhost:8090/api/v1/startGame/${idTablero}`, datos, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => new Error('Datos incorrectos'));
        })
      );
  }

  /* EMPIEZA A PEDIR LAS PREGUNTAS */

   questionSubject = new BehaviorSubject<QuestionBoard | null>(null);
  getQuestion(
    category: string,
    idTablero: number,
    token: string
  ): Observable<any> {
    let datos = { returnSecureToken: true };

    return this.http
      .get<any>(
        `http://localhost:8090/api/v1/questions/category/${category}/table/${idTablero}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .pipe(
        tap((response) => {          
          const questionInfo = {
            question: response.question,
            idQuestion: response.idQuestion,
            answer1: response.answer1,
            answer2: response.answer2,
            answer3: response.answer3,
            answer4: response.answer4,
          };

          this.questionSubject.next(questionInfo);
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => new Error('Datos incorrectos'));
        })
      );
  }

  /* COMPROBAR SI LA PREGUNTA ES CORRECTA */

  checkQuestionSubject = new Subject<string>();
  checkQuestion(
    answer: string,
    idQuestion: number,
    idBoard: number,
    nickname: string,
    token: string
  ): Observable<any> {
    let datos = { returnSecureToken: true };
    return this.http
      .get<any>(
        `http://localhost:8090/api/v1/questions/answer?resultsCorrectAnswer=${answer}&idPregunta=${idQuestion}&idTable=${idBoard}&nickname=${nickname}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .pipe(
        tap((response) => {                    
          const answerInfo = response.Result;
          this.checkQuestionSubject.next(answerInfo);
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => new Error('Datos incorrectos'));
        })
      );
  }

  /* REALIZAR MOVIMIENTO */
  doMovementSubject = new Subject<string>();
  doMovement(
    nickname: string,
    movement: number,
    idBoard: number,
    token: string
  ): Observable<any> {
    let datos = { returnSecureToken: true };
    return this.http
      .post<any>(
        `http://localhost:8090/api/v1/movePlayer/${nickname}/number/${movement}/table/${idBoard}`,
        datos,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .pipe(
        tap((response) => {                    
          const answerInfo = response.TipoCasilla;
          this.doMovementSubject.next(answerInfo);
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => new Error('Datos incorrectos'));
        })
      );
  }

  /* COMPROBAR MOVIMIENTO */
  /* POST http://localhost:8090/api/v1/checkMovement/NORMAL/player/joselu/table/1  HTTP/1.1
 */

  checkMovement(
    type: string,
    nickname: string,
    idBoard: number,
    token: string
  ): Observable<any> {
    let datos = { returnSecureToken: true };
    return this.http
      .post<any>(
        `http://localhost:8090/api/v1/checkMovement/${type}/player/${nickname}/table/${idBoard}`,
        datos,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .pipe(
        tap((response) => {                    
          console.log(response);
          
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => new Error('Datos incorrectos'));
        })
      );
  }
}
