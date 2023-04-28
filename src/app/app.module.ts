import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { AuthComponent } from './auth/auth.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SchoolsComponent } from './schools/schools.component';
import { StudentsComponent } from './students/students.component';
import { SchoolListComponent } from './schools/school-list/school-list.component';
import { SchoolDetailsComponent } from './schools/school-details/school-details.component';
import { SchoolItemComponent } from './schools/school-list/school-item/school-item.component';
import { StudentListComponent } from './students/student-list/student-list.component';
import { StudentDetailsComponent } from './students/student-details/student-details.component';
import { StudentItemComponent } from './students/student-list/student-item/student-item.component';
import { DropDownDirective } from './shared/dropdown.directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { SchoolStartComponent } from './schools/school-start/school-start.component';
import { StudentStartComponent } from './students/student-start/student-start.component';
import { SchoolService } from './schools/school.service';
import { StudentService } from './students/student.service';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    AuthComponent,
    DashboardComponent,
    SchoolsComponent,
    StudentsComponent,
    SchoolListComponent,
    SchoolDetailsComponent,
    SchoolItemComponent,
    StudentListComponent,
    StudentDetailsComponent,
    StudentItemComponent,
    DropDownDirective,
    SchoolStartComponent,
    StudentStartComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [SchoolService, StudentService],
  bootstrap: [AppComponent],
})
export class AppModule {}
