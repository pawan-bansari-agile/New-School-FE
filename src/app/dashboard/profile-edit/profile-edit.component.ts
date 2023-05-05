import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { School } from 'src/app/schools/school.model';
import { SchoolService } from 'src/app/schools/school.service';
import { SchoolUpdateResponse } from '../../schools/school-list/school-item/school-item.component';
import { DashBoardService } from '../dashboard.service';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.css'],
})
export class ProfileEditComponent implements OnInit, OnDestroy {
  private schoolSub: Subscription;
  school: School;
  schoolForm: FormGroup;
  file: File;
  imageUrl: any;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private dashService: DashBoardService
  ) {}

  ngOnDestroy(): void {
    this.schoolSub.unsubscribe();
  }

  ngOnInit(): void {
    this.schoolSub = this.authService.school.subscribe((school) => {
      if (school) {
        this.school = school;
        this.initForm();
      }
    });
  }

  getFile(event) {
    if (event.target.files.length > 0) {
      this.file = event.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(this.file);
      reader.onload = () => {
        this.imageUrl = reader.result;
      };
    }
  }

  private initForm() {
    let name = this.school.name;
    let email = this.school.email;
    let address = this.school.address;
    let file = '';
    this.imageUrl = this.school.photo;
    let zipCode = this.school.zipCode;
    let city = this.school.city;
    let state = this.school.state;
    let country = this.school.country;

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

  onSubmit() {
    if (this.file) {
      this.dashService
        .updateInDb(this.school._id, this.schoolForm.value, this.file)
        .subscribe(
          (res: SchoolUpdateResponse) => {
            // this.school = res.data.updatedDetails;
            this.imageUrl = res.data.updatedDetails.photo;
            const updatedDetails = {
              ...this.school,
              ...res.data.updatedDetails,
            };
            this.authService.school.next({
              ...this.school,
              ...res.data.updatedDetails,
            });
            localStorage.removeItem('school');
            localStorage.setItem('school', JSON.stringify(updatedDetails));
            this.onCancel();
          },
          (err) => {
            this.dashService.errorEmitter.next(err);
          }
        );
    } else {
      this.dashService
        .updateInDb(this.school._id, this.schoolForm.value, null)
        .subscribe(
          (res: SchoolUpdateResponse) => {
            // this.school = res.data.updatedDetails;
            this.imageUrl = res.data.updatedDetails.photo;
            const updatedDetails = {
              ...this.school,
              ...res.data.updatedDetails,
            };
            this.authService.school.next({
              ...this.school,
              ...res.data.updatedDetails,
            });
            localStorage.removeItem('school');
            localStorage.setItem('school', JSON.stringify(updatedDetails));
            this.onCancel();
          },
          (err) => {
            this.dashService.errorEmitter.next(err);
          }
        );
    }
    this.onCancel();
  }

  onCancel() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
