import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';

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

  getBoard(nickname: string, token: string): Observable<any> {
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
          const userInfo = {
            idTablero: response.idTablero,
            player1: response.jugador1,
            player2: response.jugador2,
          };
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => new Error('Datos incorrectos'));
        })
      );
  }
}
