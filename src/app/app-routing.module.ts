import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SchoolDetailsComponent } from './schools/school-details/school-details.component';
import { SchoolStartComponent } from './schools/school-start/school-start.component';
import { SchoolsComponent } from './schools/schools.component';
import { StudentDetailsComponent } from './students/student-details/student-details.component';
import { StudentStartComponent } from './students/student-start/student-start.component';
import { StudentsComponent } from './students/students.component';

const appRoutes: Routes = [
  { path: '', redirectTo: '/auth', pathMatch: 'full' },
  { path: 'auth', component: AuthComponent },
  { path: 'dashboard', component: DashboardComponent },
  {
    path: 'schools',
    component: SchoolsComponent,
    children: [
      { path: '', component: SchoolStartComponent },
      { path: ':id', component: SchoolDetailsComponent },
    ],
  },
  {
    path: 'students',
    component: StudentsComponent,
    children: [
      { path: '', component: StudentStartComponent },
      { path: ':id', component: StudentDetailsComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
