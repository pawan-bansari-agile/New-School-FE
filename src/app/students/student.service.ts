import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Subject, tap, throwError } from 'rxjs';
import { Student } from './student.model';

export interface StudentSearchResponse {
  data: {
    message: string;
    studentUrl: Student[];
    pageNumber: string;
    limit: string;
    totalPages: number;
  };
}

export function handleError(errRes: HttpErrorResponse) {
  let errorMessage = 'An unknown error occured!';
  if (!errRes.error || !errRes.error.message) {
    return throwError(errorMessage);
  }
  switch (errRes.error.message) {
    case 'School not selected!':
      errorMessage = 'School not selected!';
      break;
    case 'School not found!':
      errorMessage = 'School not found!';
      break;
    case 'User not found!':
      errorMessage = 'User not found!';
      break;
    case 'Bad Credentials!':
      errorMessage = 'Bad Credentials!';
      break;
    case 'Entered email is not available to use! Please use another!':
      errorMessage =
        'Entered email is not available to use! Please use another!';
      break;
  }
  return throwError(errorMessage);
}

export interface StatusUpdateRes {
  data: {
    updatedDetails: Student;
    message: string;
  };
}

export interface SchoolList {
  data: [
    {
      name: string;
    }
  ];
}

export interface StdList {
  data: [
    {
      std: number;
    }
  ];
}

@Injectable()
export class StudentService {
  studentsChanged = new Subject<Student[]>();

  errorEmitter = new BehaviorSubject<string>(null);

  constructor(private http: HttpClient) {}

  students: Student[] = [];

  updatedStudent: Student;

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
      .get<StudentSearchResponse>('http://localhost:3000/students/findAll', {
        params: queryParams,
      })
      .pipe(
        tap((res) => {
          const student = res.data.studentUrl;
          this.setStudents(student);
        })
      );
  }

  setStudents(students: Student[]) {
    this.students = students;
    this.studentsChanged.next(this.students.slice());
  }

  getStudents() {
    return this.students.slice();
  }

  getStudentById(id: number) {
    return this.students[id];
  }

  addInDb(student: Student, file) {
    const fd = new FormData();
    fd.append('name', student.name);
    fd.append('parentNumber', student.parentNumber.toString());
    fd.append('address', student.address);
    fd.append('std', student.std.toString());
    if (file) {
      fd.append('file', file, file.name);
    }
    fd.append('dob', student.dob.toString());
    fd.append('school', student.school); /*todo:- pass school id dynamically */

    let queryParams = new HttpParams();
    queryParams = queryParams.append('id', student.school);

    return this.http
      .post('http://localhost:3000/students/create', fd, {
        params: queryParams,
      })
      .pipe(catchError(handleError));
  }

  addStudent(student: Student, file) {
    // this.students.push(student);
    this.students.splice(0, 0, student);
    this.studentsChanged.next(this.students.slice());
  }

  updateInDb(id: number, student: Student, file) {
    const toUpdate = this.getStudentById(id);

    const fd = new FormData();
    fd.append('name', student.name);
    fd.append('parentNumber', student.parentNumber.toString());
    fd.append('address', student.address);
    fd.append('std', student.std.toString());
    if (file) {
      fd.append('file', file, file.name);
    }
    fd.append('dob', student.dob.toString());

    let queryParams = new HttpParams();
    queryParams = queryParams.append('id', toUpdate._id);
    return this.http
      .patch('http://localhost:3000/students/update', fd, {
        params: queryParams,
      })
      .pipe(catchError(handleError));
  }

  updateStudent(id: number, student: Student, file) {
    this.students[id] = student;
    this.studentsChanged.next(this.students.slice());
  }

  deleteFromDb(id: string) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('id', id);
    this.http
      .delete('http://localhost:3000/students/delete', {
        params: queryParams,
      })
      .subscribe((res) => {});
  }

  deleteStudent(id: number) {
    const toDelete = this.getStudentById(id);
    this.deleteFromDb(toDelete._id);
    this.students.splice(id, 1);
    this.studentsChanged.next(this.students.slice());
  }

  updateStatus(id: string, payload) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('id', id);
    return this.http.patch(
      'http://localhost:3000/students/update/isActive',
      payload,
      {
        params: queryParams,
      }
    );
  }

  filter(fieldName: string, fieldValue: string) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('fieldName', fieldName);
    queryParams = queryParams.append('fieldValue', fieldValue);
    return this.http
      .get<StudentSearchResponse>('http://localhost:3000/students/findAll', {
        params: queryParams,
      })
      .pipe(
        tap((res) => {
          const school = res.data.studentUrl;
          this.setStudents(school);
        })
      );
  }

  getAllSchools() {
    return this.http.get<SchoolList>(
      'http://localhost:3000/school/getAll/schools'
    );
  }

  getAllStds() {
    return this.http.get<StdList>('http://localhost:3000/students/getAllStds');
  }
}
