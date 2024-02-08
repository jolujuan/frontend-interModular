import { Injectable, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsersServiceService implements OnInit {
  supaClient: any = null;

  constructor() {}
  ngOnInit(): void {}

  inicialiTing() {}

  // En UsersServiceService
  favoritesSubject: Subject<{ id: number; uid: string; artwork_id: string }[]> =
    new Subject();

  async register(email: string, password: string): Promise<any> {
    this.inicialiTing();
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

  async login(email: string, password: string): Promise<any> {
    this.inicialiTing();
    const { data, error } = await this.supaClient.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      if (error.message.includes('Email not confirmed')) {
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
    }
    const uid = data.session.user.id;
    localStorage.setItem('uid', uid);
    //this.getProfile();

    return { success: true, data };
  }

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
    this.inicialiTing();
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
