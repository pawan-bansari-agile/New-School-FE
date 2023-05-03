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
  id: number;
  school: School;
  CountRes: StdCntRes[] = [];

  constructor(
    private dashService: DashBoardService,
    private route: ActivatedRoute,
    private schoolService: SchoolService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = +params['id'];
      this.school = this.dashService.getSchoolById(this.id);
      this.getDetails(this.school.name);
    });
  }

  getDetails(schoolName: string) {
    this.dashService.standCount(schoolName).subscribe((res) => {
      this.CountRes = res.data;
    });
  }
}
