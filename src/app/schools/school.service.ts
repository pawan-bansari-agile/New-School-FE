import { EventEmitter } from '@angular/core';
import { School } from './school.model';

export class SchoolService {
  private schools: School[] = [
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
      new Date(),
    ),
    new School(
      'Another Test Token',
      'Another Test Name',
      'Another Test Email',
      'Another Test Address',
      'https://medical.dpu.edu.in/images/infrastructure/infrastructure-new/Infrastructure-01.jpg',
      411017,
      'Another Test City',
      'Another Test State',
      'Another Test Country',
      'Another Test Role',
      'Another Test forgetPwdToken',
      new Date(),
      'Another Test deleted',
      'Another Test _id',
      1,
      'Another Test Message',
      new Date(),
    ),
  ];

  selectedSchool = new EventEmitter<School>();

  getSchools() {
    return this.schools.slice();
  }

  getSchoolById(id: number) {
    return this.schools[id];
  }
}
