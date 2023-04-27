import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolStartComponent } from './school-start.component';

describe('SchoolStartComponent', () => {
  let component: SchoolStartComponent;
  let fixture: ComponentFixture<SchoolStartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchoolStartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SchoolStartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
