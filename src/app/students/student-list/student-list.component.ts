import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Student } from '../student.model';
import { StudentService } from '../student.service';
import { StatusUpdateRes } from '../student.service';

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

  updateStatus(i, student) {
    console.log('student from student component', student);
    const payload = {
      status: !student.status,
    };
    console.log('student from status update call', student);

    this.studentService.updateStatus(student._id, payload).subscribe(
      (res: StatusUpdateRes) => {
        this.students[i] = res.data.updatedDetails;
      },
      (err) => {
        console.log('erro from status update call', err);
      }
    );
  }
}
