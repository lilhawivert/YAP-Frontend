import { Component } from '@angular/core';
import { UserService } from '../user.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.css'
})
export class ToolbarComponent {

  constructor(public userService: UserService) {}

  onLogoutClick(): void {
    this.userService.userLoggedIn = false;
  }

}
