import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  constructor(private authService: AuthService) {}

  private userSub: Subscription;
  private schoolSub: Subscription;
  isAuthenticated = false;

  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe((user) => {
      this.isAuthenticated = !!user;
    });
    this.schoolSub = this.authService.school.subscribe((school) => {
      this.isAuthenticated = !!school;
    });
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
    this.schoolSub.unsubscribe();
  }
}
