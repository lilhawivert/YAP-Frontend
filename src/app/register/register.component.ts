import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  constructor(private router: Router, private userService: UserService) {}

  applyForm = new FormGroup({
    username: new FormControl(""),
    password: new FormControl("")
  })

  submitForm() {
    this.userService.register(
      this.applyForm.value.username ?? "",
      this.applyForm.value.password ?? ""
    )
  }

  switchToLogin() {
    this.router.navigate(["/login"])
  }

}
