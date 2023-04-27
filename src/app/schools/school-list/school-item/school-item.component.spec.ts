import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolItemComponent } from './school-item.component';

describe('SchoolItemComponent', () => {
  let component: SchoolItemComponent;
  let fixture: ComponentFixture<SchoolItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchoolItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SchoolItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
