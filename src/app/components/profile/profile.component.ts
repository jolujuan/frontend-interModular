import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { ShowPopUpServiceService } from '../../services/show-pop-up-service.service';
import { UsersServiceService } from '../../services/users.service.service';
import { UserProfile } from '../../../interfaces/userProfile';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements AfterViewInit  {
  @ViewChild('divPopUp') divPopUp: ElementRef | undefined;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UsersServiceService,
    private titleService: Title,
    private usersService: UsersServiceService,
    private popupService: ShowPopUpServiceService,
    private router: Router
  ) {
    this.crearFormulario();
  }

  formulario!: FormGroup;
  isLoggedUser: boolean = false;

  //Usamos after view para que el popup se ejecute despues de inicializar el dom
  ngAfterViewInit(): void {
    this.titleService.setTitle('PROFILE');

    this.isLoggedUser = this.usersService.isLogged();
    if (this.isLoggedUser) {
      this.userService.userProfile
        .pipe(
          map((p: UserProfile) => {
            return {
              id: p.id,
              username: p.username,
              full_name: p.full_name,
              avatar_url: p.avatar_url,
              website: p.website,
            };
          })
        )
        .subscribe((profile) => this.formulario.setValue(profile));
    } else {
      this.showPopUp('profile', 'userManagement/login');
    }
  }

  onSubmit() {
    if (this.formulario.valid) {
      this.userService.setProfile(this.formulario);
    } else {
      console.error('El formulario no es válido');
    }
  }

  crearFormulario() {
    this.formulario = this.formBuilder.group({
      id: [localStorage.getItem('uid')],
      username: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.pattern('.*[a-zA-Z].*'),
        ],
      ],
      full_name: [''],
      avatar_url: [''],
      website: ['', websiteValidator('http.*')],
    });
  }

  get usernameNoValid() {
    return (
      this.formulario.get('username')!.invalid &&
      this.formulario.get('username')!.touched
    );
  }

  cargarImagen(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.formulario.patchValue({ avatar_url: reader.result });
        this.formulario.get('avatar_url')?.updateValueAndValidity();
      };
      reader.readAsDataURL(file);
    }
  }

  showPopUp(type: string, ruta: string) {
    this.divPopUp!.nativeElement.appendChild(this.popupService.popup(type));
    this.popupService.showPopup();
    this.popupService.onClosePopup.subscribe(() => {
      this.router.navigate([ruta]);
    });
  }
}

function websiteValidator(pattern: string): ValidatorFn {
  return (c: AbstractControl): { [key: string]: any } | null => {
    if (c.value) {
      let regexp = new RegExp(pattern);

      return regexp.test(c.value) ? null : { website: c.value };
    }
    return null;
  };
}
