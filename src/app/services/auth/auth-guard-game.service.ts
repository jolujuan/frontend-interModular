import { Injectable, inject } from '@angular/core';
import {  ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
 class PermissionsService   {
  constructor(private router: Router) {}

  //NO dejar acceder a la pagina del juego si el usaurio no ha iniciado sesion
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

    if (!this.isLoggedIn()) {
      this.router.navigate(['/home']); 
      return false;
    }
    return true;
  }

  private isLoggedIn(): boolean {
    return !!localStorage.getItem('idToken');
  }
}

export const AuthGuardGame: CanActivateFn = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean => {
  return inject(PermissionsService).canActivate(next, state);
}