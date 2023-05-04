import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, tap } from 'rxjs';
import { School } from '../schools/school.model';
import { SchoolSearchResponse, SchoolService } from '../schools/school.service';
import {
  handleError,
  StudentSearchResponse,
  StudentService,
} from '../students/student.service';

export interface StdCntRes {
  _id: number;
  count: number;
}

export interface CountResponse {
  data: StdCntRes[];
}

export interface TotalStudCount {
  data: [
    {
      total: number;
    }
  ];
}

@Injectable({ providedIn: 'root' })
export class DashBoardService {
  constructor(
    private schoolService: SchoolService,
    private studentService: StudentService,
    private http: HttpClient
  ) {}

  schools: School[] = [];
  totalCount: number;
  stdCount: number;
  schoolCount: number;
  errorEmitter = new BehaviorSubject<string>(null);
  updatedSchool = new BehaviorSubject<School>(null);

  fetchSchools(
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
  }

  getSchools() {
    return this.schools.slice();
  }

  getSchoolById(id: number) {
    return this.schools[id];
  }

  standCount(schlName: string) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('school', schlName);
    return this.http.get<CountResponse>(
      'http://localhost:3000/students/totalCount',
      { params: queryParams }
    );
  }

  getTotalCount() {
    return this.http
      .get('http://localhost:3000/students/totalStudentCount')
      .pipe(
        tap((res: TotalStudCount) => {
          return res.data[0].total;
        })
      );
  }

  updateInDb(id, school: School, file) {
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
    queryParams = queryParams.append('id', id);
    return this.http
      .patch('http://localhost:3000/school/update', fd, {
        params: queryParams,
      })
      .pipe(catchError(handleError));
  }
}
