import { Subject } from 'rxjs';
import { School } from './school.model';

export class SchoolService {
  schoolsChanged = new Subject<School[]>();

  private schools: School[] = [
    new School(
      'Test Token',
      'Test Name',
      'test@test.com',
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
      'Another Test Token',
      'Another Test Name',
      'anotherTest@test.com',
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
      new Date()
    ),
  ];

  getSchools() {
    return this.schools.slice();
  }

  getSchoolById(id: number) {
    return this.schools[id];
  }

  addSchool(school: School) {
    this.schools.push(school);
    this.schoolsChanged.next(this.schools.slice());
  }

  updateSchool(id: number, school: School) {
    this.schools[id] = school;
    this.schoolsChanged.next(this.schools.slice());
  }

  deleteSchool(id: number) {
    this.schools.splice(id, 1);
    this.schoolsChanged.next(this.schools.slice());
  }
}
