import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  constructor(private router: Router, private userService: UserService) {}

  registerSuccessful: boolean = false;
  registerFailed: boolean = false;

  applyForm = new FormGroup({
    username: new FormControl("", Validators.required),
    password: new FormControl("", Validators.required)
  })

  submitForm() {
    this.userService.register(
      this.applyForm.value.username ?? "",
      this.applyForm.value.password ?? ""
    ).subscribe(() => {
        this.userService.username = this.applyForm.value.username;
        this.userService.userLoggedIn = true;
        this.registerSuccessful = true;
        setTimeout(() => {
          this.router.navigate(["/"])
        }, 2000)
    }, () => {
      this.registerFailed = true;
      setTimeout(() => {
        this.registerFailed = false;
      }, 3000)
    })
  }

  switchToLogin() {
    this.router.navigate(["/login"])
  }

}
