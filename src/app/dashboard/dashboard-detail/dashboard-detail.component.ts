import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { School } from 'src/app/schools/school.model';
import { SchoolService } from 'src/app/schools/school.service';
import { DashBoardService, StdCntRes } from '../dashboard.service';

@Component({
  selector: 'app-dashboard-detail',
  templateUrl: './dashboard-detail.component.html',
  styleUrls: ['./dashboard-detail.component.css'],
})
export class DashboardDetailComponent implements OnInit {
  // totalStudentCount: number = 0;
  // standard: number = 0;
  id: number;
  school: School;
  CountRes: StdCntRes[];

  constructor(
    private dashService: DashBoardService,
    private route: ActivatedRoute,
    private schoolService: SchoolService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = +params['id'];
      this.school = this.schoolService.getSchoolById(this.id);
      console.log('school from dashboard deetail component', this.school);
      this.getDetails(this.school.name);
    });
  }

  getDetails(schoolName: string) {
    console.log('this.school from getdetails method', this.school);

    console.log('from getdetails method', schoolName);

    this.dashService.standCount(schoolName).subscribe((res) => {
      console.log('res from count call', res);
      // res.data.map((item) => {
      //   this.standard = item._id;
      //   this.totalStudentCount = item.count;
      // });
      this.CountRes = res.data;
      console.log('this.CountRes', this.CountRes);
    });
  }
}
