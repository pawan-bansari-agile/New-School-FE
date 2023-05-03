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
  fieldName: string = '';
  fieldValue: string = '';
  pageNumber: number;
  limit: number;
  keyword: string;
  sortBy: string = '';
  sortOrder: string = '';

  constructor(
    private schoolService: SchoolService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.schoolService.schoolsChanged.subscribe((schools: School[]) => {
      this.schools = schools;
    });
    this.schoolService
      .onInint('', '', '', '', '', this.pageNumber, this.limit)
      .subscribe((res) => {
        this.pageNumber = +res.data.pageNumber;
        this.limit = +res.data.limit;
      });
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

  filterOpts(form) {
    console.log('value from filter method', form.value);
    this.fieldName = form.value.fieldName;
    this.fieldValue = form.value.fieldValue;
    this.schoolService
      .filter(this.fieldName, this.fieldValue)
      .subscribe((res) => {
        this.schools = res.data.schoolsUrl;
      });
  }

  change(form) {
    this.limit = form.value.entries;
    this.schoolService
      .onInint('', '', '', '', '', this.pageNumber, this.limit)
      .subscribe((res) => {
        this.schools = this.schoolService.getSchools();
        this.pageNumber = +res.data.pageNumber;
        this.limit = +res.data.limit;
      });
  }

  search(form) {
    console.log('value from search input', form.value);
    this.keyword = form.value.search;
    this.schoolService
      .onInint('', '', this.keyword, '', '')
      .subscribe((res) => {
        console.log('res from search method', res);

        this.schools = this.schoolService.getSchools();
        // this.pageNumber = +res.data.pageNumber;
        // this.limit = +res.data.limit;
      });
  }

  sort(form) {
    console.log('value from sorting method', form.value);
    this.sortBy = form.value.sortBy;
    this.sortOrder = form.value.sortOrder;
    this.schoolService
      .onInint('', '', '', this.sortBy, this.sortOrder)
      .subscribe((res) => {
        console.log('res from search method', res);

        this.schools = this.schoolService.getSchools();
        // this.pageNumber = +res.data.pageNumber;
        // this.limit = +res.data.limit;
      });
  }

  decrease() {
    if (this.pageNumber != 1) {
      this.pageNumber--;
      this.schoolService
        .onInint('', '', '', '', '', this.pageNumber, this.limit)
        .subscribe((res) => {
          this.schools = this.schoolService.getSchools();
          // this.pageNumber = +res.data.pageNumber;
          // this.limit = +res.data.limit;
        });
    }
  }

  increase() {
    if (this.schools.length != 0) {
      this.pageNumber++;
      this.schoolService
        .onInint('', '', '', '', '', this.pageNumber, this.limit)
        .subscribe((res) => {
          this.schools = this.schoolService.getSchools();
          // this.pageNumber = +res.data.pageNumber;
          // this.limit = +res.data.limit;
        });
    }
  }
}
