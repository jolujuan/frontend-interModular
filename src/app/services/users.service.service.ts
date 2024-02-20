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
import { UserProfile } from '../../interfaces/userProfile';

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
  userProfile = new Subject<UserProfile>();

  logged = new BehaviorSubject<boolean>(false);

  // En UsersServiceService
  /* favoritesSubject: Subject<{ id: number; uid: string; artwork_id: string }[]> =
    new Subject(); */

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
  /* async setProfile(formulario: FormGroup) {
    const formData = formulario.value;
    console.log('Se guardaran los datos==>');

    // Revisa si el perfil existe
    const { data: profileData, error: profileError } = await this.supaClient
      .from('profiles')
      .select()
      .eq('uid', formData.id)
      .single();

    if (profileError) {
      //sino existe crear uno
      console.log('procede a insertarlos por primera vez');
      // Inserta un nuevo perfil
      const { data: insertedData, error: insertError } = await this.supaClient
        .from('profiles')
        .insert([
          {
            uid: formData.id,
            username: formData.username,
            full_name: formData.full_name,
            avatar_url: formData.avatar_url,
            website: formData.website,
          },
        ]);
    }

    if (profileData) {
      console.log('procede a actualizar los datos');

      // Actualiza el perfil existente
      const { data: updatedData, error: updateError } = await this.supaClient
        .from('profiles')
        .update({
          username: formData.username,
          full_name: formData.full_name,
          avatar_url: formData.avatar_url,
          website: formData.website,
        })
        .eq('uid', formData.id);
    }
  } */

  /* getProfile(): void {
    const uid = localStorage.getItem('uid');

    let profilePromise: Promise<{ data: IUser[] }> = this.supaClient
      .from('profiles')
      .select('*')
      // Filters
      .eq('uid', uid);

    from(profilePromise)
      .pipe(tap((data) => console.log(data)))
      .subscribe(async (profile: { data: IUser[] }) => {
        console.log('Mostrando datos guardados==>');

        this.userSubject.next(profile.data[0]);
         const avatarFile = profile.data[0].avatar_url.split('/').at(-1);
        const { data, error } = await this.supaClient.storage
          .from('avatars')
          .download(avatarFile);
        const url = URL.createObjectURL(data);
        profile.data[0].avatar_url = url;
        this.userSubject.next(profile.data[0]); 
      });
  }  */
}
