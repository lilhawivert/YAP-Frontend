import { Component } from '@angular/core';
import { User, UserService } from '../user.service';
import { Router } from '@angular/router';

export interface Chat {
  user: User;
  lastDM: string;
}


@Component({
  selector: 'app-dms',
  templateUrl: './dms.component.html',
  styleUrl: './dms.component.css'
})
export class DmsComponent {


  public loading: boolean = false;

  public chats: Chat[] = [];

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit() {
    this.loading = true;

    this.userService.getLastChats(localStorage.getItem("username")).subscribe((chats: Chat[]) => {
      this.chats = chats;
      console.log(this.chats)
      this.loading = false;
    })

  }

  onClickUsername(username: string) {
    this.router.navigate([username+"/dm"])
  }

}
