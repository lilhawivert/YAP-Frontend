import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent implements OnInit {

  constructor(public userService: UserService, private router: Router) {}

  ngOnInit() {
    if(!this.userService.userLoggedIn) this.router.navigate(["/login"])
  }

}
