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
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthService } from './auth/auth.service';
import { LoadingSpinner } from './shared/loading css/loading-spinner.component';
import { AuthInterceptor } from './auth/auth-interceptor.service';
import { Alert } from './shared/alert/alert.component';
import { DashboardDetailComponent } from './dashboard/dashboard-detail/dashboard-detail.component';

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
    LoadingSpinner,
    Alert,
    DashboardDetailComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [
    SchoolService,
    StudentService,
    AuthService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
