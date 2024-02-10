import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable, Subject, catchError, tap, throwError } from 'rxjs';
import { User } from '../../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class UsersServiceService {
  supaClient: any = null;

  constructor(private http: HttpClient) {}

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  userSubject = new Subject<User>();

  // En UsersServiceService
  favoritesSubject: Subject<{ id: number; uid: string; artwork_id: string }[]> =
    new Subject();

  async register(email: string, password: string): Promise<any> {
    const { user, error } = await this.supaClient.auth.signUp({
      email,
      password,
    }); //let data = session.data;
    if (error) {
      if (error.message.includes('Password should be at least 6 characters.')) {
        return {
          success: false,
          message: 'Contraseña mínimo 6 caracteres.',
        };
      } else return { success: false, message: error.message };
    }
    return { success: true, user };
  }

  login(nickname: string, password: string): Observable<any> {
    let datos = { nickname, password, returnSecureToken: true };
    console.log(datos)
    return this.http.post<any>(
      'http://localhost:8090/auth/login',
      datos, //Angular maneja el JSON.stringify internamente
      this.httpOptions
    ).pipe(
      tap((response) => {
        console.log("dsds",response)
        const userInfo = { token: response.token, nickname: response.nickname };
        this.userSubject.next(userInfo);
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => new Error('Error de conexión o datos inválidos.'));
      })
    );
  }
  

  /* localstorageLogin(idToken: string, expiresIn: string, localId: string) {
    const now = new Date();
    const Token = {
      token: idToken,
      expiration: now.getTime() + parseInt(expiresIn) * 1000,
    };
    localStorage.setItem('idToken', JSON.stringify(Token));
    localStorage.setItem('localId', localId);
    this.logged.next(true);
  } */

  /* async loginRequest(body: any) {
    const url = 'http://localhost:8090/auth/login';

    const request = this.http.post<{ uid: string }>(
      url,
      JSON.stringify(body),
      this.httpOptions
    );

    request.subscribe({
      next: (response) => {},
      error: (error) => {
        if (error.status === 401) {
          return Promise.reject(response);
        }
      },
    });
    return Promise.reject(response);
  }

  async login(email:string, password:string){
    const data = await this.loginRequest({ email, password });
    console.log(data);
  } */

  /* if (error.status === 401) {
      const responseData = await response.json();
      if (responseData && responseData.code === 'PGRST301') {
         const main = document.querySelector("#container");
        main.append(popup('expira'));
        showPopup();
        route('#/login'); 

        return Promise.reject(responseData); // Rechazar la promesa
      }
    }
    if (response.status >= 200 && response.status < 300) {
      // En cas d'error en el servidor
      if (response.headers.get('content-type')) {
        // Si retorna un JSON
        return await response.json();
      }
      return {};
    }
    return Promise.reject(await response.json());
  } */

  /* async login(email: string, password: string) {
    const url = 'http://localhost:8090/auth/login';
    const data = await this.baseRequest({ email, password });
    return data;
  } */

  /* async loginUser(email: string, password: string) {
    const { user, error } = await this.login(email, password); */

  /* localStorage.setItem('access_token', dataLogin.access_token);
      localStorage.setItem('email', dataLogin.user.email);
      localStorage.setItem('uid', dataLogin.user.id);
      localStorage.setItem('expirationDate', dataLogin.expires_in); */

  /* if (error.message.includes('Email not confirmed')) {
      return {
        success: false,
        message: 'Verifica tu dirección de correo electronico.',
      };
    } else if (error.message.includes('Invalid login credentials')) {
      return {
        success: false,
        message: 'Contraseña o email incorrectos.',
      };
    } else return { success: false, message: error.message };

    const uid = user.session.user.id;
    localStorage.setItem('uid', uid);
    //this.getProfile();
    return { success: true, user };
  } */

  async setProfile(formulario: FormGroup) {
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
  }

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

  async setFavorites(artwork_id: string): Promise<void> {
    let { data, error } = await this.supaClient.auth.getSession();
    let promiseFavorites: Promise<boolean> = this.supaClient
      .from('favorites')
      .insert([{ uid: data.session.user.id, artwork_id: artwork_id }]);
    await promiseFavorites;
    //promiseFavorites.then(() => this.getFavorites());
  }

  getFavorites(): void {
    let uid = localStorage.getItem('uid');
    if (uid) {
      let promiseFavorites: Promise<{
        data: { id: number; uid: string; artwork_id: string }[];
      }> = this.supaClient
        .from('favorites')
        .select('*')
        // Filters
        .eq('uid', uid);

      promiseFavorites.then((data) => {
        this.favoritesSubject.next(data.data);
      });
    }
  }

  async isLogged(): Promise<boolean> {
    const session = await this.supaClient.auth.getSession();

    if (session.data.session) {
      //this.getProfile();
      return true;
    }
    return false;
  }

  async logout() {
    const { error } = await this.supaClient.auth.signOut();
    //this.userSubject.next(emptyUser);
  }
}
