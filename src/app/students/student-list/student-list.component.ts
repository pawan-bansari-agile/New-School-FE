import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Student } from '../student.model';
import { StudentService } from '../student.service';

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.css'],
})
export class StudentListComponent implements OnInit {
  students: Student[];
  error: string = null;

  constructor(
    private studentService: StudentService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.studentService.studentsChanged.subscribe((students: Student[]) => {
      this.students = students;
    });
    this.studentService.onInint().subscribe();
    this.students = this.studentService.getStudents();
    this.studentService.errorEmitter.subscribe((err) => {
      this.error = err;
    });
  }

  onNewStudent() {
    this.router.navigate(['new'], { relativeTo: this.route });
  }

  onHandleError() {
    this.error = null;
  }
}
