import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Student } from '../student.model';
import { StudentService } from '../student.service';

@Component({
  selector: 'app-student-details',
  templateUrl: './student-details.component.html',
  styleUrls: ['./student-details.component.css'],
})
export class StudentDetailsComponent implements OnInit {
  student: Student;
  id: number;

  constructor(
    private studentService: StudentService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = +params['id'];
      this.student = this.studentService.getStudentById(this.id);
    });
  }

  onEditStudent() {
    this.router.navigate(['edit'], { relativeTo: this.route });
  }

  onDeleteStudent() {
    this.studentService.deleteStudent(this.id);
    this.router.navigate(['/students']);
  }
}
