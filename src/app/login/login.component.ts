import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {

  constructor(private router: Router, private userService: UserService) {}

  applyForm = new FormGroup({
    username: new FormControl("", Validators.required),
    password: new FormControl("", Validators.required)
  })

  submitForm() {
    this.userService.login(
      this.applyForm.value.username ?? "",
      this.applyForm.value.password ?? ""
    )
  }

  switchToRegister() {
    this.router.navigate(["/register"]);
    // this.rootService.showingRegister = true;
  }

}
