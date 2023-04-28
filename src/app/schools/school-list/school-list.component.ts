import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { School } from '../school.model';
import { SchoolService } from '../school.service';

@Component({
  selector: 'app-school-list',
  templateUrl: './school-list.component.html',
  styleUrls: ['./school-list.component.css'],
})
export class SchoolListComponent implements OnInit {
  schools: School[];

  constructor(
    private schoolService: SchoolService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.schoolService.schoolsChanged.subscribe((schools: School[]) => {
      this.schools = schools;
    });
    this.schoolService.onInint();
    this.schools = this.schoolService.getSchools();
  }

  onNewSchool() {
    this.router.navigate(['new'], { relativeTo: this.route });
  }
}
