import { Component } from '@angular/core';
import { School } from './school.model';

@Component({
  selector: 'app-schools',
  templateUrl: './schools.component.html',
  styleUrls: ['./schools.component.css'],
})
export class SchoolsComponent {
  selectedSchool: School;
}
