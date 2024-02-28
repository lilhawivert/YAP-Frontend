import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../user.service';
import { RootService } from '../root.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {

  constructor(private userService: UserService, private rootService: RootService) {}

  applyForm = new FormGroup({
    username: new FormControl(""),
    password: new FormControl("")
  })

  submitForm() {
    this.userService.login(
      this.applyForm.value.username ?? "",
      this.applyForm.value.password ?? ""
    )
  }

  switchToRegister() {
    this.rootService.showingRegister = true;
  }

}
