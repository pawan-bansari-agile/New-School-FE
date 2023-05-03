import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { School } from '../schools/school.model';
import { SchoolSearchResponse, SchoolService } from '../schools/school.service';
import { DashBoardService } from './dashboard.service';

@Injectable({ providedIn: 'root' })
export class DashResolver implements Resolve<SchoolSearchResponse | School[]> {
  constructor(private dashService: DashBoardService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | SchoolSearchResponse
    | Observable<SchoolSearchResponse>
    | Promise<SchoolSearchResponse>
    | School[] {
    const schools = this.dashService.getSchools();
    if (schools.length === 0) {
      return this.dashService.fetchSchools('', '', '', '', '');
    } else {
      return schools;
    }
  }
}
