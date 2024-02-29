import { Component } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.css'
})
export class ToolbarComponent {

  constructor(public userService: UserService, private router: Router) {}

  onLogoutClick(): void {
    this.userService.userLoggedIn = false;
    localStorage.removeItem("username");
    this.router.navigate(["/login"])
  }

  public get getUsername(): string | null {
    return localStorage.getItem("username");
  }

  goToHomepage() {
    this.router.navigate(["/"])
  }

}
