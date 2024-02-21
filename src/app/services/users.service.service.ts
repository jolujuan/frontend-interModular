import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  Subject,
  catchError,
  tap,
  throwError,
} from 'rxjs';
import { User } from '../../interfaces/user';
import { statsPlayer } from '../../interfaces/statsPlayer';

@Injectable({
  providedIn: 'root',
})
export class UsersServiceService {
  constructor(private http: HttpClient) {}

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  userSubject = new Subject<User>();

  logged = new BehaviorSubject<boolean>(false);

  register(
    nombre: string,
    nickname: string,
    email: string,
    password: string
  ): Observable<any> {
    let datos = { nombre, nickname, email, password, returnSecureToken: true };
    return this.http
      .post<any>(
        'http://localhost:8090/auth/nuevo',
        datos, //Angular maneja el JSON.stringify internamente
        this.httpOptions
      )
      .pipe(
        tap((response) => {
          this.localStorage(response.token, response.nickname);
          const userInfo = {
            token: response.token,
            nickname: response.nickname,
          };
          this.userSubject.next(userInfo);
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => new Error('Email o nickname existentes.'));
        })
      );
  }

  login(nickname: string, password: string): Observable<any> {
    let datos = { nickname, password, returnSecureToken: true };
    return this.http
      .post<any>(
        'http://localhost:8090/auth/login',
        datos, //Angular maneja el JSON.stringify internamente
        this.httpOptions
      )
      .pipe(
        tap((response) => {
          this.localStorage(response.token, response.nickname);
          const userInfo = {
            token: response.token,
            nickname: response.nickname,
          };
          this.userSubject.next(userInfo);
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => new Error('Email o nickname erroneos.'));
        })
      );
  }

  localStorage(idToken: string, nickname: string) {
    const now = new Date();
    //Tiempo de expiración 3 horas
    const expiration = now.getTime() + parseInt('10800000 ') * 1000;

    const Token = {
      token: idToken,
      expiration: expiration,
    };
    localStorage.setItem('idToken', JSON.stringify(Token));
    localStorage.setItem('nickname', nickname);
  }

  isLogged(): boolean {
    try {
      const idToken = localStorage.getItem('idToken');
      console.log(idToken);
      if (!idToken) return false;

      const idTokenString = JSON.parse(idToken);
      const now = new Date().getTime();

      if (idTokenString.expiration > now) {
        //Comprueba si el token ha expirada
        return true;
      } else {
        localStorage.removeItem('idToken');
        return false;
      }
    } catch (e) {
      return false;
    }
    return true;
  }

  /* PARA LAS ESTADISTICAS */
  /* http://localhost:8090/api/v1/getStatsPlayer/joselu */
  statsPlayerdSubject = new Subject<statsPlayer>();
  getStatsPlayer(nickname: string, token: string): Observable<any> {
    return this.http
      .get<any>(`http://localhost:8090/api/v1/getStatsPlayer/${nickname}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .pipe(
        tap((response) => {
          const statusInfo = {
            acertadas: response.PreguntasAcertadas,
            falladas: response.PreguntasFalladas,
            totales: response.PreguntasTotales,
            stats: response.StatsUser,
            id: response.ID,
          };
          this.statsPlayerdSubject.next(statusInfo);
        }),
        catchError((error: HttpErrorResponse) => {
          console.log(error);

          return throwError(() => new Error('Datos incorrectos'));
        })
      );
  }
}
