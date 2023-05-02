import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Subject, tap, throwError } from 'rxjs';
import { School } from '../schools/school.model';
import { User } from './user.model';
import { handleError } from '../students/student.service';
import { Router } from '@angular/router';

export interface UserLoginResponse {
  data: {
    access_token: string;
    user: User;
    message: string;
  };
}

export interface SchoolLoginResponse {
  data: {
    access_token: string;
    user: School;
    message: string;
  };
}

@Injectable()
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {}

  user = new BehaviorSubject<User>(null);
  school = new BehaviorSubject<School>(null);

  tokenExpirationTimer: any;

  loginAsAdmin(form) {
    // const fd = new FormData();
    // fd.append('email', form.email);
    // fd.append('password', form.password);
    console.log(form);

    return this.http
      .post<UserLoginResponse>('http://localhost:3000/users/login', form)
      .pipe(
        catchError(
          //   (errRes) => {
          //   let errorMessage: string = 'An unknown error occured!';
          //   if (!errRes.error || !errRes.error.message) {
          //     return throwError(errorMessage);
          //   }
          //   switch (errRes.error.message) {
          //     case 'User not found!':
          //       errorMessage = 'User not found!';
          //       break;
          //     case 'Bad Credentials!':
          //       errorMessage = 'Bad Credentials!';
          //       break;
          //   }
          //   return throwError(errorMessage);
          // }
          handleError
        ),
        tap((resData) => {
          const expirationDate = new Date(new Date().getTime() + 600 * 1000);
          const user = new User(
            resData.data.access_token,
            resData.data.user.userName,
            resData.data.user.email,
            resData.data.user.role,
            resData.data.user.forgetPwdToken,
            resData.data.user.forgetPwdExpires,
            resData.data.user.deleted,
            resData.data.user._id,
            resData.data.user.__v,
            resData.data.message,
            expirationDate
          );
          console.log('user from login call', user);

          this.user.next(user);
          const expirationDuration =
            new Date(expirationDate).getTime() - new Date().getTime();
          // console.log('+expirationDuration', expirationDuration);

          this.autoLogout(expirationDuration);
          localStorage.setItem('user', JSON.stringify(user));
        })
      );
    // .subscribe((res) => {
    //   console.log('response from admin login call', res);
    // });
  }

  loginAsSchool(form) {
    console.log('from school login', form);

    return this.http
      .post<SchoolLoginResponse>('http://localhost:3000/school/login', form)
      .pipe(
        catchError(
          //   (errRes) => {
          //   let errorMessage: string = 'An unknown error occured!';
          //   if (!errRes.error || !errRes.error.message) {
          //     return throwError(errorMessage);
          //   }
          //   switch (errRes.error.message) {
          //     case 'School not found!':
          //       errorMessage = 'School not found!';
          //       break;
          //     case 'Bad Credentials!':
          //       errorMessage = 'Bad Credentials!';
          //       break;
          //   }
          //   return throwError(errorMessage);
          // }
          handleError
        ),
        tap((resData) => {
          const expirationDate = new Date(new Date().getTime() + 600 * 1000);
          const school = new School(
            resData.data.access_token,
            resData.data.user.name,
            resData.data.user.email,
            resData.data.user.address,
            resData.data.user.photo,
            resData.data.user.zipCode,
            resData.data.user.city,
            resData.data.user.state,
            resData.data.user.country,
            resData.data.user.role,
            resData.data.user.forgetPwdToken,
            resData.data.user.forgetPwdExpires,
            resData.data.user.deleted,
            resData.data.user._id,
            resData.data.user.__v,
            resData.data.message,
            resData.data.user.count,
            expirationDate
          );
          console.log('school from school login call', school);

          this.school.next(school);
          const expirationDuration =
            new Date(expirationDate).getTime() - new Date().getTime();
          this.autoLogout(expirationDuration);
          localStorage.setItem('school', JSON.stringify(school));
        })
      );
    // .subscribe((res) => {
    //   console.log('response from school login call', res);
    // });
  }

  logout() {
    this.user.next(null);
    this.school.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('user');
    localStorage.removeItem('school');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogin() {
    const loadedUser = JSON.parse(localStorage.getItem('user'));
    const loadedSchool = JSON.parse(localStorage.getItem('school'));

    if (!loadedUser && !loadedSchool) {
      return;
    }

    if (loadedUser) {
      const loggedInUser = new User(
        loadedUser.access_token,
        loadedUser.userName,
        loadedUser.email,
        loadedUser.role,
        loadedUser.forgetPwdToken,
        loadedUser.forgetPwdExpires,
        loadedUser.deleted,
        loadedUser._id,
        loadedUser.__v,
        loadedUser.message,
        new Date(loadedUser.expirationDate)
      );

      if (
        !loggedInUser.expirationDate ||
        new Date() < loggedInUser.expirationDate
      ) {
        this.user.next(loggedInUser);
      }
    }

    if (loadedSchool) {
      const loggedInSchool = new School(
        loadedSchool.access_token,
        loadedSchool.name,
        loadedSchool.email,
        loadedSchool.address,
        loadedSchool.photo,
        loadedSchool.zipCode,
        loadedSchool.city,
        loadedSchool.state,
        loadedSchool.country,
        loadedSchool.role,
        loadedSchool.forgetPwdToken,
        loadedSchool.forgetPwdExpires,
        loadedSchool.deleted,
        loadedSchool._id,
        loadedSchool.__v,
        loadedSchool.message,
        loadedSchool.count,
        new Date(loadedSchool.expirationDate)
      );

      if (
        !loggedInSchool.expirationDate ||
        new Date() < loggedInSchool.expirationDate
      ) {
        this.school.next(loggedInSchool);
      }
    }
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }
}
