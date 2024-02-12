import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ShowPopUpServiceService } from '../../services/show-pop-up-service.service';
import { UsersServiceService } from '../../services/users.service.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  @ViewChild('divPopUp') divPopUp: ElementRef | undefined;

  constructor(
    private router: Router,
    private usersService: UsersServiceService,
    private popupService: ShowPopUpServiceService,
    private formBuilder: FormBuilder
  ) {
    this.crearFormularioLogin();
    this.crearFormularioRegister();
  }
  mode: string = 'login';

  @Input()
  set setmode(value: string) {
    this.mode = value;
    if (value === 'logout') {
      /* this.usersService.logout(); */
      sessionStorage.clear();

      this.router.navigate(['home']);
    }
  }

  formRegister!: FormGroup;
  formLogin!: FormGroup;

  errorNicknameLogin: string = '';
  errorPasswordLogin: string = '';
  errorLogin: string = '';

  errorName: string = '';
  errorEmail: string = '';
  errorNickname: string = '';
  errorPassword: string = '';

  crearFormularioLogin() {
    this.formLogin = this.formBuilder.group({
      nickname: ['', [Validators.required, Validators.minLength(5)]],
      password: ['', [Validators.required, Validators.minLength(5)]],
    });
  }

  onSubmitLogin() {
    if (this.formLogin.valid) this.login();
    else console.error('El formulario no es válido');
  }

  get campoNickLogin() {
    const control = this.formLogin.get('nickname');

    if (control && control.touched) {
      if (control.invalid) {
        if (control.errors?.['required']) {
          this.errorNicknameLogin = '❗No puede estar vacío.';
        } else if (control.errors?.['minlength']) {
          this.errorNicknameLogin = `Debe tener al menos ${control.errors['minlength'].requiredLength} caracteres.`;
        }
        return true;
      }
    }
    this.errorNicknameLogin = '';
    return false;
  }

  get campoPassLogin() {
    const control = this.formLogin.get('password');

    if (control && control.touched) {
      if (control.invalid) {
        if (control.errors?.['required']) {
          this.errorPasswordLogin = '❗No puede estar vacío.';
        } else if (control.errors?.['minlength']) {
          this.errorPasswordLogin = `Debe tener al menos ${control.errors['minlength'].requiredLength} caracteres.`;
        }
        return true;
      }
    }
    this.errorPasswordLogin = '';
    return false;
  }

  onSubmitRegister() {
    if (this.formRegister.valid) this.register();
    else console.error('El formulario no es válido');
  }

  crearFormularioRegister() {
    this.formRegister = this.formBuilder.group(
      {
        name: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        nickname: ['', [Validators.required, Validators.minLength(5)]],
        password: ['', [Validators.required, Validators.minLength(5)]],
        password2: ['', [Validators.required, Validators.minLength(5)]],
      },
      { validators: this.validatePasswordsMatch }
    );
  }

  validatePasswordsMatch: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    const formGroup = control as FormGroup;
    const password = formGroup.get('password')?.value;
    const password2 = formGroup.get('password2')?.value;

    if (password && password2 && password === password2) {
      return null;
    } else {
      return { passwordMismatch: true };
    }
  };

  get campoName() {
    const control = this.formRegister.get('name');

    if (control && control.touched) {
      if (control.invalid) {
        if (control.errors?.['required']) {
          this.errorName = '❗No puede estar vacío.';
        }
        return true;
      }
    }
    this.errorName = '';
    return false;
  }

  get campoEmail() {
    const control = this.formRegister.get('email');

    if (control && control.touched) {
      if (control.invalid) {
        if (control.errors?.['required']) {
          this.errorEmail = '❗No puede estar vacío.';
        } else if (control.errors?.['email']) {
          this.errorEmail = '❗Correo no valido';
        }
        return true;
      }
    }
    this.errorEmail = '';
    return false;
  }

  get campoNick() {
    const control = this.formRegister.get('nickname');

    if (control && control.touched) {
      if (control.invalid) {
        if (control.errors?.['required']) {
          this.errorNickname = '❗No puede estar vacío.';
        } else if (control.errors?.['minlength']) {
          this.errorNickname = `Debe tener al menos ${control.errors['minlength'].requiredLength} caracteres.`;
        }
        return true;
      }
    }
    this.errorNickname = '';
    return false;
  }

  get campoPass() {
    const control = this.formRegister.get('password');
    const control2 = this.formRegister.get('password2');

    this.errorPassword = '';

    if (control && control.touched) {
      if (control.invalid) {
        if (control.errors?.['required']) {
          this.errorPassword = '❗No puede estar vacío.';
        } else if (control.errors?.['minlength']) {
          this.errorPassword = `Debe tener al menos ${control.errors['minlength'].requiredLength} caracteres.`;
        }
      } else if (this.formRegister.errors?.['passwordMismatch']) {
        this.errorPassword = 'Las contraseñas no coinciden.';
      }
      return this.errorPassword !== '';
    }
    return false;
  }
  async register() {
    const name = this.formRegister.get('name')!.value;
    const nickname = this.formRegister.get('nickname')!.value;
    const email = this.formRegister.get('email')!.value;
    const password = this.formRegister.get('password')!.value;

    this.usersService.register(name, nickname, email, password).subscribe({
      next: (response) => {
        this.showPopUp('register', 'userManagement/login');
      },
      error: (error) => {
        this.errorLogin = error.message;
      },
    });
  }

  async login() {
    const nickname = this.formLogin.get('nickname')!.value;
    const password = this.formLogin.get('password')!.value;

    this.usersService.login(nickname, password).subscribe({
      next: (response) => {
        this.router.navigate(['game']);
      },
      error: (error) => {
        this.errorNickname = error.message;
      },
    });
  }

  showPopUp(type: string, ruta: string) {
    this.divPopUp!.nativeElement.appendChild(this.popupService.popup(type));
    this.popupService.showPopup();
    this.popupService.onClosePopup.subscribe(() => {
      this.router.navigate([ruta]);
    });
  }
}
