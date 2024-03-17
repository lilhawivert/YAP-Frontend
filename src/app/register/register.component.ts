import { Component } from '@angular/core';
import {FormControl, FormGroup, Validators, ɵFormGroupRawValue, ɵGetProperty, ɵTypedOrUntyped} from '@angular/forms';
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
  down: boolean = false;
  showingPassword: boolean = false;

  applyForm = new FormGroup({
    username: new FormControl("", Validators.required),
    password: new FormControl("", Validators.required)
  })

  ngOnInit() {
    if(localStorage.getItem("username")) this.router.navigate(["/"])
  }

  changePasswordVisibility(){
    this.showingPassword = !this.showingPassword;
  }

  submitForm() {
    this.userService.register(
      this.applyForm.value.username ?? "",
      this.applyForm.value.password ?? ""
    ).subscribe(() => {
        this.userService.username = this.applyForm.value.username;
        this.userService.userLoggedIn = true;
        this.registerSuccessful = true;
        setTimeout(() => {
          this.router.navigate(["/login"])
        }, 2000)
    }, (err) => {
      if(err.status == 0) this.down = true;
      else this.registerFailed = true;
      setTimeout(() => {
        this.registerFailed = false;
      }, 3000)
    })
  }

  switchToLogin() {
    this.router.navigate(["/login"])
  }

  checkValidUsername(username: ɵGetProperty<ɵTypedOrUntyped<{
    password: FormControl<string | null>;
    username: FormControl<string | null>
  }, ɵFormGroupRawValue<{
    password: FormControl<string | null>;
    username: FormControl<string | null>
  }>, any>, "username"> | undefined): boolean{
    return /^[a-zA-Z0-9]*$/.test(<string>username);
  }

}
