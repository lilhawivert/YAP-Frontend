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

  loginFailed: boolean = false;
  loginFailedAnzahl: number = 0;
  disableLoginButton: boolean = false;
  down: boolean = false;
  showingPassword: boolean = false;

  applyForm = new FormGroup({
    username: new FormControl("", Validators.required),
    password: new FormControl("", Validators.required)
  })

  ngOnInit() {
    if(localStorage.getItem("username")) this.router.navigate(["/"]);
  }

  changePasswordVisibility(){
    this.showingPassword = !this.showingPassword;
  }

  submitForm() {
    this.userService.login(
      this.applyForm.value.username ?? "",
      this.applyForm.value.password ?? ""
    ).subscribe(() => {
      this.userService.username = this.applyForm.value.username;
      this.userService.userLoggedIn = true;
      localStorage.setItem("username", this.userService.username || "");
      this.router.navigate(["/"])
  }, (err: any) => {
    if(err.status == 0) this.down = true;
    else {
      this.loginFailed = true;
      if(++this.loginFailedAnzahl >= 3) this.disableLoginButton = true;
    }
    setTimeout(() => {
      this.loginFailed = false;
    }, 5000)
  });
  }

  switchToRegister() {
    this.router.navigate(["/register"]);
    // this.rootService.showingRegister = true;
  }

}
