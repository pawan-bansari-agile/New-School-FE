import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit {
  authForm: FormGroup;
  isLoginMode = true;
  isLoading = false;
  error: string = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.initForm();
  }

  onSubmit() {
    if (!this.authForm.valid) {
      return;
    }
    this.isLoading = true;
    if (this.isLoginMode) {
      this.authService.loginAsAdmin(this.authForm.value).subscribe(
        (res) => {
          console.log('response from admin call', res);
          this.isLoading = false;
          this.router.navigate(['/dashboard']);
        },
        (error) => {
          console.log('error from admin call', error);
          this.error = error;
          this.isLoading = false;
        }
      );
    } else {
      this.authService.loginAsSchool(this.authForm.value).subscribe(
        (res) => {
          console.log('response from school login call', res);
          this.isLoading = false;
          this.router.navigate(['/dashboard']);
        },
        (err) => {
          console.log('error from school call', err);
          this.error = err;
          this.isLoading = false;
        }
      );
    }
    this.authForm.reset();
  }

  private initForm() {
    let email = '';
    let password = '';
    this.authForm = new FormGroup({
      email: new FormControl(email, [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
      ]),
      password: new FormControl(password, Validators.required),
    });
  }

  onLoginMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onHandleError() {
    this.error = null;
  }
}
