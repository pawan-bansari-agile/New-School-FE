import { Component, OnInit } from '@angular/core';
import { School } from '../schools/school.model';
import { SchoolSearchResponse, SchoolService } from '../schools/school.service';
import { Student } from '../students/student.model';
import { StudentService } from '../students/student.service';
import { DashBoardService } from './dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  schools: School[];
  // students: Student[];

  constructor(private dashService: DashBoardService) {}

  ngOnInit() {
    this.dashService.fetchSchools().subscribe((res) => {
      this.schools = res.data.schoolsUrl;
      console.log('schools from dashboard service', this.schools);
    });
  }
}
