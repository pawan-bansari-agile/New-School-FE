import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Student } from '../student.model';
import { StudentService } from '../student.service';
import { StatusUpdateRes } from '../student.service';

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.css'],
})
export class StudentListComponent implements OnInit {
  students: Student[] = [];
  error: string = null;
  fieldName: string = '';
  fieldValue: string = '';
  pageNumber: number;
  limit: number;
  keyword: string;
  sortBy: string = '';
  sortOrder: string = '';

  constructor(
    private studentService: StudentService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.studentService.studentsChanged.subscribe((students: Student[]) => {
      this.students = students;
    });
    this.studentService
      .onInint('', '', '', '', '', this.pageNumber, this.limit)
      .subscribe((res) => {
        this.pageNumber = +res.data.pageNumber;
        this.limit = +res.data.limit;
      });
    this.students = this.studentService.getStudents();
    this.studentService.errorEmitter.subscribe((err) => {
      this.error = err;
    });
  }

  onNewStudent() {
    this.router.navigate(['new'], { relativeTo: this.route });
  }

  onHandleError() {
    this.error = null;
  }

  updateStatus(i, student) {
    console.log('student from student component', student);
    const payload = {
      status: !student.status,
    };
    console.log('student from status update call', student);

    this.studentService.updateStatus(student._id, payload).subscribe(
      (res: StatusUpdateRes) => {
        this.students[i] = res.data.updatedDetails;
      },
      (err) => {
        console.log('erro from status update call', err);
      }
    );
  }

  change(form) {
    this.limit = form.value.entries;
    this.studentService
      .onInint('', '', '', '', '', this.pageNumber, this.limit)
      .subscribe((res) => {
        this.students = this.studentService.getStudents();
        this.pageNumber = +res.data.pageNumber;
        this.limit = +res.data.limit;
      });
  }

  search(form) {
    console.log('value from search input', form.value);
    this.keyword = form.value.search;
    this.studentService
      .onInint('', '', this.keyword, '', '')
      .subscribe((res) => {
        console.log('res from search method', res);

        this.students = this.studentService.getStudents();
        // this.pageNumber = +res.data.pageNumber;
        // this.limit = +res.data.limit;
      });
  }

  sort(form) {
    console.log('value from sorting method', form.value);
    this.sortBy = form.value.sortBy;
    this.sortOrder = form.value.sortOrder;
    this.studentService
      .onInint('', '', '', this.sortBy, this.sortOrder)
      .subscribe((res) => {
        console.log('res from search method', res);

        this.students = this.studentService.getStudents();
        // this.pageNumber = +res.data.pageNumber;
        // this.limit = +res.data.limit;
      });
  }

  filterOpts(form) {
    console.log('value from filter method', form.value);
    this.fieldName = form.value.fieldName;
    this.fieldValue = form.value.fieldValue;
    this.studentService
      .filter(this.fieldName, this.fieldValue)
      .subscribe((res) => {
        console.log('res from filter method call', res);

        this.students = res.data.studentUrl;
      });
  }

  decrease() {
    if (this.pageNumber != 1) {
      this.pageNumber--;
      this.studentService
        .onInint('', '', '', '', '', this.pageNumber, this.limit)
        .subscribe((res) => {
          this.students = this.studentService.getStudents();
          // this.pageNumber = +res.data.pageNumber;
          // this.limit = +res.data.limit;
        });
    }
  }

  increase() {
    if (this.students.length != 0) {
      this.pageNumber++;
      this.studentService
        .onInint('', '', '', '', '', this.pageNumber, this.limit)
        .subscribe((res) => {
          this.students = this.studentService.getStudents();
          // this.pageNumber = +res.data.pageNumber;
          // this.limit = +res.data.limit;
        });
    }
  }
}
