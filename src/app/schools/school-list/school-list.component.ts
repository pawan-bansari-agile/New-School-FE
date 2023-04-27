import { Component, OnInit } from '@angular/core';
import { School } from '../school.model';
import { SchoolService } from '../school.service';

@Component({
  selector: 'app-school-list',
  templateUrl: './school-list.component.html',
  styleUrls: ['./school-list.component.css'],
})
export class SchoolListComponent implements OnInit {
  schools: School[];

  constructor(private schoolService: SchoolService) {}

  ngOnInit(): void {
    this.schools = this.schoolService.getSchools();
  }
}
