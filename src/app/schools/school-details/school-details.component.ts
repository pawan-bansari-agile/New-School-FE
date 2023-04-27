import { Component, Input } from '@angular/core';
import { School } from '../school.model';

@Component({
  selector: 'app-school-details',
  templateUrl: './school-details.component.html',
  styleUrls: ['./school-details.component.css'],
})
export class SchoolDetailsComponent {
  @Input() selectedSchool: School = null;
}
