import { Component, EventEmitter, Output } from '@angular/core';
import { School } from '../school.model';

@Component({
  selector: 'app-school-list',
  templateUrl: './school-list.component.html',
  styleUrls: ['./school-list.component.css'],
})
export class SchoolListComponent {
  schools: School[] = [
    new School(
      'Test Token',
      'Test Name',
      'Test Email',
      'Test Address',
      'https://medical.dpu.edu.in/images/infrastructure/infrastructure-new/Infrastructure-01.jpg',
      411017,
      'Test City',
      'Test State',
      'Test Country',
      'Test Role',
      'Test forgetPwdToken',
      new Date(),
      'Test deleted',
      'Test _id',
      1,
      'Test Message',
      new Date()
    ),
    new School(
      'Test Token',
      'Test Name',
      'Test Email',
      'Test Address',
      'https://medical.dpu.edu.in/images/infrastructure/infrastructure-new/Infrastructure-01.jpg',
      411017,
      'Test City',
      'Test State',
      'Test Country',
      'Test Role',
      'Test forgetPwdToken',
      new Date(),
      'Test deleted',
      'Test _id',
      1,
      'Test Message',
      new Date()
    ),
  ];

  @Output() selectedSchool = new EventEmitter<School>();

  showDetails(school) {
    this.selectedSchool.emit(school);
  }
}
