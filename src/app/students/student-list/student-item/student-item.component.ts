import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { StudentService } from '../../student.service';

@Component({
  selector: 'app-student-item',
  templateUrl: './student-item.component.html',
  styleUrls: ['./student-item.component.css'],
})
export class StudentItemComponent implements OnInit {
  id: number;
  editMode = false;
  studentForm: FormGroup;

  file: File;
  imageUrl: any;

  constructor(
    private route: ActivatedRoute,
    private studentService: StudentService,
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
    let parentNumber;
    let address = '';
    let std;
    let file;
    let dob;
    // let status;
    let school;

    if (this.editMode) {
      const student = this.studentService.getStudentById(this.id);
      name = student.name;
      parentNumber = student.parentNumber;
      address = student.address;
      std = student.std;
      // file = student.photo;
      dob = student.dob;
      // status = student.status;
      school = student.school;
    }
    this.studentForm = new FormGroup({
      name: new FormControl(name, [
        Validators.required,
        Validators.pattern(/^\S.*\S$/),
      ]),
      parentNumber: new FormControl(parentNumber, [
        Validators.required,
        Validators.pattern(
          /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6-9]\d{9}$/
        ),
      ]),
      address: new FormControl(address, [
        Validators.required,
        Validators.pattern(/^\S.*\S$/),
      ]),
      std: new FormControl(std, [
        Validators.required,
        Validators.pattern(/^(?!0+$)\d+$/),
      ]),
      file: new FormControl(file),
      dob: new FormControl(dob, Validators.required),
      // status: new FormControl(status),
      school: new FormControl(school, [
        Validators.required,
        Validators.pattern(/^\S.*\S$/),
      ]),
    });
  }

  onSubmit() {
    if (this.editMode) {
      this.studentService.updateStudent(this.id, this.studentForm.value);
    } else {
      this.studentService.addStudent(this.studentForm.value);
    }
    this.onCancel();
  }

  onCancel() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
