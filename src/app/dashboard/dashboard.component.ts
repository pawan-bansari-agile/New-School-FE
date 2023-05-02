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
  schools: School[];
  school: School;
  user: User;
  isAuthenticated: string = '';
  private userSub: Subscription;
  private schoolSub: Subscription;
  totalStudCnt: number;
  countResponse = [];
  error: string = null;
  // students: Student[];

  constructor(
    private dashService: DashBoardService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
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
        console.log('school from dashboard', school);
      }
    });
    if (this.user) {
      this.dashService.fetchSchools().subscribe((res) => {
        this.schools = this.dashService.getSchools();
      });
      this.dashService.getTotalCount().subscribe((res) => {
        this.totalStudCnt = res.data[0].total;
      });
    } else {
      this.dashService
        .standCount(this.school.name)
        .subscribe((res: CountResponse) => {
          this.countResponse = res.data;
          console.log('from dascomp', this.countResponse);
        });
    }
    this.dashService.errorEmitter.subscribe((err) => {
      this.error = err;
    });
  }

  onUpdate(school) {
    this.router.navigate(['edit'], { relativeTo: this.route });
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
    this.schoolSub.unsubscribe();
  }
}
