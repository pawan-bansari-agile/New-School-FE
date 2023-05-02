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
    private dashService: DashBoardService, // private schoolService: SchoolService,
  ) {}

  ngOnDestroy(): void {
    this.schoolSub.unsubscribe();
  }

  ngOnInit(): void {
    this.schoolSub = this.authService.school.subscribe((school) => {
      if (school) {
        this.school = school;
        this.initForm();
        console.log('school from profile edit component', this.school);
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
      // reader.readAsDataURL(this.file);
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

  onSubmit() {
    // if (this.editMode) {
    if (this.file) {
      // this.isLoading = true;
      this.dashService
        .updateInDb(this.school._id, this.schoolForm.value, this.file)
        .subscribe(
          (res: SchoolUpdateResponse) => {
            console.log(
              'response from update school call',
              res.data.updatedDetails.photo,
            );

            // this.schoolService.updateSchool(
            //   this.school._id,
            //   res.data.updatedDetails,
            //   // this.file
            //   res.data.updatedDetails.photo,
            // );
            this.school = res.data.updatedDetails;
            this.imageUrl = res.data.updatedDetails.photo;
            // this.authService.school.next(res.data.updatedDetails);
            this.onCancel();
            // this.isLoading = false;
          },
          (err) => {
            // this.error = err;
            // this.errorEmitter.next(err);
            this.dashService.errorEmitter.next(err);
            // this.isLoading = false;
          },
        );
    } else {
      // this.isLoading = true;
      this.dashService
        .updateInDb(this.school._id, this.schoolForm.value, null)
        .subscribe(
          (res: SchoolUpdateResponse) => {
            // this.schoolService.updateSchool(
            //   this.id,
            //   res.data.updatedDetails,
            //   null,
            // );
            this.school = res.data.updatedDetails;
            this.imageUrl = res.data.updatedDetails.photo;
            // this.authService.school.next(res.data.updatedDetails);
            this.onCancel();
            // this.isLoading = false;
          },
          (err) => {
            // this.error = err;
            // this.errorEmitter.next(err);
            this.dashService.errorEmitter.next(err);
            // this.isLoading = false;
          },
        );
    }
    // } else {
    //   if (this.file) {
    //     this.isLoading = true;
    //     this.schoolService.addInDb(this.schoolForm.value, this.file).subscribe(
    //       (res: SchoolLoginResponse) => {
    //         console.log('response from add school call', res);

    //         console.log('response from add in db call from school', res);
    //         this.schoolService.addSchool(
    //           this.schoolForm.value,
    //           res.data.user.photo
    //         );
    //         this.isLoading = false;
    //       },
    //       (err) => {
    //         // this.error = err;
    //         // this.errorEmitter.next(err);
    //         this.schoolService.errorEmitter.next(err);
    //         this.isLoading = false;
    //       }
    //     );
    //   } else {
    //     this.isLoading = true;
    //     this.schoolService.addInDb(this.schoolForm.value, null).subscribe(
    //       (res: SchoolLoginResponse) => {
    //         console.log('photo', res.data.user.photo);

    //         console.log('response from add in db call from school', res);
    //         this.schoolService.addSchool(this.schoolForm.value, null);
    //         this.isLoading = false;
    //       },
    //       (err) => {
    //         console.log('err from school add', err);

    //         // this.error = err;
    //         // this.errorEmitter.next(err);
    //         this.schoolService.errorEmitter.next(err);
    //         this.isLoading = false;
    //       }
    //     );
    //   }
    // }
    this.onCancel();
  }

  onCancel() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
