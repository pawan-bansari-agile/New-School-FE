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

@Injectable()
export class StudentService {
  studentsChanged = new Subject<Student[]>();

  errorEmitter = new BehaviorSubject<string>(null);

  constructor(private http: HttpClient) {}

  students: Student[] = [
    // new Student(
    //   'Test Id',
    //   'Test Name',
    //   7798813105,
    //   'Test address',
    //   1,
    //   'https://medical.dpu.edu.in/images/infrastructure/infrastructure-new/Infrastructure-01.jpg',
    //   new Date(),
    //   true,
    //   false,
    //   'Test School Id',
    //   1,
    //   'Test Message',
    // ),
  ];

  updatedStudent: Student;

  onInint() {
    return this.http
      .get<StudentSearchResponse>('http://localhost:3000/students/findAll')
      .pipe(
        tap((res) => {
          const student = res.data.studentUrl;
          this.setStudents(student);
        })
      );
    //   .subscribe((students) => {
    //     console.log('schools from school service', students);

    //     const student = students.data.studentUrl;
    //     this.setStudents(student);
    //     console.log('result after fetching', this.students);
    //   });
    // console.log('after completing the call', this.students);
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
      .pipe(
        catchError(
          // let errorMessage = 'An unknown error occured!';
          // if (!errRes.error || !errRes.error.message) {
          //   return throwError(errorMessage);
          // }
          // switch (errRes.error.message) {
          //   case 'School not selected!':
          //     errorMessage = 'School not selected!';
          //     break;
          //   case 'School not found!':
          //     errorMessage = 'School not found!';
          //     break;
          // }
          // return throwError(errorMessage);
          handleError
        )
      );
    // .subscribe((res) => {
    //   console.log('res from create call', res);
    // });
  }

  addStudent(student: Student, file) {
    // this.addInDb(student, file);
    this.students.push(student);
    console.log('students after adding', this.students);

    this.studentsChanged.next(this.students.slice());
  }

  updateInDb(id: number, student: Student, file) {
    console.log('toUpdate from updateschool call', id);
    console.log('school from updateschool call', student);
    const toUpdate = this.getStudentById(id);
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
    fd.append('name', student.name);
    fd.append('parentNumber', student.parentNumber.toString());
    fd.append('address', student.address);
    fd.append('std', student.std.toString());
    if (file) {
      fd.append('file', file, file.name);
    }
    fd.append('dob', student.dob.toString());
    console.log('fd from updateschool call', fd);

    let queryParams = new HttpParams();
    queryParams = queryParams.append('id', toUpdate._id);
    return this.http
      .patch('http://localhost:3000/students/update', fd, {
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
          //     case 'Student details not found!':
          //       errorMessage = 'Student details not found!';
          //       break;
          //   }
          //   return throwError(errorMessage);
          // }
          handleError
        )
      );
    // .subscribe((res) => {
    //   console.log('res from update call', res);
    // });
  }

  updateStudent(id: number, student: Student, file) {
    // const toUpdate = this.getStudentById(id);
    // this.updateInDb(toUpdate._id, student, file);
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
      .subscribe((res) => {
        console.log('response from delete call', res);
      });
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
    // const fd = new FormData();
    // fd.append;
    return this.http.patch(
      'http://localhost:3000/students/update/isActive',
      payload,
      {
        params: queryParams,
      }
    );
  }
}
