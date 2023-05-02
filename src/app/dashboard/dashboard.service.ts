import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { School } from '../schools/school.model';
import { SchoolService } from '../schools/school.service';
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

@Injectable({ providedIn: 'root' })
export class DashBoardService {
  constructor(
    private schoolService: SchoolService,
    private studentService: StudentService,
    private http: HttpClient
  ) {}

  schools: School[];
  totalCount: number;
  stdCount: number;
  schoolCount: number;

  fetchSchools() {
    return this.schoolService.onInint();
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
}
