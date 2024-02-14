import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, catchError, tap, throwError } from 'rxjs';

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
          console.log('response ', response);

          const boardInfo = response.idTablero;
          this.boardSubject.next(boardInfo);
        }),
        catchError((error: HttpErrorResponse) => {
          console.log(error);

          return throwError(() => new Error('Datos incorrectos'));
        })
      );
  }
}
