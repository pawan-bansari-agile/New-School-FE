import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { combineLatest, map, Observable, take } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    return combineLatest([this.authService.user, this.authService.school]).pipe(
      take(1),
      map(([user, school]) => {
        const isUserAuth = !!user;

        const isSchoolAuth = !!school;

        if (isUserAuth || isSchoolAuth) {
          return true;
        } else if (!isUserAuth || !isSchoolAuth) {
          return this.router.createUrlTree(['/auth']);
        } else {
          return this.router.createUrlTree(['/auth']);
        }
      })
    );
  }
}
