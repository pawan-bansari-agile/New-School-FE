import { Component, OnInit } from '@angular/core';
import { School } from './school.model';
import { SchoolService } from './school.service';

@Component({
  selector: 'app-schools',
  templateUrl: './schools.component.html',
  styleUrls: ['./schools.component.css'],
  providers: [SchoolService],
})
export class SchoolsComponent implements OnInit {
  selectedSchool: School;

  constructor(private schoolService: SchoolService) {}

  ngOnInit(): void {
    this.schoolService.selectedSchool.subscribe((school: School) => {
      this.selectedSchool = school;
    });
  }
}
