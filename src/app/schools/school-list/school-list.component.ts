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
  availableCities: string[] = [];

  schools: School[];
  error: string = null;
  fieldName: string = '';
  fieldValue: string = '';
  pageNumber: number;
  limit: number = 10;
  keyword: string;
  sortBy: string = '';
  sortOrder: string = '';
  searchTerm = '';
  totalPages: number;
  pages: number[] = [];

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
        this.totalPages = +res.data.totalPages;
        for (let i = 1; i <= this.totalPages; i++) {
          this.pages.push(i);
        }
      });
    this.schools = this.schoolService.getSchools();
    this.schoolService.setCities().subscribe((res) => {
      res.data.map((item) => {
        if (!this.availableCities.includes(item.city)) {
          this.availableCities.push(item.city);
        }
      });
    });

    this.schoolService.errorEmitter.subscribe((err) => {
      this.error = err;
    });
  }

  onNewSchool() {
    this.router.navigate(['new'], { relativeTo: this.route });
  }

  onHandleError() {
    this.error = null;
  }

  filterOpts(form) {
    this.fieldName = form.value.fieldName;
    this.fieldValue = form.value.fieldValue;
    if (this.fieldName && this.fieldValue) {
      this.schoolService
        .filter(this.fieldName, this.fieldValue)
        .subscribe((res) => {
          this.schools = res.data.schoolsUrl;
        });
    }
  }

  change(value) {
    this.limit = value;
    if (this.limit) {
      this.schoolService
        .onInint('', '', '', '', '', this.pageNumber, this.limit)
        .subscribe((res) => {
          console.log('res', res);
          this.totalPages = +res.data.totalPages;
          this.pages = [];
          for (let i = 1; i <= this.totalPages; i++) {
            this.pages.push(i);
          }
          this.schools = this.schoolService.getSchools();
          this.pageNumber = +res.data.pageNumber;
          this.limit = +res.data.limit;
        });
    }
  }

  search(searchTerm) {
    this.keyword = searchTerm;
    this.schoolService
      .onInint('', '', this.keyword, '', '')
      .subscribe((res) => {
        this.schools = this.schoolService.getSchools();
      });
  }

  sort(name) {
    this.sortOrder = this.sortOrder === '1' ? '-1' : '1';
    this.sortBy = name;
    this.schoolService
      .onInint('', '', '', this.sortBy, this.sortOrder)
      .subscribe((res) => {
        this.schools = this.schoolService.getSchools();
      });
  }

  decrease() {
    if (this.pageNumber != this.pages[0]) {
      this.pageNumber--;
      this.schoolService
        .onInint('', '', '', '', '', this.pageNumber, this.limit)
        .subscribe((res) => {
          this.schools = this.schoolService.getSchools();
        });
    }
  }

  increase() {
    if (this.pageNumber != this.pages[this.pages.length - 1]) {
      this.pageNumber++;
      this.schoolService
        .onInint('', '', '', '', '', this.pageNumber, this.limit)
        .subscribe((res) => {
          this.schools = this.schoolService.getSchools();
        });
    }
  }

  isFirstPage(): boolean {
    return this.pageNumber === this.pages[0];
  }

  isLastPage(): boolean {
    return this.pageNumber === this.pages[this.pages.length - 1];
  }
}
