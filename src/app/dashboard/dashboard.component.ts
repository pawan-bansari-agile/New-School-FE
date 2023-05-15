import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { User } from '../auth/user.model';
import { School } from '../schools/school.model';
import { SchoolSearchResponse, SchoolService } from '../schools/school.service';
import { Student } from '../students/student.model';
import { StudentService } from '../students/student.service';
import { CountResponse, DashBoardService } from './dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  schools: School[] = [];
  school: School;
  user: User;
  isAuthenticated: string = '';
  private userSub: Subscription;
  private schoolSub: Subscription;
  totalStudCnt: number;
  countResponse = [];
  error: string = null;
  pageNumber: number;
  limit: number = 10;
  keyword: string;
  sortBy: string = '';
  sortOrder: string = '';
  totalPages: number;
  pages: number[] = [];
  searchTerm = '';

  constructor(
    private dashService: DashBoardService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.userSub = this.authService.user.subscribe((user) => {
      this.isAuthenticated = user?.role;
      this.user = user;
    });
    this.schoolSub = this.authService.school.subscribe((school) => {
      if (school) {
        this.isAuthenticated = school?.role;
        this.school = school;
      }
    });
    if (this.user) {
      this.dashService
        .fetchSchools('', '', '', '', '', this.pageNumber, this.limit)
        .subscribe((res) => {
          this.schools = this.dashService.getSchools();
          this.pageNumber = +res.data.pageNumber;
          this.limit = +res.data.limit;
          this.totalPages = +res.data.totalPages;
          for (let i = 1; i <= this.totalPages; i++) {
            this.pages.push(i);
          }
        });
      this.dashService.getTotalCount().subscribe((res) => {
        this.totalStudCnt = res.data[0].total;
      });
    } else {
      this.dashService
        .standCount(this.school.name)
        .subscribe((res: CountResponse) => {
          this.countResponse = res.data;
        });
    }
    this.dashService.errorEmitter.subscribe((err) => {
      this.error = err;
    });
  }

  onUpdate() {
    this.router.navigate(['edit'], { relativeTo: this.route });
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
    this.schoolSub.unsubscribe();
  }

  decrease() {
    if (this.pageNumber != this.pages[0]) {
      this.pageNumber--;
      this.dashService
        .fetchSchools('', '', '', '', '', this.pageNumber, this.limit)
        .subscribe((res) => {
          this.schools = this.dashService.getSchools();
        });
    }
  }

  increase() {
    if (this.schools.length != this.pages[this.pages.length - 1]) {
      this.pageNumber++;
      this.dashService
        .fetchSchools('', '', '', '', '', this.pageNumber, this.limit)
        .subscribe((res) => {
          this.schools = this.dashService.getSchools();
        });
    }
  }

  change(value) {
    this.limit = value;
    if (this.limit) {
      this.dashService
        .fetchSchools('', '', '', '', '', this.pageNumber, this.limit)
        .subscribe((res) => {
          this.totalPages = +res.data.totalPages;
          this.pages = [];
          for (let i = 1; i <= this.totalPages; i++) {
            this.pages.push(i);
          }
          this.schools = this.dashService.getSchools();
          this.pageNumber = +res.data.pageNumber;
          this.limit = +res.data.limit;
        });
    }
  }

  search(searchTerm) {
    this.keyword = searchTerm;
    this.dashService
      .fetchSchools('', '', this.keyword, '', '')
      .subscribe((res) => {
        this.schools = this.dashService.getSchools();
      });
  }

  sort(name) {
    this.sortOrder = this.sortOrder === '1' ? '-1' : '1';
    this.sortBy = name;
    this.dashService
      .fetchSchools('', '', '', this.sortBy, this.sortOrder)
      .subscribe((res) => {
        this.schools = this.dashService.getSchools();
      });
  }

  isFirstPage(): boolean {
    return this.pageNumber === this.pages[0];
  }

  isLastPage(): boolean {
    return this.pageNumber === this.pages[this.pages.length - 1];
  }
}
