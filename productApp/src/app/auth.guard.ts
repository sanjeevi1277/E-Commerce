import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    switch (true) {
      case !this.authService.isLoggedIn():
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return true;
      case this.authService.isLoggedIn() && !this.authService.isAdmin():
        if (state.url.startsWith('/edit-product') ||
            state.url.startsWith('/add-product') || state.url.startsWith('/delete-product') || state.url.startsWith('/login')) {
          this.router.navigate(['/product-list']);
        }
        return true;
      case this.authService.isLoggedIn() && this.authService.isAdmin():
        if (state.url.startsWith('/login')) {
          this.router.navigate(['/product-list']);
        }
        return true;
      default:
        return false;
    }
}

}
@Injectable()
export class LoginGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/product-list']);
      return false;
    }
    return true;
  }
}
