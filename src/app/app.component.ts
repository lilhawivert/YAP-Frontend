import { Component } from '@angular/core';
import { UserService } from './user.service';
import { RootService } from './root.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend';

  constructor(public userService: UserService, public rootService: RootService) {}

  ngOnInit() {

  }
}
