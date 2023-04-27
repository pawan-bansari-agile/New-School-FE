import { EventEmitter } from '@angular/core';
import { Student } from './student.model';

export class StudentService {
  students: Student[] = [
    new Student(
      'Test Id',
      'Test Name',
      7798813105,
      'Test address',
      1,
      'Test Image',
      new Date(),
      true,
      false,
      'Test School Id',
      1,
      'Test Message',
    ),
  ];

  selectedStudent = new EventEmitter<Student>();

  getStudents() {
    return this.students.slice();
  }

  getStudentById(id: number) {
    return this.students[id];
  }
}
