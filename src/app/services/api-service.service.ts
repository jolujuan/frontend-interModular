import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, catchError, tap, throwError } from 'rxjs';
import { StatusBoard } from '../../interfaces/statusBoard';

@Injectable({
  providedIn: 'root',
})
export class ApiServiceService {
  constructor(private http: HttpClient) {}

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

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
          console.log(error);

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
      .post<any>(
        `http://localhost:8090/api/v1/startGame/${idTablero}`,
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
}
