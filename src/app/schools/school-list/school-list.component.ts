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
  error: string = null;
  pageSize: number = 5;
  currentPage: number = 1;
  totalPages: number;
  pages: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  searchQuery: string;

  constructor(
    private schoolService: SchoolService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.schoolService.schoolsChanged.subscribe((schools: School[]) => {
      this.schools = schools;
    });
    this.schoolService.onInint().subscribe();
    this.schools = this.schoolService.getSchools();
    this.schoolService.errorEmitter.subscribe((err) => {
      this.error = err;
    });
  }

  // setError(value) {
  //   console.log('value from set error ', value);

  //   this.error = value;
  // }

  onNewSchool() {
    this.router.navigate(['new'], { relativeTo: this.route });
  }

  onHandleError() {
    this.error = null;
  }
}
