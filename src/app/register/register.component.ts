import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { UserService } from '../user.service';
import { RootService } from '../root.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  constructor(private userService: UserService, private rootService: RootService) {}

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
    this.rootService.showingRegister = false;
  }

}
