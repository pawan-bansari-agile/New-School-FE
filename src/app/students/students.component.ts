import { Component, OnInit } from '@angular/core';
import { Student } from './student.model';
import { StudentService } from './student.service';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css'],
  providers: [StudentService],
})
export class StudentsComponent implements OnInit {
  selectedStudent: Student;

  constructor(private studentService: StudentService) {}

  ngOnInit(): void {
    this.studentService.selectedStudent.subscribe((student: Student) => {
      this.selectedStudent = student;
    });
  }
}
