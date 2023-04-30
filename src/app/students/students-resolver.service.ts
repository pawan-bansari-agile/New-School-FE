import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { Student } from './student.model';
import { StudentSearchResponse, StudentService } from './student.service';

@Injectable({ providedIn: 'root' })
export class StudentResolver
  implements Resolve<StudentSearchResponse | Student[]>
{
  constructor(private studentService: StudentService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ):
    | StudentSearchResponse
    | Observable<StudentSearchResponse>
    | Promise<StudentSearchResponse>
    | Student[] {
    const students = this.studentService.getStudents();
    if (students.length === 0) {
      return this.studentService.onInint();
    } else {
      return students;
    }
  }
}
