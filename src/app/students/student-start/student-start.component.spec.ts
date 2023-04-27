import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentStartComponent } from './student-start.component';

describe('StudentStartComponent', () => {
  let component: StudentStartComponent;
  let fixture: ComponentFixture<StudentStartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentStartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentStartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
