import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { School } from 'src/app/schools/school.model';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.css'],
})
export class ProfileEditComponent implements OnInit, OnDestroy {
  private schoolSub: Subscription;
  school: School;
  schoolForm: FormGroup;

  constructor(private authService: AuthService) {}

  ngOnDestroy(): void {
    this.schoolSub.unsubscribe();
  }

  ngOnInit(): void {
    this.schoolSub = this.authService.school.subscribe((school) => {
      if (school) {
        this.school = school;
      }
    });
  }

  private initForm() {
    let name = '';
    let email = '';
    let address = '';
    let file = '';
    let zipCode;
    let city = '';
    let state = '';
    let country = '';

    // if (this.editMode) {
    // const school = this.schoolService.getSchoolById(this.id);
    // name = school.name;
    // email = school.email;
    // address = school.address;
    // // file = school.photo;
    // zipCode = school.zipCode;
    // city = school.city;
    // state = school.state;
    // country = school.country;
    // }
    this.schoolForm = new FormGroup({
      name: new FormControl(name, [
        Validators.required,
        Validators.pattern(/^\S.*\S$/),
      ]),
      email: new FormControl(email, [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
      ]),
      address: new FormControl(address, [
        Validators.required,
        Validators.pattern(/^\S.*\S$/),
        // this.noWhitespaceValidator,
      ]),
      file: new FormControl(file),
      zipCode: new FormControl(zipCode, [
        Validators.required,
        Validators.pattern(/^\d{6}$/),
      ]),
      city: new FormControl(city, [
        Validators.required,
        Validators.pattern(/^\S.*\S$/),
      ]),
      state: new FormControl(state, [
        Validators.required,
        Validators.pattern(/^\S.*\S$/),
      ]),
      country: new FormControl(country, [
        Validators.required,
        Validators.pattern(/^\S.*\S$/),
      ]),
    });
  }
}
