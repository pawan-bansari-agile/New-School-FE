import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Subject, tap, throwError } from 'rxjs';
import { School } from '../schools/school.model';
import { User } from './user.model';
import { handleError } from '../students/student.service';

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
  constructor(private http: HttpClient) {}

  user = new BehaviorSubject<User>(null);
  school = new BehaviorSubject<School>(null);

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
          handleError,
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
            expirationDate,
          );
          console.log('user from login call', user);

          this.user.next(user);
        }),
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
          handleError,
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
            resData.data.user.message,
            expirationDate,
          );
          this.school.next(school);
        }),
      );
    // .subscribe((res) => {
    //   console.log('response from school login call', res);
    // });
  }
}
