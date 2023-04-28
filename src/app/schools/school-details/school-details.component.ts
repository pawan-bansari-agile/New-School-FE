import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { School } from '../school.model';
import { SchoolService } from '../school.service';

@Component({
  selector: 'app-school-details',
  templateUrl: './school-details.component.html',
  styleUrls: ['./school-details.component.css'],
})
export class SchoolDetailsComponent implements OnInit {
  school: School;
  id: number;

  constructor(
    private schoolService: SchoolService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = +params['id'];
      this.school = this.schoolService.getSchoolById(this.id);
    });
  }

  onEditSchool() {
    this.router.navigate(['edit'], { relativeTo: this.route });
  }

  onDeleteSchool() {
    this.schoolService.deleteSchool(this.id);
    this.router.navigate(['/schools']);
  }
}
