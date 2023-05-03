import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { SchoolLoginResponse } from 'src/app/auth/auth.service';
import { School } from '../../school.model';
import { SchoolService } from '../../school.service';

export interface SchoolUpdateResponse {
  data: {
    updatedDetails: School;
    message: string;
  };
}

@Component({
  selector: 'app-school-item',
  templateUrl: './school-item.component.html',
  styleUrls: ['./school-item.component.css'],
})
export class SchoolItemComponent implements OnInit {
  id: number;
  editMode = false;
  schoolForm: FormGroup;

  file: File;
  imageUrl: any;

  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private schoolService: SchoolService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = +params['id'];
      this.editMode = params['id'] != null;
      this.initForm();
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
    let name = '';
    let email = '';
    let address = '';
    let file = '';
    let zipCode;
    let city = '';
    let state = '';
    let country = '';

    if (this.editMode) {
      const school = this.schoolService.getSchoolById(this.id);
      name = school.name;
      email = school.email;
      address = school.address;
      zipCode = school.zipCode;
      city = school.city;
      state = school.state;
      country = school.country;
    }
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
    if (this.editMode) {
      if (this.file) {
        this.isLoading = true;
        this.schoolService
          .updateInDb(this.id, this.schoolForm.value, this.file)
          .subscribe(
            (res: SchoolUpdateResponse) => {
              this.schoolService.updateSchool(
                this.id,
                res.data.updatedDetails,
                res.data.updatedDetails.photo
              );
              this.router.navigate(['/schools']);
              this.isLoading = false;
            },
            (err) => {
              this.schoolService.errorEmitter.next(err);
              this.isLoading = false;
            }
          );
      } else {
        this.isLoading = true;
        this.schoolService
          .updateInDb(this.id, this.schoolForm.value, null)
          .subscribe(
            (res: SchoolUpdateResponse) => {
              this.schoolService.updateSchool(
                this.id,
                res.data.updatedDetails,
                null
              );
              this.router.navigate(['/schools']);
              this.isLoading = false;
            },
            (err) => {
              this.schoolService.errorEmitter.next(err);
              this.isLoading = false;
            }
          );
      }
    } else {
      if (this.file) {
        this.isLoading = true;
        this.schoolService.addInDb(this.schoolForm.value, this.file).subscribe(
          (res: SchoolLoginResponse) => {
            this.schoolService.addSchool(
              this.schoolForm.value,
              res.data.user.photo
            );
            this.isLoading = false;
          },
          (err) => {
            this.schoolService.errorEmitter.next(err);
            this.isLoading = false;
          }
        );
      } else {
        this.isLoading = true;
        this.schoolService.addInDb(this.schoolForm.value, null).subscribe(
          (res: SchoolLoginResponse) => {
            this.schoolService.addSchool(this.schoolForm.value, null);
            this.isLoading = false;
          },
          (err) => {
            this.schoolService.errorEmitter.next(err);
            this.isLoading = false;
          }
        );
      }
    }
    this.onCancel();
  }

  onCancel() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
