import { Subject } from 'rxjs';
import { Student } from './student.model';

export class StudentService {
  studentsChanged = new Subject<Student[]>();

  students: Student[] = [
    new Student(
      'Test Id',
      'Test Name',
      7798813105,
      'Test address',
      1,
      'https://medical.dpu.edu.in/images/infrastructure/infrastructure-new/Infrastructure-01.jpg',
      new Date(),
      true,
      false,
      'Test School Id',
      1,
      'Test Message'
    ),
  ];

  getStudents() {
    return this.students.slice();
  }

  getStudentById(id: number) {
    return this.students[id];
  }

  addStudent(student: Student) {
    this.students.push(student);
    this.studentsChanged.next(this.students.slice());
  }

  updateStudent(id: number, student: Student) {
    this.students[id] = student;
    this.studentsChanged.next(this.students.slice());
  }

  deleteStudent(id: number) {
    this.students.splice(id, 1);
    this.studentsChanged.next(this.students.slice());
  }
}
