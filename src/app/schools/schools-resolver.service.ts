import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { School } from './school.model';
import { SchoolSearchResponse, SchoolService } from './school.service';

@Injectable({ providedIn: 'root' })
export class SchoolResolver
  implements Resolve<SchoolSearchResponse | School[]>
{
  constructor(private schoolService: SchoolService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | SchoolSearchResponse
    | Observable<SchoolSearchResponse>
    | Promise<SchoolSearchResponse>
    | School[] {
    const schools = this.schoolService.getSchools();
    if (schools.length === 0) {
      return this.schoolService.onInint('', '', '', '', '');
    } else {
      return schools;
    }
  }
}
