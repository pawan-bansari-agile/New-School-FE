import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user.model';
import { School } from 'src/app/schools/school.model';
import { Student } from '../student.model';
import { StudentService, StatusUpdateRes } from '../student.service';

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.css'],
})
export class StudentListComponent implements OnInit, OnDestroy {
  students: Student[] = [];
  error: string = null;
  fieldName: string = '';
  fieldValue: string = '';
  pageNumber: number;
  limit: number = 10;
  keyword: string;
  sortBy: string = '';
  sortOrder: string = '';
  userSub: Subscription;
  user: User = null;
  schoolSub: Subscription;
  school: School = null;
  role: string = '';
  values = [];
  searchTerm = '';
  totalPages: number;
  pages: number[] = [];

  constructor(
    private studentService: StudentService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}
  ngOnDestroy(): void {
    this.userSub.unsubscribe();
    this.schoolSub.unsubscribe();
  }

  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe((user) => {
      this.user = user;
    });
    this.schoolSub = this.authService.school.subscribe((school) => {
      this.school = school;
    });
    this.role = this.user ? this.user.role : this.school.role;
    this.studentService.studentsChanged.subscribe((students: Student[]) => {
      this.students = students;
    });
    this.studentService
      .onInint('', '', '', '', '', this.pageNumber, this.limit)
      .subscribe((res) => {
        this.pageNumber = +res.data.pageNumber;
        this.limit = +res.data.limit;
        this.totalPages = +res.data.totalPages;
        for (let i = 1; i <= this.totalPages; i++) {
          this.pages.push(i);
        }
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
    const payload = {
      status: !student.status,
    };

    this.studentService.updateStatus(student._id, payload).subscribe(
      (res: StatusUpdateRes) => {
        this.students[i] = res.data.updatedDetails;
      },
      (err) => {}
    );
  }

  change(value) {
    this.limit = value;
    if (this.limit) {
      this.studentService
        .onInint('', '', '', '', '', this.pageNumber, this.limit)
        .subscribe((res) => {
          this.totalPages = +res.data.totalPages;
          this.pages = [];
          for (let i = 1; i <= this.totalPages; i++) {
            this.pages.push(i);
          }
          this.students = this.studentService.getStudents();
          this.pageNumber = +res.data.pageNumber;
          this.limit = +res.data.limit;
        });
    }
  }

  search(searchTerm) {
    this.keyword = searchTerm;
    this.studentService
      .onInint('', '', this.keyword, '', '')
      .subscribe((res) => {
        this.students = this.studentService.getStudents();
      });
  }

  sort(name) {
    this.sortOrder = this.sortOrder === '1' ? '-1' : '1';
    this.sortBy = name;
    this.studentService
      .onInint('', '', '', this.sortBy, this.sortOrder)
      .subscribe((res) => {
        this.students = this.studentService.getStudents();
      });
  }

  filterOpts(form) {
    this.fieldName = form.value.fieldName;
    this.fieldValue = form.value.fieldValue;
    if (this.fieldName && this.fieldValue) {
      this.studentService
        .filter(this.fieldName, this.fieldValue)
        .subscribe((res) => {
          this.students = res.data.studentUrl;
        });
    }
  }

  decrease() {
    if (this.pageNumber != this.pages[0]) {
      this.pageNumber--;
      this.studentService
        .onInint('', '', '', '', '', this.pageNumber, this.limit)
        .subscribe((res) => {
          this.students = this.studentService.getStudents();
        });
    }
  }

  increase() {
    if (this.students.length != this.pages[this.pages.length - 1]) {
      this.pageNumber++;
      this.studentService
        .onInint('', '', '', '', '', this.pageNumber, this.limit)
        .subscribe((res) => {
          this.students = this.studentService.getStudents();
        });
    }
  }

  onFieldNameChange(fieldName) {
    if (fieldName === 'school.name') {
      this.studentService.getAllSchools().subscribe((res) => {
        this.values = [];
        res.data.map((item) => {
          this.values.push(item.name);
        });
      });
    } else if (fieldName === 'std') {
      this.studentService.getAllStds().subscribe((res) => {
        this.values = [];
        res.data.map((item) => {
          this.values.push(item.std);
        });
      });
    }
  }

  isFirstPage(): boolean {
    return this.pageNumber === this.pages[0];
  }

  isLastPage(): boolean {
    return this.pageNumber === this.pages[this.pages.length - 1];
  }
}
