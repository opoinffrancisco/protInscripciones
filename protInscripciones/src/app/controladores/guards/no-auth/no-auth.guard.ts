import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../servicios/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class NoAuthGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router) {
  }

  /* Verificar si inicio sesion, para enviarlo al inicio */
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if (!this.auth.esAutenticado()) {
        this.router.navigateByUrl('/iniciar-sesion');
        return false;
    }
    return true;

  }
  
}
