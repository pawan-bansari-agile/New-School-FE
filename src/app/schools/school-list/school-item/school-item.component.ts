import { Component, Input } from '@angular/core';
import { School } from '../../school.model';

@Component({
  selector: 'app-school-item',
  templateUrl: './school-item.component.html',
  styleUrls: ['./school-item.component.css'],
})
export class SchoolItemComponent {
  @Input() school: School;

  showDetails(school) {
    console.log('showDetails', school);
  }
}
