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
  limit: number;
  keyword: string;
  sortBy: string = '';
  sortOrder: string = '';

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
    if (this.pageNumber != 1) {
      this.pageNumber--;
      this.dashService
        .fetchSchools('', '', '', '', '', this.pageNumber, this.limit)
        .subscribe((res) => {
          this.schools = this.dashService.getSchools();
        });
    }
  }

  increase() {
    if (this.schools.length != 0) {
      this.pageNumber++;
      this.dashService
        .fetchSchools('', '', '', '', '', this.pageNumber, this.limit)
        .subscribe((res) => {
          this.schools = this.dashService.getSchools();
        });
    }
  }

  change(form) {
    this.limit = form.value.entries;
    this.dashService
      .fetchSchools('', '', '', '', '', this.pageNumber, this.limit)
      .subscribe((res) => {
        this.schools = this.dashService.getSchools();
        this.pageNumber = +res.data.pageNumber;
        this.limit = +res.data.limit;
      });
  }

  search(form) {
    this.keyword = form.value.search;
    this.dashService
      .fetchSchools('', '', this.keyword, '', '')
      .subscribe((res) => {
        this.schools = this.dashService.getSchools();
      });
  }

  sort(form) {
    this.sortBy = form.value.sortBy;
    this.sortOrder = form.value.sortOrder;
    this.dashService
      .fetchSchools('', '', '', this.sortBy, this.sortOrder)
      .subscribe((res) => {
        this.schools = this.dashService.getSchools();
      });
  }
}
