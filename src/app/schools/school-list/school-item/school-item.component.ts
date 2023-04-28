import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { SchoolService } from '../../school.service';

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
      reader.readAsDataURL(this.file);
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
      // file = school.photo;
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
    if (this.editMode) {
      this.schoolService.updateSchool(this.id, this.schoolForm.value);
    } else {
      this.schoolService.addSchool(this.schoolForm.value);
    }
    this.onCancel();
  }

  onCancel() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
