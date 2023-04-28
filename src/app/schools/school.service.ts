import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { School } from './school.model';

export interface SchoolSearchResponse {
  data: {
    message: string;
    schoolsUrl: School[];
  };
}

@Injectable()
export class SchoolService {
  schoolsChanged = new Subject<School[]>();

  constructor(private http: HttpClient) {}

  private schools: School[] = [];

  onInint() {
    this.http
      .get<SchoolSearchResponse>('http://localhost:3000/school/findAll')
      .subscribe((schools) => {
        console.log('schools from school service', schools);

        const school = schools.data.schoolsUrl;
        this.setSchools(school);
        console.log('result after fetching', this.schools);
      });
    console.log('after completing the call', this.schools);
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

  addSchool(school: School) {
    this.schools.push(school);
    this.schoolsChanged.next(this.schools.slice());
  }

  updateSchool(id: number, school: School) {
    this.schools[id] = school;
    this.schoolsChanged.next(this.schools.slice());
  }

  deleteSchool(id: number) {
    this.schools.splice(id, 1);
    this.schoolsChanged.next(this.schools.slice());
  }
}
