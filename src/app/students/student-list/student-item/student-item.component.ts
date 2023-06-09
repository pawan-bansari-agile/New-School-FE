import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Student } from '../../student.model';
import { StudentService } from '../../student.service';
import { SchoolService } from '../../../schools/school.service';

export interface StudentUpdateResponse {
  data: Student;
}

export interface StudentAddResponse {
  data: {
    newStudent: Student;
    message: string;
  };
}

@Component({
  selector: 'app-student-item',
  templateUrl: './student-item.component.html',
  styleUrls: ['./student-item.component.css'],
})
export class StudentItemComponent implements OnInit {
  id: number;
  editMode = false;
  studentForm: FormGroup;
  values = [];

  file: File;
  imageUrl: any;

  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private studentService: StudentService,
    private router: Router,
    private schoolService: SchoolService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = +params['id'];
      this.editMode = params['id'] != null;
      this.initForm();
    });
    this.selectSchool();
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
    let parentNumber;
    let address = '';
    let std;
    let file;
    let dob;
    let school;

    if (this.editMode) {
      const student = this.studentService.getStudentById(this.id);
      name = student.name;
      parentNumber = student.parentNumber;
      address = student.address;
      std = student.std;
      dob = student.dob;
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
      school: new FormControl(school, [
        Validators.required,
        Validators.pattern(/^\S.*\S$/),
      ]),
    });
  }

  onSubmit() {
    if (this.editMode) {
      if (this.file) {
        this.isLoading = true;
        this.studentService
          .updateInDb(this.id, this.studentForm.value, this.file)
          .subscribe(
            (res: StudentUpdateResponse) => {
              this.studentService.updateStudent(this.id, res.data, this.file);
              this.isLoading = false;
              this.router.navigate(['/students']);
            },
            (err) => {
              this.studentService.errorEmitter.next(err);
              this.isLoading = false;
            }
          );
      } else {
        this.isLoading = true;
        this.studentService
          .updateInDb(this.id, this.studentForm.value, null)
          .subscribe(
            (res: StudentUpdateResponse) => {
              this.studentService.updateStudent(this.id, res.data, null);
              this.isLoading = false;
              this.router.navigate(['/students']);
            },
            (err) => {
              this.studentService.errorEmitter.next(err);
              this.isLoading = false;
            }
          );
      }
    } else {
      if (this.file) {
        this.isLoading = true;
        this.studentService
          .addInDb(this.studentForm.value, this.file)
          .subscribe(
            (res: StudentAddResponse) => {
              this.studentService.addStudent(res.data.newStudent, this.file);
              this.isLoading = false;
            },
            (err) => {
              this.studentService.errorEmitter.next(err);
              this.isLoading = false;
            }
          );
      } else {
        this.isLoading = true;
        this.studentService.addInDb(this.studentForm.value, null).subscribe(
          (res: StudentAddResponse) => {
            this.studentService.addStudent(res.data.newStudent, null);
            this.isLoading = false;
          },
          (err) => {
            this.studentService.errorEmitter.next(err);
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

  selectSchool() {
    this.schoolService.onInint('', '', '', '', '', 1, 100).subscribe((res) => {
      this.values = [];
      res.data.schoolsUrl.map((item) => {
        this.values.push({ id: item._id, name: item.name });
      });
    });
  }
}
