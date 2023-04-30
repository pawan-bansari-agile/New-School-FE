import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Subject, tap, throwError } from 'rxjs';
import { handleError } from '../students/student.service';
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

  updatedSchool: School;
  error: string = null;

  onInint() {
    return this.http
      .get<SchoolSearchResponse>('http://localhost:3000/school/findAll')
      .pipe(
        tap((res) => {
          const school = res.data.schoolsUrl;
          this.setSchools(school);
        }),
      );
    // .subscribe((schools) => {
    //   console.log('schools from school service', schools);

    //   const school = schools.data.schoolsUrl;
    //   this.setSchools(school);
    //   console.log('result after fetching', this.schools);
    // });
    // console.log('after completing the call', this.schools);
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

    return this.http.post('http://localhost:3000/school/create', fd).pipe(
      catchError(
        //   (errRes) => {
        //   let errorMessage = 'An unknown error occured!';
        //   if (!errRes.error || !errRes.error.message) {
        //     return throwError(errorMessage);
        //   }
        //   switch (errRes.error.message) {
        //     case 'Entered email is not available to use! Please use another!':
        //       errorMessage =
        //         'Entered email is not available to use! Please use another!';
        //       break;
        //   }
        //   return throwError(errorMessage);
        // }
        handleError,
      ),
    );
    // .subscribe(
    //   (res) => {
    //     console.log('res from create call', res);
    //   },
    //   (err) => {
    //     if (!err.error || err.error.message) {
    //       this.error = 'An unknown error occured!';
    //     }
    //     switch (err.error.message) {
    //       case 'Entered email is not available to use! Please use another!':
    //         this.error =
    //           'Entered email is not available to use! Please use another!';
    //         break;
    //     }
    //     return throwError(this.error);
    //   },
    // );
  }

  addSchool(school: School, file) {
    // this.addInDb(school, file);
    this.schools.push(school);
    this.schoolsChanged.next(this.schools.slice());
  }

  updateInDb(id, school: School, file) {
    const toUpdate = this.getSchoolById(id);
    console.log('toUpdate from updateschool call', toUpdate);
    console.log('school from updateschool call', school);
    // const updatedSchool = {
    //   name: school.name,
    //   email: school.email,
    //   address: school.address,
    //   photo: school.photo ? school.photo : '',
    //   zipCode: school.zipCode,
    //   city: school.city,
    //   state: school.state,
    //   country: school.country,
    // };

    const fd = new FormData();
    fd.append('name', school.name);
    fd.append('email', school.email);
    fd.append('address', school.address);
    if (file) {
      fd.append('file', file, file.name);
    }
    // else {
    //   fd.append('file', null);
    // }
    fd.append('zipCode', school.zipCode.toString());
    fd.append('city', school.city);
    fd.append('state', school.state);
    fd.append('country', school.country);
    console.log('fd from updateschool call', fd);

    let queryParams = new HttpParams();
    queryParams = queryParams.append('id', toUpdate._id);
    return this.http
      .patch('http://localhost:3000/school/update', fd, {
        params: queryParams,
      })
      .pipe(
        catchError(
          //   (errRes) => {
          //   let errorMessage = 'An unknown error occured!';
          //   if (!errRes.error || !errRes.error.message) {
          //     return throwError(errorMessage);
          //   }
          //   switch (errRes.error.message) {
          //     case 'School not found!':
          //       errorMessage = 'School not found!';
          //       break;
          //   }
          //   return throwError(errorMessage);
          // }
          handleError,
        ),
      );
    // .subscribe((res) => {
    //   console.log('res from update call', res);
    // });
  }

  updateSchool(id: number, school: School, file: File) {
    // const toUpdate = this.getSchoolById(id);
    // console.log('toUpdate', toUpdate);

    // this.updateInDb(toUpdate, school, file);
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
      .subscribe((res) => {
        console.log('response from delete call', res);
      });
  }

  deleteSchool(id: number) {
    const toDelete = this.getSchoolById(id);
    this.deleteFromDb(toDelete._id);
    this.schools.splice(id, 1);
    this.schoolsChanged.next(this.schools.slice());
  }
}
