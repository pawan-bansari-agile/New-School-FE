import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Subject, tap, throwError } from 'rxjs';
import { handleError } from '../students/student.service';
import { School } from './school.model';

export interface SchoolSearchResponse {
  data: {
    message: string;
    schoolsUrl: School[];
    pageNumber: string;
    limit: string;
  };
}

export interface citiesResponse {
  data: [
    {
      city: string;
    }
  ];
}

@Injectable()
export class SchoolService {
  schoolsChanged = new Subject<School[]>();

  constructor(private http: HttpClient) {}

  private schools: School[] = [];

  updatedSchool: School;
  error: string = null;
  errorEmitter = new BehaviorSubject<string>(null);

  onInint(
    fieldName: string,
    fieldValue: string,
    keyword: string,
    sortBy: string,
    sortOrder: string,
    pageNumber?: number,
    limit?: number
  ) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('fieldName', fieldName);
    queryParams = queryParams.append('fieldValue', fieldValue);
    if (pageNumber) {
      queryParams = queryParams.append('pageNumber', pageNumber);
    }
    if (limit) {
      queryParams = queryParams.append('limit', limit);
    }
    queryParams = queryParams.append('keyword', keyword);
    queryParams = queryParams.append('sortBy', sortBy);
    queryParams = queryParams.append('sortOrder', sortOrder);
    return this.http
      .get<SchoolSearchResponse>('http://localhost:3000/school/findAll', {
        params: queryParams,
      })
      .pipe(
        tap((res) => {
          const school = res.data.schoolsUrl;
          this.setSchools(school);
        })
      );
  }

  setSchools(schools: School[]) {
    this.schools = schools;
    this.schoolsChanged.next(this.schools.slice());
  }

  getSchools() {
    return this.schools.slice();
  }

  getSchoolById(id: number) {
    return this.schools[id];
  }

  setCities() {
    return this.http.get<citiesResponse>(
      'http://localhost:3000/school/findAll/cities'
    );
  }

  addInDb(school: School, file) {
    const fd = new FormData();
    fd.append('name', school.name);
    fd.append('email', school.email);
    fd.append('address', school.address);
    if (file) {
      fd.append('file', file, file.name);
    }
    fd.append('zipCode', school.zipCode.toString());
    fd.append('city', school.city);
    fd.append('state', school.state);
    fd.append('country', school.country);

    return this.http
      .post('http://localhost:3000/school/create', fd)
      .pipe(catchError(handleError));
  }

  addSchool(school: School, file: string) {
    // this.schools.push(school);
    this.schools.splice(0, 0, school);
    this.schoolsChanged.next(this.schools.slice());
  }

  updateInDb(id, school: School, file) {
    const toUpdate = this.getSchoolById(id);

    const fd = new FormData();
    fd.append('name', school.name);
    fd.append('email', school.email);
    fd.append('address', school.address);
    if (file) {
      fd.append('file', file, file.name);
    }
    fd.append('zipCode', school.zipCode.toString());
    fd.append('city', school.city);
    fd.append('state', school.state);
    fd.append('country', school.country);

    let queryParams = new HttpParams();
    queryParams = queryParams.append('id', toUpdate._id);
    return this.http
      .patch('http://localhost:3000/school/update', fd, {
        params: queryParams,
      })
      .pipe(catchError(handleError));
  }

  updateSchool(id: number, school: School, file: string) {
    this.schools[id] = school;

    this.schoolsChanged.next(this.schools.slice());
  }

  deleteFromDb(id: string) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('id', id);
    this.http
      .delete('http://localhost:3000/school/delete', {
        params: queryParams,
      })
      .subscribe((res) => {});
  }

  deleteSchool(id: number) {
    const toDelete = this.getSchoolById(id);
    this.deleteFromDb(toDelete._id);
    this.schools.splice(id, 1);
    this.schoolsChanged.next(this.schools.slice());
  }

  filter(fieldName: string, fieldValue: string) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('fieldName', fieldName);
    queryParams = queryParams.append('fieldValue', fieldValue);
    return this.http
      .get<SchoolSearchResponse>('http://localhost:3000/school/findAll', {
        params: queryParams,
      })
      .pipe(
        tap((res) => {
          const school = res.data.schoolsUrl;
          this.setSchools(school);
        })
      );
  }
}
