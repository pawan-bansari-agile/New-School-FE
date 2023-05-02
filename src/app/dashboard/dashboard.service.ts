import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { School } from '../schools/school.model';
import { SchoolSearchResponse, SchoolService } from '../schools/school.service';
import {
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

  fetchSchools() {
    return this.http
      .get<SchoolSearchResponse>('http://localhost:3000/school/findAll')
      .pipe(
        tap((res) => {
          const school = res.data.schoolsUrl;
          console.log('from fetchschools dash service', school);

          this.setSchools(school);
        })
      );
  }

  setSchools(schools: School[]) {
    console.log('from set schools dah service', schools);

    this.schools = schools;
    // this.schoolsChanged.next(this.schools.slice());
  }

  getSchools() {
    console.log('from getschools dash service', this.schools);

    return this.schools.slice();
  }

  getSchoolById(id: number) {
    return this.schools[id];
  }

  // getStudents(id: string) {
  //   let queryParams = new HttpParams();
  //   // queryParams = queryParams.append();
  //   return this.http.get<StudentSearchResponse>(
  //     'http://localhost:3000/students/findAll'
  //   );
  // }

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
}
